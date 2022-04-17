<template>
	<view>
		<input :disabled="user.email" class="uni-input" type="text" v-model="email" placeholder="请输入邮箱" />
		
		<!-- 确认按钮 -->
		<view class="py-2 px-3">
			<button :disabled="disabled || user.email" :style="disabled? 'background-color:#F991AF' : ''" style="border-radius: 50rpx; border: 0; background-color: #FF4A6A; color: #fff;" plain @click="submit">确认绑定</button>
		</view>
	</view>
</template>

<script>
	import { mapState } from "vuex"
	export default {
		data() {
			return {
				email:"",
				password:""
			}
		},
		computed: {
			...mapState({
				user: state => state.user
			}),
			disabled() {
				return this.email === ""
			}
		},
		methods: {
			check() {
				let rule = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
				if(!rule.test(this.email)) {
					uni.showToast({
						title:"邮箱格式不正确",
						icon:"none"
					})
					return false
				}
				return true
			},
			submit() {
				if(!this.check()) return
				// 发送请求绑定邮箱
				this.$H.post("/user/bindemail", {
					email: this.email
				}, {
					token: true
				}).then(res => {
					this.$store.commit("editUserInfo", {
						key: "email",
						value: this.email
					})
					uni.navigateBack({
						delta: 1
					})
					uni.showToast({
						title: "绑定邮箱成功",
						icon: "none"
					})
				})
				console.log("提交成功")
			}
		}
	}
</script>

<style>

</style>
