import ddTalk from 'dingtalk-javascript-sdk' ;
// import apisJson from '../../lib/apis'

export default {
  name:'apis',
  method:{
    /*
    * 设置导航栏标题
    * value:导航栏标题内容
    * callBack:成功回调函数
    * errBack:失败回调函数
    * by kong-ly
    * 2017年12月21日
    * */
    neusoftSetNavTitle(value,callBack,errBack){
      ddTalk.ready(function(){
        const dd = ddTalk.apis;
        // 设置导航
        dd.biz.navigation.setTitle({
          title : value,//控制标题文本，空字符串表示显示默认文本
          onSuccess : function(result) {
            if (typeof callBack === 'function') {
              callback(result);
            }
          },
          onFail : function(err) {
            if (typeof errBack === 'function') {
              callback(err);
            }
          }
        });
      });
  }
  }
}
