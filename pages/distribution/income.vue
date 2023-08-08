<template>
	<n-page>
	<!-- 我的邀请 -->
	<view class="user-invitation" >
		<u-list class="user-invitation-list" @scrolltolower="scrolltolower" @upperThreshold="init" :lowerThreshold="100">
			<u-list-item v-for="(item, index) in list" :key="index">
				<u-cell :title="item.inviterUserName" :label="item.createTime">
					<view class="title" slot="title">{{item.inviterUserName}} 充值{{item.price/100}}元</view>
					<u-avatar slot="icon" shape="square" size="35" :src="item.inviterAvatar || '/static/userAvatar.png'"
						customStyle="margin: -3px 5px -3px 0">
					</u-avatar>
					<view class="frequency" slot="value">
						+{{item.income/100}}元
					</view>
				</u-cell>
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
				uni.showLoading({
					title: '加载中'
				});
				const {
					data
				} = await uni.$u.http.post('/app/user/income/page', {
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
	.user-invitation {
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
	}
	.title{
		color: var(--font-black)
	}
	.frequency {
		color: $uni-color-primary;
	}
	.list-tips {
		color: #999;
		font-size: 24rpx;
		text-align: center;
		line-height: 80rpx;
	}
</style>
