<template>
	<view :style="{ '--themescolor': themes.color, '--themesrgba08': themesRGBA08 }">
		<ls-header theme backColor="#fff" title="提交订单"></ls-header>
		<!-- 提交订单 -->
		<view class="pb-12 mb-2" v-if="!$u.test.isEmpty(orderInfo)">
			<receivingAddr ref="receivingAddr" :orderInfo="orderInfo" :addrId="addrId" @setUserContact="setUserContact"></receivingAddr>
			<view class="safearea-bb">
				<!-- 店铺信息 -->
				<view class="mt-2 mx-2 p-2 bg-fff rounded-12" v-for="item in orderInfo.shopOrderList" :key="item.shopId">
					<!-- 商品店铺 -->
					<view class="d-flex pt-2 pb-2 font-28">
						<view class="flex-start flex-1 pr-2 overflow-h">
							<text class="iconfont icon-dianpu mr-1" style="font-size: 28rpx"></text>
							<text class="flex-1 line-clamp1">{{ item.shopName }}</text>
						</view>
					</view>
					<!-- 购买的店铺商品 -->
					<template v-if="checkOneGood(item)">
						<template v-if="checkGoodStatus(item)">
							<view v-for="good in item.skuList" :key="good.productId">
								<!-- <template v-if="good.statusFlag"> -->
								<view class="clearfix py-2 position-relative">
									<view class="float-left mr-1 position-relative w-160r h-160r">
										<ls-image className="overflow-h" :options="{ w: '100%', h: '100%', br: '8' }" :src="good.pic">
											<text
												v-if="!good.statusFlag"
												class="bg-main position-absolute w-100 font-20 text-fff text-center text-nowrap line-h-md"
												style="left: 0; bottom: 0"
												>商品区域限售</text
											>
										</ls-image>
									</view>
									<view class="font-28 overflow-h">
										<text class="line-clamp2" v-if="good.productName">{{ good.productName }}</text>
										<view class="text-999 line-clamp1 font-24" v-if="good.cnProperties">
											<text class="bg-f8 rounded-5 px-1 py">{{ good.cnProperties }}</text>
										</view>
										<view class="flex-between font-24 mt-1 text-nowrap">
											<!-- 积分订单 -->
											<view v-if="orderInfo.type == 'INTEGRAL'">
												<view class="text-main">
													{{ good.integral }}
													<text class="ml text-main">积分</text>
												</view>
											</view>
											<!-- 非积分订单 -->
											<view class="flex-start" v-else>
												<text class="font-28">
													{{ (good.totalDiscountAmount ? good.discountedPrice : good.price) | priceFilter }}
												</text>
												<text class="line-through ml-2 text-999" v-if="good.originalPrice">{{ good.originalPrice }}</text>
											</view>
											<view class="text-right text-999">×{{ good.totalCount }}</view>
										</view>
										<!-- 限时折扣、满减满折、积分抵扣等优惠信息 -->
										<u-notice-bar
											bg-color="#ffffff"
											padding="18rpx 0rpx"
											:volume-icon="false"
											:list="[
												(good.limitDiscountsMarketingPrice
													? `${good.limitDiscountsMarketingInfo}，已优惠${good.limitDiscountsMarketingPrice}元  `
													: '') +
													(good.rewardMarketingPrice
														? `${good.rewardMarketingInfo}，已优惠${good.rewardMarketingPrice}元  `
														: '') +
													(orderInfo.type != 'INTEGRAL' && good.maxDeductionAmount
														? `积分最高可抵扣￥${good.maxDeductionAmount}元`
														: ''),
											]"
											v-if="
												good.statusFlag &&
												(good.limitDiscountsMarketingPrice ||
													good.rewardMarketingPrice ||
													(orderInfo.type != 'INTEGRAL' && good.maxDeductionAmount))
											"
										></u-notice-bar>
									</view>
								</view>
							</view>
						</template>
						<template v-else>
							<view class="text-center font-24 py-2"><text>暂无可结算商品，请尝试重新选择收货地址或重新购买</text></view>
						</template>
					</template>

					<!-- 2个以上商品时使用scroll-view -->
					<template v-else>
						<view class="d-flex a-center py-2 pl-2">
							<template v-if="checkGoodStatus(item)">
								<scroll-view class="w-100" scroll-x="true">
									<view class="d-flex">
										<template v-for="good in item.skuList">
											<view :key="good.skuId" class="mr-1" style="width: 160rpx; height: 160rpx; flex: 0 0 160rpx">
												<ls-image className="overflow-h" :options="{ w: '100%', h: '100%', br: '10' }" :src="good.pic">
													<text
														v-if="!good.statusFlag"
														class="bg-main position-absolute w-100 font-24 text-fff text-center line-h-md"
														style="left: 0; bottom: 0"
														>商品区域限售</text
													>
												</ls-image>
											</view>
										</template>
									</view>
								</scroll-view>
								<view class="d-flex a-center position-relative w-20r" style="align-self: stretch">
									<view
										class="h-100 position-absolute flex-center text-nowrap px-2"
										style="right: -20rpx; background-color: rgba(255, 255, 255, 0.8)"
										@click="showGood(item)"
									>
										<text class="font-24">共{{ getTotalNum(item.skuList) }}件</text>
										<text class="iconfont icon-ArrowRight text-666" style="font-size: 24rpx"></text>
									</view>
								</view>
							</template>
							<template v-else>
								<view class="flex-1 text-center font-24"><text>暂无可结算商品，请尝试重新选择收货地址或重新购买</text></view>
							</template>
						</view>
					</template>

					<!-- 运费 -->
					<view class="bg-fff font-28 d-flex a-center py-2" v-if="checkGoodStatus(item)">
						<view class="text-666 d-block">配送方式</view>
						<view class="ml-1 flex-1 flex-end">
							<template v-if="!item.deliveryAmount">
								<text class="">快递免邮</text>
								<text class=""></text>
							</template>
							<template v-else>
								<view class="mr-2 flex-end">
									快递
									<ls-price :options="{ is: 28, ds: 28 }" :price="item.deliveryAmount" />
								</view>
							</template>
						</view>
					</view>

					<!-- 运费 -->
					<view class="bg-fff font-28 d-flex a-center py-2" v-if="orderInfo.type == 'INTEGRAL'">
						<view class="text-666 d-block">兑换积分</view>
						<view class="flex-1 text-right d-block ml-1 position-relative">
							<text class="text-main mr-1">{{ item.productTotalIntegral }}</text>
							积分
						</view>
					</view>
					<template v-else>
						<!-- 优惠券 -->
						<!-- 平台优惠券拼团、团购、秒杀、积分商品不显示 -->
						<view
							class="bg-fff font-28 d-flex a-center py-2"
							v-if="
								orderInfo.type != 'GROUP_SALE' &&
								orderInfo.type != 'SECKILL' &&
								orderInfo.type != 'MERGE_GROUP' &&
								orderInfo.type != 'INTEGRAL' &&
								checkGoodStatus(item)
							"
						>
							<view class="text-666 d-block"><text>店铺优惠券</text></view>

							<view class="flex-1 text-right ml-1 position-relative flex-end">
								<template v-if="item.shopCouponDTO">
									<view
										class="d-flex a-center w-100"
										@click="chooseCoupon(item.shopCouponDTO.couponItems, item, item.shopCouponDTO.unavailableCouponItems)"
									>
										<text class="mr-2 line-clamp1 flex-1">
											使用{{ item.shopCouponDTO.useCouponCount }}张优惠券，已优惠{{ item.shopCouponDTO.discountAmount }}元
										</text>
										<view class="v-top d-inline-block" style="width: 30rpx; height: 30rpx">
											<text class="iconfont icon-ArrowRight text-666" style="font-size: 28rpx"></text>
										</view>
									</view>
								</template>
								<template v-else>
									<text class="line-clamp1">暂无优惠券</text>
								</template>
							</view>
						</view>
					</template>

					<!-- 发票 -->
					<view
						class="bg-fff font-28 d-flex a-center py-2"
						@click="chooseInvoice(item)"
						v-if="checkGoodStatus(item) && item.invoiceFlag && orderInfo.type != 'INTEGRAL'"
					>
						<view class="text-666 d-block flex-1">开具发票</view>
						<template>
							<view class="text-right ml-2 position-relative d-flex a-center" v-if="item.userInvoiceFlag">
								<text class="mr-2 ml-2 line-clamp1" style="max-width: 460rpx" v-if="item.userInvoiceBo && item.userInvoiceFlag">
									{{ item.userInvoiceBo.type == "NORMAL" ? "普通发票" : "增值税专票" }} -
									{{ item.userInvoiceBo.titleType == "PERSONAL" ? "个人" : "公司" }}，{{ item.userInvoiceBo.company }}
								</text>
								<text class="mr-2 ml-2 line-clamp1" style="max-width: 460rpx" v-else>暂无发票信息</text>
								<view class="d-inline-block v-middle"
									><text class="iconfont icon-ArrowRight text-666" style="font-size: 24rpx"></text
								></view>
							</view>
							<view class="text-right ml-1 position-relative d-flex a-center" v-else>
								<text class="mr-2 line-clamp1">不开发票</text>
								<view class="v-top d-inline-block v-middle"
									><text class="iconfont icon-ArrowRight text-666" style="font-size: 24rpx"></text
								></view>
							</view>
						</template>
					</view>

					<!-- 卖家留言 -->
					<view class="bg-fff font-28 d-flex a-center py-2" v-if="checkGoodStatus(item)">
						<view class="text-666 d-block">买家留言</view>
						<view class="flex-1 text-right d-block ml-1 position-relative">
							<input class="w-100 font-28" type="text" placeholder="给卖家留言" v-model="item.remark" />
						</view>
					</view>

					<!-- 店铺小计 -->
					<view
						class="bg-fff font-28 d-flex a-center py-2"
						@click="checkTotal(item)"
						v-if="orderInfo.type != 'INTEGRAL' && checkGoodStatus(item)"
					>
						<view class="flex-1 text-right d-block ml-1 position-relative">
							应付总金额：
							<!-- 如果是预售 -->
							<template v-if="orderInfo.type == 'PRE_SALE'">
								<text class="text-main">{{ item.preShopOrderAmountCoupon | priceFilter }}</text>
							</template>
							<template v-else>
								<text class="text-main">{{ item.shopOrderAmountBeforePlatformCoupon | priceFilter }}</text>
							</template>
						</view>
						<view class="d-inline v-middle"><text class="iconfont icon-ArrowRight text-666 ml-1" style="font-size: 24rpx"></text></view>
					</view>

					<view class="bg-fff font-28 d-flex a-center py-2" v-if="orderInfo.type == 'INTEGRAL'">
						<view class="text-666 d-block">可用积分</view>
						<view class="flex-1 text-right d-block ml-1 position-relative">
							<text class="text-main mr-1">{{ userInfo.availableIntegral || 0 }}</text>
							积分
						</view>
					</view>
				</view>
				<!-- 优惠券(平台级别) -->
				<view class="my-2 mx-2 p-2 bg-fff rounded-12" v-if="orderInfo.type != 'INTEGRAL'">
					<view
						class="bg-fff font-28 flex-start py-2 border-f1 overflow-h"
						v-if="orderInfo.type != 'INTEGRAL' && userInfo.availableIntegral && orderInfo.shouldTotalIntegral"
						@click="changePointsSwitch"
					>
						<view class="text-666 flex-1 flex-start">
							可用
							<text class="text-999 v-text-bottom">
								{{
									userInfo.availableIntegral > orderInfo.shouldTotalIntegral
										? orderInfo.shouldTotalIntegral
										: userInfo.availableIntegral
								}}积分
							</text>
							抵扣
							<ls-price :options="{ is: 28, ds: 28 }" :price="orderInfo.shouldDeductionAmount" />
							元
						</view>
						<u-switch
							:disabled="true"
							:active-color="themes.color"
							inactive-color="#eee"
							size="40"
							v-model="orderInfo.deductionFlag"
						></u-switch>
					</view>

					<view
						class="bg-fff font-28 flex-start py-2 border-f1 overflow-h"
						@click="changeSwitch"
						v-if="walletInfo && walletInfo.available && orderInfo.useWalletInfo"
					>
						<view class="text-666 flex-1 flex-start">
							余额支付
							<view class="font-24">
								<text class="text-999 ml-2">钱包余额为：{{ walletInfo.amount }}</text>
								抵
								<ls-price :options="{ is: 28, ds: 28 }" :price="orderInfo.useWalletInfo.amount" />
							</view>
						</view>
						<u-switch
							:disabled="true"
							:active-color="themes.color"
							inactive-color="#eee"
							size="40"
							v-model="orderInfo.useWalletInfo.allowed"
						></u-switch>
					</view>
					<template v-if="orderInfo.useWalletInfo.allowed">
						<view class="flex-end">
							<ls-message-input
								mode="box"
								:maxlength="6"
								:dot-fill="true"
								:width="60"
								:breathe="false"
								v-model="password"
								:activeColor="themes.rgb02"
								:inactiveColor="themes.rgb02"
								:disabled-keyboard="isPayPwd"
								@finish="finish"
								:focus="true"
							></ls-message-input>
						</view>
						<view class="text-right py-2 font-24">
							<text class="text-999">忘记密码？</text>
							<text
								class="text-main"
								@click="$navigateTo(`/ModulesUser/account/editData?type=paypwd&name=${userInfo.mobile}&title=修改支付密码`)"
							>
								重置支付密码
							</text>
						</view>
					</template>
					<!-- 平台优惠券拼团、团购、秒杀、积分商品不显示 -->
					<view
						class="bg-fff font-28 flex-start py-2 overflow-h"
						@click="chooseCoupon(orderInfo.platformCoupons, { couponType: 'platform' }, orderInfo.platformUnAvailableCouponList)"
						v-if="
							orderInfo.type != 'GROUP_SALE' &&
							orderInfo.type != 'SECKILL' &&
							orderInfo.type != 'MERGE_GROUP' &&
							orderInfo.type != 'INTEGRAL'
						"
					>
						<view class="text-666 d-block"><text>平台优惠券</text></view>
						<view class="flex-1 text-right ml-1 position-relative flex-end overflow-h">
							<view class="mr-2 line-clamp1">
								<template v-if="orderInfo.platformCoupons && orderInfo.platformCoupons.length">
									使用{{ orderInfo.usePlatformCouponCount }}张优惠券
									<text v-if="orderInfo.platformAmount">，已优惠{{ orderInfo.platformAmount }}元</text>
								</template>
								<template v-else> 无可用 </template>
							</view>
							<text class="iconfont icon-ArrowRight text-666 v-middle" style="font-size: 24rpx"></text>
						</view>
					</view>
				</view>

				<!-- 失效商品 -->
				<invalidGoods :orderInfo="orderInfo"></invalidGoods>
			</view>
			<!-- 底部 -->
			<view
				class="safearea-bb-white position-fixed w-100 bottom-0 font-28 bg-fff zindex-99"
				style="bottom: 0; box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05)"
				v-if="orderInfo"
			>
				<view class="h-100r w-100 flex-between px-2">
					<view class="but-pe-none h-80r flex-center rounded-100 flex-1" v-if="!orderInfo.userAddressBO"> 请先添加收货地址 </view>
					<view class="but-pe-none h-80r flex-center rounded-100 flex-1 position-relative" v-else-if="orderInfo.regionalSalesFlag">
						<view
							class="font-28 w-100vw h-80r flex-start pl-2 position-absolute"
							style="background: #fff7ed; color: #d68652; top: -90rpx"
						>
							<text class="iconfont icon-laba1 mr-1" style="font-size: 32rpx"></text>
							含区域限售商品，不支持当前收货区域购买
						</view>
						商品失效，不可提交订单
					</view>
					<template v-else>
						<view class="flex-1 pr-5">
							<template v-if="orderInfo.type == 'INTEGRAL'">
								<text class="text-main mr">{{ orderInfo.totalIntegral }}</text>
								积分
							</template>
							<template v-else>
								<text>合计：</text>
								<!-- 如果是预售 -->
								<template v-if="orderInfo.type == 'PRE_SALE'">
									<ls-price :price="orderInfo.depositPrice" :options="{ is: 40, iw: 600, dw: 600 }" />
								</template>
								<template v-else>
									<ls-price :price="orderInfo.totalAmount" :options="{ is: 40, iw: 600, dw: 600 }" />
								</template>
							</template>
						</view>
						<ls-button
							className="but-main w-240r h-80r"
							text="提交订单"
							loading
							:asyncFunction="submitOrder"
							:options="{ br: '100', fs: '28' }"
						/>
					</template>
				</view>
			</view>
		</view>
		<!-- /提交订单 -->
		<ls-empty className="center-xy" :type="2" :title="'对不起，你要提交的订单不存在！'" :paging="paging" @reLoad="initData" reLoad />

		<!-- //店家发票 -->
		<dialogShopInvoice ref="dialogShopInvoice" :activeShop="activeShop" :orderInfo="orderInfo" @invoiceHandle="invoiceHandle"></dialogShopInvoice>

		<!-- 浏览商品 -->
		<dialogGoodList ref="goods" :activeShop="activeShop" :orderInfo="orderInfo"></dialogGoodList>

		<!-- 店铺结算 -->
		<dialogShopSettl ref="shopTotal" :activeShop="activeShop" :orderInfo="orderInfo"></dialogShopSettl>

		<!-- 店家优惠券 -->
		<dialog-coupon ref="coupon" :couponList="currentCoupon" :unCouponList="unCouponList" @couponHandle="changeCoupon" />
	</view>
