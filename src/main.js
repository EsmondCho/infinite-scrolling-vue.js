// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VModal from 'vue-js-modal'
import axios from 'axios'

Vue.use(VModal)

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$API_SERVER = 'localhost:8000/'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
