//app.js
const app=getApp()
App({
  onLaunch: function () {
    wx.getStorage({
      key: 'userId',
      success: function(res) {
        if(res.data){
          wx.reLaunch({
            url: '../../pages/index/index',
          })
        }
      },
    })
    // 展示本地存储能力
    // 登录
    wx.login({
      success: res => {
        console.log('user code', res)
        this.globalData.code = res.code;
        // console.log('user ID', res.openId)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this.globalData.hasUserInfo = true;
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log('用户userInfo', res.userInfo);
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
                wx.redirectTo({
                  url: '/pages/index/index',
                })
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userId:'',
    userInfo: null,
    hasUserInfo: false,   //是否有用户信息，授权后有，未授权没有
    code: null, //用户code
    appid: 'wxe3563042bb492f37',
    // domainName: 'https://www.donghuiyu.com',//旧域名
    // domainName: 'https://ceshi.donghuiyu.com',//测试域名
    // domainName: 'https://www.donghuiyu.cn',//新域名
  }
})