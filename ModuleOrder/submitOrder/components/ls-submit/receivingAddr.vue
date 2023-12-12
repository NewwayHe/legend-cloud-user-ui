<!-- /*
 * @Descripttion:收货地址
*/ -->
<template>
	<view :style="{ '--themescolor': themes.color, '--themescolor04': themes.rgb04, '--themesrgba02': themes.rgb02 }">
		<!-- 只有快递 -->
		<view class="px-2 pt-2">
			<!-- <view class="text-000 font-32 font-weight mb-2">快递配送</view> -->
			<view class="rounded-12 px-2 py-4 d-flex flex-column bg-fff position-relative" @click="goAddress">
				<template v-if="orderInfo.userAddressBO">
					<view class="d-flex a-center font-28 text-333 line-h-md">
						<view v-if="orderInfo.userAddressBO.commonFlag" class="mr-1 px-1 py bg-main text-fff font-20 line-h-sm rounded-8">默认</view>
						<text class="mr-1">{{ orderInfo.userAddressBO.receiver }}</text>
						<text>{{ orderInfo.userAddressBO.mobile }}</text>
					</view>
					<view class="mt-1 font-28 text-666 line-h-md d-flex j-sb a-start">
						<text class="flex-1 mr-2">{{ orderInfo.userAddressBO.fullAddress || '' }}{{orderInfo.userAddressBO.detailAddress||'' }}</text>
						<u-icon name="arrow-right" color="#333" size="28" top="10rpx"></u-icon>
					</view>
				</template>
				
				<template v-else>
					<view class="position-relative d-flex a-center" style="line-height: 40rpx;">
						<u-icon name="map" :color="themes.color" size="40"></u-icon>
						<text class="ml-1 mr-3 flex-1 font-28">请添加收货地址</text>
						<text class="iconfont icon-ArrowRight text-333" style="font-size: 28rpx;"></text>
					</view>
				</template>
				
				<!-- 蚂蚁线 -->
				<view class="position-absolute left-0 right-0 bottom-0 ants"></view>
			</view>
		</view>
	</view>
</template>

<script>
import pageUtil from '@/utils/pageUtils.js';
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
		addrId: {
		    type: [String,Number]
		},
    },
    data() {
        return { }
    },
    computed: {},
    watch: { },
    mounted() {
	},
    destroyed() {},
    methods: {
		// 去切换地址
		goAddress() {
		    uni.navigateTo({ url: `/ModuleCommon/address/addressList?addressId=${this.addrId}&addressChange=1` })
		},
	}
}
</script>

<style lang="scss" scoped>
.ants{
  width:100%;
  border-bottom: 10rpx solid transparent;
  // 备注:下面的红色如果填25%,蓝色填50%,则填满(没有空白地方)(设中间空白处线宽为8，则25-8=17%，50-8=42%)
  background: linear-gradient(white,white) padding-box,repeating-linear-gradient(-45deg, #EC6D6D 0, #EC6D6D 17%, transparent 0, transparent 25%, #8BB5E8 0, #8BB5E8 42%, transparent 0, transparent 50%) 0/128rpx 128rpx; 
  // 以下这个是红白蓝1：1：1等分
  // background: linear-gradient(white,white) padding-box,repeating-linear-gradient(-45deg, #EC6D6D 0, #EC6D6D 12.5%, transparent 0, transparent 25%, #8BB5E8 0, #8BB5E8 37.5%, transparent 0, transparent 50%) 0/128rpx 128rpx; 
  animation:antsline 24s linear infinite;
  @keyframes antsline{100%{background-position:100%;}}
}
</style>
