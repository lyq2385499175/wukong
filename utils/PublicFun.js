function _showToast(title) {
  wx.showToast({
    icon: "none",
    title: title
  })
}

module.exports = {
  _showToast

}
