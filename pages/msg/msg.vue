<template>
	<view>
		<!-- 导航 -->
		<!-- #ifndef APP-PLUS -->
		<uni-nav-bar :shadow="false" :border="false"
		@click-left="clickLeft" @click-right="clickRight" title="消息列表">
			<!-- 左边图标 -->
			<block slot="left">
				<view class="iconfont icon-user-detail mx-2" 
				style="font-size: 22px;"></view>
			</block>
			<!-- 右边图标 -->
			<block slot="right">
				<view class="icon iconfont icon-zengjia" 
				style="font-size: 22px;"></view>
			</block>
		</uni-nav-bar>
		<!-- #endif -->
		<!-- 消息列表 -->
		<template v-if="list.length > 0">
			<block v-for="(item,index) in list" :key="index">
				<msg-list :item="item" :index="index"></msg-list>
			</block>
		</template>
		<template v-else>
			<!-- 空白页组件 -->
			<no-thing></no-thing>
		</template>
		<!-- 弹出层 -->
		<uni-popup ref="popup" type="top" background-color="#fff">
			<view class="flex justify-center align-center border-bottom border-light-secondary p-2" hover-class="bg-hover-light" @click="popupTabChange('search')">
				<text class="iconfont icon-sousuo mr-2"></text>
				<text class="font-md">搜索好友</text>
			</view>
			<view class="flex justify-center align-center p-2 " hover-class="bg-hover-light" @click="popupTabChange('clear')">
				<text class="iconfont icon-shanchu  mr-2"></text>
				<text class="font-md">清除列表</text>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	// #ifndef APP-PLUS
	import uniNavBar from "@/components/uni-ui/uni-nav-bar/uni-nav-bar.vue"
	// #endif
	import msgList from "@/components/msg/msg-list.vue"
	import uniPopup from "@/components/uni-ui/uni-popup/uni-popup.vue"
	import noThing from "@/components/common/noThing.vue"
	import { mapState } from "vuex"
	export default {
		components:{
			msgList,
			uniPopup, 
			noThing,
			// #ifndef APP-PLUS
			uniNavBar
			// #endif
			},
		data() {
			return {
				
			}
		},
		// 监听原生导航栏按钮点击事件
		onNavigationBarButtonTap(e) {
			switch (e.index){
				case 0:
					this.$refs.popup.close()
					uni.navigateTo({
						url:"../user-list/user-list"
					})
					break;
				case 1:
					this.$refs.popup.open()
					break;	
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.pullDownRefresh()
		},
		computed: {
			...mapState({
				list: state => state.chatList
			})
		},
		methods: {
			
			// #ifndef APP-PLUS
			clickLeft() {
				this.$refs.popup.close()
				uni.navigateTo({
					url:"../user-list/user-list"
				})
			},
			clickRight() {
				this.$refs.popup.open()
			},
			// #endif
			
			// 下拉刷新
			pullDownRefresh() {
				setTimeout(()=> {
					this.list = [...this.list, ...this.list]
					uni.stopPullDownRefresh()
				},1000)
			},
			// 弹出窗口tab点击事件
			popupTabChange(e) {
				switch(e) {
					case "search":
						uni.navigateTo({
							url:"../search/search?type=user"
						})
						this.$refs.popup.close()
					break;
					case "clear":
						console.log("清除列表")
						this.$refs.popup.close()
					break;
				}
			}
		}
	}
</script>

<style>

</style>
