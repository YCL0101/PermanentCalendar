# Headline

## tabbar相关页面
### 首页
### 我的

---

# 1. 起步
## 1.1 微信开发者工具 简介
微信开发者工作是微信官方提供的针对微信小程序的开发工具，集中了开发，调试，预览，上传等功能。 微信开发者工作是微信官方提供的针对 微信小程序的开发工具 ，集中了开发，调试，预览，上传等功能。 微信团队发布了微信小程序开发者工具、微信小程序开发文档和微信小程序设计指南，全新的开发者工具，集成了开发调试、代码编辑及程序发布等功能，帮助开发者简单和高效地开发微信小程序。
# 2. tabBar
 ## 2.0 创建tabBar分支
  运行如下命令，基于master分支在本地创建 tabbar子分支，用来开发和tabbar有关的功能:
```js
git checkout -b tabbar
```

## 2.1 创建tabBar页面
在pages目录中，创建首页(home)，我的(me)这两个tabBar页面。在微信小程序中可以在app.js中定义
```json
"pages":[
    "pages/home/home",
    "pages/me/me"
  ],
  "tabBar": {
         "selectedColor": "#c00000",
		"list": [
			{
			"pagePath": "pages/home/home",
			"text": "首页",
			"iconPath": "/images/tabBar/home.png",
			"selectedIconPath": "/images/tabBar/home_fill.png"
		},
		{
			"pagePath": "pages/me/me",
			"text": "我的",
			"iconPath": "/images/tabBar/my.png",
			"selectedIconPath": "/images/tabBar/my_fill.png"
		}
	]
	},
```

## 2.2 分支的提交与合并

1. 将本地的tabBar分支进行本地commit提交
```
git commit -m '完成了 tabBar 的开发'
```
2. 将本地的tabBar分支推送到远程分支进行保存
```
git push -u origin tabBar
```
3. 将tabBar分支合并到主分支master上
```
git checkout master
git merge tabBar
```
# 3. 首页
## 3.0 创建home分支


运行如下命令，基于master分支创建home分支，用来开发和home模块相关的功能:
```
git checkout -b home
```

## 3.1 home页面功能拆分
将首页功能拆分为
1. 日期展示
2. 日期天气
3. 临近节假

## 3.2 封装需要使用的公共方法和全局数据
### 3.2.1 公共方法
0. 创建m_home模块
   将一部分方法放到m_home模块当中

1. Promise风请求数据
   ```js
		wxRequest: function (path, url, method, params) {
			return new Promise((resolve, reject) => {
				wx.request({
					url: path + url,
					method: method,
					data: params,
					success: res => resolve(res),
					fail: res => reject(res)
				})
			})
		},
   ```
2. 获取本地数据
   ```js
	getLocalDate: function (val) {
			return wx.getStorageSync(val)
		},
	```


3. 设置本地数据
   ```js
	setLocalData: function (key, val) {
			wx.setStorageSync(key, val)
		},
   ```
4. 展示提示信息
   ```js
	showMsg: function (title = "某处出错了，触发了showMsg") {
			wx.showToast({
				title: title,
			})
		},
   ```
5. 获取当前日期对象
   ```js
   getCurrentDate: function () {
			let date = new Date();
			let year = date.getFullYear(); //当前年
			let month = date.getMonth() + 1; //当前月
			let day = date.getDate(); //当前日
			month = month < 10 ? `0${month}` : month //如果月份小于10，补0
			day = day < 10 ? `0${day}` : day //如果日份小于10，补0
			let currentDateToMonth = `${year}-${month}`;
			let currentDateToDay = `${year}-${month}-${day}`;
	
			// 封装date日期数据并返回该对象
			return {
				year, // yyyy
				currentDateToMonth, //yyyy-mm
				currentDateToDay, // yyyy-mm-dd 选中天日期
				today: currentDateToDay //今天，值不会改变
			}
		},
   ```
6. 导出m_home模块
   ```js
	module.exports = {
		m_home
	}
   ```
7. 在home.js导入m_home模块
   ```js
   import {
	m_home
   } from "../../utils/m_home"
   ```
