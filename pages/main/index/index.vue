<template>
	<view class="container">
		<view class="bg"></view>
		<view class="form">
			<view class="header">
				<view class="title">人工智能回答你需要的问题</view>
			</view>
			<u-transition :show="true" mode="fade-left">
				<view class="panel">
					<view class="head">
						<view class="title">填写您的问题</view>
						<view class="tips" @tap="show = true">切换自有KEY</view>
					</view>
					<view class="textarea">
						<u--textarea height="140" v-model="problem" placeholder="支持长按粘贴您的问题" confirm-type="send"></u--textarea>
					</view>
					<view class="btn-group">
						<view class="btn paste" @tap="next">
							<u-button icon="file-text" text="清除记忆"></u-button>
						</view>
						<view class="btn get">
							<u-button iconColor="#ffffff" color="#26B3A0" icon="edit-pen" text="获取问题答案"
								@tap="getAnswer"></u-button>
						</view>
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
						<u--textarea height="140" :value="answer" placeholder="支持可复制您的答案" confirm-type="send"></u--textarea>
					</view>
					<view class="btn-group">
						<view class="btn get" style="width:100%">
							<u-button iconColor="#ffffff" color="#26B3A0" icon="edit-pen" text="复制答案" @tap="copy">
							</u-button>
						</view>
					</view>
				</view>
			</u-transition>

		</view>
		<view class="content" style="padding: 20rpx;">
			<mp-html :content="item.desc" v-for="item in ad('1')" :key="item.id"></mp-html>
		</view>
		<u-popup :show="show" :round="10" mode="bottom" :closeable="true" @close="show=false">
			<view style="padding:20rpx">
				<view class="">
					自有KEY:
				</view>
				<u--textarea style="margin: 10px 0;" height="50" v-model="key" placeholder="输入您的key"></u--textarea>
				<mp-html :content="item.desc" v-for="item in ad('4')" :key="item.id"></mp-html>
				<view class="btn-group">
					<view class="btn paste" @tap="paste">
						<u-button text="重置" @tap="key = '';changeKey()"></u-button>
					</view>
					<view class="btn get">
						<u-button iconColor="#ffffff" color="#26B3A0" icon="edit-pen" text="切换" @tap="changeKey">
						</u-button>
					</view>

				</view>

			</view>
		</u-popup>
		<view class="tool">
			<view class="header">
				<view class="title">功能特性</view>
			</view>
			<u-transition :show="true" mode="slide-up">
				<view class="grid">
					<view class="item">
						<view class="icon">
							<u-icon size="28"
								name="https://img.alicdn.com/imgextra/i1/2064565174/O1CN01v7Y9311o5k2r5Rwaq_!!2064565174.png">
							</u-icon>
						</view>
						<view class="title">AI回答</view>
						<view class="desc">轻松获取</view>
					</view>
					<view class="item">
						<view class="icon">
							<u-icon size="28"
								name="https://img.alicdn.com/imgextra/i1/2064565174/O1CN01H200mY1o5k2ythU1B_!!2064565174.png">
							</u-icon>
						</view>
						<view class="title">智能答案</view>
						<view class="desc">免去千篇一律</view>
					</view>
					<view class="item">
						<view class="icon">
							<u-icon size="28"
								name="https://img.alicdn.com/imgextra/i1/2064565174/O1CN01FDSoxG1o5k2xjTHUD_!!2064565174.png">
							</u-icon>
						</view>
						<view class="title">自动代码</view>
						<view class="desc">免去繁琐搜索</view>
					</view>
					<view class="item">
						<view class="icon">
							<u-icon size="28"
								name="https://img.alicdn.com/imgextra/i4/2064565174/O1CN01UP4ksa1o5k2rDpdOP_!!2064565174.png">
							</u-icon>
						</view>
						<view class="title">引导写作</view>
						<view class="desc">AI发散思维</view>
					</view>
					<view class="item">
						<view class="icon">
							<u-icon size="28"
								name="https://img.alicdn.com/imgextra/i2/2064565174/O1CN01Oep4C01o5k2zlWs2q_!!2064565174.png">
							</u-icon>
						</view>
						<view class="title">存在限制</view>
						<view class="desc">会有偏见内容</view>
					</view>
					<view class="item">
						<view class="icon">
							<u-icon size="28"
								name="https://img.alicdn.com/imgextra/i1/2064565174/O1CN01onUFC01o5k2uPHOqj_!!2064565174.png">
							</u-icon>
						</view>
						<view class="title">在线工具</view>
						<view class="desc">无需下载软件</view>
					</view>
				</view>
			</u-transition>
		</view>

		<!-- <view class="share">
			<u-button shape="circle" color="#26B3A0" :plain="true" icon="share" text="推荐给朋友"></u-button>
		</view> -->
	</view>
</template>

<script>
	import chatMixin from '../../../mixins/chat.js'
	import adMixin from "../../../mixins/ad.js"
	export default {
		mixins: [chatMixin, adMixin],
		data() {
			return {
				adPosition: "1"
			};
		},
	}
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
				background-color: #F0FAF8;
				margin: 15rpx 0rpx;
				padding: 30rpx 0rpx;
				border-radius: 10rpx;

				.title {
					color: #1B2B20;
					margin-top: 15rpx;
				}

				.desc {
					color: #67776C;
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
		background-color: #26B3A0;
		min-height: 200rpx;
		border-radius: 0rpx 0rpx 140rpx 140rpx;
		z-index: -1;
	}
</style>
