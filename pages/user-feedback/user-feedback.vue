<template>
	<view>
		<uni-collapse  accordion>
			<uni-collapse-item title="客服什么时候在线？">
				<view class="p-2">
					<text class="text">亲爱的悠友~客服在线时间为：周一至周六10：00-12:00， 14:00-19:00</text>
				</view>
			</uni-collapse-item>
			<uni-collapse-item title="忘记账号密码怎么办？">
				<view class="p-2">
					<text class="text">手风琴效果同时只会保留一个组件的打开状态，其余组件会自动关闭。</text>
				</view>
			</uni-collapse-item>
			<uni-collapse-item title="怎么搜索/查找,关注/取关用户？">
				<view class="p-2">
					<text class="text">手风琴效果同时只会保留一个组件的打开状态，其余组件会自动关闭。</text>
				</view>
			</uni-collapse-item>
		</uni-collapse>
	</view>
</template>

<script>
	import uniCollapseItem from "../../components/uni-ui/uni-collapse-item/uni-collapse-item.vue"
	import uniCollapse from "../../components/uni-ui/uni-collapse/uni-collapse.vue"
	export default {
		components:{
			uniCollapseItem,
			uniCollapse
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