### 3.2.2 全局共享数据
0. 在app.js文件内设置全局共享数据 
   ```js
     globalData: {
		userInfo: null,
		app_id: 'urkujhmpolpzpqkq',
		app_secret: 'VVJ2SUFuVlB5RTNaUmFySTVoaTJOQT09',
		ignoreHoliday:false,
		base_date_url: 'https://www.mxnzp.com/api/holiday',
		base_weather_url: 'https://www.mxnzp.com/api/weather',
    }
   ```
1. 在home.js文件引入全局共享数据
   ```js
   // 全局公共数据
   const GLD = getApp().globalData;
   ```
## 3.3 日期展示功能

### 3.3.1. 日期基本展示
1. 在data里定义日期基本展示相关数据 `selectedYearArr: [],`
   ```js
   	data: {
		/**当前选中年 */
		selectedYearArr: [],
	},
   
   ```
2. 定义向服务器请求展示日期所需数据 的方法 `getSelectedYearArr()`
   ```js
   	/**
	 * 🚩向服务器获取指定年数据并将数据保存到`data`里`selectedYearArr`中
	 * @param {string | number} year 哪年
	 * @param {function} callBack 获取数据后执行的回调
	 */
	getSelectedYearArr(year, callBack = () => {}) {
		let page = this
		// 设置请求的参数
		const params = {
			ignoreHoliday: GLD.ignoreHoliday,
			app_id: GLD.app_id,
			app_secret: GLD.app_secret
		}
		// 向服务器请求数据，返回promise对象
		let res = m_home.wxRequest(GLD.base_date_url, '/list/year/' + year, "get", params)
		// 收到服务器返回结果后，根据成功与否进行处理
		res.then(value => {
			page.setData({
				// 将服务器成功响应时，对请求的数据再加工后，保存到本地
				selectedYearArr: page.machineSelectedYearArr(value.data.data)
			})
		}, error => m_home.showMsg("请求日期数据失败了")).then(() => callBack()) //执行回调函数
   
	},
   ```
3. 定义 加工 请求展示日期所需数据 的方法 `machineSelectedYearArr`
   由于直接请求来的数据不符合展示数据的需求，需要对其再加工，相关代码如下：
   
   ```js
		/**
	 * 加工获取到的年数据，返回加工的数据
	 * @param {[]} initYearArr 未加工前的年数据
	 * @return {[]} 加工后的年数据
	 */
	machineSelectedYearArr(initYearArr) {
		for (let i = 0; i < initYearArr.length; i++) {
			// 周数组
			let weeks = []
			// 天对象
			let weekObj = {}
			// 计数
			let n = 0
			// 当前月有几天
			let dayOfMonth = initYearArr[i].days.length
			// 当前月的第一天是周几(1-7)
			let weekDay = initYearArr[i].days[0].weekDay
			// console.log('@weekDay', weekDay)
			// 当前月有几周
			let weekOfMonth = parseInt((dayOfMonth + (weekDay == 7 ? 0 : weekDay)) / 7 + 1)
   		// console.log('@weekOfMonth', weekOfMonth)
	
			// 遍历每月几周
			for (let wi = 0; wi < weekOfMonth; wi++) {
				// 初始化数组
				weeks[wi] = new Array(7)
				// 遍历7天
				for (let j = 0; j < 7; j++) {
					// 当处在第一个七天时，根据当月第一天为周几进行空对象赋值
					if (wi === 0 && j < weekDay && weekDay !== 7) {
						weeks[0][j] = weekObj
						// console.log('@	weeks[0][n]',weeks)
					} else {
						weekObj = initYearArr[i].days[n] === undefined ? {} : initYearArr[i].days[n]
						weekObj.atWeekOfMonth = wi //当前月的哪周(0为第一周)
						weeks[wi][j] = weekObj
						// console.log('@weeks[i][n]',weeks)
						n++
					}
				}
				// console.log('@weeks', weeks)
	
			}
			// console.log('@initYearArr',initYearArr)
			initYearArr[i].weeks = weeks
			// console.log('@initYearArr',initYearArr)
		}
		return initYearArr
   },
   ```
4. 定义检测本地数据是否具有该年数据的方法 `checkLocalDataOfYear(year)`
   ```js
   	/**
	 * 检查本地是否有该选中年数据
	 * @param {string | number} year 年份数据
	 * @return {boolean} boolen
	 */
	checkLocalDataOfYear(year) {
		let result = m_home.getLocalDate("selectedYearArrs")
		// console.log('checkLocalDataOfYear@result', result)
		if (result != '') {
			return result.some((ele) => {
				return ele.some((item) => {
					return item.year == year
				})
			})
		} else {
			return false
		}
	},
   ```
