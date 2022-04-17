<template>
	<view >
		<!-- 顶部滚动选项卡 -->
	
			<scroll-view scroll-x :scroll-into-view="tabIndex" scroll-with-animation>
				<view class="flex flex-nowrap px-1">
					<view v-for="(item, index) in fenlei" :id="'tab' + index" class="flex flex-1 align-center justify-center px-2" style=" height: 100rpx;" :key="index"
					:class="activeTab === index? 'text-main font-md font-weight-bold ' : 'font'" @click="toggleTab(index)" >
					{{ item.name }}</view>
				</view>
			</scroll-view>

		<!-- 列表 -->
		<swiper :duration="150" :current="activeTab" :style="{ height: scrollHeight }"  @change.stop="changTab">
			<swiper-item v-for="(item, index) in topicList" :key="index">
					<scroll-view scroll-y="true" :style="{ height: scrollHeight }" @scrolltolower="pullUpLoadmore(index)">
							<template v-if="item.list.length > 0">
								<block v-for="(item2, index2) in item.list" :key="index2">
									<!-- 话题组件 -->
									<topic-list :choose="choose" :item="item2" :index="index2"></topic-list>
								</block>
								<!-- 上拉加载更多 -->
								<loadmore :loadmore="item.loadmore"></loadmore>
							</template>
							<!-- 加载中 -->
							<template v-else-if="!item.firstLoad">
								<view class="flex align-center justify-center font-md text-muted" style="height: 200rpx;">加载中...</view>
							</template>
							<!-- 无数据 -->
							<template v-else>
								<noThing></noThing>
							</template>
					</scroll-view>
			</swiper-item>
		</swiper>
		
	</view>
</template>

<script>
	import topicList from "../../components/news/topic-list.vue"
	import loadmore from "@/components/common/loadmore.vue"
	export default {
		components: { topicList, loadmore },
		data() {
			return {
				scrollHeight: '',
				activeTab: 0,
				tabIndex: '',
				topicList:[],
				tabList: [],
				choose: false,
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
		onLoad(e) {
			// 获取手机信息，计算scroll高度
			try {
				let res = uni.getSystemInfoSync()
				
				// #ifdef APP-PLUS
				this.scrollHeight = res.windowHeight - uni.upx2px(100) + "px"
				// #endif
				
				// #ifdef MP-WEIXIN
				this.scrollHeight = res.windowHeight - uni.upx2px(100)  + "px"
				// #endif
			
			} catch (e) {
				console.log(e)
			}
			this.getTopicCate()
			// 从文章发布页面选择话题进入时，修改标题
			if(e.choose) {
				uni.setNavigationBarTitle({
					title: "选择话题"
				})
				this.choose = true
			}
		},
		// 监听点击导航栏搜索框
		onNavigationBarSearchInputClicked() {
			uni.navigateTo({ url: "../search/search" })
		},
		// 监听导航栏按钮点击
		onNavigationBarButtonTap() {
			uni.navigateTo({ url: "../add-input/add-input" })
		},
		methods: {
			// 获取话题分类
			getTopicCate() {
				this.$H.get("/topicclass").then(res => {
					this.tabList = res.list
					// 根据分类加载对应列表
					let arr = []
					let tabListLength = this.tabList.length
					for(let i = 0; i < tabListLength; i++) {
						arr.push({
							page:1,
							loadmore: "",
							list: [],
							firstLoad: false
						})
					}
					this.topicList = arr
					// 获取第一个分类列表数据
					if(this.tabList.length) {
						this.getList()
					}
				})
				
			},
			// 获取对应分类话题列表数据
			getList() {
				if(this.tabList.length) {
					let index = this.activeTab
					let id = this.tabList[index].id
					let page = this.topicList[index].page
					let isRefresh = page === 1
					// 发送请求
					this.$H.get("/topicclass/"+id+"/topic/"+page).then(res => {
						let list = res.list.map(v => {
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
						// 渲染模板
						this.topicList[index].list = isRefresh? [...list] : [...this.topicList[index].list, ...list],
						// 加载状态
						this.topicList[index].loadmore = list.length < 10? "没有更多了" : "上拉加载更多"
						if(isRefresh) {
							this.topicList[index].firstLoad = true
						}
						
					}).catch(err => {
						if(!isRefresh) {
							this.topicList[index].page--
						}
					})
				}
			},
			// 上拉加载更多
			pullUpLoadmore(index) {
				if(this.topicList[this.activeTab].loadmore !== "上拉加载更多") {
					return
				}
				this.topicList[this.activeTab].loadmore = "加载中..."
				this.topicList[this.activeTab].page ++ 
				// 获取数据
				this.getList()
			},
			// 列表划动切换
			changTab(e) {
				this.toggleTab(e.detail.current)
			},
			
			// 顶部 滚动选项卡 点击切换
			toggleTab(e) {
				if (e === this.activeTab) return
				this.activeTab = e 
				this.tabIndex = "tab" + e
				// 获取指定分类下列表
				if(!this.topicList[this.activeTab].firstLoad) {
					this.getList()
				}	
			}
		}
	}
</script>

<style>
	
</style>
