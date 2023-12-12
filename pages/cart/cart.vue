<template>
	<view class="w750 overflow-h" style="padding-bottom: calc(100rpx + var(--safe-area-inset-bottom))" :style="{ '--themescolor': themes.color, '--gradientcolor': themes.rgb02 }">
		<view v-if="userInfo.id">
			<template v-if="!$u.test.isEmpty(shopCartList)">
				<view class="w-100" :style="{ height: `calc(88rpx + ${stausBarHeight}px)` }">
					<view class="position-fixed top-0 w-100 zindex-999 bg-fff text-000 border-box">
						<view class="w-100" :style="{ height: stausBarHeight + 'px' }"></view>
						<!-- 头部 -->
						<view class="flex-start px-3 font-28 h-88r" style="border: 0">
							<view class="flex-1 overflow-h pr-2" @click="openAddress">
								<view class="line-clamp1">
									<text class="iconfont icon-location mr-1" style="font-size: 28rpx;"></text>
									<text v-if="defaultUserAddress.areaName">{{ (defaultUserAddress.areaName || '') + (defaultUserAddress.streetName || '') }}</text>
									<text class="ml-2" v-else>请选择地址</text>
								</view>
							</view>
							<view class="d-flex">
								<view>
									<text class="entry-name" v-if="shopCartList && shopCartList.length != 0 && !showEdit" @click="showEdit = !showEdit">编辑</text>
									<text class="entry-name" v-if="showEdit" @click="showEdit = !showEdit">完成</text>
								</view>
							</view>

							<!-- 如果是是微信端，放一个胶囊的点位符 -->
							<!-- #ifdef MP-WEIXIN -->
							<view :style="{ width: wxMenuBut.placeholder + 'px', display: 'block' }"></view>
							<!-- #endif -->
						</view>
					</view>
				</view>

				<!-- 购物车 -->
				<view class="pb-2 mb-88r">
					<view class="border-top-20bg py-2" v-for="(shopItem, shopIndex) in shopCartList" :key="shopItem.shopId">
						<view class="flex-between px-3 py-2 font-28">
							<view class="flex-1 overflow-h flex-start">
								<text class="choose-new mr-2" :class="{ cur: shopItem.selectFlag }" @click.stop="shopItemChange(shopItem, shopItem.selectFlag)"></text>
								<view class="flex-1 flex-start overflow-h" @click="$navigateTo('/ModuleGoods/shopHome/shopIndex?shopId=' + shopItem.shopId)">
									<text class="iconfont icon-dianpu" style="font-size: 28rpx"></text>
									<view class="ml-1 flex-1 line-clamp1">{{ shopItem.shopName }}</view>
								</view>
							</view>
							<view
								class="text-main px-2 py rounded-100 font-20"
								:style="{ backgroundColor: themes.rgb02 }"
								@click="openCoupon(shopItem)"
								v-if="shopItem.haveCouponFlag"
							>
								优惠券
							</view>
						</view>
						<view
							class="goodsDiv font-28 position-relative"
							v-for="(marketingItem, marketingIndex) in shopItem.shopCartDiscountList"
							:key="marketingIndex"
						>
							<view class="p-2 d-flex font-28 j-sb  pl-6 border-top" v-if="marketingItem.type">
								<view class="d-flex a-center font-20 ">
									<view class="a-self-start zoom-08 ml-1 my mx px-1 py rounded mr-1 flex-shrink text-main border border-main">
										{{ marketingItem.type }}
									</view>
									<view class="line-clamp2">{{ marketingItem.desc }}</view>
								</view>
								<view class="d-flex a-center font-28 line-h text-nowrap ml-2" @click="goAddOnList(marketingItem)">
									<text>去凑单</text>
									<text class="iconfont icon-ArrowRight" style="font-size: 24rpx;"></text>
								</view>
							</view>
							<!-- 用一条虚线圈住参与【去凑单】的商品 -->
							<view
								class="position-absolute border-main zindex-99 ml-5 mt-4"
								style="top: 0;left: 0;width: 30rpx;height: calc(100% - 250rpx);border-width: 2rpx 0px 0px 2rpx;border-style:dashed;"
								v-if="marketingItem.type"
							></view>
							<template v-for="(cartItem, cartIndex) in marketingItem.cartItemList">
								<ls-swipe-action :key="cartItem.id" @click="onClose(cartItem)" :options="options">
									<view class="w-100vw h-50r pl-7 pr-2 flex-start font-24 overflow-h" style="transform-origin: left center; " v-if="cartItem.limitDiscountsMarketingId">
										<view class="l-gradient-lt a-self-start zoom-08 ml-1 my mx text-fff px-1 py position-relative rounded mr-1 flex-shrink font-20">
											限时
										</view>
										<view class="overflow-h flex-1 text-nowrap">
											<view class="line-clamp1">
												已优惠{{cartItem.limitDiscountsMarketingPrice|priceFilter}}，
												<text class="mr-2" v-for="(limitItem,limitIndex) in cartItem.limitDiscountsmarketingActivityDTO" :key="limitIndex">{{limitItem.desc}}</text>
											</view>
										</view>
									</view>
									<view class="d-flex flex-1 position-relative py-2 px-3" :class="{'border-f1-bottom-xxx':marketingIndex<(shopItem.shopCartDiscountList.length-1)}">
										<text
											class="choose-new mr-2"
											:class="{ cur: cartItem.selectFlag }"
											@click.stop="cartItemChange(shopItem, cartItem, cartItem.selectFlag)"
										></text>
										<ls-image
											className="mr-2"
											:src="cartItem.pic"
											:options="{ w: '180', h: '180', br: '10' }"
											@click="goDoodsDetail(cartItem.productId)"
										>
											<view
												style="background-color: rgba(0,0,0,0.4);"
												class="position-absolute left-0 bottom-0 w-100 text-fff flex-center font-24 py"
												v-if="cartItem.regionalSalesFlag"
											>
												<text>区域限售</text>
											</view>
										</ls-image>
										<view class="flex-col-between flex-1" @click.stop="goDoodsDetail(cartItem.productId)">
											<view class="w-100">
												<view class="line-clamp2">{{ cartItem.skuName }}</view>
												<view class="flex-start mt" v-if="!cartItem.regionalSalesFlag">
													<view class="text-999 px-1 rounded-5 bg-f8 font-24 flex-start" style="max-width: 300rpx" @click.stop="selectSkus(cartItem)">
														<view class="flex-1 overflow-h">
															<text class="line-clamp1">{{ cartItem.specification || '默认规格' }}</text>
														</view>
														<text class="iconfont icon-ArrowDown ml-1" style="font-size: 20rpx;"></text>
													</view>
													<view class="text-999 px-1 py rounded-5 bg-f8 font-24 ml-1" @click.stop="salesChange(cartItem)" v-if="marketingItem.type">
														换促销
														<text class="iconfont icon-ArrowDown ml-1" style="font-size: 20rpx;"></text>
													</view>
												</view>
											</view>
											<view class="flex-between w-100 position-relative mt" @click.stop>
												<view class="price">
													<ls-price
														:price="cartItem.limitDiscountsMarketingUnitPrice ? cartItem.limitDiscountsMarketingUnitPrice : cartItem.price"
														:options="{ is: 32 }"
													/>
												</view>
												<!-- key="cartKey+cartItem.id 防止手动修改input值后，点击加减显示不回显问题 
												v-model="cartItem.totalCount" v-model在小程序会回显失败 此时拆解为value 随后用触发函数做赋值
												-->
												<u-number-box
													:value="cartItem.totalCount"
													:min="1"
													:key="'num'+ cartKey + cartItem.id"
													:max="cartItem.stock"
													:size="24"
													bgColor="#F8F8F8"
													:index="cartIndex"
													:disabled="!cartItem.stock"
													@blur="val => changeCount(cartItem, val)"
													@minus="val => changeCount(cartItem, val)"
													@plus="val => changeCount(cartItem, val)"
													@focus="focusCount(cartItem.totalCount)"
												/>
											</view>
											<view class="text-danger font-20" v-if="cartItem.stock<cartItem.totalCount">
												库存不足
											</view>
											<view class="text-danger font-20" v-else-if="(cartItem.stock-cartItem.totalCount)<10&&cartItem.stock>cartItem.totalCount">
												库存紧张
											</view>
										</view>
									</view>
								</ls-swipe-action>
							</template>
						</view>
					</view>

					<!-- 失效商品 -->
					<view
						v-if="invalidCartList && invalidCartList.length"
						class="border-top-20bg m-0 font-28 bg-bg"
						style="margin-top: 0; color: #bcbec2"
					>
						<view class="p-2">失效商品</view>
						<view class="" v-for="(shopItem, shopIndex) in invalidCartList" :key="shopItem.shopId">
							<view class="d-flex px-2 py-2 a-center font-28 j-sb">
								<view class="flex-1 overflow-h flex-start">
									<view class="flex-1 flex-start overflow-h" @click="$navigateTo('/ModuleGoods/shopHome/shopIndex?shopId=' + shopItem.shopId)">
										<text class="iconfont icon-dianpu ml-1" style="font-size: 28rpx"></text>
										<view class="ml-1 flex-1 line-clamp1">{{ shopItem.shopName }}</view>
									</view>
								</view>
							</view>

							<view v-for="(marketingItem, marketingIndex) in shopItem.shopCartDiscountList" :key="marketingIndex" class="goodsDiv font-28">
								<template v-for="(cartItem, cartIndex) in marketingItem.cartItemList">
									<ls-swipe-action :key="cartItem.id" @click="onClose(cartItem)" :options="options">
										<view class="d-flex flex-1 position-relative py-2 px-3" :class="{'border-e4-bottom-xxx':cartIndex<(marketingItem.cartItemList.length-1)}" style="background-color: #f4f4f5; color: #bcbec2">
											<ls-image
												className="mr-2"
												:src="cartItem.pic"
												:options="{ w: '180', h: '180', br: '10' }"
												@click="goDoodsDetail(cartItem.productId)"
											/>
											<view class="flex-col-between flex-1" @click.stop="goDoodsDetail(cartItem.productId)">
												<view class="line-clamp2">{{ cartItem.skuName }}</view>
												<view class="flex-between">
													<view class="price"><ls-price :price="cartItem.totalPrice" :options="{ is: 32 }" /></view>
												</view>
											</view>
										</view>
									</ls-swipe-action>
								</template>
							</view>
						</view>
						<view class="d-flex j-center a-center py-2 font-28 border-bottom-20bg">
							<text class="iconfont icon-delete mr-1 v-middle"></text>
							<view class="ml-1" @click.stop="clearInvalid">清空失效商品</view>
						</view>
					</view>
					<!-- /失效商品 -->

					<view class="position-fixed zindex-99 w-100 bg-fff border-top safearea-bb-white" style="bottom: 100rpx;" id="cart-btn-1">
						<view class="w-100 h-100r flex-between font-28 text-333">
							<view class="py-3 pl-3 pr-2 d-flex a-center" @click="allSelectChange">
								<text class="choose-new" :class="{ cur: checkedAll }"></text>
								<text class="pl-2 text-nowrap font-24">全选</text>
							</view>
							<template v-if="!showEdit">
								<view class="flex-1 flex-col-start mr-2 overflow-auto font-arial">
									<view class="flex-end text-nowrap overflow-x-scroll">
										合计：
										<ls-price notThemes :price="totalPrice" :options="{ is: 36 }" />
									</view>
									<view class="text-999 font-24 flex-end text-nowrap overflow-x-scroll" v-if="Number(discountAmount)">
										已优惠￥{{discountAmount}}(不含运费)
									</view>
								</view>
								<view class="h-80r bg-main font-28 text-white flex-center rounded-100 py-1 px-3 mr-3 text-nowrap" @click="settlement">去结算&nbsp;({{ selectCount }})</view>
							</template>
							<template v-else>
								<view class="w-200r h-80r rounded-100 border border-e4 font-28 mr-3 flex-center" @click.stop="deleteShopCarts">
									删除
								</view>
							</template>
						</view>
					</view>
				</view>
			</template>
			<ls-empty className="center-xy w-100" title="您的购物车还是空的，赶紧去逛逛吧！" :paging="paging" @reLoad="getCartList" reLoad>
				<ls-button className="but-main w-200r py-15r rounded-100" :cssStyle="{ marginTop: '-30rpx' }" @click="$switchTab('/pages/index/index')">去逛逛</ls-button>
			</ls-empty>
		</view>

		<!-- sku弹框 -->
		<sku-popup ref="skuPopup" :raw-data="goodData" :source="'cart'" v-model="skuData">
			<view class="flex-1 w-100"><view class="flex-1 but-main rounded-100 my-1 mx-2 py-2" @click.stop="changeSelectedSku">确&emsp;定</view></view>
		</sku-popup>

		<sku-sale :saleItem="currentItem" ref="sales" @confirm="confirmSkuSale"></sku-sale>

		<!-- 优惠券弹框 -->
		<good-coupon ref="lsGoodCoupon" type="cart" :list="couponDTOList" @getCouponMore='getCouponMore'/>
		<dialog-address ref="address" @changeAddr="changeAddr" :addressId="defaultUserAddress.id"></dialog-address>
		<is-visitor v-if="!userInfo.id" />

		<!-- 底部栏 -->
		<tabBar ref="commentTabbat" />
	</view>