5. 定义获取本地该年数据的方法  `getLocalDataOfYear`
   ```js
   	/**
	 * 获取本地数据关于选中年
	 * @param {string | number} year 传入年
	 * @return {[]} 本地关于年的数据
	 */
	getLocalDataOfYear(year) {
		console.log('获取本地数据关于年里的getLocalDataYear启动')
		let result = m_home.getLocalDate("selectedYearArrs")
		return result.find(ele => {
			// console.log('find方法启动,ele值为', ele)
			return ele.some(item => {
				return item.year == year
			})
		})
	},
   ```
6. 定义设置本地该年数据的方法 `setLocalDataOfYear`
   ```js
   		/**
	 * 设置本地数据关于选中年
	 * @param {string | number} newSelectedYear 新的选中年数据
	 */
	setLocalDataOfYear(newSelectedYear) {
		let result = m_home.getLocalDate("selectedYearArrs")
			// 将年数据保存到本地
			m_home.setLocalData("selectedYearArrs", [...result, newSelectedYear]);
	},
   ```
7. 定义页面加载初始化年数据的方法 `calendarImp`
   ```js
   	/**实现`日历`相关功能 */
	calendarImp() {
		let page = this
		// 1.获取当前日期对象
		const todayObj = m_home.getCurrentDate();
		console.log('开始进行本地是否具有年数据的判断')
   
		if (page.checkLocalDataOfYear(todayObj.year)) {
   
			// 获取本地数据
			console.log('本地有该年数据，获取并设置该年数据')
			page.setData({
				selectedYearArr: page.getLocalDataOfYear(todayObj.year),
				"currentDate.tody": todayObj.today
			})
			//  3. (限制:获取到源年数据后可用此方法)根据指定日期设置选中天
			page.getSelectedDay(todayObj.currentDateToDay, () => {
				// onload中第一次使用获取选中天，加一个当天属性(跟我的日历组件-回到今天 功能相关)
				this.setData({
					"currentDate.tody": todayObj.today
				})
			})
   
		} else {
			console.log('本地没有该年数据，请求数据并将数据保存本地')
			// 2.向服务器获取指定年份数据并加工保存
			page.getSelectedYearArr(todayObj.year, () => {
				// 3. (限制:获取到源年数据后可用此方法)根据指定日期设置选中天
				page.getSelectedDay(todayObj.currentDateToDay, () => {
					// onload中第一次使用获取选中天，加一个当天属性(跟我的日历组件-回到今天 功能相关)
					this.setData({
						"currentDate.tody": todayObj.today
					})
					// 将年数据保存到本地
					m_home.setLocalData("selectedYearArrs", [page.data.selectedYearArr]);
				})
			})
		}
	},
   ```
8. 在页面加载时调用`初始化年数据`方法
   ```js
   	onLoad(options) {
		console.log('@onLoad执行')
		// 初始化
		// 实现日历
		this.calendarImp();
	},
   ```
