import GDialog from './src/dialog';

GDialog.install = function(Vue) {
  Vue.component(GDialog.name, GDialog);
};

export default GDialog;
