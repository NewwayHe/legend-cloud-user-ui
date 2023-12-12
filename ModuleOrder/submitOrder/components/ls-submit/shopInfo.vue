<template>
	<!-- /*
     * @Descripttion:收货地址
    */ -->
	<view>
		<view class="border-top-20bg bg-fff pl-2 pr-2" v-for="item in orderInfo.shopOrderList" :key="item.shopId">
			<!-- 商品店铺 -->
			<view class="d-flex pt-2 pb-2 font-28">
				<view class="flex-1 flex-start position-relative mr-2 overflow-h">
					<text class="iconfont icon-dianpu mr-1" style="font-size: 28rpx"></text>
					<text class="flex-1 line-clamp1">{{ item.shopName }}</text>
				</view>
			</view>
			<!-- 购买的店铺商品 -->
			<template v-if="checkOneGood(item)">
				<template v-if="checkGoodStatus(item)">
					<view v-for="good in item.skuList" :key="good.productId">
						<template v-if="good.statusFlag">
							<view class="clearfix pt-2 pb-2 position-relative border-top border-f1">
								<view class="float-left mr-1" style="position: relative; width: 160rpx; height: 160rpx;">
									<ls-image :options="{ w: '100%', h: '100%' }" :src="good.pic" />
								</view>
								<view class="font-28 overflow-h">
									<text class="line-clamp2" v-if="good.productName">{{ good.productName }}</text>
									<view class="text-999 font-24 line-clamp1" v-if="good.cnProperties">{{ good.cnProperties }}</view>
									<view class="text-main d-block font24">
										<template v-if="good.totalDiscountAmount">
											<ls-price :options="{ is: 32 }" :price="good.discountedPrice" />
											<ls-price className="ml-2 line-through" :options="{ic: '#B2B2B2', is: 24, ds: 24}" :price="good.price" v-if="good.price"/>
										</template>
										<ls-price v-else :price="good.price" />
									</view>
								</view>
								<view class="position-absolute text-right text-999 font-24 " style="bottom: 26rpx; right: 0;">×{{ good.totalCount }}</view>
							</view>
						</template>
					</view>
				</template>
				<template v-else>
					<view class="text-center font-24 p-2">
						<text>暂无可结算商品，请尝试重新选择收货地址或重新购买</text>
					</view>
				</template>
			</template>

			<!-- 2个以上商品时使用scroll-view -->
			<template v-else>
				<view class="border-top border-f1 d-flex a-center py-2 pl-2">
					<template v-if="checkGoodStatus(item)">
						<scroll-view style="width: 95%" scroll-x="true">
							<view class="d-flex">
								<template v-for="good in item.skuList">
									<view v-if="good.statusFlag" :key="good.productId" class="mr-1" style="width: 160rpx; height: 160rpx; flex: 0 0 160rpx;">
										<ls-image :options="{ w: '100%', h: '100%' }" :src="good.pic" />
									</view>
								</template>
							</view>
						</scroll-view>
						<view class="d-flex a-center" style="align-self: stretch;" @click="showGood(item)">
							<view class="d-block" style="width: 30rpx; height: 30rpx;">
								 <text class="font-28 iconfont icon-ArrowRight text-666"></text>
							</view>
						</view>
					</template>
					<template v-else>
						<view class="flex-1 text-center font-24">
							<text>暂无可结算商品，请尝试重新选择收货地址或重新购买</text>
						</view>
					</template>
				</view>
			</template>

			<!-- 运费 -->
			<view class="bg-fff font-28 d-flex a-center p-2 border-top border-f1" v-if="checkGoodStatus(item)">
				<view class="text-666 d-block">配送方式</view>
				<view class="flex-1 text-right d-block ml-1 position-relative" v-if="!item.deliveryAmount">
					<text class="">快递免邮</text>
					<text class=""></text>
				</view>
				<view class="flex-1 text-right ml-1 position-relative d-flex a-center" v-else>
					<view class="mr-2 line-clamp1">快递</view>
				</view>
			</view>
			<!-- 优惠券 -->
			<view class="bg-fff font-28 d-flex a-center p-2 border-top border-f1" @click="chooseCoupon(item.shopCouponDTO.couponItems,item,item.shopCouponDTO.unavailableCouponItems)"
			 v-if="checkGoodStatus(item)">
				<view class="text-666 d-block">
					<text>店铺优惠券</text>
				</view>
				<view class="flex-1 text-right ml-1 position-relative d-flex a-center">
					<template v-if="item.shopCouponDTO">
						<text class="mr-2 line-clamp1">使用{{ item.shopCouponDTO.useCouponCount }}张优惠券，已优惠{{ item.shopCouponDTO.discountAmount }}元</text>
						<view class="v-top d-inline-block" style="width: 30rpx; height: 30rpx;">
							 <text class="font-28 iconfont icon-ArrowRight text-666"></text>
						</view>
					</template>
					<template v-else>
						<text class="mr-2 line-clamp1">暂无优惠券</text>
					</template>
				</view>
			</view>


			<!-- 发票 -->
			<view class="bg-fff font-28 d-flex a-center p-2 border-top border-f1" @click="chooseInvoice(item)"
			 v-if="checkGoodStatus(item) && item.invoiceFlag">
				<view class="text-666 d-block">开具发票</view>
				<template>
					<view class="flex-1 text-right ml-2 position-relative d-flex a-center" v-if="item.userInvoiceFlag">
						<text class="mr-2 ml-2 line-clamp1" style="max-width: 460rpx;" v-if="item.userInvoiceBo && item.userInvoiceFlag">
							{{ item.userInvoiceBo.type == 'NORMAL' ? '普通发票' : '增值税专票' }} - {{ item.userInvoiceBo.titleType == 'PERSONAL' ? '个人' : '公司' }}，{{
												item.userInvoiceBo.company
											}}
						</text>
						<text class="mr-2 ml-2 line-clamp1" style="max-width: 460rpx;" v-else>暂无发票信息</text>
						<view class="v-top d-inline-block" style="width: 30rpx; height: 30rpx;">
							 <text class="font-28 iconfont icon-ArrowRight text-666"></text>
						</view>
					</view>
					<view class="flex-1 text-right ml-1 position-relative d-flex a-center" v-else>
						<text class="mr-2 line-clamp1">不开发票</text>
						<view class="v-top d-inline-block" style="width: 30rpx; height: 30rpx;">
							 <text class="font-28 iconfont icon-ArrowRight text-666"></text>
						</view>
					</view>
				</template>
			</view>

			<!-- 卖家留言 -->
			<view class="bg-fff font-28 d-flex a-center p-2 border-top border-f1" v-if="checkGoodStatus(item)">
				<view class="text-666 d-block">买家留言</view>
				<view class="flex-1 text-right d-block ml-1 position-relative">
					<input class="w-100 font-28" type="text" placeholder="给卖家留言" v-model="item.remark" />
				</view>
			</view>
			<!-- 店铺小计 -->
			<view class="bg-fff font-28 d-flex a-center p-2 pro-price border-top border-f1" @click="checkTotal(item)"
			 v-if="checkGoodStatus(item)">
				<view class="flex-1 text-right d-block ml-1 position-relative">
					应付总金额：
					<ls-price :price="item.shopOrderAmount" :options="{is:32}" />
				</view>
				<view class="d-inline v-top " style="width: 28rpx; height: 28rpx;">
					  <text class="font-28 iconfont icon-ArrowRight text-666"></text>
				</view>
			</view>
		</view>
		
		<!-- 优惠券(平台级别) -->
		<view class="border-top-20bg bg-fff pl-2 pr-2 border-bottom-20bg" v-if="orderInfo.platformCoupons&&orderInfo.platformCoupons.length">
		    <view class="bg-fff font-28 d-flex a-center p-2 border-top border-f1 overflow-h"  @click="chooseCoupon(orderInfo.platformCoupons,'platform',orderInfo.platformUnAvailableCouponList)">
		        <view class="text-666 d-block">
		            <text>平台优惠券</text>
		        </view>
		        <view class="flex-1 text-right ml-1 position-relative d-flex a-center overflow-h">
		            <text class="mr-2 line-clamp1">{{orderInfo.platformCouponName||''}}</text>
		            <text class="font-28 iconfont icon-ArrowRight text-666"></text>
		        </view>
		    </view>
		</view>
		
		
		<!-- //店家发票 -->
		<dialogShopInvoice ref="dialogShopInvoice" :activeShop="activeShop" :orderInfo="orderInfo" @invoiceHandle="changeInvoice"></dialogShopInvoice>
		
		<!-- 浏览商品 -->
		<dialogGoodList ref="goods" :activeShop="activeShop" :orderInfo="orderInfo"></dialogGoodList>
		
		<!-- 店铺结算 -->
		<dialogShopSettl ref="shopTotal"  :activeShop="activeShop" :orderInfo="orderInfo"></dialogShopSettl>
	
		<!-- 店家优惠券 -->
		<dialog-coupon ref="coupon" :couponList="currentCoupon" :unCouponList="unCouponList" @couponHandle="changeCoupon" />
		
	</view>
