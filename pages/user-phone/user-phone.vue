<template>
	<view>
		<view class="p-2">
			<view class="flex align-stretch">
				<text class="py-2 border-bottom border-light">+86</text>
				<input type="text" v-model="phone" value="" placeholder="手机号码" class="border-bottom border-light p-2 flex-1 " style=""/>
			</view>
			<view class="flex align-stretch">
				<input type="text" v-model="code" value="" placeholder="请输入验证码" class="border-bottom border-light p-2 flex-1" />
				<view class="flex justify-center align-center border-bottom border-light">
					<text class=" bg-main rounded text-white text-center py-1 font-sm" style="width: 150rpx;" :class="codeTime > 0? 'bg-main-disable': 'bg-main'" @click="getCode">{{codeTime > 0? codeTime + 's' : "获取验证码"}}</text>
				</view>
			</view>
		</view>
		
		<!-- 确认按钮 -->
		<view class="py-2 px-3">
			<button :disabled="disabled" :style="disabled? 'background-color:#F991AF' : ''" style="border-radius: 50rpx; border: 0; background-color: #FF4A6A; color: #fff;" plain @click="submit">确认绑定</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone:"",
				code:"",
				codeTime: 0
			}
		},
		computed: {
			disabled() {
				return this.phone === "" || this.code === "" 
			}
		},
		methods: {
			check() {
				// 手机号验证
				let mPattern = /^1[34578]\d{9}$/
				if(!mPattern.test(this.phone)) {
					uni.showToast({
						title:"手机号码格式不正确",
						icon:"none"
					})
					return false
				}
				return true
			},
			submit() {
				if(!this.check()) return
				this.$H.post("/user/bindphone", {
					phone: this.phone,
					code: this.code
				},{
					token: true
				}).then(res => {
					console.log(res)
						this.$store.commit("editUserInfo", {
							key: "phone",
							value: this.phone
						})
						uni.navigateBack({
							delta: 1
						})
						uni.showToast({
							title: "绑定成功",
							icon: "none"
						})
				})
				.catch(err => {
					console.log(err)
				})
			},
			// 获取验证码
			getCode() {
				// 读秒时禁止操作
				if (this.codeTime > 0) return
				// 手机号验证
				if(!this.check()) return
				// 获取验证码
				this.$H.post("/user/sendcode", {
					phone: this.phone
				}, {back: true})
				.then(res => {
					uni.showToast({
						title: res.data.msg,
						icon:"none"
					})
				})
				// 读秒计时
				this.codeTime = 60
				// 开启读秒
				setInterval(()=> {
					if(this.codeTime >= 0) {
						this.codeTime--
					} else {
						this.codeTime = 0
						clearInterval()
					}
				},1000)
			}
		}
	}
</script>

<style>

</style>
