// 引入SDK核心类
var QQMapWX = require('./qqmap-wx-jssdk.js');
var qqmapsdk;

var addressdata = function(){
	return new Promise((resolve,reject)=>{
		// 实例化API核心类
		qqmapsdk = new QQMapWX({
			key: 'D2PBZ-MXJED-JDA4V-PQJNF-45NEJ-7LFXR'
		});
		qqmapsdk.reverseGeocoder({
			success:(res)=>{
				resolve(res)
			},
			fail:(err)=>{
				reject(err)
			}
		})
	})
}

//公用预览图片
var preview = function(index,imglist){
	return new Promise((resolve,reject)=>{
		uni.previewImage({
			current:index,
			urls: imglist,
			longPressActions: {
				itemList: ['发送给朋友', '保存图片', '收藏'],
			}
		})
		.then((res)=>{
			resolve(res)
		})
		.catch((err)=>{
			reject(err)
		})
	})
}

//公用存储用户登录数据
var login = function(user){
	return new Promise((resolve,reject)=>{
		let db = wx.cloud.database()
		let users = db.collection('user')
		users.add({
			data:user
		})
		.then((res)=>{
			resolve(res)
		})
		.catch((err)=>{
			reject(err)
		})
	})
}



export {addressdata,preview,login}