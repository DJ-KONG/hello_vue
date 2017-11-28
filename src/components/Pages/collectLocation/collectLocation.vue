<template>
  <div class="dutyList">
    <p>{{DTKconfig}}</p>
    <div>
      <mt-tab-container v-model="active">
        <mt-tab-container-item id="list">
          <mt-search v-model="value" cancel-text="取消" placeholder="搜索"
                     show>
            <!--<mt-cell-->
              <!--v-for="item in filterResult"-->
              <!--:title = "item.name"-->
              <!--:value = "item.name"-->
              <!--:key = "item.name">-->
              <!--<div >-->
              <!--<span>定位信息</span>-->
              <!--<img src="~assets/icon/location.png" width="30" height="30">-->
              <!--</div>-->
            <!--</mt-cell>-->
            <div  style="margin-top: 10px;padding-right:0;">
            <mt-cell-swipe
              v-for="item in filterResult"
              :title="item.name"
              :right="rightValue"
              :key = "item.name"
            >
            </mt-cell-swipe>
            </div>
          </mt-search>
        </mt-tab-container-item>
        <mt-tab-container-item id="map">
          <span>这里放地图</span>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
      <mt-tabbar v-model="active"  fixed>
        <mt-tab-item id="list">
          <img slot ="icon" src="~assets/icon/list_icon.png" height="100" width="120"/>
          <!--<img slot="icon" src="../assets/100x100.png">-->
          列表
        </mt-tab-item>
        <mt-tab-item id="map">
          <img slot ="icon" src="~assets/icon/mapIcon.png" height="100" width="120"/>
          <!--<img slot="icon" src="../assets/100x100.png">-->
          地图
        </mt-tab-item>
      </mt-tabbar>
  </div>
</template>

<script>
import { Toast } from 'mint-ui' ;
import ddTalk from 'dingtalk-javascript-sdk' ;
import ddtools from '@/components/common/DDTools' ;
import axios from 'axios' ;
import config from '@/config';

import location_icon from "assets/icon/list_icon.png" ;

const today = new Date();

export default {
  mounted() {
      this.dtkConfigInit() ;
//      this.DTKconfig ='12121' ;
  },
  data() {
    return {
      active: 'list' ,
      value:'' ,
      DTKconfig: [],
      apilist:   [ 'runtime.info', 'biz.contact.choose',
       'device.notification.confirm', 'device.notification.alert',
       'device.notification.prompt', 'biz.ding.post',
       'biz.util.openLink','util.domainStorage.setItem' ],
      defaultResult: [
        {name: '张三'} ,
        {name: 'Banana'} ,
        {name: 'Orange'} ,
        {name: 'Durian'} ,
        {name: 'Lemon'} ,
        {name: 'Peach'} ,
        {name: 'Cherry'} ,
        {name: 'Berry'} ,
        {name: 'Core'} ,
        {name: 'Fig'} ,
        {name: 'Haw'} ,
        {name: 'Melon'} ,
        {name: 'Plum'} ,
        {name: 'Pear'} ,
        {name: 'Peanut'} ,
        {name: 'Other'} ,
      ] ,
      rightValue:[
        {
          content: '定位',
          style: { background: '#3294ff', border: '1px solid #FFF', color: '#fff' },
          handler: () => Toast('打开地图去定位') ,
        }
      ]
    };
  },
  computed: {

    filterResult() {
      return this.defaultResult.filter(item => new RegExp(this.value, 'i').test(item.name ));
    }
  },
  methods:{
    dtkConfigInit(){
//          ddTalk.ready(function(){
//      const dd = ddTalk.apis;
//      // 设置导航
//      dd.biz.navigation.setTitle({
//        title: '客户信息'
//      });
//    });
//    console.log(window.location.href);
      axios.get(`${config.serverURL}/getConfig`,{
        params:{
          signedUrl:window.location.href,
        }
      }).then((response) => {
         // console.log(`[${response.data}]`) ;
          this.DTKconfig =response.data ;
        })
        .catch(function(err){
          console.log(err);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dutyList{
  /*background-color: #ff2231;*/
  height: 100%;
  margin: 5px;
  padding: 5px;
  }

</style>
