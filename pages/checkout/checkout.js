const app = getApp()
const fetch = app.fetch

Page({
  data: {
    comment: ''
  },

  onLoad: function (options) {
    console.log('onload')
    var id = options.order_id
    wx.showLoading({
      title: '努力加载中...',
    })
    console.log('checkout.js',id)
    fetch('food/order', {
      id,
      uid:getApp().globalData.userid
    },"POST").then(data => {
      console.log(32432432423423432,)
      this.setData({order_food:data['order'],price:data['price'],id:data['order_id']})
      console.log('checkoutdata',data)
      wx.hideLoading()
    }, () => {
      this.onLoad(options)
    })
  },

  pay: function () {
    console.log(1)
    var id = this.data.id;
    wx.showLoading({
      title: '正在支付...',
    })
    // console.log(34234324234234,id,this.data)
    // console.log('致富!!!!!!!!!!!',{
    //   id,
    //   comment: this.data.comment
    // })
    console.log(9999999999999999999999999999999)
    fetch('food/order', {
      id,
      uid:getApp().globalData.userid,
      comment: this.data.comment
    }, 'POST').then(data => {
      console.log(data,3729473892748923743289472389472389472389472389472938)
      return fetch('food/pay', {
        id,
        uid:getApp().globalData.userid
      }, 'POST')
    }).then(data => {
      console.log(8888888888888888888)
      wx.hideLoading()
      wx.showToast({
        title: '支付成功',
        icon: 'success',
        duration: 2000,
        success: () => {
          wx.navigateTo({
            url: '/pages/detail/detail?order_id=' + id,
          })
        }
      })
    }).catch(() => {
      // 支付失败
      this.pay()
    })
  },

  comment: function (e) {
    this.data.comment = e.detail.value;
  }
})