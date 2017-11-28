<template>
  <div class="dutyList">
    <div class = "datePick">
      <a class="subTitle">订单日期：</a>
      <a class="subTitle">{{this.dateString}}</a>
      <img>
      <mt-button @click="openPicker" class="pickBtn">日期选择</mt-button>
      <mt-datetime-picker
        ref="picker"
        type="date"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        v-model="pickerValue"
        @confirm="handleConfirm">
      </mt-datetime-picker>
    </div>
    <div class="dbTitle">
      <span class="subTitle">调度</span>
    </div>
    <div class="cell">
      <a class="listTitle" style="margin-left:30px;">车牌号</a>
      <a  class="listTitle" style="margin-left: 120px;">司机</a>
    </div>
    <div class="bottom-button">
      <mt-button @click="openAction" class="bigButton"><a class="btn-font">操作</a></mt-button>
      <mt-actionsheet
        :actions="menuList"
        v-model="sheetVisible">
      </mt-actionsheet>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui';
import ddTalk from 'dingtalk-javascript-sdk';

const today = new Date();

export default {
  data() {
    return {
      pickerValue: new Date(),
      dateString: `${today.getFullYear()}年${today.getMonth()}月${today.getDate()}日`,
      menuList: [
        {
          name: '扫码',
          method: this.doSM,
        },
        {
          name: '坐标采集',
          method: this.doGetLocation,
        },
      ],
      sheetVisible: false,
    };
  },
  mounted() {
    ddTalk.ready(function(){
      const dd = ddTalk.apis;
      // 设置导航
      dd.biz.navigation.setTitle({
        title: '今日任务'
      });
    });
  },
  methods: {
    openPicker() {
      this.$refs.picker.open();
    },
    handleConfirm(pickDate) {
      this.dateString = `${pickDate.getFullYear()}年${pickDate.getMonth()}月${pickDate.getDate()}日`;
      Toast(`已选择的时间为${this.dateString}`);
    },
    openAction() {
      this.sheetVisible = true;
    },
    doSM() {
      const instance = Toast('这是扫码');
      setTimeout(() => {
        instance.close();
      }, 1000);
      ddTalk.ready(function() {
        const dd = ddTalk.apis;
        dd.biz.util.scan({
          type: "all", // type 为 all、qrCode、barCode，默认是all。
          onSuccess: function (data) {
            //alert("扫描内容是："+JSON.stringify(data));
          },
          onFail: function (err) {
            alert(JSON.stringify(err));
          }
        });
      });
    },
    doGetLocation() {
      Toast('这是获取坐标');
    },
  },
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
.datePick{
 /*float:left;*/
  height: 30px;
  /*background-color: #ff2231;*/
  margin-top: 5px;
}
.pickBtn{
    float:right;
    position:relative;
    vertical-align: bottom;
    height: 28px;
  }
.subTitle{
  float: left;
  font-size: 18px;
  position:relative;
  vertical-align: bottom;
  margin-top: 5px;
  margin-left: 5px;
}
  .dbTitle {
    background-color: darkgrey;
    margin-top: 5px;
    height: 30px;
}
  span.subTitle{
    float: left;
    font-size: 18px;
  }
  .cell{
    display: flex;
    justify-content:space-between;
    padding: 20px;
  }
  .cell .listTitle{
  font-size: 18px;
  display: flex;
  flex: 1;
  justify-content: center;
  }
  .bottom-button{
    position: fixed;
    bottom: 8px;
    width: calc(100% - 31px);
  }
  .bigButton{
    width:100%;
    background-color: #3294ff;
  }
  .bigButton .btn-font{
       color: white;
     }

</style>
