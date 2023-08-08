<template>
	<view class="main-list oBorder" :style="{paddingTop:paddingView+'rpx',paddingBottom:paddingView+'rpx'}">
		<!-- 文本框 -->
		<image v-if="logo" :src="logo" :style="{height:height+'rpx',width:width+'rpx',paddingLeft:paddingLeft+'rpx'}"></image>
		<text v-if="texts">{{texts}}</text>
		<input
			class="main-input"
			:value="value"
			:type="_type"
			:maxlength="maxlength"
			:placeholder="placeholder"
			:password="type==='password'&&!showPassword"
			:style="{marginLeft:LeftInput+'rpx',fontSize:fontSize+'rpx'}"
			@input="onInput"
		/>
		
		<!-- 是否可见密码 -->
		<image
			v-if="_isShowPass&&type==='password'&&!_isShowCode"
			class="img cuIcon"
			:class="showPassword?'cuIcon-attention':'cuIcon-attentionforbid'"
			@tap="showPass"
		></image>
		<!-- 倒计时 -->
		<view
			v-if="_isShowCode&&!_isShowPass"
			:class="['vercode',{'vercode-run': second>0}]"
			@click="setCode"
		>{{ getVerCodeSecond }}</view>

	</view>
</template>

<script>
	var _this, countDown;
	export default{
		data(){
			return{
				showPassword: false, //是否显示明文
				second: 0, //倒计时
				isRunCode: false, //是否开始倒计时
			}
		},
		props:{
			type: String, //类型
			logo: String, //类型
			value: String, //值
			texts:String,
			paddingView: {
				//最大长度
				type: [Number,String],
				default: 20,
			},
			placeholder: String, //框内提示
			maxlength: {
				//最大长度
				type: [Number,String],
				default: 20,
			},
			//rpx
			height: {
				type: String,
				default: '28'
			},
			//rpx
			width: {
				type: String,
				default: '26'
			},
			paddingLeft:{
				type: String,
				default: '26'
			},
			LeftInput:{
				type: String,
				default: '20'
			},
			fontSize:{
				type: String,
				default: '28'
			},
			isShowPass:{
				//是否显示密码图标（二选一）
				type: [Boolean,String],
				default: false,
			},
			isShowCode:{
				//是否显示获取验证码（二选一）
				type: [Boolean,String],
				default: false,
			},
			codeText:{
				type: String,
				default: "获取验证码",
			},
			setTime:{
				//倒计时时间设置
				type: [Number,String],
				default: 60,
			}
		},
		model: {
			prop: 'value',
			event: 'input'
		},
		mounted() {
			_this=this
			//准备触发
			this.$on('runCode',(val)=>{
                this.runCode(val);
            });
			clearInterval(countDown);//先清理一次循环，避免缓存
		},
		methods:{
			showPass(){
				//是否显示密码
				this.showPassword = !this.showPassword
			},
			onInput(e) {
				//传出值
				this.$emit('input', e.target.value)
			},
			setCode(){
				//设置获取验证码的事件
				if(this.isRunCode){
					//判断是否开始倒计时，避免重复点击
					return false;
				}
				this.$emit('setCode')
			},
			runCode(val){
				//开始倒计时
				if(String(val)=="0"){

					//判断是否需要终止循环
					this.second = 0; //初始倒计时
					clearInterval(countDown);//清理循环
					this.isRunCode= false; //关闭循环状态
					return false;
				}
				if(this.isRunCode){
					//判断是否开始倒计时，避免重复点击
					return false;
				}
				this.isRunCode= true
				this.second = this._setTime //倒数秒数

				let _this=this;
				countDown = setInterval(function(){
					_this.second--
					if(_this.second==0){
						_this.isRunCode= false
						clearInterval(countDown)
					}
				},1000)
			}


		},
		computed:{
			_type(){
				//处理值
				const type = this.type
				return type == 'password' ? 'text' : type
			},
			_isShowPass() {
				//处理值
				return String(this.isShowPass) !== 'false'
			},
			_isShowCode() {
				//处理值
				return String(this.isShowCode) !== 'false'
			},
			_setTime() {
				//处理值
				const setTime = Number(this.setTime)
				return setTime>0 ? setTime : 60
			},
			getVerCodeSecond(){
				//验证码倒计时计算
				if(this.second<=0){
					return this.codeText;
				}else{
					if(this.second<10){
						return '0'+this.second+"s";
					}else{
						return this.second+"s";
					}
				}

			}
		}
	}
</script>

<style>
	@import url("./css/icon.css");

	.main-list{
		opacity:0.8;
		/* z-index: 88; */
		/* background: white; */
		border-bottom: 1px solid #CCCCCC;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 36upx;   /* Input 高度 */
		color: #333333;
		padding: 20upx 0 10upx;
		/* margin-bottom: 24upx; */
	}
	.img{
		width: 32upx;
		height: 32upx;
		font-size: 32upx;
	}
	.main-input{
		flex: 1;
		text-align: left;
		padding-right: 10upx;
	}
	.vercode {
		color: #fff;
		font-size: 24upx;
		padding:10upx 20upx;
		line-height: 40upx;
		margin-right: 30upx;
		border-radius: 30px;
		
		background-color: #cfaa73;
	}
	.vercode-run {
		color: rgba(0,0,0,0.4) !important;
	}

</style>
