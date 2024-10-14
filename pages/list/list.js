const app = getApp()
const fetch = getApp().fetch
var categoryHeight = [] // 右列表各分类高度数组

Page({
  // 在页面渲染的变量, 必须放在data里面. //不在data里面的变量,不能在页面显示.
  data: {
    activeIndex: 0,
    tapIndex: 0,
    foodList: '',
    allfoodList:'',  //用来保存一开始从后端拿到的全列表.
    cartList: {   },
      cartPrice: 0,
      cartNumber: 0,
    cartBall: {
      show: false,
      x: 0,
      y: 0
    },
    showCart: false,
    promotion: {}
  },
  changingCategory: false, // 是否正在切换左侧激活的分类（防止滚动过快时切换迟缓）
  shopcartAnimate: null,
  onLoad: function(options) {
    console.log(213123123123)
    wx.showLoading({
      title: '努力加载中...'
    })
    fetch('food/list').then(data => {
      wx.hideLoading() //获取了数据之后隐藏这个loading
      for (var i in data.list) {
        this.setData({//这是为第一个索引值.
          activeIndex: i
        })
        break
      }
console.log("接受到的foodlist")
      console.log(data.list)
      //把data.list放入网页中. 这个地方要注意深拷贝!!!!!!!!!!
      this.setData({
        foodList: data.list,
        allfoodList:data.list.concat(),
        promotion: data.promotion[0]
      }, () => {//setData,后一个参数是这个回调函数. 用来更新这个categoryHeight值.
        var query = wx.createSelectorQuery()
        var top = 0
        query.select('.food').boundingClientRect(rect => {
          top = rect.top
        })
        query.selectAll('.food-category').boundingClientRect(res => {
          res.forEach(rect => {
            categoryHeight[rect.id.substring(rect.id.indexOf('_') + 1)] = rect.top - top
          })
        })
        query.exec()
        console.log('类别的高度',categoryHeight)
      }
      )
    })
    this.shopcartAnimate = shopcartAnimate('.cart-icon', this)
  },






  tapCategory: function(e) {
    console.log('点击cat之前的类别高度',categoryHeight)
      console.log(e,1111111111111111111111111)
    var index = e.currentTarget.dataset.index
    // console.log(111111111,index)
    this.changingCategory = true 
    console.log(111,this.changingCategory, 'this.changingCategory状态')
    // 利用这个flag: changingCategory 来让tapCategory 和onFoodScroll 不会循环触发.
    this.setData({
      activeIndex: index,
      tapIndex: index,
      // changingCategory:true
    }, () => {
    //   this.changingCategory = false
      console.log(8888888,categoryHeight)
      console.log(8888888,index,'设置cateory')
    })
  },








  onFoodScroll: function(e) {
    console.log(e,2222222222222222222222222)
    console.log("change daiyabin ",this.changingCategory)
    console.log('触发了onfoodscrooll函数')
    var scrollTop = e.detail.scrollTop
    var activeIndex = 0
    console.log('当前的纵坐标',scrollTop)

    categoryHeight.forEach((item, i) => {
      if (scrollTop >= item) {
        activeIndex = i
        
      }
    })
    if (this.changingCategory) {
      this.changingCategory = false;
      this.setData({
        changingCategory : false
      })
    } else {
      this.setData({
        activeIndex: activeIndex,
      }, () => {
        this.changingCategory = false
    
      })
    }
    // if (!this.changingCategory) {
        console.log('触发了onFoodScroll中的changingCategory')
        console.log('最后设置category',activeIndex)
    //   this.changingCategory = true
     
    // }
  },
  scrolltolower: function() {
    // this.setData({
    //   activeIndex: categoryHeight.length - 1
    // })
  },
  addToCart: function(e) {
    var id = e.currentTarget.dataset.id
    console.log(id, 'iiiiiiiiddddddddddd')
    console.log(e.currentTarget, 'dataset')
    console.log(e.currentTarget.dataset, 'dataset!!!!!!!!!!!!!!!')
    console.log(33333333333333,e.currentTarget.dataset.category_id)
    var category_id = e.currentTarget.dataset.category_id
    var aaaa=this.data.foodList
    console.log(1111111111111111111111111,aaaa)
    var food=''
    for (var i in aaaa){
      console.log(333333333,aaaa[i])
      var tmp=aaaa[i].food
      // console.log(4444444444,tmp.food)
      for (var j in tmp){
        var kkk=tmp[j]
        console.log(993,kkk)
        console.log(992,kkk.id)
        console.log(991,id)
        if (kkk.id==id){
          food=kkk
        }
   
      }
      

    }
    console.log('找到 ',food)






    // var food = this.data.foodList[category_id].food[id]
    var cartList = this.data.cartList
    console.log(food, 'food')
    console.log(id, category_id, food, cartList)
    if (cartList[id]) {
      ++cartList[id].number
    } else {
      cartList[id] = {
        id: food.id,
        name: food.name,
        price: parseFloat(food.price),
        number: 1,
        image_url:food.image_url
      }
    }
    this.shopcartAnimate.show(e)
    console.log('5555555555555555',cartList,this.data.cartPrice,cartList[id].price)

    this.setData({
      cartList,
      cartPrice: this.data.cartPrice + cartList[id].price,
      cartNumber: this.data.cartNumber + 1
    })
    console.log(343243242342343242343243,this.data.cartList)
    var jjj=getApp()
    console.log(jjj.globalData)
    console.log(getApp().globalData) //每次访问后端都带着用户id
  },
  showCartList: function() {
    if (this.data.cartNumber > 0) {
      this.setData({
        showCart: !this.data.showCart
      })
    }
  },
  // 减少商品，最小数量为1
  cartNumberDec: function(e) {
    var id = e.currentTarget.dataset.id
    var cartList = this.data.cartList
    if (cartList[id]) {
      var price = cartList[id].price
      if (cartList[id].number > 1) {
        --cartList[id].number
        this.setData({
          cartList,
          cartNumber: --this.data.cartNumber,
          cartPrice: this.data.cartPrice - price
        })
      } else {
        wx.showToast({
          icon: "none",
          title: '商品不可再减少~',
        })
        this.setData({
          cartList,
          cartNumber: this.data.cartNumber,
          cartPrice: this.data.cartPrice
        })
      }
    }
  },
  // 增加商品
  cartNumberAdd: function(e) {
    var id = e.currentTarget.dataset.id
    var cartList = this.data.cartList
      ++cartList[id].number
    this.setData({
      cartList,
      cartNumber: ++this.data.cartNumber,
      cartPrice: this.data.cartPrice + cartList[id].price
    })
  },
  // 删除商品
  cartNumberDel: function(e) {
    var id = e.currentTarget.dataset.id
    var cartList = this.data.cartList
    var price = cartList[id].price
    var num = cartList[id].number
    delete cartList[id]
    this.setData({
      cartList,
      cartNumber: this.data.cartNumber - num,
      cartPrice: this.data.cartPrice - num*price
    })
    if (this.data.cartNumber <= 0) {
      this.setData({
        showCart: false
      })
    }
  },
  // 清空购物车
  cartClear: function() {
    this.setData({
      cartList: {},
      cartNumber: 0,
      cartPrice: 0,
      showCart: false
    })
  },
  sousuo: function(e){
    console.log("搜索什么!!!!!!!!!",e.detail.value) //拿到搜索结果.
    var sousuokey=e.detail.value
    console.log(this.data.foodList) //这种不复杂的二重for循环放在前端算是最快的.尽量少网络请求.
    var fl=this.data.allfoodList
    var tmplist=[]
    for (var i in fl){
      tmplist.push({'name':fl[i]['name']})
    }
    for (var i in fl){
      console.log('debug1',i)
      console.log(fl[i])
      var j=fl[i]['food']
      console.log(j)
      var tmp2=[]
      for (var ii in j){
         console.log('debug444',j,ii)

         if (j[ii]['name'].includes(sousuokey)){
           console.log('debug5',j[ii]['name'])
           tmp2.push(j[ii])
         }
       }
       console.log('dddddddddddeeeeeeeeeebbbbbbbbb',tmp2)
       tmplist[i]['food']=tmp2
       console.log(tmplist)
    }
    console.log(tmplist,33333333333)
    this.setData(
{foodList:tmplist},() => {//setData,后一个参数是这个回调函数. 用来更新这个categoryHeight值. // 2024-10-13,22点14 新加的细节! , 现在这个版本可以加入筛选条件后, 点击类别仍然可以跳转. 原理就是下面写的setData的回调每次都从新计算category的高度,让cat可以定位右边的滚动代码.
  var query = wx.createSelectorQuery()
  var top = 0
  query.select('.food').boundingClientRect(rect => {
    top = rect.top
  })
  query.selectAll('.food-category').boundingClientRect(res => {
    res.forEach(rect => {
      categoryHeight[rect.id.substring(rect.id.indexOf('_') + 1)] = rect.top - top
    })
  })
  query.exec()
  console.log('修改搜索后的类别的高度',categoryHeight)
}

    )
    if (sousuokey==''){
      console.log('?????????????????????')
      console.log(this.data.allfoodList) 
      this.setData(

        {foodList:this.data.allfoodList}
        
            ),() => {//setData,后一个参数是这个回调函数. 用来更新这个categoryHeight值.
              var query = wx.createSelectorQuery()
              var top = 0
              query.select('.food').boundingClientRect(rect => {
                top = rect.top
              })
              query.selectAll('.food-category').boundingClientRect(res => {
                res.forEach(rect => {
                  categoryHeight[rect.id.substring(rect.id.indexOf('_') + 1)] = rect.top - top
                })
              })
              query.exec()
              console.log('修改搜索后的类别的高度',categoryHeight)
            }
    }
    

  },





  order: function() {
    if (this.data.cartNumber === 0) {
      return
    }
    wx.showLoading({
      title: '正在生成订单...'
    })
    console.log('写入数据库')
    fetch('food/order', {
      order: this.data.cartList,
      uid:getApp().globalData.userid
    }, 'POST').then(data => { // order_id 是后端给前端生成的.
      wx.navigateTo({
        url: '/pages/checkout/checkout?order_id=' + data.order_id
      })
      // console.log(data.order_id)
    })
  }
})

