import $C from "./config.js"
import $store from "@/store/index.js"
export default {
	common:{
		method: 'GET',
		header:{
			'content-type': 'application/json'
		},
		data: {}
	},
	request(options = {}){
			options.url = $C.webUrl + options.url
			options.data = options.data || this.common.data
			options.method = options.method || this.common.method
			options.header = options.header || this.common.header
			
			// 验证token
			if (options.token) {
				options.header.token = $store.state.token
				if (!options.noCheck && !options.header.token) {
					return uni.showToast({
						title: "非法token，请重新登录",
						icon: "none"
					})
				}
			}
			
			return new Promise((res, rej) => {
				uni.request({
					...options,
					success:(result)=> {
						// 返回原始数据
						if(options.back) {
							return res(result)
						}
						// 请求数据失败
						if(result.statusCode !== 200) {
							uni.showToast({
								title:"请求失败" || result.data.msg,
								icon:"none"
							})
							return rej(result.data)
						}
						// 请求数据成功
						return res(result.data.data)
					},
					fail: (err) => {
						uni.showToast({
							title:"请求失败" || err.errMsg,
							icon:"none"
						})
						return rej()
					}
				})
			})

	},
	get(url, data = {}, options = {}) {
		options.url = url
		options.data = data
		options.method = "GET"
		
		return this.request(options)
	},
	post(url, data = {}, options = {}) {
		options.url = url
		options.data = data
		options.method = "POST"
		return this.request(options)
	},
	// 获取首页公共列表
	formatCommonList(v) {
		let isFollow = (v.user.fens.length > 0)
		let support = ""
		if(v.support.length > 0) {
			support = v.support[0].type === 0? "support" : "nonsupport"
		}
		return {
				id: v.id,
				user_id: v.user_id,
				userName: v.user.username,
				userPic: v.user.userpic,
				newsDate: v.create_time,
				title: v.title,
				titlePic: v.titlepic,
				isFollow: isFollow,
				support: {
					type: support,
					support_count: v.ding_count,
					nonsupport_count: v.cai_count
				},
				comment_count: v.comment_count,
				share_count: v.sharenum
		}
	},
	// 上传文件
	upload(url, options= {}) {
		options.url = $C.webUrl + url
		options.header = options.header || {}
		// 验证token
		if (options.token) {
			options.header.token = $store.state.token
			if (!options.header.token) {
				return uni.showToast({
					title: "非法token，请重新登录",
					icon: "none"
				})
			}
		}
		return new Promise((res, rej) => {
			uni.uploadFile({
				...options,
				success: (uploadFileRes) => {
						if (uploadFileRes.statusCode !== 200) {
							return uni.showToast({
								title: "修改头像失败",
								icon: "none"
							})
						}
						let obj = JSON.parse(uploadFileRes.data)
						return res(obj)
				},
				fail: (err) => {
					return rej(err)
				}
			})
		})
	}
}