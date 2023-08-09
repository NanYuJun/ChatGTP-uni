<template>
	<n-page>
		<view class="integral">
			<mp-html :content="item.desc" v-for="item in ad('11')" :key="item.id"></mp-html>
			<view class="integral-content u-flex u-flex-between">
				<view class="recharge">
					<view class="recharge-item" :class="current == index ? 'recharge-item-active': ''"
						v-for="(item, index) in list" :key="index" :style="{marginLeft: !index ? '15rpx': ''}"
						@click="rechargeChange(index)">

						<text class="recharge-item-duration">{{ item.price }}元</text>
						<text class="recharge-item-duration">原价<strike>{{item.originalPrice}}</strike>元</text>

						<view class="recharge-item-price">
							<!-- <text class="rmb"></text> -->
							<text class="recharge-item-price-text">{{item.num }}</text>
							<text class="rmb">次</text>
						</view>
						<text class="recharge-item-des" v-if="item.giveNum">赠送{{item.giveNum }}次</text>
					</view>
				</view>
			</view>
			<button class="btn" @click="selectPay()">立即充值</button>
			<mp-html :content="list[current].description"></mp-html>
			<mp-html :content="item.desc" v-for="item in ad('12')" :key="item.id"></mp-html>
		</view>
		<u-popup :show="show" mode="center" :closeable="true" @close="show = false">
			<view class="u-m-60">
				<image :src="this.qrcode" style="width: 400rpx;height: 400rpx;"></image>
				<view class="u-flex u-row-center">
					<u-button text="已支付" style="width: 200rpx;" @click="isPay()"></u-button>
				</view>
			</view>
		</u-popup>
	</n-page>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	// #ifdef H5
	import {
		isMobile
	} from '@/utils/utils.js'
	import wx from 'jweixin-module';
	import QRCode from 'qrcode'
	// #endif

	export default {
		data() {
			return {
				show: false,
				qrcode: '',
				list: [],
				current: 0,
				timer: null,
				orderInfo: {}
			};
		},
		onUnload() {
			this.timer = null
		},
		onShow() {
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
				} = await uni.$u.http.post('/app/integral/info/list')
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
			async isPay(id) {
				const {
					data: {
						data
					}
				} = await uni.$u.http.get("/app/integral/order/info", {
					params: {
						id: id || orderInfo.id,
					},
				});
				if (data.status === 1) {
					uni.showToast({
						title: "支付成功",
						icon: 'success',
						duration: 2000
					});
					clearInterval(this.timer)
					this.timer = null
					this.show = false
				} else if (!id) {
					uni.showToast({
						title: "尚未支付成功！",
						icon: 'none',
						duration: 2000
					});
				}
			},
			async selectPay() {
				const item = this.list[this.current]

				const {
					data: {
						data
					}
				} = await uni.$u.http.post("/app/integral/info/pay", {
					pid: item.id,
					type: isMobile() ? '' : 'NATIVE'
				});
				const payParams = data.data
				if (!isMobile()) {
					this.orderInfo = data
					QRCode.toDataURL(payParams.code_url)
						.then(url => {
							this.qrcode = url
							this.show = true
							this.timer = setInterval(async () => {
								await this.isPay(data.id)
							}, 1000)
						})
						.catch(err => {
							console.error(err)
						})

					return
				}
				// 初始化微信 JS-SDK
				wx.config({
					debug: true,
					appId: payParams.appId,
					timestamp: payParams.timestamp,
					nonceStr: payParams.nonceStr,
					signature: payParams.paySign,
					jsApiList: [
						'chooseWXPay' // 需要使用的JS接口列表
					]
				})
				wx.ready(function() {
					wx.chooseWXPay({
						appId: payParams.appId, //小程序Appid
						timestamp: payParams.timestamp, //创建订单时间戳
						nonceStr: payParams.nonceStr,
						package: payParams.package, // 订单包 package:"prepay_id=wx21**************"
						signType: payParams.signType, // 加密方式统一'MD5'
						paySign: payParams.paySign, // 后台支付签名返回
						success: function(res) {
							alert(ok)
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
	.integral {
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
				width: 180rpx;
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