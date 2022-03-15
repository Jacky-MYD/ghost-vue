import GTabs from './src/tabs'

GTabs.install = function(Vue) {
    Vue.component(GTabs.name, GTabs)
}

export default GTabs