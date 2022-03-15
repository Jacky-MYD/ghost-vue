import directive from './src/directive'

export default {
    install(Vue) {
        Vue.use(directive)
    },
    directive
}

// import GLoading from './src/loading'

// GLoading.install = function(Vue) {
//     Vue.component(GLoading.name, GLoading)
// }

// export default GLoading