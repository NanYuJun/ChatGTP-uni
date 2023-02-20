<script>
	export default {
		onLaunch: function() {
			this.getAd()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			async getAd() {
				const {
					data
				} = await uni.$u.http.post('/app/ad/info/list', {
					"position": this.adPosition,
				}, {
					timeout: 300000
				})
				uni.hideLoading()
				if (data.code != 1000) {
					uni.showToast({
						title: data.message,
						icon: 'none'
					})
				}
				uni.setStorageSync('ad', data.data)
			}
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";

	page {
		font-size: 28rpx;
	}
</style>
