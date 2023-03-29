import {
	mapState
} from 'vuex'
export default {
	data() {
		return {
			userInfo: {},
			currentRoute: '',
			inviterUserId: '',
		}
	},
	computed: mapState({
		// 从state中拿到数据 箭头函数可使代码更简练
		tabbar: state => state.tabbar,
		robot: state => state.robot,
		modelList: state => state.modelList,
		theme: state => state.theme
	}),
	onLoad(e) {
		uni.hideTabBar()
		// #ifdef MP
		if (this.theme == 'dark') {
			uni.setBackgroundColor({
				backgroundColor: '#353540',
				backgroundColorTop: '#353540',
				backgroundColorBottom: '#353540'
			});
		}
		// #endif

		if (e.inviterUserId) {
			this.inviterUserId = e.inviterUserId
			uni.setStorageSync('inviterUserId', e.inviterUserId)
		}
		var pages = getCurrentPages() // 获取栈实例
		this.currentRoute = pages[pages.length - 1].route; // 获取当前页面路由

	},
	onShow() {
		// let isNight = (new Date()).getHours() >= 18 || (new Date()).getHours() <= 5;
		// this.$store.commit('setTheme', isNight ? 'dark' : 'light')
	},
	// 消息分享
	onShareAppMessage(res) {
		let userInfo = uni.getStorageSync('userInfo')
		return {
			imageUrl: this.robot.invitationImg,
			title: this.robot.invitationTitle,
			path: `${this.currentRoute}?inviterUserId=${userInfo.id}`
		}
	},
	// 朋友圈分享
	onShareTimeline(res) {
		let userInfo = uni.getStorageSync('userInfo')
		return {
			imageUrl: this.robot.invitationImg,
			title: this.robot.invitationTitle,
			path: `${this.currentRoute}?inviterUserId=${userInfo.id}`
		}
	},
	methods: {
		// 广告
		ad(position) {
			let ad = uni.getStorageSync('ad')
			if (!ad) {
				return []
			}
			
			return ad.filter(item => item.position == position)
		},
		go(e) {
			uni.$u.route(e);
		},
	}
}
