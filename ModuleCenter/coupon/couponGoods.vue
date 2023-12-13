<template>
    <view :style="{ '--themescolor': themes.color }">
		<view class="bg-fff px-2 pb-2 m-2 rounded-20 font-28">
			<view class="d-flex pt-2 j-sb position-relative receive pb-2" style="border-bottom: 1px dashed #e5e5e5">
				<view class="font-weight">{{ couponData.shopName||'平台优惠券' }}</view>
				<view style="position: absolute; top: 75%; left: -6%; width: 36rpx; height: 36rpx; background: #f2f2f2; border-radius: 50%" />
				<view style="position: absolute; top: 75%; right: -6%; width: 36rpx; height: 36rpx; background: #f2f2f2; border-radius: 50%" />
			</view>
			<view class="d-flex font-24 rounded-20 mt-2">
				<view style="width: 160rpx; height: 160rpx">
					<ls-image :src="couponData.pic" :key="couponData.pic+'couponData.pic'" :options="{ w: '100%', h: '100%', br: '6' }" />
				</view>
				<view class="flex-1 d-flex flex-column j-sb ml-2">
					<text class="line-clamp2 font-32">{{ couponData.title }}</text>
					<ls-price :price="couponData.amount" :options="{ is: 40 }" />
					<view class="flex-start">
						<view v-if="couponData.minPoint > 0">
							满
							<ls-price v-if="couponData.minPoint > 0" :price="couponData.minPoint" :options="{ is: 28, iw: 400 }" class="mx-1" />
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
				<view @click="toIndex(item.productId)" class="position-relative d-flex p-2 mb-2 a-center" v-for="item in list" :key="item.id">
					<view style="width: 160rpx; height: 160rpx; flex: 0 0 160rpx">
						<ls-image :src="item.pic" :options="{ w: '100%', h: '100%', br: '6' }" />
					</view>
					<view class="d-flex flex-column j-sb font-24 ml-2" style="align-self: stretch">
						<view class="line-clamp2 mb-1 font-28">
							<text>{{ item.prodName || item.productName }}</text>
						</view>
						<view class="line-clamp2 mb-1">
							<text>{{ item.properties || '' }}</text>
						</view>
						<view>
							<ls-price :price="item.price" />
						</view>
					</view>
					<view @click.stop="toBuy(item)" class="rounded-circle position-absolute flex-center" style="width: 40rpx; height: 40rpx; right: 20rpx; bottom: 20rpx" :style="{ background: themes.color }">
						<view class="iconfont icon-gouwuche text-white" style="font-size: 28rpx;"></view>
					</view>
				</view>
			</ls-load-more>
			<ls-empty className="center-xy" :title="'暂无相关商品'" :paging="paging"/>
		</view>

    </view>
</template>

<script>
import { mapState } from 'vuex'
import pageUtil from '@/utils/pageUtils.js'

import { couponApi } from '@/api/ModuleCenter'
import { orderApi } from '@/api/ModulesOrder'
// 优惠券可用商品列表
const listPage = new pageUtil(couponApi.couponQuerySkuPageById)
export default {
    components: {},
    data() {
        return {
            params: {
                couponId: '', // 优惠券id
                shopId: '', // 商家id,
                useType: '', // 商品类型
            },
			list:[],
            couponData: '', // 优惠券数据
            paging: {
                status: 'loading',
                error: false, // 是否错误
                emptylist: false, // 是否显示列表为空时的样式
            },
        }
    },
    computed: {
        ...mapState(['stausBarHeight']),
    },
    watch: {},
    onLoad(options) {
		this.params.couponId = options.id || ''
		this.params.shopId = options.shop || ''
		this.params.useType = options.type || ''
        this.getCouponData()
        listPage.loadListByPage(this, this.params)
    },
    mounted() {},
    onShow() {},
    onReachBottom() {},
    methods: {
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
        // 去商品首页
        toIndex(goodId) {
            this.$navigateTo(`/ModuleGoods/goodsDetail/goodsDetail?id=${goodId}`)
        },
        // 加入购物车
        toBuy(goodItem) {
            if (goodItem.stocks > 0) {
                orderApi
                    .addCart({
                        count: 1,
                        productId: goodItem.productId,
                        shopId: goodItem.shopId,
                        skuId: goodItem.id,
                    })
                    .then((res) => {
                        console.log(res)
                        uni.showToast({ title: '加入购物车成功', icon: 'success' })
						this.$store.dispatch('getCartNum');
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            } else {
                uni.showToast({ title: '商品库存不足', icon: 'none' })
            }
        },
    },
}
</script>

<style>page{background: #f2f2f2;}</style>
