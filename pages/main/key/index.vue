<template>
	<view class="change-key" :class="theme">
		<!-- #ifndef MP-TOUTIAO -->
		<u-navbar title="KEY" autoBack="true" leftIconColor="#fff"  :bgColor="theme == 'light' ? '#0071ff' : '#2c2c2c'" :safeAreaInsetTop="true"
			:placeholder="true" titleStyle="color:#fff">
		</u-navbar>
		<!-- #endif -->
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
