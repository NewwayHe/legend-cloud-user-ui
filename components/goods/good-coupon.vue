<template>
    <!-- /*
     * @Descripttion:商品详情楼层：优惠券选项/已选
    */ -->
	<!-- , '--themesrgba02': themes.rgb02,'--gradientcolor':gradientcolor -->
    <view class="font-24" :style="{ '--themescolor': themes.color ,'--themesrgba02': themes.rgb01,'--gradientcolor':themes.rgb06 }">
        <!-- 领券 -->
		<view class="p-2 flex-between overflow-h border-f1-bottom-x20r" :class="className" @click="changePopup" v-if="listTemp&&type=='good'">
            <text class="text-333 font-28 pr-2 font-weight">领券</text>
            <view class="text-999 flex-1 overflow-h flex-between">
                <view class="flex-1 overflow-x-scroll flex-start text-nowrap">
					<view class="d-inline-block mx text-main font-20 position-relative border rounded-5" 
						style="padding: 0rpx 16rpx 0rpx 16rpx"
						:style="{ 'border-color': themes.rgb03 }"  
						v-for="(item, index) in listTemp" 
						:key="index"
					>
						<text class="">{{item.minPoint?'满'+item.minPoint:''}}减{{item.amount}}</text>
						<!-- 左边的半圆 -->
						<view class="overflow-h position-absolute h-20r bg-white zindex-2" style="width: 10rpx;left: -2rpx;top: 20%;">
							<view class="w-20r h-20r rounded-circle bg-white border position-absolute right-0" :style="{'border-color': themes.rgb03}"></view>
						</view>
						<!-- 右边的半圆 -->
						<view class="overflow-h position-absolute h-20r bg-white zindex-2" style="width: 10rpx;right: -2rpx;top: 20%;">
							<view class="w-20r h-20r rounded-circle bg-white border position-absolute left-0" :style="{'border-color': themes.rgb03}"></view>
						</view>
					</view>
					
                </view>
                <text class="px-3">{{ listTemp.length > 0 ? `共${listTemp.length}张` : '暂无优惠券' }}</text>
            </view>
            <text class="iconfont icon-caidan1 text-999"></text>
        </view>
		
        <u-popup v-model="showPopup" zIndex="999" border-radius="28" safe-area-inset-bottom closeable>
            <view class="font-weight font-32 py-1 px-2 my-2 text-center">优惠券</view>
            <view class="mt-4 px-2" style="height: 60vh">
                <template v-if="listTemp && listTemp.length">
                    <scroll-view style="height: 100%" scroll-y @scrolltolower='scrollToBottom'>
                        <view
                            class="my-2 transition-all05 mx-1"
                            :class="[item.unfold?'rounded-5 h-auto':'rounded-8 h-200r']"
                            v-for="(item,index) in listTemp"
                            :key="index"
                        >
                            <view class="flex-start h-200r position-relative">
								<view class="flex-col-center text-center p-2 h-100 flex-shrink overflow-h but-main-rgb02"  style="width: 250rpx;">
									<view class="overflow-x w-100">
										￥<text class="font-60 font-weight">{{item.amount}}</text>
									</view>
									{{ item.minPoint == 0 ? '无门槛' : `满${item.minPoint}可用` }}
								</view>
                                <view class="flex-1 p-2 h-100 flex-col-between bg-white" style="box-shadow: 1px 0px 4px rgba(0, 0, 0, .1);">
                                    <view class="w-100">
                                        <view class="line-clamp2 pr-2">{{ item.title }}</view>
										<view class="line-clamp1 mt">
										    <text v-if="!item.receivedFlag">
												<text v-if="item.receiveStartTime&&item.receiveEndTime">{{ item.receiveStartTime | dateformat('YYYY.MM.DD') }}-{{ item.receiveEndTime | dateformat('YYYY.MM.DD') }}</text>
												<text v-else>无</text>
											</text>
										    <text v-else>{{ item.receiveEndTime  | dateformat('YYYY年MM月DD日 HH:mm:ss') }}到期</text>
										</view>
                                    </view>
									<view class="flex-between w-100 mt">
										<view class="" @click.stop="getDetail(item.id,index)">
											规则详情
											<text class="iconfont icon-ArrowDown pr-1 d-inline-block transition-all05" style="font-size: 20rpx;" :style="{transform: `rotate(${item.unfold?180:0}deg)`}"></text>
										</view>

										<!-- 已领取 -->
										<view class="position-absolute right-0 top-0 w-120r h-100r overflow-h" v-if="item.receivedFlag">
											<ls-signet size="150" space="30" fontSize="32" scale=".8" borderWidth="4">已领取</ls-signet>
										</view>

										<!-- 如果‘发放数量’== ‘已领取优惠券数量’-->
										<view class="position-absolute right-0 top-0 w-120r h-100r overflow-h" v-else-if="item.count==item.receiveCount">
											<ls-signet size="150" space="30" fontSize="32" scale=".8" borderWidth="4">已领完</ls-signet>
										</view>
										
										<view
										    v-else
										    class="l-gradient-l text-fff h-50r px-2 rounded-100 flex-center"
										    @click="getCoupon(item.id,index)"
										>
										    立即领取
										</view>
									</view>
                                </view>
                                <!-- <view class="dotted-line-x-20r position-absolute w-100" style="bottom: -10rpx;"></view> -->
								<view class="dotted-line-y-15r position-absolute h-100" style="left: -8rpx;"></view>
                            </view>
                            <!-- 基本信息 -->
                            <view class="pt-3 pb-1 pl-3 pr-2 overflow-h bg-f8 text-999" :class="{'transition-all05':item.unfold}" :style="{ transform: `scale(1, ${String(item.unfold?1:0)})`, 'transform-origin': '0% 0%', }">
                                <view class="mb-2 d-flex">
                                    <view class="" style="width: 20%">券名称</view>
                                    <text class="flex-1">{{ couponData.title }}</text>
                                </view>
                                <view class="mb-2 d-flex" v-if="couponData.receiveStartTime&&couponData.receiveEndTime">
                                    <view class="" style="width: 20%">领取时间</view>
                                    <text class="flex-1">
                                        <text>{{ couponData.receiveStartTime||'' }}</text>
                                        至
                                        <text>{{ couponData.receiveEndTime||'' }}</text>
                                    </text>
                                </view>
                                <view class="mb-2 d-flex" v-if="couponData.useStartTime&&couponData.useEndTime">
                                    <view class="" style="width: 20%">使用时间</view>
                                    <text class="flex-1">
                                        <text>{{ couponData.useStartTime||'' }}</text>
                                        至
                                        <text>{{ couponData.useEndTime||'' }}</text>
                                    </text>
                                </view>
                                <view class="mb-2 d-flex">
                                    <view class="" style="width: 20%">金额</view>
                                    <view class="flex-1">
										￥{{couponData.amount||0}}
                                    </view>
                                </view>
                                <view class="mb-2 d-flex">
                                    <view class="" style="width: 20%">使用规则</view>
                                    <view v-if="couponData.minPoint > 0" class="flex-1">
                                        满￥{{couponData.minPoint}}可用
                                    </view>
                                    <text v-else class="flex-1">无门槛</text>
                                </view>
                                <view class="mb-2 d-flex">
                                    <view class="" style="width: 20%">返还规则</view>
                                    <view class="flex-1">
                                        <view v-if="couponData.nonPaymentRefundableFlag" class="mb-1">提交订单未付款可退还</view>
                                        <view v-if="couponData.paymentAllAfterSalesRefundableFlag" class="mb-1">生成订单全部商品申请售后可退还</view>
                                        <view v-if="couponData.paymentRefundableFlag" class="mb-1">生成订单申请退款可退还</view>
                                        <view v-if="!couponData.paymentRefundableFlag && !couponData.paymentAllAfterSalesRefundableFlag && !couponData.nonPaymentRefundableFlag" class="mb-1">不退还</view>
                                    </view>
                                </view>
                                <view class="mb-2 d-flex" v-if="couponData.shopProviderFlag">
                                    <view class="" style="width: 20%">店铺名称</view>
                                    <text class="flex-1">{{ couponData.shopName }}</text>
                                </view>
                                <view class="mb-2 d-flex">
                                    <view class="" style="width: 20%">可用{{couponData.shopProviderFlag?'商品':'商家'}}</view>
                                    <view class="flex-1 text-main">
                                        <template v-if="couponData.shopProviderFlag">
                                            <view @click="toShopIndex" v-if="couponData.useType == 0">店铺内所有商品可用</view>
                                            <view @click="toShopGood" v-else>店铺内部分商品可用</view>
                                        </template>
                                        <template v-if="!couponData.shopProviderFlag">
                                            <view @click="toCouponShops" v-if="couponData.useType == 0">平台内全部商家可用</view>
                                            <view @click="toCouponShops" v-else>平台内部分商家可用</view>
                                        </template>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                </template>
                <ls-empty :title="'暂无可用优惠券'" v-else />
            </view>
        </u-popup>
        
    </view>

