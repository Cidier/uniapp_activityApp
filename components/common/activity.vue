<template>
	<view>
		<view class="p-2 animated fast fadeIn">
			<!-- 头像|昵称 关注 -->
			<view class="flex justify-between align-center">
				<view class="flex align-center">
					<!-- 头像 -->
					<!-- <image class="mr-2 rounded-circle" style="width: 65rpx; height: 65rpx;" lazy-load :src="item.userPic? item.userPic : '/static/demo/userpic/1.jpg'"  @click="openSpace(item.user_id)"></image> -->
					<!-- 昵称 | 日期-->
					<view class="flex flex-column">
						<view class="font" style="font-size: 10rpx;">{{ item.userName }}></view>
						<text class="font-sm text-light-muted" style=" line-height: 1.5em;">{{ item.newsDate | formatTime}}</text>
					</view>
				</view>
				<!-- 关注按钮 -->
				<!-- <view class="flex align-center justify-center rounded bg-main text-white animated faster" style="width: 90rpx; height: 50rpx;" hover-class="pulse" @click="follow()" v-if="!item.isFollow && item.user_id !== user.id">
					关注
				</view> -->
			</view>
			<!-- 标题 -->
			<view class="m-2 font-md" @click="openDetail()">{{ item.title }}</view>
			<!-- 帖子详情 -->
			<slot>
				<!-- 图片 -->
				<view @click="openDetail()" v-if="item.titlePic">
					<text>查看活动详情信息</text>
					<!-- <image :src="item.titlePic" class="w-100 rounded" style="height: 350rpx;" mode="widthFix"></image> -->
				</view>
			</slot>
			<!-- 图标按钮 -->
			<!-- <view class="flex align-center">
				<view class="flex-1 flex justify-center align-center animated faster" hover-class="pulse text-main" @click="doSupport('support')" :class="item.support.type === 'support'? 'supprot-active' : ''">
					<text class="iconfont icon-dianzan2 mr-2"></text>
					<text>{{ item.support.support_count > 0 ? item.support.support_count : '支持' }}</text>
				</view>
				<view class="flex-1 flex justify-center align-center animated faster" hover-class="pulse text-main" @click="doSupport('nonsupport')" :class="item.support.type === 'nonsupport'? 'supprot-active' : ''">
					<text class="iconfont icon-cai mr-2" ></text>
					<text>{{ item.support.nonsupport_count > 0 ? item.support.nonsupport_count : '踩' }}</text>
				</view>
				<view class="flex-1 flex justify-center align-center animated faster" hover-class="pulse text-main" @click="doComment()">
					<text class="iconfont icon-pinglun mr-2" s></text>
					<text>{{ item.comment_count > 0 ? item.comment_count : '评论'}}</text>
				</view>
				<view class="flex-1 flex justify-center align-center animated faster" hover-class="pulse text-main" @click="doShare()">
					<text class="iconfont icon-fenxiang mr-2" ></text>
					<text>{{  item.share_count > 0 ? item.share_count : '分享'}}</text>
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
	import { mapState } from "vuex"
	import $time from "@/common/time.js"
	export default {
		name:"activity",
		props: {
			item: Object,
			index: {
				type:Number,
				default:-1
			},
			isDetail: {
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				
			};
		},
		filters:{
			formatTime(val) {
				return $time.gettime(val)
			}
		},
		computed: {
			...mapState({
				user: state => state.user
			})
		},
		methods: {
			// 点击头像打开个人空间
			openSpace(user_id) {
				uni.navigateTo({
					url:"../../pages/user-space/user-space?user_id=" + user_id
				})
			},
			// 点击关注
			follow() {
				// 登录验证
				this.chackAuth(()=>{
					// 发送请求
					this.$H.post("/follow", {  
						follow_id: this.item.user_id
					}, {
						token: true
					}).then(res => {
						// 通知更新
						uni.$emit("updateFollowOrDoSupport", {
							type: "follow",
							data: {
								user_id: this.item.user_id
							}
						})
					})
					
				})
			},
			// 打开详情页
			openDetail() {
				if(this.isDetail) return
				uni.navigateTo({
					url:"../../pages/detail/detail?detail=" + JSON.stringify(this.item)
				})
				// 加入历史记录
				let list = uni.getStorageSync("history")
				list = list? JSON.parse(list) : []
				let index = list.findIndex(v => v.id === this.item.id)
				if(index !== -1) return
					list.unshift(this.item)
					uni.setStorageSync("history", JSON.stringify(list))
				
			}
			}
			}
</script>

<style>
.supprot-active {
	color: #FF4A6A;
}
</style>
