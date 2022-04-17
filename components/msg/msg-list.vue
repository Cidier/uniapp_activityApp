<template>
		<view class="flex p-2 border-bottom border-light-secondary animated fast fadeIn" @click="open">
			<image :src="item.avatar? item.avatar : '/static/1.jpg'" style="width: 80rpx; height: 80rpx;" class="rounded-circle mr-2"></image>
			<view class="flex-1 flex flex-column">
				<view class="flex justify-between align-center ">
					<text class="font-md">{{item.username}}</text>
					<text class="font-sm text-secondary">{{item.update_time | formatTime}}</text>
				</view>
				<view class="flex justify-between align-center">
					<text class="font-sm text-secondary text-ellipsis" style="width: 500rpx;">{{item.data}}</text>
					<!-- 角标 -->
					<uni-badge :text="item.noread" type="error"></uni-badge>
				</view>
			</view>
		</view>
</template>

<script>
	import uniBadge from "@/components/uni-ui/uni-badge/uni-badge.vue"
	import $T from "@/common/time.js"
	export default {
		components:{uniBadge},
		filters: {
			formatTime(value) {
				return $T.gettime(value)
			}
		},
		props: {
			item:Object,
			index:Number
		},
		data() {
			return {
				
			}
		},
		methods: {
			// 打开对话页面
			open() {
				let user = {
					user_id: this.item.user_id,
					username: this.item.username,
					userpic: this.item.avatar
				}
				uni.navigateTo({
					url:"../../pages/user-chat/user-chat?user=" + JSON.stringify(user),
					success: () => {
						// 清除未读数，更新底部导航消息数显示
						this.$store.dispatch("readChatMessage", this.item)
					}
				})
			}
		}
	}
</script>

<style>

</style>
