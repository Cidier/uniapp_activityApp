<template>
	<view>
		<common-list v-for="(item, index) in list" :key="index" :item="item" :index="index">
		</common-list>
	</view>
</template>

<script>
	import commonList from "@/components/common/common-list.vue"
	export default {
		components: {
			commonList
		},
		data() {
			return {
				list: []
			}
		},
		onLoad() {
			// 取出历史记录
			let list = uni.getStorageSync("history")
			list = list? this.list = JSON.parse(list) : [],
			// 监听全局关注和顶踩事件
				uni.$on("updateFollowOrDoSupport", (e) => {
					switch (e.type){
						case "follow":
						this.follow(e.data.user_id)
							break;
						case 'support': // 顶踩
						this.doSupport(e.data)
							break;	
						default:
							break;
					}
				})
			// 监听评论数变化
			uni.$on('updateCommentsCount',({id,count})=>{
				this.list.forEach(item => {
					if(item.id === id) {
						item.comment_count = count
					}
				})
			})
			
		},
		// 页面卸载
				onUnload() {
					// 关闭全局监听
					uni.$off("updateFollowOrDoSupport", (e)=> {})
					uni.$off("updateCommentsCount", (e)=> {})
				},
		methods: {
			// 点击关注
			follow(user_id) {
				// 找到所有列表
				this.list.forEach(item => {
					if (item.user_id === user_id) {
						item.isFollow = true
					}
				})
				uni.showToast({	title: "关注成功" })
			},
			// 顶踩操作
			doSupport(e) {
				this.list.forEach(item => {
					if(item.id == e.id) {
						if(e.type === "nonsupport" && item.support.type === "support") {
							item.support.support_count--
							item.support.nonsupport_count++
						} else if (item.support.type === "") {
							item[e.type + "_count"]++
						} else if(e.type === "support" && item.support.type === "nonsupport"){
							item.support.support_count++
							item.support.nonsupport_count--
						}
						item.support.type = e.type
					}
					
				})
				let msg = e.type === "support"? "顶" : "踩"	
			}
		}
	}
</script>

<style>

</style>
