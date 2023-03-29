<template>
	<view class="container" :class="theme">
		<view class="bg"></view>
		<view class="form">
			<view class="header">
				<view class="title">人工智能回答你需要的问题</view>
			</view>
			<u-transition :show="true" mode="fade-left">
				<view class="panel">
					<view class="head">
						<view class="title">填写您的问题</view>
					</view>
					<view class="textarea">
						<u--textarea height="140" v-model="problem" placeholder="支持长按粘贴您的问题" confirm-type="send">
						</u--textarea>
					</view>
					<view class="btn-group">
						<u-button iconColor="#ffffff" color="#0071ff" icon="edit-pen" text="获取问题答案" @tap="getAnswer">
						</u-button>
					</view>
				</view>
			</u-transition>
			<mp-html :content="item.desc" v-for="item in ad('5')" :key="item.id"></mp-html>
			<u-transition :show="true" mode="fade-left">
				<view class="panel">
					<view class="head">
						<view class="title">答案</view>
						<view class="tips"></view>
					</view>
					<view class="textarea">
						<u--textarea height="140" :value="answer" placeholder="支持可复制您的答案" confirm-type="send">
						</u--textarea>
					</view>
					<view class="btn-group">
						<view class="btn get" style="width: 100%">
							<u-button iconColor="#ffffff" color="#0071ff" icon="edit-pen" text="复制答案" @tap="copy">
							</u-button>
						</view>
					</view>
				</view>
			</u-transition>
		</view>
		<view class="content" style="padding: 20rpx">
			<mp-html :content="item.desc" v-for="item in ad('1')" :key="item.id"></mp-html>
		</view>
		<tabbar ref="tabBar" />
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import Chat from '@/utils/chat.js'
	export default {
		data() {
			return {
				problem: "",
				answer: "",
				adPosition: "1",
				show: false,
				key: "",
				model:"",
			};
		},
		onShow() {
			this.model = uni.getStorageSync('model') || this.modelList[0]
		},
		methods: {
			// 复制
			copy() {
				uni.setClipboardData({
					data: this.answer,
					success: function() {
						uni.showToast({
							title: "复制成功",
							icon: "none",
						});
					},
				});
			},
			// 获取问题答案
			async getAnswer() {
				if (this.problem == "清除记忆") {
					this.next();
					return;
				}
				if (!this.problem) {
					uni.showToast({
						title: "你还没有输入问题呢！",
						icon: "none",
					});
					return;
				}
				Chat.sendMessage({
					messages: this.chat,
					problem,
					key: uni.getStorageSync("key") || "",
					modelId: this.model.id,
					token: uni.getStorageSync('appToken'),
					id: index
				})
			},
		},
	};
</script>

<style lang="scss" scoped>
	.share {
		position: fixed;
		right: 40rpx;
		bottom: 120rpx;
		width: 40%;

		.u-button {
			box-shadow: 0rpx 10rpx 10rpx #eee !important;
		}
	}

	.tool {
		width: 90%;
		margin: 15rpx auto;

		.header {
			.title {
				margin-bottom: 30rpx;
			}
		}

		.grid {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;

			.item {
				width: 30%;
				display: flex;
				flex-direction: column;
				align-items: center;
				background-color: #f0faf8;
				margin: 15rpx 0rpx;
				padding: 30rpx 0rpx;
				border-radius: 10rpx;

				.title {
					color: #1b2b20;
					margin-top: 15rpx;
				}

				.desc {
					color: #67776c;
					font-size: 24rpx;
				}
			}
		}
	}

	.alert {
		width: 90%;
		margin: 30rpx auto;
	}

	.form {
		width: 90%;
		margin: 0 auto;
		z-index: 999;

		.header {
			margin-bottom: 30rpx;

			.title {
				text-align: center;
				color: #fff;
				margin: 30rpx 0rpx;
			}
		}

		.panel {
			padding: 30rpx;
			background-color: #fff;
			border-radius: 15rpx;
			box-shadow: 0rpx 10rpx 10rpx #eee;

			.head {
				display: flex;
				flex-direction: row;
				justify-content: space-between;

				.tips {
					color: #dd6161;
				}
			}

			.textarea {
				margin-top: 30rpx;
			}
		}
	}

	.btn-group {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 30rpx;

		.paste {
			width: 40%;
		}

		.get {
			width: 56%;
		}
	}

	.bg {
		position: fixed;
		top: 0rpx;
		left: 0rpx;
		width: 100%;
		background-color: $uni-color-primary;
		min-height: 200rpx;
		border-radius: 0rpx 0rpx 140rpx 140rpx;
		z-index: -1;
	}
</style>
