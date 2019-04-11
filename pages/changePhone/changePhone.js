// pages/changephone/changePhone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    phoneNum: '',
    mobile: '',
    code: '',
    userInfo: {},
    codename: '获取验证码',
    disabled:false
  },
    
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.getStorage({
      key: 'userId',
      success: function(res) {
        console.log(res.data)
        that.setData({
          userId: res.data
        })
      },
    })
    wx.getStorage({
      key: 'userInfos',
      success: function(res) {

        that.setData({
          phoneNum: JSON.parse(res.data).mobile, 
          userInfo: JSON.parse(res.data)
        })
      },
    })
  },
  getMobile(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  getCode(e) {
    this.setData({
      code: e.detail.value
    })
  },



  getIdentifyCode() {
    if (this.data.disabled==false){
      if (checkInputValue(this.data))
        getIdentifyCode(this.data.mobile, this)
    }
    
  },
  changeMobile() {
    if (checkInputValue(this.data))
      if (this.data.code == '') {
        wx.showToast({
          title: '请输入验证码',
        })
        return
      }
    changeMobile(this.data.mobile, this.data.code, this.data.userId, this.data.userInfo)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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

function checkInputValue(data) {
  if (data.mobile == '') {
    wx.showToast({
      title: '请输入新手机号码'
    })
    return false
  }
  if (data.mobile == data.phoneNum) {
    wx.showToast({
      title: '和当前号码一致',
    })
    return false
  }
  return true
}


/**
 * 获取手机验证码
 */
function getIdentifyCode(mobile,_this) {
  wx.request({
    url: 'http://wkqderp.bceapp.com/patient_app_interface/verification_code.php',
    method: 'POST',
    data: {
      tel: mobile
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success(res) {
      console.log(res)
      if (res.data.status == 1) {
        var num = 61;
        var timer = setInterval(function () {
          num--;
          if (num <= 0) {
            clearInterval(timer);
            _this.setData({
              codename: '重新发送',
              disabled: false
            })

          } else {
            _this.setData({
              codename: num + "秒后重发",
              disabled: true
            })
          }
        }, 1000)
        wx.showToast({
          title: '发送成功',
        })
      } else {
        wx.showToast({
          title: '发送失败',
        })
      }
      
    }
  })
}
/**
 * 更换手机号
 */
function changeMobile(mobile, code, userId, userInfo) {
  wx.request({
    url: 'http://wkqderp.bceapp.com/patient_app_interface/wechat_login.php',
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      action: 'change_photo',
      mobile: mobile,
      code: code,
      p_id: userId
    },
    success(res) {
      console.log(res)
      if (res.data.status == 1) {
        // wx.showToast({
        //   title: '更换成功',
        // })
        userInfo.mobile = mobile
        wx.setStorage({
          key: 'userInfos',
          data: JSON.stringify(userInfo)
        })
        wx.showModal({
          title: '更改成功!',
          confirmColor: "#F71A23",
          cancelText: "好的",
          cancelColor: '#FA7A20',
          confirmText: "确认",
          confirmColor: '#FA7A20',
          success(res) {
            if (res.confirm) {
              console.log('用户点击好的')
              wx.navigateBack({
                delta: 1
              })
            } else if (res.cancel) {
              console.log('用户点击确认')
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
        //返回上一级关闭当前页面
        // wx.navigateBack({
        //   delta: 1
        // })
      } else {
        wx.showToast({
          title: res.data.error_msg,
        })
      }
    },
    fail(res) {
      wx.showToast({
        title: '更换失败',
      })
    }
  })
}