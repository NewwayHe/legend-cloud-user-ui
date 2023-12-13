import Vue from 'vue'
import App from './App'
import { appToken, cookieId } from '@/utils/Cache.js'
Vue.config.productionTip = false // 阻止启动生产消息

/* start--统一管理挂载的原型： */
const excludeLoginURIs = ['/login', 'thirdLoginResult', 'forgetPsw', 'register','wxLogin','bindingPhone','authorization']// 如果是登录后的从什么页面过来的就跳回什么页面去，则excludeLoginURIs这些页面是直接跳首页而不是返回
Vue.prototype.$excludeLoginURIs = excludeLoginURIs;
uni.$excludeLoginURIs = excludeLoginURIs // 各种实用的方法,$u挂载到uni对象上

import filters from '@/filters/filters';
Vue.use(filters); // 过滤器引用
import uView from '@/components/uview-ui/index.js';
Vue.use(uView); // uView
// #ifdef H5
import loading from './components/common/async/loading.vue';
Vue.component('loading', loading); // 页面js加载时使用的组件（需注册为全局组件）
import error from './components/common/async/error.vue';
Vue.component('error', error); // 页面js加载失败时使用的组件（需注册为全局组件）
import VueLazyload from 'vue-lazyload';
Vue.use(VueLazyload, { lazyComponent: true, dispatchEvent: true, attempt: 1 }); // 图片懒加载(小程序和APP用uni-app原生的image实现),注意：这个dispatchEvent作用是开启img里的原生@error事件
require('promise.prototype.finally').shim() // 解决不登录的情况下,首页一直显示加载中却不加载数据的bug(因为低版本的浏览器axios不支持finally,备注：如果小程序开启了直播后，在小程序上运行这段话时会报错)
// import vConsole from 'vconsole';if (process.env.NODE_ENV === 'development') {var VConsole = new vConsole();}//手机调试时增加一个调试按钮
// #endif
// #ifdef MP
import './utils/mtj-wx-sdk';
// #endif

/* end--统一管理挂载的原型： */

/* start--统一管理挂载的JS方法： */
import store from './store';
Vue.prototype.$store = store; uni.$store = store // 仓库
import configTemp from '@/config/config.js';
Vue.prototype.$config = configTemp;
uni.$config = configTemp // 这样vue页面上就不用引入@/config/config.js了
Vue.prototype.$photoServer = configTemp.photoServer; // 服务器图片
Vue.prototype.$staticServer = configTemp.staticServer // 静态服务器图片
import uploader from 'utils/uploader.js';
Vue.prototype.$Uploader = uploader // 上传图片插件
import checkInfo from '@/utils/checkInfo.js';
Vue.prototype.$checkInfo = checkInfo; // 数据效验
import stringUtils from '@/utils/stringUtils.js';
Vue.prototype.$stringUtils = stringUtils // 统一处理string字符串的方法
uni.$stringUtils = stringUtils
import arrayUtils from '@/utils/arrayUtils.js';
Vue.prototype.$arrayUtils = arrayUtils // 统一处理array数组的方法
import * as utils from '@/utils/utils.js';
Vue.prototype.$utils = utils;
uni.$utils = utils // 各种实用的方法,$u挂载到uni对象上

/* 跳转到传入的url地址——用法:
   传参:@click="$navigateTo('/modMy02/message/messageDet?item='+ encodeURIComponent(JSON.stringify(item)) )"
   接参:if(option.item){ const item = JSON.parse(decodeURIComponent(option.item)); } 
*/
function navigateTo(url) { uni.navigateTo({ url: url }) }
Vue.prototype.$navigateTo = navigateTo;

function redirectTo(url) { uni.redirectTo({ url: url }) }
Vue.prototype.$redirectTo = redirectTo;

function switchTab(url) { uni.switchTab({ url: url }) }
Vue.prototype.$switchTab = switchTab;

function reLaunch(url) { uni.reLaunch({ url: url }) }
Vue.prototype.$reLaunch = reLaunch;

function navigateBack(delta) { uni.navigateBack({ delta: delta || 1 }) }
Vue.prototype.$navigateBack = navigateBack;

