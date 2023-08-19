<template>
	<n-page>
		<!-- 用户任务 -->
		<view class="user-task">
			<view class="n-p-20">
				<mp-html :content="item.desc" v-for="item in ad('5')" :key="item.id"></mp-html>
			</view>
			<view v-for="(item, index) in list" :key="index" class="n-flex n-p-20">

				<u-avatar shape="square" size="35" :src="item.img">
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
					<u-button v-if="item.type === 0" type="primary" size="mini" shape="circle"
						@tap="startTask(item)">看广告
					</u-button>
					<u-button v-else type="primary" shape="circle" openType="share" @tap="task = item"
						size="mini">分享</u-button>
				</view>
			</view>

			<view class="u-p-20">
				<mp-html :content="item.desc" v-for="item in ad('1')" :key="item.id"></mp-html>
			</view>


		</view>
		</view>

	</n-page>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	let rewardedVideoAd = null
	export default {
		data() {
			return {

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

					this.list = data?.data?.filter(item => item.platform === 0 || item.platform === this.$store.state
						.platform)
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