<template>
	<view class="personnel-info">
		<view class="personnel-info__head n-flex n-col-center">
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
		<view class="n-p-20">
			擅长及介绍
		</view>
		<view class="n-p-20 card">
			{{info.person_introduction}}
		</view>
		<view class="n-p-20">
			人才专业
		</view>
		<view class="n-p-20 card">
			{{info.person_major }}
		</view>
		<view class="n-p-20">
			用户评价
		</view>
		<view class="n-p-20 n-flex card">
			满意度评分值：<u-rate  value="5" readonly active-color="#f00" inactiveColor="#f00"></u-rate>
		</view>
		<view class="n-p-20 n-flex n-row-between">
			<view class="">
				用户留言
			</view>
			<u-icon name="edit-pen" color="#000" size="20" @tap="show =true" v-if="userInfo.tak_type == '1'"></u-icon>

		</view>
		<u-popup :show="show" @close="show = false" :round="10" :closeable="true">
			<view class="n-m-30">
				留言内容
			</view>
			<view class="n-m-l-30 n-m-r-30">
				<u--textarea v-model="msg_content" placeholder="请输入内容"></u--textarea>
			</view>
			<view class="n-m-30">
				<u-button text="提交" type="primary" class="" @tap="addMessage()"></u-button>
			</view>

		</u-popup>
		<view class="n-p-20 n-flex n-row-center card" v-if="list.length === 0">
			<u-empty mode="data">
			</u-empty>
		</view>
		<view class="n-p-20 card" v-else>
			<view class="n-flex n-m-t-20" v-for="(item,index) in list" :key="index">
				<u-avatar></u-avatar>
				<view class="n-m-l-20 n-flex n-flex-col n-flex-1">
					<view class="n-flex n-row-between n-col-center">
						<view class="n-flex">
							<view>
								{{item.tak_name}}
							</view>

							<!-- 	<u-tag :text="item.person_professional" bgColor="#000" color="#fff" borderColor="#000"
								plain size="mini"></u-tag> -->
						</view>


					</view>
					<view class="area" style="color:#888">
						{{item.msg_time}}
					</view>
					<view class="introduction n-m-t-20">
						{{item.msg_content}}
					</view>
				</view>
			</view>

		</view>
		<view style="height: 80rpx;">

		</view>
		<view class="submit" v-if="userInfo.tak_type == '1'">
			<navigator :url="`/pages/index/submit?info=${JSON.stringify(info)}`">
				<u-button text="下单" type="primary"></u-button>
			</navigator>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				info: {

				},
				list: [

				],
				msg_content: ''
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

			this.getMessageList()

		},
		methods: {
			// 添加留言
			async addMessage() {
				const {
					data
				} = await uni.$u.http.post(`/PersonMessage/Add_Person_Message?Jsonstr=${JSON.stringify({
							msg_content: this.msg_content,
							msg_person: this.info.person_id,
							msg_tak: this.userInfo.tak_id
						})}`)
				this.getMessageList()
				this.show = false
				this.msg_content = ''
			},
			// 留言列表
			async getMessageList() {
				const {
					data
				} = await uni.$u.http.get('/PersonMessage/GetListPersonMessage', {
					params: {
						msg_person: this.info.person_id
					}
				})
				this.list = JSON.parse(data.Data)?.ds
			}
		}
	}
</script>

<style lang="scss" scoped>
	.personnel-info {
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

		.submit {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
		}
	}
</style>