<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
      <br>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script>

  import config from '@/config';
  import neuTalk from 'neusoft-dingtalk' ;
  const url = `${config.neusoftURL}/getConfig`;
  const apiList =[ 'biz.map.locate','device.geolocation.get' ];
  const neusoftInit = neuTalk.init;
  const neusoftApis = neuTalk.apis;

  export default {
    name: 'HelloWorld',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App111',
        apilist:   [ 'biz.map.locate','device.geolocation.get' ],
      };
    },
    mounted(){
           neusoftApis.navSetTitle.setTitle('组件封装测试',(result)=>{},(error)=>{});
           neusoftApis.geoLocation.getLocation(url,{targetAccuracy:200,coordinate:1,withReGeocode:false,useCache:true},
            (data)=>{console.log('哈哈哈',JSON.stringify(data));},(data)=>{});
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
</style>
