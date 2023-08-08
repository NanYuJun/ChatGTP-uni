<template>
	<n-page>
		<view class="chat">
			<view class="chat-ad__position--top" v-if="ad('6').slice(0, 3).length > 0">
				<image :src="item.title" v-for="item in ad('6').slice(0, 3)" :key="item.id" @tap="handleAdClick(item)">
				</image>
			</view>
			<mp-html content=" ## 引言" :markdown="true"></mp-html>
			<scroll-view scroll-y="true" class="chat-main" :scroll-into-view="scrollId" scroll-with-animation="true">
				<view class="chat-item">
					<view v-for="item in ad('2')" :key="item.id">
						<view class="chat-item__left u-flex">
							<u-avatar :src="robot.img || '/static/avatar.jpeg'" shape="square" size="35"></u-avatar>
							<view class="chat-item__left-right">
								<view class="chat-item__left-name">
									{{ robot.name || "智能AI" }}
								</view>
								<view class="chat-item__left-bottom">
									<view class="chat-item__left-message">
										<mp-html :content="item.desc"></mp-html>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="chat-item">
					<view v-for="item in systemProblem" :key="item.id">
						<view class="chat-item__left u-flex">
							<u-avatar :src="model.img || '/static/avatar.jpeg'" shape="square" size="35"></u-avatar>
							<view class="chat-item__left-right">
								<view class="chat-item__left-name">
									{{ model.name || "智能AI" }}
								</view>
								<view class="chat-item__left-bottom">
									<view class="chat-item__left-message">
										<mp-html :content="item.name"></mp-html>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="chat-item" v-for="(item, index) in chat" :key="index">
					<!-- 机器人消息 -->
					<u-transition :show="true" mode="fade-left" v-if="item.role == 'assistant'">
						<view class="chat-item__left u-flex">
							<u-avatar :src="model.img || '/static/avatar.jpeg'" shape="square" size="35"></u-avatar>
							<view class="chat-item__left-right">
								<view class="chat-item__left-bottom">
									<view class="chat-item__left-message" @longtap="copy(item.content)">
										<mp-html :class="{
															loading:item.status == 'loading'
														}" :markdown="true" :content="item.content" :selectable="true">
											<uni-rich-text>
												<li style="list-style: none;">
													<view class="md-p"></view>
												</li>

											</uni-rich-text>
										</mp-html>


									</view>
									<!-- #ifdef H5 -->
									<view
										style="margin-left:20rpx;display: flex;flex-direction: column;justify-content: center;align-items: center;">
										<u-icon name="volume" v-if="model.isVoice" size="22"
											@tap="synthesizeSpeech(item.content)">

										</u-icon>
										<u-icon size="22" style="margin-top: 20rpx;" name="reload" @tap="reload(index)">
										</u-icon>
									</view>
									<!-- #endif -->
								</view>
								<view class="u-m-t-10"
									style="display: flex;justify-content: space-between;color:#999;font-size: 24rpx;align-items: center;">
									<view style="display: flex;" @tap="copy(item.content)">
										复制

									</view>
									<view class="u-m-l-40 u-m-r-70">
										{{$u.timeFormat(item.date, 'yyyy/mm/dd hh:MM:ss')}}
									</view>
								</view>
								<view :id="`chat-item-${index}`">

								</view>
							</view>
						</view>
					</u-transition>
					<!-- 我的消息  -->
					<u-transition :show="true" mode="fade-right" v-if="item.role === 'user'">
						<view class="chat-item__right">
							<view class="chat-item__right-message" @longtap="copy(item.content)">
								{{item.content}}
							</view>
							<u-avatar shape="square" :src="userInfo.avatar || '/static/userAvatar.jpg'" size="35">
							</u-avatar>
						</view>
					</u-transition>
				</view>
				<!-- #ifndef H5 -->
			</scroll-view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			</scroll-view>
			<!-- #endif -->
			<!-- 占位用的 -->
			<view :style="{height: `${commonProblem.length > 0 ? '200rpx' : '120rpx'}`,opacity: 1}">
				<view>
					<textarea disabled style="color: #fff" auto-height></textarea>
				</view>

				<view class="bottom" :class="{ open2: open_set }"
					style="background-color: transparent; border-top: none">
				</view>
				<view :style="{'min-height': `${keyboardHeight}`,'height':'auto'}">

				</view>
			</view>
			<view class="send" :class="{
				isTabbar:isTabbar
			}" :style="keyboardHeight && 'padding-bottom:0px!important'">
				<view class="commonProblem" v-if="commonProblem && commonProblem.length > 0">
					<u-image src="/static/problem.png" width="20px" height="20px" mode=""></u-image>
					<view class="commonProblem-item" v-for="item in commonProblem" :key="item.id"
						@tap="sendCommonProblem(item)">
						{{item.name}}
					</view>

				</view>
				<view class="send-line">
					<view class="send-line-empty" @tap="chatLoading ? stop() : next()">
						<image v-if="!chatLoading" src="../../../static/menu/empty.png"></image>
						<u-loading-icon v-else color="white" mode="semicircle" size="18">
						</u-loading-icon>
					</view>
					<view class="send-line-input" :class="{ BigInput: problem.length == 0 && list.length > 0}">
						<textarea :adjust-position="false" @focus="inputFocus" @blur="inputBlur"
							:show-confirm-bar="false" maxlength="1000" auto-height v-model="problem" onfirm-type="send"
							@confirm="getAnswer()" @keyup.enter="getAnswer()"></textarea>
						<view class="send-line-input-icon" @tap="openMenu"
							v-if="problem.length === 0 && list.length > 0">
							<u-icon name="plus-circle" size="25"></u-icon>
						</view>
					</view>
					<view class="send-line-button" @tap="chatLoading ? stop() : getAnswer()"
						v-if="problem.length > 0 || list.length == 0">
						{{chatLoading ? '停止' : '发送'}}
					</view>
				</view>
				<view :style="{'min-height': keyboardHeight,height:'auto'}">

				</view>
				<view class="send-operation" :class="{ open2: open_set }">
					<view v-for="item in list" :key="item.id" class="send-operation-item" @tap="go(item.url)"
						style="position: relative">
						<view class="send-operation-item-icon" v-show="item.badge">{{
            item.badge
          }}</view>
						<view class="send-operation-item-img">
							<image :src="item.icon"></image>
						</view>
						<view class="send-operation-item-name">{{ item.title }}</view>
					</view>
				</view>
			</view>
		</view>
	</n-page>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import Chat from '@/utils/chat.js'
	// #ifdef H5
	import * as sdk from "microsoft-cognitiveservices-speech-sdk";
	// #endif
	import {
		isMobile,
		isWeixin
	} from '@/utils/utils.js'

	export default {
		data() {
			return {
				isMobile: isMobile(),
				isWeixin: isWeixin(),
				list: [], // 对话底部菜单
				problem: "", // 问题
				open_set: false,

				commonProblem: [],
				systemProblem: [],
				scrollId: '',
				commonProblemLength: 0,
				keyboardHeight: 0,
				azureKey: ''

			};
		},
		computed: {
			...mapState({
				// 从state中拿到数据 箭头函数可使代码更简练
				robot: state => state.robot,
				modelList: state => state.modelList,
				model: state => state.model,
				chat: state => state.chat,
				chatLoading: state => state.chatLoading
			}),
			// 是否是tabbar页面
			isTabbar() {
				var pages = getCurrentPages() // 获取栈实例
				let route = pages[pages.length - 1].route; // 获取当前页面路由
				return this.$store.state.tabbar.some(item => item.pagePath === '/' + route)
			},
		},

		onLoad() {
			Chat.setOnMessageAfter(this.toBottom)
			this.getMenuList();
		},
		onShow() {
			if (this.model?.name || '') {
				uni.setNavigationBarTitle({
					title: this.model?.name
				});
			}
			// #ifdef H5
			if (this.model.isVoice) {
				this.getAzureConfig()
			}
			// #endif
			this.getCommonProblem()
			this.getSystemProblem()
			this.toBottom('init');
		},
		methods: {

			synthesizeSpeech(e) {
				uni.showLoading({
					title: '语音加载中...',
					mask: true,
				})
				// 微软语音key
				const speechConfig = sdk.SpeechConfig.fromSubscription(this.azureKey, "eastus");
				speechConfig.speechSynthesisLanguage = "zh-CN";
				speechConfig.speechSynthesisVoiceName = "zh-CN-YunxiNeural";
				const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
				const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
				speechSynthesizer.speakTextAsync(
					e,
					result => {
						if (result) {
							uni.hideLoading()
							speechSynthesizer.close();
							return result.audioData;
						}
					},
					error => {
						console.log(error);
						speechSynthesizer.close();
					});
				speechSynthesizer.SynthesisCompleted = () => {
					this.speakTextLoading = false
				}
			},
			init() {
				this.getCommonProblem()
				this.getSystemProblem()
			},
			// 获取常见问题
			async getCommonProblem() {
				const {
					data
				} = await uni.$u.http.post('/app/chatgpt/model_problem/list', {
					modelId: this.model.id
				})
				this.commonProblem = data.data
				this.commonProblemLength = this.commonProblem.length
			},
			// 获取AI消息
			async getSystemProblem() {
				const {
					data
				} = await uni.$u.http.post('/app/chatgpt/model_system/list', {
					modelId: this.model.id,
					chatStatus: 1
				})
				this.systemProblem = data.data
			},
			async getAzureConfig() {
				const {
					data
				} = await uni.$u.http.get('/app/application/info/config', {
					params: {
						key: 'azure'
					}
				})
				this.azureKey = data.data.param1
			},
			// 复制
			copy(val) {
				uni.setClipboardData({
					data: val,
					success: function() {
						uni.showToast({
							title: "复制成功",
							icon: "none",
						});
					},
				});
			},
			sendCommonProblem(e) {
				this.problem = e.name
			},
			stop() {
				Chat.stop()
			},
			// 下个问题
			next() {
				Chat.next()
			},
			async getMenuList() {
				let platform
				// #ifdef MP-WEIXIN
				platform = 1
				// #endif
				// #ifdef MP-TOUTIAO
				platform = 2
				// #endif
				// #ifdef MP-KUAISHOU
				platform = 3
				// #endif
				// #ifdef H5
				platform = 4
				// #endif
				let {
					data
				} = await uni.$u.http.post("/app/renovation/chat/menu/list");
				this.list = data.data?.filter(item => item.platform === platform || item
					.platform === 0) || []
			},
			// 滚动到最底部
			toBottom(e) {
				this.scrollId = ''
				if (e == 'init') {
					setTimeout(() => {
						this.scrollId = `chat-item-${this.chat.length - 1}`
					}, 500)
					return
				}
				this.$nextTick(() => {
					this.scrollId = `chat-item-${this.chat.length - 1}`
				})
			},
			reload(index) {
				Chat.reload(index)
			},
			// 获取问题答案
			getAnswer() {
				Chat.getAnswer(this.problem)
				this.problem = ''
			},
			handleAdClick(e) {
				go(e.desc)

			},
			openMenu() {
				this.open_set = !this.open_set;
				this.toBottom()
			},
			inputFocus(e) {
				this.open_set = false;
				// #ifndef H5
				this.keyboardHeight = `${e.detail.height - 50 + (this.isTabbar ? 0 : 50)}px`
				// #endif
			},
			inputBlur() {
				this.open_set = false;
				this.keyboardHeight = 0
			}
		},
	};
