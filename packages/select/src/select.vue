<template>
    <div class="g-select"
        :class="[selectSize ? `g-select--${selectSize}` : '']"
        :style="{'width': width}"
        @click.stop="toggleMenu"
        v-clickoutside="handleClose"
        >
        <div class="g-select__tags" v-if="multiple" ref="tags" :style="{ 'max-width': inputWidth - 32 + 'px', width: '100%' }">
            <span v-if="collapseTags && selected.length">
                <g-tag :closable="!selectDisabled"
                    :size="collapseTagSize"
                    :noborder="selected[0].borderState"
                    type="info"
                    @close="deleteTag($event, selected[0])">
                    <span class="g-select__tags-text">{{ selected[0].currentLabel }}</span>
                </g-tag>
                <g-tag v-if="selected.length > 1"
                    :closable="false"
                    :size="collapseTagSize"
                    type="info">
                    <span class="g-select__tags-text">{{ selected.length - 1 }}</span>
                </g-tag>
            </span>
            <transition-group @after-leave="resetInputHeight" v-if="!collapseTags">
                <g-tag v-for="item in selected"
                    :key="getValueKey(item)"
                    :closable="!selectDisabled"
                    :size="collapseTagSize"
                    :noborder="item.borderState"
                    type="info"
                    @close="deleteTag($event, item)">
                    <span class="g-select__tags-text">{{ item.currentLabel }}</span>
                </g-tag>
            </transition-group>
            <input 
                type="text"
                class="g-select__input"
                :class="[selectSize ? `is-${selectSize}` : '']"
                :disabled="selectDisabled"
                @focus="handleFocus"
                @blur="softFocus=false"
                v-model="query"
                @input="debouncedQueryChange"
                @keyup="managePlaceholder"
                @keydown="resetInputState"
                @keydown.down.prevent="navigateOptions('next')"
                @keydown.up.prevent="navigateOptions('prev')"
                @keydown.tab="visible = false"
                @keydown.delete="deletePrevTag"
                @keydown.enter.prevent="selectOption"
                @keydown.esc.stop.prevent="visible = false"
                @compositionstart="handleComposition"
                @compositionupdate="handleComposition"
                @compositionend="handleComposition"
                v-if="filterable"
                :style="{ 'flex-grow': '1', width: inputLength / (inputWidth - 32) + '%', 'max-width': inputWidth - 42 + 'px' }"
                ref="input">
        </div>
        <g-input
            ref="reference"
            type="text"
            :class="{ 'is-focus': visible }"
            :tabindex="(multiple && filterable) ? '-1' : null"
            v-model="selectedLabel"
            :name="name"
            :size="selectSize"
            :placeholder="currentPlaceholder"
            :readonly="readonly"
            :disabled="disabled"
            @focus="handleFocus"
            @blur="handleBlur"
            @keyup.native="debouncedOnInputChange"
            @keydown.native.down.stop.prevent="navigateOptions('next')"
            @keydown.native.up.stop.prevent="navigateOptions('prev')"
            @keydown.native.enter.prevent="selectOption"
            @keydown.native.esc.stop.prevent="visible = false"
            @keydown.native.tab="visible = false"
            @paste.native="debouncedOnInputChange"
            @mouseenter.native="inputHovering = true"
            @mouseleave.native="inputHovering = false">
        >
            <template v-if="$slots.prefix">
                <slot name="prefix"></slot>
                <!-- <i class="g-input__icon" v-if="prefixIcon" :class="prefixIcon"></i> -->
            </template>
            <template slot="suffix">
                <i v-show="!showClose" :class="['g-select__caret', 'g-input__icon', 'g-icon-' + iconClass, selectSize ? `g-icon--${size}` : '']"></i>
                <i v-if="showClose" class="g-select__caret g-input__icon g-icon-circle-close" @click="handleClearClick"></i>
            </template>
        </g-input>
        <transition name="g-select-fade">
            <g-select-menu
                ref="popper"
                v-show="visible"
            >
                <g-scrollbar
                    tag="ul"
                    wrap-class="g-select-dropdown__wrap"
                    view-class="g-select-dropdown__list"
                    ref="scrollbar"
                    v-show="options.length > 0 && !loading">
                    <g-option :value="query" v-if="showNewOption"></g-option>
                    <slot></slot>
                </g-scrollbar>
            </g-select-menu>
        </transition>
    </div>
