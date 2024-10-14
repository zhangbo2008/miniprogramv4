//app.js
App({
  userdata:{},
  globalData:{},
  fetch: require('utils/fetch.js'),
  onLaunch: function () {
    wx.showLoading({
      title: '登录中...',
      mask: true
    })
    this.fetch('user/setting').then( data => {
      console.log(data)
      this.info2() //把用户id写入全局变量.
    })},
  //     console.log('over')
  //     if (data.isLogin) {
  //       // 已登录
  //       this.onUserInfoReady();
  //       console.log('通过保存的cookie登陆成功')
  //     } else {
  //       // 未登录
  //       console.log(9991)
  //       this.login({
  //         success: () => {
  //           // 登陆成功
  //           this.onUserInfoReady();
  //           // wx.hideLoading()
  //           console.log('登陆成功')
  //         },
  //         fail: () => {
  //           // 登录失败，说明服务器异常，已经弹出模态框，这里用来重试
  //           this.onLaunch()
  //         }
  //       })
  //     }
  //   },() => {
  //     this.onLaunch()
  //   })
    
  //   // 登录
  //   wx.login({
  //     success: res => {
  //       // 发送 res.code 到后台换取 openId, sessionKey, unionId
  //     }
  //   })
  //   // 获取用户信息
  //   wx.getSetting({
  //     success: res => {
  //       if (res.authSetting['scope.userInfo']) {
  //         // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
  //         wx.getUserInfo({
  //           success: res => {
  //             // 可以将 res 发送给后台解码出 unionId
  //             this.globalData.userInfo = res.userInfo

  //             // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //             // 所以此处加入 callback 以防止这种情况
  //             if (this.userInfoReadyCallback) {
  //               this.userInfoReadyCallback(res)
  //             }
  //           }
  //         })
  //       }
  //     }
  //   })
  //   this.globalData = {}
  // },

  login: function(options) {
    console.log(9992)
    wx.login({
      success: res => {
        console.log(9993,res)
        // 获得 res.data
        this.fetch('user/login', {
          js_code: res.code
        }).then(data => {
          // 判断是否成功
          if (data && data.isLogin) {
            // 登录成功
            options.success()
          } else {
            // 登录失败
            options.fail()
          }
        }, () => {
          // 登录失败，服务器异常
          options.fail()
        })
      }
    })
  },

  userInfoReady: false,
  onUserInfoReady: function() {
    wx.hideLoading();
    if (this.userInfoReadyCallback) {
      this.userInfoReadyCallback();
    }
    this.userInfoReady = true
    console.log(2222)
  }



  ,
  // 使用这个函数来维护唯一的openid.这个是用户的唯一标识.
info2:function(){
  console.log(160)

  console.log(444444444444444)
  var that=this;
  wx.getUserInfo({
    
    //成功后会返回
    success:(res)=>{
      console.log(that)
      console.log(99990)
      console.log(res);
      // 把你的用户信息存到一个变量中方便下面使用
      let userInfo= res.userInfo
      that.globalData.userinfo=res.userInfo
      //获取openId（需要code来换取）这是用户的唯一标识符
      // 获取code值
      console.log(156)
      wx.login({
        success (res) {
          if (res.code) {
            // 发起网络请求
            // 注意 appid也要配置在project.config.json 里面. 这样就对了!//// 通过code换取openId  /// 配置https://blog.csdn.net/weixin_49346957/article/details/118161126
            wx.request({
              url:'https://api.weixin.qq.com/sns/jscode2session',
              data: {
                appid: 'wxea500b1eb68275c8',
                secret: '33d60d1bde6758f6a91c02ec335673f3',
                js_code: res.code,
                grant_type: 'authorization_code'
              },
              success: res => {
                console.log(res,'res')
                if (res.data.openid) {





                  console.log('成功获取openid:', res.data.openid); // 成功获取到openid
                  console.log(that,'that')
                  that.globalData.userid=res.data.openid
                  console.log(' app.globalData.userid', that.globalData.userid)
            wx.hideLoading()
            console.log('登陆成功')
            console.log('获取个人数据')
            // that.fetch('/userdata',
            // {id:res.data.openid},'POST'
            // ).then(
            //   data=>{
            //     console.log(data,'拿到个人数据')
            //   that.globalData.userdata=data}

            // )





                } else {
                  console.error('获取openid失败:', res.data.errmsg); // 没有获取到openid，返回错误信息
                }
              },
              fail: err => {
                console.error('请求失败:', err.errMsg); // 请求失败，返回错误信息
              }
            })
          } else {
              console.log('登录失败！' + res.errMsg)
          }
        }
      })





      // wx.login({
      //   //成功放回
      //   success:(res)=>{
      //     console.log(157)
      //     console.log(res,998);
      //     let code=res.code
      //     // 通过code换取openId  /// 配置https://blog.csdn.net/weixin_49346957/article/details/118161126
      //     var APPID='wxea500b1eb68275c8'
      //     var Secret='33d60d1bde6758f6a91c02ec335673f3'
      //     console.log(999999999999999999999)
      //     console.log(`https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${Secret}&js_code=${code}&grant_type=authorization_code`)
      //     wx.request({
      //       url: `https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${Secret}&js_code=${code}&grant_type=authorization_code`,
      //       success:(res)=>{

      //         console.log('res',res);
      //         console.log(987654321)
      //         userInfo.openid=res.data.openid
      //         console.log('userInfo.openid',userInfo.openid);
      //       }
      //     })
      //   }
      // })

    },fail:()=>{
      console.log(155)
    }
  })



}
}








)





