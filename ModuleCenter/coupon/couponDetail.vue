<template>
    <view :style="{ '--themescolor': themes.color,'--gradientcolor':themes.rgb07 }">
        <ls-header showHeadSelect title="优惠券详情" />
        <view class="safearea-bb pt-2" v-if="!$u.test.isEmpty(couponData)">
			<couponItems className="mx-2 mb-2" v-model="couponData" :type="2" :source="type"></couponItems>
			<view class="ml-3 my-2">基本信息</view>
            <view class="bg-fff p-2 font-28 mx-2 mb-2 rounded-20">
                <view class="mt-2">
                    <view class="mb-2 d-flex font-24">
                        <text class="text-999 d-block w-25">优惠券名称：</text>
                        <text class="flex-1" style="line-height: 1.7">{{ couponData.title }}</text>
                    </view>
                    <view class="mb-2 d-flex font-24" v-if="couponData.receiveStartTime&&couponData.receiveEndTime">
                        <text class="text-999 d-block w-25">领取时间：</text>
                        <text class="flex-1">
                            <text>{{ couponData.receiveStartTime||'' }}</text>
                            至
                            <text>{{ couponData.receiveEndTime||'' }}</text>
                        </text>
                    </view>
                    <view class="mb-2 d-flex font-24">
                        <text class="text-999 d-block w-25">使用时间：</text>
                        <text class="flex-1" v-if="couponData.useStartTime && couponData.useEndTime">
                            <text>{{ couponData.useStartTime||'' }}</text>
                            至
                            <text>{{ couponData.useEndTime||'' }}</text>
                        </text>
						<text class="flex-1" v-else>
							领取
						    <text>{{ couponData.useDayLater||'' }}</text>
						    天后
						    <text>{{ couponData.withinDay||'' }}</text>
							天内可用
						</text>
                    </view>
                    <view class="mb-2 d-flex font-24">
                        <text class="text-999 d-block w-25">金额：</text>
                        <view class="flex-1">
                            ￥{{couponData.amount}}
                        </view>
                    </view>
                    <view class="mb-2 d-flex font-24">
                        <text class="text-999 d-block w-25">使用规则：</text>
                        <view v-if="couponData.minPoint > 0" class="flex-1">
                            满{{couponData.minPoint}}可用
                        </view>
                        <text v-else class="flex-1">无门槛</text>
                    </view>
                    <view class="mb-2 d-flex font-24">
                        <text class="text-999 d-block w-25">返还规则：</text>
                        <view class="flex-1">
                            <view v-if="couponData.nonPaymentRefundableFlag" class="mb-1">提交订单未付款可退还</view>
                            <view v-if="couponData.paymentAllAfterSalesRefundableFlag" class="mb-1">生成订单全部商品申请售后可退还</view>
                            <view v-if="couponData.paymentRefundableFlag" class="mb-1">生成订单申请退款可退还</view>
                            <view v-if="!couponData.paymentRefundableFlag && !couponData.paymentAllAfterSalesRefundableFlag && !couponData.nonPaymentRefundableFlag" class="mb-1">不退还</view>
                        </view>
                    </view>
                    <view class="mb-2 d-flex font-24" v-if="couponData.shopProviderFlag">
                        <text class="text-999 d-block w-25">店铺名称：</text>
                        <text class="flex-1">{{ couponData.shopName }}</text>
                    </view>

                    <view class="mb-2 d-flex font-24">
                        <text class="text-999 d-block w-25">可用{{couponData.shopProviderFlag?'商品':'商家'}}：</text>
                        <view class="flex-1 text-main">
                            <template v-if="couponData.shopProviderFlag">
                                <view @click="toShopIndex" v-if="couponData.useType == 0">店铺内所有商品可用<text class="iconfont icon-ArrowRight" style="font-size: 20rpx;"></text></view>
                                <view @click="toShopGood" v-else>店铺内部分商品可用<text class="iconfont icon-ArrowRight" style="font-size: 20rpx;"></text></view>
                            </template>
                            <template v-if="!couponData.shopProviderFlag">
                                <view @click="toCouponShops" v-if="couponData.useType == 0">平台内全部商家可用<text class="iconfont icon-ArrowRight" style="font-size: 20rpx;"></text></view>
                                <view @click="toCouponShops" v-else>平台内部分商家可用<text class="iconfont icon-ArrowRight" style="font-size: 20rpx;"></text></view>
                            </template>
                        </view>
                    </view>
					<template v-if="type=='integral'">
						<view class="mb-2 d-flex font-24">
						    <text class="text-999 d-block w-25">兑换积分：</text>
						    <text class="flex-1">{{ couponData.integral || 0 }}积分</text>
						</view>
						<view class="mb-2 d-flex font-24">
						    <text class="text-999 d-block w-25">兑换人数：</text>
						    <text class="flex-1">{{ couponData.receiveCount || 0 }}人已兑换</text>
						</view>
					</template>

                </view>
            </view>
			<template v-if="couponData.historyList && couponData.historyList.length">
				<view class="ml-3 mb-2">历史信息</view>
				<view class="bg-fff rounded-20 p-2 font-28 mx-2 mb-2">
				    <view class="mt-2">
						<view v-for="(item, index) in couponData.historyList" :key="index" class="mb-2 d-flex font-24">
							<text class="text-999 d-block w-25"> {{ item.type == 1 ? '领取优惠券：' : '使用优惠券：' }}</text>
							<text class="flex-1">{{ item.datetime }}</text>
							<view class="">{{ item.type == 1 ? '+' : '-' }}{{item.amount | priceFilter}}</view>
							<view v-if="item.orderId" class="ml-2 text-nowrap text-main" @click="$navigateTo(`/ModuleOrder/orderList/orderDetail?orderId=${item.orderId}`)">
								查看
								<text class="iconfont icon-ArrowRight" style="font-size: 20rpx;"></text>
							</view>
						</view>
				    </view>
				</view>
			</template>
        </view>
        <ls-empty className="center-xy" :title="'暂无相关优惠券'" :type="3" :paging="paging"/>
		<!-- 我的优惠券按钮 -->
		<goCouponList/>
		
		<!-- 如果是商家端或PC后台跳进来预览，则加个遮罩层不让点击 -->
		<u-mask :show="isPreview" :duration="0" :custom-style="{background: 'rgba(0, 0, 0, 0)'}"></u-mask>
    </view>
