<!-- 支付结果页面 -->
<template>
    <view class="w750 font-28" :style="{ '--themescolor': themes.color, '--themesrgba02': themes.rgb02  }">
		<ls-header theme></ls-header>
        <template v-if="!isEmpty">
            <view class="bg-main text-white" style="height: 375rpx;">
				<!-- 支付成功 -->
				<template v-if="!errorMsg&&!$u.test.isEmpty(orderIfo)">
					<view class="flex-col-center" v-if="orderType=='INTEGRAL'">
					    <view class="flex-center">
							<text class="iconfont icon-success" style="font-size: 50rpx;"></text>
					        <text class="font-weight font-36 ml-2">兑换成功</text>
					    </view>
					    <text class="mt-2">可继续兑换或查看订单</text>
					</view>
					<view class="flex-col-center" v-else>
					    <view class="flex-center">
							<text class="iconfont icon-success" style="font-size: 50rpx;"></text>
					        <text class="font-weight font-36 ml-2">支付成功</text>
					    </view>
					    <text class="mt-2">您的订单已经支付，我们会为您尽快安排发货</text>
					</view>
					<view class="w-100 flex-center mt-3">
						<template v-if="payType=='YEEPAY_WX_PAY'">
							<button class="h-56r w-200r font-26 bg-main text-white rounded-100 border border-white flex-center" open-type="launchApp" :app-parameter="true">返回APP</button>
						</template>
						<template v-else>
							<view class="h-56r w-200r font-26 rounded-100 border border-white flex-center" @click="$switchTab(`/pages/index/index`)">继续购物</view>
							<view class="h-56r w-200r font-26 rounded-100 border border-white flex-center ml-4" @click="goOrder">查看订单</view>
						</template>
					</view>
					<view class="w-100 px-2 mt-6">
						<view class="h-30r w-100 rounded-100" style="background: rgba(0,0,0,0.2);"></view>
						<view class="w-100 px-2 position-relative" style="margin-top: -15rpx;">
							<view class="w-100 bg-white text-999 p-3" style="border-bottom-right-radius: 24rpx; border-bottom-left-radius: 24rpx;">
								<view class="font-weight font-32 text-333">订单信息</view>
								<view class="pt-3 pb-2 d-flex a-center border-bottom-dashed-ddd"  v-if="orderType=='INTEGRAL'">
								    <view class="text-333" style="width: 160rpx;">兑换积分：</view>
								    <view class="flex-1 line-clamp1">
										{{orderIfo.amount}}
									</view>
								</view>
								<view class="pt-3 pb-2 d-flex a-center border-bottom-dashed-ddd" v-else >
								    <view class="text-333" style="width: 160rpx;">实付金额：</view>
								    <view class="flex-1 line-clamp1">
										{{orderIfo.amount|priceFilter}}
									</view>
								</view>
								<view class="pt-3 pb-1 d-flex ">
								    <view class="text-333 py-1" style="width: 160rpx;">订单编号：</view>
									<view class="flex-1 line-clamp1">
										<view class="py-1" v-for="(orderItem) in orderIfo.settlementItem" :key="orderItem.id">
											{{orderItem.orderNumber}}
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</template>
				<!-- 支付失败 -->
				<template v-else>
					<view class="flex-col-center">
					    <view class="flex-center">
							<text class="iconfont icon-close" style="font-size: 50rpx;"></text>
					        <text class="font-weight font-36 ml-2">支付失败</text>
					    </view>
					    <text class="mt-2">支付失败原因：{{errorMsg}}</text>
					</view>
					<view class="w-100 flex-center mt-3">
						<view class="h-56r w-200r font-26 rounded-100 border border-white flex-center" @click="$switchTab(`/pages/index/index`)">放弃支付</view>
						<view class="h-56r w-200r font-26 rounded-100 border border-white flex-center ml-4" @click="rePay">重新支付</view>
					</view>
					<view class="w-100 px-2 mt-6" v-if="amount">
						<view class="h-30r w-100 rounded-100" style="background: rgba(0,0,0,0.2);"></view>
						<view class="w-100 px-2 position-relative" style="margin-top: -15rpx;">
							<view class="w-100 bg-white text-999 p-3" style="border-bottom-right-radius: 24rpx; border-bottom-left-radius: 24rpx;">
								<view class="font-weight font-32 text-333">订单信息</view>
								<view class="pt-3 pb-2 d-flex a-center border-bottom-dashed-ddd"  v-if="orderType=='INTEGRAL'">
								    <view class="text-333" style="width: 160rpx;">兑换积分：</view>
								    <view class="flex-1 line-clamp1">
										{{amount}}
									</view>
								</view>
								<view class="pt-3 pb-2 d-flex a-center border-bottom-dashed-ddd" v-else >
								    <view class="text-333" style="width: 160rpx;">应付金额：</view>
								    <view class="flex-1 line-clamp1">
										{{amount|priceFilter}}
									</view>
								</view>
								<view class="pt-3 pb-1 d-flex ">
								    <view class="text-333 py-1" style="width: 160rpx;">业务单号：</view>
									<view class="flex-1 line-clamp1">
										<view class="py-1">
											{{subSettlementSn}}
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</template>
            </view>
        </template>
		
		
		<!-- #ifdef H5 -->
			<u-modal v-model="payModal.visible" :title="payModal.title" :confirm-text="payModal.confirm" @confirm="getPayResult" @cancel="payCancel"  show-cancel-button>
				<view class="slot-content font-24 text-center text-999 py-2">
					<template v-if="payModal.confirmText='已付款'">
						<view>如已完成付款，请点击“已付款”；</view>
						<view class="mt-1">如未完成付款，请点击“取消”并重新去付款</view>
					</template>
					<template v-else>
						<view>若已付款，可能银行反应延迟了，</view>
						<view class="mt-1">请重新检测</view>
					</template>
				</view>
			</u-modal>
		<!-- #endif -->
		
		
    </view>
