import Vue from 'vue';
import App from './App.vue';

import './style/common.scss';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';//引入样式报错
Vue.use(ElementUI)
new Vue({
  el: '#app',
  // template: '<App/>',
  // components: { App }
  render: h => h(App)
})