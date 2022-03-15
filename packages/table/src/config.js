import { getPropByPath } from '../../../src/utils/utils'
export const basicProps = ['columnKey', 'label', 'className', 'labelClassName', 'type', 'renderHeader', 'formatter', 'fixed', 'resizable']
export const sortProps = ['sortMethod', 'sortBy', 'sortOrders']
export const selectProps = ['selectable', 'reserveSelection']
export const filterProps = ['filterMethod', 'filters', 'filterMultiple', 'filterOpened', 'filteredValue', 'filterPlacement']

export const cellStarts = {
    default: {
        order: ''
    },
    selection: {
        width: 48,
        minWidth: 48,
        realWidth: 48,
        order: '',
        className: 'g-table-column--selection'
    },
    expand: {
        width: 48,
        minWidth: 48,
        realWidth: 48,
        order: '',
    },
    index: {
        width: 48,
        minWidth: 48,
        realWidth: 48,
        order: '',
    }
}

export const cellForced = {
    selection: {
        renderHeader: function(h, { store }) {
            return <g-checkbox
                disabled={ store.states.data && store.states.data.length === 0 }
                indeterminate={ store.states.selection.length > 0 && !this.isAllSelected }
                nativeOn-click={ this.toggleAllSelection }
                value={ this.isAllSelected } />
        },
        renderCell: function(h, { row, column, store, $index }) {
            return <g-checkbox
                nativeOn-click={ (event) => event.stopPropagation() }
                value={ store.isSelected(row) }
                disabled={ column.selectable ? !column.selectable.call(null, row, $index) : false }
                on-input={ () => { store.commit('ROW_SELECTED_CHANGE', row); } } />
        },
        sortable: false,
        resizable: false
    },
    index: {
        renderHeader: function(h, { column }) {
            return column.label || '#'
        },
        renderCell: function(h, { $index, column }) {
            let i = $index + 1
            const index = column.index

            if (typeof index === 'number') {
                i = $index + index
            } else if (typeof index === 'function') {
                i = index($index)
            }
            return <div>{ i }</div>
        },
        sortable: false
    },
    expand: {
        renderHeader: function(h, { column }) {
          return column.label || '';
        },
        renderCell: function(h, { row, store }) {
          const classes = ['g-table__expand-icon'];
          if (store.states.expandRows.indexOf(row) > -1) {
            classes.push('g-table__expand-icon--expanded');
          }
          const callback = function(e) {
            e.stopPropagation();
            store.toggleRowExpansion(row);
          };
          return (<div class={ classes }
            on-click={callback}>
            <i class='g-icon g-icon-arrow-right'></i>
          </div>);
        },
        sortable: false,
        resizable: false,
        className: 'g-table__expand-column'
    }
}

export const defaultRenderCell = (h, { row, column, $index }) => {
    const property = column.property
    const value = property && getPropByPath(row, property).v
    
    if (column && column.formatter) {
        return column.formatter(row, column, value, $index)
    }

    return value
}
export const treeCellPrefix = (h, { row, treeNode, store }) => {
    if (!treeNode) return null
    const ele = [];
    const callback = function(e) {
        e.stopPropagation()
        store.loadOrToggle(row)
    };
    if (treeNode.indent) {
        ele.push(<span class="g-table__indent" style={{'padding-left': treeNode.indent + 'px'}}></span>);
    }
    if (typeof treeNode.expanded === 'boolean' && !treeNode.noLazyChildren) {
        const expandClasses = ['g-table__expand-icon', treeNode.expanded ? 'g-table__expand-icon--expanded' : '']
        let iconClasses = ['g-icon-arrow-right']
        if (treeNode.loading) {
            iconClasses = ['g-icon-loading']
        }
        ele.push(<div class={ expandClasses }
            on-click={ callback }>
            <i class={ iconClasses }></i>
        </div>)
    } else {
        ele.push(<span class="g-table__placeholder"></span>)
    }
    return ele
}