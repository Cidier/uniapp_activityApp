<template>
	<view>
			<view class="position-relative">
				<image :src="topicInfo.cover" class="indistinct w-100 " style=" height: 300rpx;" mode="aspectFill"></image>
			</view>
			<view class="px-2 bg-white position-relative" style="z-index: 10;">
				<view>
					<image :src="topicInfo.cover" style="width: 150rpx; height: 150rpx; margin-top: -150rpx;"class="mr-2 rounded"></image>
					<text class="font-md">#{{topicInfo.title}}#</text>
				</view>
				<view class="flex align-center my-2">
					<text class="text-light-muted">动态 {{topicInfo.news_count}}</text>
					<text class="text-light-muted ml-2">今日 {{topicInfo.today_count}}</text>
				</view>
				<view class="flex align-center my-2 font-md text-light-muted">{{topicInfo.content}}</view>
			</view>
	</view>
</template>

<script>
	export default {
		props: {
			topicInfo: {
				type: Object
			}
		}
	}
</script>

<style>
</style>
