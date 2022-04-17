<template>
	<view>
		<!-- 聊天列表 -->
		<scroll-view scroll-y="true" style="position: absolute; left: 0; right: 0; bottom: 100rpx; top: 0;" :scroll-into-view="scrollInto" scroll-with-animation>
			<!-- 左边 -->
			<block v-for="(item, index) in userChatList" :key="index">
				<view :id="'chat'+ index">
					<userChat :item="item" :index="index" :preTime="index > 0 ? userChatList[index - 1].create_time : 0"></userChat>
				</view>
			</block>
			
			<!-- 右边 -->
			<!-- <view class="flex align-start px-2 my-2 flex-row-reverse">
				<image src="/static/demo/demo66.jpg" class="rounded-circle" style="width: 100rpx; height: 100rpx;"></image>
				<view class="bg-light rounded p-2 mx-2 mt-2" style="max-width: 400rpx;">
					你好啊
				</view>
			</view> -->
		</scroll-view>
		
		<!-- 底部发送栏 -->
		<bottomInput @submit="submit"></bottomInput>
		<!-- <view class="flex align-center fixed-bottom bg-white" style="height: 100rpx;">
				<input type="text" v-model="content" placeholder="文明发言" class="bg-light p-1 flex-1 ml-2 rounded" @confirm="submit"/>
				<view class="flex iconfont icon-fabu font-lg justify-center align-center animated " style="width:100rpx ;" hover-class="jello text-main" @click="submit"></view>
		</view> -->
	</view>
</template>

<script>
	import userChat from '@/components/user-chat/user-chat.vue'
	import bottomInput from '@/components/common/bottom-input.vue'
	export default {
		components:{
			userChat,
			bottomInput
		},
		data() {
			return {
				scrollInto:'',
				userChatList:[]
			}
		},
		onLoad(e) {
			if (!e.user) {
				// 返回上一页
				uni.navigateBack({
					delta: 1
				})
				return uni.showToast({
					title: '聊天对象不存在',
					icon: "none"
				})
			}
			let ToUser = JSON.parse(e.user)
			// 创建聊天对象
			this.$store.commit("createToUser", ToUser)
			// 获取当前聊天对象的聊天记录
			this.$store.dispatch("getChatDetailToUser")
			.then(list => {
				console.log("获取当前聊天对象的聊天记录",list)
				this.userChatList = list
			})
			// 开启监听接收聊天信息
			uni.$on("UserChat", res => {
				console.log("userChat,接收聊天信息", res)
				if(res.from_id === ToUser.user_id) {
					this.renderPage({
						data: res,
						send:false
					})
				}
			})
		},
		onReady() {
			this.scrollToBottom()
		},
		// 页面销毁前
		beforeDestroy() {
			// 关闭聊天对象
			this.$store.commit("closeToUser")
			// 移除监听聊天接收事件
			this.$off("UserChat", () => {})
		},
		methods: {
			// 渲染到页面
			renderPage(e) {
				this.$store.dispatch("formatChatDetailObject",e)
				.then(msg => {
					this.userChatList.push(msg)
					// 滚动到底部
					this.scrollToBottom()
				})
			},
			// 发送消息
			async submit(data) {
				// 组织发送消息的格式
				let result = await this.$store.dispatch("sendChatMessage", {
					data,
					type: "text"
				})
				console.log("聊天页面result",result)
				// let obj = {
				// 		user_id:1,
				// 		avatar:"/static/demo/demo66.jpg",
				// 		username:"昵称",
				// 		data:data,
				// 		type:"text",
				// 		create_time:(new Date()).getTime()
				// 	}
					
					// this.userChatList.push(result)
					// 请求发送接口
					this.$H.post("/chat/send", result, {
						token: true
					}).then(res => {
						this.renderPage({
							data: result,
							send: true
						})
					}).catch(err=> {
						console.log("发送消息失败")
					})
			},
			// 滚动到底部
			scrollToBottom() {
				let lastIndex = this.userChatList.length - 1
				if (lastIndex < 0) return
					this.scrollInto = 'chat' + lastIndex
			}
		}
	}
</script>

<style>

</style>
