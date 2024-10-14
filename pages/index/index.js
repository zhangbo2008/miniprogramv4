//index.js
const app = getApp()
const fetch = app.fetch

Page({
  data: {
    ad:'/images/index/ad.png',
    category: ['/images/index/b_3.jpg','/images/index/b_4.jpg','/images/index/b_1.jpg','/images/index/b_2.jpg'],
    swiper: ['/images/index/lb1.jpg','/images/index/lb2.jpg','/images/index/lb3.jpg']
  },
  onLoad: function(options) {
    var callback = () => {
      wx.showLoading({
        title: '努力加载中...',
        mask: true
      })
      fetch('food/index').then(data => {
        wx.hideLoading()
      }, () => {
        callback()
      })
    }
    // if (app.userInfoReady) {
    //   callback()
    // } else {
    //   app.userInfoReadyCallback = callback
    // }
  },

  start: function() {
    console.log(111111111111111111)
    var id=0
//     关于 navigateTo 跳转无效问题，在IOS、模拟器上面都能正常跳转，但是在安卓上面不能跳转，过了一段时间IOS也不能跳转了。仔细找了下问题结果是要跳转的页面是tab，不能使用navigateTo
// 取跳转修改为：
    wx.switchTab({
      url: '/pages/list/list'
    })
    console.log(2222222222)
  }
})
