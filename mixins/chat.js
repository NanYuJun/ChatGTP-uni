export default {
	data() {
		return {
			problem: '',
			answer: '',
			show: false,
			key: '',
			chat: [],
			type: ''
		}
	},
	onShow() {
		this.init()

	},
	methods: {
		// 初始化
		init() {
			this.chat = uni.getStorageSync('historyProblem') || []
			this.key = uni.getStorageSync('key') || ''
		},
		// 复制
		copy(val) {
			uni.setClipboardData({
				data: this.answer || val,
				success: function() {
					uni.showToast({
						title: '复制成功',
						icon: 'none'
					})
				}
			});
		},
		// 切换key
		changeKey() {
			uni.setStorageSync('key', this.key)
			this.show = false
		},
		// 下个问题
		next() {
			uni.removeStorageSync('historyProblem');
			this.init()
			uni.showToast({
				title: '记忆已经清除！'
			})
		},
		// 滚动到最底部
		toBottom() {
			this.$nextTick(() => uni.pageScrollTo({
				scrollTop: 9999,
				duration: 300
			}))
		},
		// 获取问题答案
		async getAnswer() {
			if (this.problem == '清除记忆') {
				this.next()
				return
			}
			if (!this.problem) {
				uni.showToast({
					title: '你还没有输入问题呢！',
					icon: 'none'
				})
				return
			}

			this.chat = [
				...this.chat,
				{
					name: 'my',
					message: this.problem,
					status: 'success'
				},
				{
					name: 'chatgpt',
					message: '',
					status: 'loading'
				}
			]
			let index = this.chat.length - 1
			let loading
			if (this.type === 'chat') {
				this.problem = ''
				this.toBottom()
			} else {
				loading = true
				this.answer = '思考中'
				const sleep = (ms)=> {
					setTimeout(() => {
						if (loading == true) {
							if(this.answer == '思考中...'){
								this.answer = '思考中'
							}else{
								this.answer += '.'
							}
							sleep(ms)
						}else{

						}
					}, ms)
				}
				sleep(300)
			}
			try {

				const {
					data
				} = await uni.$u.http.post('/app/chatgpt/info', {
					"prompt": this.handlePrompt(),
					"key": uni.getStorageSync('key') || ''
				}, {
					timeout: 300000 // 由于接口请求时间较长
				})

				if (data.code == 1000) {
					this.answer = data.data.choices[0].text
					this.$set(this.chat, index, {
						name: 'chatgpt',
						message: data.data.choices[0].text,
						status: 'success'
					})
				} else {
					this.answer = data.message
					this.$set(this.chat, index, {
						name: 'chatgpt',
						message: data.message,
						status: 'error'
					})
				}
			} catch (e) {
				this.answer = e
				this.$set(this.chat, index, {
					name: 'chatgpt',
					message: JSON.stringify(e),
					status: 'error'
				})
			}
			uni.setStorageSync('historyProblem', this.chat)
			if (this.type === 'chat') {
				this.toBottom()
			} else {
				loading = false
			}
		},
		handlePrompt() {
			let query = ''
			this.chat.forEach(item => {
				if (item.status == 'success') {
					switch (item.name) {
						case 'my':
							query += `\nQ: ${item.message}`
							break;
						case 'chatgpt':
							query += `\nA: ${item.message}`
							break;
						default:
							break;
					}
				}

			})
			query += `<|endoftext|>\n\nA: `
			return query
		}

	}
}