</template>
<script>
    import GInput from '../../input/index'
    import GSelectMenu from './select-dropdown'
    import GOption from './option'
    import GTag from '../../tag/index'
    import GScrollbar from '../../scrollbar/index'
    import Emitter from '../../../src/mixins/emitter'
    import { debounce } from 'throttle-debounce'
    import { valueEquals } from '../../../src/utils/utils'
    import Clickoutside from '../../../src/utils/clickoutside'
    import { addResizeListener, removeResizeListener } from '../../../src/utils/resize-event'
    import scrollIntoView from '../../../src/utils/scroll-into-view'
    import { getValueByPath } from '../../../src/utils/utils'
    import { isKorean  } from '../../../src/utils/shared'
    export default {
        name: 'GSelect',
        componentName: 'GSelect',
        directives: { Clickoutside },
        mixins: [Emitter],
        inject: {
            GForm: {
                default: ''
            },
            GFormItem: {
                default: ''
            }
        },
        provide() {
            return {
                GSelect: this
            }
        },
        components: {
            GInput,
            GSelectMenu,
            GOption,
            GTag,
            GScrollbar,
        },
        props: {
            name: String,
            size: String,
            disabled: Boolean,
            clearable: Boolean,
            width: String,
            placeholder: String,
            multiple: Boolean,
            multipleLimit: {
                type: Number,
                default: 0
            },
            loading: Boolean,
            filterable: Boolean,
            allowCreate: Boolean,
            value: {
                required: true
            },
            valueKey: {
                type: String,
                default: 'value'
            },

            collapseTags: Boolean,
            remoteMethod: Function,
            filterMethod: Function,
        },
        computed: {
            _gFormItemSize() {
                return (this.GFormItem || {}).gFormItemSize
            },
            selectSize() {
                return this.size || this._gFormItemSize
            },
            readonly() {
                return !this.filterable || this.multiple
            },
            iconClass() {
                return this.filterable ? '' : (this.visible ? 'arrow-up is-reverse' : 'arrow-up')
            },
            showClose() {
                let hasValue = this.multiple
                ? Array.isArray(this.value) && this.value.length > 0
                : this.value !== undefined && this.value !== null && this.value !== ''
                let criteria = this.clearable && !this.selectDisabled && this.inputHovering && hasValue
                return criteria
            },
            selectDisabled() {
                return this.disabled || (this.GForm || {}).disabled
            },
            debounce() {
                return this.remote ? 300 : 0;
            },
            showNewOption() {
                let hasExistingOption = this.options.filter(option => !option.created)
                    .some(option => option.currentLabel === this.query)
                return this.filterable && this.allowCreate && this.query !== '' && !hasExistingOption
            },
            collapseTagSize() {
                return ['small', 'mini'].indexOf(this.selectSize) > -1 
                    ? 'mini'
                    : 'small'
            }
        },
        data() {
            return {
                selectedLabel: '', // 选择的label
                selected: this.multiple ? [] : {},
                currentPlaceholder: '', // 当前的占位内容
                inputHovering: false, // 鼠标是否在input框中
                visible: false, // 
                options: [], // option的数组
                cachedOptions: [],
                optionsCount: 0, 
                filteredOptionsCount: 0, 
                inputWidth: 0, // input的宽
                initialInputHeight: 0,
                query: '',
                isSilentBlur: false, // 是否获焦
                softFocus: false,
                hoverIndex: -1,
                previousQuery: null,
                isOnComposition: false
            }
        },
        methods: {
            handleComposition(event) {
                const text = event.target.value;
                if (event.type === 'compositionend') {
                    this.isOnComposition = false;
                    this.$nextTick(_ => this.handleQueryChange(text));
                } else {
                    const lastCharacter = text[text.length - 1] || '';
                    this.isOnComposition = !isKorean(lastCharacter);
                }
            },
            handleClearClick(event) {
                this.deleteSelected(event)
            },
            // 清空label事件
            deleteSelected(event) {
                event.stopPropagation();
                const value = this.multiple ? [] : ''
                this.$emit('input', value)
                this.emitChange(value)
                this.visible = false
                this.$emit('clear')
            },
            // 广播change事件
            emitChange(val) {
                if (!valueEquals(this.value, val)) {
                    this.$emit('change', val)
                }
            },
            // 手动关闭控制
            handleClose() {
                this.visible = false;
            },
            // 控制列表的显示和隐藏
            toggleMenu() {
                if (!this.selectDisabled) {
                    if (this.menuVisibleOnFocus) {
                        this.menuVisibleOnFocus = false;
                    } else {
                        this.visible = !this.visible;
                    }
                    if (this.visible) {
                        (this.$refs.input || this.$refs.reference).focus();
                    }
                }
            },
            managePlaceholder() {
                if (this.currentPlaceholder !== '') {
                    this.currentPlaceholder = this.$refs.input.value ? '' : this.cachedPlaceHolder;
                }
            },
            resetInputWidth() {
                this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width
            },
            // 重置input的width
            handleResize() {
                this.resetInputWidth()
            },
            // 重置高度
            resetInputHeight() {
                if (this.collapseTags && !this.filterable) return
                this.$nextTick(() => {
                    if (!this.$refs.reference) return
                    let inputChildNodes = this.$refs.reference.$el.childNodes
                    let input = [].filter.call(inputChildNodes, item => item.tagName === 'INPUT')[0]
                    const tags = this.$refs.tags
                    const sizeInMap = this.initialInputHeight || 40
                    input.style.height = this.selected.length === 0
                        ? sizeInMap + 'px'
                        : Math.max(
                            tags ? (tags.clientHeight + (tags.clientHeight > sizeInMap ? 6 : 0)) : 0,
                            sizeInMap
                        ) + 'px'
                    if (this.visible) {
                        this.broadcast('GSelectDropdown', 'updatePopper')
                    }
                })
            },
            // 重置输入框的状态
            resetInputState(e) {
                if (e.keyCode != 8) this.toggleLasOptionBorderState(false)
                this,inputLength = this.$refs.input.value.length * 15 + 20
                this.resetInputHeight() 
            },
            // 获取指定值在数组中的索引
            getValueIndex(arr = [], value) {
                const isObject = Object.prototype.toString.call(value).toLowerCase() === '[object object]'
                if (!isObject) {
                    return arr.indexOf(value)
                } else {
                    const valueKey = this.valueKey
                    let index = -1
                    arr.some((item, i) => {
                        if (getValueByPath(item, valueKey) === getValueByPath(value, valueKey)) {
                            index = i
                            return true
                        }
                        return false
                    })
                    return index
                }
            },
            // 点击option的方法，由option组件传入监听
            handleOptionSelect(option, byClick) {
                if (this.multiple) {
                    const value = (this.value || []).slice()
                    const optionIndex = this.getValueIndex(value, option.value)
                    if (optionIndex > -1) {
                        value.splice(optionIndex, 1)
                    } else if (this.multipleLimit <= 0 || value.length < this.multipleLimit) {
                        value.push(option.value)
                    } 
                    this.$emit('input', value)
                    this.emitChange(value)
                    if (option.created) {
                        this.query = ''
                        this.handleQueryChange('')
                        this.inputLength = 20
                    }
                    if (this.filterable) this.$refs.input.focus()
                } else {
                    this.$emit('input', option.value)
                    this.emitChange(option.value)
                    this.visible = false
                }
                this.isSilentBlur = byClick
                this.setSoftFocus()
                if (this.visible) return
                this.$nextTick(() => {
                    this.scrollToOption(option)
                })
            },
            // target对象获取焦点
            setSoftFocus() {
                this.softFocus = true
                const input = this.$refs.input || this.$refs.reference
                if (input) {
                    input.focus()
                }
            },
            // 获焦事件处理
            handleFocus(event) {
                if (!this.softFocus) {
                    
                } else {
                    this.softFocus = false
                }
            },
            blur() {
                this.visible = false;
                this.$refs.reference.blur();
            },
            handleBlur(event) {
                setTimeout(() => {
                    if (this.isSilentBlur) {
                        this.isSilentBlur = false;
                    } else {
                        this.$emit('blur', event);
                    }
                }, 50);
                this.softFocus = false;
            },
            // 是选中的选项能在下拉框中的可是区域选择，一般在最后一个
            scrollToOption(option) {
                const target = Array.isArray(option) && option[0] ? option[0].$el : option.$el
                if (this.$refs.popper && target) {
                    const menu = this.$refs.popper.$el.querySelector('.g-select-dropdown__wrap')
                    scrollIntoView(menu, target)
                }
                this.$refs.scrollbar && this.$refs.scrollbar.handleScroll()
            },
            // 设置被选中的label
            setSelected() {
                if (!this.multiple) {
                    let option = this.getOption(this.value)
                    if (option.created) { // 新增标签
                        this.createdLabel = option.currentLabel
                        this.createdSelected = true
                    } else {
                        this.createdSelected = false
                    }
                    this.selectedLabel = option.currentLabel;
                    this.selected = option
                    if (this.filterable) this.query = this.selectedLabel
                    return
                }
                let result = []
                if (Array.isArray(this.value)) {
                    this.value.forEach(val => {
                        result.push(this.getOption(val))
                    })
                }
                this.selected = result;
                this.$nextTick(() => {
                    this.resetInputHeight()
                })
            },
            // 通过传入的value值获取到它的option
            getOption(value) {
                let option
                const isObject = Object.prototype.toString.call(this.value).toLowerCase() === '[object object]'
                const isNull = Object.prototype.toString.call(value).toLowerCase() === '[object null]'
                const isUndefined = Object.prototype.toString.call(value).toLowerCase() === '[object undefined]'

                for (let i = this.cachedOptions.length - 1; i >= 0; i--) {
                    const cachedOption = this.cachedOptions[i]
                    const isEqual = isObject ? getValueByPath(cachedOption.value, this.valueKey) === getValueByPath(value, this.valueKey)
                    : cachedOption.value === value
                    if (isEqual) {
                        option = cachedOption
                        break
                    }
                }
                if (option) return option
                const label = (!isObject && !isNull && !isUndefined) ? value : ''
                let newOption = {
                    value: value,
                    currentLabel: label
                }
                if (this.multiple) {
                    newOption.borderState = false
                }
                return newOption
            },
            onInputChange() {
                if (this.filterable && this.query !== this.selectedLabel) {
                    this.query = this.selectedLabel;
                    this.handleQueryChange(this.query);
                }
            },
            // 选择option
            selectOption() {
                if (!this.visible) {
                    this.toggleMenu()
                } else {
                    if (this.options[this.hoverIndex]) {
                        this.handleOptionSelect(this.options[this.hoverIndex])
                    }
                }
            },
            // 销毁option
            onOptionDestroy(index) {
                if (index > -1) {
                    this.optionsCount--
                    this.filteredOptionsCount--
                    this.options.splice(index, 1)
                }
            },
            // 处理`输入查询内容发生变化`的事件
            handleQueryChange(val) {
                if (this.previousQuery === val || this.isOnComposition) return
                if (this.previousQuery === null && (typeof this.filterMethod === 'function' || typeof this.remoteMethod === 'function')) {
                    this.previousQuery = val
                    return
                }
                this.previousQuery = val
                this.$nextTick(() => {
                    if (this.visible) this.broadcast('GSelectDropdown', 'updatePopper')
                })
                this.hoverIndex = -1
                if (this.multiple && this.filterable) {
                    this.$nextTick(() => {
                        const length = this.$refs.input.value.length * 15 + 20
                        this.inputLength = this.collapseTags ? Math.min(50, length) : length
                        this.managePlaceholder()
                        this.resetInputHeight()
                    })
                }
                if (this.remote && typeof this.remoteMethod === 'function') {
                    this.hoverIndex = -1
                    this.remoteMethod(val)
                } else if (typeof this.filterMethod === 'function') {
                    this.filterMethod(val)
                    this.broadcast('GOptionGroup', 'queryChange')
                } else {
                    this.filteredOptionsCount = this.optionsCount
                    this.broadcast('GOption', 'queryChange', val)
                    this.broadcast('GOptionGroup', 'queryChange')
                }
                if (this.defaultFirstOption && (this.filterable || this.remote) && this.filteredOptionsCount) {
                    this.checkDefaultFirstOption()
                }
            },
            // 高亮某个选项
            checkDefaultFirstOption() {
                this.hoverIndex = -1
                let hasCreated = false
                for (let i = this.options.length - 1; i >= 0; i--) {
                    if (this,options[i].created) {
                        hasCreated = true
                        this.hoverIndex = true
                        this.hoverIndex = i
                        break
                    }
                }
                if (hasCreated) return
                for (let i = 0; i != this.options.length; i++) {
                    const option = this.options[i]
                    if (this.query) {
                        if (!option.disabled && !option.groupDisabled && option.visible) {
                            this.hoverIndex = i
                            break
                        }
                    } else {
                        if (option.itemSelected) {
                            this.hoverIndex = i
                            break
                        }
                    }
                    
                }
            },
            // 删除多选标签
            deleteTag(event, tag) {
                event.stopPropagation()
                let index = this.selected.indexOf(tag)
                if (index > -1 && !this.selectDisabled) {
                    const value = this.value.slice()
                    value.splice(index, 1)
                    this.$emit('input', value)
                    this.emitChange(value)
                    this.$emit('remove-tag', tag.value)
                }
            },
            // 获取指定值的属性
            getValueKey(item) {
                if (Object.prototype.toString.call(item.value).toLowerCase() !== '[object object]') {
                    return item.value
                } else {
                    return getValueByPath(item.value, this.valueKey)
                }
            },
            // 在输入框按下del键时，删除光标前的一个tag
            deletePrevTag(e) {
                if (e.target.value.length <= 0 && !this.toggleLasOptionBorderState()) {
                    const value = this.value.slice()
                    value.pop()
                    this.$emit('input', value)
                    this.emitChange(value)
                }
            },
            // 返回tag不带border
            toggleLasOptionBorderState(isHit) {
                if (!Array.isArray(this.selected)) return
                const option = this.selected[this.selected.length - 1]
                if (!option) return

                if (isHit === true || isHit === false) {
                    option.borderState = isHit
                    return isHit
                }
                option.borderState = !option.borderState
                return option.borderState
            }
        },
        watch: {
            selectDisabled() {
                this.$nextTick(() => {
                    this.resetInputHeight()
                })
            },
            value(newVal, oldVal) {
                if (this.multiple) {
                    this.resetInputHeight()
                    if ((newVal && newVal.length > 0) || (this.$refs.input && query !== '')) {
                        this.currentPlaceholder = ''
                    } else {
                        this.currentPlaceholder = this.cachedPlaceHolder
                    }
                    if (this.filterable && !this.reserveKeyword) {
                        this.query = ''
                        this.handleQueryChange(this.query)
                    }
                }
                this.setSelected()
                if (!valueEquals(newVal, oldVal)) {
                    this.dispatch('GFormItem', 'el.form.change', newVal);
                }
            },
            visible(val) {
                if (!val) {
                    this.broadcast('GSelectDropdown', 'destroyPopper')
                    if (this.$refs.input) {
                        this.$refs.input.blur()
                    }
                    this.query = ''
                    this.previousQuery = null
                    this.selectedLabel = ''
                    this.inputLength = 20
                    this.menuVisibleOnFocus = false
                    
                    // this.resetHoverIndex()
                    this.$nextTick(() => {
                        if (this.$refs.input &&
                        this.$refs.input.value === '' &&
                        this.selected.length === 0) {
                            this.currentPlaceholder = this.cachedPlaceHolder;
                        }
                    })

                    if (!this.multiple) {
                        if (this.selected) {
                            if (this.filterable && this.allowCreate &&
                                this.createdSelected && this.createdLabel) {
                                this.selectedLabel = this.createdLabel;
                            } else {
                                this.selectedLabel = this.selected.currentLabel;
                            }
                            if (this.filterable) this.query = this.selectedLabel;
                        }
                        if (this.filterable) {
                            this.currentPlaceholder = this.cachedPlaceHolder;
                        }
                    }
                } else {
                    this.broadcast('GSelectDropdown', 'updatePopper')
                    if (this.filterable) {
                        this.query = this.remote ? '' : this.selectedLabel
                        this.handleQueryChange(this.query)
                        if (this.multiple) {
                            this.$refs.input.focus()
                        } else {
                            if (!this.remote) {
                                this.broadcast('GOption', 'queryChange')
                                this.broadcast('GOptionGroup', 'queryChange')
                            }

                            if (this.selectedLabel) {
                                this.currentPlaceholder = this.selectedLabel
                                this.selectedLabel = ''
                            }
                        }
                    }
                    this.$emit('visible-change', val)
                }
            },
            options() {
                if (this.$isServer) return

                this.$nextTick(() => {
                    this.broadcast('GSelectDropdown', 'updatePopper')
                })
                if (this.multiple) {
                    this.resetInputHeight()
                }
                let inputs = this.$el.querySelectorAll('input')
                if ([].indexOf.call(inputs, document.activeElement) === -1) {
                    this.setSelected()
                } 

                if (this.defaultFirstOption && (this.filterable || this.remote) && this.filteredOptionsCount) {
                    this.checkDefaultFirstOption()
                }
            }
        },
        created () {
            this.cachedPlaceHolder = this.currentPlaceholder = this.placeholder
            if (this.multiple && !Array.isArray(this.value)) this.$emit('input', [])
            if (!this.multiple && Array.isArray(this.value)) this.$emit('input', '')

            this.debouncedOnInputChange = debounce(this.debounce, () => {
                this.onInputChange()
            })
            this.debouncedOnInputChange = debounce(this.debounce, (e) => {
                console.log(this.debounce)
                
                this.handleQueryChange(e.target.value)
            })
            
            this.$on('handleOptionClick', this.handleOptionSelect)
            this.$on('setSelected', this.setSelected)
        },
        mounted () {
            if (this.multiple && Array.isArray(this.value) && this.value.length > 0) {
                this.currentPlaceholder = ''
            }
            addResizeListener(this.$el, this.handleResize)

            const reference = this.$refs.reference
            if (reference && reference.$el) {
                const sizeMap = {
                    medium: 36,
                    small: 32,
                    mini: 28
                }
                const input = reference.$el.querySelector('input')
                this.initialInputHeight = input.getBoundingClientRect().height || sizeMap[this.selectSize]
            }
            if (this.remote && this.multiple) {
                this.resetInputHeight();
            }
            this.$nextTick(() => {
                if (reference && reference.$el) {
                    this.inputWidth = reference.$el.getBoundingClientRect().width
                }
            })
            this.setSelected()
        }
    }
</script>