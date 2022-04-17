<template>
	<view>
		<!-- #ifdef APP-PLUS -->
		<view class="py-2 px-5 flex align-center ">
			<view class="flex-1 flex justify-center align-center " v-for="(item,index) in providerList" :key="index" @click="login(item)">
				<view class="rounded-circle iconfont flex  justify-center align-center text-white font-lg" :class="item.bgColor+' '+item.icon" style="width: 100rpx; height: 100rpx;"></view>
			</view>
			
		</view>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<button type="primary" open-type="getUserInfo" @getuserinfo="mpGetUserInfo">微信登录</button>
		<!-- #endif -->
	</view>
	

</template>

<script>
	export default {
		props: {
					back: {
						type: Boolean,
						default: false
					},
				},
		data() {
			return {
				providerList: []
			}
		},
		mounted() {
			this.$nextTick(() => {
				uni.getProvider({
					service: 'oauth',
					success: (e) => {
						console.log('success', e);
						let data = []
						for (let i = 0; i < e.provider.length; i++) {
							switch (e.provider[i]) {
								case 'weixin':
									data.push({
										name: '微信好友',
										id: 'weixin',
										sort:0,
										icon:"icon-weixin",
										bgColor:"bg-success"
									})
									break;
								case 'sinaweibo':
									data.push({
										name: '新浪微博',
										id: 'sinaweibo',
										sort:2,
										icon:"icon-xinlangweibo",
										bgColor:"bg-danger"
									})
									break;
								case 'qq':
									data.push({
										name: 'QQ好友',
										id: 'qq',
										sort:3,
										icon:"icon-QQ",
										bgColor:"bg-primary"
									})
									break;
								default:
									break;
							}
						}
						this.providerList = data.sort((x,y) => {
							return x.sort - y.sort
						});
					},
					fail: (e) => {
						console.log('获取登录授权失败', e);
						uni.showModal({
							content:'获取登录授权失败',
							showCancel:false
						})
					}
				});
				
			})
		},
		methods: {
			// #ifdef MP-WEIXIN
			mpGetUserInfo(result) {
				uni.showLoading({ title: '登录中...', mask: true });
				// 获取失败
				if (result.detail.errMsg !== 'getUserInfo:ok') {
					uni.hideLoading();
					uni.showModal({
						title: '获取用户信息失败',
						content: '错误原因' + result.detail.errMsg,
						showCancel: false
					});
					return;
				}
				let userinfo = result.detail.userInfo;
				uni.login({
					provider:"weixin",
					success: (res) => {
						this.MpLogin({
							url:"/wxlogin",
							code:res.code,
							nickName:userinfo.nickName,
							avatarUrl:userinfo.avatarUrl
						})
					},
					complete: () => {
						uni.hideLoading();
					}
				})
			},
			// #endif
			MpLogin(options){
				this.$H.post(options.url,{
					code:options.code,
					nickName:options.nickName,
					avatarUrl:options.avatarUrl
				}).then(data=>{
					if(Array.isArray(data) && data.length == 0){
						uni.showToast({
							title: '登录失败，请检查后端的微信小程序登录配置',
							icon: 'none'
						});
						return 
					}
					// 修改vuex的state,持久化存储
					this.$store.commit('login',this.$U.formatUserinfo(data))
					// 返回上一页
					if(this.back){
						uni.navigateBack({
							delta: 1
						});
					}
					uni.showToast({
						title: '登录成功',
						icon: 'none'
					})
				})
			},
			// 第三方登录
			login (e) {
				uni.login({
					 provider: e.id,
						success: (loginRes) => {
							console.log(loginRes)
							 // 获取用户信息
							uni.getUserInfo({
								provider: e.id,
								success:(infoRes) => {
									console.log(infoRes)
									let obj = {
										provider:e.id,
										openid:infoRes.userInfo.openId,
										expires_in:0,
										nickName:infoRes.userInfo.nickName,
										avatarUrl:infoRes.userInfo.avatarUrl,
									}
									// #ifdef APP-PLUS
									this.loginEvent(obj)
									// #endif
								}
							})
						}
				})
			},
			// 登录逻辑
			loginEvent(data){
				this.$H.post('/user/otherlogin',data)
				.then(res=>{
					// 修改vuex的state,持久化存储
					this.$store.commit('login',this.$U.formatUserinfo(res))
					// 返回上一页
					if(this.back){
						uni.navigateBack({
							delta: 1
						});
					}
					uni.showToast({
						title: '登录成功',
						icon: 'none'
					});
					uni.hideLoading()
				}).catch(()=>{
					 uni.hideLoading()
				 })
			}
		}
	}
</script>

<style>
</style>
