<template>
	<view >
		<!-- 自定义导航栏 -->
		<!-- #ifndef APP-PLUS -->
			<uni-nav-bar :shadow="false" :border="false" 
					@click-left="clickLeft" @click-right="clickRight">
						<!-- 左边图标 -->
						<block slot="left">
							<view class="iconfont icon-qiandao ml-2 mr-2" style="font-size: 22px;color: #FF9619;"></view>
						</block>
						<!-- 中间搜索框 -->
						<view class="flex justify-center align-center rounded text-muted bg-light flex-1 mt-1" style="margin-left: -46upx;height: 60upx;" @tap="openSearch">
							<view class="iconfont icon-sousuo mr-1"></view>搜索
						</view>
						<!-- 右边图标 -->
						<block slot="right">
							<view class="icon iconfont icon-bianji1 text-dark" style="font-size: 22px;"></view>
						</block>
					</uni-nav-bar>
		<!-- #endif -->
		
		
		<template >
				<view class=" p-3 flex  align-center rounded" style="justify-content:space-around ;   margin: 30rpx;border-radius: 30px;" >
					<view style="justify-center;">
						
						<view class=" flex  " style=" margin-bottom: 20rpx;justify-content: space-around; ">
						
						
						<view style="margin-right:50rpx; text-align: center;width: 100rpx; height:110rpx;  border-radius:20rpx; padding-right: 20rpx;background-color: #e6e6e6; " 
						@tap="act" >  
						
						<image mode="widthFix" style="height: 60rpx; width:60rpx;" class="rounded"  src="/static/index/huodong.png">
						<view><b>活动</b></view>
						</view>
						<view style="margin-right:50rpx;text-align: center;width: 100rpx; height:110rpx;  border-radius:20rpx; padding-right: 20rpx;background-color: #e6e6e6; "
						 >  
						
						<image mode="widthFix" style=" height: 60rpx; width:60rpx;" class="rounded"  src="/static/index/bisai.png">
						<view><b>比赛</b></view>
						</view>
						<view style="text-align: center;width: 100rpx; height:110rpx;  border-radius:20rpx; padding-right: 20rpx;background-color:#e6e6e6; "
						 >  
						
						<image mode="widthFix" style="height: 60rpx; width:60rpx;" class="rounded"  src="/static/index/kecheng.png">
						<view><b>课程</b></view>
						</view>
						
						
					</view>
					
					<view style="justify-center;">
						
						<view class=" flex  " style=" justify-content: space-around; ">
						
						<view style="margin-right:50rpx; text-align: center;width: 100rpx; height:110rpx;  border-radius:20rpx; padding-right: 20rpx;background-color:#e6e6e6; " 
						 >  
						
						<image mode="widthFix" style="height: 60rpx; width:60rpx;" class="rounded"  src="/static/index/lvyou.png">
						<view><b>旅游</b></view>
						</view>
					<!-- 	
						<view class="px-3 py-2">
							<image src="/static/demo/demo20.jpg" mode="widthFix" style="height: 170rpx; width: 100%;" class="rounded"></image>
						</view>
					 -->	
						<view style="margin-right:50rpx;text-align: center;width: 100rpx; height:110rpx;  border-radius:20rpx; padding-right: 20rpx;background-color:#e6e6e6; "
						>  
						
						<image mode="widthFix" style=" height: 60rpx; width:60rpx;" class="rounded"  src="/static/index/kuaixun.png">
						<view><b>快讯</b></view>
						</view>
						<view style="text-align: center;width: 100rpx; height:110rpx;  border-radius:20rpx; padding-right: 20rpx;background-color: #e6e6e6; "
						@tap="act" >  
						
						<image mode="widthFix" style="height: 60rpx; width:60rpx;" class="rounded"  src="/static/index/qita.png">
						<view><b>其他</b></view>
						</view>
						
						
					</view>
					
					
							
					</view>
					</view>
					
				</view>
			
						
		</template>
		
	

		<!-- 列表 -->
		<swiper :duration="150" :current="activeTab" :style="{ height: scrollHeight }"  @change.stop="changTab">
			<swiper-item v-for="(item, index) in nweslist" :key="2">
					<scroll-view scroll-y="true" :style="{ height: scrollHeight }" @scrolltolower="loadmore(index)">
						
						<template v-if="item.list.length > 0" style =" margin: 30rpx;">
							<block v-for="(item2, index2) in item.list" :key="index2">
								<!-- 列表组件 -->
								<commonList :item="item2" :index="index2" @follow="follow" @doSupport="doSupport"></commonList>
								<!-- 分割线组件 -->
								<divider></divider>
							</block>
							<!-- 上拉加载更多 -->
							<loadmore :loadmore="item.loadmore"></loadmore>
						</template>
						<template v-else-if="!item.firstLoad">
							<view class="flex align-center justify-center font-md text-muted" style="height: 200rpx;">加载中...</view>
						</template>
						<template v-else>
							<!-- noThing组件 没有数据的页面 -->
							<noThing></noThing>
						</template>
					</scroll-view>
			</swiper-item>
		</swiper>
		
	</view>