</template>

<script>
import { mapState } from 'vuex'
import couponItems from './components/couponItems.vue'
import goCouponList from './components/goCouponList.vue'

import { couponApi } from '@/api/ModuleCenter'

import mpShare from '@/mixins/mpShare.js'
export default {
	components: { couponItems,goCouponList },
	mixins: [mpShare],
    data() {
        return {
            couponId: '',
            type: '', // 是从哪里跳进来的(带参数进来的逻辑要特殊处理): integral=>积分优惠券(自带参数，不用请求接口); history=>优惠券历史(按钮和标签都显示‘已使用’); 
            couponData: {}, // coupon数据
			paging: {
			    status: 'loading',
			    error: false, // 是否错误
			    emptylist: false // 是否显示列表为空时的样式
			},
			couponUserId: '', // 用户领券ID
			isPreview: false,// 如果是shareUrlRedirect页面跳过来预览(商家端或PC后台跳进来)，就加个遮罩层防止点击
        }
    },
    computed: {
        ...mapState(['stausBarHeight']),
    },
    watch: {},
    onLoad(options) {},
    mounted() {},
    onShow() {
		const options = this.$utils.pages.getPageRoute().options
		// #ifdef MP
		if (options.scene) return; // 如果是扫小程序码进过来的,就在这里return掉。则用sceneCallBack()方法来执行getDetaildata()
		// #endif
		this.couponId = options.id || null
		this.type = options.type || null
		this.couponUserId = options.couponUserId || null
		this.isPreview = !!options.isPreview
		// 如果是积分商城里点击了积分优惠券进来
		if (this.type == 'integral') {
			this.couponData = JSON.parse(decodeURIComponent(options.item || null))// 如果是积分商城里点击了积分优惠券进来
			this.paging.status = 'noMore'
		}else{
			this.getData()
		}
	},
    methods: {
		// 小程序码跳转进来[mixin->mpShare]
		sceneCallBack(data){
			console.log('sceneCallBack：',data);
			this.couponId = data.id;
			this.type = data.type
			this.getData();
		},
        // 详情
        getData() {
			this.paging = {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false // 是否显示列表为空时的样式
			}
			couponApi.couponDetail({
				id: this.couponId,
				couponUserId: this.couponUserId
			}).then((res) => {
				if(res.code == 1){
					this.couponData = res.data
				} 
			}).catch((err) => {
				this.paging.error = true
			}).finally((res) => {
				this.paging.status = 'noMore'
			    if (!this.$checkInfo([{ type: 'hasValue', value: this.couponData }])) {
					this.paging.emptylist = true
			    }
			});
        },

        // 去店铺详情
        toShopIndex() {
            this.$navigateTo(`/ModuleGoods/shopHome/shopIndex?shopId=${this.couponData.shopId}`)
        },
        // 去使用平台优惠券
        toCouponShops() {
            this.$navigateTo(`/ModuleCenter/coupon/couponShops?id=${this.couponData.id}&type=${this.type}`)
        },

        // 去优惠券可用商品列表页
        toShopGood() {
            this.$navigateTo(`/ModuleCenter/coupon/couponGoods?id=${this.couponData.id}&shop=${this.couponData.shopId}&type=${this.couponData.useType}`)
        },
    },
}
</script>
<style>page { background: #f2f2f2; }</style>
<style scoped>
</style>
