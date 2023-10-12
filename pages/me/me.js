var app = getApp();
var host = app.globalData.host;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //添加小程序变量
    scImg: false,
    // avatarUrl:'',
  },
  xianImg() {
    var scImg = true;
    console.log(scImg),
      this.setData({

        scImg: true,
        tianjiaimg: host+'getimage?img=tianjia.png'
      })
  },
  yinImg() {
    var scImg = false;
    this.setData({
      scImg: scImg
    })
  },
  onLoad() {},
  login() {
    // 跳转登录页
    wx.navigateTo({
      url: '../login/login',
    })
  },
  onShow() {
    // 获取登录nickName
    var nickName = wx.getStorageSync('userinfo').nickName||null;
    console.log("me" + nickName)
    if (nickName) {
      this.setData({
        // avatarUrl:host+'getimage?img=avatar.png',
        nickName: nickName
      })
    }

  },
  geRen() {
    // 跳转个人信息页
    wx.navigateTo({
      url: '../personalin/personalin',
    })
  }
})