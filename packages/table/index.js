import GTable from './src/table'

GTable.install = function(Vue) {
    Vue.component(GTable.name, GTable)
} 

export default GTable