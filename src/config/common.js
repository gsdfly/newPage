// import axios from 'axios'
// import CONFIG from './index'
// import MessageBox from 'mint-ui/lib/message-box'
// import { SetCookie } from '../util'
//
// let instance = axios.create({
//     baseURL: CONFIG.url + 'api/',
//     headers: {'Authorization': 'Bearer '+CONFIG.token}
// })
//
// instance.interceptors.response.use(function(response) {
//     // 错误码信息
//     let res = response.data
//     alert('接口返回信息'+JSON.stringify(res));
//     if (res.status_code != 200) {
//         MessageBox({
//             title: '提示',
//             message: getErrMsg(res.status_code, res.message)
//         })
//     }
//
//     return res
//
// }, function(error) {
//     // Do something with response error
//     console.log(error, '全局err')
//   if(typeof error == 'object'){
//       error = JSON.stringify(error);
//   }
//     alert('错误信息'+error);
//     MessageBox({
//         title: '提示',
//         message: '网络出错,请重新扫描二维码'
//     })
//     SetCookie('token_', '')
//     return Promise.reject(error);
// })
//
// function getErrMsg(errCode, msg) {
//     let m = ''
//     if (errCode) {
//         switch(errCode) {
//             case 1001:
//                 m = '设备不存在,请更换机器'
//                 break;
//             case 1002:
//                 m = '充值额度不存在'
//                 break;
//             case 1003:
//                 m = '限制购买次数'
//                 break;
//             case 1004:
//                 m = '操作失败'
//                 break;
//             case 1005:
//                 m = '游戏币数量不足'
//                 break;
//             case 1006:
//                 m = '设备未在线'
//                 break;
//             case 1007:
//                 m = '设备已停用'
//                 break;
//             case 1008:
//                 m = '设备游戏中'
//                 break;
//             default:
//                 m = '网络出错,请重新扫描二维码'
//                 SetCookie('token_', '')
//                 break
//         }
//     }
//     return m
// }
//
// if (process.env.NODE_ENV == 'development') {
//     var jsonp = require('jsonp')
//     jsonp.get = (url, opt) => {
//         var otp = opt || {params: null}
//         return new Promise((suc, error) => {
//             jsonp(CONFIG.url + 'api/' + url, otp.params, function(err, res) {
//                 if (res) {
//                     suc(res)
//                 }
//             })
//         })
//     }
//     instance = jsonp
// }
//
// export {
//     instance
// }
//
