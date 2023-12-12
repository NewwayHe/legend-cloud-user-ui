import request from '@/utils/request'

// 关于用户的接口
const cartApi = {
	// 购物车列表
	cartList: params => request.get('/order/cart/list', params),
	// 新增，修改购物车数量
	cartChange: params => request.post('/order/cart/change', params),

	// 获取购物车商品数量
	cartCount: params => request.get('/order/cart/count', params),

	// 获取购物车失效商品列表
	getInvalidProduct: params => request.get('/order/cart/invalidProduct', params),
	// 正选、反选、全选购物车
	cartSelect: params => request.post('/order/cart/select', params),
	//清空所有购物车商品
	cartDel: params => request.delete('/order/cart/delete', params),
	//清空所有购物车商品
	cartDelAll: params => request.post('/order/cart/delete/all', params),
	// 清空失效商品
	cleanInvalidProduct: params => request.delete('/order/cart/cleanInvalidProduct', params),
	
    // 购物车单品修改促销活动
	changePromotion: params => request.post('/order/cart/changePromotion', params),
}

const orderApi = {
	// 立即购买验证
	buyNow: (data) => request.post('/order/check', data,{isShowLoading:true}),

	// 加入购物车
	addCart: (data) => request.post('/order/cart/add', data),
	
	// 确认订单详情
	orderInfo: (data) => request.get('/order/confirm/info', data),
	
	// 更换择地址，重新获取提交订单信息
	addressChange: (data) => request.get('/order/address/change', data),
	
	// 订单提交前开启关闭余额支付
	useWallet: (data) => request.post('/order/use/wallet', data),
	
	// 订单提交前开启关闭积分抵扣
	switchIntegralFlag: (data) => request.postForm('/order/use/switchIntegralFlag', data),
	
	// 用户钱包支付信息
	walletPayInfo: (data) => request.get('/pay/p/wallet/pay/info', data),

	// 提交订单
	submitOrder: (data) => request.get(`/order/submit/order`, data,{isShowLoading:true}),

	// 发票开关/切换发票
	invoiceChange: (data) =>  request.post(`/order/invoice/change`, data),
	
	// 订单分页列表
	orderPage: (data) =>  request.get(`/order/p/order/page`, data),
	
	//提醒发货
	remindDelivery: (data) =>  request.postForm(`/order/p/order/remind/delivery`, data),
	
	//确认收货
	confirmDeliver: (data) =>  request.postForm(`/order/p/order/confirm/deliver`, data),
	
	//取消订单
	cancelOrder: (data) =>  request.postForm(`/order/p/order/cancel/order`, data),
	
	//再来一单
	buyAgain: (data) =>  request.postForm(`/order/p/order/add/another/order`, data),
	
	//删除订单
	removeOrder: (orderId) =>  request.delete(`/order/p/order/`+orderId),
	
	//物流信息
	information: (data) =>  request.postForm(`/order/p/order/logistics/information`, data),
	
	// 整单退(待发货 - 申请全额退款)
	refundApplyOrder: (data) =>  request.postForm(`/order/p/order/refund/apply/order`, data),
	
	// 查看售后详情
	serverOrderGet: (data) =>  request.get(`/order/p/order/refund`, data),

	// 撤销售后申请
	refundCancelApply: (data) =>  request.postForm(`/order/p/order/refund/cancel/apply`, data),
	
	//申请售后原因
	cancelReason:()=>request.post('/order/p/order/refund/cancel/reason'),

	//订单详情
	orderDetail: (data) =>  request.get(`/order/p/order/get`, data),

	// 优惠券(默认最优)
	orderCoupon: (data) => request.postForm(`/order/use/coupon`, data),
	
	//发起支付
	payOrder : (data) =>  request.post(`/pay/p/payment/toPay`, data),
	
	// 确认支付
	payTo: (data) =>  request.post(`/pay/p/payment/pay`, data),
	
	//付款成功详情
	successOrderDetail: (settlementSn) =>  request.get(`/pay/settlement/success/${settlementSn}`),
	
	//付款成功详情(支付订单页面上易宝支付专用)
	orderSuccess: (data) =>  request.post(`/pay/settlement/order/success`,data, {isShowToast: false}),
	
	// 切换优惠券
	changeCoupon: (params, data) => request.request('POST', '/order/select/coupon', params, data),
	
	// 选择平台优惠券，默认选择最优平台优惠券
	platformCoupon: (params, data) => request.request('POST', '/order/use/platformCoupon', params, data),
	
	// 以下是新增
	// 【用户】获取提货信息列表
	contactPage: (data) =>  request.get(`/user/p/contact/page`, data),
	//【用户】新增提货信息
	saveContact: (data) =>  request.post(`/user/p/contact`,data),
	// 【用户】编辑提货信息
	putContact: (data) =>  request.put(`/user/p/contact`,data),
	//【用户】设置默认提货信息
	setDefault: (data) =>  request.postForm(`/user/p/contact/set/default`,data),
	//【用户】删除提货信息
	delContact: (id) =>  request.delete(`/user/p/contact/${id}`),
}

//售后
const refundApi={
	//部分退(单项退货)
	refundItem: params => request.post('/order/p/order/refund/apply/orderItem', params),
	
	//售后订单详情
	refundApply: params => request.postForm('/order/p/order/refund/apply', params),
	
	// 售后分页列表
	refundPage: (data) => request.get(`/order/p/order/refund/page`, data),
	
	// 确认发货
	confirmShip: (data) => request.post(`/order/p/order/refund/confirm/ship`, data),
	
	// 物流公司列表
	logistics: (data) => request.get(`/order/p/order/refund/logistics`, data),

	//申请售后原因
	cancelReason:()=>request.post('/order/p/order/refund/refundReason'),

	// 修改物流信息
	updateLogistic: (data) => request.postForm(`/order/p/order/update/logistic`, data),
}





export {
    cartApi,
	refundApi,
	orderApi
}

