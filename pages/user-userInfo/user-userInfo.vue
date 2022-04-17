<template>
	<view>
		<uni-list-item title="头像" :border="false" link @click="changeUserPic">
			<view slot="footer">
				<image :src="user.userpic? user.userpic : '/static/demo/userpic/12.jpg'" style="width: 75rpx; height: 75rpx;" class="rounded-circle"></image>
			</view>
			<text slot="rightIcon" class="iconfont icon-bianji1 px-2"></text>
		</uni-list-item>
		<uni-list-item title="昵称" :border="false" link >
			<view slot="footer" >
				<input type="text" v-model="username" class="uni-input text-right bg-transparent pr-0" />
			</view>
			<text slot="rightIcon" class="iconfont icon-bianji1 px-2"></text>
		</uni-list-item>
		<uni-list-item title="性别" :border="false" link @click="changeSex">
			<view slot="footer" >
				<text>{{sexText}}</text>
			</view>
			<text slot="rightIcon" class="iconfont icon-bianji1 px-2"></text>
		</uni-list-item>
		<picker mode="date" :value="date" @change="bindDateChange">
		  <uni-list-item title="生日" :border="false" link>
		  	<view slot="footer" >
		  		<text>{{date}}</text>
		  	</view>
		  	<text slot="rightIcon" class="iconfont icon-bianji1 px-2"></text>
		  </uni-list-item>
		</picker>
		
		<uni-list-item title="情感" :border="false" link @click="changeEmotion">
			<view slot="footer" >
				<text>{{emotionText}}</text>
			</view>
			<text slot="rightIcon" class="iconfont icon-bianji1 px-2"></text>
		</uni-list-item>
		<uni-list-item title="职业" :border="false" link @click="changeJob">
			<view slot="footer" >
				<text>{{job}}</text>
			</view>
			<text slot="rightIcon" class="iconfont icon-bianji1 px-2"></text>
		</uni-list-item>
		<uni-list-item title="家乡" :border="false" link @click="changeCity">
			<view slot="footer" >
				<text>{{cityText}}</text>
			</view>
			<text slot="rightIcon" class="iconfont icon-bianji1 px-2"></text>
		</uni-list-item>
		
		<!-- 按钮 -->
		<view class="py-2 px-3">
			<button style="border-radius: 50rpx; border: 0; background-color: #FF4A6A; color: #fff;" plain @click="submit">完成</button>
		</view>
		
		<!-- 城市三联选择器 -->
		<mpvue-city-picker ref="mpvueCityPicker" :pickerValueDefault="pickerValueDefault" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
	import uniListItem from "@/components/uni-ui/uni-list-item/uni-list-item.vue"
	import mpvueCityPicker from "@/components/uni-ui/mpvue-citypicker/mpvueCityPicker.vue"
	import { mapState } from "vuex"
	const sexList = ["保密","男", "女"]
	const emotionList = ["保密","已婚", "未婚"]
	export default {
		components:{
			uniListItem,
			mpvueCityPicker
		},
		data() {
			return {
				username:"昵称",
				sex:0,
				emotion:0,
				job:"保密",
				date:"2021-12-31",
				pickerValueDefault:[0,0,0],
				cityText:"北京市-市辖区-东城区"
			}
		},
		computed:{
			...mapState({ 
				user: state => state.user
			}),
			// 性别
			sexText() {
				return sexList[this.sex]
			},
			// 情感状态
			emotionText() {
				return emotionList[this.emotion]
			}
		},
		// 监听页面返回
		onBackPress() {
			if(this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel()
			}
		},
		// 监听页面卸载
		onUnload() {
			if(this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel()
			}
		},
		onLoad() {		 
			 this.username = this.user.username
			 this.sex = this.user.userinfo.sex
			 this.emotion = this.user.userinfo.qg
			 this.job = this.user.userinfo.job
			 this.date = this.user.userinfo.birthday
			 this.cityText = this.user.userinfo.birthday
		},
		methods: {
			// 修改头像
			changeUserPic() {
				uni.chooseImage({
					count:1,
					sizeType:["compressed"],
					success: (res) => {
						// 上传头像
						this.$H.upload("/edituserpic", { 
							token: true,
							name: "userpic",
							filePath: res.tempFilePaths[0]
						}).then(result => {
							console.log(result)
							this.$store.commit("editUserInfo", { 
								key: "userpic",
								value: result.data
							})
							// 弹出提示框
							uni.showToast({
								title: "修改头像成功",
								icon: "none"
							})
						})
					},
					fail: (err)=> {
						console.log(err)
					}
				})
			},
			// 修改性别
			changeSex() {
				uni.showActionSheet({
					itemList: sexList,
					success: (res) => {
						this.sex = res.tapIndex
					}
				})
			},
			// 修改情感状态
			changeEmotion() {
				uni.showActionSheet({
					itemList:emotionList,
					success: (res) => {
						this.emotion = res.tapIndex
					}
				})
			},
			// 修改职业
			changeJob() {
				let jobList = ["IT", "教师", "自由职业", "医生"]
				uni.showActionSheet({
					itemList: jobList,
					success: (res) => {
						this.job = jobList[res.tapIndex]
					}
				})
			},
			// 修改生日
		 bindDateChange: function(e) {
				this.date = e.target.value
			},
			// 修改城市
			changeCity() {
				this.$refs.mpvueCityPicker.show()
			},
			onConfirm(e) {
				this.cityText = e.label
			},
			// 提交
			submit() {
				let obj = {
					name: this.username,
					sex: this.sex,
					qg: this.emotion,
					job: this.job,
					birthday: this.date,
					path: this.cityText
				}
				// 发送请求
				this.$H.post("/edituserinfo", obj, { token: true })
				.then(res => {
					console.log(res)
					// 数据存储到VUX
					this.$store.commit("editUserInfo", {
						key: "username",
						value: this.username
					})
					this.$store.commit("editUserUserInfo", obj)
					// 返回
					uni.navigateBack({
						delta: 1
					})
					// 弹出消息
					uni.showToast({
						title: "修改资料成功",
						icon: "none"
					})
				})
				.catch(err => {
					console.log(err)
				})
			}
		}
	}
</script>

<style>

</style>
