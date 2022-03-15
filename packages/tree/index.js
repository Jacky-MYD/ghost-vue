import GTree from './src/tree'

GTree.install = function(Vue) {
    Vue.component(GTree.name, GTree)
} 

export default GTree