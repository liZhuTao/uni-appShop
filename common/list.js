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

export {addressdata}