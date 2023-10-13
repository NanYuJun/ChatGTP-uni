<template>
	<view class="personnel">
		<!-- <view class="personnel_head">
			<u-search placeholder="请输入搜索关键字" :showAction="false" v-model="keyword"></u-search>
		</view> -->
		<view class="personnel__content n-flex">
			<view class="personnel__content-type n-flex n-flex-col n-h n-w-200 ">
				<view class="personnel__content-type__item n-linehide" :class="{actived:item.vari_id === vari_id}"
					@tap="vari_id = item.vari_id;list = [];init()" v-for="(item,index) in typeList" :key="index">
					{{item.vari_name}}
				</view>
			</view>
			<scroll-view class="personnel__content-person n-flex n-flex-col n-flex-1" :scroll-top="scrollTop"
				scroll-y="true" lower-threshold="200" :enable-back-to-top="true" @scrolltolower="lower"
				@scroll="scroll">
				<navigator :url="`/pages/index/info?info=${JSON.stringify(item)}`"
					class="personnel__content-person__item n-flex" v-for="(item,index) in list" :key="index">
					<u-avatar></u-avatar>
					<view class="n-m-l-20 n-flex n-flex-col n-flex-1">
						<view class="n-flex n-row-between n-col-center">
							<view class="n-flex">
								<view>
									{{item.person_name}}
								</view>

								<!-- 	<u-tag :text="item.person_professional" bgColor="#000" color="#fff" borderColor="#000"
									plain size="mini"></u-tag> -->
							</view>

							<!-- <view class="area">
								{{item.person_area}}
							</view> -->
						</view>
						<view class="introduction n-m-t-20">
							{{item.person_professional}}
						</view>
					</view>

				</navigator>
				<view class="tips">
					{{ tips }}
				</view>
			</scroll-view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				vari_id: '', // 人才类型id
				// keyword: '',
				typeList: [], // 人才类型
				list: [], // 人才
				total: 0
			}
		},

		async onShow() {

			if (!this.$store.state.userInfo?.tak_id) {
				uni.navigateTo({
					url: '/pages/login/index'
				})
				return
			}
			await this.getTypeList()
			this.init()
		},
		methods: {
			async init() {
				this.list = []
				this.goTop();
				await this.getCount()
				this.getList()
			},
			async getTypeList() {
				const {
					data
				} = await uni.$u.http.get('/Person/GetPersonVariety')
				this.typeList = JSON.parse(data.Data)?.ds
				this.vari_id = this.typeList[0].vari_id

			},
			async getCount() {
				const {
					data
				} = await uni.$u.http.get('/Person/GetRecordCount', {
					params: {
						vari_id: this.vari_id
					}
				})
				this.total = Number(data.Data)
			},
			async getList() {

				const {
					data
				} = await uni.$u.http.get('/Person/GetListByPage', {
					params: {
						startIndex: this.list.length,
						endIndex: 20,
						vari_id: this.vari_id
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
	}
</script>

<style lang="scss" scoped>
	.personnel {
		height: 100%;
		background: #fff;

		&_head {
			padding: 20rpx;
		}

		&__content {
			height: 100%;

			&-type {
				background: #f5f5f5;
				height: 100%;
				overflow-y: auto;

				&__item {
					padding: 0 20rpx;
					height: 80rpx;
					line-height: 80rpx;

					&.actived {
						background: #fff;
					}
				}
			}

			&-person {
				height: 100%;

				&__item {
					padding: 20rpx;

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
		}
	}
</style>