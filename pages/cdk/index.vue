<template>
	<n-page>
		<view class="cdk">
			<mp-html :content="item.desc" v-for="item in ad('7')" :key="item.id"></mp-html>
			<view class="cdk-content">
				<view class="cdk-input">
					<input v-model="cdk" type="text" placeholder="请输入卡密" border />
				</view>
				<view class="cdk-btn">
					<u-button text="兑换" type="primary" @tap="exchange"> </u-button>
				</view>
			</view>
			<mp-html :content="item.desc" v-for="item in ad('8')" :key="item.id"></mp-html>
		</view>
	</n-page>
</template>

<script>
	export default {
		data() {
			return {
				cdk: "",
			};
		},
		onLoad() {
			if (!this.$login()) {
				return
			}
		},
		methods: {
			async exchange() {
				if (!this.cdk) {
					uni.showToast({
						title: "请输入CDK",
						icon: "none",
					});
					return;
				}
				const {
					data
				} = await uni.$u.http.post("/app/cdk/info/exchange", {
					cdk: this.cdk,
				});
				if (data.code == 1000) {
					this.cdk = "";
					this.getUserInfo();
					uni.showToast({
						title: "兑换成功",
						icon: "none",
					});
				} else {
					uni.showToast({
						title: data.message,
						icon: "none",
					});
				}
			},


		},
	};
</script>

<style lang="scss" scoped>
	.cdk {
		padding: 20rpx;
		height: 100%;
		background: var(--bg);
		color: var(--font-black);

		&-input {
			background-color: var(--white);
			padding: 20rpx;
			margin: 20rpx 0;
		}
	}
</style>