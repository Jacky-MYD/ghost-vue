import GMenu from './src/menu'

GMenu.install = function(Vue) {
  Vue.component(GMenu.name, GMenu)
}

export default GMenu
