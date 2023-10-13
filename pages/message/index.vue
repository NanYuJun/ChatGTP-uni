<template>
	<view class="order">

		<navigator :url="`/pages/index/info?info=${JSON.stringify(item)}`" class="order__content__item"
			v-for="(item, index) in list" :key="index">
			<view class="n-flex n-row-between head">
				<view class="time">
					{{userInfo.tak_type == '1' ? '' : item.tak_name}}对{{userInfo.tak_type == '1' ? item.person_name : '我'}}的留言：
				</view>

			</view>
			<view class="content">
				{{item.msg_content}}
			</view>
			<view class="foot">

				{{item.msg_time}}
			</view>

		</navigator>


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

		onShow() {
			this.goTop();
			this.getList();
		},
		methods: {


			async getList() {

				const {
					data
				} = await uni.$u.http.get(this.userInfo.tak_type == '1' ? '/PersonMessage/GetListTakMessage' :
					'/PersonMessage/GetListPersonMessage', {
						params: {

							[this.userInfo.tak_type == '1' ? 'msg_tak' : 'msg_person']: this.userInfo.tak_id,
						}
					})
				this.list = JSON.parse(data.Data)?.ds


			}
		}
	};
</script>

<style lang="scss">
	.order {
		height: 100%;
		background: #f5f5f5;
		overflow-y: auto;

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