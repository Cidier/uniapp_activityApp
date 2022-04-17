import $http from "@/common/request.js"
export default {
	// 监听网络
	onNetWork() {
		let fuc = res => {
						if(res.networkType==="none") {
							uni.showToast({
								title: '当前没有网络哦~',
								icon:"none"
							})
						}
		    }
		uni.getNetworkType({
		    success: fuc
		})
		uni.onNetworkStatusChange(fuc)
	},
	// 热更新
	updata(showToast=false) {
		// #ifdef APP-PLUS
		plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) { 
				$http.post("/update",{
					ver:widgetInfo.version,
				}).then((res) => {
					let [err, result] = res
					// 错误处理
					if(!$http.errorCheck(err,result)) return
					// 成功
					var data = result.data.data
					if(!data.url) {
						if(showToast) {
							uni.showToast({title: "无需更新",icon: "none"})
						}
						return 
					} 
					uni.showModal({
						title: '发现新版本',
						content: '最新版本' + data.version,
						cancelText: '放弃更新',
						confirmText: '立即更新',
						success: res => {
							if(res.confirm) {
									uni.downloadFile({
										url: data.url,  
										success: (downloadResult) => {  
												if (downloadResult.statusCode === 200) {  
														plus.runtime.install(downloadResult.tempFilePath, {  
																force: false  
														}, function() {  
																console.log('install success...');  
																plus.runtime.restart();  
														}, function(e) {  
																console.error('install fail...');  
														});  
												}  
										}  
									})
							}
						}
					})
					
					
				})
		    // uni.request({  
		    //     url: 'https://ceshi.dishait.cn/api/v1/update',  
		    //     data: {  
		    //         version: widgetInfo.version,  
		    //         name: widgetInfo.name  
		    //     },  
		    //     success: (result) => {  
		    //         var data = result.data;  
		    //         if (data.update && data.wgtUrl) {  
		    //             uni.downloadFile({  
		    //                 url: data.wgtUrl,  
		    //                 success: (downloadResult) => {  
		    //                     if (downloadResult.statusCode === 200) {  
		    //                         plus.runtime.install(downloadResult.tempFilePath, {  
		    //                             force: false  
		    //                         }, function() {  
		    //                             console.log('install success...');  
		    //                             plus.runtime.restart();  
		    //                         }, function(e) {  
		    //                             console.error('install fail...');  
		    //                         });  
		    //                     }  
		    //                 }  
		    //             });  
		    //         }  
		    //     }  
		    // });  
		});  
		// #endif
	},
		// userinfo格式转换
	formatUserinfo(obj){
		// 第三方登录（已绑定）
		if (obj.user && obj.user_id > 0) {
			return {
				id: obj.user.id,
				username: obj.nickname || obj.user.username,
				userpic: obj.user.userpic || obj.avatarurl,
				phone: obj.user.phone,
				email: obj.user.email,
				status: obj.user.status,
				create_time: obj.user.create_time,
				logintype: obj.logintype,
				password:obj.user.password,
				token: obj.token,
				userinfo: {
					id: obj.user.userinfo.id,
					user_id: obj.user.userinfo.user_id,
					age: obj.user.userinfo.age,
					sex: obj.user.userinfo.sex,
					qg: obj.user.userinfo.qg,
					job: obj.user.userinfo.job,
					path: obj.user.userinfo.path,
					birthday: obj.user.userinfo.birthday,
				}
			}
		}
		// 第三方登录（未绑定）
		return {
			id: obj.user_id,
			username: obj.nickname,
			userpic: obj.avatarurl,
			phone: false,
			email: false,
			status: 1,
			create_time: false,
			logintype: obj.logintype,
			token: obj.token,
			userinfo: false
		}
	},
	// 置顶数组
	__toFirst(arr,index){
			if (index != 0) {
				arr.unshift(arr.splice(index,1)[0]);
			}
			return arr
		}
}