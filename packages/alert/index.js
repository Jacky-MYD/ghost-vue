import GAlert from './src/alert'

GAlert.install = function(Vue) {
    Vue.component(GAlert.name, GAlert)
}

export default GAlert
