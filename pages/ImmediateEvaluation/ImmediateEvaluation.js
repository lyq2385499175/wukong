// pages/ImmediateEvaluation/ImmediateEvaluation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})