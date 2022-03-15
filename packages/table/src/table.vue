<template>
    <div class="g-table"
        :class="[{
            'g-table--fit': fit,
            'g-table--fluid-height': maxHeight,
            'g-table--scrollable-x': layout.scrollX,
            'g-table--scrollable-y': layout.scrollY,
        }, tableSize ? `g-table--${ tableSize }` : '']"
        @mouseleave="handleMouseLeave($event)">
        <div class="hidden-columns" ref="hiddenColumns"><slot></slot></div>
        <div class="g-table__header-wrapper" v-if="showHeader" ref="headerWrapper" v-mousewheel="handleHeaderFooterMousewheel">
            <table-header 
                ref="tableHeader"
                :store="store"
                :border="border"
                :style="{
                    width: layout.bodyWidth ? layout.bodyWidth + 'px' : ''
                }"></table-header>
        </div>
        <div class="g-table__body-wrapper" 
            :class="[layout.scrollX ? `is-scrolling-${scrollPosition}` : 'is-scrolling-none']"
            ref="bodyWrapper"
            :style="[bodyHeight]">
            <table-body
                :stripe="stripe"
                :store="store"
                :border="border"
                :row-class-name="rowClassName"
                :row-style="rowStyle"
                :highlight="highlightCurrentRow"
                :style="{
                width: bodyWidth
                }"></table-body>
            <div class="g-table__empty-block"
                v-if="!data || data.length === 0"
                ref="emptyBlock"
                :style="emptyBlockStyle">
                <span class="g-table__empty-text">
                    <slot name="empty">{{ emptyText }}</slot>
                </span>
            </div>
        </div>
        <div class="g-table__footer-wrapper" v-if="showSummary" v-mousewheel="handleHeaderFooterMousewheel">
            <table-footer></table-footer>
        </div>
        <div class="g-table__fixed-right"
            v-if="rightFixedColumns && rightFixedColumns.length > 0"
            ref="rightFixedWrapper"
            :style="[{
                width: layout.rightFixedWidth ? layout.rightFixedWidth + 'px' : '',
                right: layout.scrollY ? (border ? layout.gutterWidth : (layout.gutterWidth || 0)) + 'px' : ''
            }, fixedHeight]">
            <div class="g-table__fixed-header-wrapper"
                v-if="showHeader"
                ref="rightFixedHeaderWrapper">
                <table-header 
                    fixed="right"
                    ref="rightFixedTableHeader"
                    :store="store"
                    :border="border"
                    :style="{
                        width: layout.bodyWidth ? layout.bodyWidth + 'px' : ''
                    }"></table-header>
            </div>
            <div class="g-table__fixed-body-wrapper"
                ref="rightFixedBodyWrapper"
                :style="[{
                top: layout.headerHeight + 'px'
                }, fixedBodyHeight]">
                <table-body
                    fixed="right"
                    :stripe="stripe"
                    :store="store"
                    :border="border"
                    :row-class-name="rowClassName"
                    :row-style="rowStyle"
                    :highlight="highlightCurrentRow"
                    :style="{
                        width: bodyWidth
                    }"></table-body>
                <div class="g-table__empty-block"
                    v-if="!data || data.length === 0"
                    ref="emptyBlock"
                    :style="emptyBlockStyle">
                    <span class="g-table__empty-text">
                        <slot name="empty">{{ emptyText }}</slot>
                    </span>
                </div>
            </div>
            <div class="g-table__fixed-footer-wrapper" v-if="showSummary">
                <table-footer></table-footer>
            </div>
        </div>
        <div class="g-table__fixed"
            v-if="fixedColumns && fixedColumns.length > 0"
            ref="fixedWrapper"
            :style="[{
                width: layout.rightFixedWidth ? layout.rightFixedWidth + 'px' : '',
                right: layout.scrollY ? (border ? layout.gutterWidth : (layout.gutterWidth || 0)) + 'px' : ''
            }, fixedHeight]">
            <div class="g-table__fixed-header-wrapper"
                v-if="showHeader"
                ref="fixedHeaderWrapper">
                <table-header 
                    fixed="left"
                    ref="fixedTableHeader"
                    :store="store"
                    :border="border"
                    :style="{
                        width: layout.bodyWidth ? layout.bodyWidth + 'px' : ''
                    }"></table-header>
            </div>
            <div class="g-table__fixed-body-wrapper"
                ref="fixedBodyWrapper"
                :style="[{
                top: layout.headerHeight + 'px'
                }, fixedBodyHeight]">
                <table-body
                    fixed="left"
                    :stripe="stripe"
                    :store="store"
                    :border="border"
                    :row-class-name="rowClassName"
                    :row-style="rowStyle"
                    :highlight="highlightCurrentRow"
                    :style="{
                        width: bodyWidth
                    }"></table-body>
                <div class="g-table__empty-block"
                    v-if="!data || data.length === 0"
                    ref="emptyBlock"
                    :style="emptyBlockStyle">
                    <span class="g-table__empty-text">
                        <slot name="empty">{{ emptyText }}</slot>
                    </span>
                </div>
            </div>
            <div class="g-table__fixed-footer-wrapper" v-if="showSummary">
                <table-footer></table-footer>
            </div>
        </div>
    </div>
