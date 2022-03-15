<template>
    <li class="g-select-dropdown__item"
        :class="[{
            'is-disabled': disabled || groupDisabled,
            'is-selected': itemSelected
        }]"
        v-show="visible"
        @mouseenter="hoverItem"
        @click.stop="selectOptionClick"
    >
        <slot>
            <span>{{ currentLabel }}</span>
        </slot>
    </li>
</template>
<script>
    import Emitter from '../../../src/mixins/emitter'
    import { getValueByPath, escapeRegexpString } from '../../../src/utils/utils'
    export default {
        name: 'GOption',
        componentName: 'GOption',
        mixins: [Emitter],
        inject: {
            GSelect: {
                default: ''
            }
        },
        props: {
            value: {
                required: true
            },
            label: [String, Number],
            disabled: Boolean,
            created: Boolean
        },
        data() {
            return {
                visible: true,
                groupDisabled: false
            }
        },
        computed: {
            isObject() {
                return Object.prototype.toString.call(this.value).toLowerCase() === '[object object]'
            },
            currentLabel() {
                return this.label || (this.isObject ? '' : this.value)
            },
            currentValue() {
                
                return this.value || this.label || '';
            },
            itemSelected() {
                if (!this.GSelect.multiple) {
                    return this.isEqual(this.value, this.GSelect.value)
                } else {
                    return this.contains(this.GSelect.value, this.value)
                }
            }
        },
        methods: {
            isEqual(a, b) {
                if (!this.isObject) {
                    return a === b
                } else {
                    const valueKey = this.GSelect.valueKey
                    return getValueByPath(a, valueKey) === getValueByPath(b, valueKey)
                }
            },
            // 给hover的item添加标识
            hoverItem() {
                if (!this.disabled && !this.groupDisabled) {
                    this.GSelect.hoverIndex = this.GSelect.options.indexOf(this);
                }
            },
            // 选择当前item，并传给父组件
            selectOptionClick() {
                if (!this.disabled && !this.groupDisabled) {
                    this.dispatch('GSelect', 'handleOptionClick', [this, true])
                }
            },
            contains(arr = [], target) {
                if (!this.isObject) {
                    return arr && arr.indexOf(target) > -1
                } else {
                    const valueKey = this.GSelect.valueKey
                    return arr && arr.some(item => {
                        return getValueByPath(item, valueKey) === getValueByPath(target, valueKey)
                    })
                }
            },
            // 查询
            queryChange(query) {
                this.visible = new RegExp(escapeRegexpString(query), 'i').test(this.currentLabel) || this.created
                if (!this.visible) this.GSelect.filteredOptionsCount--
            },
            // 父组件option-group设置disabled属性
            handleGroupDisabled(val) {
                this.groupDisabled = val
            }
        },
        watch: {
            currentLabel() {
                if (!this.created && !this.select.remote) this.dispatch('GSelect', 'setSelected');
            },
            value(newVal, oldVal) {
                const { remote, valueKey } = this
                if (!this.created && !remote) {
                    if (valueKey && typeof newVal === 'object' && typeof oldVal === 'object' && val[valueKey] === oldVal[valueKey]) return
                }
                this.dispatch('GSelect', 'setSelected')
            }
        },
        created() {
            this.GSelect.options.push(this)
            this.GSelect.cachedOptions.push(this)
            this.GSelect.optionsCount++
            this.GSelect.filteredOptionsCount++

            this.$on('queryChange', this.queryChange)
            this.$on('handleGroupDisabled', this.handleGroupDisabled)
        },
        beforeDestroy() {
            const { selected, multiple } = this.GSelect
            let selectedOptions = multiple ? selected : [selected]
            let index = this.GSelect.cachedOptions.indexOf(this)
            let selectedIndex = selectedOptions.indexOf(this)

            if (index > -1 && selectedIndex < 0) {
                this.GSelect.cachedOptions.splice(index, 1)
            }
            this.GSelect.onOptionDestroy(this.GSelect.options.indexOf(this))
        }
    }
</script>
<style scoped></style>