</template>

<script>
import { orderApi } from '@/api/ModulesOrder.js';
export default {
    components: {},
    data() {
        return {
            isEmpty: true,
            orderIfo: {}, // 订单信息
            errorMsg:false,
            subSettlementSn:'',
			orderType:'',
			h5Weixin:false,
			timer:null, //调用定时器
			num:null, //调用次数
			payModal:{
				visible:false,
				confirm:'已付款',
				title:'支付确认',
			},
			payType:'',// 如果是APP端选择了易宝微信支付，调起小程序支付成功后，显示返回APP按钮
			
			orderNumber:'',//【支付失败】后点击【重新支付】用
			settlementType:'',//【支付失败】后点击【重新支付】用
			amount:'',//【支付失败】后点击【重新支付】用
        };
    },
    computed: { },
    onLoad(option) {
        // uni.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: this.themes.color })//页面导航条变成主题颜色
        this.errorMsg = option.message || null
        this.subSettlementSn = option.subSettlementSn || null
        this.h5Weixin = option.h5Weixin ? true : false
        this.orderType = option.orderType ||null
		this.payType = option.payType ||null
		// 兑换成功，可继续兑换或查看订单
		
		this.settlementType = option.settlementType;//【支付失败】后点击【重新支付】用
		if (option.orderNumber) {
			this.orderNumber = JSON.parse(decodeURIComponent(option.orderNumber))//【支付失败】后点击【重新支付】用
		}
		this.amount = option.amount || null//【支付失败】后点击【重新支付】用

		this.payDo()
    },
    mounted() { },
    onShow() { },
	onUnload(){
		clearInterval(this.timer)
	},
	onBackPress(options) {
		clearInterval(this.timer)
	},
	beforeDestroy() {
		clearInterval(this.timer)
	},
    methods: {
		payDo(){
			if(this.h5Weixin){
				this.payModal.visible=true
			}else if(!this.errorMsg) {
				uni.showLoading({ title: '系统处理中',mask:true });
				// 接口如果请求失败(请求成功的话直接清除计时器)，每三秒请求一次接口，直到第五次请求完毕
				this.timer = setInterval(this.pollingPayResult(), 3000)
			  
			} else {
			    this.isEmpty = false;
			}
		},
		//轮询支付结果
		pollingPayResult(){
				this.num++
				// 获取成功的订单数据
				orderApi.successOrderDetail(this.subSettlementSn).then(res => {
				    if (res.code) {
						if(res.data.state===1){
							 this.orderIfo = res.data||{};
							 this.isEmpty=false
							 clearInterval(this.timer)
						}
				    }else{
						this.errorMsg = res.msg
					}
				}).finally(()=>{
					uni.hideLoading()
					if(this.num===5){
						clearInterval(this.timer);
						this.isEmpty=false
						this.errorMsg="支付超时"
					}
				})
			return this.pollingPayResult
		},
		//获取支付结果
		getPayResult(){
			orderApi.successOrderDetail(this.subSettlementSn).then(res => {
			    if (res.code == 1) {
					if(res.data.state===1){
						this.orderIfo = res.data||{};
						this.isEmpty=false
					}else{
						this.payModal.confirm="重新检测"
						this.payModal.title="未支付成功"
						setTimeout(()=>{
							this.payModal.visible=true
						},1000)
					}
			    }
			})
		},
		payCancel(){
			this.payModal.visible=false
			window.history.back()
		},
        // 跳转订单列表
        goOrderList() {
            sessionStorage.setItem('status', '');
            uni.navigateTo({ url: `/ModuleOrder/orderList/orderList` })
        },
		
		rePay(){
			const payParams = {
				orderNumber: encodeURIComponent(JSON.stringify(this.orderNumber)),
				settlementType: this.settlementType
			};
			uni.redirectTo({ url: `/ModuleOrder/submitOrder/payOrder${this.$u.queryParams(payParams)}` });
		},
		goOrder(){
			if (this.orderIfo.orderId) {
				this.$redirectTo(`/ModuleOrder/orderList/orderDetail?orderId=${this.orderIfo.orderId}`)
			}else{
				this.$redirectTo(`/ModuleOrder/orderList/orderList`)
			}
		}
    },
};
</script>

<style>
page {
	background-color: var(--backgroundcolor);
}
</style>
<style scoped>
</style>
