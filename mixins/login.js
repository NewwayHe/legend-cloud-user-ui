// 登录相关的方法
import { debounce,pages } from '@/utils/utils.js';
import oauthService from '@/service/oauth.js';
import { passport } from '@/utils/Cache.js';
import config from '@/config/config.js'
const loginMixin = {
	data() {
		return {}
	},
	methods: {
		/**
		 * @name app第三方登录
		 * @param {provider} 服务供应商，在manifest.json-->APP模块配置-->Oauth(登录鉴权)里设置，现只接收三个值："weixin","qq","sinaweibo"
		 * @param {source} 点击事件的来源，现只接收如下值："login"(登录页面进来),"authorization"(授权登录页面进来)
		 */
		oauthLogin:debounce(function(provider,source){
			uni.showLoading({
				mask: true,
				title: '正在登录...',
				success: res => {
					setTimeout(() => {
						uni.hideLoading(); // 防止第三方登录点取消后，页面上一直显示loading
					}, 5000);
				}
			});
			oauthService.oauthLogin(provider).then(res => {
				if (res.success) {
					uni.hideLoading();
					if (res.code == 201) {
						// 如果验证通过，但未关联第三方，需要绑定账号！跳转至绑定手机号页面(注册)
						const bindingIfo = {
							passportIdKey: res.passportIdKey,
							platform: res.platform
						};
						passport.setPassportIdKey(bindingIfo.passportIdKey);
						uni.showToast({
							title: res.msg,
							icon: 'none',
							mask: true,
							complete:() => {
								setTimeout(() => {
									uni.redirectTo({ url: '/ModulesUser/bindingPhone/bindingPhone' });
								}, 1500);
							}
						});
					}else{
						// 如果验证通过，并已关联第三方，从什么页面过来的就跳回什么页面去
						passport.clearPassportIdKey(); // 登录成功后不清除掉passportId的话，退出登录后，下次登录时，就会取上一个账号的passportId，这样就会导致passportId对不上而登录失败
						uni.showToast({
							title: res.msg,
							icon: 'none',
							mask: true,
							complete:() => {
								setTimeout(() => {
									pages.goBeforePage(1, ['login','authorization']); // 从什么页面过来的就跳回什么页面去
								}, 1500);
							}
						});
					}
				} else {
					// 如果验证不通过，返回登录页面
					uni.hideLoading();
					uni.showToast({ title: res.msg,icon: 'none',mask: true });
				}
			});
		}),
	}
}

export default loginMixin
