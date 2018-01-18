import Vue from 'vue'
import App from './App'
import router from './router'
import CONFIG from './config'
import FastClick from 'fastclick'
import wxFc from './config/wx'
import store from './store'
import callbackUrl from './callbackUrl'
import 'mint-ui/lib/style.css'
import Indicator from 'mint-ui/lib/indicator'

!function(doc, win) {
  var clientWidth = win.innerWidth
    || doc.documentElement.clientWidth
    || doc.body.clientWidth;
  var docEl = doc.documentElement;
  var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
  var recalc = function() {
    if (!clientWidth) return
    docEl.style.fontSize = 100 * (clientWidth / 750) + 'px'
  };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
}(document, window)

FastClick.attach(document.body)

!async function () {
  store.commit('setMachineNo')
  var sc = document.createElement('script')

  if (process.env.NODE_ENV !== 'development') {
    //回调授权
    await callbackUrl()
    //配置初始化
    if (CONFIG.isWx) {
      sc.src = 'http://res.wx.qq.com/open/js/jweixin-1.2.0.js'
      document.getElementsByTagName('body')[0].appendChild(sc)
      sc.onload = function () {
        wxFc()
      }
    } else {
      sc.src = 'https://a.alipayobjects.com/g/h5-lib/alipayjsapi/3.0.5/alipayjsapi.inc.min.js'
      document.getElementsByTagName('body')[0].appendChild(sc)
    }
  }


  Vue.prototype.Indicator = Indicator
  new Vue({
    store,
    el: '#app',
    router,
    template: '<App/>',
    components: {App}
  })
}()
