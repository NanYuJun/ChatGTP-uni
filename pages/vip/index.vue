<template>
	<n-page>
		<view class="model">

			<view class="model-content u-flex u-flex-between">


				<view class="recharge">
					<view class="recharge-item" :class="current == index ? 'recharge-item-active': ''"
						v-for="(item, index) in list" :key="index" :style="{marginLeft: !index ? '15rpx': ''}"
						@click="rechargeChange(index)">

						<text class="recharge-item-duration">{{ item.name }}</text>
						<view class="recharge-item-price">
							<!-- <text class="rmb"></text> -->
							<text class="recharge-item-price-text">{{item.price/100 }}</text>
							<text class="rmb">元</text>
						</view>
						<text class="recharge-item-des" v-html="item.description || ''"></text>
					</view>
				</view>
			</view>
			<button class="btn" @click="selectPay()">立即充值</button>
			

		</view>
		</view>
	</n-page>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	// #ifdef H5
	import wx from 'jweixin-module';
	// #endif
	
	export default {
		data() {
			return {
				list: [],
				current: 0,
			};
		},
		onShow() {
			// this.$login()
			this.getList();
		},

		methods: {
			rechargeChange(index) {
				this.current = index
			},
			//	加载列表
			async getList() {
				uni.showLoading({
					title: '加载中'
				});
				const {
					data
				} = await uni.$u.http.post('/app/vip/info/list', {
					sort: 'asc'
				})
				uni.hideLoading();
				if (data.code === 1000) {
					this.list = data?.data
				} else {
					uni.showToast({
						icon: 'none',
						title: data.message
					});
				}
			},

			async selectPay() {

				const item = this.list[this.current]
				console.log('item', item.id)
				console.log('item2', item.price)
				console.log('item2', item.title)
				const user = uni.getStorageSync("appUserInfo")
				console.log('user', user.id)

				const {
					data
				} = await uni.$u.http.post("/app/demo/pay/wx", {

					uid: user.id,
					pid: item.id,
					openid: user.openid,
					price: item.price

				});

				//用户id，产品id
				console.log('data', data)

				// 初始化微信 JS-SDK
				wx.config({
					debug: false,
					appId: data.data.appId,
					timestamp: data.data.timeStamp,
					nonceStr: data.data.nonceStr,
					signature: data.data.paySign,
					jsApiList: [
						'chooseWXPay' // 需要使用的JS接口列表
					]
				})


				wx.ready(function() {
					wx.chooseWXPay({
						appId: data.data.appId, //小程序Appid
						timestamp: data.data.timeStamp, //创建订单时间戳
						nonceStr: data.data.nonceStr,
						package: data.data.package, // 订单包 package:"prepay_id=wx21**************"
						signType: data.data.signType, // 加密方式统一'MD5'
						paySign: data.data.paySign, // 后台支付签名返回
						success: function(res) {
							console.log('测试' + res)
							// 支付成功的回调函数
							uni.showToast({
								title: "支付成功",
								icon: 'none',
								duration: 2000
							});
						},
						fail: function(res) {
							console.log('失败' + res)
							uni.showToast({
								title: "支付失败",
								icon: 'none',
								duration: 2000
							});
						}
					});
				});




			}


		}

		// mixins: [modelMixins],
		// computed: mapState({
		// 	// 从state中拿到数据 箭头函数可使代码更简练
		// 	tabbar: state => state.tabbar,
		// 	robot: state => state.robot,
		// 	modelList: state => state.modelList,
		// 	model: state => state.model,
		// }),
	}
</script>

<style lang="scss">
	.model {
		width: 100%;
		height: 100%;
		padding: 20rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		// background: var(--bg);

		.title,
		.subtitle {
			color: var(--font-black);
			width: 100%;
			text-align: center;

		}

		.subtitle {
			color: #999;
		}

		.recharge {

			display: flex;
			justify-content: center;
			// margin: 40rpx 30rpx;
			flex-wrap: wrap;



			&-item {
				padding: 10rpx 0;
				border-radius: 20rpx;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				width: 185rpx;
				margin: 10rpx;
				position: relative;
				// width: 200rpx;
				height: 200rpx;

				display: flex;

				border: solid 3rpx #007aff;


				&-active {
					border-color: #007aff;
					background-color: rgba(0, 85, 255, 0.1);
				}

				&-duration {
					margin-bottom: 20rpx;
					font-size: 26rpx;
					color: #1C1C1C;
				}

				&-price {
					margin-bottom: 20rpx;
					display: flex;
					flex-direction: row;
					align-items: baseline;

					&-text {
						font-size: 48rpx;
						color: #007aff;
					}
				}

				&-des {
					font-size: 22rpx;
					color: #A5A3A2;
				}
			}
		}

		// &-content {
		// 	display: flex;
		// 	justify-content: center;
		// 	margin: 40rpx 30rpx;
		// 	flex-wrap: wrap;

		// 	&-item {
		// 		display: flex;
		// 		box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
		// 		padding: 20rpx 0;
		// 		border-radius: 20rpx;
		// 		flex-direction: column;
		// 		align-items: center;
		// 		justify-content: center;
		// 		width:180rpx;
		// 		margin: 15rpx;
		// 		position: relative;
		// 		border: 2px solid #fff;

		// 		background: var(--white);

		// 		&.actived {
		// 			border: 2px solid $uni-color-primary;
		// 		}

		// 		&-title {
		// 			color: var(--font-black);
		// 			margin-top: 20rpx;
		// 			height: 60rpx;
		// 		}

		// 		image {
		// 			width: 180rpx;
		// 			height: 180rpx;
		// 			// border-radius: 50%;
		// 		}

		// 		view {
		// 			text-align: center;
		// 		}

		// 		.isVip {
		// 			position: absolute;
		// 			top: 20rpx;
		// 			left: 20rpx;
		// 			width: 50rpx;
		// 			height: 50rpx;
		// 		}
		// 	}
		// }
		.btn {
			margin-top: 60upx;
			background-color: #007aff;
			color: #fff;
			width: 500upx;
			height: 80upx;
			/* line-height: 102upx; */
			text-align: center;
			font-size: 32upx;
			border-radius: 50upx;
		}

		.tips {
			margin-top: 80upx;
			margin-left: 50upx;

		}

	}
</style>