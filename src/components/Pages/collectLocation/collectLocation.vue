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
          Style="width:75%"
          >
        <mt-button type="primary" v-show="visible"  @click.native="queryCustomer" size="small" Style="width:24%;height:97%;margin-left: 3px">
          搜索
        </mt-button>
      </div>
      <div class="search">
      <span>{{area}}——{{route}}</span>
      <mt-button type="primary"  @click.native="openPicker" size="small">
        路线选择
      </mt-button>
      </div>
    </div>
      <mt-tab-container v-model="active">
        <mt-tab-container-item id="list">
          <mt-popup v-model="popupVisible" position="bottom" class="picker">
            <div class="picker">
              <mt-picker :slots="slots"
                         @change="onValuesChange"
                         value-key="name"
              ></mt-picker>
            </div>
          </mt-popup>
            <mt-cell
              v-for="item in defaultResult"
              :title="item.customer_desc"
              :value="item.customer_code"
              :key = "item.customer_code">
              <div>
              <span>定位信息</span>
              <img src="~assets/icon/location.png" width="30" height="30" @click="showLocation(item)" >
              </div>
            </mt-cell>
          <mt-popup
            v-model="loading"
            popup-transition="popup-fade">
            <div class="loadingMask">
            <mt-spinner type="fading-circle" color="#26a2ff" :size="40" >
            </mt-spinner>
            <p style="color:#ffffff">正在加载....</p>
            </div>
          </mt-popup>
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
import axios from 'axios' ;
import AMap from 'AMap';
import AMapUI from 'AMapUI';
import config from '@/config';
import neuTalk from 'neusoft-dingtalk' ;

