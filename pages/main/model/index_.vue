<template>
	<view class="model" :class="theme">
		<!-- <image class="hello" src="../../../static/model/hello.png" mode=""></image> -->
		<u-navbar title="模型" leftIconSize="0" :bgColor="theme == 'light' ? '#0071ff' : '#2c2c2c'" :safeAreaInsetTop="true"
			:placeholder="true" titleStyle="color:#fff">
		</u-navbar>
		<view class="hello">
			HI,
		</view>
		<view class="u-font-32 subtitle u-m-t-40">
			我是智能AI协作助手
		</view>
		<image class="jqr" src="../../../static/model/jqr.png" mode=""></image>
		<view class="model-content u-flex u-flex-between">
			<view class="model-content-item u-m-t-20" v-for="(item,index) in modelList" :key="index"
				:class="{actived:item.id === model.id}" @click="changeModel(item)">
				<image :src="item.img" mode=""></image>
				<view class="model-content-item-title">
					<view class="">
						{{item.name}}
					</view>
					<view class="model-content-item-desc">
						{{item.desc || ''}}
					</view>

				</view>
				<view class="model-content-item-remarks" v-show="item.remarks">
					{{item.remarks}}
				</view>
				<image class="isVip" v-show="item.isVip" src="/static/is_vip.png">
			</view>
		</view>
		<tabbar ref="tabBar" />
	</view>
</template>
<script>
	import modelMixins from './model.js'
	export default {
		mixins: [modelMixins]
	}
</script>
<style lang="scss">
	.model {
		position: relative;
		padding: 20rpx;
		box-sizing: border-box;
		background: var(--bg);

		.hello {
			height: 120rpx;
			width: 120rpx;
			font-size: 120rpx;
			font-family: fantasy;
			color: #fff;

		}

		.jqr {
			width: 420rpx;
			position: absolute;
			right: 0;
			top: 100rpx;
		}

		.subtitle {
			color: #999;
		}

		&-content {
			display: flex;
			justify-content: center;
			flex-wrap: wrap;
			margin: -10rpx;
			margin-top: 20rpx;

			&-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				margin: 40rpx 10rpx;
				justify-content: center;
				position: relative;

				image {
					border-radius: 20rpx;
					width: 220rpx;
					height: 300rpx;
				}

				&-title {
					margin-top: 10rpx;
					height: 60rpx;
					color: #fff;
					font-size: 36rpx;
					font-weight: 600;

				}

				&-desc {
					color: #cfcfcf;
					font-size: 28rpx;
					font-weight: lighter;
				}

				&-remarks {
					position: absolute;
					top: 30rpx;
					color: #fff;
					background-color: #3f5c45ba;
					font-size: 12px;
					padding: 0 20rpx;
					border-radius: 15px;


				}

				view {
					text-align: center;
				}

				.isVip {
					position: absolute;
					top: 230rpx;
					left: 20rpx;
					width: 50rpx;
					height: 50rpx;
				}
			}
		}

	}
</style>
