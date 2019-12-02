// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
Vue.use(Element);

const http = axios.create({
  baseURL: 'http://localhost:8888/api/private/v1/',
});
http.interceptors.request.use((config) => {
  if (config.url != '/login') {
    config.headers.Authorization = sessionStorage.getItem('token');
  }
  return config;
});
Vue.prototype.axios = http;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>',
});
