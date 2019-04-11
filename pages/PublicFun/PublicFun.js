Page({
  data: {
    text: '',
    list3: [{
      name: "对我们有信心",
      checked: false,
      id: '0'
    }, {
      name: "对我们无信心",
      checked: false,
      id: '1'
    }]


  },
  onLoad: function(options) {
    const self = this;
    wx.getStorage({
      key: 'userInfos',
      success: function(res) {
        self.setData({
          infoDetail: JSON.parse(res.data)
        })
      },
    })
    wx.request({
      url: 'http://wkqderp.bceapp.com/patient_app_interface/wechat_interface.php',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
   
      data: {
        action: "category_list",
        institution_id: options.public
      },
      success: function(res) {
        console.log(res)
        
        const list1 = res.data.category_data[0].detail_arr.map((v, i) => {
          return {
            id: v.detail_id,
            name: v.detail_name,
            checked: false
          }
        });
        const list2 = res.data.category_data[1].detail_arr.map((v, i) => {
          return {
            id: v.detail_id,
            name: v.detail_name,
            checked: false
          }
        });
        const list4 = res.data.e_arr.map((v, i) => {
          return {
            id: v.e_id,
            name: v.name,
            checked: false
          }
        });
        console.log(list1)
        self.setData({
          checkboxArr: list1,
          checkboxArr2: list2,
          checkboxArr3: list4,
          institution_id: options.public
        })
      }
    })
  },
  checkbox: function(e) {
    var index = e.currentTarget.dataset.index; //获取当前点击的下标
    var checkboxArr = this.data.checkboxArr; //选项集合
    checkboxArr[index].checked = !checkboxArr[index].checked; //改变当前选中的checked值
    this.setData({
      checkboxArr: checkboxArr
    });
  },
  checkbox2: function(e) {
    var index = e.currentTarget.dataset.index; //获取当前点击的下标
    var checkboxArr2 = this.data.checkboxArr2; //选项集合
    checkboxArr2[index].checked = !checkboxArr2[index].checked; //改变当前选中的checked2值
    this.setData({
      checkboxArr2: checkboxArr2
    });
  },
  checkbox4: function(e) {
    var index = e.currentTarget.dataset.index; //获取当前点击的下标
    var checkboxArr2 = this.data.checkboxArr3; //选项集合
    checkboxArr2.forEach(function(value, index, arraySelf) {
      arraySelf[index].checked = false
    })
    checkboxArr2[index].checked = !checkboxArr2[index].checked; //改变当前选中的checked2值
    this.setData({
      checkboxArr3: checkboxArr2
    });
  },
  // 单选

  star1Click: (e) => {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var typearr = that.data.typeArr;
    typearr[index].flag = !typearr[index].flag;
    // var indexs;
    typearr.forEach((val, ind) => {
      if (val.id == id) {
        val.flag != val.flag
      } else {
        val.flag = false
      }
    })
    // if(arrs.indexOf(id) == -1){
    // arrs.push(id)
    // }else{
    // arrs.forEach((val,idx) => {
    // if(val == id){
    // indexs = idx;
    // }
    // })
    // arrs.splice(indexs,1)
    // }
    that.setData({
      ids: id,
      typeArr1: arrs,
      typeArr: typearr
    })
  },
  checkbox3: function(e) {
    var index = e.currentTarget.dataset.index; //获取当前点击的下标
    var checkboxArr2 = this.data.list3; //选项集合
    if (index == 0) {
      checkboxArr2[1].checked = false;
      checkboxArr2[0].checked = !checkboxArr2[0].checked;
    } else {
      checkboxArr2[0].checked = false;
      checkboxArr2[1].checked = !checkboxArr2[1].checked;
    }

    //改变当前选中的checked2值i
    this.setData({
      list3: checkboxArr2
    });
  },
  checkboxChange: function(e) {
    var checkValue = e.detail.value;
    this.setData({
      checkValue: checkValue
    });
  },

  confirm: function() { // 提交
    console.log(this.data.checkValue) //所有选中的项的value
  },
  confirm2: function() { // 提交
    console.log(this.data.checkValue2) //所有选中的项的value
  },
  protocol: function() {
    wx.navigateTo({
      url: '../../pages/mycomplaint/mycomplaint',
    })

  },
  inText: function(res) {
    console.log(res)
    this.setData({
      text: res.detail.value
    })
  },
  sub: function() {
    console.log(this.data)
    const self = this;
    const service_id_set = [];
    this.data.checkboxArr.map((v, i) => {
      if (v.checked) {
        console.log("id=" + v.id)
        service_id_set.push(v.id)
      }
    })
    const treatment_id_set = [];
    this.data.checkboxArr2.map((v, i) => {
      if (v.checked) {
        treatment_id_set.push(v.id)
      }
    })
    let status = '-1';
    this.data.list3.map((v, i) => {
      if (v.checked) {
        status = v.id
      }
    })
    const e_id_set = [];
    this.data.checkboxArr3.map((v, i) => {
      if (v.checked) {
        e_id_set.push(v.id)
      }
    })
    if (service_id_set.length == 0) {
      wx.showToast({
        title: '请选择服务类目',
      })
      return
    }
    if (treatment_id_set.length == 0) {
      wx.showToast({
        title: '请选择治疗类目',
      })
      return
    }
    if (e_id_set.length == 0) {
      wx.showToast({
        title: '请选择人员类目',
      })
      return
    }
    if (status == -1) {
      wx.showToast({
        title: '请选择状态',
      })
      return
    }
    wx.request({
      url: 'http://wkqderp.bceapp.com/patient_app_interface/wechat_interface.php',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        action: "complaint",
        p_id: self.data.infoDetail.p_id,
        name: self.data.infoDetail.name,
        mobile: self.data.infoDetail.mobile,
        institution_id: self.data.institution_id,
        service_id_set: service_id_set.join(','),
        treatment_id_set:treatment_id_set.join(','),
        e_id_set: e_id_set.join(','),
        status: status,
        remark: self.data.text
      },
      success: function (res) {
        console.log(service_id_set.join(','))
        console.log(treatment_id_set.join(','))
        console.log(res)
        if (res.data.status == 1) {
          wx.showModal({
            title: '投诉成功!',
            content: '感谢您的建议，我们会尽快为您解决',
            confirmColor: "#FA7A20",
            cancelText: "查看",
            cancelColor: '#FA7A20',
            confirmText: "确认",
            confirmColor: '#FA7A20',
            success(res) {
              if (res.confirm) {
                wx.navigateBack({
                  url: '../../pages/set/set'
                })
              } else if (res.cancel) {
                wx.redirectTo({
                  url: '../../pages/mycomplaint/mycomplaint?institution_id=' + self.data.institution_id,
                })
              }
            }
          })
        }
      }
    })
  }
})