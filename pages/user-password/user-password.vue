<template>
	<view>
		<input v-if="user.password" class="uni-input" type="text" v-model="oldPassword" placeholder="请输入旧密码" />
		<input class="uni-input" type="text" v-model="newPassword" placeholder="请输入新密码" />
		<input class="uni-input" type="text" v-model="renewPassword" placeholder="请再次输入新密码确认" />
		
		<!-- 确认按钮 -->
		<view class="py-2 px-3">
			<button :disabled="disabled" :style="disabled? 'background-color:#F991AF' : ''" style="border-radius: 50rpx; border: 0; background-color: #FF4A6A; color: #fff;" plain @click="submit">确认</button>
		</view>
	</view>
</template>

<script>
	import { mapState } from "vuex"
	export default {
		data() {
			return {
				oldPassword:"0",
				newPassword:"",
				renewPassword:""
			}
		},
		computed: {
			...mapState({
				user: state => state.user
			}),
			disabled() {
				if(this.user.password) {
					return this.oldPassword === "" || this.newPassword === "" || this.renewPassword === ""
				}
				return this.newPassword === "" || this.renewPassword === ""
			}
		},
		methods: {
			// 验证
			check() {
				if(this.newPassword !== this.renewPassword) {
					uni.showToast({
						title:"两次密码输入不一致",
						icon:"none"
					})
					return false
				}
				return true
			},
			submit() {
				// 密码验证
				if(!this.check()) return
				// 发送修改密码请求
				this.$H.post("/repassword",{
					oldpassword: this.oldPassword,	
					newpassword: this.newPassword,
					renewpassword: this.renewpassword
				}, {
					token: true
				}).then(res => {
					// 修改成功，修改vux仓库状态
					this.$store.commit("editUserInfo", {
						key: "password",
						value: true
					})
					// 返回
					uni.navigateBack({
						delta: 1
					})
					// 弹出消息
					uni.showToast({
						title: "修改、设置密码成功",
						icon: "none"
					})
				})
			}
		}
	}
</script>

<style>

</style>
