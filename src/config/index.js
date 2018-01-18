import {getParamByName, GetCookie} from '../util'

function IsWeixinOrAlipay() {
  var ua = window.navigator.userAgent.toLowerCase()
  //判断是不是微信
  if (ua.match(/MicroMessenger/i) == 'micromessenger') return "WeiXin"
  //判断是不是支付宝
  if (ua.match(/AlipayClient/i) == 'alipayclient') return "Alipay"
  //判断是不是淘票票
  if (ua.match(/tbmovie/i) == 'tbmovie') return "Tpp"
  //哪个都不是
  return "false"
}


let CONFIG = {
  url: document.URL.indexOf('catchme') != -1 ?  'http://front.catchme.com.cn/' : 'http://front.5zhua.cn/',
  version: '1.0.0',
  token: process.env.NODE_ENV == 'development' ?'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vZnJvbnQuNXpodWEuY24vd2VjaGF0L29hdXRoIiwiaWF0IjoxNTE2MjQ1MjMwLCJleHAiOjE1MTY0NjEyMzAsIm5iZiI6MTUxNjI0NTIzMCwianRpIjoia3J6dkFYa3pMQTVXWmloVSIsInN1YiI6MTN9.uMLbb58Il5EABUkktmqEgpi-LWmpMGrOnv8XwWesnQo' : (getParamByName('token') || GetCookie('token_')),
  // token: getParamByName('token') || GetCookie('token_'),
  machine_no: getParamByName('machine') || 'CATCH_100024',
  u: function () {
    return `?machine=${this.machine_no}&token=${this.token}`
  },
  isWx: IsWeixinOrAlipay() === 'WeiXin' ? true : false,
  isAlipay: IsWeixinOrAlipay() === 'Alipay' ? true : false,
  isTpp: IsWeixinOrAlipay() === 'Tpp' ? true : false
}


export default CONFIG
