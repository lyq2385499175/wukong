Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex: ['请选择', '男', '女'],
    imgPath: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1547438371&di=fe9d7f45a2df5ea540b2f13d5f29995c&src=http://b-ssl.duitang.com/uploads/item/201704/27/20170427155254_Kctx8.jpeg'

  },
  // upImg: function() {
  //   wx.chooseImage({
  //     success: res => {
  //       this.urlTobase64(res.tempFilePaths[0])
  //     }
  //   })
  // },
  // urlTobase64(url) {
  //   const self = this;
  //   wx.request({
  //     url: url,
  //     responseType: 'arraybuffer', //最关键的参数，设置返回的数据格式为arraybuffer
  //     success: res => {
  //       //把arraybuffer转成base64
  //       let base64 = wx.arrayBufferToBase64(res.data);
  //       //不加上这串字符，在页面无法显示的哦
  //       base64　 = 'data:image/jpeg;base64,' + base64
  //       //打印出base64字符串，可复制到网页校验一下是否是你选择的原图片呢
  //       console.log(base64)
  //       let userInfo = self.data.userInfo;
  //       userInfo.img = base64
  //       self.setData({
  //         userInfo: userInfo
  //       })
  //     }
  //   })
  // },
  changeImage() {
    var that = this;
    wx.chooseImage({
      success: res => {
        that.setData({
          imgPath: res.tempFilePaths
        })
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            console.log('data:image/png;base64,' + res.data)
            console.log("imgPath")
            let userInfo = that.data.userInfo;
            userInfo.img = res.data
            that.setData({
              userInfo: userInfo
            })
          }
        })

        //以下两行注释的是同步方法，不过我不太喜欢用。
        //let base64 = wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], 'base64') 
        //console.log(base64)
      }
    })

    // wx.chooseImage({
    //   success: function (res) {
    //     console.log("11111"+res.tempFilePaths)
    //     that.setData({
    //       user_Image: res.tempFilePaths,
    //       imgPath: res.tempFilePaths
    //     })
    //   },
    //   fail: function (err) {
    //     console.log(err)
    //   },
    //   complete(res) {
    //     console.log(res)
    //   }
    // })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const self = this;
    wx.getStorage({
      key: 'userId',
      success: function(res) {
        self.setData({
          userId: res.data
        })
        wx.request({
          url: 'http://wkqderp.bceapp.com/patient_app_interface/wechat_login.php',
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data: {
            action: 'personal_information',
            p_id: res.data
          },
          success: function(e) {
            self.setData({
              userInfo: e.data.data,
              imgPath:e.data.data.img
            })
          }
        })
      },
    })

  },
  bindInput(e) {
    let userInfo = this.data.userInfo;
    userInfo.name=e.detail.value
    this.setData({
      userInfo:userInfo
    })
  },
  bindDateChange: function(res) {
    let userInfo = this.data.userInfo;
    userInfo.brithday = res.detail.value
    this.setData({
      userInfo: userInfo
    })
  },
  bindPickerChange: function(res) {
    let userInfo = this.data.userInfo;
    userInfo.sex = res.detail.value
    this.setData({
      userInfo: userInfo
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
  change: function() {
    console.log(this.data, '999999999999999')
    const self = this;
    wx.request({
      url: 'http://wkqderp.bceapp.com/patient_app_interface/wechat_login.php',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        action: 'personal_information_edit',
        p_id: self.data.userId,
        name: self.data.userInfo.name,
        sex: self.data.userInfo.sex,
        brithday: self.data.userInfo.brithday,
        img: self.data.userInfo.img
      },
      success: function(res) {
        console.log(res, "_____")
        if (res.data.status == 1) {
          wx.showToast({
            title: '修改成功',
          })
        } else {
          wx.showToast({
            title: '修改失敗',
          })
        }
      }
    })
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