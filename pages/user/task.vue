<template>
	<n-page>
		<!-- 用户任务 -->
		<view class="user-task">
			<view class="n-p-20">
				<mp-html :content="item.desc" v-for="item in ad('5')" :key="item.id"></mp-html>
			</view>
			<view v-for="(item, index) in list" :key="index" class="n-flex n-p-20">

				<u-avatar shape="square" size="35" :src="item.img" >
				</u-avatar>
				<view>
					<view class="title">
						{{item.title}}
					</view>
					<view class="label">
						<view class="desc">{{item.desc}}</view>
						<view class="tips" v-if="item.type === 0">每日可观看
							<text class="frequency">
								{{item.dailyLimit}}
							</text>
							次,每日可获得
							<text class="frequency">{{item.giveFrequency}}</text>
							次
						</view>
						<view class="tips" v-else>每日可分享
							<text class="frequency">
								{{item.dailyLimit}}
							</text>
							次,每日可获得
							<text class="frequency">{{item.giveFrequency}}</text>
							次
						</view>
					</view>

				</view>
				<view style="width: 100rpx;">
					<u-button v-if="item.type === 0" type="primary" size="mini" shape="circle" @tap="startTask(item)">看广告
					</u-button>
					<u-button v-else type="primary" shape="circle" openType="share" @tap="task = item" size="mini" >分享</u-button>
				</view>
			</view>

			<view class="u-p-20">
				<mp-html :content="item.desc" v-for="item in ad('1')" :key="item.id"></mp-html>
			</view>

			<view class="integral">
				<view class="integral-content u-flex u-flex-between">
					<view class="integral">
						<view class="integral-item" :class="current == index ? 'integral-item-active': ''"
							v-for="(item, index) in integralList" :key="index"
							:style="{marginLeft: !index ? '15rpx': ''}" @click="integralChange(index)">

							<text class="integral-item-duration">{{ item.title }}</text>
							<view class="integral-item-price">
								<!-- <text class="rmb"></text> -->
								<text class="integral-item-price-text">{{item.price/100 }}</text>
								<text class="rmb">元</text>
							</view>
							<text class="integral-item-des">{{item.description || '' }}</text>
						</view>
					</view>
				</view>

				<button class="btn" @click="selectPay()">立即充值</button>

				<view class="tips">

					<view style="color: #000000;font-size: 30upx;margin-top:40upx;">充值说明</view>
					<view style="color: #666666;font-size: 24upx;margin-top:40upx;">1、充值仅限微信在线支付方式，充值金额实时到账</view>
					<view style="color: #666666;font-size: 24upx;margin-top:20upx;">2、本产品属于虚拟产品，一经充值不予退款</view>
					<view style="color: #666666;font-size: 24upx;margin-top:20upx;">3、用户推广，可赚取现金收益</view>
					<view style="color: #666666;font-size: 24upx;margin-top:20upx;">4、无法充值请联系微信客服：xssj0906</view>


				</view>

			</view>
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
	
	let rewardedVideoAd = null
	export default {
		data() {
			return {
				integralList: [],
				current: 0,
				list: [],
				adLoad: false,
				task: null
			};
		},
		onLoad() {
			this.getList();
			this.getIntegralList()
		},
		onShow() {
			this.$login()

		},
		// 消息分享
		onShareAppMessage(res) {
			this.getReward()
			let userInfo = uni.getStorageSync('appUserInfo')
			return {
				imageUrl: this.robot.invitationImg,
				title: this.robot.invitationTitle,
				path: `${this.currentRoute}?inviterUserId=${userInfo.id}`
			}
		},
		// 朋友圈分享
		onShareTimeline(res) {
			this.getReward()
			let userInfo = uni.getStorageSync('appUserInfo')
			return {
				imageUrl: this.robot.invitationImg,
				title: this.robot.invitationTitle,
				path: `${this.currentRoute}?inviterUserId=${userInfo.id}`
			}
		},
		methods: {
			startTask(item) {
				this.task = item
				rewardedVideoAd.show().catch(e => {
					rewardedVideoAd.onLoad(() => {
						rewardedVideoAd.show().catch(e => {
							uni.showToast({
								title: '广告拉取失败，请稍后再试～',
								icon: 'none'
							})
						})
					})
				})

			},
			async getList() {
				uni.showLoading({
					title: '加载中'
				});
				const {
					data
				} = await uni.$u.http.post('/app/user/task/list')
				uni.hideLoading();
				if (data.code === 1000) {
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
					this.list = data?.data?.filter(item => item.platform === 0 || item.platform === platform)
					let ad = this.list.filter(item => item.type == 0)?.[0] || {}
					if (uni.createRewardedVideoAd && ad) {
						rewardedVideoAd = uni.createRewardedVideoAd({
							adUnitId: ad.adId
						})
						rewardedVideoAd.onLoad(() => {
							console.log('onLoad')
						})
						rewardedVideoAd.onError((err) => {
							console.log('onError event emit', err)
						})
						rewardedVideoAd.onClose(res => {
							// 用户点击了【关闭广告】按钮
							if (res && res.isEnded) {
								this.getReward()
							} else {
								uni.showToast({
									title: '任务未完成～',
									icon: 'none'
								})
							}
						})
					}
				} else {
					uni.showToast({
						icon: 'none',
						title: data.message
					});
				}
			},
			//	加载列表
			async getIntegralList() {
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




			},


			async getReward() {
				const {
					data
				} = await uni.$u.http.post('/app/user/taskLog/add', {
					taskId: this.task.id
				})
				if (data.code === 1000) {
					uni.showToast({
						title: data.data,
						icon: 'none'
					})
				} else {
					uni.showToast({
						title: data.message,
						icon: 'none'
					})
				}

			}
		}
	};
</script>

<style lang="scss" scoped>
	.user-task {
		width: 100%;
		background: var(--bg);
		color: var(--font-black);


		.title {
			color: var(--font-black);
		}

		.desc {
			margin-top: 10rpx;
			font-size: 24rpx;
			color: #999;
		}

		.tips {
			margin-top: 10rpx;
			font-size: 28rpx;
			color: var(--font-black);
		}

		.frequency {
			color: $uni-color-primary;
		}

	}

	.integral {
		width: 100%;
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

		.integral {

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