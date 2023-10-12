// components/recent-festival/recent-festival.js
Component({
	options: {
		styleIsolation: "isolated"
	},
	/**
	 * 组件的属性列表
	 */
	properties: {
		recentFestival: {
			type: Array,
			default: [],
			// 由于api设置的定时器问题，数据初始传入为空数组，监听数据变化进行debug
			// 注意，此时执行了两次该函数，第一次为初始赋值[]第二次为有数据的数组
			observer: function(newVal,oldVal){
				this.filterObtainedData(newVal);
			}
		}
	},

	// 组件的声明周期
	lifetimes: {
		attached(){

		}
	},
	/**
	 * 组件的初始数据
	 */
	data: {
		newRecentFestival:[]
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		// 过略获得的节日数组数据(由于传入的数据不全是自己想要的，需要过滤一下)
		filterObtainedData(data){
			console.log("@data",data)
			// 过略负数，保留3位(splice删除了前三个元素将删除的元素赋值给了newData)
			let newData = data.filter( item =>{
				return item.residueDays >= 0 
			}).splice(0,3);
			console.log("@newData",newData)
			this.setData({
				"newRecentFestival": newData
			})
		}
	}
})
