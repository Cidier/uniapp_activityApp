<template>
	<view>
		<!-- 时间 -->
		<view class="flex justify-center align-center py-2 font-sm text-secondary" v-if="shortTime">{{shortTime}}</view>
		<!-- 消息气泡 -->
		<view class="flex align-start px-2 my-2" :class="isSelf? 'flex-row-reverse':''">
			<image :src="item.avatar? item.avatar: '/static/1.jpg'" class="rounded-circle" style="width: 100rpx; height: 100rpx;"></image>
			<view class="bg-light rounded p-2 mx-2 mt-2" style="max-width: 400rpx;">
				{{item.data}}
			</view>
		</view>
	</view>
</template>

<script>
	import $T from "@/common/time.js"
	export default {
		props:{
			item:Object,
			index:[Number, String],
			preTime:[Number, String]
		},
		data() {
			return {
				
			}
		},
		onLoad() {

		},
		computed:{
			// 是否是登录用户本人
			isSelf() {
				let myId = this.$store.state.user.id
				return myId === this.item.user_id
			},
			// 转化时间
			shortTime() {
				return $T.getChatTime(this.item.create_time, this.preTime)
			}
		}
	}
	
</script>

<style>
</style>
