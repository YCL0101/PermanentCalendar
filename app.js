// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
		userInfo: null,
		app_id: 'urkujhmpolpzpqkq',
		nickNamme: null,//用户昵称
    host:'http://82.156.158.206:3000/',
		app_secret: 'VVJ2SUFuVlB5RTNaUmFySTVoaTJOQT09',
		ignoreHoliday:false,
		base_date_url: 'https://www.mxnzp.com/api/holiday',
		base_weather_url: 'https://www.mxnzp.com/api/weather',
		
  }
})
