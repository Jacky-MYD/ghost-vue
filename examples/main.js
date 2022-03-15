import Vue from 'vue'
import App from './App.vue'
// import GButton from './components/button/button'
// import './assets/fonts/font.scss'
// import './assets/components.scss'
import '../dist/ghost-vue.css'

import GhostUI from '../packages'

Vue.config.productionTip = false
Vue.use(GhostUI)

// Vue.component(GButton.name, GButton)
// Vue.prototype.$primary = "#fff"

new Vue({
  render: h => h(App)
}).$mount('#app')
