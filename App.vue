<script>
	let platform
	// #ifdef MP-WEIXIN
	platform = 1
	// #endif
	// #ifdef MP-TOUTIAO
	platform = 2
	// #endif
	// #ifdef MP-KUAISHOU
	platform = 3
	// #endif
	// #ifdef H5
	platform = 4
	// #endif
	export default {

		onLaunch: function() {

			let version = "1.0.3"
			console.log(
				`\n %c 云AI助手V${version} %c 公众号：南羽工作室 \n\n`,
				"color: #ffffff; background: #3c9cff; padding:5px 0;",
				"color: #3c9cff;background: #ffffff; padding:5px 0;"
			);
			let oldVersion = uni.getStorageSync('version') || ''
			if (version != oldVersion) {
				uni.removeStorageSync('chat')
				uni.setStorageSync('version', version)
			}
			uni.hideTabBar();
			this.getTabbar();
			this.getLoginConfig();
			this.getRobot();
			this.getAd();
			this.getModelList()
		},
		methods: {
			// 获取底部tabbar
			async getTabbar() {
				const {
					data
				} = await uni.$u.http.post("/app/renovation/tabbar/list");

				this.$store.commit('setTabbar', data.data?.filter(item => item.platform === platform || item
					.platform === 0) || [])
				this.$store.commit('setTabbarIndex', 0)
				data?.data && uni.switchTab({
					url: data.data?. [0]?.pagePath
				})
			},
			async getLoginConfig() {
				const {
					data
				} = await uni.$u.http.get("/app/application/info/loginConfig");
				uni.setStorageSync("loginConfig", data.data);
			},
			// 获取机器人配置
			async getRobot() {
				const {
					data
				} = await uni.$u.http.get("app/robot/info/info", {
					params: {
						id: 1,
					},
				});
				this.$store.commit('setRobot', data.data)
			},
			// 获取广告
			async getAd() {
				const {
					data
				} = await uni.$u.http.post("/app/ad/info/list");
				data.data.forEach(item => {
					item.desc = item.desc?.replace(
						/\<p\>&lt;ad(.*?)&gt;&lt;\/ad&gt;\<\/p\>/g,
						'<ad$1></ad>'
					);
				})

				uni.setStorageSync("ad", data.data?.filter(item => item.platform === platform || item
					.platform === 0) || []);
			},

			// 获取模型
			async getModelList() {
				const {
					data
				} = await uni.$u.http.post('/app/chatgpt/model/list')
				this.$store.commit('setModelList', data.data)
				console.log(this.$store.state.model)
				if (!this.$store.state.model.id) {
					this.$store.commit('setModel', data.data?. [0] || {})
				}

			}
		}
	};
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
	@import "style/common.scss";
	@import "style/theme.scss";

	page {
		// background: #353541;
		// background: #ececec;
		height: 100%;
		font-size: 28rpx;
		font-family: "PingFang SC", "Helvetica Neue", Helvetica, Arial, sans-serif;
	}
</style>
