import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
import './assets/font/iconfont.css'
import './assets/css/global.css'
import axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import NProgress from 'nprogress'

Vue.use(VueQuillEditor)

Vue.config.productionTip = false

Vue.prototype.$http = axios

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

axios.interceptors.request.use((config) => {
  NProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})

axios.interceptors.response.use((config)=>{
  NProgress.done();
  return config;
})

Vue.use(ZkTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