</template>

<script>
	import dialogShopInvoice from './dialogShopInvoice.vue' //店家发票
	import dialogGoodList from './dialogGoodList.vue' //浏览店家商品
	import dialogShopSettl from './dialogShopSettl.vue' //浏览店家商品
	import DialogCoupon from '@/components/submit-order/DialogCoupon'
	import { orderApi } from '@/api/ModulesOrder.js';
	export default {
		components: {
			'dialog-coupon':DialogCoupon,
			dialogShopInvoice,
			dialogGoodList,
			dialogShopSettl,
		},
		filters: {},
		props: {
			orderInfo: {
				type: [Object,String],
				default: () => {
					return {}
				}
			}
		},
		data() {
			return {
				activeShop:{},
				invoiceDict:{},
				currentCoupon:[],//点击当前优惠券列表
				unCouponList:[],//点击当前优惠券不可用列表
				activeId:'',
			}
		},
		computed: {},
		watch: {},
		mounted() {},
		destroyed() {},
		methods: {
			changeInvoice(){
				this.$emit('orderChange')
			},
			// 切换优惠券
			changeCoupon(coupon) {
				let couponList=this.currentCoupon.reduce((pre,item)=>{
					if(item.selectStatus==1){
						pre.push(item.couponId)
					}
					return pre
				},[])
				if (coupon.selectStatus == 0) {
					couponList.push(coupon.couponId)
				}else{
					couponList=couponList.filter(couponId=>couponId!=coupon.couponId)
				}
			
				if(this.activeShop=="platform"){
					orderApi.platformCoupon({
					    confirmOrderId:this.orderInfo.id,
					}, couponList).then(res => {
					    this.orderInfo = res.data
						this.currentCoupon=	res.data.platformCoupons//如果当前优惠券是平台
						this.unCouponList=	res.data.platformUnAvailableCouponList//如果当前优惠券是平台
					    if(this.orderInfo.regionalSalesFlag) {
					        this.showTip()
					    }
					}).catch(err => {
					    console.log("change conpon", err)
					})
				}else{
					orderApi.changeCoupon({
					    confirmOrderId: this.orderInfo.id,
					    shopId: this.activeShop.shopId
					}, couponList).then(res => {
					    this.orderInfo = res.data
						let activeShop = this.orderInfo.shopOrderList.find(item=>item.shopId==this.activeShop.shopId)
						this.currentCoupon= activeShop.shopCouponDTO.couponItems
						this.unCouponList= activeShop.shopCouponDTO.unavailableCouponItems
					    // this.$refs.coupon.changePopup()
					    if(this.orderInfo.regionalSalesFlag) {
					        this.showTip()
					    }
					}).catch(err => {
					    console.log("change conpon", err)
					})
				}
			},
			// 存在失效商品时显示弹窗(点击返回则返回到上一页)
			showTip() {
			    uni.showModal({
			        content: '部分商品不支持该区域销售，请重新选择',
			        cancelText: '返回',
			        confirmText: '仍然购买',
			        success: (res)=> {
			            if (res.cancel) {
							this.$utils.pages.goBeforePage(1);
			            }
			        }
			    });
			},
			// 选择优惠券
			chooseCoupon(coupon,shop,unCoupon) {
				this.activeShop=shop
			    this.currentCoupon = coupon||[]
			    this.unCouponList= unCoupon||[]
			    this.$refs.coupon.changePopup()
			},
			
			// 选择开具发票
			chooseInvoice(shop) {
				if(!shop.invoiceFlag){
					return
				}
				this.activeShop = shop;
				if (!this.invoiceDict[this.activeShop.shopId]) {
					this.$set(this.invoiceDict, this.activeShop.shopId, this.activeShop.userInvoiceFlag);
				}
				this.$refs.dialogShopInvoice.changePopup();
			},
			
			
			// 检查店铺结算金额
			checkTotal(shop) {
			    this.activeShop = shop
			    this.$refs.shopTotal.changePopup()
			},
			
			// 查看店家商品
			showGood(shop) {
			    this.activeShop = shop
			    this.$refs.goods.changePopup()
			},
			
			
			// 检查店铺的商品状态
			checkGoodStatus(shop) {
			    let num = 0
			    for(let item of shop.skuList) {
			        if (!item.statusFlag) {
			            num++
			        }
			    }   
			    return !(num == shop.skuList.length)
			},
			
			// 检查店铺中的商品可购买数量，如果==1，则使用详细展示
			checkOneGood(shop) {
			    console.log(shop)
			    let num = 0
			    for (let item of shop.skuList) {
			        if (item.statusFlag) {
			            num++
			        }
			    }
			    return num == 1
			}
		}
	}
</script>

<style lang="scss" scoped></style>
