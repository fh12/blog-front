import Vue from "vue";
import Component from "vue-class-component";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import service from "./utils/https";
import urls from "./utils/urls";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

Vue.config.productionTip = false;
Vue.prototype.$https = service; // 其他页面在使用axios的时候直接  this.$http就可以了
Vue.prototype.$urls = urls; // 其他页面在使用URLS的时候直接  this.$urls就可以了

// 不起作用
// Component.registerHooks([
//   "beforeRouteEnter",
//   "beforeRouteLeave",
//   "beforeRouteUpdate"
// ]);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
