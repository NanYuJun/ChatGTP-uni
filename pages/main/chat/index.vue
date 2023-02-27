<template>
	<view class="chat">
		<view class="chat-ad__position--top">
			<image :src="item.title" v-for="item in ad('6').slice(0, 3)" :key="item.id" @tap="handleAdClick(item)">
			</image>
		</view>
		<view class="chat-item">
			<view v-for="item in ad('2')" :key="item.id">
				<view class="chat-item__left u-flex">
					<u-avatar :src="robot.img || '/static/avatar.jpeg'" shape="square"></u-avatar>
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
		<view class="chat-item" v-for="(item, index) in chat" :key="index">
			<!-- 机器人消息 -->
			<u-transition :show="true" mode="fade-left" v-if="item.name == 'chatgpt'">
				<view class="chat-item__left u-flex">
					<u-avatar :src="robot.img || '/static/avatar.jpeg'" shape="square"></u-avatar>
					<view class="chat-item__left-right">
						<view class="chat-item__left-name">
							{{ robot.name || "智能AI" }}
						</view>
						<view class="chat-item__left-bottom">
							<view class="chat-item__left-message" @longtap="copy(item.message)">
								{{ item.message || "思考中..." }}
							</view>
							<u-loading-icon v-if="item.status == 'loading'"></u-loading-icon>
							<u-icon v-if="item.status == 'error'" name="error"></u-icon>
							<view style="margin-top: auto">
								<u-icon v-if="item.status == 'success'" @tap="copy(item.message)" name="file-text">
								</u-icon>
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
					<u-avatar shape="square" :src="userInfo.avatar"></u-avatar>
				</view>
			</u-transition>
		</view>

		<!-- 占位用的 -->
		<view style="padding: 35rpx; opacity: 0">
			<view>
				<textarea disabled style="color: #fff" auto-height v-model="problem"></textarea>
			</view>
			<view class="bottom" :class="{ open2: open_set }" style="background-color: transparent; border-top: none">
			</view>
			<view style="background-color: #f8f8f8" :style="{ height: Height + 'px' }"></view>
		</view>

		<view class="send" :class="{
        isTabbar: tabbar.length > 1,
      }">
			<view class="send-line">
				<view class="send-line-empty" @tap="next">
					<image src="../../../static/menu/empty.png"></image>
				</view>
				<view class="send-line-input" :class="{ BigInput: problem.length == 0 }">
					<textarea :adjust-position="false" @focus="foucus" @blur="blur" :show-confirm-bar="false"
						auto-height v-model="problem"></textarea>
					<view class="send-line-input-icon" @tap="Setting" :class="{ open1: open_set }">
						<image src="../../../static/menu/add.png"></image>
					</view>
				</view>

				<view class="send-line-button" @tap="getAnswer" v-if="problem.length > 0">发送</view>
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
		<changeKey v-model="show" />
		<tabbar ref="tabBar" />
	</view>
</template>

