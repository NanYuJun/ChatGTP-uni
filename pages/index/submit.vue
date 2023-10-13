<template>
	<view class="personnel-submit">
		<view class="personnel-submit__head n-flex n-col-center" v-if="info.person_name">
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
			联系方式
		</view>
		<view class="n-p-20 card">
			<u--form labelPosition="left">
				<u-form-item label="姓名" borderBottom labelWidth="80">
					<u--input v-model="userInfo.tak_name" border="none"></u--input>
				</u-form-item>
				<u-form-item label="手机号" labelWidth="80">
					<u--input v-model="userInfo.tak_phone" border="none"></u--input>
				</u-form-item>
			</u--form>
		</view>
		<view class="n-p-20">
			问题描述
		</view>
		<view class="n-p-20 card">
			<u--textarea v-model="order_content" placeholder="请输入内容"></u--textarea>
		</view>
		<!-- <view class="n-p-20">
			图片
		</view>
		<view class="n-p-20 n-flex card">
			<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1" multiple
				:maxCount="10"></u-upload>
		</view> -->

		<view style="height: 80rpx;">

		</view>
		<view class="submit">

			<u-button text="提交" type="primary" @tap="submit"></u-button>


		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				fileList1: [],
				params: {},
				order_content: '',
				info: {},
			}
		},
		onLoad(e) {
			this.info = JSON.parse(e.info)
		},
		methods: {
			// 添加留言
			async submit() {
				const {
					data
				} = await uni.$u.http.post(`/PersonOrder/Add_Person_Order?Jsonstr=${JSON.stringify({
							order_person:this.userInfo.tak_id,
							order_content: this.order_content,
							order_name: this.userInfo.tak_name,
							order_phone: this.userInfo.tak_phone,
							order_takid:this.info.person_id,
							order_state: '0'
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

			// 删除图片
			// deletePic(event) {
			// 	this[`fileList${event.name}`].splice(event.index, 1)
			// },
			// // 新增图片
			// async afterRead(event) {
			// 	// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
			// 	let lists = [].concat(event.file)
			// 	let fileListLen = this[`fileList${event.name}`].length
			// 	lists.map((item) => {
			// 		this[`fileList${event.name}`].push({
			// 			...item,
			// 			status: 'uploading',
			// 			message: '上传中'
			// 		})
			// 	})
			// 	for (let i = 0; i < lists.length; i++) {
			// 		const result = await this.uploadFilePromise(lists[i].url)
			// 		let item = this[`fileList${event.name}`][fileListLen]
			// 		this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
			// 			status: 'success',
			// 			message: '',
			// 			url: result
			// 		}))
			// 		fileListLen++
			// 	}
			// },
			// uploadFilePromise(url) {
			// 	return new Promise((resolve, reject) => {
			// 		let a = uni.uploadFile({
			// 			url: 'http://192.168.2.21:7001/upload', // 仅为示例，非真实的接口地址
			// 			filePath: url,
			// 			name: 'file',
			// 			formData: {
			// 				user: 'test'
			// 			},
			// 			success: (res) => {
			// 				setTimeout(() => {
			// 					resolve(res.data.data)
			// 				}, 1000)
			// 			}
			// 		});
			// 	})
			// },
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

		.submit {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
		}
	}
</style>