<template>
  <div class="dutyList">
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
          <div class="mapView">
          <el-amap vid="amapDemo"
                   :center="center"
                   :map-manager="amapManager"
                   :zoom="zoom"
                   :events="events" class="amap-demo">
          </el-amap>
          </div>
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
import VueAMap from 'vue-amap';
import config from '@/config';
import { authInfo,getConfig } from '@/components/common/DDTools' ;

import location_icon from "assets/icon/list_icon.png" ;

const today = new Date();

let amapManager = new VueAMap.AMapManager();

export default {
  mounted() {
    this.dtkConfigInit();
  },
  data() {
    return {
      active: 'list' ,
      value:'' ,
      DTKconfig: [],
      apilist:   [ 'biz.map.locate','device.geolocation.get' ],
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
          handler: () =>{
            this.getLocation((data)=>{
              this.openMap(data);
            })
          } ,
        }
      ],
      //*****************************************高德地图参数start
      zoom: 12,
      center: [121.59996, 31.197646],
      amapManager,
      events: {
        init(map) {
          AMapUI.loadUI(['overlay/SimpleMarker'], function(SimpleMarker) {
            const marker = new SimpleMarker({
              iconLabel: 'A',
              iconStyle: 'red',
              map: map,
              position: map.getCenter()
            });
          });
        }
      }
      //**********************************************高德地图参数end
    };
  },
  computed: {

    filterResult() {
      return this.defaultResult.filter(item => new RegExp(this.value, 'i').test(item.name ));
    }
  },
  methods:{
    dtkConfigInit(){
      authInfo((data) => {
        this.DTKconfig = data.data;
        getConfig(this.DTKconfig,this.apilist,(data)=>{
          ddTalk.ready(function(){
            const dd = ddTalk.apis;
            // 设置导航
            dd.biz.navigation.setTitle({
              title: '客户信息'
            });
          });
        });
      })

    },
    getLocation(callbacks){
      ddTalk.ready(function(){
        const dd = ddTalk.apis;
        //获取位置坐标
        dd.device.geolocation.get({
          targetAccuracy : 200,
          coordinate : 1,
          withReGeocode : true,
          useCache:false, //默认是true，如果需要频繁获取地理位置，请设置false
          onSuccess : function(result) {
            /* 高德坐标 result 结构
        {
            longitude : Number, // POI的经度
            latitude : Number,// POI的纬度
            accuracy : Number,
            address : String,
            province : String,
            city : String,
            district : String,
            road : String,
            netType : String,
            operatorType : String,
            errorMessage : String,
            errorCode : Number,
            isWifiEnabled : Boolean,
            isGpsEnabled : Boolean,
            isFromMock : Boolean,
            provider : wifi|lbs|gps,
            accuracy : Number,
            isMobileEnabled : Boolean
        }
        */
            let addrList = [];
            addrList.push(result);
            if (typeof callbacks === 'function') {
              callbacks(addrList)
            }
          },
          onFail : function(err) {
            Toast(JSON.stringify(err));
            console.log(JSON.stringify(err));
          }
        });
      });
    },
    openMap(addrList){
      console.log(addrList);
      let longitude = addrList[0].longitude;
      let latitude = addrList[0].latitude;
      console.log(longitude,latitude);
      ddTalk.ready(function(){
      const dd = ddTalk.apis;
      dd.biz.map.locate({
        latitude: latitude, // 纬度
        longitude: longitude, // 经度
        onSuccess: function (result) {
          /* result 结构
          {
            province: 'xxx', // POI所在省会
              provinceCode: 'xxx', // POI所在省会编码
            city: 'xxx', // POI所在城市
            cityCode: 'xxx', // POI所在城市
            adName: 'xxx', // POI所在区名称
            adCode: 'xxx', // POI所在区编码
            distance: 'xxx', // POI与设备位置的距离
            postCode: 'xxx', // POI的邮编
            snippet: 'xxx', // POI的街道地址
            title: 'xxx', // POI的名称
            latitude: 39.903578, // POI的纬度
            longitude: 116.473565, // POI的经度
          } */
          console.log(result);
        },
        onFail: function (err) {
          console.log(err);
        }
      });
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
.mapView {
  background-color: brown;
  height: 300px;
  padding: 0;
}

</style>
