import GTag from './src/tag'

GTag.install = function(Vue) {
    Vue.component(GTag.name, GTag)
}

export default GTag