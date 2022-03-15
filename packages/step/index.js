import GStep from '../steps/src/step'

GStep.install = function(Vue) {
    Vue.component(GStep.name, GStep)
}

export default GStep