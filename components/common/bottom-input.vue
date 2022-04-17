<template>
	<view class="flex align-center fixed-bottom bg-white" style="height: 100rpx;">
			<input type="text" v-model="content" placeholder="文明发言" class="bg-light p-1 flex-1 ml-2 rounded" :focus="focus" @confirm="submit" @blur="$emit('blur') "/>
			<view class="flex iconfont icon-fabu font-lg justify-center align-center animated " style="width:100rpx ;" hover-class="jello text-main" @click="submit"></view>
	</view>
</template>

<script>
	export default {
		props: {
				focus: {
					type: Boolean,
					default: false
				},
			},
		data () {
			return {
				content:""
			}
		},
		methods: {
			submit() {
				// 判断是否为空
				if(this.content === '') {
					return uni.showToast({
						title:"消息不能为空哦~",
						icon:'none'
					})
				}
				this.$emit("submit", this.content)
				// 清空输入框
				this.content = ""
				
			}
		}
	}
</script>

<style>
</style>
