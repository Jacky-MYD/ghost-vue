import GBadge from './src/badge'

GBadge.install = function(Vue) {
    Vue.component(GBadge.name, GBadge)
}

export default GBadge