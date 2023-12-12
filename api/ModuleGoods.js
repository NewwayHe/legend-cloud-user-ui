import request from '@/utils/request'

// 商品服务相关API
const goodsApi = {
	// 获取商品详情(含团购、拼团、秒杀等活动)
	productViews: (data) => request.get('/product/views', data),

	// 详情页-商品收藏
	isExistsFavorite: (data) => request.get(`/product/p/isExistsFavorite`, data),

	// 商品收藏/取消
	saveFavorite: (data) => request.post(`/product/p/favoriteProduct/saveFavorite`, data),

	// 获取商品收藏列表
	favoriteProductPage: (data) => request.get(`/product/p/favoriteProduct/page`, data),

	// 获取店铺收藏列表
	favoriteShopPage: (data) => request.get(`/shop/p/favorite/shop/page`, data),

	// 批量取消店铺收藏
	shopFavoritesDel: (data) => request.delete(`/shop/p/favorite/shop/favorites`, data),


	// 详情页-评论
	commentPage: (data) => request.get(`/product/comment/page`, data),

	// 详情页-评论-统计
	commentAalysis: (data) => request.get(`/product/comment/analysis`, data),

	// 详情页-评论总分
	getComScore: (data) => request.get(`/product/comment/getComScore`, data),

	// 详情页-sku的优惠券
	// goodCoupon: (data) => request.get(`/coupon/receivable`, data),

	// 领取优惠券
	getCoupon: (data) => request.post(`/activity/p/coupon/${data}`),

	// 详情页-sku的优惠券/促销信息
	marketingActivity: (data) => request.get(`/activity/marketingActivity`, data, {
		isShowToast: false
	}),

	// 【用户】添加到货通知
	productArrivalNoticeSave: (data) => request.post(`/product/p/productArrivalNotice/save`, data),
	//商品快照
	productSnapshot: (data) => request.get(`/product/snapshot/get`, data),

}

//  商品分类
const goodCategory = {
	// 获取商品分类
	getCategory: (data) => request.get('/product/category', data),

	// 【通用】查询所有在线的品牌
	allOnline: (data) => request.get('/product/brand/all', data),

	// 获取分类设置
	getCateSetting: (data) => request.get('/shop/p/app/setting/category', data),
	
	// 【用户】根据分类id查询广告列表
	catAdvert: (data) => request.get('/shop/p/catAdvert', data)
}

// 关于搜索的接口
const search = {
	// 搜索商品接口(装修的话不showLoadding,不ShowToast)
	searchProduct: (data) => request.post('/search/product', data, { isShowToast: false	}),
	// 搜索用户接口
	queryAllUser: (data) => request.postForm('/user/ordinary/user/queryAllUser', data),
	// 搜索店铺接口
	searchShop: (data) => request.get('/shop/shopDetail/searchShop', data)
}

export {
	goodsApi,
	goodCategory,
	search,
}
