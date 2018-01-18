export const getParamByName = (name) => {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2]);
  return null
}

export const GetCookie = (name) => {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg)) {
    return unescape(arr[2])
  } else {
    return null
  }
}

export const SetCookie = (name, value) => {
  var Days = 30
  var exp = new Date()
  exp.setTime(exp.getTime() + 60 * 60 * 1000)//过期时间 2分钟
  document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString()
}

//测试淘票票生成唯一id
export const generateUUID = () => {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

//判断错误
export const getErrMsg = (errCode,message) => {
  let m = ''
  if (errCode) {
    switch (errCode) {
      case 1001:
        m = '设备不存在,请更换机器'
        break;
      case 1002:
        m = '充值额度不存在'
        break;
      case 1003:
        m = '限制购买次数'
        break;
      case 1004:
        m = '操作失败'
        break;
      case 1005:
        m = '游戏币数量不足'
        break;
      case 1006:
        m = '设备未在线'
        break;
      case 1007:
        m = '设备已停用'
        break;
      case 1008:
        m = '设备游戏中'
        break;
      case 1009:
        m = '当前处于无限模式中'
        break;
      case 1010:
        m = '不满足优惠券使用条件'
        break;
      case 1011:
        m = '充值订单异常'
        break;
      case 1012:
        m = '该优惠券已经使用'
        break;
      case 1013:
        m = '该优惠券领取失败'
        break;
      case 1014:
        m = message
        break;
      default:
        m = '网络出错,请重新扫描二维码'
        SetCookie('token_', '')
        break
    }
  }
  return m
}

export const jsonToStr = (obj) => {
  var str = '';
  if (Object.keys) {
    var keys = Object.keys(obj)
    for (var key in obj) {
      if (key != keys[keys.length - 1]) {
        str += key + '=' + obj[key] + '&';
      } else {
        str += key + '=' + obj[key];
      }
    }
  } else {
    for (var key in obj) {
      str += key + '=' + obj[key] + '&';
    }
  }
  return str;
}


