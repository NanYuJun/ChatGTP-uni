<template>
	<view class="chat" :class="theme">
		<!-- #ifndef MP-TOUTIAO -->
		<u-navbar :title="model.name" leftIconSize="0" :bgColor="theme == 'light' ? '#0071ff' : '#2c2c2c'"
			:safeAreaInsetTop="true" :placeholder="true" titleStyle="color:#fff">
		</u-navbar>
		<!-- #endif -->
		<view class="chat-ad__position--top" v-if="ad('6').slice(0, 3).length > 0">
			<image :src="item.title" v-for="item in ad('6').slice(0, 3)" :key="item.id" @tap="handleAdClick(item)">
			</image>
		</view>
		<!-- #ifdef H5 -->
		<scroll-view scroll-y="true" :style="{height: `calc(100% - ${commonProblem.length > 0 ? '380rpx':'310rpx'})`}"
			class="chat-main" :scroll-into-view="scrollId">
			<!-- #endif -->
			<!-- #ifndef H5 -->
			<scroll-view scroll-y="true"
				:style="{a:commonProblem.length,height: `calc(100% - ${commonProblem.length>0 ? '490rpx':'420rpx'})`}"
				class="chat-main" :scroll-into-view="scrollId">
				<!-- #endif -->
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
									<u-icon size="22" style="margin-left: 20rpx;" name="reload" @tap="reload(index)">
									</u-icon>
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
						<view :id="`chat-item-${index}`">

						</view>
					</u-transition>
				</view>
			</scroll-view>

			<!-- 占位用的 -->
			<view style="height: 200rpx; opacity: 1">
				<view>

					<textarea disabled style="color: #fff" auto-height></textarea>
				</view>
				<view class="bottom" :class="{ open2: open_set }"
					style="background-color: transparent; border-top: none">
				</view>
				<view style="background-color: #f8f8f8" :style="{ height: Height + 'px' }"></view>
			</view>
			<view class="send" :class="{
        isTabbar: Height === 0,
      }">
				<view class="commonProblem" v-if="commonProblem && commonProblem.length > 0">
					<u-image src="/static/problem.png" width="20px" height="20px" mode=""></u-image>
					<view class="commonProblem-item" v-for="item in commonProblem" :key="item.id"
						@tap="sendCommonProblem(item)">
						{{item.name}}
					</view>

				</view>
				<view class="send-line">
					<view class="send-line-empty" @tap="loading ? stop() : next()">
						<image v-if="!loading" src="../../../static/menu/empty.png"></image>
						<u-loading-icon v-else color="white" mode="semicircle" size="18">
						</u-loading-icon>
					</view>
					<view class="send-line-input" :class="{ BigInput: problem.length == 0 && list.length > 0}">
						<textarea :adjust-position="false" @focus="foucus" @blur="blur" :show-confirm-bar="false"
							maxlength="1000" auto-height v-model="problem" onfirm-type="send" @confirm="getAnswer()"
							@keyup.enter="getAnswer()"></textarea>
						<view class="send-line-input-icon" @tap="Setting"
							v-if="problem.length === 0 && list.length > 0">
							<u-icon name="plus-circle" size="25"></u-icon>
						</view>
					</view>

					<view class="send-line-button" @tap="loading ? stop() : getAnswer()"
						v-if="problem.length > 0 || list.length == 0">
						{{loading ? '停止' : '发送'}}
					</view>
				</view>
				<view style="background-color: #f8f8f8; transition: all 0.1s" :style="{ height: Height + 'px' }"></view>
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

			<tabbar ref="tabBar" />
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import Chat from '@/utils/chat.js'
	import {
		delay
	} from '@/utils/utils.js'
	export default {
		data() {
			return {
				chat: [],
				answer: '',
				list: [],
				problem: "",
				open_set: false,
				show: false,
				start_show: true,
				is_fouces: false,
				Height: 0, // 键盘高度
				userInfo: uni.getStorageSync("userInfo") || {},
				commonProblem: [],
				systemProblem: [],
				loading: false,
				isFirst: true,
				scrollId: ''
			};
		},
		computed: mapState({
			// 从state中拿到数据 箭头函数可使代码更简练
			tabbar: state => state.tabbar,
			robot: state => state.robot,
			modelList: state => state.modelList,
			model: state => state.model,
			theme: state => state.theme
		}),
		onLoad() {
			Chat.onMessage = this.onMessage
			this.getMenuList();
		},
		onShow() {
			if (this.model?.name || '') {
				uni.setNavigationBarTitle({
					title: this.model?.name
				});
			}
			this.chat = uni.getStorageSync('chat') || []
			this.getCommonProblem()
			this.getSystemProblem()
			this.toBottom();
		},
		methods: {
			init() {
				this.getCommonProblem()
				this.getSystemProblem()
			},
			stop() {
				this.onMessageSuccess()
				let index = this.chat.length - 1
				this.$set(this.chat, index, {
					...this.chat[index],
					status: 'error',
					content: this.chat?. [index]?.content || '已停止，可点击重试进行尝试重新发送～'
				})
			},
			async onMessage(e) {
				let index = this.chat.findIndex(item => item.id === e.id)
				// 如果是流返回状态为loading
				if (e.status == 'loading') {
					this.answer += e.msg
					// 一段话仅触发一次
					if (this.isFirst) {
						this.isFirst = false
						this.$set(this.chat, index, {
							...this.chat[index],
							date: new Date()
						})
						do {
							this.$set(this.chat, index, {
								...this.chat[index],
								content: this.chat[index].content += this.answer[this.chat[index].content
									.length] || ''
							})
							// 每个字50ms出来一次，实现打字效果，避免用户等待焦虑
							await delay(50)
							this.toBottom(0)
						} while (this.loading)
					}

				} else if (e.msg == '[DONE]') {
					const wait = async () => {
						await delay(150)
						if (this.chat[index].content != this.answer) {
							await wait()
						}
					}
					// 如果打字效果未加载完毕，等待加载完毕后继续执行
					await wait()
					this.$set(this.chat, index, {
						...this.chat[index],
						status: 'success'
					})
					this.onMessageSuccess()
				} else {
					this.answer = e.msg
					let i = 0
					do {
						if (i == 0) {
							this.$set(this.chat, index, {
								...this.chat[index],
								date: new Date()
							})
						}
						this.$set(this.chat, index, {
							...this.chat[index],
							content: this.chat[index].content += e.msg[i] || '',
						})
						i++
						await delay(50)
						this.toBottom(0)
					} while (this.loading && i < e.msg.length)

					this.$set(this.chat, index, {
						...this.chat[index],
						status: e.status,
					})
					this.onMessageSuccess()
				}
			},
			async onMessageSuccess() {
				this.loading = false
				this.isFirst = true
				this.answer = ''
				uni.setStorageSync('chat', this.chat)
			},
			// 获取常见问题
			async getCommonProblem() {
				const {
					data
				} = await uni.$u.http.post('/app/chatgpt/model_problem/list', {
					modelId: this.model.id
				})

				this.commonProblem = data.data
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
			go(e) {
				uni.$u.route(e);
			},
			sendCommonProblem(e) {
				this.problem = e.name
				this.getAnswer()
			},
			// 下个问题
			next() {
				this.onMessageSuccess()
				this.chat = []
				uni.showToast({
					title: "记忆已经清除！",
				});
				uni.removeStorageSync('chat')
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
			toBottom() {
				this.scrollId = ''
				this.$nextTick(() => {
					this.scrollId = `chat-item-${this.chat.length - 1}`
				})
			},
			reload(index) {
				if (this.loading) {
					return uni.showToast({
						title: '请等待上一个问题回答完毕，再进行重试！',
						icon: 'none'
					})
				}
				this.problem = this.chat[index - 1].content
				this.getAnswer()
			},
			// 获取问题答案
			async getAnswer() {
				if (this.loading) {
					return uni.showToast({
						title: '请等待上一个问题回答完毕，再进行提问！',
						icon: 'none'
					})
				}
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
				this.loading = true
				this.chat.push({
					role: "user",
					content: this.problem,
					status: "success",
					date: new Date()
				})

				let problem = this.problem
				this.problem = "";
				const index = this.chat.length
				Chat.sendMessage({
					messages: this.chat,
					problem,
					key: uni.getStorageSync("key") || "",
					modelId: this.model.id,
					token: uni.getStorageSync('appToken'),
					id: index
				})
				this.chat.push({
					id: index,
					role: "assistant",
					content: '',
					status: 'loading'
				})

				this.toBottom();
			},
			handleAdClick(e) {
				// #ifdef H5
				window.open(e.desc);
				// #endif
				// #ifndef H5
				if (e.desc.indexOf("webview") > -1 || e.desc.indexOf("http") == -1) {
					uni.navigateTo({
						url: e.desc,
					});
					return;
				}
				uni.setClipboardData({
					data: e.desc || val,
					success: function() {
						uni.showToast({
							title: "链接复制成功，由于小程序限制，请使用浏览器打开",
							icon: "none",
						});
					},
				});
				// #endif
			},
			toPath(e) {
				uni.$u.route({
					url: e,
				});
			},
			Setting() {
				this.open_set = !this.open_set;
			},
			foucus(e) {
				this.Height = e.target?.height || 0;
				this.open_set = false;
				this.is_fouces = true;
			},
			blur(e) {
				this.Height = 0;
				this.is_fouces = false;
			},
		},
	};
</script>

<style lang="scss" scoped>
	.chat {
		min-height: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		background: var(--bg);
		overflow: hidden;

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
			box-sizing: border-box;
			padding: 0 20rpx;

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
		padding-bottom: 0;
		bottom: var(--window-bottom);

		&.isTabbar {
			bottom: 100rpx !important;
			// 处理苹果底部兼容
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
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