</script>

<style lang="scss" scoped>
	.chat {
		flex: 1;
		overflow: hidden;
		display: flex;
		flex-direction: column;

		&-ad__position--top {
			position: absolute;
			display: flex;
			height: 230rpx;
			justify-content: space-between;

			image {
				width: 230rpx;
				height: 230rpx;
			}
		}

		&-main {
			height: calc(100% - 200rpx);
			flex: 1;
			display: flex;
			flex-direction: column;
			padding: 0 20rpx;
			box-sizing: border-box;
		}

		&-item {
			.loading {
				/deep/uni-rich-text:last-child {
					&>div>.md-p::after {
						content: " ";
						border-right: 2px solid; //不指定颜色，使光标和文字颜色一致
						animation: typing 10s steps(17),
							blink 1s steps(1) infinite; //infinite用来使动画无限循环

					}

					li:last-child {
						.md-p::after {
							content: " ";
							border-right: 2px solid; //不指定颜色，使光标和文字颜色一致
							animation: typing 10s steps(17),
								blink 1s steps(1) infinite; //infinite用来使动画无限循环

						}
					}

				}
			}

			@keyframes typing {
				from {
					width: 0;
				}
			}

			@keyframes blink {
				50% {
					border-color: transparent;
				}
			}

			&__left {
				display: flex;
				margin-top: 30rpx;

				&-right {
					margin-left: 20rpx;
				}

				&-name {
					font-size: 24rpx;
					color: var(--font-black);
				}

				&-message {
					margin-top: 10rpx;
					background: var(--white);
					color: var(--font-black);
					padding: 20rpx;
					border-radius: 20rpx;
					font-size: 28rpx;
					border-top-left-radius: 0;
					max-width: 68vw;
				}

				&-bottom {
					display: flex;
					align-items: flex-end;
				}
			}

			&__right {
				display: flex;
				margin-top: 30rpx;
				justify-content: flex-end;

				&-message {
					margin-right: 20rpx;
					background: $uni-color-primary;
					color: #fff;
					padding: 20rpx;
					border-radius: 20rpx;
					border-top-right-radius: 0;
					font-size: 28rpx;
					max-width: 68vw;
				}
			}
		}
	}

	.send {
		position: fixed;
		height: auto;
		left: 0;
		width: 100%;
		// 处理苹果系统键盘兼容
		bottom: 0rpx !important;
		// 处理苹果底部兼容
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		&.isTabbar {
			bottom: 100rpx !important;
		}

		&-line {
			z-index: 99;
			display: flex;
			align-items: center;
			background: var(--bg-gray);
			padding: 20rpx;
			box-sizing: border-box;
			justify-content: space-between;

			&-empty {
				background: $uni-color-primary;
				width: 60rpx;
				height: 60rpx;
				min-width: 60rpx;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;

				image {
					width: 40rpx;
					height: 40rpx;
				}
			}

			&-input {
				width: calc(100vw - 240rpx);
				height: auto;
				display: flex;
				align-items: center;
				border-radius: 4rpx;
				margin-left: 20rpx;
				padding: 6rpx 20rpx;
				background-color: var(--bg);
				box-sizing: border-box;
				color: var(--font-black);
				justify-content: space-between;

				&.BigInput {
					width: calc(100vw - 120rpx);
				}

				textarea {
					flex: 1;
					margin-top: 7.5rpx;
					line-height: 50rpx;
					font-size: 32rpx;
				}

				transition: all 0.3s;

				&-icon {
					display: flex;
					position: relative;
					justify-content: center;
					align-items: center;
					color: #fff;



					transition: transform 0.3s;
				}
			}

			&-button {
				margin-left: 20rpx;
				width: 100rpx;
				min-width: 100rpx;
				height: 70rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: $uni-color-primary;
				color: #fff;
				border-radius: 4rpx;
				font-size: 26rpx;
			}
		}

		.open1 {
			transform: rotate(225deg);
		}

		&-operation {
			overflow: hidden;
			height: 0;
			width: 750rpx;
			transition: height 0.3s;
			background: var(--bg-gray);
			display: flex;
			align-items: center;
			border-top: 1px solid var(--border);
			// justify-content: space-around;
			flex-wrap: wrap;

			&-item {
				width: 25%;
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 55rpx 0;

				&-img {
					background-color: #fff;
					border-radius: 25rpx;
					height: 110rpx;
					width: 110rpx;
					color: #717171;
					display: flex;
					align-items: center;
					justify-content: center;

					image {
						width: 55rpx;
						height: 55rpx;
					}
				}

				&-name {
					font-size: 24rpx;
					margin-top: 15rpx;
					color: var(--font-black);
				}

				&-icon {
					position: absolute;
					background-color: #f50e0e;
					color: #ffeeee;
					border-radius: 8rpx;
					padding: 5rpx 10rpx;
					top: 50rpx;
					font-size: 24rpx;
					right: 10rpx;
					transform: scale(0.7);
				}
			}
		}
	}

	.open2 {
		border-top: 1px solid var(--border);
		min-height: 260rpx;
		height: auto;
	}

	.commonProblem {
		display: flex;
		align-items: center;
		overflow-x: auto;
		background: var(--bg);
		padding: 10rpx 0;
		z-index: 99;
		padding-left: 20rpx;

		&-item {
			margin-left: 20rpx;
			border: 1px solid $uni-color-primary;
			border-radius: 20rpx;
			padding: 5rpx 10rpx;
			white-space: nowrap;
			color: var(--font-black);
		}
	}
</style>