const url = `${config.neusoftURL}/getConfig`;
const neusoftApis = neuTalk.apis;
const paramValue = {
  targetAccuracy : 200,// 定位精度
  coordinate : 1,     // 高德地图
  withReGeocode : false,
  useCache:true,
}
export default {
  mounted() {
    neusoftApis.navSetTitle.setTitle('用户线路信息',(result)=>{},(error)=>{});
    // neusoftApis.geoLocation.getLocation(url,paramValue,(data)=>{
    //   this.geolocation=data;
    //   this.mapInit();
    // });
    this.mapInit();
    this.getARData((data)=>{
      this.ARData = data.data;
      this.slots[0].values = data.data;
      this.slots[2].values = data.data[0].detailList;
    });
  },
data() {
    return {
      areaValue:'',
      geolocation:{longitude:118.77269,latitude:31.974579},
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
      defaultResult:'' ,
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
    };
  },
  // computed: {
  //
  //   filterResult() {
  //     // return this.defaultResult.filter(item => new RegExp(this.value, 'i').test(item.customer_desc ));
  //   }
  // },
  watch:{
    active: function(newval,oldval) { //此处不要使用箭头函数
     setTimeout(()=>{neusoftApis.navSetTitle.setTitle('用户线路信息',
       (result)=>{},
       (error)=>{console.log(JSON.stringify(error));}
     );},200);
    }
  },
  methods:{
    mapInit(){
      if(this.defaultResult!==''){
        this.geolocation.longitude = this.defaultResult[0].longitude;
        this.geolocation.latitude = this.defaultResult[0].latitude;
      }
      console.log(this.geolocation.longitude,this.geolocation.latitude);
      let mapObj = new AMap.Map('map-container', {
        center: [this.geolocation.longitude,this.geolocation.latitude],
        resizeEnable: true,
        // center:[120.527306,30.16162 ],
        zoom:15
      });
      mapObj.plugin(['AMap.ToolBar'], function () {
        mapObj.addControl(new AMap.ToolBar())
      });
        if(this.defaultResult===''){
          console.log('没有数据溜了');
            return;
        }else{
          console.log('发现数据');
           this.pointSimp(mapObj,this.defaultResult);
        }
      // // console.log('china',this.geolocation.latitude,this.geolocation.longitude);
      // let lngLat = new AMap.LngLat(this.geolocation.longitude,this.geolocation.latitude);
      // let marker = new AMap.Marker({
      //   position: lngLat,
      //   map: mapObj,
      //   draggable:true,
      // });
    },
    pointSimp(mapObj,data){
      const _this = this;
      AMapUI.loadUI(['overlay/SimpleMarker'],
        function(SimpleMarker){
          mapObj.clearMap();  // 清除地图覆盖物
          if(data!==''){
            data.forEach((dataItem)=>{
            let sMarker =   new SimpleMarker({
                map: mapObj,
                // icon: marker.icon,
                bubble:true,
                position: [dataItem.longitude, dataItem.latitude],
                offset: new AMap.Pixel(-12, -36),
                iconLabel: {
                  innerHTML: '<i>测</i>', //设置文字内容
                  style: {
                    color: '#fff', //设置文字颜色
                    fontSizesize:'15'

                  }
                },
              });
              //实例化信息窗体
              let title = '<span style="font-size:12px">方恒假日酒店</span><span style="font-size:12px;color:#F00;">价格:318</span>',
                content = [];
              content.push('<span style="font-size:12px">地址：北京市朝阳区</span>');
              content.push("电话：010-64733333");
              let infoWindow = new AMap.InfoWindow({
                isCustom: true,  //使用自定义窗体
                content: _this.createInfoWindow(title, content.join("<br/>"),mapObj),
                // offset: new AMap.Pixel(-12, -36),
              });
              //监听事件
              sMarker.on('touchstart', function(e) {
                console.log(_this);
                infoWindow.open(mapObj,sMarker.getPosition());
                // _this.$router.push({ name: 'HomePages', params: { dd_nav_bgcolor: 'FF5E97F6' } });
              });
            });
          }
        }
      );
    },
   closeInfoWindow(mapObj) {
     mapObj.clearInfoWindow();
},
    //构建自定义信息窗体
    createInfoWindow(title, content,mapObj) {
  let info = document.createElement("div");
  info.className = "info";

  //可以通过下面的方式修改自定义窗体的宽高
  //info.style.width = "400px";
  // 定义顶部标题
  let top = document.createElement("div");
  let titleD = document.createElement("div");
  let closeX = document.createElement("img");
  top.className = "info-top";
  titleD.innerHTML = title;
  closeX.src = "https://webapi.amap.com/images/close2.gif";
  closeX.onclick = this.closeInfoWindow(mapObj);

  top.appendChild(titleD);
  // top.appendChild(closeX);
  info.appendChild(top);

  // 定义中部内容
  let middle = document.createElement("div");
  middle.className = "info-middle";
  middle.style.backgroundColor = 'white';
  middle.innerHTML = content;
  info.appendChild(middle);

  // 定义底部内容
  let bottom = document.createElement("div");
  bottom.className = "info-bottom";
  bottom.style.position = 'relative';
  bottom.style.top = '0px';
  bottom.style.margin = '0 auto';
  let sharp = document.createElement("img");
  sharp.src = "https://webapi.amap.com/images/sharp.png";
  bottom.appendChild(sharp);
  info.appendChild(bottom);
  return info;
},
    showLocation(item){
      console.log(item.customer_desc);
      this.$router.push({ name: 'detailMapView', params: {}});
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
          //console.log(this.defaultResult);
          //console.log(`数据记录数:${this.defaultResult.length}${this.loading}`);
          this.loading = false;
          this.currentPage = this.currentPage+1
          //console.log(`loading状态：${this.loading}`);
          this.hideLoading();
        });
      },2500);
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
      this.loading = true;
      setTimeout(() =>{
        this.getCustomer((data)=>{
            this.defaultResult=data;
         // console.log(this.defaultResult);
          //console.log(`数据记录数:${this.defaultResult.length}${this.loading}`);
          this.loading = false;
          this.currentPage = this.currentPage+1
          //console.log(`loading状态：${this.loading}`);
          this.loading = false;
          this.mapInit();
        });
      },2500);
    },
    onValuesChange(picker, values) {
     // console.log('values[0]',values[0]);
      //console.log('values[1]',values[1]);
      //console.log('typeOf(values[0])',typeof values[0]);
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
  /*background-color: brown;*/
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
  margin-bottom:2px;
}
  .loadingMask{
    display: flex;
    background-color: grey;
    border:4px solid grey;
  }

</style>