</template>

<script>
	// #ifndef APP-PLUS
	import uniNavBar from "@/components/uni-ui/uni-nav-bar/uni-nav-bar.vue"
	// #endif
	import commonList from "@/components/common/common-list.vue"
	import loadmore from "@/components/common/loadmore.vue"
	export default {
		components: { 
			commonList,
			loadmore,
			 // #ifndef APP-PLUS
			 uniNavBar
			 // #endif
		 },
		data() {
			return {
				scrollHeight: '',
				activeTab: 0,
				tabIndex: '',
				nweslist:[],
				tabList: []
			}
		},
		onLoad() {
			// 获取分类
			this.getClassData()
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
			// 监听首页更新
			uni.$on("updateIndex", (e)=> {
				this.getClassData()
			})
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
			this.getList()
		})
		},
		onShow() {
			
		},
		// 监听点击导航栏搜索框
		onNavigationBarSearchInputClicked() {
			uni.navigateTo({ url: "../search/search?type=post" })
		},
		// 监听导航栏按钮点击
		onNavigationBarButtonTap() {
			this.navigateTo({ url: "../add-input/add-input"})
		},
		// 页面卸载
		onUnload() {
			// 关闭全局监听
			uni.$off("updateFollowOrDoSupport", (e)=> {})
			uni.$off("updateIndex", (e)=> {})
			uni.$off("updateCommentsCount", (e)=> {})
		},
		methods: {
			//跳转到活动界面
			act(){
				 // 跳转新页面 同时不销毁当前页面
				           uni.navigateTo({url: "../index1/index1"})
				           
				           const userinfo = { name: 'lookwe'}
				           // 关闭当前页面，去往指定页面
				           uni.redirectTo({
				                   url: `../user/user?userinfo=${encodeURIComponent(JSON.stringify(userinfo))}` 
				           })
				  
				// uni.switchTab({
				// 					url: '../index1/index1'
				// 				});
			},
			
			// #ifndef APP-PLUS
			clickRight() {
				this.navigateTo({ url: "../add-input/add-input"})
			},
			clickLeft() {
				console.log("自定义导航栏左边图标点击事件")
			},
			openSearch() {
				uni.navigateTo({ url: "../search/search?type=post" })
			},
			// #endif
			// 获取分类
			getClassData() {
				this.$H.get("/postclass")
				.then(res => {
					this.tabList = res.list
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
					this.nweslist = arr
					// 获取第一个分类文章列表
					if(this.tabList.length) {
						this.getList()
					}
				})
			},
			// 获取指定分类下列表
			getList() {
				if(this.tabList.length) {
					let index = this.activeTab
					let id = this.tabList[index].id
					let page = this.nweslist[index].page
					let isRefresh = page === 1
					this.$H.get("/postclass/"+ id +"/post/" + page, {}, {
						token: true,
						noCheck: true
					})
					.then(res=> {
						let list = res.list.map(v=> {
							return this.$H.formatCommonList(v)
						})	
						this.nweslist[index].list = isRefresh? [...list] : [...this.nweslist[index].list, ...list],
						this.nweslist[index].loadmore = list.length < 10? "没有更多了" : "上拉加载更多"
						if (isRefresh) {
							this.nweslist[index].firstLoad = true
						}
						
					}).catch(err => {
						if(!isRefresh) {
							this.topicList[index].page--
						}
					})
				}
			},
			// 列表划动切换
			changTab(e) {
				this.toggleTab(e.detail.current)
			}, 
			// 点击关注
			follow(user_id) {
				// 找到所有列表
					data.list.forEach(item => {
						if (item.user_id === user_id) {
							item.isFollow = true
						}
					})
				
				uni.showToast({	title: "关注成功" })
			},
			// 顶踩操作
			doSupport(e) {
				let list = this.nweslist[this.activeTab].list
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
			// 顶部 滚动选项卡 点击切换
			toggleTab(e) {
				if (e === this.activeTab) return
				this.activeTab = e 
				// 滚动到指定元素
				this.tabIndex = "tab" + e
				// 获取指定分类下列表
				if(!this.nweslist[this.activeTab].firstLoad) {
					this.getList()
				}								
			},
			// 上拉加载更多
			loadmore(index) {
				// 拿到当前列表
				let item = this.nweslist[index]
				// 判断是否出于可加载状态（上拉加载更多）
				if(item.loadmore !== "上拉加载更多") return
				// 修改当前列表加载状态
				item.loadmore = "加载中..."
				// 请求数据
				item.page++
				
				this.getList()
			}
		}
	}
</script>

<style>
	
</style>
