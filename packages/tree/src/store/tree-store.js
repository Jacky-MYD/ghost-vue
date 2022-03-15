import Node from './node'
export default class TreeStore {
    constructor(options) {
        this.currentNode = null
        this.currentNodeKey = null

        for (let option in options) {
            if (options.hasOwnProperty(option)) {
                this[option] = options[option]
            }
        }

        this.nodesMap = {}

        this.root = new Node({
            data: this.data,
            store: this
        })
        this._initDefaultCheckedNodes()
    }

    registerNode(node) {
        const key = this.key
        if (!key || !node || !node.data) return
        const nodeKey = node.key
        if (nodeKey !== undefined) this.nodesMap[node.key] = node
    }

    _initDefaultCheckedNodes() {
        const defaultCheckedKeys = this.defaultCheckedKeys || []
        const nodesMap = this.nodesMap

        defaultCheckedKeys.forEach((checkedKey) => {
            const node = nodesMap[checkedKey]
            if (node) {
                node.setChecked(true, !this.checkStrictly)
            }
        })
    }

    setCurrentNode(currentNode) {
        const prevCurrentNode = this.currentNode
        if (prevCurrentNode) prevCurrentNode.isCurrent = false

        this.currentNode = currentNode
        this.currentNode.isCurrent = true
    }

    setData(newVal) {
        const instanceChanged = newVal !== this.root.data
        if (instanceChanged) {
            this.root.setData(newVal)
            this._initDefaultCheckedNodes()
        } else {
            this.root.updateChildren()
        }
    }

    getCheckedNodes(includeHalfChecked = false) {
        const checkedNodes = []
        const traverse = (node) => {
            const childNodes = node.root ? node.root.childNodes : node.childNodes
            childNodes.forEach(child => {
                if (child.checked || (includeHalfChecked && child.indeterminate)) {
                    checkedNodes.push(child.data)
                }
                traverse(child)
            })
        }
        traverse(this)
        return checkedNodes
    }

    getCheckedKeys() {
        return this.getCheckedNodes().map((data) => (data || {})[this.key])
    }

    getHalfCheckedNodes() {
        const nodes = []
        const traverse = (node) => {
            const childNodes = node.root ? node.root.childNodes : node.childNodes
            childNodes.forEach(child => {
                if (child.indeterminate) {
                    nodes.push(child.data)
                }
                traverse(child)
            })
        }
        traverse(this)
        return nodes
    }

    getHalfCheckedKeys() {
        return this.getHalfCheckedNodes().map((data) => (data || {})[this.key])
    }
}