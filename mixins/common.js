import {
	mapState
} from 'vuex'
export default {

	computed: {
		...mapState({
			// 从state中拿到数据 箭头函数可使代码更简练
			userInfo: state => state.userInfo,

		}, ),


	},
}