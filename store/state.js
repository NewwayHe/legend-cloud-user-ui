export default {
    cartNum: 0,// 购物车角标
	systemInfo:{ safeAreaBottom:0 },// 获取系统信息(包含了 手机状态栏高度、设备版本、安全距离safeAreaBottom(要计算)等)
    stausBarHeight: 0, // 手机状态栏高度:
    wxMenuBut: '', // 微信小程序胶囊按钮信息(占位符wxMenuBut.placeholder该值为胶囊最左边距离屏幕最右边缘的距离，单位：px):
    userInfo: {}, // 用来接收userInfo接口获取到的res.result
    myInfo: {}, // 用来接收userCenter接口获取用户[优惠券,历史足迹,消息,商品收藏,商家收藏,总收藏统计数]等的数量
	location:{
		lat: '',// 23.08331
		lng: '',// 113.3172
		addressDetail: '', // 详细地址
		region: '定位中', // 地区
		city:'',
		district:'',
		province:''
	},
	contactInfo:{},// 平台客服专用

	/* start 在setting()接口获取 */
	systemConfig:{},// 【用户】获取ICP备案号以及商城名称、商城logo等
	tabbar:'',// 底部导航栏装修数据
	timeDiff: 1, // 服务器上的当前时间与机器上的当前时间的时间差
	themes: { // 商城主题颜色
	    color: '#CCCCCC',
	    rgb: { r: 204, g: 204, b: 204 },
		rgb01: `rgba(204, 204, 204, 0.1)`,
		rgb02: `rgba(204, 204, 204, 0.2)`,
		rgb03: `rgba(204, 204, 204, 0.3)`,
		rgb04: `rgba(204, 204, 204, 0.4)`,
		rgb05: `rgba(204, 204, 204, 0.5)`,
		rgb06: `rgba(204, 204, 204, 0.6)`,
		rgb07: `rgba(204, 204, 204, 0.7)`,
		rgb08: `rgba(204, 204, 204, 0.8)`,
		rgb09: `rgba(204, 204, 204, 0.9)`,
	},
	// end 在setting()接口获取
	
	categorySet:'',// 获取分类设置
	
	/* 返回上一/多级页面时 是否需要在onShow中调用方法重新获取数据
	   示例场景为：
	   1.[我]打开一个别人复制的链接 2.打开后 页面走onLoad(在此调用数据)
	   3.接口无权限 此时跳去登录 4.登录后自动返回该页面(页面不走onLoad 此时页面是白屏或者无数据状态)
	   因此此时需要再[登录后] & [返回之前] 的这一间隙 将该变量置为true 然后用setTimeout将其自动置为false
	   随后在页面中onShow 判断该变量是否为true 如果为true 则将再次调用刷新数据方法
	*/
	isBackRefresh: false,	

	popupAdvertRule:[],
	
}
