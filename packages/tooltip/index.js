import GTooltip from './src/tooltip'

GTooltip.install = function(Vue) {
    Vue.component(GTooltip.name, GTooltip)
}

export default GTooltip