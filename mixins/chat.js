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
		init() {
			this.chat = uni.getStorageSync('historyProblem') || []
			this.key = uni.getStorageSync('key') || ''
		},
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
		async getAnswer() {
			let index = this.chat.length
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
			try {
				let query = ''
				this.chat.forEach(item => {
					query += `\nQ: ${item.problem}\n\n\nA: ${item.answer}。 <|endoftext|>\n`
				})
				query += `Q: ${this.problem} + "\nA: `

				if (this.type == 'chat') {
					this.chat.push({
						problem: this.problem,
						answer: ''
					})
					uni.pageScrollTo({
						selector: '.seize',
					})
					this.problem = ''
				} else {
					uni.showLoading({
						title: '拼命思考中...',
					})
				}
				const {
					data
				} = await uni.$u.http.post('https://gpt.qqip.net/api/app/chatgpt/info', {
					"prompt": query,
					"key": uni.getStorageSync('key') || ''
				})
				uni.hideLoading()
				if (data.code != 1000) {
					uni.showToast({
						title: data.message,
						icon: 'none'
					})
					this.$set(this.chat, index, {
						...this.chat[index],
						answer: 'error'
					})
					return
				}
				this.answer = data.data.choices[0].text
				if (!this.answer) return
				uni.pageScrollTo({
					selector: '.seize',
				})
				this.$set(this.chat, index, {
					...this.chat[index],
					answer: this.answer
				})
				uni.setStorageSync('historyProblem', this.chat)
				this.init()
			} catch (e) {
				uni.hideLoading()
				if (e.statusCode == 401) {
					uni.showToast({
						title: 'key无效',
						icon: 'none'
					})
					return
				}
				uni.showToast({
					title: '获取失败，请联系管理员' + e,
					icon: 'none'
				})
				this.$set(this.chat, index, {
					...this.chat[index],
					answer: 'error'
				})
				uni.pageScrollTo({
					selector: '.seize',
				})
			}

		}

	}
}
