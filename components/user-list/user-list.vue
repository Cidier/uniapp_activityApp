<template>
	<view class="flex p-2 align-center border-bottom  border-light-secondary" hover-class="bg-light">
		<!-- 头像 -->
		<image :src="item.avatar? item.avatar : '/static/demo/userpic/1.jpg'" style="width: 100rpx; height: 100rpx;" class="rounded-circle mr-1"></image>
		<!-- 昵称 性别 -->
		<view class="flex flex-column flex-1">
			<text>{{item.nickName}}</text>
			<view class="text-white">
				<text class="iconfont  font-sm " style="padding: 5rpx; border-radius: 30rpx;":class="item.sex>0 ? 'icon-nv bg-main':'icon-nan bg-primary'"><text style="padding: 5rpx;" class="font-sm ">{{item.age}}</text></text>
			</view>
		</view>
		<!-- <view class="flex align-center">
			<text class="iconfont icon-xuanze-yixuan " :class="item.isFollow? 'text-secondary':'text-danger'"></text>
		</view> -->
	</view>
</template>

<script>
	export default {
		props:{
			item:Object,
			index:Number
		}
	}
</script>

<style>
</style>
