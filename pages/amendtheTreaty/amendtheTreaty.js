//获取应用实例
var app = getApp();
Page({
  /*** 页面的初始数据 */
  data: {
    // 选项卡
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    cur: 0,
    currentTab: 0,
    dataList: '',
    userId: '',
    currentLat: '',
    currentLon: '',
   
  },
  initDate: function () {
    let datestr = new Date().getTime();
    let dataList = [];
    for (let i = 0; i <= 6; i++) {
      let date = new Date(datestr);
      let month = date.getMonth() + 1;
      let week = date.getDay();
      let wk;
      if (week == 0) {
        wk = '日'
      } else if (week == 1) {
        wk = '一'
      } else if (week == 2) {
        wk = '二'
      } else if (week == 3) {
        wk = '三'
      } else if (week == 4) {
        wk = '四'
      } else if (week == 5) {
        wk = '五'
      } else if (week == 6) {
        wk = '六'
      }
      let day = date.getDate();
      let year = date.getFullYear();
      dataList.push({
        month: month,
        day: day,
        week: wk,
        date: year + '-' + (month >= 10 ? month : '0' + month) + '-' + (day >= 10 ? day : '0' + day),
        list: [],
        isLoaded: false
      })
      datestr += 86400000
    }
    this.setData({
      dataList: dataList
    })
  },
  initData(userId) {
    const self = this;
    const date = new Date();
    const postDate = date.getFullYear() + '-' + ((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + (date.getDate() >= 10 ? date.getDate() : ('0' + date.getDate()))
    wx.request({
      url: 'http://wkqderp.bceapp.com/patient_app_interface/wechat_interface.php',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        action: 'success',
        p_id: Number(userId)
      },
      success: function (res) {
        console.log(res)
        self.setData({
          institution_id: res.data.data.institution_id,
          infoData: res.data.data
        })
        self.orderList(postDate)
      }
    })
  },
  orderList: function (postDate) {
    let list = this.data.dataList
    for (var d = 0; d < list.length; d++) {
      if (list[d].date == postDate) {
        if (list[d].isLoaded) {
          return
        }
        break
      }
    }
    const userId = this.data.userId;
    const institution_id = this.data.institution_id;
    const self = this;
    wx.request({
      url: 'http://wkqderp.bceapp.com/patient_app_interface/wechat_interface.php',
      method: 'POST',
      data: {
        action: "scheduling",
        p_id: userId,
        choose_institution_id: institution_id,
        choose_time: postDate

      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        console.log(res)
        if (res.data.status == 1) {
          const start = Number(res.data.data.start_time);
          const end = Number(res.data.data.end_time);
          const b = res.data.appointed_time_data;
          const len = end - start;
          let list = [];
          for (var i = start; i < start + len + 1; i++) {
            let state = 0;
            for (var j = 0; j < b.length; j++) {
              if (b[j] == i) {
                state = 1
              }
            }
            list.push({
              time: i >= 10 ? i : '0' + i,
              state: state
            })
          }
          // let dataList = self.data.dataList;
          // dataList.map((v, i) => {
          //   if (v.date == postDate) {
          //     dataList[i].list = list
          //   }
          // })
          // self.setData({
          //   dataList: dataList
          // })
          let dataList = self.data.dataList;
          dataList.map((v, i) => {
            if (v.date == postDate) {
              dataList[i].list = list
              dataList[i].isLoaded = true
            }
          })
          self.setData({
            dataList: dataList
          })
        }
      }
    })
  },
  /**
   * 预约
   */
  order: function (e) {
    console.log(e)
    const self = this;
    if (!e.target.dataset.state) {
      const dz = this.data.infoData.institution_name
      const sj = e.target.dataset.date
      wx.showModal({
        content: '确定改约(' + dz + ')' + sj,
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
                action: 'edit_appointment',
                p_id: self.data.userId,
                choose_appointed_time: e.target.dataset.date
              },
              success: function (res) {
                console.log(res)
                if (res.data.status == 1) {
                  wx.navigateBack({
                    delta: 1
                  })
                } else {
                  wx.showToast({
                    title: res.data.error_msg,
                    duration: 2000
                  })
                }
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

  /** * 点击tab切换  */
  swichNav: function (e) {
    console.log(e)
    if (e.target.dataset.current === undefined || e.target.dataset.current === this.data.cur) {
      return
    }
    this.setData({
   
      cur: e.target.dataset.current
    })
    // this.orderList(e.target.dataset.date)
  },

  /** * 滑动切换tab  */
  bindChange: function (e) {
    var self = this;
    self.setData({
      currentTab: e.detail.current
    });
    this.data.dataList.map((v, i) => {
      if (e.detail.current == i) {
        self.orderList(v.date)
      }
    })
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    const self = this;
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        self.setData({
          userId: res.data
        })
        self.initData(res.data)
      },
    })
    this.initDate();
  }

})