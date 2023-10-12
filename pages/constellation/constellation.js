// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    daydetail:[
      {
        tip:'综合指数',
        text:'今天的你在人际交往中可能比较强势，让别人无要多注意法猜透你的想法，从而影响你的人缘，自己的言行;今天的你学习热情高涨，外出旅行也是不错的选择。',
    },
      {
        tip:'财运指数',
        text:'你可能还处于观望的姿态，有自己看好的项目，只是投入不多，所以进账也是一般般，不过应付日常花销没压力。'
      },
      {
        tip:'度情指数',
        text:'单身的没有时间发展感情，容易忽略身边的缘分。己有伴者只是在乎自己的感受，也要注意两人的相处方式。'
      },
      {
        tip:'工作指数' ,
        text:'工作方面敢于在一些高难度的任务上进行挑战，能够让人看到你很强的爆发力，众人都对你刮目相看，有点小骄傲。'
      }
    ],
    list:0
  },
  changeList(e){
   
    this.setData({
      list:e.currentTarget.dataset.list
    })
  },
  change(e){
    // console.log(e)
    this.setData({
      list:e.detail.current
    })
  },
  
  onLoad() {
   
  },
})
