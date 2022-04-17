<template>
	<view>
		<!-- 设置列表 -->
		<view class="p-2">
			<template v-if="loginStatus">
				<uni-list-item title="账号与安全" :border="false"link @click="open('user-safe')" showArrow></uni-list-item>
				<uni-list-item title="资料编辑" :border="false" @click="open('user-userInfo')" link showArrow></uni-list-item>
			</template>
			<uni-list-item title="清除缓存" :border="false" link showArrow @click="clearCache">
				<view slot="footer" class="text-muted">{{storageInfoSize | means}}</view>
			</uni-list-item>
			<uni-list-item v-if="loginStatus" title="意见反馈" :border="false" link showArrow  @click="open('user-feedback')"></uni-list-item>
			<uni-list-item title="关于社区" :border="false" link showArrow @click="open('about')"></uni-list-item>
		</view>
		<!-- 退出登录按钮 -->
		<view class="py-2 px-3" v-if="loginStatus">
			<button style="border-radius: 50rpx; border: 0; background-color:  #ff0000; color: #fff;" plain  @click="logout">退出登录</button>
		</view>
	</view>
</template>

<script>
	import uniListItem from "@/components/uni-ui/uni-list-item/uni-list-item.vue"
	import { mapState } from "vuex"
	export default {
		components:{
			uniListItem
		},
		data() {
			return {
				storageInfoSize:0
			}
		},
		onLoad() {
			this.getStorageInfo()
		},
		filters: {
			means(value) {
				return value>1024? (value/1024).toFixed(2) + 'MB' : value.toFixed(2) + "KB"
			}
		},
		computed: {
			...mapState({
				loginStatus: state => state.loginStatus
			})
		},
		methods: {
			// 退出登录
			logout() {
				uni.showModal({
					content: '是否退出登录',
					success: res => {
						 if (res.confirm) {
							 // 退出登陆
						  this.$store.commit("logout")
							// 关闭socket
							this.$store.dispatch("closeSocket")
							// 返回上一页
							uni.navigateBack({
								delta: 1
							})
							// 抛出提示
							uni.showToast({
								title: "退出登录成功",
								icon: "none"
							})
						} 
					}
				})
			},
			// 打开修改密码页面
			open(path) {
				uni.navigateTo({
					url:`../${path}/${path}`
				})
			},
			// 获取本地缓存
			getStorageInfo() {
				let res = uni.getStorageInfoSync()
				this.storageInfoSize = res.currentSize
			},
			// 清除缓存
			clearCache() {
				uni.showModal({
					title: '提示',
					content: '是否清除缓存',
					success: res => {
						if (res.confirm) {
							uni.clearStorageSync()
							this.getStorageInfo()
							uni.showToast({
								title: '清除缓存成功',
								icon: "none"
							})
						}
					}
				})
			}
		}
	}
</script>

<style>

</style>
