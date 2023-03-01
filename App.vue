<script>
	import {
		login
	} from "./config/login.js";
	export default {
		onLaunch: function() {
			this.getTabbar();
			uni.hideTabBar(); // 隐藏tabbar
			this.getConfig();
			this.getRobot();
			this.getAd();
		},
		methods: {
			async getTabbar() {
				const {
					data
				} = await uni.$u.http.post("/app/renovation/tabbar/list");
				uni.setStorageSync("tabbar", data.data);
				if (data.data) {
					let tabbarIndex = uni.getStorageSync('selectedIndex')
					uni.switchTab({
						url: tabbarIndex ? data.data[tabbarIndex].pagePath: data.data[0].pagePath
					});
				}
			},
			async getConfig() {
				const {
					data
				} = await uni.$u.http.get("/app/application/info/config");
				if (data.code != 1000) {
					uni.showToast({
						title: data.message,
						icon: "none",
					});
				}
				uni.setStorageSync("config", data.data);
				login();
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
				uni.setStorageSync("robot", data.data);
			},
			async getAd() {
				const {
					data
				} = await uni.$u.http.post("/app/ad/info/list");
				if (data.code != 1000) {
					uni.showToast({
						title: data.message,
						icon: "none",
					});
				}
				uni.setStorageSync("ad", data.data);
			},
		},
	};
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
	@import "style/common.scss";

	page {
		font-size: 28rpx;
	}
</style>
