import Vue from 'vue';
import App from './App.vue';

import './style/common.scss';
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css';//引入样式报错
// Vue.use(ElementUI)

import contentList from './component/contentList.vue';
import searchList from './component/searchList.vue';

import VueRouter from 'vue-router'

Vue.use(VueRouter)


const routes = [
  { path: '/foo', component: contentList },
  { path: '/bar', component: searchList }
]

const router = new VueRouter({
  routes
})



new Vue({
  el: '#app',
  router,
  // template: '<App/>',
  // components: { App }
  render: h => h(App)
})