Page({

  data: {
    evaluate_contant: ['评价条目一', '评价条目二', '评价条目三',],
    stars: [0, 1, 2, 3, 4],
    normalSrc: 'http://img3.imgtn.bdimg.com/it/u=2244811338,21109383&fm=26&gp=0.jpg',
    selectedSrc: 'http://pic25.photophoto.cn/20121221/0005018616515359_b.jpg',
    halfSrc: 'http://pic25.photophoto.cn/20121221/0005018616515359_b.jpg',
    score: 0,
    scores: [0, 0, 0],
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
  }
})