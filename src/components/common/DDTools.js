import dd from 'dingtalk-javascript-sdk' ;

export default {
  methods :{
    getConfig(_config,apilist){
      dd.config({
        agentId : _config.agentid,
        corpId : _config.corpId,
        timeStamp : _config.timeStamp,
        nonceStr : _config.nonceStr,
        signature : _config.signature,
        jsApiList : apilist,
      });
    }
  }
}

