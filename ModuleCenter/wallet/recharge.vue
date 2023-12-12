<template>
    <!-- 充值 -->
    <view class="w750 overflow-h" :style="{ '--themescolor': themes.color }">
        <!-- 充值 -->
		<view class="p-2">支付方式</view>
		<view class="bg-fff pl-2 pr-2"  >
			<radio-group @change="choosePayType">
				<label class="flex-between py-2 font-28 border-f1" :class="[{'border-top':index!=0}]" v-for="(value, key, index) in payTypeData">
					<view class="flex-center">
						<view class="w-60r h-100 mr-2">
							<text class="iconfont" :class="[payTypeIcons[key][0]]" :style="{color:payTypeIcons[key][1],fontSize:`60rpx`}" v-if="!$u.test.isEmpty(payTypeIcons[key])"></text>
						</view>
						<text class="flex-1">{{ payTypeIcons[key][2] }}</text>
					</view>
					<radio :value="key" class="scale-08" :checked="curPayType == key" :color="themes.color"></radio>
				</label>
			</radio-group>
		</view>
		
		<view class="p-2">充值金额</view>
		<view class="px-2 d-flex  a-center bg-fff py-2">
			<text class="mr-3 font-36 font-weight">￥</text>
			<!-- 这里加一个遮罩层 是因为input设置了disabled 导致输入框的点击事件无法捕获 -->
			<view class="flex-1 position-relative" @click.capture="clickPop">
				<input type="text" v-model="rechargeMoney" placeholder="充值金额必须大于0且不超过10000000" disabled/>
				<view class="position-absolute top-0 left-0 right-0 bottom-0 bg-transparent" style="z-index: 2;"></view>
			</view>
		</view>
		<ls-button className="but-main h-88r m-4" loading :text="'立即充值'" @click="rechargeClick" :options="{fs:'30',br:'100'}"/>
		<!--支付表单-->
        <!-- /充值 -->
		<!-- #ifdef H5 -->
		  <view class="pay" v-html="payData" v-if="payData"></view>
		<!-- #endif -->
		
		<u-keyboard v-model="show" mode="number" safe-area-inset-bottom  :tooltip="false" @change="valChange" @backspace="backspace">
			 <!-- 在火狐浏览器会丢失上边框 所以要加一个border-bottom；但是其他端会粗1px -->
			<view class="flex-center p-2 overflow-h h-80r position-relative" style="border-bottom: 2rpx solid #e4e7ed;" >
				<view class="text-999 px-2" @click="show=false">取消</view>
				<view class="flex-1 text-center font-36 font-arial line-clamp1">
					{{rechargeMoneyTemp}}
					<text class="iconfont icon-close text-ccc ml-2" @click="rechargeMoneyTemp=''" v-if="rechargeMoneyTemp"></text>
				</view>
				<view class="text-main px-2" @click="show=false;rechargeMoney=rechargeMoneyTemp">确定</view>
			</view>
		</u-keyboard>
		
    </view>
</template>

