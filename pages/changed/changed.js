// pages/changed/changed.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    protocol4: function () {
      wx.navigateTo({
        url: '../../pages/amendtheTreaty/amendtheTreaty',
      })
    },
    protocol5: function () {
      wx.navigateTo({
        url: '../../pages/set/set',
      })
    }
  }
})
