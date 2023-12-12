import request from '@/utils/request'

// 记录访问
const visitHm = (data) => request.get(`/basic/location/provinces`, data)

// 获取客服请求参数
const getMobileUrl = (data) => request.get('/shop/custom/user/toCustom', data)

// 关于地址的接口
const addressApi = {
	location: (parentId) => request.get(`/basic/location/children/${parentId}`),
	// 省
	provinces: () => request.get(`/basic/location/provinces`),
	// 城市
	cities: (data) => request.get(`/basic/location/${data}/cities`),
	// 地区
	areas: (data) => request.get(`/basic/location/${data}/areas`),
	// 街道
	streets: (data) => request.get(`/basic/location/${data}/streets`),
	// 【公共】根据经纬度获取系统内地址和省市区LocationID
	addressAndLocationCode: (params) => request.get('/basic/a/map/addressAndLocationCode', params, { isShowToast: false }),
}

// 关于首页的接口
const trim = {
	// 个人中心装修相关
	enableUserCenter: params => request.get(`/shop/mobile/enable/user/center`, params, { isShowToast: false }), // 【用户】是否开启个人中心装修
	userCenter: params => request.get(`/shop/mobile/user/center`, params, { isShowToast: false }), // 【用户】获取MOBILE个人中心装修数据
	// 首页装修相关
	index: params => request.get(`/shop/mobile/index`, params), // 【用户】获取MOBILE首页装修数据
	shopCarCount: (params) => request.post(`/shop/shopCarCount`, params), // [用户]获取购物车角标数量(未实现)
	appStartAdv: params => request.get(`/shop/app/start/adv`, params), // 【用户】获取随机一条app启动广告

	// 店铺装修相关
	shopIndexPage: params => request.postForm(`/shop/show/shop/mobile/indexPage`, params, { isShowToast: false }), // 【用户】获取MOBILE店铺装修首页内容
	shopIndex: params => request.postForm(`/shop/mobile/shop/index`, params), // 【用户】mobile端商家店铺首页信息
	shopInfo: params => request.postForm(`/shop/shopInfo`, params), // [用户]获取店铺相关信息
	sDecoratePageShow: params => request.postForm(`/shop/s/decoratePage/show`, params, { isShowToast: false }), // 根据id获取店铺装修模板数据
	adminDecoratePageShow: params => request.postForm(`/shop/admin/decoratePage/show`, params, { isShowToast: false }), // 根据id获取后台装修模板数据
	
	// 海报相关
	showMobilePosterPage: (params) => request.postForm(`/shop/showMobilePosterPage`, params), // 【用户】获取MOBILE首页装修数据
	posterPage: (params) => request.postForm(`/shop/show/shop/mobile/posterPage`, params), // 【用户】获取MOBILE店铺装修海报页内容

	// 分类相关
	categoryProd: (params) => request.get(`/shop/categoryProduct`, params), // 【用户】获取分类下的商品(这个是整个商城的类目)
	shopCategoryProduct: (params) => request.get(`/shop/shopCategoryProduct`, params), // 【用户】获取分类下的商品(这个是店铺的类目的)
	categoryTreeList: (params) => request.get(`/shop/categoryTreeList`, params), // [用户]获取首页展示分类列表

	// 分组相关
	getProductPageList: (params) => request.postForm(`/shop/getProductPageList`, params), // [用户]根据分组ID获取商品列表
	groupProdList: (params) => request.get(`/shop/groupProdList`, params), // 【用户】获取分组内的商品(该接口现在还没有调通，而且该接口不是直接在数据库上拿数据的，可能会存在延时)
	groupProduct: (params) => request.postForm(`/shop/groupProduct`, params), // 【用户】获取商品分组商品(没有分页)
	groupProductPage: (prames) => request.post('/shop/groupProduct/page', prames), // 获取商品分组商品
	trimGroupProductPage: (prames) => request.post('/shop/groupProduct/page', prames, { isShowToast: false }), // 获取商品分组商品(装修专用，不showLoadding,不ShowToast)

	// 商品相关
	productList: (params) => request.postForm(`/shop/productList`, params) // [用户]获取商品集合信息
}

// 获取公告列表接口
const infoLise = {
	// 【用户】获取买家公告列表
	getshopInfoList: (data) => request.get(`/shop/p/query/user/pub/list`, data),
	// 【用户】系统通知列表
	getsystemInfoList: (data) => request.get(`/basic/p/msg/page`, data),
	// 系统通知详情
	getSystemInfoDetail: (data) => request.get(`/basic/p/msg`, data),
	// 【用户】获取买家公告详情
	getInfoDetail: (data) => request.get(`/shop/p/pub/info`, data),
	// 【用户】获取我的信息示读取信息条数
	unReadCount: (data) => request.get(`/basic/p/msg/unReadCount`, data, { isShowToast: false }),
	// 【用户】一键清除消息未读标记
	cleanUnread: (data) => request.get(`/basic/p/msg/cleanUnread`, data),
}
const popupAdvert = {
	// 获取弹窗广告规则
	// queryAdvertise: (data) => request.get(`/shop/advertise/query/queryAdvertise`,data),//旧接口，由于华为浏览会识别接口名字认定为广告，会被拦截掉
	queryAdvertise: (data) => request.get(`/shop//pop/query/queryPop`,data),
	// 更新广告点击数据
	advertiseClock:(data) => request.get('/shop/advertise/advertise/clock',data),
	// 更新广告投放数据
	advertisePut:(data) => request.get('/shop/advertise/advertise/put',data)
}



export {
	addressApi,
	trim,
	visitHm,
	infoLise,
	popupAdvert,
	getMobileUrl,
}
