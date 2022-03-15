import Vue from 'vue'
import { arrayFind } from '../../../../src/utils/utils'
import Watcher from './watcher'

Watcher.prototype.mutations = {
    'SET_DATA'(states, data) {
        const dataInstanceChanged = states._data !== data
        states._data = data  
        this.execQuery()

        // this.updateCurrentRowData()
        this.updateExpandRows()
        if (states.reserveSelection) {
            this.assertRowKey()
            this.updateSelectionByRowKey()
        } else {
            if (dataInstanceChanged) {
                this.clearSelection()
            } else {
                this.cleanSelection()
            }
        }
        this.updateAllSelected()
        this.updateTableScrollY()
    },

    'INSERT_COLUMN'(states, column, index, parent) {
        let array = states._columns
        if (parent) {
            array = parent.children
            if (!array) array = parent.children = []
        }
        if (typeof index !== 'undefined') {
            array.splice(index, 0, column)
        } else {
            array.push(column)
        }
        if (column.type === 'selection') {
            states.selectable = column.selectable
            states.reserveSelection = column.reserveSelection
        }
      
        if (this.table.$ready) {
            this.updateColumns()
            this.scheduleLayout()
        }
    },
    'REMOVE_COLUMN'(states, column, parent) {
        let array = states._columns
        if (parent) {
            array = parent.children
            if (!array) array = parent.children = []
        }

        if (array) {
            array.splice(array.indexOf(column), 1)
        }
        if (this.table.$ready) {
            this.updateColumns()
            this.scheduleLayout()
        }
    },

    'FILTER_CHANGE'(states, options) {
        let { column, values, silent } = options
        const newFilters = this.updateFilters(column, values) 
        this.execQuery()

        if (!silent) this.table.$emit('filter-change', newFilters)

        this.updateTableScrollY()
    },
    'SET_HOVER_ROW'(states, row) {
        states.hoverRow = row
    },
    'ROW_SELECTED_CHANGE'(states, row) {
        this.toggleRowSelection(row);
        this.updateAllSelected();
    },

    'SORT'(states, options) {
        const { prop, order, init } = options
        if (prop) {
            
            const column = arrayFind(states.columns, column => column.prototype === prop)
            if (column) {
                column.order = order
                this.updateSort(column, prop, order)
                this.commit('CHANGE_SORT_CONDITION', { init })
            }
        }
    },

    'CHANGE_SORT_CONDITION'(states, options) {
        const { sortingColumn: column, sortProp: prop, sortOrder: order } = states
        if (order === null) {
            states.sortingColumn = null
            states.sortProp = null
        }

        const ingore = { filter: true }
        this.execQuery(ingore)

        if (!options || !(options.silent || options.init)) {
            this.table.$emit('sort-change', {
                column,
                prop,
                order
            })
        }

        this.updateTableScrollY()
    },

    'SET_CURRENT_ROW'(states, row) {
        // this.updateCurrentRow(row)
    }
}

Watcher.prototype.commit = function(name, ...args) {
    const mutations = this.mutations
    if (mutations[name]) {
        mutations[name].apply(this, [this.states].concat(args))
    } else {
        throw new Error(`Action not found: ${name}`)
    }
}

Watcher.prototype.updateTableScrollY = function() {
    Vue.nextTick(this.table.updateScrollY)
}

export default Watcher