function shopcartAnimate(iconClass, page) {
  var busPos = {}
  wx.createSelectorQuery().select(iconClass).boundingClientRect(rect => {
    busPos.x = rect.left + 15
    busPos.y = rect.top
  }).exec()
  return {
    show: function(e) {
      var finger = {
        x: e.touches[0].clientX - 10,
        y: e.touches[0].clientY - 10
      }
      var topPoint = {}
      if (finger.y < busPos.y) {
        topPoint.y = finger.y - 150
      } else {
        topPoint.y = busPos.y - 150
      }
      topPoint.x = Math.abs(finger.x - busPos.x) / 2
      if (finger.x > busPos.x) {
        topPoint.x = (finger.x - busPos.x) / 2 + busPos.x
      } else {
        topPoint.x = (busPos.x - finger.x) / 2 + finger.x
      }
      var linePos = bezier([busPos, topPoint, finger], 30)
      var bezier_points = linePos.bezier_points
      page.setData({
        'cartBall.show': true,
        'cartBall.x': finger.x,
        'cartBall.y': finger.y
      })
      var len = bezier_points.length
      var index = len
      let i = index - 1
      var timer = setInterval(function() {
        i = i - 5
        if (i < 1) {
          clearInterval(timer)
          page.setData({
            'cartBall.show': false
          })
          return
        }
        page.setData({
          'cartBall.show': true,
          'cartBall.x': bezier_points[i].x,
          'cartBall.y': bezier_points[i].y
        })
      }, 50)
    }
  }

  function bezier(pots, amount) {
    var pot
    var lines
    var ret = []
    var points
    for (var i = 0; i <= amount; ++i) {
      points = pots.slice(0)
      lines = []
      while (pot = points.shift()) {
        if (points.length) {
          lines.push(pointLine([pot, points[0]], i / amount))
        } else if (lines.length > 1) {
          points = lines
          lines = []
        } else {
          break
        }
      }
      ret.push(lines[0])
    }

    function pointLine(points, rate) {
      var pointA, pointB, pointDistance, xDistance, yDistance, tan, radian, tmpPointDistance
      var ret = []
      pointA = points[0]
      pointB = points[1]
      xDistance = pointB.x - pointA.x
      yDistance = pointB.y - pointA.y
      pointDistance = Math.pow(Math.pow(xDistance, 2) + Math.pow(yDistance, 2), 1 / 2)
      tan = yDistance / xDistance
      radian = Math.atan(tan)
      tmpPointDistance = pointDistance * rate
      ret = {
        x: pointA.x + tmpPointDistance * Math.cos(radian),
        y: pointA.y + tmpPointDistance * Math.sin(radian)
      }
      return ret
    }
    return {
      bezier_points: ret
    }
  }
}