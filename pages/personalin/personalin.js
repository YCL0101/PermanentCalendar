var app = getApp();
var host = app.globalData.host;

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    var nickName = wx.getStorageSync('userinfo').nickName;
    var phone = wx.getStorageSync('userinfo').phone;
    console.log("电话"+nickName)
    this.setData({
      // avatarUrl:host+'getimage?img=avatar.png',
      nickName: nickName,
      phone:phone
    })
  },
  quit(){
    wx.removeStorageSync('userinfo');
    wx.reLaunch({
      url: '../me/me?nickName=null',
    })
  }
 
})