<template>
	<view>
		<uni-status-bar></uni-status-bar>
		<!-- 左上角关闭按钮 -->
		<view class="flex justify-center align-center iconfont icon-guanbi font-lg" style="width: 100rpx; height: 100rpx;" @click="back"></view>
		<!-- 账号密码登录 相关 -->
		<template v-if="!status">
			<view class="text-center text-light-muted" style="margin-top: 130rpx; margin-bottom: 80rpx; font-size: 55rpx;">
				账号密码登录
			</view>
			<view class="p-2">
				<input v-model="username" type="text" value="" placeholder="请输入邮箱/手机/账号" class="border-bottom border-light p-2 " style=""/>
				<view class="flex align-stretch">
					<input v-model="userPassword" type="text" value="" placeholder="请输入密码" class="border-bottom border-light p-2 flex-1" />
					<text class="text-muted font-sm flex justify-center align-center border-bottom border-light " style="width: 150rpx;">忘记密码？</text>
				</view>
			</view>
		</template>
		<!-- 手机验证码登录 -->
		<template v-else>
			<view class="text-center text-light-muted" style="margin-top: 130rpx; margin-bottom: 80rpx; font-size: 55rpx;">
					手机验证码登录
				</view>
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
		</template>
		<!-- 登录按钮 -->
		<view class="py-2 px-3">
			<button :disabled="disabled" style="border-radius: 50rpx; border: 0; color: #fff;" :style="disabled? 'background-color: #ff4d4d;':'background-color: #FF4A6A;'" plain @click="submit" :login="login">{{login? "登录中..." : "登录"}}</button>
		</view>
		
		<view class="flex justify-center align-center pt-4 pb-5">
			<text class="text-primary font" @click="changeStatus">{{status? "账号密码登录" : "手机验证码登录"}}</text>
			<text class="text-muted font mx-2">|</text>
			<text class="text-primary font">登录遇到问题</text>
		</view>
		<!-- 社区账号登录 -->
		<view class="pt-3 pb-5 flex justify-center align-center">
			<view class="bg-light" style="height: 1rpx; width: 100rpx;"></view>
			<view class="text-light-muted font mx-2">社区账号登录</view>
			<view class="bg-light" style="height: 1rpx; width: 100rpx;"></view>
		</view>
		<!-- 社区账号图标 -->
		<other-login back></other-login>
		<!-- 条款 -->
		<view class="font py-4 text-center">
			注册即代表同意<text class="text-primary">《社区协议》</text>
		</view>
	</view>
</template>

<script>
	import uniStatusBar from "@/components/uni-ui/uni-nav-bar/uni-status-bar.vue"
	import otherLogin from "@/components/common/other-login.vue"
	export default {
		components:{
			uniStatusBar,
			otherLogin
		},
		data() {
			return {
				login: false,
				status: false,
				username:"",
				userPassword:"",
				phone:'',
				code:'',
				codeTime: 0
			}
		},
		onLoad() {
			
		},
		computed:{
			disabled() {
				 if((this.username === '' || this.userPassword === '') && (this.phone === '' || this.code === '')) {
					return true
				}
				return false
			}
		},
		methods: {
			// 点击左上角关闭按钮返回上一层
			back() {
				uni.navigateBack({
					delta:1
				})
			},
			// 初始化表单
			initForm() {
				this.username = ''
				this.userPassword= ''
				this.phone = ''
				this.code= ''
			},
			// 表单验证
			validate() {
				// 手机号验证
				let mPattern = /^1[34578]\d{9}$/
				// 邮箱验证
				// let ePattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
				if(!mPattern.test(this.phone) && this.status) {
					uni.showToast({
						title:"手机号码格式不正确",
						icon:"none"
					})
					return false
				// } else if(!ePattern.test(this.phone) && !this.status) {
				// 	uni.showToast({
				// 		title:"账号、邮箱格式不正确",
				// 		icon:"none"
				// 	})
					// return false
				}
				return true
			},
			// 切换登录状态
			changeStatus() {
				this.initForm()
				this.status = !this.status
			},
			// 获取验证码
			getCode() {
				// 手机号验证
				if(!this.validate()) return
				// 获取验证码
				this.$H.post("/user/sendcode", {
					phone:this.phone
				}, {back: true})
				.then(res => {
					console.log(res)
					uni.showToast({
						title: res.data.msg,
						icon:"none"
					})
				})
				// 读秒时禁止操作
				if (this.codeTime > 0) return
				// 读秒计时
				this.codeTime = 5
				// 开启读秒
				setInterval(()=> {
					if(this.codeTime >= 0) {
						this.codeTime--
					}else {
						this.codeTime = 0
						clearInterval()
					}
				},1000)
			},
			// 点击登录
			submit() {		
				// 验证
				let url,data
				if (this.status) {
					// 手机号登录
					if(!this.validate()) return
					url = "/user/phonelogin"
					data = {
						phone: this.phone,
						code: this.code
					}
				} else {
					// 账号密码登录
					url = "/user/login"
					data = {
						username: this.username,
						password: this.userPassword
					}
				}
				// 发送登录请求
				this.login = true
				this.$H.post(url,data)
				.then(res => {
					this.login = false
					// 获取token 存储到vux
					this.$store.commit("login", res)
					uni.navigateBack({
						delta: 1
					})
					uni.showToast({
						title: '登录成功',
						icon:"none"
					})
				})
				.catch(err => {
					// 登录失败
					this.login = false
					console.log(err)
					
				})
			}
		}
	}
</script>

<style>

</style>
