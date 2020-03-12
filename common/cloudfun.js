// promise封装
const db = wx.cloud.database()        //指定要操作的数据库
//请求轮播
var home = function(banner){
	return new Promise((resolve,reject)=>{
		const banners = db.collection(banner)   //指定请求的数据集合
		banners.get()
		.then((res)=>{
			resolve(res)
		})
		.catch((err)=>{
			reject(err)
		})
	})
}

//攻略列表的数据
var homeList = function(listing,pageid){
	return new Promise((resolve,reject)=>{
		const listdata = db.collection(listing)   //指定请求的数据集合
		.limit(6)  		//开始拉取的数据
		.skip(pageid*6)   //拉取数据的索引
		listdata.get()
		.then((res)=>{
			resolve(res)
		})
		.catch((err)=>{
			reject(err)
		})
	})
}


export {home,homeList}