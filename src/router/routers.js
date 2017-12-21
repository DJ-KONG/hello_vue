import Vue from 'vue';
import Router from 'vue-router';
import HomePages from '../components/Pages/home/homePage';
import HelloWorld from '../components/test1';
import dutyList from '../components/Pages/duty/dutyList';
import customerList from '../components/Pages/collectLocation/collectLocation';

Vue.use(Router);

export default new Router({
  // mode:'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
    },
    {
      path: '/home',
      name: 'HomePages',
      component: HomePages,
    },
    {
      path: '/duty',
      name: 'dutyList',
      component: dutyList,
    },
    {
      path: '/customer',
      name: 'customerList',
      component: customerList,
    },
  ],
});
