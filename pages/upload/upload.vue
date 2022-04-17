<template>
	<view>
		<!-- 自定义导航 -->
		<uni-nav-bar left-icon="back" :statusBar="true" :border="false" @clickLeft="goBack()">
			<view class="flex justify-center align-center w-100">
				发布活动<text class="iconfont icon-shezhi"></text>
			</view>
		</uni-nav-bar>
		
		<view class="uni-form-item uni-column flex">
			<picker @change="bindPickerChange" :range="arrayType">	<!-- //@change用于获取下拉框改变的值，:range用于循环遍历array数组将数组内容循环 -->
				<label class="title font-sm font-weight-bold">活动类别：</label>
				<label class=" uni-list-cell-left border ">{{arrayType[indexType]}}</label>		<!-- //循环array数组index为索引 -->
			</picker>
		</view>
		
		  
			 
			 <view class="uni-list">
			     <view class="uni-list-cell">
			         <view class="uni-list-cell-left">
			            活动名称:
			         </view>
			         <view class="uni-list-cell-db">
			            <input class="uni-input" name="input" placeholder="这是一个输入框" />
			            
			         </view>
			     </view>
			 </view>
		
		
		        <view class="uni-list">
		            <view class="uni-list-cell">
		                <view class="uni-list-cell-left">
		                   活动日期
		                </view>
		                <view class="uni-list-cell-db">
		                    <picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
		                        <view class="uni-input">{{date}}</view>
		                    </picker>
		                </view>
		            </view>
		        </view>
		
		        <view class="uni-list">
		            <view class="uni-list-cell">
		                <view class="uni-list-cell-left">
		                    活动区域
		                </view>
		                <view class="uni-list-cell-db">
		                    <picker @change="bindPickerChange" :value="index" :range="array">
		                        <view class="uni-input">{{array[index]}}</view>
		                    </picker>
		                </view>
		            </view>
		        </view>
		
		        <view class="uni-list">
		            <view class="uni-list-cell">
		                <view class="uni-list-cell-left">
		                    活动时间
		                </view>
		                <view class="uni-list-cell-db">
		                    <picker mode="time" :value="time" start="09:01" end="21:01" @change="bindTimeChange">
		                        <view class="uni-input">{{time}}</view>
		                    </picker>
		                </view>
		            </view>
					</view>
					
					<view class="uni-list">
					    <view class="uni-list-cell">
					        <view class="uni-list-cell-left">
					           详细地址:
					        </view>
					        <view class="uni-list-cell-db">
					           <input class="uni-input" name="input" placeholder="这是一个输入框" />
					           
					        </view>
					    </view>
					</view>
					<view class="uni-list">
					    <view class="uni-list-cell">
					        <view class="uni-list-cell-left">
					           报名人数:
					        </view>
					        <view class="uni-list-cell-db">
					           <input class="uni-input" name="input" type="number"  placeholder="请输入数字" />
					           
					        </view>
					    </view>
					</view>
					
		<!-- 文本域组件  v-model双向绑定-->
		<textarea v-model="content" placeholder="备注信息:"  maxlength="100"class="uni-textarea px-2" />
		<!-- 多图上传 -->
		<upload-image :show="show" ref="uploadImage" :list='imageList' @change="changeImage"></upload-image>
		<!-- 底部操作条 -->
		<view class="fixed-bottom bg-white flex align-center" style="height: 85rpx;">
			<view class="iconfont icon-caidan footer-btn animate__animated" hover-class="animate__jello"></view>
			<view class="iconfont icon-huati footer-btn animate__animated" hover-class="animate__jello"></view>
			<view class="iconfont icon-tupian footer-btn animate__animated" hover-class="animate__jello" @click="iconClickEvent('uploadImage')"></view>
			<view class="bg-main text-white ml-auto flex align-center justify-center rounded mr-2 animate__animated" hover-class="animate__jello" style="width: 140rpx; height: 60rpx;" @click="upload">发布活动</view>
		</view>
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni-ui/uni-nav-bar/uni-nav-bar.vue';
	import uploadImage from '../../components/common/upload-image.vue';
	export default {
		data() {
			  const currentDate = this.getDate({
			            format: true
			        })
			        return {
						arrayType:['棋盘','唱歌','跳舞','书法','其他'],
						indexType:0,

			            title: 'picker',
			            array: ['中国', '美国', '巴西', '日本'],
			            index: 0,
			            date: currentDate,
			            time: '12:01',
						content: '',
						imageList: [],
						// 是否已经弹出提示框
						showBack: false
			        }
		
		},
		components: {
			uniNavBar,
			uploadImage
		},
		computed: {
			show() {
				return this.imageList.length > 0; 
			}
		},
		// 监听返回
		onBackPress() {
			if ((this.content !== '' || this.imageList.length > 0) && !this.showBack) {
				uni.showModal({
					title: '返回提示',
					content: '是否要保存为草稿？',
					showCancel: true,
					cancelText: '不保存',
					confirmText: '保存',
					success: res => {
						// 点击确认
						if (res.confirm) {
							this.store();
						}
						// 点击取消
						else {
							uni.removeStorage({
								key: 'add-input'
							});
						}
						// 手动执行返回
						uni.navigateBack({
							delta: 1
						});
					}
				});
				this.showBack = true;
				return true;
			}
		},
		// 页面加载
		onLoad() {
			uni.getStorage({
				key: 'add-input',
				success: (res) => {
					console.log(res);
					if (res.data) {
						let result = JSON.parse(res.data);
						this.content = result.content;
						this.imageList = result.imageList;
					}
				}
			})
		},
		    computed: {
		        startDate() {
		            return this.getDate('start');
		        },
		        endDate() {
		            return this.getDate('end');
		        }
		    },
		methods: {
			
			upload(){
				uni.switchTab({
									url: '/pages/index/index'
								});
			},
						
						//进入页面隐藏tabbar，离开显示tabbar
								onShow() {
									uni.hideTabBar({})
								},
								onHide() {
									uni.showTabBar({})
								},
					
			//活动类型
			bindPickerChange(e){
				//console.log('picker发送选择改变，携带值为', e.target.value)   用于输出改变索引值
					this.indexType = e.target.value			//将数组改变索引赋给定义的index变量
					this.jg=this.arrayType[this.indexType]		//将array【改变索引】的值赋给定义的jg变量
				//	console.log("籍贯为：",this.jg)		//输出获取的籍贯值，例如：中国
				
			},
			changeImage(e) {
				console.log(e);
				this.imageList = e;
			},
			// 保存草稿
			store() {
				let obj = {
						content: this.content,
						imageList: this.imageList
				};
				// 保存为本地存储
				uni.setStorage({
					key: 'add-input',
					data: JSON.stringify(obj)
				})
			},
			// 返回上一步
			goBack() {
				uni.switchTab({
									url: '/pages/index/index'
								});
			},
			// 底部图标点击事件
			iconClickEvent(e) {
				switch (e){
					case 'uploadImage':
					this.$refs.uploadImage.chooseImage();
					break;
				}
			},
			bindPickerChange: function(e) {
			            console.log('picker发送选择改变，携带值为', e.target.value)
			            this.index = e.target.value
			        },
			        bindDateChange: function(e) {
			            this.date = e.target.value
			        },
			        bindTimeChange: function(e) {
			            this.time = e.target.value
			        },
			        getDate(type) {
			            const date = new Date();
			            let year = date.getFullYear();
			            let month = date.getMonth() + 1;
			            let day = date.getDate();
			
			            if (type === 'start') {
			                year = year - 60;
			            } else if (type === 'end') {
			                year = year + 2;
			            }
			            month = month > 9 ? month : '0' + month;
			            day = day > 9 ? day : '0' + day;
			            return `${year}-${month}-${day}`;
			        }
			    
		}
	}
</script>

<style>
	.footer-btn {
		width: 86rpx;
		height: 86rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 50rpx;
	}
</style>
