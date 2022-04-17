<template>
	<view>
		<!-- 自定义导航 -->
		<!-- #ifndef APP-PLUS -->
		<view style="height: 88rpx;z-index: 9999;"
		class="flex align-center px-2 position-fixed left-0 top-0 right-0 bg-white">
			<view class="iconfont icon-sousuo position-absolute text-muted" 
			style="left: 30rpx;"></view>
			<input class="flex-1 rounded bg-light" style="padding: 5rpx 0 5rpx 50rpx;" type="text" v-model="searchText" @confirm="search"
			:placeholder="placeholder" 
			placeholder-style="color: #CCCCCC; text-align: center;"/>
			<text class="pl-2" @click="goBack">取消</text>
		</view>
		<view style="height: 88rpx;"></view>
		<!-- #endif -->
		<template v-if="searchList.length === 0">
			<view class="px-2 font-md">搜索历史</view>
			<view class="flex flex-wrap">
				<view class="px-2 border mx-2 my-1 rounded font" v-for="(item, index) in historyList"  hover-class="bg-hover-light" :key="index" @click="clickHistorySearch(item)">{{item}}</view>
			</view>
		</template>
		
		<template v-else>
			<block v-for="(item, index) in searchList" :key="index">
				<!-- 帖子 -->
				<template v-if="searchType === 'post'">
					<commonList :item="item" :index="index"></commonList>
				</template>
				<!-- 话题 -->
				<template v-else-if="searchType === 'topic'">
					<topic-list :item="item" :index="index"></topic-list>
				</template>
				<!-- 用户 -->
				<template v-else>
					<user-list :item="item" :index="index"></user-list>
				</template>
			</block>
			<!-- 上拉加载 -->
			<loadmore :loadmore="loadmore"></loadmore>
		</template>
	</view>
</template>

