import $axios from 'axios'
import CONFIG from './../config/index'
import {jsonToStr} from "../util/index";
import {getErrMsg,SetCookie} from "../util/index";
import MessageBox from 'mint-ui/lib/message-box'

$axios.interceptors.response.use(function(response) {
    // 错误码信息
    let res = response.data
    if (res.status_code != 200) {
        MessageBox({
            title: '提示',
            message: getErrMsg(res.status_code, res.message)
        })
    }
    return res
}, function(error) {
    // Do something with response error
    console.log(error, '全局err')
    MessageBox({
        title: '提示',
        message: '网络出错,请重新扫描二维码'
    })
    SetCookie('token_', '')
    return Promise.reject(error);
})

export default {
  getUser: function (params) {
    return $axios.get(CONFIG.url + 'api/player/info', {
      params: params
    })
  },
  getCoinList: function (params) {
    return $axios.get(CONFIG.url + 'api/machine/coin_price', {
      params: params
    })
  },
  getConsume: function (params) {
    return $axios.get(CONFIG.url + 'api/player/consume', {
      params: params
    })
  },
  getPayJssdk: function (params) {
    return $axios.get(CONFIG.url + 'api/wechat/order', {
      params: params
    })
  },
  getPayAlipay:function (params) {
    return $axios.post(CONFIG.url + 'api/alipay/tradeOrder', jsonToStr(params))
  },
  getPayTpp: function (params) {
    return $axios.get(CONFIG.url + 'api/tpp/order', {
      params: params
    })
  },
  judgeMachine: function (params) {
    return $axios.get(CONFIG.url + 'api/machine/info', {
      params: params
    })
  },
  getFreeCoin: function (params) {
    return $axios.post(CONFIG.url + 'api/free/order', jsonToStr(params))
  },
  startingDevice: function (params) {
    return $axios.post(CONFIG.url + 'api/machine/launch', jsonToStr(params))
  },
  InfiniteGame:function (params) {
    return $axios.post(CONFIG.url + 'api/machine/unlimited', jsonToStr(params))
  },
  getCoupons:function (params) {
    return $axios.get(CONFIG.url +'api/operation', {
      params: params
    })
  },
  consumer:function (params) {
    return $axios.post(CONFIG.url +'api/player/coupon/receive', jsonToStr(params))
  },
  useCoupons:function (params) {
    return $axios.get(CONFIG.url + 'api/machine/info', {
      params: params
    })
  }
}
