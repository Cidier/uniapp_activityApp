<template>
	<view>
		<!-- 自定义导航栏 -->
		<uni-nav-bar left-icon="back"  :border="false" statusBar @clickLeft="toBack">
			<view class="w-100 flex justify-center align-center font" @click="changeIsopen">
				{{ isopenText }}<text class="iconfont icon-shezhi"></text>
			</view>
		</uni-nav-bar>
		
		<!-- 文本域 -->
		<textarea v-model="textareaValue" placeholder="说点什么吧~" class="w-100 p-2"/>
		<!-- 选中的分类 -->
		<!-- <view class="font-md px-2 py-1 flex">
			<view class="border px-3 py main-color main-border-color flex align-center justify-center" style="border-radius: 50rpx;">
				<text class="iconfont icon-huati mr-1"></text>
				{{post_class_name ? "所属分类："+post_class_name : "请选择分类"}}
			</view>
		</view> -->
		<!-- 选中的话题 -->
		<!-- <view class="font-md px-2 py-1 flex">
			<view class="border px-3 py main-color main-border-color flex align-center justify-center" style="border-radius: 50rpx;">
				<text class="iconfont icon-huati mr-1"></text>
				{{topic.title ? "所属话题："+topic.title : "请选择话题"}}
			</view>
		</view> -->
		<!-- 图片上传 -->
		<uploadImage @change="changeImage" :draftImg ="imageList" ref="uploadImage" :show="show"></uploadImage>
		
		<!-- 底部选项卡 -->
		<view class="flex fixed-bottom bg-white" style="height: 86rpx;">
			<!-- <picker mode="selector" :range="range" @change="changePostClass">
				<view class="iconfont icon-caidan animated bottom-btn" hover-class="jello"></view>
			</picker> -->
			<!-- <view class="iconfont icon-huati animated bottom-btn" hover-class="jello" @click="chooseTopic"></view> -->
			<view class="iconfont icon-tupian animated bottom-btn" hover-class="jello" @click="iocnUploadImg('uploadImage')"></view>
			<view class="flex justify-center align-center ml-auto bg-main text-white mr-2 rounded animated" hover-class="jello" style="width: 142rpx; height: 60rpx;" @click="submit">发送</view>
		</view>
	</view>
</template>

<script>
	const openText = ["仅自己可见", "所有人可见"]
	import uniNavBar from "@/components/uni-ui/uni-nav-bar/uni-nav-bar.vue"
	import uploadImage from "@/components/common/upload-image.vue"
	export default {
		components: {
			uniNavBar,
			uploadImage
		},
		data() {
			return {
				textareaValue: '',
				imageList: [],
				// 是否已经显示保存草稿提示
				showBack : false,
				isopen: 1,
				topic: {
					id: 0,
					title: ""
				},
				post_class_list: [],
				post_class_index: -1
			}
		},
		onLoad() {
			// 获取本地草稿数据缓存
			try {
			    const value = uni.getStorageSync('draft');
			    if (value) {
							let draftInfo = JSON.parse(value)
			        this.textareaValue = draftInfo.textareaValue
							this.imageList = draftInfo.imageList
			    }
			} catch (e) {
			    // error
			}
			// 监听话题选择事件
			uni.$on("chooseTopic", (e)=> {
				this.topic.id = e.id
				this.topic.title = e.title
			})
			// 获取所有文章分类
			this.getPostClass()
		},
		beforeDestroy() {
			uni.$off("chooseTopic", (e)=> {})
		},
		computed: {
			// 控制 没有上传图片的时候 上传图片窗口隐藏
			show() {
				return this.imageList.length > 0
			},
			isopenText() {
				return openText[this.isopen]
			},
			// 分类可选项
			range() {
				return this.post_class_list.map(item => {
					return item.classname
				})
			},
			post_class_id() {
				if(this.post_class_index !== -1) {
					return this.post_class_list[this.post_class_index].id
				}
			},
			imgListIds() {
				return this.imageList.map(item => {
					return {
						id: item.id
					}
				})
			},
			post_class_name() {
				if(this.post_class_index !== -1) {
					return this.post_class_list[this.post_class_index].classname
				}
			}
		},
		methods: {
			// 发布文章
			submit() {
				// if(this.topic.id == 0) {
				// 	return uni.showToast({
				// 		title: "请选择话题",
				// 		icon: "none"
				// 	})
				// }
				// if(this.post_class_id == 0) {
				// 	return uni.showToast({
				// 		title: "请选择分类",
				// 		icon: "none"
				// 	})
				// }
				uni.showLoading({
					title: '发布中...',
					mask: false
				})
				this.$H.post("/post/create",{
						imglist:JSON.stringify(this.imgListIds),
						text: this.textareaValue,
						isopen: this.isopen,
						topic_id:1,//this.topic.id
						post_class_id: 1 //this.post_class_id
			}, { token: true })
				.then(res=> {
					uni.hideLoading()
					uni.$emit("updateIndex")
					uni.showToast({
						title: "发布成功",
						icon: "none"
					})
					this.showBack = true
					uni.navigateBack({
						delta: 1
					})
					
				})
				.catch(err => {
					uni.hideLoading()
				})
			},
			// 获取所有文章分类
			getPostClass() {
				this.$H.get("/postclass")
				.then(res => {
					this.post_class_list = res.list
				})
			},
			// 选择文章分类
			changePostClass(e) {
				
				this.post_class_index = e.detail.value
			},
			// 选择话题
			chooseTopic() {
				uni.navigateTo({
					url: '../topicCate/topicCate?choose=true',
				})
			},
			// 切换可见状态
			changeIsopen() {
				uni.showActionSheet({
					itemList: openText,
					success: res => {
						this.isopen = res.tapIndex
					}	
				})
			},
			// 监听 底部图片 icon 点击 上传图片
			iocnUploadImg(e) {
				switch(e){
					case "uploadImage":
					this.$refs.uploadImage.chooseImage()
						break;
	
				}
			},
			// 点击左上角返回箭头
			toBack() {
				uni.navigateBack({delta: 1})
			},
			//  获取选中图片  |  删除图片
			changeImage(e) {
				this.imageList = e

			},
			//  保存为草稿，把数据存储在本地
			draft() {
				let draftInfo = {
					textareaValue: this.textareaValue,
					imageList: this.imageList
				}
				uni.setStorageSync("draft", JSON.stringify(draftInfo))
			}
		},
		//  监听页面返回 保存草稿
		onBackPress() {
			// 提示是否要保存草稿
			if ((this.textareaValue !== "" || this.imageList.length > 0) && !this.showBack) {
				uni.showModal({
					title:"提示",
					cancelText: "不保存",
					confirmText: "保存",
					content:"是否保存为草稿",
					success: res => {
						if (res.confirm) {
							this.draft()
							} else {
								uni.removeStorageSync("draft")
							}
						// 手动返回
						uni.navigateBack({ delta: 1 })
					}
				})
				this.showBack = true
				return true
			}
			
		}
	}
</script>

<style>
.bottom-btn {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 86rpx;
	height: 86rpx;
	font-size: 60rpx;
}
</style>
