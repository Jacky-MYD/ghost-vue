import GPagination from './src/pagination';

GPagination.install = function(Vue) {
  Vue.component(GPagination.name, GPagination);
};

export default GPagination;
