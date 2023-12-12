<template>
	<!-- /*
     * @Descripttion:促销选择
    */ -->
	<u-popup v-model="show" mode="bottom" border-radius="14" safe-area-inset-bottom closeable :style="{ '--themescolor': themes.color, '--gradientcolor': themes.rgb06 }">
		<view class="px-2 font-24">
			<view class="d-flex py-2 pr-6">
				<ls-image :src="saleItem.pic" mode="aspectFill" :options="{ w: '200', h: '200', br: '10' }" />
				<view class="flex-1 flex-col-between pl-2">
					<view class="line-clamp2 font-28 mt-1">{{ saleItem.skuName }}</view>
					<view class="text"><ls-price :price="saleItem.price" :options="{ is: 32 }" /></view>
				</view>
			</view>
			<view class="font-28 font-weight">修改促销</view>
			<view class="pb-4 overflow-h">
				<radio-group @change="salesChange">
					<label v-for="(item, index) in saleItem.marketingActivityDTO" :key="index">
						<view class="my-2 h flex-start">
							<radio :value="item.marketId + ''" :checked="item.marketId == parmas.marketingId" class="scale-08" :color="themes.color"></radio>
							{{ item.desc }}
						</view>
					</label>
				</radio-group>
			</view>
			<ls-button
				:className="'h-70r my-4 mx-6 l-gradient-l l-gradient-lt text-fff'"
				:cssStyle="{lineHeight: '70rpx'}"
				loading
				@click="confirmSale"
				:options="{ br: '50', ls: '20', fs: '30' }"
			>
				确定
			</ls-button>
		</view>
	</u-popup>
</template>

<script>
import { cartApi } from '@/api/ModulesOrder.js';
export default {
	name: 'sku-sale',
	props: {
		saleList: {
			type: [Array, Object]
		},
		saleItem: {
			type: [Array, Object]
		}
	},

	data() {
		return {
			show: false,
			parmas: {
				id: '',
				marketingId: '',
				skuId: ''
			}
		};
	},

	computed: { },
	watch: {
		saleItem: {
			handler(newVal) {
				console.log('saleItem:', this.saleItem);
				console.log('marketingId:', newVal.marketingId);
				if (!newVal) return;
				this.parmas.marketingId = newVal.marketingId;
				this.parmas.id = newVal.id;
				this.parmas.skuId = newVal.skuId;
			},
			deep: true,
			immediate: true
		}
	},
	created() {},

	mounted() {},

	destroyed() {},

	methods: {
		salesChange(e) {
			// console.log(e.detail.value)
			this.parmas.marketingId = e.detail.value;
		},
		// 显示弹窗，并重置数据
		changePopup() {
			this.show = !this.show;
		},
		confirmSale() {
			cartApi
				.changePromotion(this.parmas)
				.then(res => {
					if (res.code == 1) {
						this.$emit('confirm');
					}
				})
				.finally(res => {
					this.show = !this.show;
				});
		}
	}
};
</script>

<style lang="scss" scoped></style>
