import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
import Vue from 'vue';
import App from './App';
import router from './router/routers';
import "babel-polyfill";
import VueAMap from 'vue-amap';

Vue.use(Mint);
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: 'f5ab017176bc86c6f44e53363104ddda',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch',
    'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar',
    'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  uiVersion: '1.0.11'
});
Vue.config.productionTip = false;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
// router.push({ name: 'HomePages', params: { dd_nav_bgcolor: 'FF5E97F6' } });