9. 设置wxml的结构
   ```html
   <!--components/my-calendar/my-calendar.wxml-->
   <wxs src='../../filter/formatStr.wxs' module="unit" />
   <view class="component-calendar">
	<view class="picker">
		<!-- 市区选择 -->
		<picker mode="region" value="{{selectedRegion}}" level="province" bindchange="rigionChangeHandle">
			<view class="picker-region">
				<image class="icon-location" src="/images/icons/location_fill.png" mode="" />
				<text>{{selectedRegion[1]}}</text>
			</view>
		</picker>
		<!-- 🚩日期选择器 -->
		<picker mode="date" header-text="选择时间" fields="month" value="{{currentDate.currentDateToMonth}}" bindchange="dateChangeHandle">
			<view class="picker-date">
				<text></text>
				{{currentDate.currentDateToMonth}}
			</view>
		</picker>
		<!-- 回到今天功能，当为今天时隐藏 -->
		<view class="goToToday" hidden="{{currentDate.today == currentDate.selectDayObj.date}}" bindtap="goToTodayHandle">今</view>
		<view class="showSuit" bindtap="showSuit">{{suitTitle}}</view>
	</view>
	<scroll-view class="suit-list" hidden="{{isShowSuit}}" scroll-x="true" >
		<view class="suit-item {{suit==selectedSuitVal?'effect-selectedSuitHead':''}}" wx:for="{{suits}}" wx:key="index" wx:for-item="suit" data-suit="{{suit}}" bindtap="selectSuitHandle">{{suit}}</view>
	</scroll-view>
	<!-- 日期表格 -->
	<view class="table">
		<!-- 星期 -->
		<view class="tr">
			<view class="th">
				日
			</view>
			<view class="th">
				一
			</view>
			<view class="th">
				二
			</view>
			<view class="th">
				三
			</view>
			<view class="th">
				四
			</view>
			<view class="th">
				五
			</view>
			<view class="th">
				六
			</view>
		</view>
		<!-- 每周 -->
		<view class="tr" wx:for="{{selectedYearArr[unit.filteDate(currentDate.currentDateToMonth) - 1].weeks}}" hidden="{{ !isUnfold&&(index == currentDate.selectDayObj.atWeekOfMonth ? false: true)}}" wx:for-item="oneWeek" wx:key="index">
			<!-- 一周的每天 -->
			<view class="td {{ unit.isSelected(day,currentDate.selectDayObj) }} {{unit.isSubString(day.suit,selectedSuitVal)}}" wx:for="{{oneWeek}}" wx:for-item='day' wx:for-index='idx' wx:key="idx" data-day="{{day}}" bindtap="selectDayHandle">
				<view class="calendar">
					<view class="solarCalendar {{day.weekDay >= 6 ? 'dayOff' : ''}}">
						{{unit.filteDate(day.date)}}
					</view>
					<view class="lunarCalendar {{unit.is_FestivalOr_solarTerms(day) ? 'isFestival' : ''}}">
						<!-- {{unit.getLastTwoChars(day.lunarCalendar)}} -->
						{{unit.fil_FestivalOr_solarTerms(day)}}
					</view>
				</view>
			</view>
		</view>
   
	</view>
	<view class="unfold" bindtap="unfoldHandle">
		<image class="icon-fold" src="{{icon_foldArr[isUnfold ? 1 : 0]}}" mode="" />
		<text> {{isUnfold ? "收起" : "展开"}}</text>
	</view>
   </view>
   ```
10. 设置wxss样式
   ```css
   ......省略
   ```
11. 将 该展示日期功能 设为组件
12. 在home页面使用该组件
    - 在home,json文件引用组件
      ```json
      {
	  "usingComponents": {
        "recent-festival": "/components/recent-festival/recent-festival",
				"date-weather":"/components/date-weather/date-weather",
				"my-calendar":"/components/my-calendar/my-calendar"
	  }
      }
      ```
    - 在home.wxml文件使用该组件
      ```html
      <!-- 🚩日期选择器组件 -->
      <my-calendar  
      currentDate="{{currentDate}}" 
      selectedYearArr="{{selectedYearArr}}" 
      selectedRegion = "{{selectedRegion}}"
      bind:midSetSelectedDay="upSetSelectedDay"
      bind:midSetSelectedMonth="upSetSelectedMonth"
      bind:midSetSelectedRegion="upSetSelectedRegion"
      bind:midSetGoToTody="upSetGoToTody"></my-calendar>
      ```
### 3.3.2  点击日期选中

1. 在m-calendar组件内,给wxml里日期元素绑定事件`selectDayHandle`
   ```html
   	<view class="td {{ unit.isSelected(day,currentDate.selectDayObj) }} {{unit.isSubString(day.suit,selectedSuitVal)}}" wx:for="{{oneWeek}}" wx:for-item='day' wx:for-index='idx' wx:key="idx" data-day="{{day}}" bindtap="selectDayHandle">
   ```
2. 在m-calendar组件内,在js中定义事件`selectDayHandle`
   ```js
   // 点击日历天时保存点击到的天(选中)
		selectDayHandle(e) {
			console.log('@e', e)
			if (JSON.stringify(e.currentTarget.dataset.day) == "{}") {
				return;
			}
			// 向页面传递数据
			this.triggerEvent('midSetSelectedDay', e.currentTarget.dataset.day)
		},
   ```
