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
                   :plugin="plugin"
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
import city from '@/components/common/city' ;

import location_icon from "assets/icon/list_icon.png" ;

const today = new Date();

let amapManager = new VueAMap.AMapManager();

export default {
  mounted() {
    // this.dtkConfigInit();
    this.getCustomer();
  },
  data() {
    return {
      active: 'list' ,
      value:'' ,
      DTKconfig: [],
      apilist:   [ 'biz.map.locate','device.geolocation.get' ],
      defaultResult: [
        {name: '张三',lnglat: [116.405285, 39.904989]} ,
        {name: 'Banana',lnglat: [116.505285, 39.904989]} ,
        {name: 'Orange',lnglat: [116.605285, 39.904989]} ,
        {name: 'Durian',lnglat: [116.705285, 39.904989]} ,
        {name: 'Lemon',lnglat: [116.805285, 39.904989]} ,
        {name: 'Peach',lnglat: [116.905285, 39.904989]} ,
        {name: 'Cherry',lnglat: [116.405285, 39.904989]} ,
        {name: 'Berry',lnglat: [116.305285, 39.904989]} ,
        {name: 'Core',lnglat: [116.205285, 39.904989]} ,
        {name: 'Fig',lnglat: [116.105285, 39.904989]} ,
        {name: 'Haw',lnglat: [116.605285, 39.804989]} ,
        {name: 'Melon',lnglat: [116.605285, 39.704989]} ,
        {name: 'Plum',lnglat: [116.605285, 39.604989]} ,
        {name: 'Pear',lnglat: [116.605285, 39.504989]} ,
        {name: 'Peanut',lnglat: [116.605285, 39.404989]} ,
        {name: 'Other',lnglat: [116.605285, 39.304989]} ,
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
      center: [116.405285, 39.904989],
      amapManager,
      events: {
        init(map) {
          let style = [{
            url: 'http://a.amap.com/jsapi_demos/static/images/mass0.png',
            anchor: new AMap.Pixel(6, 6),
            size: new AMap.Size(11, 11)
          },{
            url: 'http://a.amap.com/jsapi_demos/static/images/mass1.png',
            anchor: new AMap.Pixel(4, 4),
            size: new AMap.Size(7, 7)
          },{
            url: 'http://a.amap.com/jsapi_demos/static/images/mass2.png',
            anchor: new AMap.Pixel(200, 200),
            size: new AMap.Size(5, 5)
          }
          ];

          let mass = new AMap.MassMarks(city.city,{
            opacity:0.8,
            zIndex: 111,
            cursor:'pointer',
            style:style
          });
          let marker = new AMap.Marker({content:' ',map:map})
          mass.on('mouseover',function(e){
            marker.setPosition(e.data.lnglat);
            marker.setLabel({content:e.data.name})
          })
          mass.setMap(map);
        }
      },
      plugin: [ 'ToolBar',{
        pName: 'MapType',
        defaultType: 0,
      }],
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
          Toast(result.adName+result.snippet);
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
    },
    getCustomer(){
      axios.get(`${config.serverURL}/Customer`,{
        params:{
          zone:window.location.href.split('#')[0],   //鉴权时，只对#号之前url进行鉴权，服务端验权时只验证#号之前
        }
      }).then((response) => {
        if (typeof callback === 'function') {
          callback(response)
        }
      }).catch(function(err){
        console.log(err);
        return err;
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
