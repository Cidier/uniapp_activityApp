<template>
	<view>
		<uni-list-item :title="item.name" :border="false" link  v-for="(item, index) in list" :key="index" @click="handleEvent(item)">
			<view slot="footer" class="text-right text-light-muted font">
				{{item.data}}
			</view>
		</uni-list-item>
	</view>
</template>

<script>
	import uniListItem from "@/components/uni-ui/uni-list-item/uni-list-item.vue"
	import { mapState } from "vuex"
	export default {
		components: {
			uniListItem
		},
		data() {
			return {
				list: []
			}
		},
		computed: {
			...mapState({
				user: state => state.user
			})
		},
		onShow() {
			this.__init()
		},
		methods: {
			// 初始化页面
			__init() {
				let list = [
						{
							name: "手机号",
							data: this.user.phone ? this.user.phone : "未绑定",
							type: "navigateTo",
							url: "/pages/user-phone/user-phone"
						},{
							name: "登录密码",
							data: this.user.password ? "修改密码" : "未设置",
							type: "navigateTo",
							url: "/pages/user-password/user-password"
						},{
							name: "邮箱绑定",
							data: this.user.email ? this.user.email : "未绑定",
							type: "navigateTo",
							url: "/pages/user-email/user-email"
						}
					]
					this.list = [...list]
					
					// 发送请求，判断是否绑定了第三方账号
					this.$H.get("/user/getuserbind", {}, {
						token: true
					}).then(res => {
						// 修改vux user 信息
						this.$store.commit("editUserInfo", { 
							key: "user_bind",
							value: res
						})
						// 渲染模板
						let other = [{
								name: "微信账号绑定",
								data: this.user.user_bind.weixin ? this.user.user_bind.weixin.nickname : "未绑定",
								type: "bind",
								provider: "weixin"
							},{
								name: "新浪微博账号绑定",
								data: this.user.user_bind.sinaweibo ? this.user.user_bind.sinaweibo.nickname : "未绑定",
								type: "bind",
								provider: "sinaweibo"
							},{
								name: "QQ账号绑定",
								data: this.user.user_bind.qq ? this.user.user_bind.qq.nickname : "未绑定",
								type: "bind",
								provider: "qq"
							}]
						this.list = [...this.list, ...other]
					})
			},
			// 跳转事件
			handleEvent(item) {
				if (item.type === "") {
					return
				}
				switch (item.type){
					case "navigateTo":
						uni.navigateTo({
							url: item.url
						})
						break;
					case "bind":
					if (item.data !== "未绑定") return
					this.bind(item.provider)
						break;
					default:
						break;
				}
			},
			// 绑定第三方登录
			bind(provider) {
				// 登录
				uni.login({
					 provider: provider,
						success: (loginRes) => {
							console.log(loginRes)
							 // 获取用户信息
							uni.getUserInfo({
								provider: provider,
								success:(infoRes) => {
									console.log(infoRes)
									let obj = {
										provider: provider,
										openid: infoRes.userInfo.openId,
										nickName: infoRes.userInfo.nickName,
										avatarUrl: infoRes.userInfo.avatarUrl,
									}
									// 发送请求绑定第三方登录
									this.$H.post("/user/bindother", obj, { 
										token: true,
										back: true
									}).then(res => {
										console.log(res)
										// 失败 弹出消息
										if (res.data.errorCode) {
											return uni.showToast({
												title: res.data.msg,
												icon: "none"
											})
										}
										// 成功 初始化页面
										this.__init()
										uni.showToast({
											title: "绑定成功",
											icon: "none"
										})
									})
								}
							})
						}
				})
			}
		}
	}
</script>

<style>

</style>
