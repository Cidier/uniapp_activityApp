<template>
	<view>
		<!-- 自定义导航栏 -->
		<uni-nav-bar  :border="false" statusBar @clickRight="toAddInput">
			<view class="w-100 flex justify-center align-center  font-md text-light-muted">
				<view class=" mx-1" v-for="(item, index) in tabName" :key="index" :class="activeIndex === index ? 'font-lg text-main font-weight-bold' : ''" @click="changTab(index)">
					{{item.name }}
				</view>
			</view>
			<text slot= 'right' class="iconfont icon-fatie_icon font-md"></text>
		</uni-nav-bar>
		
		<!-- 列表 -->
		<swiper :duration="150" :current="activeIndex" :style="{ height: scrollHeight }"  @change.stop="changTabbar">
					<!-- 关注 -->
					<swiper-item >
							<scroll-view scroll-y="true" :style="{ height: scrollHeight }" @scrolltolower="loadmoreEvent()">
										<!-- 列表组件 -->
										<block v-for="(item, index) in list" :key="index">
											<commonList :item="item" :index="index"  @doSupport="doSupport"></commonList>
											<!-- 分割线组件 -->
											<divider></divider>
										</block>
										<!-- 上拉加载更多组件 -->
										<loadmore v-if="list.length" :loadmore="loadmoreStatus"></loadmore>
										<noThing v-else></noThing>
							</scroll-view>
					</swiper-item>
					<!-- 话题 -->
					<swiper-item>
							<!-- 热门 组件-->
							<hot-cate :hotCate="hotCate" @openMore="toTopicCate"></hot-cate>
							<!-- 搜索 -->
							<view class="p-2" @click="openSearch">
								<view class="flex justify-center align-center rounded p-2 text-light-muted bg-light">
									<text class="iconfont icon-sousuo mr-1"></text>
									搜索话题
								</view>
							</view>
							<!-- 轮播图 -->
							<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" class="px-2 pb-2">
								<swiper-item class="rounded" v-for="(item, index) in swiperList" :key="index">
										<image :src="item.src" class="w-100" style="height:300rpx;"></image>
								</swiper-item>
							</swiper>
							<!-- 分割线组件 -->
							<divider></divider>
							<!-- 最近更新 -->
							<view class="flex align-center p-2 font-md">最近更新</view>
							<!-- 话题 -->
							<scroll-view scroll-y="true" :style="{height:topicTop + 'px'}" id="topic">
								<block v-for="(item, index) in topicList" :key="index">
									<!-- 话题组件 -->
									<topicList :item="item" :index="index"></topicList>
								</block>
							</scroll-view>
					</swiper-item>
				</swiper>
	</view>
</template>

<script>
	import uniNavBar from "@/components/uni-ui/uni-nav-bar/uni-nav-bar.vue"
	import commonList from "@/components/common/common-list.vue"
	import loadmore from "@/components/common/loadmore.vue"
	import hotCate from "@/components/news/hot-cate.vue"
	import topicList from "@/components/news/topic-list.vue"
	export default {
		components:{ uniNavBar, commonList, loadmore, hotCate, topicList },
		data() {
			return {
				// 话题组件距离顶部距离
				topicTop:0,
				// 可视窗口高度
				windowHeight:0,
				topicList:[],
				hotCate: [],
				loadmoreStatus: "上拉加载更多",
				activeIndex: 0,
				tabName: [
					{name: "关注"},
					{name: "话题"}
				],
				scrollHeight: "",
				list: [],
				swiperList: [],
				page:1
			}
		},
		onLoad() {
			// 获取手机信息，计算scroll高度
			try {
				let res = uni.getSystemInfoSync()
				this.windowHeight = res.windowHeight
				// #ifdef APP-PLUS
				this.scrollHeight = res.windowHeight - 44 - res.statusBarHeight + "px"
				// #endif
				
				// #ifdef MP-WEIXIN
				this.scrollHeight = res.windowHeight - 44  + "px"
				// #endif
			
			} catch (e) {
				console.log(e)
			}
			this.getTopicNav()
			this.getSwiper()
			this.getHotTopic()
		},
		onShow() {
			this.getFollowList()
		},
		methods: {
			// 获取关注列表
			getFollowList() {
				this.$H.get("/followpost/" + this.page, {} , {
					noCheck: true,
					token: true
				})
				.then(res => {
					console.log(res)
					let isRefresh = this.page === 1
					let list = res.list.map(v=> {
						return this.$H.formatCommonList(v)
					})	
					this.list = isRefresh? [...list] : [...this.list, ...list]
					this.loadmoreStatus = list.length < 10? "没有更多了" : "上拉加载更多"
				}).catch(err => {
					console.log(err)
						if(!isRefresh) {
							this.page--
						}
					})
			},
			// 获取热门分类
			getTopicNav() {
				this.$H.get("/topicclass").then(res => {
					this.hotCate = res.list.map(v => {
						return {
							id: v.id,
							name: v.classname
						}
					})
				})
			},
			// 获取热门话题
			getHotTopic() {
				this.$H.get("/hottopic").then(res => {
					this.topicList = res.list.map(v => {
						return {
							cover: v.titlepic,
							title: v.title,
							content: v.desc,
							today_count: v.todaypost_count,
							news_count: v.post_count,
							id: v.id,
							todaypost_count: v.todaypost_count
						}
					})
				})
				
			},
			// 获取轮播图
			getSwiper() {
				this.$H.get("/adsense/0").then(res => {
					this.swiperList = res.list
				})
			},
			// 打开搜索话题页面
			openSearch() {
				uni.navigateTo({
					url:"../search/search?type=topic"
				})
			},
			// 监听更多按钮， 点击跳转到话题分类页面
			toTopicCate() {
				uni.navigateTo({
					url: "../topicCate/topicCate"
				})
			},
			// 切换导航栏
			changTab(e) {
				this.activeIndex = e
			},
			//  划动切换到话题
			changTabbar(e) {
				this.activeIndex = e.detail.current
			},
			// 跳转到 AddInput 发布页面
			toAddInput() {
				uni.navigateTo({
					url: "../add-input/add-input"
				})
			},
			//  上拉加载更多
			loadmoreEvent() {
				// 加载状态为加载中时 
				if (this.loadmoreStatus !=="上拉加载更多") return
				// 加载中
				this.loadmoreStatus = "加载中..."
				this.page++
				// 发送请求
				this.getFollowList()
				
			},
			//  顶踩操作
			doSupport(e) {
				let item = this.list[e.index].support
				let msg = e.type === "support" ? "顶" : "踩"
				if (item.type === "") {
					item[e.type + "_count"] ++
				} else if (item.type === "support" && e.type === "nonsupport") { // 之前顶了， 现在踩
					item.support_count--
					item.nonsupport_count++
				} else if (item.type === "nonsupport" && e.type === "support") { // 之前踩了现在顶
					item.support_count++
					item.nonsupport_count--
				}
				item.type = e.type
				uni.showToast({ title: msg + "成功" })
			},
			//  获取话题滚动 高度
			getHeight() {
				const query = uni.createSelectorQuery().in(this)
				query.select('#topic').boundingClientRect(data => {
				  this.topicTop = this.windowHeight - data.top
				}).exec();
				
			}
		},
		mounted() {
			this.getHeight()
		},
		watch:{
			// topicTop(val) {
			// 	console.log(val)
			// }
		}
	}
</script>

<style>

</style>
