<script>
	export default {
		onLaunch () {
			console.log('App Launch')
			// 监听网络状态
			this.$U.onNetWork()
			//监听更新
			// #ifdef APP-PLUS
			// this.$U.updata()
			// #endif
			
			// 初始化登录状态
			this.$store.dispatch("user")
			
			
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/* uniApp官方样式 */
	@import "./common/uni.css";
	/* 图标库 */
	@import "./common/iconfont.css";
	/* animate 动画库 */
	@import "./common/animate.min.css";
	/* 自定义样式库 */
	@import "./common/free.css";
	/* 本项目公共样式 */
	@import "./common/common.css";
	/* 隐藏滚动条 */
	::-webkit-scrollbar{
		display: none;
	}
</style>
