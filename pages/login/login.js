// var app = require('../../resource/js/util.js');
let app = getApp()
var timer
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // name: '', //姓名
    phone: '', //手机号
    code: '', //验证码
    iscode: null, //用于存放验证码接口里获取到的code
    canIUse: wx.canIUse('button.open-type.getUserInfo'), //是否使用授权功能
    codename: '获取验证码',
    disabled: false
  },
  //获取input输入框的值
  getPhoneValue: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  getCodeValue(e) {
    console.log(e, 'eeee')
    this.setData({
      code: e.detail.value
    })
    console.log('code' + this.data.code)
  },
  getCode: function() {
    var a = this.data.phone;
    var _this = this;
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (this.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      wx.request({
        data: {
          tel: this.data.phone
        },
        'url': 'http://wkqderp.bceapp.com/patient_app_interface/verification_code.php',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success(res) {
          console.log(res.data, 'iscode')
          _this.setData({
            iscode: res.data
          })
          var num = 61;
          timer = setInterval(function() {
            num--;
            if (num <= 0) {
              clearInterval(timer);
              _this.setData({
                codename: '重新发送',
                disabled: false
              })
            } else {
              _this.setData({
                codename: num + "秒后重发"
              })
            }
          }, 1000)
        }
      })
    }
  },
  //获取验证码
  getVerificationCode() {
    if (this.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    disabled: true;
    this.getCode();
    var _this = this
    _this.setData({
      disabled: true
    })
  },
  // 点击登录
  info() {
    var _this = this;
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (this.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.code == "") {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    var sessionId = wx.getStorageSync('sessionId')
    wx.request({
      url: 'http://wkqderp.bceapp.com/patient_app_interface/wechat_login.php',
      data: {
        action: 'account',
        mobile: this.data.phone, //手机号
        code: this.data.code, //验证码
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        "Cookie": sessionId
      },
      success: function(res) {
        console.log(res)
        if (res.data.status == 1) {
          wx.showToast({
            title: '成功',
          })
          wx.setStorage({
            key: 'userId',
            data: res.data.data.p_id,
          })
          wx.setStorage({
            key: 'userInfos',
            data: JSON.stringify(res.data.data),
            success: function() {
              wx.redirectTo({
                url: '../index/index?p_id=' + res.data.data.p_id,
              })
            }
          })
        } else {
          wx.showToast({
            title: '输入验证码有误',
            icon: 'none',
            duration: 1000
          })
          console.log('解密失败')
        }
      }
    })
  },
  //提交表单信息
  save: function() {
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (this.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.code == "") {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (this.data.code != this.data.iscode) {
      wx.showToast({
        title: '验证码错误',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      wx.setStorageSync('code', this.data.code);
      wx.setStorageSync('phone', this.data.phone);
      // wx.redirectTo({
      //   url: '../index/index',
      // })
    }
  },
  //  protocol: function () {
  //    wx.navigateTo({
  //      url: '../bindphone/bindphone',
  //       })
  //   },


  // protocol: function () {
  //   if (app.globalData.code != null) {
  //     wx.request({
  //       data: {
  //         action: 'wxchant',
  //         wx_code: app.globalData.code
  //       },
  //       // 点微信登录返回她的unionid 就这个     点确认登录返回用户写的验证码
  //       'url': 'http://wkqderp.bceapp.com/patient_app_interface/wechat_login.php',
  //       method: 'POST',
  //       header: {
  //         'content-type': 'application/x-www-form-urlencoded' // 默认值
  //       },
  //       success(res) {
  //         console.log('code发送成功没有', res);
  //       }
  //     })
  //   }
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  getData() {
    // wx.login({
    //   success: function (res) {
    //     console.log(res, 'red')
    //     var code = res.code; // 复制给变量就可以打印了，醉了
    //     if (res.code) {
    //       wx.getUserInfo({
    //         success: function (res) {
    //           console.log(res, 'dfsfasdfsd')
    //           // userInfo 只存储个人的基础数据
    //           wx.setStorageSync('userInfo', res.userInfo);

    //           // 请求自己的服务器，解密用户信息 获取unionId等加密信息
    //           wx.request({
    //             url: 'http://wkqderp.bceapp.com/patient_app_interface/wechat_login.php?appid=' + app.globalData.appid,
    //             method: 'POST',
    //             header: {
    //               'content-type': 'application/x-www-form-urlencoded'
    //             },
    //             data: {
    //               encryptedData: res.encryptedData,
    //               iv: res.iv,
    //               code: code
    //             },
    //             success: function (data) {
    //               //4.解密成功后 获取自己服务器返回的结果
    //               if (data.data.code == 200) {
    //                 console.log('解密成功');
    //                 var encryptInfo = data.data.data;
    //                 wx.setStorageSync('openid', encryptInfo.openId); // 单独存储openid
    //                 wx.setStorageSync('encryptInfo', encryptInfo); // 存储解密之后的数据
    //               } else {
    //                 console.log('解密失败')
    //               }
    //             }
    //           })
    //         }

    //       })

    //     }
    //   }
    // })
  },
  onLoad: function(options) {


  },
  // getUserInfo: function () {
  //   var that = this
  //   var userInfo = wx.getStorageSync('userInfo') || {};
  //   var openid = wx.getStorageSync('openid') || null;
  //   if (!userInfo.nickName || !openid) {
  //     that.getData();  // 将wx.login({}) 方法放入其中
  //   }
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 取得当前用户code
   */
  // getUserCode: function () {
  //   var that = this;
  //   console.log("登陆", "yanzhengma");
  //   //绑定用户前，调用code获取session
  //   // 登录
  //   wx.login({
  //     success(res) {
  //       console.log(res, '000000000000000')
  //       if (res.errMsg == "login:ok") {
  //         wx.request({
  //           url: 'http://wkqderp.bceapp.com/patient_app_interface/wechat_login.php',
  //           method:'POST',
  //           header: {
  //             'content-type': 'application/x-www-form-urlencoded' // 默认值
  //           },
  //           data: {
  //             code: res.code,
  //             wechat_id: res.wechat_id
  //           },
  //           success(res) {
  //             console.log(res,'ewewwwwwwwwwwwwwwwwwwwwwwwwwwwww')
  //             if (res.data.code == 10000) {
  //               // that.getUserCode();
  //               return;
  //             }
  //             if (res.data.msg == "success") {
  //               wx.setStorageSync('uid', res.data.data.uid);
  //               wx.setStorageSync('token', res.data.data.token);
  //               wx.navigateTo({
  //                 url: '../index/index',
  //               })
  //             }
  //           }
  //         })
  //       }
  //     }
  //   })
  //   // if (that.data.code) {
  //   //   wx.navigateTo({
  //   //     url: '../index/index',
  //   //   })
  //   // }
  // },

  bindGetUserInfo: function(e) {
    var that = this
    wx.getUserInfo({
      success: function(res) {
        console.log('点击事件获取授权', res);
        wx.setStorageSync('userInfo', res.userInfo); //同步保存用户信息到本地
        // wx.redirectTo({//跳转到登录页
        //   url: '../login/login',
        // })
        wx.navigateTo({
          url: '../bindphone/bindphone',
        })
        // wx.navigateBack({
        //   delta: 1, //返回上一页
        // })
        // wx.navigateTo({
        //   url: '../bindphone/bindphone',
        // })
      },

      fail: function(res) { //如果用户没有授权则推出小程序
        wx.navigateBackMiniProgram({ //退出小程序

        })
      },
      complete: function() {

      },

    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(timer)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})