</template>

<script>
import { mapState } from "vuex";

// 页面组件
import receivingAddr from "./components/ls-submit/receivingAddr.vue"; //收货地址
import shopInfo from "./components/ls-submit/shopInfo.vue"; //下单店铺商品信息
import invalidGoods from "./components/ls-submit/invalidGoods.vue"; //失效商品

// 弹窗组件
import dialogShopInvoice from "./components/ls-submit/dialogShopInvoice.vue"; //店家发票
import dialogGoodList from "./components/ls-submit/dialogGoodList.vue"; //浏览店家商品
import dialogShopSettl from "./components/ls-submit/dialogShopSettl.vue"; //浏览店家商品
import DialogCoupon from "@/components/submit-order/DialogCoupon"; //优惠券弹窗
import { encryption } from "@/utils/encryption.js";
// import  * as encryption  from '@/utils/encryption.js';

//api接口
import { orderApi } from "@/api/ModulesOrder.js";
export default {
	components: {
		receivingAddr,
		shopInfo,
		invalidGoods,
		"dialog-coupon": DialogCoupon,
		dialogShopInvoice,
		dialogGoodList,
		dialogShopSettl,
	},
	data() {
		return {
			orderId: "", // 订单id
			orderInfo: "", // 订单信息
			addrId: "", // 订单地址Id
			activeShop: {},
			currentCoupon: [], //点击当前优惠券列表
			unCouponList: [], //点击当前优惠券不可用列表
			activeId: "",
			userAddrId: "",
			isPayPwd: false, //是否填写支付密码正确 正确后不可以改
			password: "",
			walletInfo: {}, //钱包信息
			paging: {
				status: "loading",
				error: false, // 是否错误
				emptylist: false, // 是否显示列表为空时的样式
			},
		};
	},
	computed: {
		...mapState(["userInfo"]),
		themesRGBA08() {
			return `rgba(${this.themes.rgb.r}, ${this.themes.rgb.g},${this.themes.rgb.b},.8)`;
		},
	},
	watch: {},

	onLoad(options) {
		this.orderId = options.orderId || "";
		this.userAddrId = options.addrId || "";
		this.getWalletInfo();
	},

	mounted() {
		// console.log(encryption.decrypt)
	},

	onShow() {
		this.$nextTick(() => {
			// 如果内存中存在addressId，则认为是切换地址回来的，需要重新调接口
			let addressId = uni.getStorageSync("addrId");
			uni.removeStorageSync("addrId");
			if (addressId) {
				this.changeAddress(addressId);
			} else {
				this.$nextTick(() => {
					this.initData();
				});
			}
		});
	},

	methods: {
		// 订单详情页接口
		initData() {
			this.paging = {
				status: "loading",
				error: false, // 是否错误
				emptylist: false, // 是否显示列表为空时的样式
			};
			orderApi
				.orderInfo({ confirmOrderId: this.orderId })
				.then((res) => {
					if (res.code == 1) {
						this.orderInfo = res.data;
						this.addrId = this.orderInfo.userAddressBO ? this.orderInfo.userAddressBO.id : "";
						for (let item of this.orderInfo.shopOrderList) {
							this.$set(item, "couponList", {});
						}
						if (this.orderInfo.regionalSalesFlag) {
							this.showTip();
						}
					}
				})
				.catch((err) => {
					this.paging.error = true;
				})
				.finally((res) => {
					this.paging.status = "noMore";
					if (!this.$checkInfo([{ type: "hasValue", value: this.orderInfo }])) {
						this.paging.emptylist = true;
					}
				});
		},

		// 切换地址重新获取订单数据
		changeAddress(addressId) {
			this.paging = {
				status: "loading",
				error: false, // 是否错误
				emptylist: false, // 是否显示列表为空时的样式
			};
			orderApi
				.addressChange({ confirmOrderId: this.orderInfo.id, userAddrId: addressId })
				.then((res) => {
					if (res.code == 1) {
						this.orderInfo = res.data;
						this.addrId = this.orderInfo.userAddressBO ? this.orderInfo.userAddressBO.id : "";
						if (this.orderInfo.regionalSalesFlag) {
							this.showTip();
						}
					}
				})
				.catch((err) => {
					this.paging.error = true;
				})
				.finally((res) => {
					this.paging.status = "noMore";
					if (!this.$checkInfo([{ type: "hasValue", value: this.orderInfo }])) {
						this.paging.emptylist = true;
					}
				});
		},

		// 存在失效商品时显示弹窗(点击返回则返回到上一页)
		showTip() {
			uni.showModal({
				content: "部分商品不支持该区域销售，请重新选择",
				cancelText: "返回",
				confirmText: "仍然购买",
				success: (res) => {
					if (res.cancel) {
						this.$utils.pages.goBeforePage(1);
					}
				},
			});
		},

		//获取钱包信息，用于钱包余额展示和平台是否开始余额支付
		getWalletInfo() {
			orderApi.walletPayInfo().then((res) => {
				if (res.code) {
					this.walletInfo = res.data;
				}
			});
		},
		//输入完密码框调取开启密码支付，需要把输入的密码给后端
		finish(value) {
			this.password = value;
			orderApi
				.useWallet({ confirmOrderId: this.orderId, useWallet: this.orderInfo.useWalletInfo.allowed, payPassword: encryption(value) })
				.then((res) => {
					if (res.code) {
						this.orderInfo = res.data;
						this.isPayPwd = true;
					} else {
						this.password = "";
					}
				});
		},
		//切换为关闭状态需要调取接口，关闭余额支付
		changeSwitch() {
			if (!this.walletInfo.amount) {
				return uni.showToast({
					icon: "none",
					title: "钱包余额为空",
				});
			}
			// if(this.orderInfo.useWalletInfo.useWallet){
			orderApi.useWallet({ confirmOrderId: this.orderId, useWallet: !this.orderInfo.useWalletInfo.allowed }).then((res) => {
				if (res.code) {
					this.orderInfo = res.data;
					if (this.orderInfo.useWalletInfo.allowed) {
						this.isPayPwd = false;
						this.password = "";
					}
				}
			});
			return;
		},
		//切换为关闭状态需要调取接口，关闭抵扣积分
		changePointsSwitch() {
			orderApi.switchIntegralFlag({ confirmOrderId: this.orderId, integralFlag: !this.orderInfo.deductionFlag }).then((res) => {
				if (res.code) {
					this.orderInfo = res.data;
				}
			});
			return;
		},

		//选择发票后，发票信息修改到相应店铺
		invoiceHandle(currentInvoice) {
			this.orderInfo.shopOrderList.forEach((shop, shopIndex) => {
				if (shop.shopId == currentInvoice.shopId) {
					this.$set(this.orderInfo.shopOrderList, shopIndex, currentInvoice);
					this.$forceUpdate();
				}
			});
		},

		// 提交订单
		submitOrder() {
			// 买家留言部分
			let remarkList = [];
			for (let shop of this.orderInfo.shopOrderList) {
				let shopObj = {
					shopId: shop.shopId,
					message: shop.remark,
				};
				remarkList.push(shopObj);
			}

			// 提交订单
			return new Promise((resolve) => {
				orderApi
					.submitOrder({
						confirmOrderId: this.orderInfo.id,
						orderMessage: JSON.stringify(remarkList),
						deliveryType: 0, //配送类型 0快递 10自提 20二者
						contactId: this.orderInfo?.userContactBO?.id,
					})
					.then((res) => {
						if (res.code == 1) {
							this.$store.dispatch("getCartNum"); //更新购物车数量
							this.$store.dispatch("getUserInfo"); // 积分更新
							const payParams = {
								orderNumber: encodeURIComponent(JSON.stringify(res.data.orderNumberList)),
								settlementType: res.data.settlementType,
							};
							uni.redirectTo({ url: `/ModuleOrder/submitOrder/payOrder${this.$u.queryParams(payParams)}` });
						}
					})
					.catch((err) => {
						console.log(err);
						uni.showToast({ title: "网络异常，请稍后再试", icon: "none" });
					})
					.finally(() => {
						return resolve();
					});
			});
		},
		changeInvoice() {
			this.$emit("orderChange");
		},
		// 切换优惠券
		changeCoupon(coupon) {
			// 优惠券可多选
			let couponList = this.currentCoupon.reduce((pre, item) => {
				if (item.selectStatus == 1) {
					pre.push(item.couponId);
				}
				return pre;
			}, []);
			if (coupon.selectStatus == 0) {
				couponList.push(coupon.couponId);
			} else {
				couponList = couponList.filter((couponId) => couponId != coupon.couponId);
			}
			if (this.activeShop.couponType == "platform") {
				orderApi
					.platformCoupon(
						{
							confirmOrderId: this.orderInfo.id,
						},
						couponList
					)
					.then((res) => {
						this.orderInfo = res.data;
						this.currentCoupon = res.data.platformCoupons; //如果当前优惠券是平台
						this.unCouponList = res.data.platformUnAvailableCouponList; //如果当前优惠券是平台
						if (this.orderInfo.regionalSalesFlag) {
							this.showTip();
						}
					})
					.catch((err) => {
						console.log("change conpon", err);
					});
			} else {
				orderApi
					.changeCoupon(
						{
							confirmOrderId: this.orderInfo.id,
							shopId: this.activeShop.shopId,
						},
						couponList
					)
					.then((res) => {
						this.orderInfo = res.data;
						let activeShop = this.orderInfo.shopOrderList.find((item) => item.shopId == this.activeShop.shopId);
						this.currentCoupon = activeShop.shopCouponDTO.couponItems;
						this.unCouponList = activeShop.shopCouponDTO.unavailableCouponItems;
						if (this.orderInfo.regionalSalesFlag) {
							this.showTip();
						}
					})
					.catch((err) => {
						console.log("change conpon", err);
					});
			}
		},
		// 存在失效商品时显示弹窗(点击返回则返回到上一页)
		showTip() {
			uni.showModal({
				content: "部分商品不支持该区域销售，请重新选择",
				cancelText: "返回",
				confirmText: "仍然购买",
				success: (res) => {
					if (res.cancel) {
						this.$utils.pages.goBeforePage(1);
					}
				},
			});
		},
		// 选择优惠券
		chooseCoupon(coupon, shop, unCoupon) {
			console.log(coupon, "coupon");
			console.log(unCoupon, "unCoupon");
			console.log(shop, "shop");
			this.activeShop = shop;
			this.currentCoupon = coupon || [];
			this.unCouponList = unCoupon || [];
			this.$refs.coupon.changePopup();
		},

		// 选择开具发票
		chooseInvoice(shop) {
			if (!shop.invoiceFlag) {
				return;
			}
			this.activeShop = shop;
			this.$refs.dialogShopInvoice.changePopup();
		},

		// 检查店铺结算金额
		checkTotal(shop) {
			this.activeShop = shop;
			this.$refs.shopTotal.changePopup();
		},

		// 查看店家商品
		showGood(shop) {
			this.activeShop = shop;
			this.$refs.goods.changePopup();
		},

		// 检查店铺的商品状态
		checkGoodStatus(shop) {
			let num = 0;
			return !(num == shop.skuList.length);
		},

		// 检查店铺中的商品可购买数量，如果==1，则使用详细展示
		checkOneGood(shop) {
			// console.log(shop);
			let num = 0;
			for (let item of shop.skuList) {
				num++;
			}
			return num == 1;
		},

		// 返回当前商店的商品数量
		getTotalNum(list) {
			let num = 0;
			for (let item of list) {
				num += item.totalCount;
			}
			return num;
		},

		setUserContact(item) {
			this.orderInfo.userContactBO = item;
		},
	},
};
</script>

<style>
page {
	background-color: var(--backgroundcolor);
}
</style>

<style lang="scss"></style>
