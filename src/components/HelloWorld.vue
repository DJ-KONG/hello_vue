<template>
  <div >
    <p>{{cityName}}</p>
    <el-amap ref="map" vid="Demo"
             :amap-manager="amapManager"
             :center="center"
             :zoom="zoom"
             :plugin="plugin"
             :events="events"
             class="demo">
      <el-amap-marker v-for="marker in markers" :key = "marker.name" :position="marker.position" :events="marker.events"></el-amap-marker>
      <el-amap-info-window v-for="window in windows" :key = "window.name" :template="window.template"  :position="window.position" :visible="window.visible" :content="window.content"></el-amap-info-window>
    </el-amap>
    <!--<el-amap vid="amapDemo"-->
             <!--:center="center"-->
             <!--:map-manager="amapManager"-->
             <!--:zoom="zoom"-->
             <!--:events="events" class="amap-demo">-->
    <!--</el-amap>-->
  </div>
</template>

<style scoped>
  .demo {
    height: 450px;
  }
</style>

<script>
  import address from '../../static/json/address2.json';
  import { Toast } from 'mint-ui';
  import VueAMap from 'vue-amap';
  import city from '@/components/common/city' ;



  let amapManager = new VueAMap.AMapManager();
  export default {
    mounted() {
      let markers = [];
      let windows = [];

      let num = 10;
      let self = this;

      for (let i = 0 ; i < num ; i ++) {
        markers.push({
          name:i,
          position: [121.59996, 31.197646 + i * 0.001],
          events: {
            click() {
              self.windows.forEach(window => {
                window.visible = false;
              });

              self.$nextTick(() => {
                self.windows[i].visible = true;
              });
            }
          }
        });

        windows.push({
          name:i,
          position: [121.59996, 31.197646 + i * 0.001],
          template: `<p>${i}</p>`,
          visible: false
        });
      }

      this.markers = markers;
      this.windows = windows;
    },
    methods: {
      onValuesChange(picker, values) {
//        Toast(values[0]);
//        console.log(JSON.stringify(address[values[0]]));
        picker.setSlotValues(1, address[values[0]])
      }
    },
    data() {
      return {
        markers:[],
        windows:[],
        msg: 'vue-amap向你问好！',
        slots: [
          {
            flex: 1,
            values: Object.keys(address),
            className: 'slot1',
            textAlign: 'right'
          }, {
            divider: true,
            content: '-',
            className: 'slot2'
          }, {
            flex: 1,
            values:  Object.values(address)[0],
            className: 'slot3',
            textAlign: 'left'
          }
        ],
        cityName:city.data().city[0].name,
        zoom: 16,
        center: [121.59996, 31.197646],
        amapManager,
        plugin: ['ToolBar'],
        events: {
          init(map) {
            //#######################################海量描点
            // let style = [{
            //   url: 'http://a.amap.com/jsapi_demos/static/images/mass0.png',
            //   anchor: new AMap.Pixel(20, 20),
            //   size: new AMap.Size(11, 11)
            // },{
            //   url: 'http://a.amap.com/jsapi_demos/static/images/mass1.png',
            //   anchor: new AMap.Pixel(20, 20),
            //   size: new AMap.Size(7, 7)
            // },{
            //   url: 'http://a.amap.com/jsapi_demos/static/images/mass2.png',
            //   anchor: new AMap.Pixel(20, 20),
            //   size: new AMap.Size(5, 5)
            // }
            // ];
            //
            // let mass = new AMap.MassMarks(city.data().city,{
            //   opacity:0.8,
            //   zIndex: 111,
            //   cursor:'pointer',
            //   style:style
            // });
            // let marker = new AMap.Marker({content:' ',map:map})
            // mass.on('mouseover',function(e){
            //   marker.setPosition(e.data.lnglat);
            //   marker.setLabel({content:e.data.name})
            // })
            // mass.setMap(map);
            //################################海量描点
          }
        }
      };
    },
  };
</script>
