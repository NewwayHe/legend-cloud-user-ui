<template>
	<view class="w750 font-28" :style="{ '--themescolor': themes.color, '--themesrgba02': themes.rgb02 }">
		<view class="p-5">
			<view class="font-56 font-weight" :style="{paddingTop:`${stausBarHeight}px`}">
				注册
			</view>
			<view class="pt-4">
				<view class="h-100r flex-start border-bottom"><input type="number" class="flex-1 h-100" :maxlength="11" v-model="phone" placeholder="请输入手机号" /></view>
				<view class="h-100r flex-start border-bottom">
					<input type="text" class="flex-1 h-100" :maxlength="6" v-model="code" placeholder="请输入短信验证码" />
					<view class="p-2 h-60r h-100 border-left border-f1 text-666 flex-end">
						<ls-verify-code :params="{ codeType: 'REGISTER', mobile: phone }" @change="change" />
					</view>
				</view>
				<view class="h-100r flex-start border-bottom"><input type="text" password class="flex-1 h-100" v-model="pwd" placeholder="请输入密码" maxlength="20" /></view>
				<view class="h-100r flex-start border-bottom"><input type="text" password class="flex-1 h-100" v-model="surePwd" placeholder="再次输入密码" maxlength="20" /></view>
				<view class="text-999 font-20 py-2 font-arial">密码应由5-16位字母、数字不含特殊符号组成</view>
			</view>
			<ls-button
				:className="(showBut ? 'but-main' : 'but-main-rgb02 text-white pointer-none') + '  h-88r mt-6'"
				loading
				text="注册"
				:asyncFunction="register"
				:options="{ br: '50', ls: '20', fs: '30' }"
			/>
			<view class="mt-4 text-999 flex-start">
				<checkbox-group @change="checkboxChange"><checkbox value="agreement" style="zoom: 1; vertical-align: middle" /></checkbox-group>
				<view class="flex-1">
					已阅读并同意
					<text class="text-main" @click.stop="goAgreement('USER_REGISTER')" :style="{ color: themes.color }">《用户注册协议》</text>
					<text>,</text>
					<text class="text-main" @click.stop="goAgreement('PRIVACY_POLICY')" :style="{ color: themes.color }">《用户服务协议和隐私政策》</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// VUE组件

// 接口
import { userApi } from '@/api/ModulesUser.js';
import { protocolApi } from '@/api/ModuleBase.js';
import { mapState } from 'vuex';
export default {
	components: {},
	data() {
		return {
			pwd: '', // 密码
			surePwd: '', // 再次输入密码
			phone: '', // 手机号码
			code: '', // 验证码
			isPhone: true, // 手机号是否重复  true为重复
			agreement: false, // 注册协议
			hasClickCode: false // 是否已经点击了【获取验证码】
		};
	},
	computed: {
		...mapState(['stausBarHeight']),
		// 是否允许提交
		showBut() {
			return this.phone && this.code && this.pwd && this.surePwd && this.agreement;
		}
	},
	onLoad(option) {},
	onUnload() {},
	mounted() {},
	methods: {
		checkboxChange(e) {
			this.agreement = !this.agreement;
		},

		// 注册
		register() {
			return new Promise((resolve) => {
				if (
					!this.$checkInfo([
						{ type: 'phone', value: this.phone, msg: '请输入正确的手机号码' },
						{ type: 'hasValue', value: this.hasClickCode, msg: '请先点击获取验证码' },
						{ type: 'code', value: this.code, msg: '请输入正确的验证码' },
						{ type: 'loginPassword', value: this.pwd, msg: true }
					])
				) {
					return resolve();
				}
				if (this.pwd != this.surePwd) {
					uni.showToast({ title: '两次密码不一致', icon: 'none' });
					return resolve();
				}
			
				const params = {
					mobile: this.phone,
					code: this.code,
					password: this.pwd
				};
				userApi.userReg(params).then(res => {
					if (res.code) {
						uni.showToast({
							title: `注册成功`,
							mask: true,
							complete: () => {
								setTimeout(() => {
									uni.reLaunch({ url: `/ModulesUser/login/login` });
								}, 1000);
							}
						});
					}
				}).finally(() => { return resolve() })
			})
		},

		// 获取是否已经点击了【获取验证码】
		change(val) {
			this.hasClickCode = val;
		},

		// 去阅读注册协议
		goAgreement(code) {
			protocolApi.queryById({ code: code }).then(res => {
				if (res.code) {
					console.log('res：', res);
					if (res.data.type === 0) {
						// 协议类型 0 链接 1 富文本
						// #ifdef H5
						window.open(res.data.url, '_self');
						// #endif
						// #ifndef H5
						uni.navigateTo({ url: `/pages/webview/webview?url=${encodeURIComponent(res.data.url)}` })
						// #endif
					} else {
						uni.navigateTo({ url: `/ModulesUser/register/agreement?code=${code}` });
					}
				}
			});
		}
	}
};
</script>

<style scoped>
checkbox-group {
	display: inline-block !important;
}
</style>
