import {
		mapState
	} from 'vuex'
	export default {
		computed: mapState({
			// 从state中拿到数据 箭头函数可使代码更简练
			tabbar: state => state.tabbar,
			robot: state => state.robot,
			modelList: state => state.modelList,
			model: state => state.model,
		}),
		onLoad() {
			uni.hideTabBar()

		},
		methods: {
			changeModel(item) {
				if (!this.$login()) {
					return
				}
				let userInfo = uni.getStorageSync('userInfo')
				if (!userInfo.expireTime && item.isVip) {
					uni.showToast({
						title: '会员专享，请先开通会员',
						icon: 'none'
					})
					return
				}
				uni.showModal({
					title: '温馨提示',
					content: '切换AI助理将会清除之前对话，是否确定切换？',
					success: (res) => {
						if (res.confirm) {
							uni.removeStorageSync('chat')
							this.$store.commit('setModel', item)
							uni.showToast({
								title: '您已成功将AI助手切换为' + item.name,
								icon: 'none'
							})
							setTimeout(() => {
								this.$refs.tabBar.switchTab(this.robot.url)
							}, 1000)

						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}

				})

			},
		}
	}