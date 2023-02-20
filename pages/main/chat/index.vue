<template>
	<view class="chat">
		<view class="chat-item">
			<view v-for="item in ad('2')" :key="item.id">
				<view class="chat-item__left u-flex">
					<u-avatar :src="robot.param2 || '../../../static/avatar.jpeg'" shape="square"></u-avatar>
					<view class="chat-item__left-right">
						<view class="chat-item__left-name"> {{ robot.param1 || 'Chat GPT' }} </view>
						<view class="chat-item__left-bottom">
							<view class="chat-item__left-message">
								<mp-html :content="item.desc"></mp-html>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="chat-item" v-for="(item, index) in chat" :key="index">
			<!-- 机器人消息 -->
			<u-transition :show="true" mode="fade-left" v-if="item.name == 'chatgpt'">
				<view class="chat-item__left u-flex">
					<u-avatar :src="robot.param2 || '../../../static/avatar.jpeg'" shape="square"></u-avatar>
					<view class="chat-item__left-right">
						<view class="chat-item__left-name"> {{ robot.param1 || 'Chat GPT' }} </view>
						<view class="chat-item__left-bottom">
							<view class="chat-item__left-message" @longtap="copy(item.message)">
								<mp-html :content="item.message || '思考中...'" />
							</view>
							<u-loading-icon v-show="item.status == 'loading'"></u-loading-icon>
							<u-icon v-show="item.status == 'error'" name="error"></u-icon>
							<view style="margin-top:auto;">
								<u-icon v-show="item.status == 'success'" @tap="copy(item.message)"
									name="file-text"></u-icon>
							</view>
						</view>
					</view>
				</view>
			</u-transition>
			<!-- 我的消息  -->
			<u-transition :show="true" mode="fade-right" v-else>
				<view class="chat-item__right">
					<view class="chat-item__right-message" @longtap="copy(item.problem)">
						{{ item.message }}
					</view>
					<u-avatar shape="square" :mp-avatar="true"></u-avatar>
				</view>
			</u-transition>
		</view>
		<view style="height:100rpx"></view>
		<view class="send">
			<u--input placeholder="请输入内容" border="surround" v-model="problem" @confirm="getAnswer"></u--input>
			<u-button iconColor="#ffffff" color="#26B3A0" text="发送" @tap="getAnswer">
			</u-button>
		</view>
	</view>
</template>

<script>
	import chatMixin from "../../../mixins/chat.js";
	import adMixin from "../../../mixins/ad.js"
	export default {
		mixins: [chatMixin, adMixin],
		data() {
			return {
				type: "chat",
				robot:{}
			};
		},
		onLoad(e) {
			this.getRobot()
			this.toBottom()
			this.problem = e.problem || ''
		},
		methods:{
			// 获取机器人配置
			async getRobot(){
				const {data} = await uni.$u.http.get('app/application/info/robot')
				this.robot = data?.data || {}
			},
		}
	};
</script>

<style lang="scss" scoped>
	.chat {
		padding: 20rpx;
		box-sizing: border-box;

		&-item {
			&__left {
				display: flex;
				margin-top: 20rpx;

				&-right {
					margin-left: 20rpx;
				}

				&-name {
					font-size: 24rpx;
				}

				&-message {
					margin-top: 10rpx;
					background: #26b3a0;
					padding: 20rpx;
					border-radius: 10rpx;
					font-size: 28rpx;
					color: #fff;
					margin-right: 20rpx;
				}

				&-bottom {
					display: flex;
				}
			}

			&__right {
				display: flex;
				margin-top: 20rpx;
				justify-content: flex-end;

				&-message {
					margin-right: 20rpx;
					background: #f6f6f6;
					padding: 20rpx;
					border-radius: 10rpx;
					font-size: 28rpx;
				}
			}
		}
	}

	.send {
		display: flex;
		background: #fff;
		position: fixed;
		height: 100rpx;
		bottom: var(--window-bottom, 0);
		left: 0;
		width: 100%;
		padding: 20rpx;
		box-sizing: border-box;
		justify-content: space-between;

		.u-input {
			width: 600rpx;
			height: 54rpx;
		}

		.u-button {
			margin-left: 20rpx;
			width: 100rpx;
			height: 80rpx;
		}
	}
</style>
