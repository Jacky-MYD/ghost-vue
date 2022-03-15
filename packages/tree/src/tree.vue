<template>
    <div class="g-tree">
            <g-tree-item 
                v-for="child in root.childNodes"
                :node="child"
                :iconType="iconType"
                :key="getNodeKey(child)"
                :showCheckbox="showCheckbox">
            </g-tree-item>
    </div>
</template>
<script>
    import TreeStore from './store/tree-store'
    import GTreeItem from './treeItem'
    import { getNodeKey } from './store/util'
    export default {
        name: 'GTree',
        componentName: 'GTree',
        components: {
            GTreeItem
        },
        props: {
            data: Array,
            nodeKey: String,
            currentNodeKey: [String, Number],
            defaultExpandAll: Boolean,
            defaultExpandedKeys: Array,
            defaultCheckedKeys: Array,
            checkStrictly: Boolean,
            showCheckbox: Boolean,
            iconType: {
                type: String,
                default: 'default' // square | default
            },
            autoExpandParent: {
                type: Boolean,
                default: true
            },
            props: {
                default() {
                    return {
                        children: 'children',
                        label: 'label',
                        disabled: 'disabled'
                    }
                }
            },
        },
        computed: {
            
        },
        data () {
            return {
                root: null
            }
        },
        methods: {
            getNodeKey(node) {
                return getNodeKey(this.nodeKey, node.data);
            },
        },
        created () {
            this.rootTree = true
            this.store = new TreeStore({
                key: this.nodeKey,
                data: this.data,
                props: this.props,
                checkStrictly: this.checkStrictly,
                currentNodeKey: this.currentNodeKey,
                defaultExpandAll: this.defaultExpandAll,
                defaultExpandedKeys: this.defaultExpandedKeys,
                defaultCheckedKeys: this.defaultCheckedKeys,
                autoExpandParent: this.autoExpandParent
            })
            this.root = this.store.root
        }, 
        watch: {
            data (newVal) {
                this.store.setData(newVal)
            }
        }
    }
</script>