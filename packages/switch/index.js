import GSwitch from './src/switch'

GSwitch.install = function(Vue) {
    Vue.component(GSwitch.name, GSwitch)
}

export default GSwitch