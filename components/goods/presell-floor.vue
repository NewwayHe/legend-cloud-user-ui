<template>
	<!-- /*
     * @Descripttion:活动商品详情楼层：预售流程 + 正在进行的拼团参团列表
    */ -->
	<view class="p-2 line-h-md" :class="className" :style="{ '--themescolor': themes.color, '--themesrgba02': themes.rgb02 }">
		<view class="w-100 flex-between text-999">
			<view class="text-333">
				<text class="iconfont icon-title text-ccc"></text>
				预售流程：
			</view>
			<view class="flex-end" @click="changePopup">
				活动规则
				<text class="iconfont icon-ArrowRight" style="font-size: 20rpx;"></text>
			</view>
		</view>
		<view class="flex-start text-20 text-nowrap mt-3">
			<view class="flex-1 flex-start scale-08" v-for="(item, index) in tempList" :key="index">
				<view class="rounded-circle flex-center w-40r h-40r" :class="[index == 0 ? 'bg-main' : 'bg-999']">
					<text class="text-white">{{ item.num }}</text>
				</view>
				<view class="ml-1" :class="[{ 'text-main': index == 0 }]">{{ item.con }}</view>
			</view>
		</view>

		<u-popup v-model="showPopup" border-radius="28" safe-area-inset-bottom closeable>
			<view class="font-weight font-32 py-1 px-2 my-2 text-center">活动规则</view>
			<view class="p-4 border-bg-top-x20r">
				<view class="font-20">
					<view class="">预售商品，分为全款预售商品和定金预售商品，两种类型；</view>
					<view class="">● 全款预售商品，需要一次性付全部款项，在规定的发货时间段内商家进行发货；</view>
					<view class="">● 定金预售商品，分为两个付款阶段，一阶段完成定金付款，二阶段完成尾款付款，在规定的发货时间段内商家进行发货；</view>
					<view class="">
						● 若提交订单后没有完成付款操作或者没有完成尾款支付操作，则订单变为失效状态；失效状态的订单，支付款项将会退还给用户，商家不会对失效状态的订单进行发货处理；
					</view>
					<view class="">● 预售订单不支持用户主动申请售后，若需要售后请联系商家进行操作；</view>
				</view>
				<view class="mt-4 font-24 text-nowrap">
					<view class="font-28">
						此预售商品为
						<text class="text-main">{{ goodData.preSellProductBO.payPctType == 1 ? '定金预售商品' : '全款预售商品' }}</text>
						：
					</view>
					<view class="flex-start">
						预售时间：
						<view class="zoom-09">{{ goodData.preSellProductBO.preSaleStart }} 至 {{ goodData.preSellProductBO.preSaleEnd }}</view>
					</view>
					<view class="flex-start">
						发货时间：
						<view class="zoom-09">{{ goodData.preSellProductBO.preDeliveryTime }} 至 {{ goodData.preSellProductBO.preDeliveryEndTime }}</view>
					</view>
					<view class="flex-start" v-if="goodData.preSellProductBO.depositStart && goodData.preSellProductBO.depositEnd">
						定金支付时间：
						<view class="zoom-09">{{ goodData.preSellProductBO.depositStart }} 至 {{ goodData.preSellProductBO.depositEnd }}</view>
					</view>
					<view class="flex-start" v-if="goodData.preSellProductBO.finalMStart && goodData.preSellProductBO.finalMEnd">
						尾款支付时间：
						<view class="zoom-09">{{ goodData.preSellProductBO.finalMStart }} 至 {{ goodData.preSellProductBO.finalMEnd }}</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
// JS方法

// VUE功能组件
import countDown from '@/components/common/countdown/count-down.vue';

export default {
	name: 'presell-floor',
	components: { 'count-down': countDown },

	props: {
		className: String,
		goodData: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},

	data() {
		return {
			showPopup: false
		};
	},

	computed: {
		tempList() {
			let arr = [];
			if (this.goodData && this.goodData.preSellProductBO) {
				// 如果是定金预售商品
				if (this.goodData.preSellProductBO.payPctType == 1) {
					arr = [{ num: 1, con: '支付定金' }, { num: 2, con: '支付尾款' }, { num: 3, con: '商家发货' }];
					// 如果是全款预售商品
				} else {
					arr = [{ num: 1, con: '支付全额款项' }, { num: 2, con: '商家发货' }];
				}
			}
			return arr;
		}
	},
	watch: {},
	created() {},
	methods: {
		/**
		 * 显示隐藏popup弹框
		 */
		changePopup() {
			this.showPopup = !this.showPopup;
			this.$emit('change', this.showPopup);
		}
	}
};
</script>

<style lang="scss" scoped></style>
