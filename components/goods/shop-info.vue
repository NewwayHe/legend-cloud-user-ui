<template>
    <!-- /*
     * @Descripttion:商品详情楼层：店铺
    */ -->
    <view
        class="px-2 py-4 bg-white font-24"
        :class="className"
        :style="{ '--themescolor': themes.color }"
        @click="$navigateTo(`/ModuleGoods/shopHome/shopIndex?shopId=${shopData.shopId}`)"
    >
        <view class="d-flex position-relative">
            <ls-image className="border border-f1" :src="shopData.shopAvatar" :options="{ w: '80', h: '80',br:'8' }"/>
            <view class="px-2 flex-1 d-flex flex-col-between overflow-h">
                <view class="line-clamp1 font-26">{{ shopData.shopName }}</view>
                <view class="py-1 flex-start">
                    <text class="text-main border border-main px-1 rounded-5 font-sm">
                        {{ shopData.shopType == 0 ? '专营店' : shopData.shopType == 1 ? '旗舰店' : shopData.shopType == 2 ? '自营' : '默认' }}
                    </text>
                    <text class="text-333 pl-2 pr-1" >
                        综合评分{{ shopData.score == null || shopData.score == 0 ? '0' : shopData.score }}
                    </text>
					<view>
						<u-rate style="vertical-align: top;" :count="5" :current="shopData.score || 0" disabled size="20" :active-color="themes.color" allowHalf inactive-icon="star-fill"></u-rate>
					</view>
                </view>
            </view>
            <view class="position-absolute w-100r h-50r flex-center rounded-50 text-fff px-2 bg-main right-20r" style="bottom: 10rpx;">进店</view>
        </view>
        <view class="font-24 text-999 flex-start pt-4" v-if="shopData.type == 'common'">
			<view class="flex-1 flex-center">
				<text>商家描述：</text>
				<text class="text-main">{{ shopData.productCommentAvg }}</text>
			</view>
			<view class="flex-1 flex-center">
				<text>商家服务：</text>
				<text class="text-main">{{ shopData.shopCommAvg }}</text>
			</view>
			<view class="flex-1 flex-center">
				<text>商家物流：</text>
				<text class="text-main">{{ shopData.dvyTypeAvg }}</text>
			</view>
        </view>
    </view>
</template>
<script>
export default {
    name: 'shop-info',

    components: {},

    props: {
        className: String,
        shopData: Object
    },
    data() {
        return {
			startCount: 5, // 总星星数量
			// starValue: 2.5, // 星星当前值
        }
    },

    computed: { },

    watch: {},

    created() {},

    mounted() {},

    beforeDestroy() {},

    destroyed() {},

    methods: {}
}
</script>

<style lang="scss" scoped></style>
