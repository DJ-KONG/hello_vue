<template>
  <div >
    <el-amap ref="map" vid="Demo"
             :amap-manager="amapManager"
             :center="center"
             :zoom="zoom"
             :plugin="plugin"
             class="demo">
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
    height: 300px;
  }
</style>

<script>
  import address from '../../static/json/address2.json';
  import { Toast } from 'mint-ui';
  import VueAMap from 'vue-amap';
  let amapManager = new VueAMap.AMapManager();
  export default {
    methods: {
      onValuesChange(picker, values) {
//        Toast(values[0]);
//        console.log(JSON.stringify(address[values[0]]));
        picker.setSlotValues(1, address[values[0]])
      }
    },
    data() {
      return {
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
      };
    },
  };
</script>
