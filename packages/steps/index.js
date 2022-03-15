import GSteps from './src/steps'

GSteps.install = function(Vue) {
    Vue.component(GSteps.name, GSteps)
}

export default GSteps