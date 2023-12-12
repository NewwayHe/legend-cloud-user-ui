import request from '@/utils/request';

// 协议api
const protocolApi = {
	// 获取相关协议
	protocolGet: (data) => request.postForm(`/basic/protocol/get`, data),
	// 【后台】查看协议链接
	queryById: (data) => request.get(`/basic/protocol/get`, data),
};

// 建立邀请关系api
const relationship = (data) => request.postForm(`/activity/distribution/build/invitation/relationship`, data, { isShowToast: false });

// 获取联系客服图片
const getCustomerServerUrl = () => request.get(`/basic/customer/server`);

// 【用户】获取ICP备案号以及商城名称、商城logo等，2021.11.03新增：服务器时间、主题颜色
const setting = (data) => request.get('/shop/setting', data, { isShowToast: false });

// 【商家】根据店铺id查询商家、平台微信联系方式存储表
const contactInformation = (data) => request.get('/shop/contactInformation/info', data, { isShowToast: false });

// 小程序api
const miniWxApi = {
	// 小程序码接口
	getMiniQrCode: (data) => request.get(`/basic/wx/getMiniQrCode`, { flag: false, ...data }),
	// 解密小程序码
	getWechatScene: (data) => request.get(`/basic/wx/getWechatScene`, data),
};

export { protocolApi, relationship, miniWxApi, getCustomerServerUrl, setting, contactInformation };
