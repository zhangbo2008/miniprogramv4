// pages/record/record.js
const app = getApp()
const fetch = app.fetch

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '努力加载中...',
    })
    // getApp().globalData 用户id
    console.log(8888888888888888888888888)
    console.log(8888888888888888888888888,getApp().globalData['userid'])
    console.log(8888888888888888888888888,getApp().globalData['userinfo'])
    // 获取消费记录
    fetch('food/record'
    ,{uid: getApp().globalData['userid']},"POST"
    
    ).then(data => {
      wx.hideLoading()
      this.setData({
        userinfo:getApp().globalData['userinfo'],
        list:data




      })
      console.log('接受的用户数据是',data)
    })

    
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  enableRefresh: false,
  onShow: function () {
    if (this.enableRefresh) {
      this.onLoad()
    } else {
      this.enableRefresh = true
    }
  }
})