import GOption from '../select/src/option'

GOption.install = function(Vue) {
  Vue.component(GOption.name, GOption)
}

export default GOption
