<template>
    <view class="w750" :style="{ '--themescolor': themes.color,'--gradientcolor':themes.rgb08, '--themesrgba05': themes.rgb05, '--themesrgba02': themes.rgb02 }">
		<view class="l-gradient-lb text-white d-flex flex-column j-end pl-6" style="height: 660rpx;padding-bottom: calc(240rpx + 70rpx);">
			<ls-image :src="systemConfig.logo" :options="{ w: '150', h: '150', br: '50%' }" v-if="systemConfig&&systemConfig.logo"/>
			<image :src="staticServer + 'static/images/certification-icon.png'" style="height: 150rpx; width: 150rpx" v-else></image>
			<view class="mt-1" style="font-size: 52rpx;" v-if="systemConfig.domainName">
				欢迎来到{{systemConfig.domainName}}
			</view>
		</view>
		<view class="bg-white zindex-2 overflow-h pt-2 px-6" style="margin-top: -240rpx;border-radius: 20px  20px  0px  0px;">
			<ls-tabs :list="['手机快捷登录','账号密码登录']" :fontSize="36" :itemStyle="{height:'130rpx'}" bold lineHeight="6" lineBottom="10rpx" @change="switchType" />
			<!-- 账号密码登录 -->
			<view class="mt-4" v-if="loginMode">
			    <view class="h-100r flex-start border-bottom border-f1"><input type="text" class="flex-1" placeholder="手机号/用户账号" v-model="userName" :maxlength="11"/></view>
			    <view class="h-100r flex-start border-bottom border-f1">
			        <input type="text" :password="showPassword" class="flex-1" placeholder="请输入密码" v-model="password" maxlength="16"/>
					<u-icon class="mr-2" :name="!showPassword?'eye-fill':'eye-off'" :color="!showPassword?themes.color:'#cccccc'" size="50" @click="showPassword=!showPassword"></u-icon>
			        <text class="border-e4-left-y20r px-2 h-100 flex-center" @click="$navigateTo(`/ModulesUser/forgetPsw/forgetPsw`)">忘记密码</text>
			    </view>
			</view>
			<!-- 手机快捷登录 -->
			<view class="mt-4" v-else>
			    <view class="h-100r flex-start border-bottom border-f1"><input type="number" class="flex-1" :maxlength="11" placeholder="请输入正确的手机号码" v-model="phone" /></view>
			    <view class="h-100r flex-start border-bottom border-f1 code">
			        <input type="text" class="flex-1" :maxlength="6" placeholder="请输入短信验证码" v-model="code" />
			        <view class="border-e4-left-y20r px-2 h-100 flex-center text-main"><ls-verify-code :params="{ codeType: 'LOGIN', mobile: phone }" @change="change"/></view>
			    </view>
			</view>
			<!-- /手机快捷登录 -->
			<ls-button :className="`${showBut ? 'but-main' : 'but-main-rgb02 text-white pointer-none'} h-88r my-4`" loading :asyncFunction="goLogin" :options="{ br: '50', fs: '36' }" >
			    {{`${loginMode?'登 录':(showBut?'登 录':!phone?'请先输入手机号':!code?'请先输入验证码':'请先获取验证码')}`}}
			</ls-button>
			<ls-button className="flex-center h-88r my-4 text-666" @click="goRegister" :options="{ br: '50', fs: '36', bc:'#f1f1f1' }" >注 册</ls-button>
			
			<!-- #ifdef APP-PLUS -->
			<view class="text-center" v-if="providerList&&providerList.length && platform != 'ios'">
			    <view class="text-999 pt-3">第三方账号登录</view>
			    <view class="mt-6 flex-center">
					<!-- v-if="item.value=='weixin'"：现在只显示微信登录 -->
					<template v-for="(item,index) in providerList">
						<view class="flex-center px-2" :key="index"  @tap="oauthLogin(item.value)" v-if="item.value=='weixin'">
							<u-icon :name="item.icon" :color="item.color" label-pos="bottom" size="80"></u-icon>
						</view>
					</template>
			
			    </view>
			</view>
			<!-- #endif -->
		</view>
    </view>
</template>

<script>
// JS方法
import { passport } from '@/utils/Cache.js';
import { encryption } from '@/utils/encryption.js';

// VUE组件

// 接口
import oauthService from '@/service/oauth.js';

import { mapState } from 'vuex';
import loginMixin from '@/mixins/login.js';

