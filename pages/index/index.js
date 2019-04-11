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
    detail_id: '',
    location: '',
    currentLat: '',
    currentLon: '',
    distance: '0km'
  },
  // 可预约七天的时间处理 dataList
  initDate: function() {
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
  // 查看预约接口
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
      success: function(res) {
        wx.hideLoading()
        var l = res.data.data.location
        self.setData({
          institution_id: res.data.data.institution_id,
          infoData: res.data.data,
          location: res.data.data.location
        })
        console.log("AAA店铺坐标：" + l.split(",")[1] + "/" + l.split(",")[0])
        if (self.data.currentLat != '' && self.data.currentLon != '') {
          var d = calculateDistance(self.data.currentLat, self.data.currentLon, l.split(",")[1], l.split(",")[0])
          self.setData({
            distance: d + 'km'
          })
          console.log(d)
        }
        if (res.data.status == 1) {
          wx.redirectTo({
            url: '../../pages/appointmentTime/appointmentTime',
          })
        } else {
          self.orderList(postDate)
        }
      }
    })
  },


  arriveTo: function() {
    console.log()
    const latitude = Number(this.data.infoData.location.split(',')[1]);
    const longitude = Number(this.data.infoData.location.split(',')[0]);
    const name = this.data.infoData.institution_name;
    const address = this.data.infoData.addr;
    wx.openLocation({
      latitude,
      longitude,
      name,
      address,
      scale: 18
    })
  },
  // 设置
  set: function() {
    const self = this
    wx.navigateTo({
      url: '../../pages/set/set?setjgid=' + self.data.infoData.institution_id,
    })
  },

  // 根据时间查询某日的可预约列表
  orderList: function(postDate) {
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
    const detail_id = this.data.detail_id;
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
   * 点击预约
   */
  order: function(e) {
    console.log(e)
    const self = this;
    if (!e.target.dataset.state) {
      wx.request({
        url: 'http://wkqderp.bceapp.com/patient_app_interface/wechat_interface.php',
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: {
          action: 'appointment',
          p_id: self.data.userId,
          choose_institution_id: self.data.institution_id,
          appointed_time: e.target.dataset.date
        },
        success: function(res) {
          console.log(res)
          if (res.data.status == 1) {
            wx.redirectTo({
              url: '../../pages/appointmentTime/appointmentTime',
            })
          }
        }
      })
    }

  },
  /** * 滑动切换tab  */
  bindChange: function(e) {
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
  /** * 点击tab切换  */
  swichNav: function(e) {
    console.log(e)
    if (e.target.dataset.current === undefined || e.target.dataset.current === this.data.cur) {
      return
    }
    this.setData({
      cur: e.target.dataset.current
    })

    // this.orderList(e.target.dataset.date)
  },
  /*** 生命周期函数--监听页面加载*/
  onLoad: function(options) {
    const self = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        self.setData({
          currentLat: latitude,
          currentLon: longitude
        })
        console.log("当前坐标：" + latitude + '/' + longitude)
        if (self.data.location != '') {
          var d = calculateDistance(latitude, longitude, self.data.location.split(",")[1], self.data.location.split(",")[0])
          self.setData({
            distance: d + 'km'
          })
          console.log(d)
        }


      }
    })
    // wx.request({
    //   url: 'http://wkqderp.bceapp.com/patient_app_interface/wechat_interface.php',
    //   method: 'post',
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded' // 默认值
    //   },
    //   data: {
    //     action: 'success',
    //     p_id: self.data.userId,

    //   },
    //   success: function (res) {

    //     console.log(res.data)

    //     self.setData({
    //       statusData: res.data
    //     })
    //   }
    // }),
    wx.getStorage({
      key: 'userId',
      success: function(res) {
        self.setData({
          userId: res.data
        })
        self.initData(res.data)
      },
    })
    this.initDate();
  },

})

//计算两点之间的距离
function calculateDistance(startLat, startLng, endLat, endLng) {
  var radLat1 = startLat * Math.PI / 180.0;
  var radLat2 = endLat * Math.PI / 180.0;
  var a = radLat1 - radLat2;
  var b = startLng * Math.PI / 180.0 - endLng * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137; // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  return s;
}