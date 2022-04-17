<template>
	<view class="border-bottom">
		<!-- 热门 -->
			<view class="flex justify-between align-center px-2">
				<view class="font-md">热门分类</view>
				<view class="flex align-center text-light-muted animated" hover-class="jello" @click="openMore">
					更多<text class="iconfont icon-jinru"></text>
				</view>
			</view>
			<view class="flex p-2">
				<view class="px-1 mx-2 rounded align-center border animated flex-shrink" v-for="(item, index)
				 in fenlei" :key="index" hover-class="jello" @click="goHotCate(index)">
				 {{item.name}}</view>
			</view>
			
	</view>
</template>

<script>
	export default {
		data(){
			return{
				fenlei:[
					{
							"name":"棋盘"
					},
					{
						"name":"唱歌"
					},
					{
						"name":"跳舞"
					},
					{
						"name":"书法"
					},
					{
						"name":"其他"
					}
				]
			}
		},
		props: {
			hotCate: {
				type:Array,
				default: []
			}
		},
		methods: {
			// 点击打开更多
			openMore() {
				this.$emit("openMore")
			},
			
			//  热门分类点击事件
			goHotCate(e) {
				uni.navigateTo({
					url: '../../pages/topicCate/topicCate'
				})
			}
		}
	}
</script>

<style>
</style>
