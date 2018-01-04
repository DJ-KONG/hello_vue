<template>
  <div class="mapView">
    <p>{{this.test}}</p>
    <div id="map-container" style="height:350px"> </div>
    <div class="gridCell">
      <mt-cell title="客户名称" value="张老三"></mt-cell>
      <mt-cell title="客户地址" value="东软研发中心"></mt-cell>
      <mt-cell title="客户照片" >
        <mt-button size="small" type="primary" >拍照上传</mt-button>
      </mt-cell>
      <mt-button @click="doSure" class="bigButton"><a class="btn-font">确定</a></mt-button>
    </div>
  </div>
</template>

<script>
  import AMap from 'AMap';
  import neuTalk from 'neusoft-dingtalk' ;

  const neusoftApis = neuTalk.apis;
	export default {
    name: "detail-info-map-view",
    mounted() {
    this.init();
    neusoftApis.navSetTitle.setTitle('用户详细信息',(result)=>{},(error)=>{});
  },
  data(){
    return{
      geolocation:{longitude:'118.77269',latitude:'31.974579'},
      newlocation:{},
      test:'',
    }
  },
    methods:{
      doSure(){},
      init(){
        const _this = this;
        let mapObj = new AMap.Map('map-container', {
          center: [this.geolocation.longitude, this.geolocation.latitude],
          zoom: 15
        });
        mapObj.plugin(['AMap.ToolBar'], function () {
          mapObj.addControl(new AMap.ToolBar())
        });
        // console.log('china',this.geolocation.latitude,this.geolocation.longitude);
        let lngLat = new AMap.LngLat(this.geolocation.longitude,this.geolocation.latitude);
        let marker = new AMap.Marker({
          position: lngLat,
          map: mapObj,
          draggable:true,
        });
        let circle = new AMap.Circle({
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
        marker.on('dragend',function(e) {
            // console.log('拖拽坐标',e.lnglat.lat,e.lnglat.lng,e);
            _this.newlocation.latitude = e.lnglat.lat;
            _this.newlocation.longitude = e.lnglat.lng;
          });
        circle.setMap(mapObj);
      },

    }
	}
</script>

<style scoped>

</style>
