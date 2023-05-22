<template>
	<n-page>
		<!-- 用户任务 -->
		<view class="user-task" >
			<view class="u-p-20">
				<mp-html :content="item.desc" v-for="item in ad('5')" :key="item.id"></mp-html>
			</view>
			<u-list class="user-task-list" @scrolltolower="scrolltolower" @upperThreshold="init" :lowerThreshold="100">
				<u-list-item v-for="(item, index) in list" :key="index">
					<u-cell :title="item.title">
						<u-avatar slot="icon" shape="square" size="35" :src="item.img"
							customStyle="margin: -3px 5px -3px 0">
						</u-avatar>
						<view class="title" slot="title">
							{{item.title}}
						</view>
						<view slot="label">
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
						<view slot="value">
							<u-button v-if="item.type === 0" type="primary" shape="circle" @tap="startTask(item)">看广告
							</u-button>
							<u-button v-else type="primary" shape="circle" openType="share"
								@tap="task = item">分享</u-button>
						</view>
					</u-cell>
				</u-list-item>
			</u-list>
			<view class="u-p-20">
				<mp-html :content="item.desc" v-for="item in ad('1')" :key="item.id"></mp-html>
			</view>
		</view>
	</n-page>
</template>

<script>
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
		height: 100%;
		width: 100%;
		background: var(--bg);
		color: var(--font-black);

		&-list {
			height: calc(100% - 120rpx);

			/deep/.u-cell__title-text {
				color: var(--font-black)
			}

			.u-cell__title-text {
				color: var(--font-black)
			}


		}

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
</style>