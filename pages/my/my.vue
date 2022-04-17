<template>
	<view>
		<!-- 未登录 -->
		<template v-if="!loginStatus">
			<view class="flex justify-center align-center">登录社区体验更多功能~</view>
			<other-login></other-login>
			<view class="flex justify-center align-center text-muted" @click="openLogin">手机/邮箱/账号密码登录 <text class="iconfont icon-jinru ml-2"></text></view>
		</template>
		<!-- 以登录 -->
		<!-- 头部昵称 -->
		<view v-else class="flex align-center justify-center p-2">
			<image :src="cover" style="height: 100rpx; width: 100rpx;" class="rounded-circle"></image>
			<view class="flex flex-column justify-between flex-1 px-2">
				<view class="font-weight-bold text-dark font-md">{{user.username}}</view>
				<view class="font-sm text-muted">总帖子 {{ this.myList[0].num }} 今日发帖 {{ this.myList[1].num }}</view>
			</view>
			<text class="iconfont icon-jinru font-md"></text>
		</view>

		<!-- 帖子，动态,评论 -->
		<view class="flex justify-center align-center px-3 py-2">
			<view class="flex-1 flex flex-column justify-center align-center" v-for="(item, index) in myList" :key="index">
				<text class="font-weight-bold text-dark font-md">{{item.num}}</text>
				<text class="text-muted">{{item.name}}</text>
			</view>
		</view>
		<!-- ad 图片 -->
	
		<!-- 列表组件 -->
		<uni-list-item title="浏览历史" :border="false" showExtraIcon showArrow link @click="openHistory">
			<text slot="icon" class="iconfont icon-liulan"></text>
		</uni-list-item>
		<uni-list-item title="社区认证" :border="false" showExtraIcon showArrow link>
			<text slot="icon" class="iconfont icon-huiyuanvip"></text>
		</uni-list-item>
		<uni-list-item title="审核帖子" :border="false" showExtraIcon showArrow link>
			<text slot="icon" class="iconfont icon-keyboard"></text>
		</uni-list-item>
		<!-- #ifndef APP-PLUS -->
		<uni-list-item title="我的设置" :border="false" showExtraIcon showArrow link @click="openSet">
			<text slot="icon" class="iconfont icon-keyboard"></text>
		</uni-list-item>
		<!-- #endif -->
	</view>
</template>

<script>
	import uniListItem from "@/components/uni-ui/uni-list-item/uni-list-item.vue"
	import otherLogin from "../../components/common/other-login.vue"
	import { mapState } from "vuex"
	import $T from '@/common/time.js'
	export default {
		components:{
			uniListItem,
			otherLogin
		},
		data() {
			return {
				myList:[{
					name: "帖子",
					num:1
				},{
					name: "动态",
					num:2
				},{
					name: "评论",
					num:4
				},{
					name: "回复",
					num:0
				}]
			}
		},
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url:"../user-set/user-set"
			})
		},
		onShow() {
			if(this.loginStatus) {
				this.getCounts()
			}
		},
		watch: {
			loginStatus(newValue, oldValue) {
				if(newValue){
					this.getCounts()
				} else {
					this.myList.forEach(item=>{
						item.num = 0
					})
				}
			}
				},
		methods: {
			// #ifndef APP-PLUS
			openSet() {
				uni.navigateTo({
					url:"../user-set/user-set"
				})
			},
			// #endif
			// 获取用户数据相关
			getCounts() {
				this.$H.get("/user/getcounts/" + this.user.id, {}, { token: true, nothing: true })
				.then(res => {
					this.myList[0].num = res.post_count || 0
					this.myList[1].num = res.today_posts_count || 0
					this.myList[2].num = res.comments_count || 0
					this.myList[3].num = res.withfen_count || 0
				})
			},
			// 打开登录页
			openLogin() {
				uni.navigateTo({
					url: "../login/login"
				})
			},
			// 打开浏览历史
			openHistory() {
				console.log("浏览历史")
				uni.navigateTo({
					url: "../history/history"
				})
			}
		},
		computed: {
			...mapState({
				loginStatus: state => state.loginStatus,
				user: state => state.user
			}),
			cover() {
				return this.user.userpic? this.user.userpic : "/static/demo/userpic/12.jpg"
			}
		}
	}
</script>

<style>

</style>
