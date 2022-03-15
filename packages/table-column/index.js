import GTableColumn from '../table/src/table-column'

GTableColumn.install = function(Vue) {
    Vue.component(GTableColumn.name, GTableColumn)
} 

export default GTableColumn