</template>

<script>
// API接口
import { goodsApi } from '@/api/ModuleGoods.js'
import { couponApi } from '@/api/ModuleCenter'

// VUE功能组件
    
export default {
    name: 'good-coupon',

    components: {},

    props: {
        className: String,
        list: Array,
        type: {
            type: [String,Number],
            default:'good',//good：普通商品页面，cart：购物车页面
        },
    },

    data() {
        return {
            listTemp:[],
            showPopup:false,
            couponData:'',//优惠券详情
            height: 240 // 记录主体class的高度
        };
    },

    computed: { },

    watch: {
        'list': {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.listTemp = newVal
                }
            },
            deep: true,
            immediate: true
        }
    },

    created() {},

    mounted() {
    },

    methods: {

        // 领取优惠券
        getCoupon(id,index) {
            goodsApi.getCoupon(id).then((res) => {
				if( res.code == 1 ){
					uni.showToast({ title: '领取成功', icon: 'none' })
					this.listTemp[index].receivedFlag = true//由于现在就算设置了不限领的优惠券，只要领取一张，在未用之前，都不能再领取，所以不用再重新请求接口
					this.$emit('getCouponSuccess')
				}
            })
        },
        // 获取优惠券详情
        getDetail(id,index) {
            this.couponData = ''
            if(this.listTemp[index]['unfold']==true){//如果是点击已经展开的顶，则折叠起来
                this.$set(this.listTemp[index],'unfold',false)
                return
            }
            
            for (var i = 0; i < this.listTemp.length; i++) {
                this.$set(this.listTemp[i],'unfold',false)
            }
            couponApi.couponGetById({id: id}).then((res) => {
                if (res.code==1) {
                    this.couponData = res.data
                    this.$set(this.listTemp[index],'unfold',true)
                }
            })
        },
        // 去店铺详情
        toShopIndex() {
            this.$navigateTo(`/ModuleGoods/shopHome/shopIndex?shopId=${this.couponData.shopId}`)
        },
        // 去使用平台优惠券
        toCouponShops() {
            this.$navigateTo(`/ModuleCenter/coupon/couponShops?id=${this.couponData.id}`)
        },
        
        // 去优惠券可用商品列表页
        toShopGood() {
            this.$navigateTo(`/ModuleCenter/coupon/couponGoods?id=${this.couponData.id}&shop=${this.couponData.shopId}&type=${this.couponData.useType}`)
        },
        /**
         * 显示隐藏popup弹框
         */
        changePopup() {
            this.showPopup = !this.showPopup
            this.$emit('change', this.showPopup)
        },
		
		scrollToBottom() {
			this.$emit('getCouponMore')
		}
    }
};
</script>

<style lang="scss" scoped>
</style>
