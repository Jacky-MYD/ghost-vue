import Pager from './pager'
import GSelect from '../../select'
import GOption from '../../option'
import GInput from '../../input'
import { valueEquals } from '../../../src/utils/utils'
export default {
    name: 'GPagination',
    componentName: 'GPagination',
    props: {
        total: Number,
        pageCount: Number,
        prevText: String,
        nextText: String,
        small: Boolean,
        background: Boolean,
        disabled: Boolean,
        customStyleObj: Object,
        pageSize: {
            type: Number,
            default: 10
        },
        pagerCount: {
            type: Number,
            validator(value) {
                return (value | 0) === value && value > 4 && value < 22 && (value % 2) === 1
            },
            default: 7
        },
        currentPage: {
            type: Number,
            default: 1
        },
        layout: {
            default: 'prev, pager, next, jumper, ->, total'
        },
        pageSizes: {
            type: Array,
            default() {
                return [10, 20, 30, 40, 50, 100];
            }
        },
    },
    data () {
        return {
            internalCurrentPage: 1,
            internalPageSize: 0,
            lastEmittedPage: -1,
            userChangePageSize: false
        }
    },
    render(h) {
        const layout = this.layout
        if (!layout) return null

        let template = <div class={['g-pagination', {
            'is-background': this.background,
            'is-small': this.small
        }]}></div>
        const TEMPLATE_MAP = {
            prev: <prev style={ this.customStyle }></prev>,
            jumper: <jumper></jumper>,
            pager: <pager customStyle={ this.customStyle } currentPage={ this.internalCurrentPage } pageCount={ this.internalPageCount } pagerCount={ this.pagerCount } disabled={ this.disabled } on-change={ this.handleCurrentChange }></pager>,
            next: <next style={ this.customStyle }></next>,
            sizes: <sizes pageSizes={ this.pageSizes }></sizes>,
            slot: <slot>{ this.$slots.default ? this.$slots.default : '' }</slot>,
            total: <total></total>
        }
        const components = layout.split(',').map((item) => item.trim())
        const rightWrapper = <div class="g-pagination__rightwrapper"></div>
        let haveRightWrapper = false

        template.children = template.children || []
        rightWrapper.children = rightWrapper.children || []
        components.forEach(compo => {
            if (compo === '->') {
                haveRightWrapper = true
                return
            }

            if (!haveRightWrapper) {
                template.children.push(TEMPLATE_MAP[compo])
            } else {
                rightWrapper.children.push(TEMPLATE_MAP[compo])
            }
        })

        if (haveRightWrapper) {
            template.children.unshift(rightWrapper)
        }

        return template
    },
    components: {
        Prev: {
            render(h) {
                return (
                    <button 
                        type="button"
                        class="page-btn btn-prev"
                        disabled={ this.$parent.disabled || this.$parent.internalCurrentPage <= 1 }
                        on-click={ this.$parent.prev }>
                        {
                            this.$parent.prevText
                            ? <span>{ this.$parent.prevText }</span>
                            : <i class="g-icon-arrow-prev"></i>
                        }
                    </button>
                )
            }
        },
        Next: {
            render(h) {
                return (
                    <button 
                        type="button"
                        class="page-btn btn-next"
                        disabled={ this.$parent.disabled || this.$parent.internalCurrentPage === this.$parent.internalPageCount || this.$parent.internalPageCount === 0 }
                        on-click={ this.$parent.next }>
                        {
                            this.$parent.nextText
                            ? <span>{ this.$parent.nextText }</span>
                            : <i class="g-icon-arrow-next"></i>
                        }
                    </button>
                )
            }
        },
        Sizes: {
            props: {
                pageSizes: Array
            },
            watch: {
                pageSizes: {
                    immediate: true,
                    handler(newVal, oldVal) {
                        if (valueEquals(newVal, oldVal)) return
                        if (Array.isArray(newVal)) {
                            this.$parent.internalPageSize = newVal.indexOf(this.$parent.pageSize) > -1
                            ? this.$parent.pageSize
                            : this.pageSizes[0]
                        }
                    }
                }
            },
            components: {
                GSelect,
                GOption
            },
            render(h) {
                return (
                    <span class="g-pagination__sizes">
                        <g-select
                            value={ this.$parent.internalPageSize }
                            size="mini"
                            disabled={ this.$parent.disabled }
                            on-input={ this.handlerChange }>
                            {
                                this.pageSizes.map((item, index) => 
                                    <g-option
                                        key={ index }
                                        value={ item }
                                        label={ item }>
                                    </g-option>
                                )
                            }
                        </g-select>
                    </span>
                )
            },
            methods: {
                handlerChange(val) {
                    if (val !== this.$parent.internalPageSize) {
                        this.$parent.internalPageSize = val = parseInt(val, 10)
                        this.$parent.userChangePageSize = true
                        this.$parent.$emit('update:pageSize', val)
                        this.$parent.$emit('size-change', val)
                    }
                }
            }
        },
        Jumper: {
            components: {
                GInput
            },
            data() {
                return {
                    userInput: null
                }
            },
            watch: {
                '$parent.internalCurrentPage'() {
                    this.userInput = null
                }
            },
            render(h) {
                return (
                    <span class="g-pagination__jump">
                        <g-input
                            type="number"
                            class=""
                            size="mini"
                            min={ 1 }
                            max={ this.$parent.internalPageCount }
                            width="50px"
                            value={ this.userInput !== null ? this.userInput : this.$parent.internalCurrentPage }
                            disabled={ this.$parent.disabled }
                            nativeOnKeyup={ this.handlerKeyup }
                            onChange={ this.handlerChange }
                            onInput={ this.handlerInput }>

                        </g-input>
                    </span>
                ) 
            },
            methods: {
                handlerKeyup({keyCode, target}) {
                    if (keyCode === 13) this.handlerChange(target.value)
                },
                handlerChange(val) {
                    this.$parent.internalCurrentPage = this.$parent.getValidCurrentPage(val)
                    this.$parent.emitChange()
                    this.userInput = null
                },
                handlerInput(val) {
                    this.userInput = val
                }
            }
        },
        Total: {
            render(h) {
                return (
                    typeof this.$parent.total === 'number'
                    ? <span class="g-pagination__total">{ this.$parent.total }</span>
                    : ''
                )
            }
        },
        Pager, 
    },
    computed: {
        internalPageCount() {
            if (typeof this.total === 'number') {
                return Math.max(1, Math.ceil(this.total / this.internalPageSize))
            } else if (typeof this.pageCount === 'number') {
                return Math.max(1, this.pageCount)
            }
            return null
        },
        customStyle() {
            return this.customStyleObj || {}
        }
    },
    methods: {
        prev() {
            if (this.disabled) return
            const newVal = this.internalCurrentPage - 1
            this.internalCurrentPage = this.getValidCurrentPage(newVal)
            this.$emit('prev-click', this.internalCurrentPage)
            this.emitChange()
        },
        next() {
            if (this.disabled) return
            const newVal = this.internalCurrentPage + 1
            this.internalCurrentPage = this.getValidCurrentPage(newVal)
            this.$emit('next-click', this.internalCurrentPage)
            this.emitChange()
        },
        getValidCurrentPage(val) {
            val = parseInt(val, 10)

            const havePageCount = typeof this.internalPageSize === 'number'

            let resetVal
            if (!havePageCount) {
                if (isNaN(val) || val < 1) resetVal = 1
            } else if (val > this.internalPageCount) {
                resetVal = this.internalPageCount
            }

            if (resetVal === undefined && isNaN(val)) {
                resetVal = 1
            } else if (resetVal === 0) {
                resetVal = 1
            }

            return resetVal === undefined ? val : resetVal
        },
        emitChange() {
            this.$nextTick(() => {
                if (this.internalCurrentPage !== this.lastEmittedPage || this.userChangePageSize) {
                  this.$emit('current-change', this.internalCurrentPage)
                  this.lastEmittedPage = this.internalCurrentPage
                  this.userChangePageSize = false
                }
            })
        },
        handleCurrentChange(val) {
            this.internalCurrentPage = this.getValidCurrentPage(val)
            this.userChangePageSize = true
            this.emitChange()
        }
    },
    watch: {
        currentPage: {
            immediate: true,
            handler(val) {
                this.internalCurrentPage = this.getValidCurrentPage(val)
            }
        },
        pageSize: {
            immediate: true,
            handler(val) {
                this.internalPageSize = isNaN(val) ? 10 : val
            }
        },
        internalCurrentPage: {
            immediate: true,
            handler(newVal) {
                this.$emit('update:currentPage', newVal)
                this.lastEmittedPage = -1
            }
        },
        internalPageCount(newVal) {
            const oldPage = this.internalCurrentPage
            if (newVal > 0 && oldPage === 0) {
                this.internalCurrentPage = 1
            } else if (oldPage > newVal) {
                this.internalCurrentPage = newVal === 0 ? 1 : newVal
                this.userChangePageSize && this.emitChange()
            }
            this.userChangePageSize = false
        }
    }
}