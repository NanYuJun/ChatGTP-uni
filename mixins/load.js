export default {
	data() {
		return {
			scrollTop: 0,
			old: {
				scrollTop: 0
			},
			tips: '暂无数据',
		}
	},
	methods: {
		scroll: function(e) {
			this.old.scrollTop = e.detail.scrollTop
		},
		goTop: function(e) {
			this.scrollTop = this.old.scrollTop
			this.$nextTick(() => {
				this.scrollTop = 0
			});
		},
		lower(e) {
			if (this.list.length < this.total) {
				this.getList()
			}
		},
		loadTips() {
			if (this.list.length < this.total) {
				this.tips = '上拉加载更多'
			} else if (this.list.length == 0) {
				this.tips = '暂无数据'
			} else {
				this.tips = '加载完成'
			}
		}
	}
}