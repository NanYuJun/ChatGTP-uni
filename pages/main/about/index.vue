<template>
	<view class="container" :class="theme">
		<!-- #ifndef MP-TOUTIAO -->
		
		<u-navbar title="关于" leftIconSize="0" :bgColor="theme == 'light' ? '#0071ff' : '#2c2c2c'" :safeAreaInsetTop="true"
			:placeholder="true" titleStyle="color:#fff">
		</u-navbar>
		<!-- #endif -->
		<view class="form">
			<view class="panel" v-for="item in ad('3')" :key="item.id">
				<view class="head">
					<view class="title">{{ item.title }}</view>
				</view>
				<view class="content">
					<mp-html :content="item.desc"></mp-html>
				</view>
				<view class="bottom" v-show="item.remarks">
					{{ item.remarks }}
				</view>
			</view>
		</view>
		<tabbar ref="tabBar" />
	</view>
</template>

<script>
</script>

<style lang="scss" scoped>
	.form {
		padding: 30rpx;
		margin: 0 auto;
		z-index: 999;
		height: 100%;
		background: var(--bg);


		.panel {
			padding: 30rpx;
			background: var(--white);
			color: var(--font-black);
			border-radius: 15rpx;
			margin-bottom: 30rpx;

			.bottom {
				font-size: 24rpx;
			}

			.head {
				border-bottom: 1rpx solid #eee;
				padding-bottom: 30rpx;

				.title {
					font-weight: bolder;
					font-size: 30rpx;
				}
			}

			.content {
				margin: 30rpx 0rpx;
			}

			.bottom {
				background-color: var(--gray);
				color: $uni-color-primary;
				padding: 15rpx;
				border-radius: 10rpx;
			}
		}
	}
</style>
