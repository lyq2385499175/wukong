// pages/mycomplaint/mycomplaint.js
Page({
  /**
   * 组件的初始数据
   */
  data: {
    userId: '',
    rightText: '取消投诉',
    serviceList: []
  },
  onLoad: function(options) {
    const self = this;
    this.setData({
      institution_id: options.institution_id
    })
    wx.getStorage({
      key: 'userId',
      success: function(res) {
        self.setData({
          userId: res.data
        })
        console.log("QQQQQ" + res.data)
        myComplaint(res.data, self)
      },
    })
  },
  cancel() {
    if (this.data.result != null && this.data.result.status1 != 2) {
      cancelComplaint(this.data.result.complain_id,this.data.institution_id)
    } else if (this.data.result != null && this.data.result.status1 == 2) { //再次投诉
      wx.redirectTo({
        url: '../../pages/PublicFun/PublicFun?public=' + this.data.institution_id,
      })
    }
  }
})

/**
 * 我的投诉
 */

function myComplaint(userId, _this) {
  console.log("用户id为：" + userId)
  var that = _this
  wx.request({
    url: 'http://wkqderp.bceapp.com/patient_app_interface/wechat_interface.php',
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    data: {
      action: 'complaint_status',
      p_id: userId
    },
    success(res) {
      console.log(res.data)
      if (res.data.status == 1) {
        let serviceList = res.data.data.service_name_set.split(",")
        const treatmentList = res.data.data.treatment_name_set.split(",")
        //拼接服务类目
        treatmentList.forEach(v => {
          serviceList.push(v)
        })
        //拼接状态
        serviceList.push(res.data.data.status)
        //向数组的开头添加一个或更多元素，并返回新的长度。
        serviceList.unshift(res.data.data.e_name_set + "/祛痘师")

        that.setData({
          result: res.data.data,
          rightText: res.data.data.status1 == 2 ? '再次投诉' : '取消投诉',
          serviceList: serviceList
        })

      } else {
        wx.showToast({
          title: '请求失败！',
        })
      }
    }
  })
}


// 取消投诉
function cancelComplaint(complain_id, institution_id) {
  wx.showModal({
    content: '确认取消投诉',
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
            action: 'cancel_complaint',
            complain_id: complain_id
          },
          success: function(res) {
            console.log(res)
            wx.redirectTo({
              url: '../../pages/PublicFun/PublicFun?public=' + institution_id,
            })

          }
        })
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
}