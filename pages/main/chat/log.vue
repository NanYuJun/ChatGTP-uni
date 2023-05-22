<template>
	<n-page>
	<view class="chat" >
		<u-list class="chat-list" @scrolltolower="scrolltolower" @upperThreshold="init" :lowerThreshold="100">
			<u-list-item class="chat-item" v-for="(item, index) in list" :key="index">
				<!-- 我的消息  -->
				<u-transition :show="true" mode="fade-right">
					<view class="chat-item__right">
						<view class="chat-item__right-left">
							<view class="chat-item__right-message" @longtap="copy(item.content)">
								<mp-html :markdown="true" :content="item.problem" :selectable="true"></mp-html>
							</view>
						</view>

						<u-avatar shape="square" :src="userInfo.avatar || '/static/userAvatar.jpg'" size="35">
						</u-avatar>
					</view>
				</u-transition>
				<!-- 机器人消息 -->
				<u-transition :show="true" mode="fade-left">
					<view class="chat-item__left u-flex">
						<u-avatar :src="'/static/avatar.jpeg'" shape="square" size="35"></u-avatar>
						<view class="chat-item__left-right">

							<view class="chat-item__left-bottom">
								<view class="chat-item__left-message" @longtap="copy(item.answer)">
									<mp-html :markdown="true" :content="item.answer || '获取消息失败'" :selectable="true">
									</mp-html>
								</view>
							</view>
							<view class="u-m-t-10"
								style="display: flex;justify-content: space-between;color:#999;font-size: 24rpx;align-items: center;">
								<view style="display: flex;" @tap="copy(item.answer)">
									复制
								</view>
								<view class="">
									{{item.updateTime}}
								</view>
							</view>


						</view>

					</view>
				</u-transition>

			</u-list-item>
			<view class="list-tips">
				{{tips}}
			</view>
		</u-list>
	</view>
	</n-page>
</template>

<script>
	export default {
		data() {
			return {
				page: 1,
				total: 0,
				list: [],
				tips: '暂无数据'

			};
		},
		onShow() {
			this.$login()
			this.init();
		},
		onPullDownRefresh() {
			this.init()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			// 复制
			copy(val) {
				uni.setClipboardData({
					data: val,
					success: function() {
						uni.showToast({
							title: "复制成功",
							icon: "none",
						});
					},
				});
			},
			// 初始化
			init() {
				this.page = 1;
				this.getList();

			},
			scrolltolower() {
				this.page += 1
				this.getList()
			},
			//	加载列表
			async getList() {
				console.log(this.page)
				uni.showLoading({
					title: '加载中'
				});
				const {
					data
				} = await uni.$u.http.post('/app/chatgpt/log/page', {
					inviterUserId: uni.getStorageSync('appUserInfo').id,
					page: this.page,
					size: 10,

				})
				uni.hideLoading();
				if (data.code === 1000) {
					if (this.page == 1) {
						this.list = data?.data?.list || [];
						this.total = data?.data?.pagination?.total || 0;
					} else if (this.list.length < this.total) {
						this.list = this.list.concat(data?.data?.list);
					}

					this.loadTips();
				} else {
					uni.showToast({
						icon: 'none',
						title: data.message
					});
				}
			},
			loadTips() {
				if (this.list.length < this.total) {
					this.tips = '上拉加载更多'
				} else if (this.list.length == 0) {
					this.tips = '暂无数据'
				} else {
					this.tips = '加载完成'
				}
			}

		}
	};
</script>

<style lang="scss" scoped>
	.chat {
		padding: 20rpx;
		box-sizing: border-box;
		min-height: 100%;
		overflow-y: auto;
		width: 100%;
		height: 100%;
		background: var(--bg);

		&-item {
			&__left {
				display: flex;
				margin-top: 30rpx;

				&-right {
					margin-left: 20rpx;
				}

				&-name {
					font-size: 24rpx;
					color: var(--font-black);
				}

				&-message {
					margin-top: 10rpx;
					background: var(--white);
					color: var(--font-black);
					padding: 20rpx;
					border-radius: 20rpx;
					font-size: 28rpx;
					border-top-left-radius: 0;
					max-width: 68vw;
				}

				&-bottom {
					display: flex;
				}
			}

			&__right {
				display: flex;
				margin-top: 30rpx;
				justify-content: flex-end;

				&-message {
					margin-right: 20rpx;
					background: $uni-color-primary;
					color: #fff;
					padding: 20rpx;
					border-radius: 20rpx;
					border-top-right-radius: 0;
					font-size: 28rpx;
					max-width: 68vw;
				}
			}
		}
	}

	.list-tips {
		color: #999;
		font-size: 24rpx;
		text-align: center;
		line-height: 80rpx;
	}
</style>
