<template>
	<!-- /*
     * @Descripttion:商品详情楼层：商品信息(名称,价格,原价,描述,收藏)
    */ -->
	<view class="px-2 py-1 bg-fff" :style="{ '--themescolor': themes.color }">
		<view class="flex-center my-1">
			<view class="flex-1 overflow-h" >
				<!-- 如果是普通商品(预售商品的价格在active-head组件里显示) -->
				<view class="d-flex a-baseline text-nowrap overflow-x-scroll" v-if="!skuType&&!parmas.preSellProductBO">
					<view class="flex-start">
						<ls-price :price="price" :options="{ is: 60, ds: 32, iw:800, dw:800 }" moneyIconWeight/>
					</view>
					<!-- 显示划线原价 -->
					<text class="text-999 font-24 line-through ml-2" v-if="originalPrice">¥{{ originalPrice }}</text>
				</view>
				<!-- 如果是活动商品(活动商品的价格显示在active-head组件上) -->
				<!-- {{ skuData.skuItem.name || '' }} -->
				<view class="font-32 font-weight-600 text-333" v-if="skuType||parmas.preSellProductBO" style="line-height: 44rpx;">{{ parmas.name }}</view>
			</view>
			<good-collect class="pl-1 ml-1" :spu="parmas"></good-collect>
		</view>
		<view class="my-1 font-32 text-333 font-weight-600" v-if="!skuType&&!parmas.preSellProductBO" style="line-height: 44rpx;">{{ parmas.name }}</view>
		<view class="font-24 text-999 my-1">{{ parmas.brief }}</view>
	</view>
</template>

<script>
import goodCollect from '@/components/goods/good-collect.vue';
import { mapState } from 'vuex';
import { appToken } from '@/utils/Cache.js';
export default {
	components: { 'good-collect': goodCollect },

	props: {
		skuData: {
			type: Object,
			default: () => {
				return {};
			}
		},
		parmas: {
			type: Object,
			default: () => {
				return {};
			}
		},
		skuType: String, //营销类型 拼团/团购/秒杀活动需传 普通（NORMAL，在这里规定普通商品的话值为空''，有值就是有活动） 团购（GROUP） 拼团（MERGE） 秒杀（SECKILL）
	},

	data() {
		return {
			isLogin: appToken.isLogin()
		};
	},

	computed: {
		...mapState(['userInfo']),
		price(){
			// 如果有sku优惠折扣价格,则显示sku优惠折扣价格
			return this.skuData.skuItem.discountPrice||this.skuData.skuItem.discountPrice==0?this.skuData.skuItem.discountPrice:this.skuData.skuItem.price
		},
		originalPrice(){
			// 如果有sku优惠折扣价格,则划线价为现价
			return this.skuData.skuItem.discountPrice||this.skuData.skuItem.discountPrice==0?this.skuData.skuItem.price:this.skuData.skuItem.originalPrice
		}
	},
	watch: {},
	created() {},
	methods: {}
};
</script>

<style lang="scss" scoped></style>