<script>
import platformPayto from '@/service/payTo.js'; // 调用支付
export default {
    components: { },
    data() {
        return {
			show: false,
            rechargeMoney: '', // 存放用于判断输入的金额数据
            rechargeMoneyTemp: '', // rechargeMoney的缓存
			payData:'',// 支付返回html表单
            show: false, // 是否显示 支付完成询问弹框
            payType: platformPayto.payType ,// platformPayto定义的支付类型
			curPayType:'', // 用来记录支付方式以及choose cur显不显示
			payTypeData:{//可用支付方式
				FREE_PAY: 1,//免费支付
				ALI_PAY:1,//支付宝支付
				WX_PAY:1,//微信支付
				SIMULATE_PAY:1,//模拟支付
			},
			payTypeIcons:{
			    'FREE_PAY':['icon-mianfei','#40CDA9','免费支付'],//免费支付
			    'ALI_PAY':['icon-zhifubao','#0CAEEF','支付宝支付'],//支付宝支付
			    'WX_PAY':['icon-weixinzhifu','#01CA02','微信支付'],//微信支付
			    'SIMULATE_PAY':['icon-yinhangka','#FEB347','模拟支付'],//模拟支付
			},
        };
    },
    computed: { },
    onLoad(option) {
		
        // this.$applyStyle(this.themes.color);

        // 如果有路由参数
        if (option) {
            if (option.isReturn) {
                // 有isReturn参数说明是微信H5支付返回
                this.show = true;
            }
        }
    },

    mounted() { },

	watch:{
		rechargeMoneyTemp(val, oldVal) {
			if (val > 10000000) {
				setTimeout(() => {
					this.rechargeMoneyTemp = oldVal;
				}, 0);
				uni.showToast({ title:'充值金额最多1,000,000',icon:'none' })
			} else if (!this.$checkInfo([{ type: 'amount', value: val }])) {
				if (val) {
					// 解决APP没有限制小数点后两位数字
					setTimeout(() => {
						this.$nextTick(() => {
							this.rechargeMoneyTemp = oldVal;
						})
					}, 10);
				}
			}
		},
	},
		

    methods: {
		/**
		 * 选择支付方式
		 */
		choosePayType(e) {
			console.log(e);
		    this.curPayType = e.detail.value
		},
		
		valChange(val) {
			// 将每次按键的值拼接到value变量中，注意+=写法
			this.rechargeMoneyTemp += val;
			console.log(this.rechargeMoneyTemp);
		},
		// 退格键被点击
		backspace() {
			// 删除value的最后一个字符
			if(this.rechargeMoneyTemp.length) this.rechargeMoneyTemp = this.rechargeMoneyTemp.substr(0, this.rechargeMoneyTemp.length - 1);
			console.log(this.rechargeMoneyTemp);
		},
		// 弹出充值键盘
		clickPop() {
			this.show = true;
		},

        // 点击‘立即充值’
        rechargeClick() {
            if (!this.curPayType) {
                uni.showToast({ title:'请勾选支付方式',icon:'none' })
                return;
            }

            if (!this.rechargeMoney) {
				this.show = true;
                uni.showToast({ title:'请输入充值金额',icon:'none' })
                return;
            }

            // 防连续点击
            uni.showLoading({ mask: true, title: '充值中...',success:(res) => {
                setTimeout(() => {
                    uni.hideLoading()// 防止特殊情况下页面上一直显示loading
                },5000)
            } });

            // 调接口生成充值
            const rechargeParam = {
                amount: this.rechargeMoney,
                paytypeId: this.curPayType,
            };

            recharge(rechargeParam).then(res => {
                // 充值接口
                if (res.status != 1) {
                    uni.showToast({ title:res.msg,icon:'none' })
                    return;
                }

                if (!res.result) {
                    uni.showToast({ title:'充值错误, 请联系商城客服!',icon:'none' })
                    return;
                }

                const subNumbers = [res.result.pdrSn];
                console.log(subNumbers)

                // ‘立即充值’获取到pdrSn后调用payTo接口
                console.log(this.curPayType)
                
                // #ifdef H5
                // 如果是微信端打开阿里支付
                if (this.$utils.getUa().isWeixin && this.curPayType == platformPayto.payType.ALIPAY) {
                    const jumpAddress = `/commonModules/submitOrder/wxAliPay?payType=${this.curPayType}&subNumbers=${subNumbers.join(',')}&subSettlementType=USER_PRED_RECHARGE`
                    location.replace(jumpAddress)// 由于IOS上点右上角的复制链接时，用uni.redirectTo跳转的话，?后面的参数是复制不了的，所以要用到location.replace()方法
                    // uni.redirectTo({url: `/commonModules/submitOrder/wxAliPay?payType=${this.curPayType}&subNumbers=${subNumbers.join(',')}&subSettlementType=USER_PRED_RECHARGE`});
                    return;
                }
                // #endif

                return platformPayto.recharge(this.curPayType, subNumbers);
            }).then(res => {
                if (res.success) {
                    uni.hideLoading()
                    // 说明返回的类型是表单, 需要前端发起请求真实支付 处理成功后由后端重定向到支付结果
                    if (res.dataType == 'form') {
                        this.payData = res.data.prepayResult;
                        this.$nextTick(() => { document.forms[0].submit() })
                    } else {
                        // 否则返回的是JSON
                        uni.navigateTo({ url: `/walletModules/preDeposit/rechargeResult?subSettlementSn=${res.data.subSettlementSn}&subSettlementType=${res.data.subSettlementType}` })
                    }
                } else {
                    uni.showToast({ title:res.msg,icon:'none' })
                }
            })
        }
    },
};
</script>

<style>page{background-color: var(--backgroundcolor);}</style>
<style scoped>
</style>
