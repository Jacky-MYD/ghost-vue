<script>
    import { basicProps, sortProps, selectProps, filterProps, cellStarts, cellForced, defaultRenderCell, treeCellPrefix } from './config'
    import { parseWidth, parseMinWidth, mergeOptions, compose } from './util'
    let columnIdSeed = 1
    export default {
        name: 'GTableColumn',
        componentName: 'GTableColumn',
        props: {
            type: {
                type: String,
                default: 'default'
            },
            label: String,
            className: String,
            labelClassName: String,
            property: String,
            prop: String,
            width: {},
            minWidth: {},
            renderHeader: Function,
            sortable: {
                type: [Boolean, String],
                default: false
            },
            sortMethod: Function,
            sortBy: [String, Function, Array],
            resizable: {
                type: Boolean,
                default: true
            },
            columnKey: String,
            align: String,
            headerAlign: String,
            showTooltipWhenOverflow: Boolean,
            showOverflowTooltip: Boolean,
            fixed: [Boolean, String],
            formatter: Function,
            selectable: Function,
            reserveSelection: Boolean,
            filterMethod: Function,
            filteredValue: Array,
            filters: Array,
            filterPlacement: String,
            filterMultiple: {
                type: Boolean,
                default: true
            },
            index: [Number, Function],
            sortOrders: {
                type: Array,
                default() {
                    return ['ascending', 'descending', null];
                },
                validator(val) {
                    return val.every(order => ['ascending', 'descending', null].indexOf(order) > -1);
                }
            }
        },
        data () {
            return {
                isSubColumn: false,
                columns: [],
                columnConfig: null
            }
        },
        computed: {
            owner() {
                let parent = this.$parent
                while (parent && !parent.tableId) {
                    parent = parent.$parent
                } 
                return parent
            },
            columnOrTableParent() {
                let parent = this.$parent
                while (parent && !parent.tableId && !parent.columnId) {
                    parent = parent.$parent
                } 
                return parent
            },
            realWidth() {
                return parseWidth(this.width)
            },
            realMinWidth() {
                return parseMinWidth(this.minWidth)
            },
            realAlign() {
                return this.align ? 'is-' + this.align : '' 
            },
            realHeaderAlign() {
                return this.headerAlign ? 'is-' + this.headerAlign : this.realAlign;
            }
        },
        methods: {
            // 获取props
            getPropsData(...props) {
                return props.reduce((prev, cur) => {
                    if (Array.isArray(cur)) {
                        cur.forEach((key) => {
                            prev[key] = this[key]
                        })
                    }
                    return prev
                }, {}) 
            },

            // 获取column的索引值
            getColumnIndex(children, child) {
                return [].indexOf.call(children, child)
            },

            // 设置column的宽
            setColumnWidth(column) {
                if (this.realWidth) column.width = this.realWidth

                if (this.realMinWidth) column.minWidth = this.realMinWidth

                if (!column.minWidth) column.minWidth = 80

                column.realWidth = column.width === undefined ? column.minWidth : column.width

                return column
            },

            // 
            setColumnForcedProps(column) {
                const type = column.type
                const source = cellForced[type] || {}
                Object.keys(source).forEach(prop => {
                    let value = source[prop]
                    if (value !== undefined) column[prop] = prop === 'className' ? `${column[prop]} ${value}` : value 
                })
                return column
            },

            setColumnRenders(column) {
                if (this.renderHeader) {
                    console.warn('[Element Warn][TableColumn]Comparing to render-header, scoped-slot header is easier to use. We recommend users to use scoped-slot header.');
                } else if (column.type !== 'selection') {
                    column.renderHeader = column.label;
                }
                let originRenderCell = column.renderCell

                if (column.type === 'expand') {
                    column.renderCell = (h, data) => (<div class="cell">
                        { originRenderCell(h, data) }
                    </div>)

                    this.owner.renderExpanded = (h, data) => {
                        return this.$scopedSlots.default
                            ? this.$scopedSlots.default(data)
                            : this.$slots.default
                    }
                } else {
                    originRenderCell = originRenderCell || defaultRenderCell
                    // 对 renderCell 进行包装
                    column.renderCell = (h, data) => {
                        let children = null
                        
                        if (this.$scopedSlots.default) {
                            children = this.$scopedSlots.default(data)
                        } else {
                            children = originRenderCell(h, data)
                        }
                        const prefix = treeCellPrefix(h, data)
                        const props = {
                            class: 'cell',
                            style: {}
                        }
                        if (column.showOverflowTooltip) {
                            props.class += ' g-tooltip'
                            props.style = {width: (data.column.realWidth || data.column.width) - 1 + 'px'}
                        }
                        return (<div { ...props }>
                            { prefix }
                            { children }
                        </div>)
                    } 
                }
                return column
            },

            registerNormalWatchers() {
                const props = ['label', 'property', 'filters', 'filterMultiple', 'sortable', 'index', 'formatter', 'className', 'labelClassName', 'showOverflowTooltip']
                const aliases = {
                    prop: 'property',
                    realAlign: 'align',
                    realHeaderAlign: 'headerAlign',
                    realWidth: 'width'
                }
                const allAliases = props.reduce((prev, cur) => {
                    prev[cur] = cur
                    return prev
                }, aliases)

                Object.keys(allAliases).forEach(key => {
                    const columnKey = aliases[key]
                    this.$watch(key, (newVal) => {
                        this.columnConfig[columnKey] = newVal
                    })
                })
            },
            registerComplexWatchers() {
                const props = ['fixed']
                const aliases = {
                    realWidth: 'width',
                    realMinWidth: 'minWidth'
                }
                const allAliases = props.reduce((prev, cur) => {
                    prev[cur] = cur
                    return prev
                }, aliases)

                Object.keys(allAliases).forEach(key => {
                    const columnKey = aliases[key]

                    this.$watch(key, (newVal) => {
                        this.columnConfig[columnKey] = newVal
                        const updateColumns = columnKey === 'fixed'
                        this.owner.store.scheduleLayout(updateColumns)
                    })
                })
            }
        },
        render(h) {
            return h('div', this.$slots.default)
        },
        beforeCreate () {
            this.row = {}
            this.column = {}
            this.$index = 0
            this.columnId = ''
            this.columnConfig = null
        },
        created () {
            const parent = this.columnOrTableParent
            this.isSubColumn = this.owner !== parent
            this.columnId = (parent.tableId || parent.columnId) + '_column_' + columnIdSeed++

            const type = this.type || 'default'
            const sortable = this.sortable === '' ? true : this.sortable
            const prop = {
                ...cellStarts[type],
                id: this.columnId,
                type: type,
                label: this.label,
                property: this.prop || this.property,
                align: this.realAlign,
                headerAlign: this.realHeaderAlign,
                showOverflowTooltip: this.showOverflowTooltip || this.showTooltipWhenOverflow,
                // filter 相关属性
                filterable: this.filters || this.filterMethod,
                filteredValue: [],
                filterPlacement: '',
                isColumnGroup: false,
                filterOpened: false,
                // sort 相关属性
                sortable: sortable,
                // index 列
                index: this.index
            }
            
            let columnProps = this.getPropsData(basicProps, sortProps, selectProps, filterProps)
            columnProps = mergeOptions(prop, columnProps)
            // 注意 compose 中函数执行的顺序是从右到左
            const chains = compose(this.setColumnRenders, this.setColumnWidth, this.setColumnForcedProps)
            
            columnProps = chains(columnProps)
            this.columnConfig = columnProps
            // 注册 watcher
            this.registerNormalWatchers()
            this.registerComplexWatchers()
        },
        mounted () {
            const owner = this.owner
            const parent = this.columnOrTableParent
            const children = this.isSubColumn ? parent.$el.children : parent.$refs.hiddenColumns.children
            const columnIndex = this.getColumnIndex(children, this.$el)
            owner.store.commit('INSERT_COLUMN', this.columnConfig, columnIndex, this.isSubColumn ? parent.columnConfig : null)
        },
        destroyed () {
            if (!this.$parent) return;
            const parent = this.$parent;
            this.owner.store.commit('REMOVE_COLUMN', this.columnConfig, this.isSubColumn ? parent.columnConfig : null)
        }
    }
</script>