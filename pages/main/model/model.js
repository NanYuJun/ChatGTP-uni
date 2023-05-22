export default {
	methods: {
		changeModel(item) {
			if (!this.$login()) {
				return
			}
			let userInfo = uni.getStorageSync('appUserInfo')
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
						if(this.$store.state.chatLoading){
							return uni.showToast({
								title:'目前消息还在加载中，请停止后再进行切换。',
								icon:'none'
							})
						}
						this.$store.commit('setChat')
						this.$store.commit('setModel', item)
						uni.showToast({
							title: '您已成功将AI助手切换为' + item.name,
							icon: 'none'
						})
						setTimeout(() => {
							uni.$u.route(this.robot.url)
						}, 1000)

					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}

			})

		},
	}
}