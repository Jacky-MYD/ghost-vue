<template>
    <div class="g-tree-item" >
        <div class="g-tree-item__content" 
            :class="{
                'is-current': isCurrent,
                'is-disabled': node.disabled
            }"  
            @click.stop="handleClick($el, node)">
            <span class="g-tree-icon">
                <i 
                    :class="[
                        iconTypeClass,
                        `g-tree-icon-${iconType}`
                    ]" 
                    v-if="hasChild"></i>
                <i style="display:inline-block;height: 20px;width: 12px;" v-else></i>
            </span>
            <i 
                class="g-tree-icon g-tree-icon-checkbox" 
                :class="[
                    checkboxClass,
                    {
                        'is-disabled': node.disabled
                    }
                ]" 
                v-show="showCheckbox"
                @click.stop="handleSelect(node)"></i>
            <span>{{ node.label }}</span>
        </div>
        <transition name="g-tree-fade" v-if="hasChild">
            <div class="g-tree-item__children">
                <g-tree-item 
                    v-for="child in node.childNodes"
                    :node="child"
                    :iconType="iconType"
                    :key="getNodeKey(child)"
                    :showCheckbox="showCheckbox">
                </g-tree-item>
            </div>
        </transition>
    </div>
</template>
<script>
    import { addClass, removeClass, hasClass } from '../../../src/utils/dom'
    import { getNodeKey } from './store/util'
    export default {
        name: 'GTreeItem',
        componentName: 'GTreeItem',
        props: {
            node: {
                default() {
                    return {}
                }
            }, 
            iconType: String,
            disabled: Boolean,
            showCheckbox: Boolean
        },
        computed: {
            iconTypeClass() {
                return this.iconType === 'default' 
                ? this.expanded ? 'g-icon-bottom' : 'g-icon-right' 
                : this.expanded ? 'g-icon-remove-outline' : 'g-icon-plus-outline'
            },
            checkboxClass() {
                if (this.showCheckbox) {
                    if (!this.node.checked && this.node.indeterminate) {
                        return 'g-icon-half-select'
                    } else if (this.node.checked && !this.node.indeterminate) {
                        return 'g-icon-select'
                    }
                    if (this.node.checked) return 'g-icon-select'
                    return 'g-icon-no-select'
                }
                return 'g-icon-no-select'
            },
            hasChild() {
                return this.node.childNodes && this.node.childNodes.length > 0 ? true : false
            },
            isCurrent() {
                return this.node.isCurrent ? true : false
            },
        },
        data () {
            return {
                tree: null,
                expanded: false,
                oldChecked: null,
                oldIndeterminate: null
            }
        },
        methods: {
            getNodeKey(node) {
                return getNodeKey(this.tree.nodeKey, node.data)
            },

            handleClick(el, event) {
                const store = this.tree.store
                store.setCurrentNode(this.node)
                this.tree.currentNode = this

                this.handleExpandClick(el, store)

                this.tree.$emit('node-click', this.node.data, this.node, this)
            },

            handleSelect(event) {
                if (event.disabled) return
                this.node.setChecked(!event.checked, !this.checkStrictly)
                
                this.$nextTick(() => {
                    const store = this.tree.store
                    this.tree.$emit('check', this.node.data, {
                        checkedNodes: store.getCheckedNodes(),
                        checkedKeys: store.getCheckedKeys(),
                        halfCheckedNodes: store.getHalfCheckedNodes(),
                        halfCheckedKeys: store.getHalfCheckedKeys(),
                    })
                })
            },

            handleCheckChange(checked, indeterminate) {
                if (this.oldChecked !== checked && this.oldIndeterminate !== indeterminate) {
                    this.tree.$emit('check-change', this.node.data, checked, indeterminate)
                }
                this.oldChecked = checked
            },

            handleExpandClick(el, store) {
                if (this.node.expanded) {
                    this.$el.style.maxHeight = "28px"
                    this.tree.$emit('node-collapse', this.node.data, this.node, this)
                    this.node.collapse()
                } else {
                    this.$el.style.maxHeight = "500px"
                    this.tree.$emit('node-expand', this.node.data, this.node, this)
                    this.node.expand()
                }
            }
        },
        created () {
            const parent = this.$parent
            if (parent.rootTree) {
                this.tree = parent
            } else {
                this.tree = parent.tree
            }
            
            const tree = this.tree;
            if (!tree) {
                console.warn('Can not find node\'s tree.');
            }

            const props = tree.props || {}
            const childrenKey = props['children'] || 'children'
            this.$watch(`node.data.${childrenKey}`, () => {
                this.node.updateChildren()
            })

            
            if (this.node.expanded) {
                this.expanded = true
                this.$nextTick(() => {
                    this.$el.style.maxHeight = "500px"
                })
            }
        },
        watch: {
            'node.expanded'(val) {
                this.$nextTick(() => {
                    this.expanded = val
                })
            },

            'node.checked'(val) {
                this.handleCheckChange(val, this.node.indeterminate)
            },

            'node.indeterminate'(val) {
                this.handleCheckChange(this.node.checked, val);
            }
        }

    }
</script>