</template>

<script>
// JS方法
import { appToken } from '@/utils/Cache.js';

// API接口
import { cartApi, orderApi } from '@/api/ModulesOrder.js';
import { couponApi } from '@/api/ModuleCenter.js';
import { goodsApi } from '@/api/ModuleGoods.js';

// VUE功能组件
import isVisitor from '@/components/common/isVisitor/isVisitor.vue';
import goodCoupon from '@/components/goods/good-coupon.vue';
import skuSale from '@/components/goods/sku-sale.vue';
import skuPopup from '@/components/goods/sku-popup.vue';
import dialogAddress from '@/components/submit-order/DialogAddress.vue';
import tabBar from '@/components/common/tabbar/tabbar.vue';

import { mapState } from 'vuex';

export default {
	components: {
		'good-coupon': goodCoupon,
		'sku-sale': skuSale,
		'sku-popup': skuPopup,
		'dialog-address': dialogAddress,
		'is-visitor': isVisitor,
		tabBar
	},
	data() {
		return {
			showEdit: false, // 商品sku详情
			options: [
				{
					text: '删除',
					style: {}
				}
			],
			cartKey: 0, //防止手动修改input值后，点击加减显示不回显问题
			currentItem: {},
			goodData: {},
			skuData: {
				skuItem: {}, // SKU
				picList: [], // 图片列表
				originalPrice: '' // 原价
			},
			defaultUserAddress: {}, // 默认地址
			shopCartList: [], // 购物车列表
			invalidCartList: [], // 失效购物车列表
			goodsNumTotal: 0, // 购物车总数
			totalPrice: '', // 购物车总价格
			discountAmount: '', // 优惠价格
			selectCount: '', // 已选择商品
			skuParmas: '', // 传送到ls-Sku组件的变量(注意请参考ls-Sku组件的格式名字传里面的变量)，(注意，这个要写成''，不能写成{}，不然判断该对象时内容为空但依然为true)
			couponPage: {	//优惠券分页加载
				shopId:'',
				skuIds: '',
				curPage:1,	//当前页
				pageCount: 1,	//总页数
			},
			couponDTOList: [], //优惠券集合
			oldTotalCount: 0, //当input框聚焦时，用来记录数据更改前的值(用来做到像京东那样的，当删掉原来的购物数量时，当该input框失去焦点时，该值变成删掉前的值)
			paging: {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false // 是否显示列表为空时的样式
			}
		};
	},
	watch: {},
	computed: {
		...mapState(['stausBarHeight', 'wxMenuBut', 'userInfo']),
		checkedAll() {
			return this.shopCartList.length != 0 && this.shopCartList.length == this.shopCartList.filter(item => item.selectFlag).length;
		}
	},

	created() {},

	mounted() {
	},

	onShow() {
		if (appToken.isLogin()) {
			this.getData();
		}
		this.$nextTick(()=>{
			this.$refs.commentTabbat.setCurRoute()//这个是为了解决小程序端animate_动画播放过后，再次点击时，动画不生效的bug。
		})
	},

	onPullDownRefresh(e) {
		if (appToken.isLogin()) {
			this.getData();
		} else {
			uni.stopPullDownRefresh();
		}
	},

	methods: {
		// 父组件的onLoad(页面加载)里触发该方法，该方法不能删，不然会报错
		getData() {
			if (appToken.isLogin()) {
				this.getCartList();
				this.getInvalidProduct();
				this.$store.dispatch('getCartNum');
			} else {
				uni.stopPullDownRefresh();
			}
		},

		salesChange(cartItem) {
			this.currentItem = cartItem;
			this.$refs.sales.changePopup();
		},
		openCoupon(shopItem) {
			// console.log(shopItem);
			let skuIds = [];
			shopItem.shopCartDiscountList &&
				shopItem.shopCartDiscountList.length &&
				shopItem.shopCartDiscountList.forEach(ele => {
					ele.cartItemList.forEach(element => {
						element.skuId && skuIds.push(element.skuId); //获取该店铺里存在购物车中的sku级数集合
					});
				});
			// 每次打开都要重置参数
			Object.assign(this.couponPage, {
				curPage: 1,
				shopId: shopItem.shopId,	//保存一份用作分页
				skuIds: skuIds.join(),	//保存一份用作分页
				pageCount: 1,
			})
			// console.log(skuIds);
			couponApi.couponReceivable({ shopId: shopItem.shopId, skuIds: skuIds.join(), curPage: this.couponPage.curPage, pageSize: 15 }).then(res => {
				if(res.code) {
					this.couponDTOList = res?.data?.resultList || [];
					this.couponPage.pageCount = res?.data?.pageCount || 1
				}
				this.$nextTick(() => {
					this.$refs.lsGoodCoupon.changePopup();
				});
			});
		},
		// 获取更多优惠券
		getCouponMore() {
			if( (this.couponPage.curPage + 1) > this.couponPage.pageCount) {
				// console.log('加载完了')
				return ;
			}
			this.$u.debounce(()=>{
				// console.log('获取更多--')
				couponApi.couponReceivable({ shopId: this.couponPage.shopId, skuIds: this.couponPage.skuIds, curPage: ++this.couponPage.curPage, pageSize: 10 }).then(res => {
					if(res.code){
						this.couponDTOList = [...this.couponDTOList,...res.data.resultList];
					}
				});
			})
		},

		openAddress() {
			this.$refs.address.changePopup();
		},
		changeAddr(addressId) {
			this.getCartList({ addressId });
		},
		// 初始化sku
		selectSkus(cartItem) {
			this.skuData = {
				skuItem: {}, // SKU
				picList: [], // 图片列表
				originalPrice: '' // 原价
			};
			this.currentItem = cartItem;
			console.log(this.skuData);
			goodsApi.productViews({ productId: cartItem.productId }).then(res => {
				if (res.code == 1) {
					if (res.data) {
						this.goodData = res.data; // 原始数据
						this.skuData = {
							originalPrice: cartItem.price,
							picList: [],
							skuItem: {
								properties: cartItem.propertiesIds
							}
						};
						this.$nextTick(() => {
							this.$refs.skuPopup.changePopup();
						});
					}
				}
			});
		},
		// 获取购物车列表
		getCartList(params) {
			this.paging = {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false // 是否显示列表为空时的样式
			};
			cartApi
				.cartList(params)
				.then(res => {
					if (res.code == 1 && res.data) {
						this.shopCartList = res.data.shopCartList.map(item => {
							item.selectFlag = this.getShopCheckState(item);
							return item;
						});
						this.cartKey++;
						this.defaultUserAddress = res.data.defaultUserAddress || {};
						this.selectCount = res.data.selectCount; // 已选数量
						this.totalPrice = res.data.totalPrice; // 勾选总价
						this.discountAmount = res.data.discountAmount; // 优惠金额
					} else {
						this.shopCartList = [];
					}
				})
				.catch(err => {
					this.paging.error = true;
				})
				.finally(res => {
					this.paging.status = 'noMore';
					if (!this.$checkInfo([{ type: 'hasValue', value: this.shopCartList }])) {
						this.paging.emptylist = true;
					}
					uni.stopPullDownRefresh();
				});
		},
		getInvalidProduct() {
			cartApi.getInvalidProduct().then(res => {
				if (res.code == 1) {
					this.invalidCartList = res.data;
				}
				console.log(res);
			});
		},
		// 全部选择框改变
		allSelectChange() {
			const value = this.checkedAll;
			const allList = [];
			this.shopCartList.forEach(shopItem => {
				shopItem.selectFlag = !value;
				const shopList = this.changeCheckState(shopItem, !value);
				allList.push(...shopList);
			});
			this.cartSelectApi(allList);
		},
		// 判断店铺以下是否都为true如果是返回true，不是返回false
		getShopCheckState(shopItem) {
			if (!shopItem.shopCartDiscountList && !shopItem.shopCartDiscountList.length) return;
			let checkedState = true;
			for (const i in shopItem.shopCartDiscountList) {
				const checked = shopItem.shopCartDiscountList[i].cartItemList.every(cartItem => cartItem.selectFlag);
				if (!checked) {
					checkedState = false;
					break;
				}
			}
			return checkedState;
		},

		// 购物车选择框改变
		cartItemChange(shopItem, cartItem, value) {
			if (cartItem.selectFlag) {
				shopItem.selectFlag = !value;
			}
			cartItem.selectFlag = !cartItem.selectFlag;
			if (this.getShopCheckState(shopItem)) {
				shopItem.selectFlag = value;
			}
			this.cartSelectApi([
				{
					selectFlag: cartItem.selectFlag,
					id: cartItem.id
				}
			]);
		},

		// 店铺选择框改变
		shopItemChange(shopItem, value) {
			shopItem.selectFlag = !value;
			const resultShop = this.changeCheckState(shopItem, !value);
			this.cartSelectApi(resultShop);
		},

		// 购物车选择改变接口
		cartSelectApi(data) {
			cartApi.cartSelect(data).then(res => {
				if (res.code == 1) {
					this.getCartList();
				}
			});
		},

		// 改变状态
		changeCheckState(shopItem, value) {
			// shopItemList店铺中的勾选状态
			const shopItemList = [];
			if (!shopItem.shopCartDiscountList && !shopItem.shopCartDiscountList.length) return;
			for (const i in shopItem.shopCartDiscountList) {
				shopItem.shopCartDiscountList[i].cartItemList.forEach(cartItem => {
					cartItem.selectFlag = value;
					shopItemList.push({ id: cartItem.id, selectFlag: cartItem.selectFlag });
				});
			}
			return shopItemList;
		},

		// 结算
		settlement() {
			let comProduct = 0; //勾选的普通商品数量
			let preProduct = 0; //勾选的预售商品数量
			this.shopCartList.map(item1 => {
				item1.shopCartDiscountList.map(item2 => {
					item2.cartItemList.map(item3 => {
						if (item3.preSellFlag && item3.selectFlag) {
							preProduct++;
						} else if (!item3.preSellFlag && item3.selectFlag) {
							comProduct++;
						}
					});
				});
			});
			if (comProduct > 0 && preProduct > 0) {
				uni.showToast({
					icon: 'none',
					title: '不能同时选择预售商品和普通商品',
					duration: 1000
				});
				return;
			}
			if (preProduct > 1) {
				uni.showToast({
					icon: 'none',
					title: '不能同时选择多件预售商品',
					duration: 1000
				});
				return;
			}
			if (this.selectCount && this.selectCount > 0) {
				const sumbitParams = {
					deductionFlag: true,
					activityId: 0, // 活动id写死
					addressId: this.defaultUserAddress.id, // 默认地址id
					buyNowFlag: false, // 是否立即购买,购物车下单为false
					confirmOrderItemDTOList: [],
					orderType: preProduct > 0 ? 'PRE_SALE' : 'ORDINARY'
				};
				// 获取已勾选的购物车然后提交
				this.shopCartList.forEach(shopItem => {
					const shopList = this.getShopCheckList(shopItem);
					sumbitParams.confirmOrderItemDTOList.push(...shopList);
				});

				orderApi
					.buyNow(sumbitParams)
					.then(res => {
						if (res.code == 1) {
							uni.navigateTo({ url: `/ModuleOrder/submitOrder/submitOrder?orderId=${res.data.id}&addrId=${this.defaultUserAddress.id}` });
						}
					})
					.finally(complete => {});
			} else {
				uni.showToast({
					title: '亲,请选择您要结算的商品!',
					icon: 'none'
				});
			}
		},

		// 获取店铺下勾选的数据。给提交使用
		getShopCheckList(shopItem) {
			if (!shopItem.shopCartDiscountList && !shopItem.shopCartDiscountList.length) return;
			const resultList = [];
			for (const i in shopItem.shopCartDiscountList) {
				shopItem.shopCartDiscountList[i].cartItemList.forEach(item => {
					if (item.selectFlag) {
						resultList.push({ count: item.totalCount, marketId: item.marketingId, skuId: item.skuId });
					}
				});
			}
			return resultList;
		},

		// 获取店铺下勾选的数据的id。给多选删除使用
		getShopCheckIds(shopItem) {
			if (!shopItem.shopCartDiscountList && !shopItem.shopCartDiscountList.length) return;
			const resultList = [];
			for (const i in shopItem.shopCartDiscountList) {
				shopItem.shopCartDiscountList[i].cartItemList.forEach(item => {
					if (item.selectFlag) {
						resultList.push(item.id);
					}
				});
			}
			return resultList;
		},

		// 跳转到商品详情
		goDoodsDetail(prodId) {
			uni.navigateTo({
				url: `/ModuleGoods/goodsDetail/goodsDetail?id=${prodId}`
			});
		},

		// 删除购物车商品
		onClose(cartItem) {
			uni.showModal({
				content: '是否从购物车删除该商品',
				success: res => {
					if (res.confirm) {
						this.delCurrentCart([cartItem.id]);
					} else if (res.cancel) {
					}
				}
			});
		},

		// 删除单个购物车
		delCurrentCart(ids) {
			cartApi.cartDel(ids).then(res => {
				if (res.code == 1) {
					this.getCartList();
					this.$nextTick(() => {
						this.$store.dispatch('getCartNum'); //更新购物车数量
					});
				}
			});
		},

		// 批量删除购物车商品
		deleteShopCarts() {
			if (this.selectCount && this.selectCount > 0) {
				uni.showModal({
					content: '是否将选中商品从购物车删除',
					success: res => {
						if (res.confirm) {
							// 获取已勾选的购物车然后提交
							const delIds = [];
							this.shopCartList.forEach(shopItem => {
								const shopIds = this.getShopCheckIds(shopItem);
								delIds.push(...shopIds);
							});
							this.delCurrentCart(delIds);
						}
					}
				});
			} else {
				uni.showToast({
					title: '请选择删除的商品',
					icon: 'none'
				});
			}
		},

		// 购物车数量改变接口
		cartNumApi(params) {
			this.$u.debounce(() => {
				return cartApi.cartChange(params).then(res => {
					if (res.code == 1) {
						this.getCartList();
					}
					return res;
				});
			});
		},

		// 记录当前正在输入的商品数量
		focusCount(val) {
			this.oldTotalCount = Number(val);
		},

		// 手动更改购物车数量
		changeCount(cartItem, val) {
			cartItem.totalCount = val.value
			//  当input框清空所有值时，或没改动过值时，不请求接口
			if (cartItem.totalCount == this.oldTotalCount) {
				return;
			}
			if (cartItem.totalCount <= 0) {
				uni.showToast({
					title: '购买数量不能低于1',
					icon: 'none'
				});
			} else {
				if (cartItem.totalCount <= cartItem.stock) {
					const params = {
						count: cartItem.totalCount,
						id: cartItem.id,
						marketingId: cartItem.marketingId,
						productId: cartItem.productId,
						shopId: cartItem.shopId,
						skuId: cartItem.skuId
					};
					this.cartNumApi(params);
				} else {
					cartItem.totalCount = cartItem.stock;
					uni.showToast({
						title: '库存不足',
						icon: 'none'
					});
				}
			}

			this.$forceUpdate();
		},

		// 清空购物车失效商品
		clearInvalid() {
			uni.showModal({
				content: '是否清空购物车失效商品',
				success: res => {
					if (res.confirm) {
						cartApi.cleanInvalidProduct().then(res => {
							if (res.code == 1) {
								uni.showToast({
									title: '成功！'
								});
								this.invalidCartList = [];
							}
						});
					} else if (res.cancel) {
					}
				}
			});
		},

		// 更改购物车商品的sku
		changeSelectedSku() {
			const params = {
				id: this.currentItem.id,
				marketingId: this.currentItem.marketingId,
				productId: this.currentItem.productId,
				shopId: this.currentItem.shopId,
				skuId: this.skuData.skuItem.id,
				count: this.currentItem.totalCount
			};
			this.cartNumApi(params);
			this.$refs.skuPopup.changePopup();
		},

		//点击'换促销'里的确定按钮后
		confirmSkuSale() {
			this.getCartList();
		},
		// 跳转到凑单列表页面
		goAddOnList(value) {
			uni.navigateTo({ url: `/ModuleActive/addOn/addOnList?id=${value.marketingId}` });
		}
	}
};
</script>

<style scoped lang="scss">
.border-f1-bottom-xxx{
	width: 100%; position :relative;
}
.border-f1-bottom-xxx:after{ 
	 content: ''; position :absolute; bottom :0rpx; left :85rpx; right :20rpx; height: 2rpx; background :#f1f1f1;
}
.border-e4-bottom-xxx{
	width: 100%; position :relative;
}
.border-e4-bottom-xxx:after{ 
	 content: ''; position :absolute; bottom :0rpx; left :85rpx; right :20rpx; height: 2rpx; background :#e4e4e4;
}
.choose-new{
	display: inline-block;
	width: 36rpx;
	height: 36rpx;
	vertical-align: top;
	background: url('~@/static/images/choose.png') no-repeat;
	background-size: 36rpx;
	cursor: pointer;
	// float: left;
}

.choose-new.cur{
	background: url('~@/static/images/choosed.png') no-repeat;
	background-color: var(--themescolor);
	background-size: 36rpx;
	border-radius: 50%;
}
</style>
<style>
/* app-iOS端的empty要加下面这句话,不然底还是灰的 */
page {
	background-color: #ffffff;
}
</style>
