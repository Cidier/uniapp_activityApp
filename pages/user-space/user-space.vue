<template>
	<view>
		<!-- #ifndef APP-PLUS -->
			<uni-nav-bar :shadow="false" :fixed="true" :border="false" right-text="菜单" @click-right="clickNavigationButton"></uni-nav-bar>
		<!-- #endif -->
		<!-- 头部 -->
		<view class="flex align-center py-4 px-2 border-bottom border-light">
			<view>
				<image :src="userinfo.username? userinfo.userpic : '/static/demo/userpic/8.jpg'" style="width: 180rpx; height: 180rpx;" class="rounded-circle"></image>
			</view>
			<view class="ml-2 flex-1 flex flex-column">
				<view class="flex justify-center align-center">
					<view class=" flex-1 flex flex-column align-center" v-for="(item,index) in counts">
						<text class="font-lg font-weight-bold">{{item.num | formatNum}}</text>
						<text class="text-muted">{{item.name}}</text>
					</view>
				</view>
				<view class="mt-3 justify-center align-center">
					<button v-if="user_id == user.id" style="width: 400rpx;  border: none;" class="rounded" type="default" @click="openUserInfo">编辑资料</button>
					<button v-else style="width: 400rpx;  border: none;" class="rounded" :style="userinfo.isFollow? 'background-color: #f8f9fa;color: #343a40;':'background-color: #FF4A6A;color: #FFFFFF;'" plain @click="doFollow">{{userinfo.isFollow? "已关注" : "关注"}}</button>
				</view>
			</view>
		</view>
		<!-- tab -->
		<view class="flex align-center" style="height: 100rpx;">
			<view class="flex flex-1 p-2 justify-center align-center" v-for="(item, index) in tabList" :key="index" @click="tabChange(index)" :class="tabIndex === index? 'font-lg font-weight-bold text-main': 'font-md'">{{item.name}}</view>
		</view>
		<!-- tab info -->
		<template v-if="tabIndex === 0">
			<view class="animated fast fadeIn">
				<view class="p-3 border-bottom border-light">
					<view class="font-lg">账号信息</view>
					<view class="mt-3">账号年龄：{{userinfo.regtime}}</view>
					<view >账号ID：{{user_id}}</view>
				</view>
				<view class="p-3 border-bottom border-light">
					<view class="font-lg">个人信息</view>
					<view class="mt-3">星座：{{userinfo.birthday}}</view>
					<view>职业：{{userinfo.job}}</view>
					<view>故乡：{{userinfo.path}}</view>
					<view>情感：{{userinfo.qg}}</view>
				</view>
			</view>
		</template>
		<template v-else>
			<view class="animated fast fadeIn">
				<common-list v-for="(item, index) in list" :key="index" :item="item" :index="index" @follow="follow" @doSupport="doSupport"></common-list>
				<divider></divider>
				<loadmore v-if="list.length > 10" :loadmore="loadmore"></loadmore>
			</view>
		</template>
		<!-- 弹出层 -->
		<uni-popup ref="popup" type="top" background-color="#fff">
			<view 
			class="flex justify-center align-center border-bottom border-light-secondary p-2"
			hover-class="bg-hover-light"
			@click="doBlack">
				<text class="iconfont icon-sousuo mr-2"></text>
				<text class="font-md">{{userinfo.isblack? "移除黑名单" : "加入黑名单"}}</text>
			</view>
			<view 
			class="flex justify-center align-center p-2 " 
			hover-class="bg-hover-light"
			@click="openChat" 
			v-if="!userinfo.isblack">
				<text class="iconfont icon-shanchu  mr-2"></text>
				<text class="font-md">聊天</text>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	// #ifndef APP-PLUS
	import uniNavBar from "@/components/uni-ui/uni-nav-bar/uni-nav-bar.vue"
	// #endif
	const emotionArray = ['保密', '未婚', '已婚']
	import commonList from "@/components/common/common-list.vue"
	import loadmore from "@/components/common/loadmore.vue"
	import uniPopup from "@/components/uni-ui/uni-popup/uni-popup.vue"
	import $T from "@/common/time.js"
	import { mapState } from "vuex"
	export default {
		components:{
			commonList,
			loadmore,
			uniPopup,
			// #ifndef APP-PLUS
			uniNavBar
			// #endif
		},
		data() {
			return {
				counts:[{
					name:"帖子",
					num:0
				},{
					name:"粉丝",
					num:0
				},{
					name:"关注",
					num:0
				}],
				user_id: 0,
				userinfo:{
					userpic:"/static/default.jpg",
					username:"",
					sex:0,
					age:20,
					isFollow:false,
					regtime:"",
					birthday:"",
					job:"",
					path:"",
					qg:""
				},
				tabList:[{
					name:"主页"
				},{
					name:"帖子",
					list:[],
					page: 1,
					loadmore:"上拉加载更多..."
				},{
					name:"动态",
					list:[],
					page: 1,
					loadmore:"上拉加载更多"
				}
				],
				tabIndex:0
				
			}
		},
		computed:{
			...mapState({
				user: state => state.user
			}),
			list() {
				return this.tabList[this.tabIndex].list
			},
			loadmore() {
				return this.tabList[this.tabIndex].loadmore
			}	
		},
		onNavigationBarButtonTap() {
			if(this.user_id == this.user.id) {
				return uni.navigateTo({
					url: "../user-set/user-set"
				})
			}
			this.$refs.popup.open()
		},
		onLoad(e) {
			if(!e.user_id) {
				return uni.showToast({
					title: "非法id",
					icon: "none"
				})
			}
			this.user_id = e.user_id
			// 加载用户个人信息
			this.getUserInfo()
			this.getCounts()
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
		filters: {
			formatNum(value) {
				return value > 99? "99+" : value
			}
		},
		methods: {
			// #ifndef APP-PLUS
			clickNavigationButton() {
				if(this.user_id == this.user.id) {
					return uni.navigateTo({
						url: "../user-set/user-set"
					})
				}
				this.$refs.popup.open()
			},
			// #endif
			// 获取用户数据相关
			getCounts() {
				this.$H.get("/user/getcounts/" + this.user_id)
				.then(res => {
					this.counts[0].num = res.post_count
					this.counts[1].num  = res.withfen_count
					this.counts[2].num  = res.withfollow_count 
				})
			},
			// 获取用户个人信息
			getUserInfo(){
				this.$H.post("/getuserinfo",{
					user_id: this.user_id
				}, {
					token:true,
					noChect: true
				})
				.then(res=> {
					this.userinfo = {
						userpic:res.userpic,
						username:res.username,
						sex:res.userinfo.sex,
						age:res.userinfo.age,
						isFollow:res.fens.length > 0,
						isblack:res.blacklist.length > 0,
						regtime:$T.dateFormat(new Date(res.create_time * 1000), '{Y}-{MM}-{DD}'),
						birthday:$T.getHoroscope(res.userinfo.birthday),
						job:res.userinfo.job ? res.userinfo.job : '无',
						path:res.userinfo.path ? res.userinfo.path : '无',
						qg:emotionArray[res.userinfo.qg],
					}
					// 修改标题
					uni.setNavigationBarTitle({
						title: this.userinfo.username
					})
				})
			},
			// 获取文章列表
			getList() {
				if(this.tabIndex === 0) return
				let page = this.tabList[this.tabIndex].page
				let isRefresh = page === 1
				this.$H.get("/user/"+this.user_id+"/post/" + page ,{}, {token:true})
				.then(res=> {
					let list = res.list.map(v=> {
						return this.$H.formatCommonList(v)
					})	
					this.tabList[this.tabIndex].list = isRefresh? [...list] : [...this.tabList[this.tabIndex], ...list],
					this.tabList[this.tabIndex].loadmore = list.length < 10? "没有更多了" : "上拉加载更多"
					
				}).catch(err => {
					console.log(err)
					if(!isRefresh) {
						this.tabList[this.tabIndex].page--
					}
				})
			},
			// 点击关注
			follow(user_id) {
				// 找到所有列表
				this.tabList.forEach(data => {
					if(data.list){
						data.list.forEach(item => {
							if (item.user_id === user_id) {
								item.isFollow = true
							}
						})
					}
				})
			},
			// 顶踩操作
			doSupport(e) {
					let list = this.tabList[this.tabIndex].list
					if(list){
						list.forEach(item => {
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
					}
					let msg = e.type === "support"? "顶" : "踩"
				
					
			},
			tabChange(index) {
				this.tabIndex = index
				if(index ===0 ) return
				this.getList()
			},
			// 上拉加载更多
			// loadmore(index) {
			// 	// 拿到当前列表
			// 	let item = this.nweslist[index]
			// 	// 判断是否出于可加载状态（上拉加载更多）
			// 	if(item.loadmore !== "上拉加载更多") return
			// 	// 修改当前列表加载状态
			// 	item.loadmore = "加载中..."
			// 	// 请求数据
			// 	item.page++
				
			// 	this.getList()
			// },
			// 关注与取消关注
			doFollow() {
				this.chackAuth(()=>{
								let url = this.userinfo.isFollow ? '/unfollow' : '/follow'
								let msg = this.userinfo.isFollow ? '取消关注' : '关注'
								this.$H.post(url,{
									follow_id:this.user_id
								},{
									token:true
								}).then(res=>{
									this.userinfo.isFollow = !this.userinfo.isFollow
									uni.showToast({
										title: msg+'成功',
										icon: 'none'
									});
									uni.$emit('updateIndex')
									this.getList()
								})
							})
			},
			openUserInfo() {
				// 进入编辑资料
				uni.navigateTo({
					url: '../user-userInfo/user-userInfo',
				})
			},
			// 加入or移除黑名单
			doBlack() {
				this.chackAuth(()=>{
					let url = this.userinfo.isblack ? '/removeblack':'/addblack'
					let msg = this.userinfo.isblack ? '移出黑名单' : '加入黑名单'
					uni.showModal({
						content: '是否要'+msg,
						success: (res)=> {
							if (res.confirm) {
								this.$H.post(url,{
									id:this.user_id
								},{
									token:true
								}).then(res=>{
									this.userinfo.isblack = !this.userinfo.isblack
									uni.showToast({
										title: msg+'成功',
										icon: 'none'
									})
								})
							}
						}
					})
					
				})
			},
			// 打开聊天页面
			openChat() {
				let user = {
					user_id: this.user_id,
					username: this.userinfo.username,
					userpic: this.userinfo.userpic
				}
				this.navigateTo({
						url: "/pages/user-chat/user-chat?user=" + JSON.stringify(user)					
				})				
			}
		}
	}
</script>

<style>

</style>
