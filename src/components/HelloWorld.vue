<template>
  <div >
    <p>{{cityName}}</p>

    <!--<el-amap ref="map" vid="Demo"-->
             <!--:amap-manager="amapManager"-->
             <!--:center="center"-->
             <!--:zoom="zoom"-->
             <!--:plugin="plugin"-->
             <!--:events="events"-->
             <!--class="demo">-->
      <!--<el-amap-marker v-for="marker in markers" :key = "marker.name" :position="marker.position" :events="marker.events"></el-amap-marker>-->
      <!--<el-amap-info-window v-for="window in windows" :key = "window.name" :template="window.template"  :position="window.position" :visible="window.visible" :content="window.content"></el-amap-info-window>-->
    <!--</el-amap>-->
    <!--<mt-popup v-model="popupVisible" position="bottom" >-->
      <!--<mt-picker :slots="slots" @change="onValuesChange"  value-key="name"></mt-picker>-->
    <!--</mt-popup>-->
    <!--<div  v-show="load">-->
      <!--<p class="page-infinite-loading">-->
        <!--<mt-spinner type="fading-circle" color="#26a2ff" :size="40"></mt-spinner>-->
        <!--正在加载....-->
      <!--</p>-->

    <!--</div>-->
    <mt-button type="primary"  @click.native="handleClick">primary</mt-button>
    <!--<mt-search v-model="value" cancel-text="取消" placeholder="搜索"-->
               <!--show></mt-search>-->
    <!--<el-amap vid="amapDemo"-->
             <!--:center="center"-->
             <!--:map-manager="amapManager"-->
             <!--:zoom="zoom"-->
             <!--:events="events" class="amap-demo">-->
    <!--</el-amap>-->
      <!--<mt-picker :slots="slots" @change="onValuesChange"  value-key="name"></mt-picker>-->
    <div id="map-container" style="height:400px"> </div>
  </div>
</template>

<style scoped>
  .demo {
    height: 450px;
  }
  .page-infinite-loading{
    /*background-color: brown;*/
    position: fixed;
    top: 50%;
    display: flex;
    justify-content:center;
    align-items: center;
    width: 100%;

  }
</style>

<script>
  import { Toast } from 'mint-ui';
  // import VueAMap from 'vue-amap';
  import axios from 'axios' ;
  import config from '@/config';
  import AMap from 'AMap';
  import ddTalk from 'dingtalk-javascript-sdk' ;
  import { authInfo,getConfig } from '@/components/common/DDTools' ;


  // let amapManager = new VueAMap.AMapManager();
  const _this = this;
  export default {
    mounted() {
      this.dtkConfigInit();
      this.getLocation((data)=>{this.geolocation=data;this.init();});

      // this.getARData((data)=>{
      //   this.ARData = data.data;
      //   console.log('json文件',arJson);
      //   console.log('ARdata', this.ARData);
      //   this.slots[0].values = data.data;
      //   this.slots[2].values = data.data[0].detailList;
      // });
    },
    methods: {
      dtkConfigInit(){
        authInfo((data) => {
          this.DTKconfig = data.data;
          getConfig(this.DTKconfig,this.apilist,(data)=>{
            ddTalk.ready(function(){
              const dd = ddTalk.apis;
              // 设置导航
              dd.biz.navigation.setTitle({
                title: '高德地图钉钉定位测试'
              });
            });
          });
        })

      },
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
      onValuesChange(picker, values) {
//        Toast(values[0]);
//        console.log(JSON.stringify(values[1]));
       if(values[0]!=null){
         picker.setSlotValues(1, values[0].detailList);
       }

        // picker.setSlotValues(1, address[values[0]])
      },
      handleClick(){
        // this.load = !this.load;
        this.popupVisible = true;
      },
      getARData(callback){
        axios.get(`${config.neusoftURL}/getAR`,{
          responseType: 'json'
        }).then((response) => {
          if (typeof callback === 'function') {
            callback(response)
          }
          // console.log(response.data[0].name);
        }).catch(function(err){
          console.log(err);
          return err;
        });
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
              _this.geolocation = result;
              addrList.push(result);
              if (typeof callbacks === 'function') {
                callbacks(result)
              }
            },
            onFail : function(err) {
              Toast(JSON.stringify(err));
              console.log(JSON.stringify(err));
            }
          });
        });
      },
    },
    data() {
      return {
        popupVisible:true,
        value:'',
        load:false,
        markers:[],
        windows:[],
        ARData:[],
        msg: 'vue-amap向你问好！',
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
            //this.ARData[2].detailList,
            className: 'slot3',
            textAlign: 'left'
          }
        ],
        geolocation:'1',
        DTKconfig:'',
        apilist:   [ 'biz.map.locate','device.geolocation.get' ],
      };
    },
  };
</script>
