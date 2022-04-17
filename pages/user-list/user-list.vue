<template>
	<view>
		<!-- 选项卡 -->
		<view class="flex align-center" style="height: 100rpx;">
			<view class="flex flex-1 p-2 justify-center align-center" v-for="(item, index) in tabList" :key="index" @click="tabChange(index)" :class="tabIndex === index? 'font-lg font-weight-bold text-main': 'font-md'">
				<text class="mr-1">{{item.name}}</text>{{item.count | formatNum}}
			</view>
		</view>
		<!-- swiper 列表 -->
		<swiper :duration="500" :current="tabIndex" @change="swiperChange" :style="{height:scrollHeight}">
			<swiper-item v-for="(item, index) in userList" :key="index">
					<scroll-view scroll-y="true" :style="{height:scrollHeight}" @scrolltolower="loadmore(index)">
						<template v-if="item.list.length > 0">
							<!-- 列表 -->
								<block v-for="(item1, index1) in item.list" :key="index1">
									<user-list :item="item1" :index="index1"></user-list>
								</block>
								<block v-if="item.list.length > 10">
									<loadmore :loadmore="item.loadmore"></loadmore>
								</block>
						</template>
						<template v-else>
							<no-thing></no-thing>
						</template>
					</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import userList from "@/components/user-list/user-list.vue"
	import noThing from "@/components/common/noThing.vue"
	import loadmore from "@/components/common/loadmore.vue"
	import { mapState } from "vuex"
	export default {
		components:{
			userList,
			noThing,
			loadmore
		},
		data() {
			return {
				scrollHeight:'',
				tabIndex:0,
				tabList:[
					{
						name:"互关",
						count:1,
						key: "friends"
					},{
						name:"关注",
						count:1,
						key: "follows"
					},{
						name:"粉丝",
						count:1,
						key: "fens"
					}
				],
				userList: []
			}
		},
		// 监听点击输入框事件
		onNavigationBarSearchInputClicked() {
			this.openSearch()
		},
		onLoad() {
			// #ifdef APP-PLUS
			let webView = this.$scope.$getAppWebview();
			webView.setStyle({
				titleNView:{
					autoBackButton:false
				}
			})
			// #endif
			let res = uni.getSystemInfoSync()
			
			// #ifdef APP-PLUS
			this.scrollHeight = res.windowHeight - uni.upx2px(100) + "px"
			// #endif
			
			// #ifdef MP-WEIXIN
			this.scrollHeight = res.windowHeight - uni.upx2px(100)  + "px"
			// #endif
			this.getCounts()
			this.getClassData()
		},
		computed: {
			...mapState({
				user: state => state.user
			})
		},
		filters: {
			formatNum(value) {
				return value > 99? "99+" : value
			}
		},
		methods: {
			// 获取分类
			getClassData() {
					let length = this.tabList.length
					let arr = []
					for(let i = 0; i< length; i++) {
						arr.push({
							loadmore:"上拉加载更多",
							list:[],
							page:1,
							firstLoad:false
						})					
					}
					this.userList = arr
					this.getList()
			},
			// 获取列表
			getList() {
				if(this.tabList.length) {
					let index = this.tabIndex
					// let id = this.tabList[index].id
					let page = this.userList[index].page
					let isRefresh = page === 1
					this.$H.get("/"+this.tabList[index].key+"/" + page, {}, {
						token: true,
						noCheck: true
					})
					.then(res=> {
						let list = res.list.map(v=> {
							return {
								id: v.id,
								avatar:v.userpic,
								nickName:v.username,
								sex: v.userinfo.sex,
								age: v.userinfo.age,
							}
						})
						this.userList[index].list = isRefresh? [...list] : [...this.userList[index].list, ...list],
						this.userList[index].loadmore = list.length < 10? "没有更多了" : "上拉加载更多"
						if (isRefresh) {
							this.userList[index].firstLoad = true
						}
						
					}).catch(err => {
						if(!isRefresh) {
							this.topicList[index].page--
						}
					})
				}
			},
			// 获取用户数据相关
			getCounts() {
				this.$H.get("/user/getcounts/" + this.user.id, {}, { token: true })
				.then(res => {
					this.tabList[0].count = res.friend_count
					this.tabList[1].count = res.withfollow_count 
					this.tabList[2].count = res.withfen_count 
				})
			},
			// 点击切换选项卡
			tabChange(e) {
				this.tabIndex = e
			},
			// swiper 划动事件
			swiperChange(e) {
				this.tabIndex = e.detail.current
				if(!this.userList[e.detail.current].firstLoad) {
					this.getList()
				}
			},
			// 上拉加载更多
			loadmore(index) {
				// 拿到当前列表
				let item = this.userList[index]
				// 判断是否出于可加载状态（上拉加载更多）
				if(item.loadmore !== "上拉加载更多") return
				// 修改当前列表加载状态
				item.loadmore = "加载中..."
				// 请求数据
				item.page++
				
				this.getList()
			},
			openSearch(){
				uni.navigateTo({
					url: '../search/search?type=user',
				});
			},
}
	}
</script>

<style>

</style>
