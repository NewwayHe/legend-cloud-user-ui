<template>
	<view :style="{'--themescolor': themes.color}">
		<view class="bg-fff px-2 pb-2 m-2 rounded-20 font-28">
			<view class="d-flex pt-2 j-sb position-relative receive pb-2" style="border-bottom: 1px dashed #e5e5e5">
				<view>
					<text>{{ couponData.shopName||(type=='integral'?'平台积分优惠券':'平台优惠券') }}</text>
				</view>
				<view style="position: absolute; top: 75%; left: -6%; width: 36rpx; height: 36rpx; background: #f2f2f2; border-radius: 50%" />
				<view style="position: absolute; top: 75%; right: -6%; width: 36rpx; height: 36rpx; background: #f2f2f2; border-radius: 50%" />
			</view>
			<view class="d-flex font-24 rounded-20 mt-2">
				<view style="width: 160rpx; height: 160rpx">
					<ls-image :src="couponData.pic" :options="{ w: '100%', h: '100%', br: '6' }" :key="couponData.pic+1"/>
				</view>
				<view class="flex-1 d-flex flex-column j-sb ml-2">
					<text class="line-clamp2 font-32">{{ couponData.title }}</text>
					<ls-price :price="couponData.amount" :options="{ is: 40 }" />
					<view class="d-flex a-center">
						<view v-if="couponData.minPoint > 0">
							满
							<ls-price v-if="couponData.minPoint > 0" :price="couponData.minPoint" :options="{ is: 28, iw: 400 }"/>
							可用
						</view>
						<text v-else>无门槛</text>
					</view>
				</view>
			</view>
		</view>
		<text class="font-24 m-2 d-block">以下商品可使用该优惠券</text>
		<view class="bg-white">
			<ls-load-more :status="paging.status" v-if="!paging.emptylist">
				<view class="d-flex flex-column p-2 border-bottom-20bg" v-for="(shop, index) in list" :key="index" @click="useCoupon(shop)">
					<view class="d-flex mb-2">
						<view style="width: 60rpx; height: 60rpx;">
							<ls-image :src="shop.shopAvatar" :options="{ w: '100%', h: '100%', br: '6' }" />
						</view>
						<view class="font-28 ml-2 d-flex a-center">
							<view class="line-clamp2 font-24">
								<text>{{shop.shopName}}</text>
							</view>
						</view>
					</view>
					<view class="d-flex a-center" v-if="shop.skuList&&shop.skuList.length">
						<view class="d-flex flex-1">
							<view class="position-relative mr-2 rounded-12 overflow-h" v-if="index1<3" v-for="(item, index1) in shop.skuList" :key="index1">
								<view style="width: 200rpx; height: 200rpx; flex: 0 0 160rpx;">
									<ls-image :src="item.pic" :options="{ w: '100%', h: '100%' }"/>
								</view>
								<view class="position-absolute text-fff bg-main text-center w-100" style="bottom: 0;left: 0;">
									<ls-price notThemes :price="item.price" />
								</view>
							</view>
						</view>
						<view @click="toShop" class="d-flex flex-column j-center" style="align-self: stretch;">
								<text class="iconfont icon-ArrowRight text-bbb" style="font-size: 24rpx;" ></text>
						</view>
					</view>
				</view>
			</ls-load-more>
			<ls-empty className="center-xy" :title="'暂无相关联优惠券店铺'" :paging="paging"/>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import pageUtil from '@/utils/pageUtils.js';
	import { couponApi } from '@/api/ModuleCenter'

	// TODO
	const listPage = new pageUtil(couponApi.queryShopPage);

	export default {
		components: {},
		data() {
			return {
				type: '', // 是从哪里跳进来的: center=>领券中心; user=>用户; integral=>积分优秀券
				params: {
					couponId: 1,
				},
				couponData: {},
				list: [],
				paging: {
					status: 'loading',
					error: false, // 是否错误
					emptylist: false, // 是否显示列表为空时的样式
				}
			};
		},
		computed: {
			...mapState(['stausBarHeight'])
		},
		watch: {},
		onLoad(options) {
			this.params.couponId = options.id || ''
			this.type = options.type || null
			this.getCouponData()
			listPage.loadListByPage(this, this.params)
		},
		mounted() {},
		onShow() {},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom() {
			listPage.loadListByPageMore()
		},
		methods: {
			// 使用优惠券
			useCoupon(shop) {
				this.$navigateTo(`/ModuleGoods/shopHome/shopIndex?shopId=${shop.shopId}`)
			},
			// 获取优惠券信息
			getCouponData() {
				couponApi
					.couponGetById({
						id: this.params.couponId,
					})
					.then((res) => {
						this.couponData = res.data
					})
			},
			// 直接跳去商品店铺
			toShop() {
				console.log('to shop')
			}
		},

	}
</script>

<style>page{background: #f2f2f2;}</style>
