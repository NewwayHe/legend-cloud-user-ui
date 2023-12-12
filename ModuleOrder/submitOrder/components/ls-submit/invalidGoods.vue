<template>
    <!-- /*
     * @Descripttion:失效商品
    */ -->
	<view>
		<view class="font-32 p-2 border-top-20bg font-weight" style="color: #E5004F;" v-show="orderInfo.invalidOrderShopList && orderInfo.invalidOrderShopList.length != 0">失效商品</view>
		<view class="mx-2 mb-2 p-2 bg-fff rounded-12" v-for="item in orderInfo.invalidOrderShopList" :key="item.shopId">
		    <view class="d-flex pt-2 pb-2 font-28">
				<view class="flex-start flex-1 pr-2 overflow-h">
					<text class="iconfont icon-dianpu mr-1" style="font-size: 28rpx"></text>
					<text class="flex-1 line-clamp1">{{ item.shopName }}</text>
				</view>
		    </view>
		
		    <view v-for="good in item.invalidOrderSkuList" :key="good.skuId">
		        <view class="clearfix pt-2 pb-2 position-relative border-top border-f1">
		            <view class="float-left mr-1" style="position: relative; width: 160rpx; height: 160rpx; flex: 0 0 160rpx;">
		                <image :src="photoServer + good.pic" alt="" class="w-100 h-100"/>
		                <text v-if="!good.statusFlag" class="bg-main position-absolute w-100 font-24 text-fff text-center line-h-md" style="left: 0; bottom: 0;">商品区域限售</text>
		            </view>
		            <view class="font-28 overflow-h">
		                <view class="line-clamp2">{{ good.productName }}</view>
		                <view class="text-999 font-24 line-clamp1">{{ good.cnProperties }}</view>
		                <view class="main-color font24">
		                    <ls-price  :price="good.price"/>
		                </view>
		            </view>
		            <view class="position-absolute text-right text-999 font-24 " style="bottom: 26rpx; right: 0;">×{{ good.totalCount }}</view>
		        </view>
		    </view>
		</view>
	</view>
</template>

<script>
export default {
    components: { },
    filters: {},
    props: {
        orderInfo: {
            type: [Object,String],
            default: () => {
                return {}
            }
        },
		addrId: {
		    type: [String,Number]
		}
    },
    data() {
        return {
		}
    },
    computed: {},
    watch: {},
    mounted() {},
    destroyed() {},
    methods: {
		
	}
}
</script>

<style lang="scss" scoped></style>