<script>
	import commonList from "@/components/common/common-list.vue"
	import topicList from "@/components/news/topic-list.vue"
	import userList from "@/components/user-list/user-list.vue"
	import loadmore from "@/components/common/loadmore.vue"
	// 重置数组函数
	function toFrist (arr, index) {
		if(index !==0) {
			arr.unshift(arr.splice(index, 1)[0])
		}
		return arr
	}
	export default {
		components: { 
			commonList,
			topicList,
			userList,
			loadmore
		},
		data() {
			return {
				searchText: "",
				searchList:[],
				// 搜索类型
				searchType:"post",
				page:1,
				loadmore:"上拉加载更多",
				historyList:[]
			}
		},
		// 监听下拉刷新事件
		onPullDownRefresh() {
			if(this.searchText === "") {
				return uni.stopPullDownRefresh()
			}
			this.getData(true, ()=> {
				// 关闭下拉刷新状态
				uni.stopPullDownRefresh()
			})
		},
		// 监听上拉刷新
		onReachBottom() {
			if(this.loadmore !== "上拉加载更多") {
				return 
			}
			this.loadmore = "加载中"
			this.getData(false)
		},
		// 监听导航栏 输入框输入事件
		onNavigationBarSearchInputChanged(e) {
			this.searchText = e.text
		},
		// 监听原生标题栏搜索输入框搜索事件，用户点击软键盘上的“搜索”按钮时触发。
		onNavigationBarSearchInputConfirmed() {
			// 关闭软键盘
			uni.hideKeyboard()
			// 发起请求搜索数据
			this.search()
		},
		// 监听导航栏 搜索按钮点击事件
		onNavigationBarButtonTap(e) {
			if (e.index === 0) {
				// 关闭软键盘
				uni.hideKeyboard()
				// 发起请求搜索数据
				this.search()
			}
		},
		onLoad(e) {
			if(e.type) {
				this.searchType = e.type
			}
			let pageTitle = "帖子"
			switch (this.searchType){
				case "psot":
				pageTitle = "帖子"
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
					break;
				case "topic":
				pageTitle = "话题"
					break;
				case "user":
				pageTitle = "用户"
					break;
			}
			// #ifdef APP-PLUS
			// 修改占位符
			    let currentWebview = this.$scope.$getAppWebview()
					let tn = currentWebview.getStyle().titleNView
					tn.searchInput.placeholder = "搜索" + pageTitle
					currentWebview.setStyle({
						titleNView: tn
					})
			// #endif		
			// 获取本地搜索历史
			let list = uni.getStorageSync("historySearchWords")
			if(list) {
				this.historyList = JSON.parse(list)
			}
			
		},
		// 页面卸载
		onUnload() {
			// 关闭全局监听
			uni.$off("updateFollowOrDoSupport", (e)=> {})
		},
		// 监听点击导航栏搜索框
		// onNavigationBarSearchInputClicked() {
		// 	if(this.searchType === "post") {
		// 		uni.navigateTo({ url: "../search/search?type=post" })
		// 	}
		// },
		computed: {
			placeholder() {
				let type = "帖子"
				switch (this.searchType){
					case "post":
					type = "帖子"
						break;
					case "topic":
					type = "话题"
						break;
					case "user":
					type = "用户"
						break;
					default:
						break;
				}
				return "搜索" + type
			}
		},
		methods: {
			// #ifndef APP-PLUS
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			
			// #endif
			// 顶踩操作
			doSupport(e) {
				let list = this.searchList
				console.log(list)
				list.forEach(item => {
					if(item.id == e.id) {
						if(e.type === "nonsupport" && item.support.type === "support") {
							console.log("cai")
							item.support.support_count--
							item.support.nonsupport_count++
						} else if (item.support.type === "") {
							item[e.type + "_count"]++
						} else if(e.type === "support" && item.support.type === "nonsupport"){
							console.log("ding")
							item.support.support_count++
							item.support.nonsupport_count--
						}
						item.support.type = e.type
					}
					
				})
				let msg = e.type === "support"? "顶" : "踩"
			
				uni.showToast({
					title:msg
				})
				
			},
			// 点击关注
			follow(user_id) {
				// 找到所有列表
				this.searchList.forEach(item => {
					if (item.user_id === user_id) {
						item.isFollow = true
					}
				})
				uni.showToast({	title: "关注成功" })
			},
			// 点击搜索历史搜索
			clickHistorySearch(text) {
				this.searchText = text
				this.search()
			},
			// 搜索事件
			search() {
				// 加载中
				uni.showLoading({
					mask:false,
					title:"加载中"
				})
				// 加入历史记录
				let index = this.historyList.findIndex(v=> {
					return v === this.searchText
				})
				if (index !== -1) {
					toFrist(this.historyList, index)
				} else {
					this.historyList.unshift(this.searchText)
				}
				// 缓存搜索历史到本地
				uni.setStorageSync("historySearchWords", JSON.stringify(this.historyList))
				// 请求数据
				this.getData()
			},
			// 获取数据
			getData(isrefresh = true, callback = false) {
				this.page = isrefresh? 1 : (this.page + 1)
				this.$H.post("/search/" + this.searchType, { 
					keyword: this.searchText,
					page: this.page
				}).then(res => {
					// 整理数据格式
					let list = []
					switch(this.searchType){
						case "post":
						list = res.list.map(v => {
							return this.$H.formatCommonList(v)
							})
							break;
						case "topic":
						list = res.list.map(v => {
							return {
											id: v.id,
											cover: v.titlepic,
											title: v.title,
											content: v.desc,
											news_count: v.post_count,
											today_count: v.todaypost_count,
										}
						})
							break;
						case "user":
						 list = res.list.map(v=> {
							return {
								id: v.id,
								avatar:v.userpic,
								nickName:v.username,
								sex: v.userinfo.sex,
								age: v.userinfo.age,
							}
						})
							break;
					}
					
					// 渲染模板
					this.searchList = isrefresh? [...list] : [...this.searchList, ...list]
					// 加载状态
					this.loadmore = list.length < 10? "没有更多了" : "上拉加载更多"
					// 关闭加载状态
					uni.hideLoading()
					if (typeof callback === "function") {
						callback()
					}
				})
				.catch(err => {
					console.log(err)
					this.page--
					// 关闭加载状态
					uni.hideLoading()
					if (typeof callback === "function") {
						callback()
					}
				})
			}
			
		}
	}
</script>

<style>

</style>
