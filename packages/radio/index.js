import GRadio from './src/radio'

GRadio.install = function(Vue) {
    Vue.component(GRadio.name, GRadio)
}

export default GRadio