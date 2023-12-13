<template>
	<view class="w750 text-center overflow-h" :style="{ '--themescolor': themes.color }">
		<view class="m-0-auto mt-15 flex-center text-fff">
			<ls-image className="m-0-auto" :src="systemConfig.logo" :options="{ w: '160', h: '160', br: '50%',bg:themes.color }" v-if="systemConfig&&systemConfig.logo"/>
			<image :src="staticServer + 'static/images/certification-icon.png'" style="height: 160rpx; width: 160rpx" v-else></image>
		</view>
		<view class="mt-4 font-32">
			<view class="d-flex a-center  mx-20" v-if="systemConfig&&systemConfig.domainName">
				<view class="flex-1 mr-2" style="border-top: 2rpx solid #333;"></view>
				<view style="font-size: 48rpx;" class="font-weight">{{ systemConfig.domainName }}</view>
				<view class="flex-1 ml-2" style="border-top: 2rpx solid #333;"></view>
			</view>
		</view>
		<button type="primary" class="mx-2 mt-10 h-88r font-32 flex-center" v-if="hasAuthorization == 'userinfo'" open-type="getUserInfo" @getuserinfo="getUserInfo">
			获取用户信息
		</button>
		<view class="position-fixed w-100" style="bottom: calc( 100px + var(--safe-area-inset-bottom));">
			<!-- #ifdef MP -->
			<button
				type="primary"
				class="mx-2 mt-10 h-88r font-32 flex-center rounded-100"
				:style="{ backgroundColor: themes.color }"
				v-if="hasAuthorization == 'phone'"
				open-type="getPhoneNumber"
				@getphonenumber="getPhoneNumber"
			>
				微信授权登录
			</button>
			<!-- #endif -->
			
			<!-- #ifdef APP-PLUS -->
			<!-- APP登录不会跳本页面，但如果有强制APP只能微信登录的业务时，可以强制APP只跳转本页面 -->
			<ls-button className="but-main mt-10 mx-2 h-88r" loading :text="'微信授权登录'" @click="oauthLogin('weixin','authorization')" :options="{ br: '50', ls: '3', fs: '32' }" />
			<!-- #endif -->
			
			<view class="font-24 text-999 mt-2" @click="$redirectTo('/ModulesUser/login/login')">手机号码登录</view>
		</view>

	</view>
</template>
<script>
import { mapState } from 'vuex';
import oauthService from '@/service/oauth.js';
import loginMixin from '@/mixins/login.js';
export default {
	components: {},
	mixins: [loginMixin],
	data() {
		return {
			weixinCode: '',
			hasAuthorization: '', // userinfo 用户信息收取  phone 手机号授权
			nickName: '',
			extended: '', // 用户信息（watermark）,iv
		};
	},
	computed: {
		...mapState(['systemConfig'])
	},
	onLoad(option) {
		// #ifdef MP
		this.weixinLogin();
		uni.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo']) {
					this.hasAuthorization = 'phone';
					uni.getUserInfo({
						provider: 'weixin',
						success: infoRes => {
							// console.log('infoRes:',infoRes);
							const { encryptedData, iv } = infoRes;
							this.extended = encryptedData + ',' + iv;
						}
					});
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称
				} else {
					this.hasAuthorization = 'userinfo';
				}
			},
			fail: err => {
				this.hasAuthorization = 'phone';
			}
		});
		// #endif
	},
	onUnload() {},
	onShow() { },
	methods: {
		weixinLogin() {
			uni.login({
				success: res => {
					this.weixinCode = res.code;
				}
			});
		},
		getUserInfo(res) {
			const { encryptedData, iv } = res.detail;
			this.extended = encryptedData + ',' + iv;
			const params = {
				principal: 'CODE',
				credentials: this.weixinCode,
				extended: this.extended,
				auth_type: 'WECHAT_MINI'
			};
			this.goLogin(params);
		},
		goLogin(parmas) {
			uni.showLoading({
				mask: true,
				title: '登录中...',
				success: res => {
					setTimeout(() => {
						uni.hideLoading(); // 防止特殊情况下页面上一直显示loading
					}, 15000);
				}
			});
			oauthService.login(parmas).then(res => {
				if (res.success) {
					if (res.data.code == 201) {
						// 第一次授权获取用户信息成功后，转换为手机授权
						this.hasAuthorization = 'phone';
						this.weixinLogin();
					} else {
						setTimeout(() => {
							this.$utils.pages.goBeforePage(1, ['login']);
						}, 1500);
					}

					uni.hideLoading();
				}
			});
		},
		getPhoneNumber(e) {
			if (e.detail.errMsg == 'getPhoneNumber:ok') {
				const { encryptedData, iv } = e.detail;
				const params = {
					principal: encryptedData + ',' + iv,
					credentials: this.weixinCode,
					extended: this.extended,
					auth_type: 'WECHAT_MINI'
				};
				this.goLogin(params);
			} else {
				uni.showModal({
					title: '提示',
					content: '需要通过授权才能继续，请重新点击并授权',
					showCancel: false,
					confirmColor: '#09BB07'
				});
			}
		},
	}
};
</script>

<style scoped></style>