export default {
    components: { },
	mixins: [loginMixin],
    data() {
        return {
            loginMode: 0, // 登录方式, 0 手机快捷登录, 1 账号密码登录
            userName: '', // 手机号码，或者用户名，邮箱
            password: '', // 密码
            phone: '', // 手机号码
            code: '', // 验证码
            hasClickCode:false,// 【手机快捷登录】是否已经点击了【获取验证码】
            passportIdKey: '',
            isWeixinH5: this.$utils.getUa().isWeixin,
			showPassword:true,

            // #ifdef APP-PLUS
            platform: uni.getSystemInfoSync().platform, // 如果IOS的APP端不显示第三方登录
            // #endif
			
            // 以下为第三方登录专用
            providerList: [],
			weixinCode: '',
        };
    },
    computed: {
        ...mapState(['systemConfig']),
        showBut() {
            // !this.loginMode:手机快捷登录;this.loginMode账号密码登录
            return !this.loginMode ? (this.phone && this.code && this.hasClickCode) : (this.userName && this.password);
        }
    },
    onLoad(option) {
        // #ifdef APP-PLUS
        this.platform = uni.getSystemInfoSync().platform;
        // #endif

        this.passportIdKey = passport.getPassportIdKey();
        // #ifndef H5
        // 获取第三方登录服务提供商(H5端是直接跳后台配置的网页，没有第三方登录服务提供商)
        this.initProvider();
        this.isWeixinH5 = this.$utils.getUa().isWeixin;
        // #endif
		
		// #ifdef MP
		this.weixinLogin();
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

		switchType(item){
			this.loginMode = item.index
		},
        
        // 获取是否已经点击了【获取验证码】
        change(val){
            this.hasClickCode = val
        },

        // 登录
        goLogin() {
			return new Promise((resolve) => {
				// 账号密码登录
				if (this.loginMode) {
					if(!this.$checkInfo([{ type: 'loginPassword', value: this.password, msg:true }])) return resolve();
					// 如果是账号密码登录
					uni.showLoading({
						mask: true,
						title: '登录中...',
						success: res => {
							setTimeout(() => {
								uni.hideLoading(); // 防止特殊情况下页面上一直显示loading
							}, 5000);
						}
					});
					// 调用登录
					oauthService.login({ principal: encryption(this.userName), credentials: encryption(this.password), auth_type: 'PASSWORD',third_party_identifier:this.weixinCode }).then(res => {
						if (res.success) {
							passport.clearPassportIdKey(); // 登录成功后不清除掉passportId的话，退出登录后，下次登录时，就会取上一个账号的passportId，这样就会导致passportId对不上而登录失败
							uni.hideLoading();
							uni.showToast({
								title: '登录成功',
								mask: true,
								complete:() => {
									setTimeout(() => {
										this.$utils.pages.goBeforePage(1, ['login']); // 从什么页面过来的就跳回什么页面去
									}, 1500);
								}
							});
						} else {
							uni.showToast({ title: res.msg, icon: 'none', duration: 2000 });
						}
					}).finally(() => {
						return resolve()
					})
				} else {
					// 如果是快捷登录
					if (!this.$checkInfo([
						{ type: 'phone', value: this.phone,msg:'请输入正确的手机号码' },
						{ type: 'code', value: this.code,options:6,msg:'请输入正确的验证码' }
					])) return resolve();
					uni.showLoading({
						mask: true,
						title: '登录中...',
						success: res => {
							setTimeout(() => {
								uni.hideLoading(); // 防止特殊情况下页面上一直显示loading
							}, 5000);
						}
					});
					oauthService.login({ principal: this.phone, credentials: this.code, auth_type: 'SMS',third_party_identifier:this.weixinCode }).then(res => {
						if (res.success) {
							passport.clearPassportIdKey(); // 登录成功后不清除掉passportId的话，退出登录后，下次登录时，就会取上一个账号的passportId，这样就会导致passportId对不上而登录失败
							uni.hideLoading();
							uni.showToast({
								title: '登录成功',
								mask: true,
								complete:() => {
									setTimeout(() => {
										this.$utils.pages.goBeforePage(1, ['login']); // 从什么页面过来的就跳回什么页面去
									}, 1500);
								}
							});
						} else {
							uni.showToast({ title: res.msg, icon: 'none', duration: 2000 });
						}
					}).finally(() => {
						return resolve()
					})
				}
			})
        },

        goRegister() {
            this.$navigateTo(`/ModulesUser/register/register`);
        },

        // #ifdef H5
        // 第三方登录(H5)
        oauthLoginH5(provider) {
            this.$u.debounce(() => {
                const title = '第三方登录';
                let url = '';
                // 如果不是微服务版本(即是正常版本)
                url = this.$config.server + '/thirdlogin/' + provider + '/h5/authorize';// 旧接口，没用的
                uni.navigateTo({ url: `/pages/webview/webview?title=${title}&url=${encodeURIComponent(url)}` });
            })
        },
        // #endif

        // #ifndef H5
        // 获取第三方登录服务提供商
        initProvider() {
            const filters = ['weixin', 'qq', 'sinaweibo', 'apple'];
            uni.getProvider({
                service: 'oauth',
                success: res => {
                    console.log(res);
                    // console.log(res); // {"errMsg":"getProvider:ok","service":"oauth","provider":["weixin","qq","sinaweibo"]}
					const statusIcon = { weixin:'weixin-circle-fill',qq:'qq-circle-fill',sinaweibo:'weibo-circle-fill' }
					const statusColor = { weixin:'#50b038',qq:'#5d9bdd',sinaweibo:'#e75252' }
                    if (res.provider && res.provider.length) {
                        for (let i = 0; i < res.provider.length; i++) {
                            if (~filters.indexOf(res.provider[i])) {
                                this.providerList.push({
                                    value: res.provider[i],// weixin,qq,sinaweibo
                                    icon: statusIcon[res.provider[i]],
                                    color: statusColor[res.provider[i]]
                                });
                            }
                        }
                    }
                },
                fail: err => {
                    console.error('获取服务供应商失败：' + JSON.stringify(err));
                }
            });
        },
        // #endif
    }
};
</script>

<style scoped>
</style>
