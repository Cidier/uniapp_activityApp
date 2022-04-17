<template>
	<view>
		<view class="flex align-center justify-center pt-4 pb-3 flex-column">
			<image src="/static/common/nothing.png" class="rounded-circle" style="width: 500rpx; height: 500rpx;"></image>
			<text class="text-muted mt-2">versions 1.0.0</text>
		</view>
		
		<!-- #ifdef APP-PLUS -->
		<uni-list-item title="新版本检测" showArrow :border="false" @click="update"></uni-list-item>
		<!-- #endif -->
		<uni-list-item title="社区用户协议" showArrow :border="false"></uni-list-item>
	</view>
</template>

<script>
	import uniListItem from "@/components/uni-ui/uni-list-item/uni-list-item.vue"
	export default {
		components:{
			uniListItem
		},
		data() {
			return {
				
			}
		},
		methods: {
			// 新版本检测
			update(showToast = true) {
				 this.$U.updata()
			}
		}
	}
</script>

<style>

</style>
