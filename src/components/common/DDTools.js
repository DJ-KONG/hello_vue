import ddTalk from 'dingtalk-javascript-sdk' ;
import axios from 'axios' ;
import config from '@/config';
import { Toast } from 'mint-ui' ;

export function getConfig(_config,apilist,callback){
  ddTalk.config ({
        agentId : _config.agentid,
        corpId : _config.corpId,
        timeStamp : _config.timeStamp,
        nonceStr : _config.nonceStr,
        signature : _config.signature,
        jsApiList : apilist,
      });
  ddTalk.error(function(error){
    Toast('dd error:' + JSON.stringify(error));
  });
  if (typeof callback === 'function') {
    callback(ddTalk)
  }
    };
    export function authInfo(callback){
      axios.get(`${config.neusoftURL}/getConfig`,{
        params:{
          signedUrl:window.location.href.split('#')[0],   //鉴权时，只对#号之前url进行鉴权，服务端验权时只验证#号之前
        }
      }).then((response) => {
        if (typeof callback === 'function') {
          callback(response)
        }
      }).catch(function(err){
          console.log(err);
          return err;
        });
}

export function getLocation(){

  const dd = ddTalk.apis;
  dd.device.geolocation.get({
    targetAccuracy : 200,
    coordinate : 1,
    withReGeocode : true,
    useCache:false, //默认是true，如果需要频繁获取地理位置，请设置false
    onSuccess : function(result) {
      console.log(JSON.stringify(result));
    },
    onFail : function(err) {
      Toast(JSON.stringify(err));
      console.log(JSON.stringify(err));
    }
  });
}

