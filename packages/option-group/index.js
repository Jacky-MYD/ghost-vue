import GOptionGroup from '../select/src/option-group';

GOptionGroup.install = function(Vue) {
  Vue.component(GOptionGroup.name, GOptionGroup);
};

export default GOptionGroup;
