<template>
  <div class="dutyList">
    <div class="arspan">
      <div class="search">
        <input
          ref="input"
          @click="visible = true"
          @blur = "visible = false"
          type="search"
          v-model="queryName"
          :placeholder="placeholder"
          >
        <mt-button type="primary" v-show="visible"  @click.native="queryCustomer" size="small">
          搜索
        </mt-button>
      </div>
      <div>
      <span>{{area}}——{{route}}</span>
      <mt-button type="primary"  @click.native="openPicker" size="small">
        路线选择
      </mt-button>
      </div>
    </div>
      <mt-tab-container v-model="active">
        <mt-tab-container-item id="list">
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
          <mt-popup v-model="popupVisible" position="bottom" class="picker">
            <div class="picker">
              <mt-picker :slots="slots"
                         @change="onValuesChange"
                         value-key="name"
              ></mt-picker>
            </div>
          </mt-popup>
            <!--<div  style="margin-top: 10px;padding-right:0;" v-infinite-scroll="loadMore"-->
                  <!--:infinite-scroll-disabled=this.loading-->
                  <!--infinite-scroll-distance="5"-->
                  <!--infinite-scroll-immediate-check=false-->
                  <!--&gt;-->
              <!--:right="rightValue"-->
            <mt-cell
              v-for="item in defaultResult"
              :title="item.customer_desc"
              :value="item.customer_code"
              :key = "item.customer_code">
              <div>
              <span>定位信息</span>
              <img src="~assets/icon/location.png" width="30" height="30" @click="showLocation" >
              </div>
            </mt-cell>
            <!--</div>-->
            <!--<div  v-show="loading">-->
              <!--<p class="page-infinite-loading">-->
                <!--<mt-spinner type="fading-circle" color="#26a2ff" :size="40"></mt-spinner>-->
                <!--正在加载....-->
              <!--</p>-->
            <!--</div>-->
        </mt-tab-container-item>
        <mt-tab-container-item id="map">
          <mt-popup v-model="popupVisibleMap" position="bottom" class="picker">
            <div class="picker">
              <mt-picker :slots="slots"
                         @change="onValuesChange"
                         value-key="name"
              ></mt-picker>
            </div>
          </mt-popup>
          <div class="mapView">
            <div id="map-container" style="height:400px"> </div>
          </div>
        </mt-tab-container-item>
      </mt-tab-container>
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
let _this = this;
export default {
  mounted() {
    this.dtkConfigInit();
    // this.getCustomer((data)=>this.initList(data));
    this.getARData((data)=>{
      this.ARData = data.data;
      this.slots[0].values = data.data;
      this.slots[2].values = data.data[0].detailList;
    });
    this.init();
  },
  data() {
    return {
      areaValue:'',
      routeValue:'',
      visible:false,
      placeholder:'搜索',
      longitude:'',
      latitude:'',
      popupVisible:false,
      popupVisibleMap:false,
      area:'',
      route:'',
      pageSize:15,
      loading:false,
      currentPage:-1,
      active: 'list' ,
      queryName:'' ,
      ARData:[],
      slots: [
        {
          flex: 1,
          values: '',
          className: 'slot1',
          textAlign: 'right'
        }, {
          divider: true,
          content: '-',
          className: 'slot2'
        }, {
          flex: 1,
          values:  '',
          className: 'slot3',
          textAlign: 'left'
        }
      ],
      DTKconfig: [],
      apilist:   [ 'biz.map.locate','device.geolocation.get' ],
      defaultResult: [] ,
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
      init(){
        let mapObj = new AMap.Map('map-container', {
          center: [this.geolocation.longitude, this.geolocation.latitude],
          zoom: 15
        });
        mapObj.plugin(['AMap.ToolBar'], function () {
          mapObj.addControl(new AMap.ToolBar())
        });
        console.log('china',this.geolocation.latitude,this.geolocation.longitude);
        let lngLat = new AMap.LngLat(this.geolocation.longitude,this.geolocation.latitude);
        let marker = new AMap.Marker({
          position: lngLat,
          map: mapObj,
          draggable:true,
        });
        var circle = new AMap.Circle({
          center: new AMap.LngLat(this.geolocation.longitude,this.geolocation.latitude),// 圆心位置
          radius: 200, //半径
          strokeColor: "#3294ff", //线颜色
          strokeOpacity: 0.2, //线透明度
          strokeWeight: 3,    //线宽
          fillColor: "#1791fc", //填充色
          fillOpacity: 0.05,//填充透明度
          // map:mapObj
        });
        let oldLnglat = new AMap.LngLat(118.773355,31.974288);
        let marker2 = new AMap.Marker({
          position:oldLnglat,
          icon: new AMap.Icon({
            size: new AMap.Size(60, 70),  //图标大小
            image: "http://webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png",
            imageOffset: new AMap.Pixel(0, -60),
          }),
          map:mapObj,
          draggable:true,
          raiseOnDrag: true
        });
        if(!circle.contains(oldLnglat)){
          circle.setOptions({
            fillColor: "#fc0e27", //填充色
            strokeColor: "#fc0e27", //线颜色
          });
        }

        circle.setMap(mapObj);
      },
    };
  },
  // computed: {
  //
  //   filterResult() {
  //     // return this.defaultResult.filter(item => new RegExp(this.value, 'i').test(item.customer_desc ));
  //   }
  // },
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
    showLocation(){
        this.getLocation((data)=>{
          this.openMap(data);
        })
    },
    loadMore() {
      this.loading = true;
      this.showLoading();
      setTimeout(() =>{
        this.getCustomer((data)=>{
          for (let i = 0; i < data.length; i++) {
            this.defaultResult.push(data[i]);
          }
          // Toast(_this.defaultResult.length);
          console.log(this.defaultResult);
          console.log(`数据记录数:${this.defaultResult.length}${this.loading}`);
          this.loading = false;
          this.currentPage = this.currentPage+1
          console.log(`loading状态：${this.loading}`);
          this.hideLoading();
        });
      },2500);
    },
    showLoading(){
      ddTalk.ready(function(){
      const dd = ddTalk.apis;
      dd.device.notification.showPreloader({
        text: "使劲加载中..", //loading显示的字符，空表示不显示文字
        showIcon: true, //是否显示icon，默认true
      })
    })
    },
    hideLoading(){
      ddTalk.ready(function(){
        const dd = ddTalk.apis;
        dd.device.notification.hidePreloader({
        })
      })

    },
    getCustomer(callback){
      axios.get(`${config.neusoftURL}/Customer`,{
        params:{
          pageSize:this.pageSize,   //分页大小
          curPage:this.currentPage,// 当前页
          area:this.areaValue,
          route:this.routeValue,
          queryName:this.queryName,
        }
      }).then((response) => {
        if (typeof callback === 'function') {
          callback(response.data)
        }
      }).catch(function(err){
        console.log(err);
        return err;
      });
},
    queryCustomer(){
      // Toast(this.queryName);
      this.loading = true;
      this.showLoading();
      setTimeout(() =>{
        this.getCustomer((data)=>{
            this.defaultResult=data;
          console.log(this.defaultResult);
          console.log(`数据记录数:${this.defaultResult.length}${this.loading}`);
          this.loading = false;
          this.currentPage = this.currentPage+1
          console.log(`loading状态：${this.loading}`);
          this.hideLoading();
        });
      },2500);
    },
    onValuesChange(picker, values) {
      console.log('values[0]',values[0]);
      console.log('values[1]',values[1]);
      console.log('typeOf(values[0])',typeof values[0]);
      if(typeof values[0]!="undefined"){
        picker.setSlotValues(1, values[0].detailList);
        this.area=values[0].name;
        this.areaValue = values[0].id;
        if(typeof values[1]!="undefined"){
        this.route = values[1].name;
        this.routeValue =  values[1].id;
        }
      }
    },
    getARData(callback){
      axios.get(`${config.neusoftURL}/getAR`,{
      }).then((response) => {
        if (typeof callback === 'function') {
          callback(response)
        }
      }).catch(function(err){
        console.log(err);
        return err;
      });
    },
    openPicker() {
      Toast(this.active)
      if(this.active==='list'){
        this.popupVisible = true;
      }else if(this.active==='map'){
        this.popupVisibleMap = true;
      }
    },
  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dutyList{
  /*background-color: #ff2231;*/
  height: 100%;
  height: 100vh;
  margin: 5px;
  padding: 5px;
  }
.mapView {
  /*margin-top: 30px;*/
  background-color: brown;
  height: 510px;
  padding: 0;
}
.arspan{
  position: relative;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: #d9d9d9;
  box-sizing: border-box;
  /*display: -webkit-box;*/
  /*display: -ms-flexbox;*/
  /*display: flex;*/
  padding: 8px 10px;
  z-index: 1;
}
.picker{
  width:100%;
}
.search{
  display: flex;
  align-content: center;
  align-items: stretch;
  height:30px;
  width:100%;
}
.page-infinite-loading{
  background-color: grey;
  position: fixed;
  bottom: 50%;
  display: flex;
  justify-content:center;
  align-items: center;
  width: 50%;

  }

</style>
