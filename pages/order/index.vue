<template>
	<view class="order">
		<view class="n-p-20 n-flex" v-if="userInfo.tak_type == '1' ">
			<div class="n-flex-1"></div>
			<navigator url="/pages/index/submit">
				<u-button  style="width: 200rpx;" text="问单" type="primary"></u-button>
			</navigator>
		
		</view>
		<scroll-view class="order__content" :scroll-top="scrollTop" scroll-y="true" lower-threshold="200"
			:enable-back-to-top="true" @scrolltolower="lower" @scroll="scroll">
			<navigator :url="`/pages/order/info?info=${JSON.stringify(item)}`" class="order__content__item"
				v-for="(item, index) in list" :key="index">
				<view class="n-flex n-row-between head">
					<view class="time">
						{{userInfo.tak_type == '1' ? '接单时间' :'下单时间'}}：{{item.order_time}}
					</view>
					<view class="status" :class="`status${item.order_state}`">
						{{item.order_state == 1 ? '已处理' : '待处理'}}
					</view>
				</view>
				<view class="content">
					<view class="" v-if="userInfo.tak_type == '1'">
						接单人：{{item.person_name}}
					</view>
					<view class="" v-else>
						求助人：{{item.order_name}}
					</view>
					<view class="" v-if="item.order_state == 1">
						结单时间：{{item.order_endtime}}
					</view>
					<view class="">
						问题描述：{{item.order_content}}
					</view>

				</view>
				<view class="foot">
					<u-button style="width: 100rpx;" shape="circle" text="查看" type="primary"></u-button>
				</view>
			</navigator>
			<view class="order__content-foot">{{ tips }}</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				total: 0,
				current: 1,
				pageSize: 20,
			};
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.userInfo.tak_type == '1' ?
					'咨询' : '我的订单'
			})
		},
		onShow() {

			this.goTop();
			this.init();
		},
		methods: {
			async init() {
				this.list = []
				await this.getCount()
				this.getList()
			},

			async getCount() {
				const {
					data
				} = await uni.$u.http.get(this.userInfo.tak_type == '1' ? '/PersonOrder/GetTakRecordCount' :
					'/PersonOrder/GetPersonRecordCount', {
						params: {
							[this.userInfo.tak_type == '1' ? 'order_person' : 'order_takid']: '',
						}
					})
				this.total = Number(data.Data)
			},
			async getList() {

				const {
					data
				} = await uni.$u.http.get(this.userInfo.tak_type == '1' ? '/PersonOrder/GetTakListByPage' :
					'/PersonOrder/GetPersonListByPage', {
						params: {
							startIndex: this.list.length,
							endIndex: 20,
							[this.userInfo.tak_type == '1' ? 'order_person' : 'order_takid']: this.userInfo.tak_id
						}
					})
				let res
				try {
					res = JSON.parse(data.Data)?.ds
				} catch (e) {
					uni.showToast({
						title: '数据返回异常',
						icon: 'none'
					})
				}
				console.log('res', res)
				if (this.list.length === 0) {
					this.list = res
				} else if (this.list.length < this.total) {
					this.list = this.list.concat(res)
				}

				this.loadTips()

			}
		}
	};
</script>

<style lang="scss">
	.order {
		height: 100%;
		background: #f5f5f5;

		&__content {
			&__item {
				margin: 20rpx;
				padding: 20rpx;
				border-radius: 20rpx;
				background: #fff;

				.head {
					border-bottom: 1px solid #f5f5f5;
					height: 70rpx;
					line-height: 70rpx;

					.time {
						font-weight: 500;
					}

					.status {
						color: $uni-color-primary;

						&.status1 {
							color: $uni-color-success;
						}
					}
				}

				.content {
					line-height: 70rpx;
					padding: 20rpx 0;

				}

				.foot {
					border-top: 1px solid #f5f5f5;
					height: 70rpx;
					line-height: 70rpx;
					display: flex;
					align-items: center;

					/deep/.u-button {
						margin-left: auto;
						margin-right: 0;
						height: 50rpx;

						&__text {
							font-size: 24rpx !important;
						}
					}
				}
			}

			&-foot {
				font-size: 24rpx;
				color: #999;
				text-align: center;
			}
		}

	}
</style>