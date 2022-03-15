<script>
    import Vue from 'vue'
    import { debounce } from 'throttle-debounce'
    import Popper from '../../../src/utils/vue-popper'
    import { addClass, removeClass, on, off } from '../../../src/utils/dom'
    import { generateId } from '../../../src/utils/utils'
    export default {
        name: 'GTooltip',
        componentName: 'GTooltip',
        mixins: [Popper],
        props: {
            openDelay: {
                type: Number,
                default: 0
            },
            hideAfter: {
                type: Number,
                default: 0
            },
            disabled: Boolean,
            effect: {
                type: String,
                default: 'dark'
            },
            content: String,
            enterable: {
                type: Boolean,
                default: true
            },
            transition: {
                type: String,
                default: 'g-fade-in-linear'
            },
            tabindex: {
                type: Number,
                default: 0
            },
            custom: Object
        },
        data () {
            return {
                tooltipId: `g-tooltip-${generateId()}`,
                focusing: false,
                timeoutPending: null
            }
        },
        methods: {
            setExpectedState(state) {
                if (state === false) {
                    clearTimeout(this.timeoutPending)
                }
                this.expectedState = state
            },
            show() {
                this.setExpectedState(true)
                this.handleShowPopper()
            },
            hide() {
                this.setExpectedState(false)
                this.debounceClose()
            },
            handleFocus() {
                this.focusing = true
                this.show()
            },
            handleBlur() {
                this.focusing = false
                this.hide()
            },
            removeFocusing() {
                this.focusing = false
            },
            handleShowPopper() {
                if (!this.expectedState || this.manual) return
                clearTimeout(this.timeout)
                this.timeout = setTimeout(() => {
                    this.showPopper = true
                }, this.openDelay)

                if (this.hideAfter > 0) {
                    this.timeoutPending = setTimeout(() => {
                    this.showPopper = false
                    }, this.hideAfter)
                }
            },
            handleClosePopper() {
                if (this.enterable && this.expectedState || this.manual) return
                clearTimeout(this.timeout)

                if (this.timeoutPending) {
                    clearTimeout(this.timeoutPending)
                }
                this.showPopper = false

                if (this.disabled) {
                    this.doDestroy()
                }
            },
        },
        beforeCreate () {
            this.popperVM = new Vue({
                data: { node: '' },
                render(h) {
                    return this.node
                }
            }).$mount()
            this.debounceClose = debounce(200, () => this.handleClosePopper())
        },
        mounted () {
            this.referenceElm = this.$el
            if (this.$el.nodeType === 1) {
                
                this.$el.setAttribute('aria-describedby', this.tooltipId)
                this.$el.setAttribute('tabindex', this.tabindex)
                on(this.referenceElm, 'mouseenter', this.show)
                on(this.referenceElm, 'mouseleave', this.hide)
                on(this.referenceElm, 'focus', () => {
                    if (!this.$slots.default || !this.$slots.default.length) {
                        this.handleFocus()
                        return
                    }
                    const instance = this.$slots.default[0].componentInstance
                    if (instance && instance.focus) {
                        instance.focus()
                    } else {
                        this.handleFocus()
                    }
                })
                on(this.referenceElm, 'blur', this.handleBlur)
                on(this.referenceElm, 'click', this.removeFocusing)
            }
            if (this.value && this.popperVM) {
                this.popperVM.$nextTick(() => {
                    if (this.value) {
                    this.updatePopper()
                    }
                })
            }
        },
        beforeDestroy() {
            this.popperVM && this.popperVM.$destroy()
        },
        destroyed() {
            const reference = this.referenceElm
            if (reference.nodeType === 1) {
                off(reference, 'mouseenter', this.show)
                off(reference, 'mouseleave', this.hide)
                off(reference, 'focus', this.handleFocus)
                off(reference, 'blur', this.handleBlur)
                off(reference, 'click', this.removeFocusing)
            }
        },
        render(h) {
            if (this.popperVM) {
                this.popperVM.node = (
                    <transition name={ this.transition } onAfterLeave={ this.doDestroy }>
                        <div ref="popper" class="g-tooltip__popper" 
                            class={[
                                'g-tooltip__popper',
                                'is-' + this.effect,
                                'g-tooltip__' + this.placement
                            ]}
                            id={ this.tooltipId }
                            v-show={!this.disabled && this.showPopper}
                            onMouseleave={ () => { this.setExpectedState(false); this.debounceClose() } }
                            onMouseenter={ () => this.setExpectedState(true) }>
                            { this.$slots.content || this.content }
                            {
                                <div class={['popper-arrow','g-tooltip--' + this.placement]}></div>
                            }
                        </div>
                    </transition>
                )
            }
            return this.$slots.default
        },
        watch: {
            focusing(val) {
                if (val) {
                    addClass(this.referenceElm, 'focusing');
                } else {
                    removeClass(this.referenceElm, 'focusing');
                }
            }
        },
    }
