<template>
    <!-- 提现 -->
    <view class="w750 font-28 text-333" :style="{ '--themescolor': themes.color, '--themesrgba02': themes.rgb02 }">
		<view class="p-2">提现金额<text class="text-666 font-20">(最小金额1.00元，当天累计不超过20000.00元)</text></view>
		<view class="bg-fff px-2 overflow-h py-2 border-bottom-20bg">
			<view class="p-2 border-bottom border-e4 flex-center">
				<text class="mr-3 font-36 font-weight">￥</text>
				<input  class="flex-1" type="text" v-model="formData.amount" placeholder="输入金额" />
				<view class="font-28 text-main" @click="allWithdrawal">全部提现</view>
			</view>
			<view class="font-24 mt-2">可提现余额：￥{{canAmount}}</view>
		</view>
		
		<view class="px-2 bg-white">
			<view class="flex-start position-relative py-2 border-bottom" >
			    <view class="span-5 pr-2 text-right">
			        提现方式
			    </view>
			     <text  class="iconfont icon-weixinzhifu ml-2"  style="color: #01CA02;font-size: 60rpx;" ></text>
			</view>
			<view class="flex-start position-relative py-2 border-bottom" >
			    <view class="span-5 pr-2 text-right">
			        <text class="text-danger mr-1 v-sub">*</text>
			        真实姓名
			    </view>
			    <input class="flex-1 rounded-10 px-2 h-60r" v-model="formData.realName" placeholder="请填写真实姓名" maxlength="20" />
			    <view class="w-60r h-60r flex-center position-absolute right-0 zindex-2" @click.stop="clean('realName')" v-show="formData.realName">
			        <view class="iconfont icon-close text-ccc" style="font-size: 36rpx;"></view>
			    </view>
			</view>
			<view class="flex-start position-relative py-2 border-bottom" >
			    <view class="span-5 pr-2 text-right">
					<text class="text-danger mr-1 v-sub">*</text>
			        支付密码
			    </view>
				<input class="flex-1 rounded-10 pl-2 pr-6 h-60r" type="password" v-model="formData.payPassword" placeholder="请填写支付密码" maxlength="6" />
				<view class="w-60r h-60r flex-center position-absolute right-0 zindex-2" @click.stop="clean('payPassword')" v-show="formData.payPassword">
				    <view class="iconfont icon-close text-ccc" style="font-size: 36rpx;"></view>
				</view>
			</view>
		</view>
		<ls-button className="but-main h-88r mt-10 m-4" loading :text="'确认提现'" @click="toWithdraw" :options="{ fs: '30', ls:'10',br: '100' }" />
    </view>
</template>

<script>
import { depositApi } from '@/api/ModuleCenter';
import { userApi } from '@/api/ModulesUser.js';
import { appToken } from '@/utils/Cache.js'

export default {
    components: { },
    data() {
        return {
			formData:{
				'amount': '',
				'channel': '',
				'payPassword': '',
				'realName': '',
			},
			canAmount:0,
            Nomsg: false,
            hasClickCode: false // 是否已经点击了【获取验证码】
        };
    },
    computed: { },
    watch: {
        'formData.amount': {
            handler(newValue, oldValue) {
                if (newValue < 0) {
                    setTimeout(() => {
                        this.formData.amount = 0;
                    }, 0);
                    uni.showToast({ title: '提现金额必须大于0', icon: 'none' });
                }else if (newValue > this.canAmount) {
                    setTimeout(() => {
                        this.formData.amount = oldValue;
                    }, 0);
                    uni.showToast({ title: '不能大于最大可提现金额', icon: 'none' });
                }else if (!this.$checkInfo([{ type: 'amount', value: newValue }])) {
                    if (newValue) {
                        setTimeout(() => {
                            this.formData.amount = oldValue;
                        }, 0);
                    }
                }
            },
            deep: true // 数组须要深度监听
        }
    },
    onLoad(option) {
       this.formData.channel = option.channel || ''
	   depositApi.wallet().then(res => {
	   	if(res.code && res.data){
	   		this.canAmount = res.data.availableAmount
	   	}
	   })
    },
    mounted() {},
    methods: {
		// 全部提现
		allWithdrawal(){
			if(this.canAmount <= 0)return
			this.formData.amount = this.canAmount
		},
		clean(flag, index) {
		     this.formData[flag] = '';
		},
        toWithdraw() {
			if(!this.$checkInfo([
			    { type:'hasValue',value:this.formData.amount,msg:'请输入提现金额' },
			    { type:'hasValue',value:this.formData.channel,msg:'请选择提现方式' },
			    { type:'hasValue',value:this.formData.realName,msg:'请输入真实姓名' },
			    { type:'payPwd',value:this.formData.payPassword,msg:'请输入正确的支付密码' },
			])) return;
            depositApi.walletWithdraw(this.formData).then(res => {
            	this.hasClickCode = false;
                const self = this;
				console.log(res,'res');
                if (res.code == 1) {
					console.log(66666666);
                    uni.navigateTo({ url: `/ModuleCenter/wallet/withdrawSuccess?formData=${encodeURIComponent(JSON.stringify(self.formData))}` });
                    uni.hideLoading(); // 成功后马上清除Toast.loading
                }
			}).catch((err) => {
				if (err.response?.data.code == -1000) {
					// #ifdef MP
					appToken.toLogin()
					// #endif
					// #ifdef H5
					if(this.$utils.getUa().isWeixin){
						appToken.toLogin()
					}
					// #endif
					// #ifdef APP-PLUS
					plus.oauth.getServices(
						(services) => {
							// console.log('services: ' + JSON.stringify(services))
							let auth = ''
							services.forEach((element) => {
								if (element.id == 'weixin') {
									auth = element
								}
							})
							auth.logout(
								(e) => {},
								(e) => {}
							) // 注销登录授权认证,这个可以删掉，但删掉后，要隔一段时间后才能让你选择另一个账号登录
							auth.login(
								(res) => {
									if (res.target) {
										userApi.updateUserOpenId({ thirdPartyIdentifier:res.target.authResult.openid,credentials:res.target.authResult.access_token,authType:'WECHAT_APP' }).then(res => {
											if (res.code && !this.hasUpdateUserOpenId) {
												this.toWithdraw()
												this.$set(this,'hasUpdateUserOpenId',true)// 已经请求过updateUserOpenId接口的，不再重新执行toWithdraw()方法
											}
										})
									}
								},
								(error) => {}
							)
						},
						(error) => {}
					)
					// #endif
				}
			});
        },

        // 全部提现
        allAmount() {
            this.withdrawalsParams.amount = this.maxAmount;
        },
        // 获取是否已经点击了【获取验证码】
        change(val) {
            this.hasClickCode = val;
        }
    }
};
</script>
<style>page{background-color: var(--backgroundcolor);}</style>
<style scoped></style>
