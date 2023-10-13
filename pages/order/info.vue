<template>
	<view class="personnel-submit">
		<view class="personnel-submit__head n-flex n-col-center">
			<u-avatar size="60"></u-avatar>
			<view class="n-m-l-20 n-flex n-flex-col n-flex-1">
				<view class="n-flex n-row-between n-col-center">
					<view class="n-flex">
						<view>
							{{info.person_name}}
						</view>

						<!-- <u-tag :text="info.person_professional" bgColor="#000" color="#fff" borderColor="#000" plain
							size="mini"></u-tag> -->
					</view>

					<!-- <view class="area">
						{{info.person_area}}
					</view> -->
				</view>
				<view class="introduction n-m-t-20">
					{{info.person_professional}}
				</view>
				<!-- <view class="introduction n-m-t-10">
					{{info.person_rank}}
				</view> -->
			</view>
		</view>
		<view class="" v-if="userInfo.tak_type == '1' ">
			<view class="n-p-20">
				擅长及介绍
			</view>
			<view class="n-p-20 card">
				{{info.person_introduction}}
			</view>
			<view class="n-p-20">
				人才专业
			</view>
			<view class="n-p-20 card" >
				{{info.person_major }}
			</view>
			<view class="n-p-20" v-if="info.order_state == '1'">
				手机号
			</view>
			<view class="n-p-20 card" v-if="info.order_state == '1'">
				{{info.person_phone }}
			</view>
		</view>
		<view class="" v-else>
			<view class="n-p-20">
				联系方式
			</view>
			<view class="n-p-20 card">
				<u--form labelPosition="left">
					<u-form-item label="姓名" borderBottom labelWidth="80">
						{{info.order_name}}
					</u-form-item>
					<u-form-item label="手机号" borderBottom labelWidth="80">
						{{info.order_phone}}
					</u-form-item>
					<u-form-item borderBottom :label="userInfo.tak_type == '1' ? '接单时间' :'下单时间'" labelWidth="80">
						{{info.order_time}}
					</u-form-item>
					<u-form-item label="结单时间" labelWidth="80" v-if="info.order_state == 1">
						{{info.order_endtime}}
					</u-form-item>
				</u--form>
			</view>
		</view>


		<view class="n-p-20">
			问题描述
		</view>
		<view class="n-p-20 card">
			{{info.order_content}}
		</view>


		<view class="submit n-p-20">

			<u-button v-if="userInfo.tak_type != '1' && info.order_state != '1'" text="接单" type="primary" @tap="submit"
				style="width: 200px;" shape="circle"></u-button>


		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				fileList1: [],
				params: {},
				order_content: ''

			}
		},
		onLoad(e) {
			try {
				this.info = JSON.parse(e.info)
			} catch (e) {
				uni.showToast({
					title: '获取信息失败'
				})
			}



		},
		methods: {
			// 添加留言
			async submit() {
				const {
					data
				} = await uni.$u.http.post(`/PersonOrder/Update_Person_Order?Jsonstr=${JSON.stringify({
							...this.info,
							order_state: '1',
							order_takid:this.userInfo.tak_id
						})}`)
				if (data.Code == 0) {
					uni.showToast({
						title: data.Message,
						icon: "none"
					})
					uni.switchTab({
						url: '/pages/order/index'
					})
				} else {
					uni.showToast({
						title: data.Message,
						icon: "none"
					})
				}

			}


		}
	}
</script>

<style lang="scss" scoped>
	.personnel-submit {
		height: 100%;
		overflow-y: auto;
		background: #f5f5f5;

		.card {
			background: #fff;
			color: #666;
		}

		&__head {
			padding: 20rpx;
			background: #fff;

			.name {
				font-size: 28rpx;
				color: #444;
			}

			/deep/.u-tag {
				font-size: 24rpx;
				height: 30rpx;
			}

			.area {
				font-size: 24rpx;
				color: #999;
			}

			.introduction {
				color: #666;
				font-size: 24rpx;

			}
		}


	}
</style>