</script>

<!-- <script>
import dom from '../../../src/mixins/dom'
export default {
    name: 'GTooltip',
    componentName: 'GTooltip',
    props: {
        content: String,
        custom: Object,
        always: Boolean,
        effect: {
            type: String,
            default: 'dark'
        },
        placement: {
            type: String,
            default: 'top'
        },
        // rows: Number,
        width: {
            type: String,
            default: '150px'
        },
        delay: {
            type: Number,
            default: 300
        }
    },
    data() {
        return {
            tooltip: '',
            clearTime: ''
        }
    },
    mixins: [dom],
    methods: {
        _createElement() {
            // 创建相关节点
            let className = this.className ? ' ' + this.className : ''
            // body下创建节点
            this.tooltip = document.createElement('div')
            this.tooltip.className = 'g-tooltip ' + 'g-tooltip--' + this.placement
            this.tooltip.style.width = this.width
            if (!this.content) return false
            if (this.custom) {
                for (let key in this.custom) {
                    this.tooltip.style[key] = this.custom[key]
                }
                 if (this.custom['background']) {
                    this.tooltip.className += ' g-tooltip--custom'
                }
            }

            this.tooltip.innerHTML = this.content
            document.body.appendChild(this.tooltip)
            // 获取当前标签的偏移位置
            let offset = this.getOffset(this.$el)
            let windowWidth = this.getWindow().width

            let style = this.tooltip.style
            const space = 8 // 当前标签与提示语之间的间距
            switch (this.placement) {
                case 'top-start':
                    style.left = offset.left + 'px'
                    style.top = (offset.top - this.tooltip.offsetHeight - space) + 'px'
                    if (this.custom && this.custom['background']) {
                        document.styleSheets[0].addRule(`.g-tooltip--${this.placement}::before`, `border-top-color:${this.custom['background']}!important`)
                    }
                    break
                case 'top':
                    // 先让提示左边和当前标签中间对齐（偏移位置+标签宽的一半），再向左移50%
                    style.transform = 'translateX(-50%)'
                    style.left = this._translate(offset.left + offset.width / 2) + 'px'
                    style.top = (offset.top - this.tooltip.offsetHeight - space) + 'px'
                    if (this.custom && this.custom['background']) {
                        document.styleSheets[0].addRule(`.g-tooltip--${this.placement}::before`, `border-top-color:${this.custom['background']}!important`)
                    }
                    break
                case 'top-end':
                    style.right = windowWidth - (offset.left + offset.width) + 'px'
                    style.top = (offset.top - this.tooltip.offsetHeight - space) + 'px'
                    if (this.custom && this.custom['background']) {
                        document.styleSheets[0].addRule(`.g-tooltip--${this.placement}::before`, `border-top-color:${this.custom['background']}!important`)
                    }
                    break
                case 'left':
                    // top先让提示语顶部跟标签中间对齐，再上移50%
                    style.right = windowWidth - (offset.left - space) + 'px'
                    style.top = this._translate(offset.top + offset.height / 2) + 'px'
                    style.transform = 'translateY(-50%)'
                    if (this.custom && this.custom['background']) {
                        document.styleSheets[0].addRule(`.g-tooltip--${this.placement}::before`, `border-left-color:${this.custom['background']}!important`)
                    }
                    break
                case 'right':
                    // top和左边一样
                    style.left = offset.left + offset.width + space + 'px'
                    style.top = this._translate(offset.top + offset.height / 2) + 'px'
                    style.transform = 'translateY(-50%)'
                    if (this.custom && this.custom['background']) {
                        document.styleSheets[0].addRule(`.g-tooltip--${this.placement}::before`, `border-right-color:${this.custom['background']}!important`)
                    }
                    break
                case 'bottom-start':
                    style.left = offset.left + 'px'
                    style.top = offset.top + offset.height + space + 'px'
                    if (this.custom && this.custom['background']) {
                        document.styleSheets[0].addRule(`.g-tooltip--${this.placement}::before`, `border-bottom-color:${this.custom['background']}!important`)
                    }
                    break
                case 'bottom':
                    style.left = this._translate(offset.left + offset.width / 2) + 'px'
                    style.transform = 'translateX(-50%)'
                    style.top = offset.top + offset.height + space + 'px'
                    if (this.custom && this.custom['background']) {
                        document.styleSheets[0].addRule(`.g-tooltip--${this.placement}::before`, `border-bottom-color:${this.custom['background']}!important`)
                    }
                    break
                case 'bottom-end':
                    style.right = windowWidth - (offset.left + offset.width) + 'px'
                    // style.transform = 'translateX(-100%)'
                    style.top = offset.top + offset.height + space + 'px'
                    if (this.custom && this.custom['background']) {
                        document.styleSheets[0].addRule(`.g-tooltip--${this.placement}::before`, `border-bottom-color:${this.custom['background']}!important`)
                    }
                    break
            }
        },
        _mouseEnter() {
            if (!this.always) {
                // 如果存在先移除，避免重复创建
                if (this.tooltip) {
                    clearTimeout(this.clearTime)
                    document.body.removeChild(this.tooltip)
                    this.tooltip = ''
                }
                this._createElement()
                this.tooltip.addEventListener('mouseenter', this._tooltipMouseEnter, false)
                this.tooltip.addEventListener('mouseleave', this._tooltipMouseLeave, false)
            }
        },
        _mouseLeave() {
            if (!this.always) {
                this._removeChild()
            }
        },
        _tooltipMouseEnter() {
            // 鼠标移到提示文字上面时，清除延时时间
            clearTimeout(this.clearTime)
        },
        _tooltipMouseLeave() {
            // 鼠标从提示语上移开时
            this._removeChild()
        },
        _removeChild() {
            this.clearTime = setTimeout(() => {
                if (this.tooltip) {
                    document.body.removeChild(this.tooltip)
                    this.tooltip = ''
                }
            }, this.delay)
        },
        _translate (px) {
            // 通过transform平移标签时，如平移的单位为非偶数，会出现字体模糊，这里强制取偶
            if (parseInt(px) % 2 === 0) {
                // 偶数
                return parseInt(px)
            } else {
                return parseInt(px) + 1
            }
        }
    },
    mounted() {
        if (this.always) {
            // 一直显示
            this._createElement()
        }
        this.$el.addEventListener('mouseenter', this._mouseEnter, false)
        this.$el.addEventListener('mouseleave', this._mouseLeave, false)
    },
    destroyed() {
        this.$el.addEventListener('mouseenter', this._mouseEnter, false)
        this.$el.addEventListener('mouseleave', this._mouseLeave, false)
        if (this.tooltip) {
            document.body.removeChild(this.tooltip)
            this.tooltip = ''
        }
    },
    render (h) {
        return this.$slots.default
    }
}
</script>
<style lang="scss" scoped>
    
</style> -->