3. 在home,js内设置接收选中天数据的处理 `upSetSelectedDay`
   ```js
   	// 🚩组件间传递数据
	// 接收组件传来天对象的数据的处理函数(选中天功能一部分)
	upSetSelectedDay(e) {
		console.log('upSetSelectedDay:@e', e)
		this.getSelectedDay(e.detail.date)
	},
   ```
4. 定义设置选中天的方法`getSelectedDay`
   ```js
   	/**
	 * 🚩根据指定天获取并设置选中天数据保存在`data`里的`currentDate`中
	 * @param {string} yymmdd 哪天，格式为yy-mm-dd
	 * @param {function} callBack 可选的回调函数(回调函数可选，主要用来设置今天数据或者其他))
	 */
	getSelectedDay(yymmdd, callBack = () => {}) {
		let yymmddArr = yymmdd.split('-')
		let month = parseInt(yymmddArr[1]) //获取月份
		// console.log('@month', month)
		// console.log('@selectedYearArr', this.data.selectedYearArr)
		let targetDay = this.data.selectedYearArr[month - 1].days.find(day => {
			return day.date == yymmdd
		})
		this.setData({
			"currentDate.year": yymmddArr[0],
			"currentDate.selectDayObj": targetDay,
			"currentDate.currentDateToDay": yymmdd,
			"currentDate.currentDateToMonth": `${yymmddArr[0]}-${yymmddArr[1]}`,
		})
		callBack();
   
	},
   ```

### 3.3.3  选择月份和年份

1. 在my-calendar组件内,wxml中给日期选择器绑定事件 `dateChangeHandle`
   ```html
   	<!-- 🚩日期选择器 -->
		<picker mode="date" header-text="选择时间" fields="month" value="{{currentDate.currentDateToMonth}}" bindchange="dateChangeHandle">
			<view class="picker-date">
				<text></text>
				{{currentDate.currentDateToMonth}}
			</view>
		</picker>
   ```
2. 在my-calendar组件内,js中定义日期改变的处理方法`dateChangeHandle`
   ```js
   // 选择年月时日期变化的处理函数
		dateChangeHandle(e) {
			console.log('@e', e)
			// 向页面传递数据
			this.triggerEvent('midSetSelectedMonth', e.detail.value)
		},
   ```
3. 在home页面内,js中定义接收日期变化的处理  `upSetSelectedMonth`
   ```js
   	/**接收组件传来的月数据的处理函数（选中月展示日历功能一部分） */
	upSetSelectedMonth(e) {
		let page = this
		console.log('upSetSelectedMonth@e', e)
		// 检测年是否变化，如果变化需要从新请求数据
		let oldYear = this.data.currentDate.year;
		let newYear = e.detail.split('-')[0];
   
		if (newYear == oldYear) {
			this.getSelectedDay(`${e.detail}-01`)
		} else {
			// 本地数据相关
			if (this.checkLocalDataOfYear(newYear)) {
				console.log('本地有该年数据，获取并设置该年数据')
				this.setData({
					selectedYearArr: this.getLocalDataOfYear(newYear)
				})
				// 更新选中数据
				this.getSelectedDay(`${e.detail}-01`)
			} else {
				// 获取并保存指定年数据
				this.getSelectedYearArr(newYear, () => {
					// 更新选中数据					
					this.getSelectedDay(`${e.detail}-01`)
					// 将新的选中年数据保存到本地
					this.setLocalDataOfYear(this.data.selectedYearArr)
				})
			}
		}
	},
   ```
### 3.3.4  回到今天
1. 在my-calendar组件内,wxml中对应标签 绑定回到今天的处理方法 `goToTodayHandle`
   ```html
   <!-- 回到今天功能，当为今天时隐藏 -->
		<view class="goToToday" hidden="{{currentDate.today == currentDate.selectDayObj.date}}" bindtap="goToTodayHandle">今</view>
   ```
2. 在my-calendar组件内,js中定义 回到今天的处理方法 `goToTodayHandle`
   ```js
   	// 点击 回到今天的处理函数
		goToTodayHandle(e) {
			// 向页面传递数据
			this.triggerEvent('midSetGoToTody')
		},
   ```
