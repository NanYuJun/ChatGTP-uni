<template>
	<view class="model" :class="theme">
		<!-- #ifndef MP-TOUTIAO -->
		<u-navbar title="模型" leftIconSize="0" :bgColor="theme == 'light' ? '#0071ff' : '#2c2c2c'"
			:safeAreaInsetTop="true" :placeholder="true" titleStyle="color:#fff">
		</u-navbar>
		<!-- #endif -->
		<view class="u-font-40 u-m-t-50 title">
			我是您贴心的AI助理
		</view>
		<view class="u-font-24 subtitle u-m-t-20">
			回答您所有的问题，快选择一个角色和我聊天吧！
		</view>
		<view class="model-content u-flex u-flex-between">
			<view class="model-content-item u-m-t-20" v-for="(item,index) in modelList" :key="index"
				:class="{actived:item.id === model.id}" @click="changeModel(item)">
				<image :src="item.img" mode=""></image>
				<view class="model-content-item-title">
					<view class="">
						{{item.name}}
					</view>
					<view class="u-m-t-10 u-font-24 u-content-color">
						{{item.desc || ''}}
					</view>
				</view>

				<image class="isVip" v-show="item.isVip" src="/static/is_vip.png">
			</view>
		</view>
		<tabbar ref="tabBar" />
	</view>
</template>

<script>
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
</script>

<style lang="scss">
	.model {
		padding: 20rpx;
		box-sizing: border-box;
		background: var(--bg);

		.title,
		.subtitle {
			color: var(--font-black);
			width: 100%;
			text-align: center;

		}

		.subtitle {
			color: #999;
		}

		&-content {
			display: flex;
			justify-content: center;
			margin: 40rpx 30rpx;
			flex-wrap: wrap;

			&-item {
				display: flex;
				box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
				padding: 40rpx 0;
				border-radius: 20rpx;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				width: 280rpx;
				margin: 15rpx;
				position: relative;
				border: 2px solid #fff;

				background: var(--white);

				&.actived {
					border: 2px solid $uni-color-primary;
				}

				&-title {
					color: var(--font-black);
					margin-top: 20rpx;
					height: 60rpx;
				}

				image {
					width: 180rpx;
					height: 180rpx;
					// border-radius: 50%;
				}

				view {
					text-align: center;
				}

				.isVip {
					position: absolute;
					top: 20rpx;
					left: 20rpx;
					width: 50rpx;
					height: 50rpx;
				}
			}
		}

	}
</style>
