<template>
	<view>
		<!-- 话题详情组件 -->
		<topic-detail :topicInfo="topicInfo"></topic-detail>
		<!-- 分割线组件 -->
		<divider></divider>
		<!-- popular -->
				<view class="flex align-center p-2 border-bottom" v-for="(item, index) in popular" :key="index">
					<text class="iconfont icon-xihuan text-main mr-2"></text>
					<text class="text-ellipsis">{{item.title}}</text>
				</view>
			<!-- 分割线组件 -->
			<divider></divider>
			<!-- tab -->
			<view class="flex py-2 align-center">
				<view class="flex justify-center align-center" style="width: 50%;" v-for="(item, index) in tabNameList" :key="index" :class="tabIndex === index? 'text-main font-lg font-weight-bold' : 'font-md'" @click="changeTab(index)">{{item.name}}</view>
			</view>
			<!-- 列表组件 -->
			<template v-if="listData.length > 0">
				<block v-for="(item, index) in listData" :key="index">
					<common-list :item="item" :index="index"></common-list>
				</block>
			</template>
			<template v-else>
				<!-- 空白页组件 -->
				<noThing></noThing>
			</template>
			<!-- 上拉加载更多组件 -->
			<template v-if="listData.length > 0">
				<loadmore :loadmore="loadmoreText"></loadmore>
			</template>
	</view>
</template>

<script>
	import topicDetail from "@/components/topic-detail/topic-detail.vue"
	import commonList from "@/components/common/common-list.vue"
	import loadmore from "@/components/common/loadmore.vue"
	import noThing from "@/components/common/noThing.vue"
	
	export default {
		components: {
			topicDetail,
			commonList,
			loadmore
		},
		data() {
			return {
				loadmoreText1:"上拉加载更多",
				loadmoreText2:"上拉加载更多",
				page1:1,
				page2:1,
				tabIndex:0,
				firstLoad1:false,
				firstLoad2:false,
				tabNameList: [
					{name: "默认"},
					{name: "最新"}				
				],
				topicInfo: {},
				popular: [
					{
						title: "新人必读】好好学习天天向上，好好学习天天向上，好好学习天天向上"
					},
					{
						title: "新人必读】好好学习天天向上，好好学习天天向上，好好学习天天向上"
					}
				],
				list1: [],
				list2:[]
			}
		},
		onLoad(e) {
			this.topicInfo = JSON.parse(e.info)
			// 设置导航栏标题
			uni.setNavigationBarTitle({
				title:this.topicInfo.title
			})
			// 获取数据
			this.getDate()
			// 监听全局关注和顶踩事件
			uni.$on("updateFollowOrDoSupport", (e) => {
				switch (e.type){
					case "follow":
					this.follow(e.data.user_id)
						break;
					case 'support': // 顶踩
					this.doSupport(e.data)	
					default:
						break;
				}
			})
		},
		// 页面卸载
		onUnload() {
			// 关闭全局监听
			uni.$off("updateFollowOrDoSupport", (e)=>{})
		},
		methods: {
			// 点击关注
			follow(user_id) {
				// 找到所有列表
				this.list1.forEach(item => {
					if (item.user_id === user_id) {
						item.isFollow = true
					}
				})
				this.list2.forEach(item => {
					if (item.user_id === user_id) {
						item.isFollow = true
					}
				})	
				uni.showToast({	title: "关注成功" })
			},
			// 获取数据
			getDate() {
				let id = this.topicInfo.id
				let num = this.tabIndex + 1
				let page = this["page" + num]
				let isRefresh = page === 1
				this.$H.get("/topic/"+ id +"/post/" + page)
				.then(res => {
					let list = res.list.map(v => {
						return this.$H.formatCommonList(v)
					})
					// 渲染模板
					this["list" + num] = isRefresh? [...list] : [...this["list" + num], ...list]
					// 判断加载状态
					this["loadmoreText" + num] = list.length > 10? "上拉加载更多" : "没有更多了"
					// 判断是否是第一次加载
					if(isRefresh) {
						this["firstLoad" + num] = true
					}
				})			
				.catch(err => {
					if(!isRefresh) {
						this["page" + num]--
					}
				})
			},
			//  点击切换选项卡
			changeTab(index) {
				this.tabIndex = index
				// 获取数据
				if(!this["firstLoad" + (index + 1)]) {
					this.getDate()
				}
			},
			// 上拉刷新
			loadmore() {
				// 获取到当前所在的tab
				let index = this.tabIndex + 1
				if (this["loadmoreText" + index] !== "上拉加载更多") return
				this["loadmoreText" + index] = "加载中"
				// 获取数据
				this["page" + index]
				this.getDate()
				
			},
			// 顶踩操作
			doSupport(e) {
				this["list" + (this.tabIndex + 1)].forEach(item => {
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
		},
		computed: {
			listData() {
				return this["list" + (this.tabIndex + 1)]
			},
			loadmoreText() {
				return this["loadmoreText" + (this.tabIndex + 1)]
			}
		},
		onReachBottom() {
			// 上拉刷新
			this.loadmore()
		}
	}
</script>

<style>
.indistinct {
	filter: blur(6rpx);
}
</style>