3. 在home页面内,js中定义 接收回到今天消息 的处理方法 `upSetGoToTody`
   ```js
   	/**我的日期列表组件内点击回到今天的处理函数 */
	upSetGoToTody(e) {
		console.log('upSetGoToTody@e', e)
		let currentDateObj = m_home.getCurrentDate(); //当前天数据对象
		// 检测年是否变化，如果变化需要从新请求选中对象
		let newYear = currentDateObj.year;
		let oldYear = this.data.currentDate.year;
   
		if (newYear == oldYear) {
			this.getSelectedDay(currentDateObj.currentDateToDay) //获取并设置当前选中天
		} else {
			if (this.checkLocalDataOfYear(newYear)) {
				console.log('本地有该年数据，获取并设置该年数据')
				this.setData({
					selectedYearArr: this.getLocalDataOfYear(newYear)
				})
				// 更新选中数据
				this.getSelectedDay(currentDateObj.currentDateToDay)
			} else {
				// 获取指定年数据(源)
				this.getSelectedYearArr(newYear, () => {
					// 更新选中数据
					this.getSelectedDay(currentDateObj.currentDateToDay)
					// 将新的选中年数据保存到本地
					this.setLocalDataOfYear(this.data.selectedYearArr)
				})
			}
		}
   
	},
   ```
### 3.3.5  选择吉日
1. 在my-calendar组件内，wxml中绑定选中吉日的处理事件 `selectSuitHandle`
   ```html
   <!-- 选中吉日 -->
		<view class="showSuit" bindtap="showSuit">{{suitTitle}}</view>
	</view>
	<scroll-view class="suit-list" hidden="{{isShowSuit}}" scroll-x="true" >
		<view class="suit-item {{suit==selectedSuitVal?'effect-selectedSuitHead':''}}" wx:for="{{suits}}" wx:key="index" wx:for-item="suit" data-suit="{{suit}}" bindtap="selectSuitHandle">{{suit}}</view>
	</scroll-view>
   ```
2. 在my-calendar组件内，js中定义 选中吉日的 处理事件 `selectSuitHandle`
   ```js
   	// 点击suit-item的处理函数(目的是改数据在页面通过wXs过滤选出指定盒子添加选中suit效果类)
	selectSuitHandle(e){
		let selectedSuitVal = e.currentTarget.dataset.suit
		console.log("sutiHandle@e",e)
		this.setData({
			selectedSuitVal: selectedSuitVal
		})
	},
   ```
3. 在过滤器内设置 过滤出拥有该suit方法 `isSubString`
   ```js
   /**当前选中suit是否在suits数组存在，如果存在返回类名effect-selectedSuit） */ 
   var isSubString = function(sourceStr,targetStr) {
	if(typeof(sourceStr)=="undefined") {
		return ""
	}
	var index = sourceStr.search(targetStr)
	// console.log("index",index)
	if(index == -1 || targetStr=="") {
		return false
	} else {
		return "effect-selectedSuit"
	}
   }
   ```

### 3.3.6  展开与收起

1. 在my-calendar组件内，wxml中绑定 展开收起 处理事件 `unfoldHandle`
   ```html
   <view class="unfold" bindtap="unfoldHandle">
		<image class="icon-fold" src="{{icon_foldArr[isUnfold ? 1 : 0]}}" mode="" />
		<text> {{isUnfold ? "收起" : "展开"}}</text>
   ```
2. 在my-calendar组件内，js中定义 展开收起 处理事件 `unfoldHandle`
   ```js
   	unfoldHandle(){
		this.setData({
			isUnfold: !this.data.isUnfold
		})
	}
   ```
3.  在my-calendar组件内，wxml中设置隐藏行方式
   ```html
   	<view class="tr" wx:for="{{selectedYearArr[unit.filteDate(currentDate.currentDateToMonth) - 1].weeks}}" hidden="{{ !isUnfold&&(index == currentDate.selectDayObj.atWeekOfMonth ? false: true)}}" wx:for-item="oneWeek" wx:key="index">
   	......省略
   	</view>
   ```
## 3.4 日期天气功能
### 3.4.1 展示日期天气
1. 在home页面内，js中 data内定义实时天气的数据 `urrentWeather: {}`
   ```js
   	data: {
   	    ......省略
		// 实时天气的数据
		currentWeather: {},
	},
   ```