function pageScrollTo(num = 0, duration = 300) { uni.pageScrollTo({ scrollTop: num, duration: duration }); }
Vue.prototype.$pageScrollTo = pageScrollTo; // 滚动到屏幕某个位置，不存值就默认置顶
/* end--统一管理挂载的JS方法： */

/* start--统一管理进入程序时需要先执行的方法： */
cookieId.setCookieId(); // 通行证 storage 管理
store.dispatch('getCartNum') // 先执行一次store里的方法拿到购物车数量
store.dispatch('getContactInfo') // 【商家】根据店铺id查询商家、平台微信联系方式存储表
store.dispatch('getCategorySet') // 获取分类设置
store.dispatch('getAppStartAdv') // APP端获取随机一条app启动广告
store.dispatch('getPopupAdvertRule') // 获取首页弹框广告(H5和小程序才用到)
// 获取一、ICP备案号以及商城名称、商城logo等基本信息；二、商城主题颜色；三、服务器上的当前时间与机器上的当前时间的时间差
store.dispatch('getSetting').then(res => {
	// 图片服务器、pc和H5链接地址取后台配置的值(如果后台有返回，则取用接口返回的数据，如果没有，由采用config.js的设置值，则优先取用接口返回的值)
	if (res && res.urlProperties) {
		if (res.urlProperties.photoServer) configTemp.photoServer = res.urlProperties.photoServer
		if (res.urlProperties.staticServer) configTemp.staticServer = res.urlProperties.staticServer
		if (res.urlProperties.userMobileDomainName) configTemp.shareUrl = res.urlProperties.userMobileDomainName
		Vue.prototype.$config = configTemp;
		uni.$config = configTemp // 这样vue页面上就不用引入@/config/config.js了
		Vue.prototype.$photoServer = configTemp.photoServer; // 服务器图片
		Vue.prototype.$staticServer = configTemp.staticServer // 静态服务器图片
	}
}).finally(() => {})

// 建立绑定关系
import { relationship, miniWxApi } from '@/api/ModuleBase.js';
import { mapState } from 'vuex';
Vue.mixin({
	data() {
		return {
			staticServer: configTemp.staticServer, // 全局的静态资源服务器
			photoServer: configTemp.photoServer, // 全局的图片服务器
			config: configTemp, // 全局的配置文件信息
		};
	},
	computed: {
	    ...mapState(['themes']),
	},
	watch:{ },
	onShow() {
		if (appToken.isLogin()) {
			if (!checkInfo([{ type: 'hasValue', value: store.state.userInfo }])) {
				// 如果已经登录了，并且VUEX里没有userInfo，则请求接口获取
				store.dispatch('getUserInfo') // 获取用户信息并放到vueX里
			}
			if (!checkInfo([{ type: 'hasValue', value: store.state.myInfo }])) {
				// 如果已经登录了，并且VUEX里没有myInfo，则请求接口获取
				store.dispatch('getMyInfo') // 获取用户[优惠券,历史足迹,消息,商品收藏,商家收藏,总收藏统计数]等的数量放到vueX里
			}
		}
	},
	onLoad() {
		const route = utils.pages.getPageRoute()
		// 如果页面上带有invitationCode邀请码参数,则请求接口建立邀请关系
		if (route && route.options.invitationCode) {
			this.postRelationship(route.options.invitationCode, route.options.id)
		}

		// #ifdef H5
		// 百度的统计
		if (window._hmt) {
			console.log(window._hmt)
			window._hmt.push(['_trackPageview', route.route])
		}
		// #endif
	},
	methods: {
		// 建立邀请关系
		postRelationship(invitationCode, productId = '') {
			if (!cookieId.getCookieId()) {
				cookieId.setCookieId()
			}
			setTimeout(() => {
				relationship({ invitationCode: invitationCode, productId: productId }).then((res) => {
					if (res.code == 1) {
						if (this.relationshipCallBack) {
							this.relationshipCallBack(res.data)
						}
					}
				})
			}, 1000)
		}
	},
})

/* end--统一管理进入程序时需要先执行的方法： */

App.mpType = 'app'
const app = new Vue({ ...App })
app.$mount()
