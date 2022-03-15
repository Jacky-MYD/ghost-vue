import GTabPane from '../tabs/src/tab-pane'

GTabPane.install = function(Vue) {
    Vue.component(GTabPane.name, GTabPane)
}

export default GTabPane