2. 在js中定义获取实时天气数据的方法 `getCurrentWeather`
   ```js
   	/**
	 * 🚩向服务器获取指定获取指定区域天气数据并设置`data`里`currentWeather`中
	 * @param {string} selectedRegion 哪年
	 */
	getCurrentWeather(selectedRegion) {
		let page = this
		// 设置请求的参数
		const params = {
			app_id: GLD.app_id,
			app_secret: GLD.app_secret
		}
		let res = m_home.wxRequest(GLD.base_weather_url, '/current/' + selectedRegion[1], "get", params)
		res.then(value => {
			page.setData({
				currentWeather: value.data.data
			})
		}, error => m_home.showMsg("请求天气数据失败了"))
	},
   ```
3. 在js中定义`初始化天气数据`的方法  `dateWeatherImp`
   ```js
   	/**实现`天气`相关功能 */
	dateWeatherImp() {
		//4. 向服务器获取实时天气数据并保存(由于目标接口api不可快速请求，设了个定时器)
		let timer1 = setTimeout(() => {
			this.getCurrentWeather(this.data.selectedRegion);
		}, 1500)
	},
   ```
4. 在页面加载时调用`初始化天气数据`方法
   ```js
   	onLoad(options) {
		console.log('@onLoad执行')
		// 初始化
		// 实现日历
		this.calendarImp();
		// 实现日期天气
		this.dateWeatherImp();
	},
   ```
5. 设置日期天气展示 wxml的结构 
   ```html
   <!--components/date-weather/date-weather.wxml-->
   <!-- 🚩选中日期详情展示 -->
   <view class="component">
	<view class="dateWeatherBox">
		<view class="lunardateDeatil">
			<view class="lunarTitle">
			<view class="lunarTitle-tip">农历</view>
			<view class="lunarTitle-text">	{{currentDate.selectDayObj.lunarCalendar}}</view>
			
			</view>
			<view class="lunarTitleContent">
				{{currentDate.selectDayObj.yearTips + currentDate.selectDayObj.chineseZodiac + '年' + '  星期' + currentDate.selectDayObj.weekDay}}
			</view>
   
			<view class="suitAvoid">
				<view class="suit">
					<view class="suit-icon">
						宜
					</view> 
					<view class="suit-content">{{currentDate.selectDayObj.suit}}</view>
				</view>
				<view class="avoid">
				<view class="avoid-icon">
					忌
				</view>
				<view class="avoid-content">	{{currentDate.selectDayObj.avoid}}</view>
				</view>
			</view>
   
		</view>
		<view class="weatherDetail">
			<!-- 温度 -->
			<view class="temp">
				{{currentWeather.temp}}
			</view>
			<!-- 天气 -->
			<view class="weather">
				{{currentWeather.weather}}
			</view>
			<view class="windPower">
			  {{currentWeather.windDirection }}
				<text decode="true">&nbsp;</text>
				{{currentWeather.windPower}}
   
			</view>
		</view>
	</view>
	<view class="futureWeather">
	</view>
   </view>
   ```
6. 将日期天气展示 设为组件 `date-weather`
7. 在home.json引用 日期天气组件
   ```json
   "usingComponents": {
   			"date-weather":"/components/date-weather/date-weather",
				"my-calendar":"/components/my-calendar/my-calendar"
	}
	```
8. 在home.wxmll使用 日期天气组件
   ```html
   <!-- 🚩选中日期天气详情展示组件 -->
   <date-weather currentDate="{{currentDate}}" currentWeather="{{currentWeather}}"></date-weather>
   ```
### 3.4.2 选中日期展示节日
1. 直接使用data里选中数据 `currentDate: {}`
   ```js
		data: {
			......省略
			currentDate: {},
		},
   ```
### 3.4.3 选中区域展示天气
1. 在my-calendar组件内，wxml中 给地区选择器绑定选中地区处理事件`rigionChangeHandle`
   ``` html
	<!-- 市区选择 -->
		<picker mode="region" value="{{selectedRegion}}" level="province" bindchange="rigionChangeHandle">
			<view class="picker-region">
				<image class="icon-location" src="/images/icons/location_fill.png" mode="" />
				<text>{{selectedRegion[1]}}</text>
			</view>
		</picker>
   ```
