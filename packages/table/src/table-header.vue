<template>
    <table class="g-table__header" cellspacing="0" cellpadding="0" border="0">
        <colgroup>
            <col :name="column.id" v-for="(column) in columns" :key="column.id" :width="column.realWidth">
        </colgroup>
        <thead>
            <tr v-for="(columns, rowIndex) in columnRows" :key="rowIndex"
                :style="getHeaderRowStyle(rowIndex)"
                :class="getHeaderRowClass(rowIndex)">
                <th 
                    v-for="(column, cellIndex) in columns" 
                    :key="column.id"
                    :colspan="column.colSpan"
                    :rowspan="column.rowSpan"
                    @mousemove="handleMouseMove($event, column)"
                    @mouseout="handleMouseOut"
                    @mousedown="handleMouseDown($event, column)"
                    :style="getHeaderCellStyle(rowIndex, cellIndex, columns, column)"
                    :class="getHeaderCellClass(rowIndex, cellIndex, columns, column)">
                    <div class="cell">
                        {{ column.label }}
                        <span v-show="column.sortable"></span>
                    </div>
                </th>
            </tr>
        </thead>
    </table>
</template>
<script>
    import { mapStates } from './store/helper'
    import { hasClass, addClass, removeClass } from '../../../src/utils/dom'
    export default {
        name: 'GTableHeader',
        componentName: 'GTableHeader',
        props: {
            fixed: String,
            border: Boolean,
            store: {
                required: true
            },
            defaultSort: {
                type: Object,
                default() {
                    return {
                        prop: '',
                        order: ''
                    };
                }
            }
        },
        data () {
            return {
                columnRows: [],
                draggingColumn: null,
                dragging: false,
                dragState: {}
            }
        },
        computed: {
            table() {
                return this.$parent
            },
            hasGutter() {
                return !this.fixed && this.tableLayout.gutterWidth
            },
            ...mapStates({
                columns: 'columns',
                originColumns: 'originColumns',
                leftFixedLeafCount: 'fixedLeafColumnsLength',
                rightFixedLeafCount: 'rightFixedLeafColumnsLength',
                isAllSelected: 'isAllSelected',
                columnsCount: states => states.columns.length,
                leftFixedCount: states => states.fixedColumns.length,
                rightFixedCount: states => states.rightFixedColumns.length
            }),
            
        },
        methods: {
            // 设置表头行的style
            getHeaderRowStyle(rowIndex) {
                const headerRowStyle = this.table.headerRowStyle
                if (typeof headerRowStyle === 'function') {
                    return headerRowStyle.call(null, rowIndex)
                }
                return headerRowStyle
            },
            // 设置表头行的class
            getHeaderRowClass(rowIndex) {
                const classes = []
                const headerRowClassName = this.table.headerRowClassName
                if (typeof headerRowClassName === 'string') {
                    classes.push(headerRowClassName)
                } else if (typeof headerRowClassName === 'function') {
                    classes.push(headerRowClassName.call(null, { rowIndex }))
                }
                return classes.join(' ')
            },
            // 设置表头单元格的style
            getHeaderCellStyle(rowIndex, cellIndex, row, column) {
                const headerCellStyle = this.table.headerCellStyle
                if (typeof headerCellStyle === 'function') {
                    return headerCellStyle.call(null, {
                        rowIndex,
                        cellIndex,
                        row,
                        column
                    })
                }
                return headerCellStyle
            },
            // 设置表头单元格的class
            getHeaderCellClass(rowIndex, cellIndex, row, column) {
                const classes = [column.id, column.order, column.headerAlign, column.className, column.labelClassName]

                if (rowIndex === 0 && this.isCellHidden(cellIndex, row)) classes.push('is-hidden')
                if (!column.children) classes.push('is-leaf')
                if (column.sortable) classes.push('is-sortable')

                const headerCellClassName = this.table.headerCellClassName;
                if (typeof headerCellClassName === 'string') {
                    classes.push(headerCellClassName)
                } else if (typeof headerCellClassName === 'function') {
                    classes.push(headerCellClassName.call(null, {
                    rowIndex,
                    columnIndex,
                    row,
                    column
                    }))
                }

                return classes.join(' ')
            },

            // 设置隐藏的单元格
            isCellHidden(index, row) {
                let start = 0
                for (let i = 0; i < index; i++) {
                    start += row[i].colSpan                    
                }

                const after = start + row[index].colSpan - 1
                if (this.fixed === true || this.fixed === 'left') {
                    return after >= this.leftFixedLeafCount
                } else if (this.fixed === 'right') {
                    return start < this.columnsCount - this.rightFixedLeafCount
                } else {
                    return (after < this.leftFixedLeafCount) || (start >= this.columnsCount - this.rightFixedLeafCount)
                }
            },

            // 鼠标移动
            handleMouseMove(event, column) {
                if (column.children && column.children.length > 0) return
                let target = event.target
                while(target && target.tagName !== 'TH') target = target.parentNode
                
                if (!column || !column.resizable) return

                if (!this.dragging && this.border) {
                    let rect = target.getBoundingClientRect()

                    const bodyStyle = document.body.style
                    if (rect.width > 12 && rect.right - event.pageX < 8) {
                        bodyStyle.cursor = 'col-resize'
                        if (hasClass(target, 'is-sortable')) target.style.cursor = 'col-resize'
                        this.draggingColumn = column
                    } else if (!this.dragging) {
                        bodyStyle.cursor = ''
                        if (hasClass(target, 'is-sortable')) target.style.cursor = 'pointer'
                        this.draggingColumn = null
                    }
                }

            },

            // 鼠标移出
            handleMouseOut() {
                if (this.$isServer) return;
                document.body.style.cursor = ''
            },

            // 获取所有的列
            getAllColumns(columns) {
                const result = [];
                columns.forEach((column) => {
                    if (column.children) {
                    result.push(column);
                    result.push.apply(result, getAllColumns(column.children));
                    } else {
                    result.push(column);
                    }
                });
                return result
            },
            // 列转行
            convertToRows(originColumns) {
                let maxLevel = 1
                const traverse = (column, parent) => {
                    if (parent) {
                        column.level = parent.level + 1
                        if (maxLevel < column.level) maxLevel = column.level
                    }

                    if (column.children) {
                        let colSpan = 0
                        column.children.forEach((subColumn) => {
                            traverse(subColumn, column)
                            colSpan += subColumn.colSpan
                        })
                        column.colSpan = colSpan
                    } else {
                        column.colSpan = 1
                    }
                }

                originColumns.forEach(column => {
                    column.level = 1
                    traverse(column)
                })

                const rows = []
                for (let i = 0; i < maxLevel; i++) {
                    rows.push([])        
                }

                const allColumns = this.getAllColumns(originColumns)

                allColumns.forEach(column => {
                    if (!column.children) {
                        column.rowSpan = maxLevel - column.level + 1
                    } else {
                        column.rowSpan = 1
                    }
                    rows[column.level - 1].push(column)
                })
                this.columnRows = rows
            },

            // toggleAllSelection(event) {
            //     event.stopPropagation()
            //     this.store.commit('TOGGLE_ALL_SELECTION')
            // }
        },
        created () {
            this.filterPanels = {}
        },
        mounted () {
            this.$nextTick(() => {
                this.convertToRows(this.originColumns, this.columns)
                const { prop, order } = this.defaultSort
                const init = true
                this.store.commit('SORT', { prop, order, init })
            })
        },
        beforeDestroy () {
            const panels = this.filterPanels
            for (const prop in panels) {
                if (panels.hasOwnProperty(prop) && panels[prop]) {
                    panels[prop].$destroy(true)                    
                }
            }
        },
        watch: {
            columnRows(newVal, oldVal) {
                if (newVal !== oldVal) this.columnRows = newVal
            }
        }
    }
</script>