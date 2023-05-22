import io from '@hyoga/uni-socket.io';
import {
	login
} from '@/config/login'
import config from '@/config/request.js'
import store from "../store";
import {
	delay
} from '@/utils/utils.js'
import Vue from "vue"

// 这个是打字效果 之前由于openai返回过慢  

class Chat {
	constructor() {
		this.onMessage = null
		this.socket = null
		this.problem = ''
		this.answer = ''
		this.isFirst = false
	}
	setup() {
		this.socket = io(process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8002' : config.baseURL, {
			transports: ['websocket', 'polling'],
			timeout: 5000,
		});
		this.socket.on('connect', () => {
			const {
				id
			} = this.socket;
			this.socket.on(id, async (e) => {
				let index = store.state.chat.findIndex(item => item.id === e.id)
				// 如果是流返回状态为loading
				if (e.status == 'loading') {
					this.answer += e.msg
					// 一段话仅触发一次
					if (this.isFirst) {
						this.isFirst = false
						store.commit("setChat", {
							index,
							...store.state.chat[index],
							date: new Date()
						})
						do {
							store.commit("setChat", {
								index,
								...store.state.chat[index],
								content: store.state.chat[index].content += this.answer[
									store.state.chat[index]
									.content.length] || ''
							})

							// 每个字50ms出来一次，实现打字效果，避免用户等待焦虑
							await delay(50)
							this.onMessageAfter(0)
						} while (store.state.chatLoading)
					}

				} else if (e.msg == '[DONE]') {
					const wait = async () => {
						await delay(150)
						if (store.state.chat[index].content != this.answer) {
							await wait()
						}
					}
					// 如果打字效果未加载完毕，等待加载完毕后继续执行
					await wait()
					store.commit("setChat", {
						index,
						...store.state.chat[index],
						status: 'success'
					})

					this.onMessageSuccess()
				} else {
					this.answer = e.msg
					let i = 0
					do {
						if (i == 0) {
							store.commit("setChat", {
								index,
								...store.state.chat[index],
								date: new Date()
							})

						}
						store.commit("setChat", {
							index,
							...store.state.chat[index],
							content: store.state.chat[index].content += e.msg[i] || '',
						})
						i++
						await delay(50)
						this.onMessageAfter(0)
					} while (store.state.chatLoading && i < e.msg.length)
					store.commit("setChat", {
						index,
						...store.state.chat[index],
						status: e.status,
					})
					this.onMessageSuccess()
				}
			});
		});
		this.socket.on('error', (msg) => {
			console.log('ws error', msg);
		});
	}

	setOnMessageAfter(fun) {
		this.onMessageAfter = fun
	}
	stop() {
		this.onMessageSuccess()
		if (store.state.chat.length === 0) {
			uni.showToast({
				title: '没有可以清理的记录',
				icon: 'none'
			})
			return
		}
		let index = store.state.chat.length - 1
		store.commit("setChat", {
			index,
			...store.state.chat[index],
			status: 'error',
			content: store.state.chat?.[index]?.content || '已停止，可点击重试进行尝试重新发送～'
		})
	}
	// 下一个问题
	next() {
		this.onMessageSuccess()
		store.commit("setChat")
		uni.showToast({
			title: "记忆已经清除！",
		});
	}
	// 重新问
	reload(index) {
		if (store.state.chatLoading) {
			return uni.showToast({
				title: '请等待上一个问题回答完毕，再进行重试！',
				icon: 'none'
			})
		}
		this.getAnswer(store.state.chat[index - 1].content)
	}
	// 获取问题答案
	getAnswer(problem) {
		if (store.state.chatLoading) {
			return uni.showToast({
				title: '请等待上一个问题回答完毕，再进行提问！',
				icon: 'none'
			})
		}
		if (problem == "清除记忆") {
			this.next();
			return;
		}
		if (!problem) {
			uni.showToast({
				title: "你还没有输入问题呢！",
				icon: "none",
			});
			return;
		}
		store.commit('setChatLoading', true)
		store.commit('setChat', {
			role: "user",
			content: problem,
			status: "success",
			date: new Date()
		})
		const index = store.state.chat.length
		this.sendMessage({
			messages: store.state.chat,
			problem,
			key: uni.getStorageSync("key") || "",
			modelId: store.state.model.id,
			token: uni.getStorageSync('appToken'),
			id: index
		})
		store.commit('setChat', {
			id: index,
			role: "assistant",
			content: '',
			status: 'loading'
		})
		this.onMessageAfter()
	}
	onMessageSuccess() {
		store.commit('setChatLoading', false)
		this.isFirst = true
		this.answer = ''
	}
	/**
	 * 发送消息
	 * @param message 发送消息
	 */
	sendMessage(message) {
		if (!this.socket) return;
		this.socket.emit('myEvent', message);
	}
}


export default new Chat();