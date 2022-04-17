<template>
	<view class="px-2 pb-2" @click="open">
		<view class="flex align-center">
			<image :src="item.cover" style="width: 150rpx; height: 150rpx;" class="rounded mr-2"></image>
			<view class="flex-1 flex flex-column justify-between">
				<text class="font-md">#{{item.title}}#</text>
				<text class="text-light-muted">{{item.content}}</text>
				<view class="text-light-muted">
					<text>动态：{{item.news_count}}</text>
					<text>今日：{{item.today_count}}</text>
				</view>
			</view>
		</view>
	</view>
</template>
["item", "index"],
<script>
	export default {
		props: {
			item:Object,
			index: Number,
			choose: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			open(){
				if(this.choose) {
					uni.$emit("chooseTopic", {
						id: this.item.id,
						title: this.item.title
					})
					return uni.navigateBack({
						delta: 1
					})
				}
				uni.navigateTo({
					url: "../../pages/topic-detail/topic-detail?info=" + JSON.stringify(this.item)
				})
			}
		}
	}
	
</script>

<style>
</style>
