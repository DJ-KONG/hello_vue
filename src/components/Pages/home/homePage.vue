<template>
  <div>
    <div class="swipe-wrapper">
      <mt-swipe :auto="4000" >
        <mt-swipe-item v-for="img in imglist" :key="img.id">
          <img :src="img.src"/>
        </mt-swipe-item>
      </mt-swipe>
    </div>
    <div>
      <ul class="menu-list">
        <li v-for="item in menuList" @click="$router.push({name: item.route})">
          <img class="icon" :src="require(`assets/icon/${item.icon}`)">
          <span class="name">{{ item.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
//import leiFT from 'assets/pic/lft.jpg';
import xiHu from 'assets/pic/xihu.jpg';
import logo from 'assets/logo.png';
import ddTalk from 'dingtalk-javascript-sdk';

export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      imglist: [
//        { id: '1', src: leiFT },
        { id: '2', src: xiHu },
        { id: '3', src: logo }],
      menuList: [
        {
          icon: 'duty.png',
          name: '今日任务',
          route: 'dutyList',
        },
        {
          icon: 'zhuangc.png',
          name: '装车',
          route: 'customerList',
        },
        {
          icon: 'radio.png',
          name: '电台',
          route: 'radio',
        },
      ],
    };
  },
  mounted() {
//    ddTalk.ready(function(){
//      const dd = ddTalk.apis;
//      // 设置导航
//      dd.biz.navigation.setTitle({
//        title: '物流作业'
//      });
//    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  .swipe-wrapper{
    height: 300px;
    width: 100%;
    margin-top: 1px;
    text-align: center;
  }
  .menu-list {
    display: flex;
    justify-content: space-between;
    padding: 20px;
  }
  .menu-list li {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
  }
  .menu-list li .icon {
    display: inline-block;
    width: 30px;
    height: 30px;
    margin-right: 10px;
    list-style-type:none;
  }
</style>
