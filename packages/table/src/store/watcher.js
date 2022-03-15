import Vue from 'vue'
import { getKeysMap, getRowIdentity, dealColumns, getColumnById, sortData } from '../util'
import tree from './tree'
import expand from './expand'

export default Vue.extend({
    data () {
        return {
            states: {
                data: [], // 数据源
                // 是否包含固定列
                isComplex: false,

                // 列
                _columns: [],
                originColumns: [],
                columns: [],
                fixedColumns: [],
                rightFixedColumns: [],
                leafColumns: [],
                fixedLeafColumns: [],
                rightFixedLeafColumns: [],
                leafColumnsLength: 0,
                fixedLeafColumnsLength: 0,
                rightFixedLeafColumnsLength: 0,

                // 选择
                isAllSelected: false,
                selection: [],
                reserveSelection: false,
                selectOnIndeterminate: false,
                selectable: null,

                // 过滤
                filters: {}, // 不可响应的
                filteredData: null,

                // 排序
                sortingColumn: null,
                sortProp: null,
                sortOrder: null,

                hoverRow: null
            }
        }
    },
    mixins: [tree, expand],
    methods: {
        // 更新列
        updateColumns() {
            const states = this.states
            const _columns = states._columns || []
            states.fixedColumns = _columns.filter(column => column.fixed === true || column.fixed === 'left')
            states.rightFixedColumns = _columns.filter(column => column.fixed === 'right')

            if (states.fixedColumns.length > 0 && _columns[0] && _columns[0].type === 'selection' && !_columns[0].fixed) {
                _columns[0].fixed = true
                states.fixedColumns.unshift(_columns[0])
            }

            const notFixedColumns = _columns.filter(column => !column.fixed)
            states.originColumns = [].concat(states.fixedColumns).concat(notFixedColumns).concat(states.rightFixedColumns)

            const leafColumns = dealColumns(notFixedColumns)
            const fixedLeafColumns = dealColumns(states.fixedColumns)
            const rightFixedLeafColumns = dealColumns(states.rightFixedColumns)

            states.leafColumnsLength = leafColumns.length
            states.fixedLeafColumnsLength = fixedLeafColumns.length
            states.rightFixedLeafColumnsLength = rightFixedLeafColumns.length

            states.columns = [].concat(fixedLeafColumns).concat(leafColumns).concat(rightFixedLeafColumns)
            states.isComplex = states.fixedColumns.length > 0 || states.rightFixedColumns.length > 0
        },
        // 更新DOM
        scheduleLayout(needUpdateColumns) {
            if (needUpdateColumns) this.updateColumns()
            this.table.debouncedUpdateLayout()
        },

        // 根据 filters 与 sort 去过滤 data
        execQuery(ignore) {
            if (!(ignore && ignore.filter)) {
                this.execFilter()
            }
            this.execSort()
        },

        execFilter() {
            const states = this.states
            const { _data, filters } = states
            let data = _data
            Object.keys(filters).forEach((columnId) => {
                const values = states.filters[columnId]
                if (!values || values.length === 0) return
                const column = getColumnById(this.states, columnId)
                if (column && column.filterMethod) {
                    data = data.filter((row) => {
                        return values.some(value => column.filterMethod.call(null, value, row, column))
                    })
                } 
            })
            states.filteredData = data
        },

        execSort() {
            const states = this.states
            states.data = sortData(states.filteredData, states)
        },

        // 过滤与排序
        updateFilters(columns, values) {
            if (!Array.isArray(columns)) columns = [columns]

            const states = this.states
            const filters = {}
            columns.forEach(column => {
                states.filters[column.id] = values
                filters[column.columnKey || column.id] = values
            })
            return filters
        },

        updateSort(column, prop, order) {
            if (this.states.sortingColumn && this.states.sortingColumn !== column) {
                this.states.sortingColumn.order = null
            }
            this.states.sortingColumn = column
            this.states.sortProp = prop
            this.states.sortOrder = order
        },

        updateAllSelected() {
            const states = this.states
            const { selection, rowKey, selectable } = states
            // data 为 null 时，解构时的默认值会被忽略
            const data = states.data || []
            if (data.length === 0) {
              states.isAllSelected = false
              return
            }
      
            let selectedMap;
            if (rowKey) {
              selectedMap = getKeysMap(selection, rowKey)
            }
            const isSelected = function(row) {
                if (selectedMap) {
                    return !!selectedMap[getRowIdentity(row, rowKey)]
                } else {
                    return selection.indexOf(row) !== -1
                }
            }
            let isAllSelected = true
            let selectedCount = 0
            for (let i = 0, j = data.length; i < j; i++) {
                const item = data[i]
                const isRowSelectable = selectable && selectable.call(null, item, i)
                if (!isSelected(item)) {
                    if (!selectable || isRowSelectable) {
                        isAllSelected = false
                        break
                    }
                } else {
                    selectedCount++
                }
            }
      
            if (selectedCount === 0) isAllSelected = false
            states.isAllSelected = isAllSelected
        },

        clearSelection() {
            const states = this.states;
            states.isAllSelected = false;
            const oldSelection = states.selection;
            if (oldSelection.length) {
                states.selection = [];
                this.table.$emit('selection-change', []);
            }
        }

    }
})