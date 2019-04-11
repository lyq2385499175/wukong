Page({
  /**
   * 页面的初始数据
   */
  data: {
    userId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let that = this
    this.setData({
      public: options.setjgid
    })
    wx.getStorage({
      key: 'userId',
      success: function(res) {
        that.setData({
          userId: res.data
        })
      },
    })
  },
  protocol6: function() {
    wx.navigateTo({
      url: '../../pages/personage/personage',
    })
  },
  protocol8: function() {
    const self = this
    wx.navigateTo({
      url: '../../pages/changePhone/changePhone'
    })
  },

  // 判断用户有没有投诉
  appointment: function() {
    let that = this
    wx.request({
      url: 'http://wkqderp.bceapp.com/patient_app_interface/wechat_interface.php',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        action: 'complaint_status',
        p_id: that.data.userId
      },
      success: function(res) {
        console.log(res)
        let path = ""
        if (res.data.data != null && res.data.data.complain_id != null) {
          path = "../../pages/mycomplaint/mycomplaint?institution_id="+that.data.public
        } else {
          path = "../../pages/PublicFun/PublicFun?public=" + that.data.public
        }
        wx.navigateTo({
          url: path
        })
      }
    })

  },



  // 退出登录
  logout: function() {
    wx.showModal({
      title: '提示',
      content: '确认退出当前登录账户',
      confirmColor: "#F71A23",
      success: function(res) {
        if (res.confirm) {
          wx.clearStorage()
          wx.reLaunch({
            url: '../../pages/login/login'
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  clear: function() {
    wx.showToast({
      title: '清除成功',
    })
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
    console.log("obf")
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