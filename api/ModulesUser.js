import request from '@/utils/request'

// 关于用户的接口
const userApi = {
    // 第三方登录
    thirdLogin: (params) => request.get('/oauth2/auth/WECHAT_MP', params),

    // 用户信息
    getUserInfo: (params) => request.get('/user/p/user/center/info', params),

    // 用户中心
    userCenter: (params) => request.get('/user/p/user/center/info/mobile/info', params),

    // 用户注册
    userReg: (params) => request.post('/user/ordinary/user', params),

    // 普通的用户账号密码登录
    login: (params) => request.postForm('/oauth2/oauth2/token', params, { isShowToast:false }),

    // 忘记密码  找回密码
    forgetPwd: (params) => request.put('/user/ordinary/user/reset/password', { userType: 'USER', ...params }),

    // 修改头像
    editPortrait: (params) => request.postForm('/user/p/user/center/info/updateAvatar', params),

    // 更改用户昵称
    editNickName: (params) => request.postForm('/user/p/user/center/info/nick/name', params),

    // 更改用户性别
    editSex: (params) => request.postForm('/user/p/user/center/info/sex', params),
	
	// 修改微信号
	updateMp: (params) => request.postForm('/user/p/user/center/info/update/weChatNumber', params),

    // 修改手机号
    updatePhone: (params) => request.post('/user/p/user/center/info/updateMobilePhone', params),

    // 修改支付密码
    updatePayPwd: (params) => request.post('/user/p/user/center/info/updatePayPassword', params),

    // 退出登录
    logout: (params) => request.delete('/oauth2/token/logout?userType=USER', params),

    // 发送短信验证码
    smsVerifyCode: (params) => request.post('/user/userSend/smsVerifyCode', { userType: 'USER', ...params }),

    // 发送验证码，需要登录
    pSmsVerifyCode: (params) => request.post('/user/p/userSend/smsVerifyCode', { userType: 'USER', ...params }),

    // 根据验证码获取秘钥信息
    verifyCode: (params) => request.post('/user/basic/user/verifyCodeExchangeCertificate', { userType: 'USER', ...params }),

    // 绑定手机号
    bindPhone: (params) => request.post('/bindPhone', params),
	
	// 修改邮箱
	editEmail: (params) => request.postForm('/user/p/user/center/info/update/email', params),
    
	// oauth2.0的检查token是否有效, 微服务
    checkToken: (params) => request.get('/oauth2/oauth/check_token', params, { isShowToast:false }),

    // oauth2.0, 刷新token, 微服务
    // oauth2RefreshToken: params => request.post('/oauth/refreshToken', params),

    // oauth2退出登录
    oauth2Logout: (params) => request.post('/oauth/logout', params),
	
	// 更新用户的微信openId
	updateUserOpenId: (params) => request.post('/user/p/social/login/updateUserOpenId', params),
}

const addressManage = {
    // 加载收货地址
    getAddress: (params) => request.get('/user/p/address/page', params),
    // 获取单个收货地址
    getAddressId: (params) => request.get('/user/p/address', params),
    // 新增收货地址
    addAddress: (params) => request.post('/user/p/address', params),
    // 编辑收货地址
    editAddress: (params) => request.put('/user/p/address', params),
    // 删除收货地址
    delAddress: (data) => request.delete(`/user/p/address/${data}`),
    // 设置为默认地址
    editDefault: (params) => request.postForm('/user/p/address/set/default', params)
}

// 发票API
const invoiceManage = {
    // 发票列表数据
    getInvoice: (params) => request.get('/user/p/user/invoice/page', params),
    // 添加
    addInvoice: (params) => request.post('/user/p/user/invoice/save', params),
    // 编辑
    editInvoice: (params) => request.put('/user/p/user/invoice', params),
    // 删除
    delInvoice: (data) => request.delete(`/user/p/user/invoice/${data}`),
    // 设置默认发票
    editInvoiceDefault: (params) => request.post('/user/p/user/invoice/set/default', params),
    // 发票详情[编辑发票时的回显数据]
    getInvoiceDetail: (params) => request.get('/user/p/user/invoice', params),
	
	// 获取当前用户下的发票列表
	getUserInvoice: (params) => request.get('/user/p/user/invoice/queryUserInvoiceOrderById', params),
	// 发票详情[用户发票列表下点击跳往对应的发票数据]
	getInvoiceDetailFromLi: (params) => request.get('/user/p/user/invoice/getDetail', params),
}

// 我的账单
const billDetail = {
    // 账单列表
    getBillDetail: (data) => request.get('/user/p/customer/bill/page', data),
    // 删除账单
    delBill: (id) => request.delete(`/user/p/customer/bill/update/del/flag/${id}`),
    // 账单详情
    getBillInfo: (id) => request.get(`/user/p/customer/bill/${id}`)
}
// 我的评论
const evaluate = {
    // 评论列表
    getEvaluateList: (data) => request.get('/product/p/product/comment/page', data),
    // 获取去评论/追评商品信息
    getEvaluateInfo: (data) => request.get('/product/p/product/comment/product/detail', data),
    // 查看评论
    getEvaluateDetail: (data) => request.get('/product/p/product/comment', data),
    // 查看追评
    getTwoEvaluateInfo: (data) => request.get('/product/p/product/comment/getAdd', data),
    // 保存商品初评
    addEvaluateDetail: (data) => request.post('/product/p/product/comment', data),
    // 保存用户追评
    addEvaluateInfo: (data) => request.post('/product/p/product/comment/save/add', data),
    // 评论信息（评论分页查询）
    openEvaluateInfo: (data) => request.get('/product/p/product/comment/page', data)
}

const questionApi = {
    // getQuestionType: (data) => request.get('/shop/all/userNewsCategory', data), // 获取所有帮助栏目项
	getQuestionType: (data) => request.get('/shop/page/userNewsCategory', data), // 获取所有帮助栏目项
    getQuestionArticle: (data) => request.get('/shop/all/userNews', data), // 获取某帮助栏目项下的文章
	questionDetail: (data) => request.get('/shop/get/userNews', data) ,// 帮助详情
    searchArticle: (data) => request.get('/shop/word', data), // 依据关键字查询帮助文章
}
export { userApi, addressManage, invoiceManage, billDetail, evaluate, questionApi }
