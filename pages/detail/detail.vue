<template>
	<view>
		<!-- 详情 -->
		<common-list :item="info" isDetail @follow="follow" @doSupport="doSupport">
			<view>{{info.content}}</view>
			<view>
				<image v-for="(item, index) in images" :key="index" :src="item.url" mode="widthFix" class="w-100" @click="preview(index)"></image>
			</view>
		</common-list>
		<!-- 评论 -->
		<divider></divider>
		<view class="p-2 font-md font-weight-bold">最新评论  {{comments.length}}</view>
		<!-- <view class="p-2 flex">
			<image src="/static/demo/userpic/12.jpg" style="width: 95rpx; height: 95rpx;" class="rounded-circle mr-2"></image>
			<view class="flex flex-column flex-1">
				<text>昵称</text>
				<text>内容</text>
				<view class="font-sm text-light-black flex align-center justify-between">
					<text>下午 2:30</text>
					<text>回复5</text>
				</view>
			</view>
		</view> -->
		<view class="px-2">
			<view class="uni-comment-list" 
			v-for="(item,index) in comments"
			:key="index">
				<view v-if="item.fid" style="width: 60rpx;"></view>
				<view class="flex w-100"
				:class="item.fid ? 'bg-light rounded p-2' : ''">
					<view class="uni-comment-face"><image :src="item.userpic"></image></view>
					<view class="uni-comment-body">
						<view class="uni-comment-top">
							<text>{{item.username}}</text>
						</view>
						<view class="uni-comment-content"
						@click="reply(item.id)">{{item.data}}</view>
						<view class="uni-comment-date">
							<view>{{item.time}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部输入栏 -->
		<!-- 占位 -->
		<view style="height: 100rpx;"></view>
		<bottom-input @submit="submit" :focus="focus" @blur="blur"></bottom-input>
		<!-- 分享弹出层 -->
		<more-share ref="share"></more-share>
	</view>
</template>

<script>
	import commonList from "@/components/common/common-list.vue"
	import divider from "@/components/common/divider.vue"
	import bottomInput from "@/components/common/bottom-input.vue"
	import moreShare from "@/components/common/more-share.vue"
	import $T from "@/common/time.js"
	export default {
		components:{
			commonList,
			divider,
			bottomInput,
			moreShare
		},
		data() {
			return {
				info:{
					id: 0,
					userName: "",
					userPic: "",
					newsDate: 0,
					title: "",
					titlePic: "",
					isFollow: false,
					support: {
						type: "support",
						support_count: 0,
						nonsupport_count: 0,
					},
					comment_count: 0,
					share_count: 0,
					content: "",
					
				},
				images: [],
				comments:[],
				focus:false,
				reply_id:0
			}
		},
		onLoad(e) {
			this.initTitle(JSON.parse(e.detail))
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
			// 获取评论
			this.getComments()
		},
		// 页面卸载
		onUnload() {
			// 关闭全局监听
			uni.$off("updateFollowOrDoSupport", (e)=> {})
		},
		
		onNavigationBarButtonTap() {
			// 点击右上角分享
			this.$refs.share.open({
				title: this.info.title,
				shareText: this.info.title,
				href:"https://baidu.com",
				image: this.images[0].url
			})
		},
		// #ifndef APP-PLUS
		onShareAppMessage(res) {
			return {
				title:this.info.title,
				path: "baidu.com"
			}
		},
		// #endif
		onBackPress() {
			this.$refs.share.close()
		},
		computed:{
			imageList() {
				return this.images.map(item => item.url)
			}
		},
		methods: {
			// 获取评论列表
			getComments() {
				console.log(this.info.id)
				this.$H.get('/post/'+this.info.id+'/comment')
				.then(res=>{
					this.comments = this.__ArrSort(res.list)
					this.info.comment_count = this.comments.length
					uni.$emit('updateCommentsCount',{
						id:this.info.id,
						count:this.info.comment_count
					})
				})
				.catch(err => {
					console.log(err)
				})
			},
			// 重新整理评论格式
			__ArrSort(arr,id = 0){
				var temp = [],lev=0;
				var forFn = function(arr, id,lev){
					for (var i = 0; i < arr.length; i++) {
						var item = arr[i]
						if (item.fid==id) {
							item.lev=lev
							temp.push({
								id:item.id,
								fid:item.fid,
								userid:item.user.id,
								userpic:item.user.userpic,
								username:item.user.username,
								time:$T.gettime(item.create_time),
								data:item.data,
							})
							forFn(arr,item.id,lev+1)
						}
					}
				}
				forFn(arr, id,lev)
				return temp
			},
			// 回复评论
			reply(id){
				console.log(1)
				this.reply_id = id
				this.focus = true
			},
			// 输入框失去焦点
			blur(){
				// this.reply_id = 0
				this.focus = false
			},
			// 发布评论
			submit(data) {
				if(data === "") {
					return uni.showToast({
						title: "评论不能为空",
						icon: "none"
					})
				}
				uni.showLoading({
					title: '评论发布中...',
					mask: false
				})
				// 发送请求
				this.$H.post("/post/comment", {
					fid: this.reply_id,
					data: data,
					post_id: this.info.id
				}, { token: true })
				.then(res => {
					uni.hideLoading()
					console.log(res)
					this.getComments()
				})
				.catch(err => {
					uni.hideLoading()
					console.log(err)
				})
			},
			// 初始化标题
			  initTitle(data) {
				uni.setNavigationBarTitle({
					title: data.title
				});
				// 获取文章详情
				this.info = data
				this.$H.get("/post/" + this.info.id)
				.then(res => {
					this.info.content = res.detail.content
					this.images = res.detail.images
				})
			},
			// 关注
			follow() {
				// 找到所有列表
				this.info.forEach(item => {
					if (item.user_id === user_id) {
						item.isFollow = true
					}
				})
				uni.showToast({	title: "关注成功" })
			},
			// 顶踩操作
			doSupport(e) {
				let current = this.info.support
				if (e.type === current.type) {
					return uni.showToast({
						title:"已经操作过了哦~",
						icon: "none"
					})
				}
				let msg = e.type === "support"? "顶" : "踩"
				if(e.type === "nonsupport" && current.type === "support") {
					current.support_count--
					current.nonsupport_count++
				} else if (current.type === "") {
					current[e.type + "_count"]++
				} else if(e.type === "support" && current.type === "nonsupport"){
					current.support_count++
					current.nonsupport_count--
				}
				current.type = e.type
				uni.showToast({
					title:msg
				})
				
			},
			// 详情图片预览
			preview(index) {
				uni.previewImage({
					urls: this.imageList,
					current:index
				})
			}
		}
	}
</script>

<style>

</style>
