// pages/appointmentTime/appointmentTime.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    detail_id: '',
    showModa: true,
    showModalStatus1: false,
    evaluate_contant: ['服务态度', '环境卫生', '技术手法', '治疗效果'],
    stars: [0, 1, 2, 3, 4],
    normalSrc: 'http://img3.imgtn.bdimg.com/it/u=2244811338,21109383&fm=26&gp=0.jpg',
    selectedSrc: 'http://pic25.photophoto.cn/20121221/0005018616515359_b.jpg',
    halfSrc: 'http://pic25.photophoto.cn/20121221/0005018616515359_b.jpg',
    score: 0,
    scores: [0, 0, 0],
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
          userId: res.data,
          detail_id:res.data
        })
        console.log(res)
        self.getInfo(res.data)
      },
    })
  },

  // 提交清空当前值
  bindSubmit: function () {
    wx.request({
      url: 'http://wkqderp.bceapp.com/patient_app_interface/wechat_interface.php',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        action: 'evaluate',
        p_id: Number(userId),
        service_attitude:"service_attitude",
        diagnosis_environment:"diagnosis_environment",
        service_technique:"service_technique",
        treatment_effect:"treatment_effect"
      },
      success: function (res) {
        console.log(res)
      }
    })
    var that = this;
    wx.showToast({
      title: '评价成功,感谢参与',
      icon: 'none',
      duration: 1500,
      mask: false,
      success: function () {
        that.setData({
          showModalStatus1: false,

        })
      }
    })
  },
  getInfo: function(userId) {
    const self = this;
    const date = new Date();
    const postDate = date.getFullYear() + '-' + ((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + (date.getDate() >= 10 ? date.getDate() : ('0' + date.getDate()));
    wx.request({
      url: 'http://wkqderp.bceapp.com/patient_app_interface/wechat_interface.php',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        action: 'success',
        p_id: userId
      },
      success: function(res) {
        console.log(res)
        self.setData({
          infoData: res.data.data
        })
      }
    })
  },
  arriveTo: function() {
    console.log()
    const latitude = Number(this.data.infoData.location.split(',')[1]);
    const longitude = Number(this.data.infoData.location.split(',')[0]);
    const name = this.data.infoData.institution_name;
    const address=this.data.infoData.addr;
    wx.openLocation({
      latitude,
      longitude,
      name,
      address,
      scale: 18
    })
  },
  // 改约时间跳到改约页面
  changTime:function(){
    wx.navigateTo({
          url: '../../pages/amendtheTreaty/amendtheTreaty',
        })
  },
  set:function(){
    const self=this
    wx.navigateTo({
      url: '../../pages/set/set?setjgid=' + self.data.infoData.institution_id,
    })
  },
  // 取消预约
  cancel: function () {
    const userId = this.data.userId;
    const detail_id = this.data.detail_id;
      wx.showModal({
        content: '确认取消预约',
        confirmColor: "#F71A23",
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.request({
              url: 'http://wkqderp.bceapp.com/patient_app_interface/wechat_interface.php',
              method: 'post',
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              data: {
                action: 'cancel_appointment',
                p_id: userId
              },
              success: function (res) {
                console.log(res)
                wx.redirectTo({
                  url: '../../pages/index/index',
                })
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
  },
  // 完成服务
  over: function () {
    const userId = this.data.userId;
    const detail_id = this.data.detail_id;
    wx.showModal({
      content: '确认完成服务',
      confirmColor: "#F71A23",
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: 'http://wkqderp.bceapp.com/patient_app_interface/wechat_interface.php',
            method: 'post',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            data: {
              action: 'service_completion',
              p_id: userId,
              detail_id:detail_id
            },
            success: function (res) {
              console.log(res)
              wx.navigateTo({
                url: '../../pages/b/b',
              })
            }
          })
          if (res.data.status1 == 1 && res.data.data.status1 !== 4){
              wx.redirectTo({
                url: '../../pages/index/index',
              })
          }else{
            self.orderList(postDate)
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },




// 评价
  btnEvaluation() {
    var that = this;
    that.setData({
      showModalStatus1: true,
    });
  },
  // 提交事件
  submit_evaluate: function () {
    console.log('评价得分' + this.data.scores)
  },
  //点击左边,半颗星
  selectLeft: function (e) {
    var score = e.currentTarget.dataset.score
    if (this.data.score == 0.5 && e.currentTarget.dataset.score == 0.5) {
      score = 0;
    }
    this.data.scores[e.currentTarget.dataset.idx] = score,
      this.setData({
        scores: this.data.scores,
        score: score
      })
  },
  //点击右边,整颗星
  selectRight: function (e) {
    var score = e.currentTarget.dataset.score
    this.data.scores[e.currentTarget.dataset.idx] = score,
      this.setData({
        scores: this.data.scores,
        score: score
      })
  },
  // 提交清空当前值
  bindSubmit: function () {
    const userId = this.data.userId;
    var that = this;
    wx.request({
      url: 'http://wkqderp.bceapp.com/patient_app_interface/wechat_interface.php',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        action: 'evaluate',
        p_id: userId,
        service_attitude:"service_attitude",
        diagnosis_environment:"diagnosis_environment",
        service_technique:"service_technique",
        treatment_effect:"treatment_effect"
      },
      success: function (res) {
        console.log(res)
        wx.showToast({
          title: '评价成功,感谢参与',
          icon: 'none',
          duration: 1500,
          mask: false,
          success: function () {
            that.setData({
              showModalStatus1: false,
            })
          }
        })
      }
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
    console.log("onShow")
    this.getInfo(this.data.userId)
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