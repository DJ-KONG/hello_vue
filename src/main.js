import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
import Vue from 'vue';
import App from './App';
import router from './router/routers';
import "babel-polyfill";
// import VueAMap from 'vue-amap';

Vue.use(Mint);

Vue.config.productionTip = false;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
// router.push({ name: 'HomePages', params: { dd_nav_bgcolor: 'FF5E97F6' } });
