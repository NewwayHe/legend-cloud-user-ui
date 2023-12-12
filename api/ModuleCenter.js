import request from '@/utils/request'

// 优惠券
const couponApi = {
	// 列表页
	getCoupon: params => request.get('/activity/p/coupon', params),

	// 卡密领券
	exchangeCoupon: id => request.get(`/activity/p/coupon/active/${id}`),

	// 用户领券
	addCoupon: id => request.post(`/activity/p/coupon/${id}`),

	// 【用户】根据id查询优惠券(从用户中心跳入)
	coupon: id => request.get(`/activity/p/coupon/${id}`),
    
    // 【用户】根据id查询优惠券详情
    couponDetail: params => request.get(`/activity/p/coupon/detail`, params),

	// 优惠券关联的商品列表
	couponQuerySkuPageById: (data) => request.get(`/activity/p/coupon/querySkuPageById`, data),
	
	// 用户可领取优惠券列表
	couponReceivable: (data) => request.get(`/activity/coupon/receivable`, data),
	
	// 优惠券详情(从领券中心跳入)
	couponGetById: (data) => request.postForm(`/activity/coupon/getById`, data),
	
	// 列表页
	queryShopPage: params => request.get('/activity/p/coupon/queryShopPage', params),

}

// 我的账单
const billDetail = {
	// 账单列表
	getBillDetail: params => request.get('/user/p/customer/bill/page', params),
	// 删除账单
	delBill: id => request.delete(`/user/p/customer/bill/update/del/flag/${id}`),
	// 账单详情
	getBillInfo: id => request.get(`/user/p/customer/bill/${id}`),

}


// 我的足迹
const history = {
    // 我的足迹
	queryUserVitList : (params) => request.postForm('/product/vitLog/queryUserVitList', params),
    // 清空足迹
	deleteUserAllVisitLog : (params) => request.delete('/product/vitLog/deleteUserAllVisitLog', params),
     // 删除用户单个商品的全部足迹
	deleteUserVisitLog : (params) => request.delete(`/product/vitLog/deleteUserVisitLog/${params}`),
}


// 预存款api
const depositApi = {
    // 用户钱包信息
	wallet:(params) => request.get('/pay/p/wallet', params),
    // 用户钱包明细
	walletDetailsPage : (params) => request.get('/pay/p/wallet/details/page', params),
	// 用户账户明细详情
	walletDetail: (params) => request.get(`/pay/p/wallet/details/detail/${params.id}`),
    // 用户提现
	walletWithdraw : (params) => request.post(`/pay/p/wallet/withdraw`,params),
}

// 商品咨询
const consult = {
	/* 【用户】新增商品咨询 */	
	addConsult:(params) => request.get('/product/p/product/consult/addConsult', params),
	/* 【用户】商品咨询列表查询（已回复） */
	consultPage:(params) => request.get('/product/p/product/consult/page', params),
	/* 【用户】个人中心商品咨询 */
	consultUserCenter:(params) => request.get('/product/p/product/consult/userCenter', params),
}
export {
	couponApi,
	billDetail,
	history,
	depositApi,
	consult
}
