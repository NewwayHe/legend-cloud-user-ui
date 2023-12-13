<!-- 修改资料 -->
<template>
	<view class="w750 overflow-h d-flex flex-column" :style="{ '--themescolor': themes.color, '--themesrgba02': themes.rgb02 }">
		<ls-header showHeadSelect :title="title"></ls-header>
		<view class="flex-1 d-flex">
			<!-- 修改昵称 -->
			<view v-if="checkType == 'nickname'" class="mt-2 w-100vw">
				<view class="bg-white flex-between h-100r px-3">
					<u-input class="flex-1" type="nickname" v-model="newNickname" @input="getNickname"  placeholder="请输入您的昵称" maxlength="20"/>
				</view>
				<view class="font-24 m-2 text-999">2-20位数字、中文、字母和特殊字符(仅限!@#$%^&*())</view>
				<view class="position-fixed bottom-0 safearea-bb w-100">
					<ls-button
						:className="`${showBut ? 'but-main' : 'but-main-rgb02 text-white pointer-none'} h-80r m-3`"
						loading
						text="保存"
						@click="changeNickname"
						:options="{ br: '50', ls: '4', fs: '26' }"
					/>
				</view>
			</view>
			
			<!-- 修改登录密码 -->
			<view v-if="checkType == 'loginpwd'" class="w-100vw">
				<view class="h-200r bg-white flex-center">
					<view class="position-relative flex-center">
						<view class="flex-col-center px-5">
							<view class="iconfont icon-success text-main zindex-2" style="font-size: 32rpx;" v-if="step>=1"></view>
							<view class="bg-e4 rounded-circle" style="width: 32rpx;height: 32rpx;" v-else></view>
							<view class="font-24 mt-1">验证手机</view>
						</view>
						<view class="flex-col-center px-5">
							<view class="iconfont icon-success text-main zindex-2" style="font-size: 32rpx;" v-if="step>=2"></view>
							<view class="bg-e4 rounded-circle" style="width: 32rpx;height: 32rpx;" v-else></view>
							<view class="font-24 mt-1">确定新密码</view>
						</view>
						<!-- 横线 -->
						<view class="position-absolute w-100" style="padding: 0 110rpx 0 110rpx;top: 16rpx;">
							<view class="bg-e4 w-100" style="height: 2rpx;"></view>
						</view>
					</view>
				</view>
				<view class="mt-2">
					<template v-if="step==1||step==2">
						<view class="bg-white px-2">
							<view class="flex-start border-bottom border-f8 h-100r">
								<text v-if="step==1">手机号码：{{phone}}</text>
								<u-input type="password" class="flex-1" v-model="newPwd" placeholder="新密码"  maxlength="20" v-if="step==2"/>
							</view>
							<view class="h-100r flex-start">
								<template v-if="step==1">
									<u-input type="text" class="flex-1" v-model="code" placeholder="请填写短信验证码" maxlength="6" />
									<view class="pl-2 h-60r h-100 text-main flex-end">
										<ls-verify-code :params="{ codeType: 'MODIFY_LOGIN_PASSWORD' }" needLogin @change="change" />
									</view>
								</template>
								<u-input type="password" class="flex-1" v-model="surePwd" placeholder="确认密码" maxlength="20" v-if="step==2"/>
							</view>
						</view>
						<view class="font-24 m-2 text-999" v-if="step==1">完成手机验证后，方可修改登录密码</view>
						<view class="font-24 m-2 text-999" v-if="step==2">密码应由5-16位字母、数字不含特殊符号组成</view>
						<view class="position-fixed bottom-0 safearea-bb w-100">
							<ls-button
								:className="`${showBut ? 'but-main' : 'but-main-rgb02 text-white pointer-none'} h-80r m-3`"
								loading
								:text="step==1?'下一步':'确认修改'"
								@click="step==1?nextLoginPwd():changeLoginpwd()"
								:options="{ br: '50', ls: '4', fs: '26' }"
							/>
						</view>
					</template>
				</view>
			</view>
			
			<!-- 修改支付密码 -->
			<view v-if="checkType == 'paypwd'" class="w-100vw">
				<view class="mt-2">
					<view class="bg-white px-2">
						<view class="flex-start border-bottom border-f8 h-100r">
							手机号码：{{phone}}
						</view>
						<view class="flex-start border-bottom border-f8 h-100r">
							<u-input type="text" class="flex-1" v-model="code" placeholder="请填写短信验证码" maxlength="6" />
							<view class="pl-2 h-60r h-100 text-main flex-end">
								<ls-verify-code :params="{ codeType: 'MODIFY_PAY_PASSWORD' }" needLogin @change="change" />
							</view>
						</view>
						<view class="flex-start border-bottom border-f8 h-100r">
							<u-input type="password" class="flex-1" v-model="newPwd" placeholder="新密码"  maxlength="6"/>
						</view>
						<view class="flex-start border-bottom border-f8 h-100r">
							<u-input type="password" class="flex-1" v-model="surePwd" placeholder="确认密码" maxlength="6"/>
						</view>
					</view>

					<view class="font-24 m-2 text-999">支付密码由6位数字组成</view>
					<view class="position-fixed bottom-0 safearea-bb w-100">
						<ls-button
							:className="`${showBut ? 'but-main' : 'but-main-rgb02 text-white pointer-none'} h-80r m-3`"
							loading
							text="确认修改"
							@click="changePaypwd"
							:options="{ br: '50', ls: '4', fs: '26' }"
						/>
					</view>
				</view>
			</view>
			
			<!-- 修改手机号 -->
			<view v-if="checkType == 'phone'" class="flex-1 d-flex flex-column">
				<view class="h-200r bg-white flex-center">
					<view class="position-relative flex-center">
						<view class="flex-col-center">
							<view class="iconfont icon-wancheng text-main zindex-2" style="font-size: 32rpx;" v-if="step>=1"></view>
							<view class="bg-e4 rounded-circle" style="width: 32rpx;height: 32rpx;" v-else></view>
							<view class="font-24 mt-1 text-333">验证手机</view>
						</view>
						<view class="flex-col-center px-9">
							<view class="iconfont icon-wancheng text-main zindex-2" style="font-size: 32rpx;" v-if="step>=2"></view>
							<view class="bg-e4 rounded-circle" style="width: 32rpx;height: 32rpx;" v-else></view>
							<view class="font-24 mt-1 text-333">绑定新手机</view>
						</view>
						<view class="flex-col-center">
							<view class="iconfont icon-wancheng text-main zindex-2" style="font-size: 32rpx;" v-if="step>=3"></view>
							<view class="bg-e4 rounded-circle" style="width: 32rpx;height: 32rpx;" v-else></view>
							<view class="font-24 mt-1 text-333">修改结果</view>
						</view>
						<!-- 横线 -->
						<view class="position-absolute w-100" style="padding: 0 40rpx 0 40rpx;top: 16rpx;">
							<view class="bg-e4 w-100" style="height: 2rpx;"></view>
						</view>
					</view>
				</view>
				<view class="mt-2 flex-1 d-flex flex-column">
					<template v-if="step==1||step==2">
						<view class="bg-white px-2">
							<view class="flex-start border-bottom border-f8 h-100r">
								<text v-show="step==1">手机号码：{{phone}}</text>
								<u-input type="number" v-model="newPhone" placeholder="请输入新手机号"  maxlength="11" v-show="step==2"/>
							</view>
							<view class="h-100r flex-start">
								<u-input type="text" class="flex-1" v-model="code" placeholder="请填写短信验证码" maxlength="6" v-show="step==1"/>
								<u-input type="text" class="flex-1" v-model="newCode" placeholder="请填写短信验证码" maxlength="6" v-show="step==2"/>
								<view class="pl-2 h-60r h-100 text-main flex-end">
									<!-- 注意，这里要用v-show，用v-if的话点击‘获取验证码’下一步后，verify-code组件的倒计时不会重置 -->
									<ls-verify-code :params="{ codeType: 'MODIFY_BINDING_MOBILE' }" needLogin @change="change" v-show="step==1"/>
									<ls-verify-code :params="{ codeType: 'CONFIRM_MOBILE_BIND', mobile: newPhone }" @change="change" v-show="step==2"/>
								</view>
							</view>
						</view>
						<view class="font-24 m-2 text-999">完成手机验证后，可编辑修改手机号码</view>
						<view class="position-fixed bottom-0 safearea-bb w-100">
							<ls-button
								:className="`${showBut ? 'but-main' : 'but-main-rgb02 text-white pointer-none'} h-80r m-3`"
								loading
								:text="step==1?'下一步':'确认'"
								@click="step==1?next():sure()"
								:options="{ br: '50', ls: '4', fs: '26' }"
							/>
						</view>
					</template>
					<template v-if="step==3">
						<view class="flex-1 d-flex flex-column j-start a-center bg-fff" style="padding-top: 200rpx;">
							<view class="iconfont icon-wancheng text-main zindex-2" style="font-size: 100rpx;"></view>
							<view class="mt-4 font-36 font-weight-600 text-333" style="line-height: 50rpx;">
								手机号码设置成功
							</view>
							<view class="font-28 text-999 mt-1" style="line-height: 40rpx;">
								新绑定的手机号码为{{filterNewPhone}}
							</view>
						</view>
						<view class="position-fixed bottom-0 safearea-bb w-100">
							<ls-button class="but-main h-80r m-3" text="确定" @click="$navigateBack()" :options="{ br: '50', ls: '4', fs: '26' }"/>
						</view>
					</template>
				</view>
			</view>
			
			<!-- 修改邮箱 -->
			<view v-if="checkType == 'email'" class="mt-2 w-100vw">
				<view class="bg-white flex-between h-100r px-3">
					<u-input class="flex-1" type="text" v-model="email" placeholder="请输入您的邮箱" maxlength="50"/>
				</view>
				<view class="position-fixed bottom-0 safearea-bb w-100">
					<ls-button
						:className="`${showBut ? 'but-main' : 'but-main-rgb02 text-white pointer-none'} h-80r m-3`"
						loading
						text="保存"
						@click="changeEmail"
						:options="{ br: '50', ls: '4', fs: '26' }"
					/>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { userApi } from '@/api/ModulesUser.js';
export default {
	components: {},
	data() {
		return {
			title:'',
			checkType: '', // 修改的类型
			newNickname: '', // 修改昵称
			newPhone: '', // 修改手机号第二步
			email:'',
			phone: '', // 手机号
			code: '', // 验证码
			newPwd: '', // 新密码
			surePwd: '', // 确认密码
			newCode: '', // 新验证码
			secretKey: '', // 校验秘钥(修改修改登录密码时获取到的秘钥，或修改手机号时旧手机获取到的秘钥)
			hasClickCode: false ,// 是否已经点击了【获取验证码】
			step:1,// checkType == 'phone'修改手机号码，checkType == 'loginpwd'修改登录密码专用
		};
	},
	computed: {
		showBut() {
			let show = '';
			// 如果是修改昵称
			if (this.checkType == 'nickname') {
				show = this.newNickname;
			}
			// 如果是修改登录密码
			if (this.checkType == 'loginpwd') {
				// 如果是第一步:获取验证码
				if (this.step == 1) {
					show = this.phone && this.code;
				}
				// 如果是第二步:输入密码
				if (this.step == 2) {
					show = this.surePwd;
				}
			}
			// 如果是修改支付密码
			if (this.checkType == 'paypwd') {
				show = this.phone && this.code && this.newPwd && this.surePwd;
			}
			// 如果是修改手机号
			if (this.checkType == 'phone') {
				// 如果是第一步:获取验证码
				if (this.step == 1) {
					show = this.phone && this.code;
				}
				// 如果是第二步:输入密码
				if (this.step == 2) {
					show = this.newPhone && this.newCode;
				}
			}
			if (this.checkType == 'email') {
				show = this.email;
			}
			return show;
		},
		filterNewPhone() {
			return this.newPhone.replace(/(\d{3})\d*(\d{4})/, '$1****$2')
		}
	},
	onLoad(option) {
		// uni.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: this.themes.color })//页面导航条变成主题颜色
		if (option) {
			this.$data['option'] = option;
			this.checkType = option.type || null;
			this.newNickname = option.name || null;
			this.phone = option.name || null;
			this.email = option.name || null;
			this.title = option.title || '修改信息'
			uni.setNavigationBarTitle({
				title: option.title
			});
		}
	},
	mounted() {},
	onUnload() {},
	methods: {
		// 修改昵称
		changeNickname() {
			this.$u.debounce(() => {
				if (this.$checkInfo([{ type: 'nickname', value: this.newNickname, msg: '2-20位数字、中文、字母和特殊字符(仅限!@#$%^&*())作为昵称' }])) {
					userApi.editNickName({ nickName: this.newNickname }).then(res => {
						if (res.code) {
							this.editNickname = res.result;
							uni.showToast({
								title: '修改成功',
								mask: true,
								complete: () => {
									setTimeout(() => {
										uni.navigateBack();
									}, 1500);
								}
							});
						}
					});
				}
			});
		},

		// 修改登录密码
		changeLoginpwd() {
			this.$u.debounce(() => {
				if (!this.$checkInfo([{ type: 'loginPassword', value: this.newPwd, msg: true }])) return;
				if (this.newPwd != this.surePwd) {
					uni.showToast({ title: '两次密码不一致', icon: 'none' });
					return;
				}
				userApi
					.forgetPwd({
						mobile: this.phone,
						code: this.secretKey,
						password: this.newPwd,
						codeType: 'MODIFY_LOGIN_PASSWORD'
					})
					.then(res => {
						if (res.code == 1) {
							uni.showToast({
								title: '修改成功',
								icon: 'none',
								mask: true,
								complete: () => {
									setTimeout(() => {
										uni.navigateBack();
									}, 1500);
								}
							});
						}
					});
			});
		},

		// 获取是否已经点击了【获取验证码】
		change(val) {
			this.hasClickCode = val;
		},

		nextLoginPwd() {
			this.$u.debounce(() => {
				// console.log('this.code:', this.code);
				if (!this.$checkInfo([{ type: 'hasValue', value: this.hasClickCode, msg: '请先点击‘获取验证码’' }, { type: 'code', value: this.code, msg: '请输入正确的验证码' }])) { return; }
				const params = {
					code: this.code,
					codeType: 'MODIFY_LOGIN_PASSWORD'
				};
				userApi.verifyCode(params).then(res => {
					if (res.code == 1) {
						this.step = 2
						this.secretKey = res.data;
					}
				});
			});
		},
		// 修改支付密码
		changePaypwd() {
			this.$u.debounce(() => {
				if (
					!this.$checkInfo([
						{ type: 'hasValue', value: this.hasClickCode, msg: '请先点击‘获取验证码’' },
						{ type: 'code', value: this.code, msg: '请输入正确的验证码' },
						{ type: 'payPwd', value: this.newPwd, msg: '支付密码由6位数字组成' }
					])
				) { return; }
				if (this.newPwd != this.surePwd) {
					uni.showToast({ title: '两次密码不一致', icon: 'none' });
					return;
				}
				userApi
					.updatePayPwd({
						code: this.code,
						payPassword: this.newPwd,
						codeType: 'MODIFY_PAY_PASSWORD'
					})
					.then(res => {
						if (res.code) {
							uni.showToast({
								title: '修改成功',
								icon: 'none',
								mask: true,
								complete: () => {
									setTimeout(() => {
										uni.navigateBack();
									}, 1500);
								}
							});
						}
					});
			});
		},

		// 修改手机号第一步
		next() {
			this.$u.debounce(() => {
				if (!this.$checkInfo([{ type: 'hasValue', value: this.hasClickCode, msg: '请先点击‘获取验证码’' }, { type: 'code', value: this.code, msg: '请输入正确的验证码' }])) { return; }
				const params = {
					code: this.code,
					codeType: 'MODIFY_BINDING_MOBILE'
				};
				userApi.verifyCode(params).then(res => {
					if (res.code) {
						this.step = 2
						this.hasClickCode = false;
						this.secretKey = res.data;
					}
				});
			});
		},

		// 修改手机号第二步
		sure() {
			this.$u.debounce(() => {
				if (
					!this.$checkInfo([
						{ type: 'phone', value: this.newPhone, msg: '请输入正确的手机号码' },
						{ type: 'hasValue', value: this.hasClickCode, msg: '请先点击‘获取验证码’' },
						{ type: 'code', value: this.newCode, msg: '请输入正确的验证码' }
					])
				) { return; }
				userApi
					.updatePhone({
						mobile: this.newPhone,
						code: this.newCode,
						codeType: 'CONFIRM_MOBILE_BIND',
						oldCode:this.secretKey,
					})
					.then(res => {
						if (res.code) {
							uni.showToast({ title:'修改手机号成功', icon:'none',mask : true })
							this.step = 3
						}
					})
			});
		},
	
		changeEmail() {
			this.$u.debounce(() => {
				if (this.$checkInfo([{ type: 'email', value: this.email, msg: '请输入正确的邮箱' }])) {
					userApi.editEmail({
						email: this.email
					}).then(res => {
						if (res.code) {
							// this.email = res.result;
							uni.showToast({
								title: '修改成功',
								mask: true,
								complete: () => {
									setTimeout(() => {
										uni.navigateBack();
									}, 1500);
								}
							});
						}
					});
				} else {
					uni.showToast({
						title: '请输入正确的邮箱格式',
						icon: 'none'
					});
				}
			});
		},
		
		// 获取昵称，注意:在电脑微信开发者工具调试时,不会触发到该方法,只有真机时才会生效
		getNickname(e){
			setTimeout(() => {
				this.newNickname = e.detail.value
			},10) 
		}
	}
};
</script>

<style>
page {
	background-color: var(--backgroundcolor);
}
</style>
<style scoped>
</style>
