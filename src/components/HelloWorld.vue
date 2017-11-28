<template>
  <div>
    <!--<mt-cell class="listCell"-->
      <!--title="标题文字"-->
      <!--to="//github.com"-->
      <!--is-link-->
      <!--value="带链接">-->
    <!--</mt-cell>-->
    <mt-picker :slots="slots" @change="onValuesChange"  ></mt-picker>
    </div>
</template>

<script>
  import address from '../../static/json/address2.json';
  import { Toast } from 'mint-ui';

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
        ]
      };
    },
  };
</script>
<style scoped>

</style>
