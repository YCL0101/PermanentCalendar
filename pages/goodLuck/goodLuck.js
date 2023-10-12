// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    date: '',
    list: []
  },
  onLoad(options) {
    console.log('options',options)
    let date = options.selectedDateStr;
    this.getNowDate(date);
    this.DataOnLoad()
    // var list=wx.getStorageSync('list')//缓存到本地
    // this.setData({
    //   list:list
    // })
  },
getNowDate(selectedDateStr){
  // var nowtime= new Date().toISOString().substring(0, 10);
  this.setData({
    date:selectedDateStr
  })
},
  bindDateChange: function (e) {
    let page = this;
    console.log(e.detail.value)
    this.setData({
      date: e.detail.value
    })
    const ymd = this.data.date;
    wx.request({
      url: 'https://apis.tianapi.com/lunar/index?key=6d385479ba78ca1fbfd20168bb069392&date=' + ymd + '',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res.data);
        page.setData({
          //第一个data为固定用法
          list: res.data,
        })
      }
    })
    
  },

  DataOnLoad() {
    let page = this;
    const ymd = this.data.date;
    wx.request({
      url: 'https://apis.tianapi.com/lunar/index?key=6d385479ba78ca1fbfd20168bb069392&date=' + ymd + '',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res.data);
        // wx.setStorageSync('list', res.data) //缓存到本地
        page.setData({
          //第一个data为固定用法
          list: res.data,
        })
      }
    })
    
  },
  Datejia(e) {
    var dateTime = new Date(this.data.date); //用Date对象将时间转换成中国标准时间
    console.log(dateTime)
    dateTime = new Date(dateTime.setDate(dateTime.getDate() + 1)) //Day+1
    console.log(dateTime)
    dateTime = dateTime.toJSON().substring(0, 10) //转换成yyyy-mm-dd格式
    console.log(dateTime)
    this.data.date=dateTime
    console.log(this.data.date)
    this.setData({
      date: this.data.date
    })
   this.DataOnLoad() 
  },
  Datejian(){
    var dateTime = new Date(this.data.date);//用Date对象将时间转换成中国标准时间
    dateTime = new Date(dateTime.setDate(dateTime.getDate() - 1)) //Day+1
    dateTime = dateTime.toJSON().substring(0, 10) //转换成yyyy-mm-dd格式
    this.data.date=dateTime
    this.setData({
      date: this.data.date
    })
    this.DataOnLoad() 
  }
})
