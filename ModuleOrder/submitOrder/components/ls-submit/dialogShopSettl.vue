<template>
	<!-- /*
     * @Descripttion:店家发票
    */ -->
	<u-popup v-model="show" mode="bottom" border-radius="14" safe-area-inset-bottom closeable>
		<view class="d-block font-weight font-32 py-1 px-2 my-2 text-center">
			订单金额
			<text class="text-999 font-24 pl-2">
				(
				<text class="text-main font-32 mx-1">{{ getTotalNum(activeShop) }}</text>
				件商品)
			</text>
		</view>
		<view class="my-4 px-4 text-999">
			<!-- 活动商品才显示 -->
			<view class="d-flex my-4 a-baseline" v-if="activeShop.skuList && activeShop.skuList[0].activityId">
				<view class="span-6 text-right">商品活动价：</view>
				<view class="d-flex flex-column">
					<ls-price notThemes :price="activeShop.skuList[0].price" :options="{ is: 30 }" />
					<!-- 开启了团长优惠才显示 -->
					<view class="font-24" v-if="activeShop.skuList[0].freeFlag && activeShop.skuList[0].price != activeShop.skuList[0].activityPrice">
						<text>(商品活动价</text>
						<ls-price notThemes :price="activeShop.skuList[0].activityPrice" :options="{ is: 24 }" />
						<text>，团长优惠{{ activeShop.skuList[0].headerDiscount * 10 }}折)</text>
					</view>
				</view>
			</view>
			<view class="d-flex my-4 a-baseline" v-if="orderInfo.type != 'PRE_SALE'">
				<view class="span-6 text-right">总商品金额：</view>
				<ls-price notThemes :price="activeShop.productTotalAmount" />
			</view>
			<view class="d-flex my-4 a-baseline" v-else>
				<view class="span-6 text-right">商品预售价：</view>
				<view>
					<ls-price notThemes :price="activeShop.productTotalAmount" />
					<view>
						(定金：
						<ls-price notThemes :price="activeShop.depositPrice" />
						，尾款：
						<ls-price notThemes :price="activeShop.finalPrice" />
						)
					</view>
				</view>
			</view>
			<view class="d-flex my-4 a-baseline">
				<view class="span-6 text-right">快递运费：</view>
				<ls-price notThemes :price="activeShop.deliveryAmount" />
			</view>
			<view class="d-flex my-4 a-baseline" v-if="!(activeShop.skuList && activeShop.skuList[0].activityId)">
				<view class="span-6 text-right">促销优惠：</view>
				<ls-price notThemes :price="activeShop.discountAmount" />
			</view>
			<view class="d-flex my-4 a-baseline" v-if="!(activeShop.skuList && activeShop.skuList[0].activityId)">
				<view class="span-6 text-right">店铺优惠券：</view>
				<ls-price notThemes :price="activeShop.couponAmount" />
			</view>
			<view class="d-flex my-4 a-baseline" v-if="activeShop.selfPurchaseAmount">
				<view class="span-6 text-right">自购省优惠：</view>
				<ls-price notThemes :price="activeShop.selfPurchaseAmount" />
			</view>
			<view class="d-flex my-4 a-baseline">
				<view class="span-6 text-right">应付总额：</view>
				<ls-price className="text-main" v-if="orderInfo.type == 'PRE_SALE'" notThemes :price="activeShop.preShopOrderAmountCoupon" />
				<ls-price className="text-main" v-else notThemes :price="activeShop.shopOrderAmountBeforePlatformCoupon" />
			</view>
		</view>
	</u-popup>
</template>

<script>
export default {
	components: {},
	filters: {},
	props: {
		orderInfo: {
			type: [Object, String],
			default: () => {
				return {};
			}
		},
		activeShop: {
			type: [Object, String],
			default: () => {
				return {};
			}
		},
	},
	data() {
		return {
			show: false,
			invoiceDict: {}
		};
	},
	computed: {},
	watch: {},
	mounted() {},
	destroyed() {},
	methods: {
		// 显示弹窗，并重置数据
		changePopup() {
			this.show = !this.show;
		},
		// 返回当前商店的商品数量
		getTotalNum(shop) {
			if (!this.activeShop.shopId) {
				return 0;
			}
			let num = 0;
			for (const item of shop.skuList) {
				if (item.statusFlag) {
					num += item.totalCount;
				}
			}
			return num;
		}
	}
};
</script>

<style lang="scss" scoped></style>
