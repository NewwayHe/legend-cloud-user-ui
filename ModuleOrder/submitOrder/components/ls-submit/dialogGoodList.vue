<template>
    <!-- /*
     * @Descripttion:店家发票
    */ -->
	<u-popup v-model="show" mode="bottom" safe-area-inset-bottom border-radius="14" closeable>
		<view>
		        <text class="d-block font-weight font-32 py-1 px-2 my-2 text-center">商品清单</text>
		        <text class="d-block text-999 font-24 my-2 pl-4">
					共
		            <text class="text-main font-32 mx-1">{{ getTotalNum(activeShop) }}</text>
		            件商品
		        </text>
		    </view>
		    <view class="mt-4" style="height: 700rpx;">
		    <scroll-view style="height: 100%" scroll-y>
		        <template v-for="good in activeShop.skuList">
		            <view :key="good.skuId" class="px-2">
		                <view class="clearfix py-2 position-relative border-top border-f1">
		                    <view class="float-left mr-1" style="position: relative; width: 160rpx; height: 160rpx;">
								<ls-image className="overflow-h" :options="{ w: '100%', h: '100%', }" :src="good.pic" >
									<text v-if="!good.statusFlag" class="bg-main position-absolute w-100 font-24 text-fff text-center line-h-md" style="left: 0; bottom: 0;">商品区域限售</text>
								</ls-image>
		                    </view>
		                    <view class="font-28 overflow-h">
		                        <view class="line-clamp2">{{ good.productName||'' }}</view>
		                        <view class="text-999 font-24 line-clamp1">{{ good.cnProperties||'' }}</view>
		                        <view class="main-color d-block font24">
									  <ls-price :price="good.discountedPrice"/>
		                        </view>
		                    </view>
		                    <view class="position-absolute text-right text-999 font-24 " style="bottom: 26rpx; right: 0;">×{{ good.totalCount }}</view>                
		                </view>
		                <view class="font-24 mb-1" style="color: #E5004F;">
		                    <text class="d-block" v-if="good.limitDiscountsMarketingInfo&&good.limitDiscountsMarketingPrice">
		                        {{ good.limitDiscountsMarketingInfo }}，已优惠{{ good.limitDiscountsMarketingPrice }}
		                    </text>
		                    <text class="d-block" v-if="good.rewardMarketingInfo&&good.rewardMarketingPrice">
		                        {{ good.rewardMarketingInfo }}，已优惠{{ good.rewardMarketingPrice }}
		                    </text>
		                </view>
		            </view>
		        </template>
		        
		    </scroll-view>
		</view>
	</u-popup>
</template>

<script>
export default {
    components: {},
    filters: {},
    props: {
        orderInfo: {
            type: [Object,String],
            default: () => {
                return {}
            }
        },
		activeShop: {
		    type: [Object,String],
		    default: () => {
		        return {}
		    }
		}
    },
    data() {
        return {
			show:false,
			invoiceDict:{}
		}
    },
    computed: {},
    watch: {},
    mounted() {},
    destroyed() {},
    methods: {
		// 显示弹窗，并重置数据
		changePopup() {
		   this.show=!this.show
		},
		 // 返回当前商店的商品数量
		getTotalNum(shop) {
			if (!this.activeShop.shopId) {
				return 0
			}
			let num = 0
			for (let item of shop.skuList) {
				num += item.totalCount
			}
			return num
		},
	}
}
</script>

<style lang="scss" scoped></style>