<script>
	import adMixin from "../../../mixins/ad.js";
	import changeKey from "@/components/changeKey.vue";
	export default {
		mixins: [adMixin],
		components: {
			changeKey
		},
		data() {
			return {
				list: [],
				robot: {},
				problem: "",
				open_set: false,
				show: false,
				start_show: true,
				is_fouces: false,
				Height: 0, // 键盘高度
				userInfo: uni.getStorageSync("userInfo") || {},
				tabbar: uni.getStorageSync("tabbar") || [],
				chat: uni.getStorageSync("chat") || [],
			};
		},
		onLoad(e) {
			this.problem = e.problem || "";
			this.getList();
			this.toBottom();
		},
		onShow() {
			this.$nextTick(() => {
				this.$refs.tabBar.setTabbar()
			})
			this.robot = uni.getStorageSync("robot") || {};
			this.tabbar = uni.getStorageSync("tabbar") || [];
			this.chat = uni.getStorageSync("chat") || [];
		},
		methods: {
			// 复制
			copy(val) {
				uni.setClipboardData({
					data: this.answer || val,
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
			// 下个问题
			next() {
				uni.removeStorageSync("chat");
				this.chat =  []
				uni.showToast({
					title: "记忆已经清除！",
				});
			},
			async getList() {
				let {
					data
				} = await uni.$u.http.post("/app/renovation/chat/menu/list");
				this.list = data.data;
			},
			// 滚动到最底部
			toBottom() {
				this.$nextTick(() =>
					uni.pageScrollTo({
						scrollTop: 9999,
						duration: 300,
					})
				);
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

				this.chat = [
					...this.chat,
					{
						name: "my",
						message: this.problem,
						status: "success",
					},
					{
						name: "chatgpt",
						message: "",
						status: "loading",
					},
				];
				let index = this.chat.length - 1;
				this.problem = "";
				this.toBottom();

				try {
					const {
						data
					} = await uni.$u.http.post(
						"/app/chatgpt/info", {
							prompt: this.handlePrompt(),
							chat: this.chat,
							problem: this.problem,
							answer: this.answer,
							key: uni.getStorageSync("key") || "",
						}, {
							timeout: 300000, // 由于接口请求时间较长
						}
					);
					if (data.code == 1000) {
						this.$set(this.chat, index, {
							name: "chatgpt",
							message: data.data.choices[0].text,
							status: "success",
						});
					} else {
						this.$set(this.chat, index, {
							name: "chatgpt",
							message: data.message,
							status: "error",
						});
					}
				} catch (e) {
					this.$set(this.chat, index, {
						name: "chatgpt",
						message: JSON.stringify(e),
						status: "error",
					});
				}
				uni.setStorageSync("chat", this.chat);
				this.toBottom();
			},
			handlePrompt() {
				let query = "";
				this.chat.forEach((item) => {
					if (item.status == "success") {
						switch (item.name) {
							case "my":
								query += `\nQ: ${item.message}`;
								break;
							case "chatgpt":
								query += `\nA: ${item.message}`;
								break;
							default:
								break;
						}
					}
				});
				query += `<|endoftext|>\n\nA: `;
				return query;
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
				this.Height = e.target.height;
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
		padding: 20rpx;
		box-sizing: border-box;

		&-ad__position--top {
			display: flex;
			justify-content: space-between;

			image {
				width: 230rpx;
				height: 230rpx;
			}
		}

		&-item {
			&__left {
				display: flex;
				margin-top: 30rpx;

				&-right {
					margin-left: 20rpx;
				}

				&-name {
					font-size: 24rpx;
				}

				&-message {
					margin-top: 10rpx;
					background: $uni-color-primary;
					padding: 20rpx;
					border-radius: 10rpx;
					font-size: 28rpx;
					color: #fff;
					margin-right: 20rpx;
					line-height: 40rpx;
					max-width: 70vw;
				}

				&-bottom {
					display: flex;
				}
			}

			&__right {
				display: flex;
				margin-top: 30rpx;
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
		position: fixed;
		height: auto;
		// bottom: 100rpx;
		left: 0;
		bottom: var(--window-bottom, 0);

		&.isTabbar {
			bottom: 100rpx !important;
		}

		&-line {
			z-index: 99;
			display: flex;
			align-items: center;
			background: #f8f8f8;
			width: 750rpx;
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
				width: 500rpx;
				height: auto;
				display: flex;
				border-radius: 4rpx;
				margin-left: 20rpx;
				padding: 6rpx 20rpx;
				background-color: #ffffff;
				box-sizing: border-box;
				justify-content: space-between;

				textarea {
					width: 450rpx;
					margin-top: 7.5rpx;
					line-height: 50rpx;
					font-size: 32rpx;
				}

				transition: all 0.3s;

				&.BigInput {
					flex: 1;
					// padding-right: 130rpx;
				}

				&-icon {
					width: 60rpx;
					height: 60rpx;
					display: flex;
					position: relative;
					justify-content: center;
					align-items: center;
					color: #fff;

					image {
						height: 45rpx;
						width: 45rpx;
					}

					transition: transform 0.3s;
				}
			}

			&-button {
				margin-left: 20rpx;
				width: 100rpx;
				min-width: 100rpx;
				height: 76rpx;
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
			background: #f8f8f8;
			display: flex;
			align-items: center;
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
		border-top: 1px solid #e6e6e6;
		min-height: 260rpx;
		height: auto;
	}
</style>
