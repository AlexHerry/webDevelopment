// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import '@/assets/css/style.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';

const axo = axios.create({
  baseURL: 'http://localhost:8888/api/private/v1/',
  timeout: 3000,
});

axo.interceptors.request.use(function(conf) {
  if (conf.url !== '/login') {
    conf.headers.Authorization = sessionStorage.getItem('token');
  }
  return conf;
});

// router.beforeEach((to, from, next) => {
//   if ()
// });

Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.axios=axo;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>',
});
