// components/my-calendar/my-calendar.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		currentDate: {
			type: Object,
			default: {}
		},
		// 获取的年数据
		selectedYearArr: {
			type: Array,
			default: []
		},
		// 传来的地区数据
		selectedRegion: {
			type: Array,
			default: ['', '平顶山市', '']
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		suits:["嫁娶","祈福","理发","安床","出行","迁徙","订盟","交易","祭祀"],
		suitTitle: "择吉日",
		isShowSuit: true,
		selectedSuitVal: "",
		isUnfold:false,
		icon_foldArr:["/images/icons/unfold.png","/images//icons/fold.png"]
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		// 选择年月时日期变化的处理函数
		dateChangeHandle(e) {
			console.log('@e', e)
			// 向页面传递数据
			this.triggerEvent('midSetSelectedMonth', e.detail.value)
		},
		// 点击日历天时保存点击到的天(选中)
		selectDayHandle(e) {
			console.log('@e', e)
			if (JSON.stringify(e.currentTarget.dataset.day) == "{}") {
				return;
			}
			// 向页面传递数据
			this.triggerEvent('midSetSelectedDay', e.currentTarget.dataset.day)
		},
		// 点击省市区选择器的处理函数
		rigionChangeHandle(e) {
			// this.setData({
			// 	selectedRegion:e.detail.value
			// })
			// 向页面传递数据
			this.triggerEvent('midSetSelectedRegion', e.detail.value)
		},
		// 点击 回到今天的处理函数
		goToTodayHandle(e) {
			// 向页面传递数据
			this.triggerEvent('midSetGoToTody')
		},
		// 用户点击 选择吉日 的处理事件(简单的是否展示功能)
		showSuit(){
			// 点击suitTitle值为插号时，取消suit选中effect效果
			if(this.data.suitTitle == "X") {
				this.setData({
					selectedSuitVal: ""
				})
			}
			// 改后suittitle值
			let title = this.data.suitTitle == "择吉日" ? "X" : "择吉日"
			
			this.setData({
				suitTitle: title,
				isShowSuit: !this.data.isShowSuit
			})
	},
	// 点击suit-item的处理函数(目的是改数据在页面通过wXs过滤选出指定盒子添加选中suit效果类)
	selectSuitHandle(e){
		let selectedSuitVal = e.currentTarget.dataset.suit
		console.log("sutiHandle@e",e)
		this.setData({
			selectedSuitVal: selectedSuitVal
		})
	},
	unfoldHandle(){
		this.setData({
			isUnfold: !this.data.isUnfold
		})
	}
	}


})