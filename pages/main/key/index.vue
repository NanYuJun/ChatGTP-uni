<template>
	<n-page>
	<view class="change-key" >
		<!-- 当前页面不维护了，请无要使用 -->
		<view class="title"> 自有KEY: </view>
		<u--textarea height="50" v-model="key" placeholder="输入您的key"></u--textarea>
		<mp-html :content="item.desc" v-for="item in ad('4')" :key="item.id"></mp-html>
		<view class="btn-group">
			<view class="btn paste">
				<u-button icon="reload" text="使用共享KEY" @tap="ChangeCommKey"></u-button>
			</view>
			<view class="btn get">
				<u-button iconColor="#ffffff" color="#0071ff" icon="edit-pen" text="切换KEY" @tap="changeKey">
				</u-button>
			</view>
		</view>
	</view>
	</n-page>
</template>

<script>
	export default {
		data() {
			return {
				key: "",
			};
		},
		methods: {
			ChangeCommKey() {
				this.key = "";
				this.changeKey();
			},
			// 切换key
			changeKey() {
				uni.setStorageSync("key", this.key);
				uni.showToast({
					title: "切换成功！",
					icon: "none",
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.change-key {
		width: 100%;
		padding: 0 20rpx 20rpx 20rpx;

		.title {
			margin: 30rpx 0;
		}

		.u-textarea {
			margin-top: 20rpx;
		}

		.btn-group {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			margin-top: 30rpx;

			.paste {
				width: 40%;
			}

			.get {
				width: 56%;
			}
		}
	}
</style>
