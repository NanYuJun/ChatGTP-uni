export default {
	methods:{
		ad(position){
			let ad = uni.getStorageSync('ad')
			if(!ad){
				return []
			}
			return ad.filter(item => item.position == position)
		}
	}
}
