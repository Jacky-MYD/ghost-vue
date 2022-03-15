import objectAssign from '../../../../src/utils/merge'
import { NODE_KEY, getPropertyFromData, reInitChecked, getChildState } from './util'
import { arrayFindIndex } from '../../../../src/utils/utils'


let nodeIdSeed = 0
export default class Node {
    constructor(options) {
        this.id = nodeIdSeed++
        this.text = null
        this.checked = false
        this.indeterminate = false
        this.data = null
        this.expanded = false
        this.parent = null
        this.visible = true
        this.isCurrent = false

        
        for (let name in options) {
            if (options.hasOwnProperty(name)) {
                this[name] = options[name]
            }
        }

        // internal
        this.level = 0
        // this.loaded = false
        this.childNodes = []
        // this.loading = false

        if (this.parent) {
            this.level = this.parent.level + 1
        }

        const store = this.store
        if (!store) {
            throw new Error('[Node]store is required!')
        }
        store.registerNode(this)

        if (this.data) {
            this.setData(this.data)
            if (store.defaultExpandAll) this.expanded = true
        } else if (this.level > 0 && store.defaultExpandAll) {
            this.expand()
        }

        if (!this.data) return
        const defaultExpandedKeys = store.defaultExpandedKeys
        const key = store.key
        if (key && defaultExpandedKeys && defaultExpandedKeys.indexOf(this.key) !== -1) {
            this.expand(null, store.autoExpandParent)
        }
    }

    getChildren(forceInit = false) {
        if (this.level === 0) return this.data
        const data = this.data
        if (!data) return null

        const props = this.store.props
        let children = 'children'
        if (props) {
            children = props.children || 'children'
        }

        if (data[children] === undefined) data[children] = null

        if (forceInit && !data[children]) data[children] = []

        return data[children]
    }

    updateChildren() {
        const newData = this.getChildren() || []
        const oldData = this.childNodes.map((node) => node.data)

        const newDataMap = {}
        const newNodes = []

        newData.forEach((item, index) => {
            const key = item[NODE_KEY]
            const isNodexExists = !!key && arrayFindIndex(oldData, data => data[NODE_KEY] === key) >= 0

            if (isNodexExists) {
                newDataMap[key] = { index, data: item }
            } else {
                newNodes.push({ index, data: item })
            }
        })
        newNodes.forEach(({index, data }) => {
            this.insertChild({ data }, index)
        })

    }

    expand(callback, expandParent) {
        const done = () => {
            if (expandParent) {
                let parent = this.parent
                while(parent.level > 0) {
                    parent.expanded = true
                    parent = parent.parent
                }
            }
            this.expanded = true
            if(callback) callback()
        }
        done()
    }

    collapse() {
        this.expanded = false
    }

    setData(data) {
        this.data = data
        this.childNodes = []

        let children
        if (this.level === 0 && this.data instanceof Array) {
            children = this.data
        } else {
            children = getPropertyFromData(this, 'children') || []
        }
        for (let i = 0; i < children.length; i++) {
            this.insertChild({ data: children[i] })
        }
    }

    setChecked(value, deep, recursion, passValue) {
        this.indeterminate = value === 'half'
        this.checked = value === true
        if (this.store.checkStrictly) return

        
        let { all, allWithoutDisable } = getChildState(this.childNodes)
        if (!all && allWithoutDisable) {
            this.checked = false
            value = false
        }
        if (deep) {
            const childNodes = this.childNodes
            
            for (let i = 0, len = childNodes.length; i < len; i++) {
                const child = childNodes[i]   
                passValue = passValue || value !== false
                const isCheck = child.disabled ? child.checked : passValue
                child.setChecked(isCheck, deep, true, passValue)         
            }
            const { all , half } = getChildState(childNodes)
            if (!all) {
                this.checked = all
                this.indeterminate = half
            }
        }
        
        const parent = this.parent
        
        if (!parent || parent.level === 0) return
        
        if (!recursion) reInitChecked(parent)
    }

    insertChild(child, index, batch) {
        if (!child) throw new Error('insertChild error: child is required.')

        if (!(child instanceof Node)) {
            if (!batch) {
                const children = this.getChildren(true);
                if (children.indexOf(child.data) === -1) {
                    if (typeof index === 'undefined' || index < 0) {
                        children.push(child.data);
                    } else {
                        children.splice(index, 0, child.data)
                    }
                }
            }
            objectAssign(child, {
                parent: this,
                store: this.store
            });
            
            child = new Node(child)
        }
      
        child.level = this.level + 1
      
        if (typeof index === 'undefined' || index < 0) {
            this.childNodes.push(child);
        } else {
            this.childNodes.splice(index, 0, child)
        }
    }
    get key() {
        const nodeKey = this.store.key;
        if (this.data) return this.data[nodeKey];
        return null;
    }

    get label() {
        return getPropertyFromData(this, 'label')
    }

    get disabled() {
        return getPropertyFromData(this, 'disabled');
    }
}