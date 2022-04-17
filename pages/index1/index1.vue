<template>
	<view class="index">
		<view class="new_box" style="margin-top: 20upx;">
			<view class="bbox">
				<view class="list-box" v-for="(item,index) in newsList" :key="index">
					<view class="list-ed">
						<!-- <image class="list-img" :src="item.src" mode="aspectFill"></image> -->
						<view class="list-right">
							<!-- <view class="list-head" @click="choice(index)">
								<view :class="[item.selected?'selde':'noselde']">{{item.selected?"已关注":"未关注"}}<text :class="[item.selected?'selde-q':'noselde-q']"></text></view>
							</view> -->
							<view style="line-height: 1.5; font-size: 25rpx;font-weight:bold;" class="list-da ">{{item.activityname}}</view>
							<view style="line-height: 1.5;" class="list-da">
								<view>人数限制:<text>{{item.people_max}}</text></view>
								
							</view>
							<view style="line-height: 1.5;" class="list-da">活动时间:{{item.newstime}}</view>
							
							<view class="list-da">
								<view  style="line-height: 1.5;" >查看详情</view>
							</view>
							
							<view class="list-da"  v-show="item.showUp"> 
								<view class="font-sm text-light-muted" style="line-height: 1.5;">{{item.now_people}}人已报名</view>
								<button size="mini" @click="baoming(item)">报名活动</button>
							</view>
								
							<view class="list-da" v-show="!item.showUp">
								<view class="font-sm text-light-muted" style="line-height: 1.5;">{{item.now_people}}人已报名</view>
								<button  style="background-color:  #ff4d4d;;"size="mini" @click="baoming(item)">已报名</button>
							</view>
								
							
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
 
<script>
	
	import act1 from '@/components/common/act1.vue';
	import loadMore from '@/components/common/loadmore.vue';
	
	export default {
		data() {
			return {
				
				 scrollTop: 0,
					old: {
				                scrollTop: 0
				            },
				 newsList :[
					 {
					 		activityname:"登山",
					 		newstime:"2022-06-02",showUp:true,
					 		 people_max:"50",
					 		now_people:"4"
					 },
					 
					 {
					 		activityname:"下象棋",
					 		newstime:"2022-05-31",showUp:true,
					 		 people_max:"30",
					 		now_people:"23"
					 },
					 
					{
							activityname:"下象棋",
							newstime:"2022-06-10",
							 people_max:"20",showUp:true,
							now_people:"5"
					},{
							activityname:"五子棋",
							newstime:"2022-06-10",
							 people_max:"20",showUp:true,
							now_people:"5"
					},{
							activityname:"老年人大合唱团",
							newstime:"2022-06-10",
							 people_max:"20",showUp:true,
							now_people:"5"
					},{
							activityname:"文艺汇演",
							newstime:"2022-06-10",showUp:true,
							 people_max:"20",
							now_people:"5"  
					},{
							activityname:"下象棋",
							newstime:"2022-06-10",
							 people_max:"20",showUp:true,
							now_people:"5"
					},{
							activityname:"下象棋",
							newstime:"2022-06-10",showUp:true,
							 people_max:"20",
							now_people:"5"
					},
					
				
				{
						activityname:"四人麻将",
						newstime:"2022-01-10",showUp:true,
						 people_max:"4",
						now_people:"2"
				},{
						activityname:"围棋训练",
						newstime:"2019-12-01",showUp:true,
						 people_max:"40",
						now_people:"23"
				},
				{
						activityname:"新月广场舞团活动",
						newstime:"2021-11-11",showUp:true,
						 people_max:"80",
						now_people:"12"
				},
				{
						activityname:"麻将",
						newstime:"2021-09-09",showUp:true,
						 people_max:"8",
						now_people:"6"
				},
				{
						activityname:"下象棋",
						newstime:"2021-09-01",showUp:true,
						 people_max:"12",
						now_people:"7"
				},
				{
						activityname:"老年人大合唱团",
						newstime:"2021-08-20",showUp:true,
						 people_max:"20",
						now_people:"5"
				},
				{
						activityname:"跳大绳",
						newstime:"2021-07-31",showUp:true,
						 people_max:"50",
						now_people:"44"
				},
				{
						activityname:"一起下象棋",
						newstime:"2021-07-07",showUp:true,
						 people_max:"20",
						now_people:"5"
				},
				{
						activityname:"广场舞",
						newstime:"2021-06-31",showUp:true,
						 people_max:"65",
						now_people:"56"
				},
				{
						activityname:"下象棋",
						newstime:"2022-6-10",showUp:true,
						 people_max:"20",
						now_people:"5"
				}
				
					
					
					
					
					
					
				]	,	selectId:[],
					}
		},
		components: {
			act1,
			loadMore
		},
		  methods: {
			  baoming:function(item){
				 item.now_people++;
				 item.showUp=!item.showUp;
				   
			  },
		        upper: function(e) {
		            console.log(e)
		        },
		        lower: function(e) {
		            console.log(e)
		        },
		        scroll: function(e) {
		            console.log(e)
		            this.old.scrollTop = e.detail.scrollTop
		        },
		        goTop: function(e) {
		            this.scrollTop = this.old.scrollTop
		            this.$nextTick(() => {
		                this.scrollTop = 0
		            });
		            uni.showToast({
		                icon:"none",
		                title:"纵向滚动 scrollTop 值已被修改为 0"
		            })
		        }
		    }
	
	}
	
	
	

</script>
 
<style>
	page{
		background-color: #eee;
	}
	/* 已选择 */
	.selde {
		
		border: 1px solid black;
		background: black;
		color: #f0f0f0;
		border-radius: 20upx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 20upx;
		padding: 0 10upx;
	}
 
	.selde-q {
		
		width: 18upx;
		height: 18upx;
		border-radius: 50%;
		background: #ffffff;
		margin-left: 6upx;
	}
 
	/* 未选择 */
	.noselde {
		
		border: 1px solid #959595;
		background: #FFFFFF;
		color: #959595;
		border-radius: 20upx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 20upx;
		padding: 0 10upx;
	}
 
	.noselde-q {
		
		border: 1px solid #959595;
		width: 16upx;
		height: 16upx;
		border-radius: 50%;
		background: #FFFFFF;
		margin-left: 6upx;
	}
	.list-box {
		
		display: flex;
		flex-direction: column;
		background-color: #fff;
		margin: 0upx 16upx 16upx 16upx;
		padding: 16upx;
		border-radius: 10upx;
	
	}
 
	.list-ed {
		font-size: 40rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
 
	.list-left {
		margin-right: 16upx;
	}
 
	.list-img {
		
		width: 160upx;
		height: 160upx;
		margin: 0upx 16upx 0upx 0upx;
	}
 
	.list-right {
		
		display: flex;
		flex-direction: column;
		width: 510upx;
		height: 180upx;
	}
 
	.list-right-img {
		width: 140upx;
		height: 38upx;
	}
 
	.noadsop {
		width: 120upx;
		height: 32upx;
	}
 
	.list-head {
		
		display: flex;
		justify-content: flex-end;
		margin-bottom: 10upx;
	}
 
	.list-name {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		/* margin-bottom: 10upx; */
		
	}
 
	.list-da {
	
		display: flex;
		flex-direction: row;
		font-size: 26upx;
	}
 
	.list-da view {
		
		width: 50%;
	}
 
	.list-da view text {
		
		color: f0f0f0;
	}
 
	.sure {
		
		background: #FF6000;
		color: #FFFFFF;
		width: 600upx;
		height: 70upx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 40upx;
		margin: 60upx auto;
	}

</style>