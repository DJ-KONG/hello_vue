import ddTalk from 'dingtalk-javascript-sdk' ;
// import apisJson from '../../lib/apis'

export default {
  name:'apis',
  method:{
    neusoftApis(methodName,paraValue,callback,errorback){
      let ddApiNames = apisJson[methodName];
      if (typeof callback === 'function') {
        paraValue['onSuccess']=callback;
      }
      if (typeof errorback === 'function') {
        paraValue['onFail']=errorback;
      }
      let value =JSON.stringify(paraValue, function(key, val) {
        if (typeof val === 'function') {
          return val + '';
        }
        return val;
      });
      console.log(value);

      // ddApiNames = eval(ddApiNames);

      ddTalk.ready(function(){
        const dd = ddTalk.apis;
        const cmdValue = `ddTalk.apis.${ddApiNames}(${value})`
        console.log(cmdValue);
        const cmd = new Function(cmdValue);
        cmd();
        // 设置导航
        // dd.biz.navigation.setTitle({
        //   title : '邮箱正文',//控制标题文本，空字符串表示显示默认文本
        //   onSuccess : function(result) {
        //     /*结构
        // 	{
        // 	}*/
        //   },
        //   onFail : function(err) {}
        // });
      });
    },
    neusoftSetNavTitle(){
      ddTalk.ready(function(){
        const dd = ddTalk.apis;
        // 设置导航
        dd.biz.navigation.setTitle({
          title : '邮箱正文',//控制标题文本，空字符串表示显示默认文本
          onSuccess : function(result) {
            /*结构
						{
						}*/
          },
          onFail : function(err) {}
        });
      });
  }
  }
}