</template>
<script>
    import TableHeader from './table-header'
    import TableBody from './table-body'
    import TableFooter from './table-footer'
    import TableLayout from './table-layout'
    import { debounce, throttle } from 'throttle-debounce'
    import { addResizeListener, removeResizeListener } from '../../../src/utils/resize-event'
    import Mousewheel from '../../../src/utils/directives/mousewheel'
    import { createStore, mapStates } from './store/helper'
    import { parseHeight } from './util';
    let tableIdSeed = 1
    export default {
        name: 'GTable',
        componentName: 'GTable',
        directives: {
            Mousewheel
        },
        components: {
            TableHeader,
            TableBody,
            TableFooter
        },
        props: {
            data: {
                type: Array,
                default: function() {
                    return []
                }
            },
            stripe: Boolean,
            size: String,
            width: [String, Number],
            height: [String, Number],
            maxHeight: [String, Number],
            border: Boolean,
            showHeader: {
                type: Boolean,
                default: true
            },
            fit: {
                type: Boolean,
                default: true
            },
            rowClassName: [String, Function],
            rowStyle: [Object, Function],
            showSummary: Boolean,
            treeProps: {
                type: Object,
                default() {
                    return {
                        hasChildren: 'hasChildren',
                        children: 'children'
                    }
                }
            },
            emptyText: String,
            highlightCurrentRow: Boolean,
            headerRowClassName: [String, Function],
            headerRowStyle: [Object, Function],
            headerCellClassName: [String, Function],
            headerCellStyle: [Object, Function],
        },
        computed: {
            tableSize() {
                return this.size
            },
            bodyWrapper() {
                return this.$refs.bodyWrapper
            },
            shouldUpdateHeight() {
                return this.height || this.maxHeight || this.fixedColumns.length > 0 || this.rightFixedColumns.length > 0
            },
            bodyWidth() {
                const { bodyWidth, scrollY, guterWidth } = this.layout
                return bodyWidth ? bodyWidth - (scrollY ? guterWidth : 0) + 'px' : ''
            },
            bodyHeight() {
                const { headerHeight = 0, bodyHeight, footerHeight = 0 } = this.layout
                if (this.height) {
                    return {
                        height: bodyHeight ? bodyHeight + 'px' : ''
                    }
                } else if (this.maxHeight) {
                    const maxHeight = parseHeight(this.maxHeight)
                    if (typeof maxHeight === 'number') {
                        return {
                            'max-height': (maxHeight - footerHeight - (this.showHeader ? headerHeight : 0)) + 'px'
                        }
                    }
                }
                return {}
            },
            fixedBodyHeight() {
                if (this.height) {
                    return {
                        height: this.layout.fixedBodyHeight ? this.layout.fixedBodyHeight + 'px' : ''
                    }
                } else if (this.maxHeight) {
                    let maxHeight = parseHeight(this.maxHeight)
                    if (typeof maxHeight === 'number') {
                        maxHeight = this.layout.scrollX ? maxHeight - this.layout.gutterWidth : maxHeight
                        if (this.showHeader) {
                            maxHeight -= this.layout.headerHeight
                        }
                        maxHeight -= this.layout.footerHeight
                        return {
                            'max-height': maxHeight + 'px'
                        }
                    }
                }
                return {}
            },
            fixedHeight() {
                if (this.maxHeight) {
                    if (this.showSummary) return { bottom: 0 }
                    return {
                        bottom: (this.layout.scrollX && this.data.length) ? this.layout.guterWidth + 'px' : ''
                    }
                } else {
                    if (this.showSummary) {
                        return {
                            height: this.layout.tableHeight ? this.layout.tableHeight + 'px' : ''
                        }
                    }
                    return {
                        height: this.layout.viewportHeight ? this.layout.viewportHeight + 'px' : ''
                    }
                }
            },
            emptyBlockStyle() {
                if (this.data && this.data.length) return null
                let height = '100%'
                if (this.layout.appendHeight) {
                    height = `calc(100% - ${this.layout.appendHeight}px)`
                }
                return {
                    width: this.bodyWidth,
                    height
                }
            },

            ...mapStates({
                columns: 'columns',
                tableData: 'data',
                fixedColumns: 'fixedColumns',
                rightFixedColumns: 'rightFixedColumns'
            })
        },
        watch: {
            data: {
                immediate: true,
                handler(newVal) {
                    this.store.commit('SET_DATA', newVal)
                }
            },
            height: {
                immediate: true,
                handler(newVal) {
                    this.layout.setHeight(newVal)
                }
            },
            maxHeight: {
                immediate: true,
                handler(newVal) {
                    this.layout.setMaxHeight(newVal)
                }
            }
        },
        data() {
            const { hasChildren = 'hasChildren', children = 'children' } = this.treeProps
            this.store = createStore(this, {
                rowKey: this.rowKey,
                // defaultExpandAll: this.defaultExpandAll,
                // selectOnIndeterminate: this.selectOnIndeterminate,
                // TreeTable 的相关配置
                // indent: this.indent,
                // lazy: this.lazy,
                lazyColumnIdentifier: hasChildren,
                childrenColumnName: children
            })
            const layout = new TableLayout({
                store: this.store,
                table: this,
                fit: this.fit,
                showHeader: this.showHeader
            }) 
            return {
                layout,
                renderExpanded: null,
                scrollPosition: 'left'
            }
        },
        methods: {
            doLayout() {
                if (this.shouldUpdateHeight) {
                    this.layout.updateElsHeight();
                }
                this.layout.updateColumnsWidth();
            },

            syncPostion: throttle(20, function() {
                const { scrollLeft, scrollTop, offsetWidth, scrollWidth } = this.bodyWrapper
                const { headerWrapper, footerWrapper, fixedBodyWrapper, rightFixedBodyWrapper } = this.$refs
                if (headerWrapper) headerWrapper.scrollLeft = scrollLeft
                if (footerWrapper) footerWrapper.scrollLeft = scrollLeft
                if (fixedBodyWrapper) fixedBodyWrapper.scrollTop = scrollTop
                if (rightFixedBodyWrapper) rightFixedBodyWrapper.scrollTop = scrollTop
                const maxScrollLeftPosition = scrollWidth - offsetWidth - 1
                if (scrollLeft >= maxScrollLeftPosition) {
                    this.scrollPosition = 'right'
                } else if (scrollLeft === 0) {
                    this.scrollPosition = 'left'
                } else {
                    this.scrollPosition = 'middle'
                }
            }),
            bindEvents() {
                this.bodyWrapper.addEventListener('scroll', this.syncPostion, { passive: true });
                if (this.fit) {
                    addResizeListener(this.$el, this.resizeListener);
                }
            },

            unbindEvents() {
                this.bodyWrapper.removeEventListener('scroll', this.syncPostion, { passive: true });
                if (this.fit) {
                    removeResizeListener(this.$el, this.resizeListener);
                }
            },

            resizeListener() {
                if (!this.$ready) return
                let shouldUpdateLayout = false
                const el = this.$el
                const { width: oldWidth, height: oldHeight } = this.resizeState

                const width = el.offsetWidth
                if (oldWidth != width) shouldUpdateLayout = true

                const height = el.offsetHeight
                if (this.height || this.shouldUpdateHeight && oldHeight !== height) shouldUpdateLayout = true

                if (shouldUpdateLayout) {
                    this.resizeState.width = width
                    this.resizeState.height = height
                    this.doLayout()
                }
            },

            handleMouseLeave() {
                this.store.commit('SET_HOVER_ROW', null)
                if (this.hoverState) this.hoverState = null
            },

            handleHeaderFooterMousewheel(event, data) {
                const { pixelX, pixelY } = data
                if (Math.abs(pixelX) >= Math.abs(pixelY)) {
                    this.bodyWrapper.scrollLeft += data.pixelX / 5;
                }
            },

            setCurrentRow(row) {
                this.store.commit('SET_CURRENT_ROW', row);
            },

        },
        created () {
            this.tableId = 'g-table_' + tableIdSeed++
            this.debouncedUpdateLayout = debounce(50, () => this.doLayout())
        },
        mounted () {
            this.bindEvents()
            this.store.updateColumns()
            this.doLayout()

            this.resizeState = {
                width: this.$el.offsetWidth,
                height: this.$el.offsetHeight
            }
            this.store.states.columns.forEach(column => {
                if (column.filteredValue && column.filteredValue.length) {
                    this.store.commit('FILTER_CHANGE', {
                        column,
                        values: column.filteredValue,
                        silent: true
                    })
                }
            })

            this.$ready = true
        }
    }
</script>