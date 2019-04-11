const app = getApp()
// aes加密
var CryptoJS = require('./aes.js')
var key = CryptoJS.enc.Utf8.parse("3454345434543454");
var iv = CryptoJS.enc.Utf8.parse("6666666666666666");
// 加密目的是转换中文以免报错
// -----------------aes over
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-')
}
// 转码
function encodeUnicode(str) {
  var res = [];
  for (var i = 0; i < str.length; i++) {
    res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
  }
  return "\\u" + res.join("\\u");
}

// 解码  
function decodeUnicode(str) {
  str = str.replace(/\\/g, "%");
  return unescape(str);
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const countdown = (second, that) => {
  if (second == 1) {
    that.setData({
      second: "",
      timeFlag: true
    });
    return;
  }
}

function loginCheck(pageObj) {
  if (pageObj.onLoad) {
    let _onLoad = pageObj.onLoad;
    // 使用onLoad的话需要传递options
    pageObj.onLoad = function (options) {
      if (wx.getStorageSync('USERID')) {
        // 获取当前页面
        let currentInstance = getPageInstance();
        _onLoad.call(currentInstance, options);
      } else {
        //跳转到登录页
        wx.redirectTo({
          url: "/pages2/login/login"
        });
      }
    }
  }
  return pageObj;
}
// 获取当前页面    
function getPageInstance() {
  var pages = getCurrentPages();
  return pages[pages.length - 1];
}
// 加密
function Encrypt(word) {
  const srcs = CryptoJS.enc.Utf8.parse(word);
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.ciphertext.toString().toUpperCase();
}
// 解密
function Decrypt(word) {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  const decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}
// wx.request方法的封装
const fetch = ( url = '', data = {}, method = "get", header) => {
  if (method == "get") {
     header = {
      'content-type': 'application/json',
      'token': app.globalData.token
    }
  } else {
     header = {
      'content-type': 'application/x-www-form-urlencoded',
       'token': app.globalData.token
    }
  }
    return new Promise( (reslove, reject)=> {
      wx.request({
        url: app.data.baseUrl+url,
        method: method,
        header: header,
        data: data,
        success: function (res) {
          if(res.data.code==0){
            reslove(res.data)
          }else if(res.data.code==1){
            reject(res.data.msg)
            wx.removeStorageSync('userInfo')
            wx.removeStorageSync('userId')
            wx.removeStorageSync('token')
            wx.reLaunch({
              url: '../../pages2/login/login',
            })
          }else{
            reject(res.data.msg)
            wx.showToast({
              title: res.data.msg,
              icon: "none"
            })
          }
        },
         fail: function (e) {
           reject(e)
          wx.showToast({
            title: '网络异常，请稍后重试',
            icon:"none"
          })
        },
        complete: function (e) {
          wx.hideLoading()
          wx.stopPullDownRefresh()
        }
      })
    })
}
module.exports = {
  formatTime: formatTime,
  countdown: countdown,
  loginCheck: loginCheck,
  Encrypt: Encrypt,
  Decrypt: Decrypt,
  encodeUnicode: encodeUnicode,
  decodeUnicode: decodeUnicode,
  fetch:fetch
}