2. 在在my-calendar组件内，js中 定义 地区改变的处理事件 `rigionChangeHandle`
   ```js
   		// 点击省市区选择器的处理函数
		rigionChangeHandle(e) {
			// this.setData({
			// 	selectedRegion:e.detail.value
			// })
			// 向页面传递数据
			this.triggerEvent('midSetSelectedRegion', e.detail.value)
		},
   ```
3. 在home页面内，js中 定义 接收地区改变消息 的处理事件 `upSetSelectedRegion`
   ```js
   	/**接收组件传来的地区数据的处理函数（选中市区、展示市区功能的一部分） */
	upSetSelectedRegion(e) {
		console.log('upSetSelectedRegion@e', e)
		this.setData({
			"selectedRegion": e.detail
		})
		// 从新向服务器请求天气数据
		this.getCurrentWeather(this.data.selectedRegion);
	},
   ```
## 3.5 临近节假功能
### 3.5.1 展示临近节假
1. 在home页面内,js中，在data里定义临近节日的数据 `recentFestival: []`
   ```js
   	data: {
   		......省略
		// 最近节日的数据
		recentFestival: [],
	},
   ```
2. 在home页面内,js中，定义向服务器请求临近节日数据的方法`getRecentFestival`
   ```js
   	/**
	 * 🚩向服务器获取并设置临近的一些节日数据
	 */
	getRecentFestival() {
		let page = this
		// 设置请求的参数
		const params = {
			ignoreHoliday: GLD.ignoreHoliday,
			app_id: GLD.app_id,
			app_secret: GLD.app_secret
		}
		let res = m_home.wxRequest(GLD.base_date_url, '/recent/list', 'get', params);
		res.then(value => {
			page.setData({
				recentFestival: value.data.data
			})
		}, error => m_home.showMsg("最近节日数据请求失败"))
	},
   ```
3. 在home页面内，js中，定义初始化请求临近节日数据的方法 `recentFestivalImp`
   ```js
   	/**实现`最近节日`相关 */
	recentFestivalImp() {
		// 5.向服务器获取临近节日并保存(由于目标接口api不可快速请求，设了个定时器)
		let timer2 = setTimeout(() => {
			this.getRecentFestival();
		}, 3000)
	},
   ```
4. 在页面加载时，调用`recentFestivalImp`方法 初始化最近节日数据
   ```js
   	onLoad(options) {
		console.log('@onLoad执行')
		// 初始化
		// 实现日历
		this.calendarImp();
		// 实现日期天气
		this.dateWeatherImp();
		// 实现最近节日
		this.recentFestivalImp();
	},
   ```
4. 设置临近节日wxml的结构
   ```html
   <!-- 🚩临近节日 -->
   <view class="festivalCome">
	<view class="festivalComeHead">
		<view class="festivalComeHead-title"> 节假来临 </view>
		<view class="festivalComeHead-more"> 查看更多 </view>
	</view>
	<view class="festival-come-list">
		<view class="festival-item" wx:for="{{newRecentFestival}}" wx:for-item="festival" wx:key="index">
			<view class="festival-item-left">
				<view class="festival-item-name">
					{{festival.holidayName}}
				</view>
				<view class="festival-item-date">
					{{festival.date}}
				</view>
			</view>
			<view class="festival-item-right">
				<view class="esidue-daysr">
					{{festival.residueDays}}天
				</view>
			</view>
		</view>
	</view>
   </view>
   ```
5. 将临近节日功能 设置为组件`rencent-festival`
6. 在home.json中引入该组件 
   ```json
   {
	"usingComponents": {
        "recent-festival": "/components/recent-festival/recent-festival",
				"date-weather":"/components/date-weather/date-weather",
				"my-calendar":"/components/my-calendar/my-calendar"
	}
   }
   ```
7. 在home.wxml中使用该组件并向递数据
   ```html
   <!-- 🚩临近节日组件 -->
   <recent-festival recentFestival="{{recentFestival}}"></recent-festival>
   ```
## 3.6  分支和提交与合并
1.  将本地的 `home` 分支 进行本地commit提交
   ```git
   git add .
   git commit -m "完成了首页功能的开发"
   ```
2. 将本地的`home`分支推送到远程仓库进行保存
  ```git
   git push -u origin home
  ```
3. 将本地的`home`分支合并到本地master分支
   ```git
   git checkout master
   git merge home
   ```