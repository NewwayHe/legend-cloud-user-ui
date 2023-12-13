<template>
	<!-- /*
     * @Descripttion:活动商品详情楼层：活动商品详情banner图下的活动价格及倒计时
    */ -->
	<view class="position-sticky zindex-99" :style="{ background: themes.color, top: `calc(88rpx + ${stausBarHeight}px)` }">
		<view class="flex-around h-120r overflow-h bg-white border-box" :style="{ '--themescolor': themes.color, '--gradientcolor': themes.rgb06 }">
			<view
				class="flex-1 overflow-h flex-col-start h-100 text-white font-28 font-arial text-nowrap pl-2 border-box position-relative l-gradient-b"
				:class="(skuData.skuItem.activitySkuDTO && skuData.skuItem.activitySkuDTO.peopleNumber) || !skuType ? 'a-center' : 'a-baseline pt-2'"
			>
				<view class="flex-start w-100 overflow-x">
					<view class="font-32 font-weight mr-1">
						<!-- 如果是预售 -->
						<text v-if="!skuType && goodData.preSellProductBO">
							<!-- 如果是定金预售商品 -->
							<template v-if="goodData.preSellProductBO.payPctType == 1">
								<text class="">定金：</text>
								{{ depositMoney | priceFilter }}
								<text class="ml-2">尾款：</text>
								{{ finalMoney | priceFilter }}
							</template>
							<!-- 如果是全款预售商品-->
							<template v-else>
								<text class="">预售价：</text>
								{{ price | priceFilter }}
							</template>
						</text>
						<text v-else>
							{{ skuType == 'MERGE' ? '拼团价' : skuType == 'GROUP' ? '团购价' : skuType == 'SECKILL' ? '秒杀价' : '' }}
							<text v-if="skuData.skuItem.activitySkuDTO">{{ skuData.skuItem.activitySkuDTO.price | priceFilter }}</text>
						</text>
					</view>
					<view class="flex-col-baseline">
						<text class="border border-white rounded-5 font-sm px-1 zoom-09" v-if="skuData.skuItem.activitySkuDTO && skuData.skuItem.activitySkuDTO.peopleNumber">
							满{{ skuData.skuItem.activitySkuDTO.peopleNumber }}{{ skuType == 'GROUP' ? '件' : '人' }}成团
						</text>
					</view>
				</view>
				<view class="line-through font-12 mt-1 text-eee" v-if="skuData.skuItem.price && skuType">原价￥{{ skuData.skuItem.price }}</view>
				<view class="line-through font-12 mt-1 text-eee" v-if="originalPrice && !skuType">原价￥{{ originalPrice }}</view>

				<!-- 三角形(原理：写一个菱形，然后在一个长方形里用overflow-h只显示其中的三角形部分，菱形用bg-white白色底色，然后菱形里再包一个想要的颜色的元素) -->
				<view class="w-20r h-100 overflow-h position-absolute right-0 border-box">
					<view
						class="border-box position-absolute bg-white overflow-h"
						style="width: 60rpx;height: 60rpx;transform: rotateZ(45deg) skew(30deg, 30deg);bottom: 25%;left: -50%;"
					>
						<view
							class="w-100 h-100"
							:style="{
								background:
									showTime &&
									timeDiff &&
									((skuData.skuItem.activitySkuDTO && (skuData.skuItem.activitySkuDTO.status == 1 || skuData.skuItem.activitySkuDTO.status == 0)) ||
										(goodData.preSellProductBO && endTime > currentTime))
										? themes.rgb02
										: 'rgba(0,0,0,.1)'
							}"
						></view>
					</view>
				</view>
			</view>
			<template
				v-if="
					((skuData.skuItem.activitySkuDTO && (skuData.skuItem.activitySkuDTO.status == 1 || skuData.skuItem.activitySkuDTO.status == 0)) ||
						(goodData.preSellProductBO && endTime > currentTime)) &&
						showTime &&
						timeDiff
				"
			>
				<view
					class="flex-col-center h-100 font-24 transition-all10"
					:style="{
						background: themes.rgb02,
						paddingRight: isFixed ? wxMenuBut.placeholder + 'px' : 20 + 'rpx',
						paddingLeft: isFixed ? 0 : 20 + 'rpx'
					}"
				>
					<view class="text-main font-weight pb-1">
						<text v-if="showStartTime">距离开始</text>
						<text v-else>距离结束</text>
					</view>
					<count-down v-slot="{ times }" :time="showStartTime ? startTime : endTime" :custom="true" @finish="_callback">
						<view class="flex-between text-white" style="margin-top: 4rpx">
							<text class="bg-main rounded-10" style="padding: 2rpx 6rpx" v-if="times.days > 0">
								{{ times.days }}
								<text style="font-size: 20rpx">天</text>
							</text>
							<text class="text-main font-28" style="margin: 0 6rpx" v-if="times.days > 0">:</text>
							<text class="bg-main rounded-10" style="padding: 2rpx 6rpx">{{ times.hours }}</text>
							<text class="text-main font-28" style="margin: 0 6rpx">:</text>
							<text class="bg-main rounded-10" style="padding: 2rpx 6rpx">{{ times.minutes }}</text>
							<text class="text-main font-28" style="margin: 0 6rpx">:</text>
							<text class="bg-main rounded-10" style="padding: 2rpx 6rpx">{{ times.seconds }}</text>
						</view>
					</count-down>
				</view>
			</template>

			<template v-else>
				<view
					@click="goGoodsDetail"
					class="flex-col-center h-100 font-24 transition-all10"
					style="color: #666666; background: rgba(0, 0, 0, 0.1)"
					:style="{ paddingRight: isFixed ? wxMenuBut.placeholder + 'px' : 20 + 'rpx', paddingLeft: isFixed ? 0 : 20 + 'rpx' }"
				>	
					<template v-if="skuType">
						<text v-if="skuData.skuItem.activitySkuDTO && skuData.skuItem.activitySkuDTO.status == 10">该活动已结束</text>
						<text v-else-if="skuData.skuItem.activitySkuDTO && skuData.skuItem.activitySkuDTO.status == 15">该活动已失效</text>
						<text v-else-if="skuData.skuItem.activitySkuDTO && skuData.skuItem.activitySkuDTO.status == 2">该活动已暂停</text>
						<text>查看商品</text>
					</template>
					<!-- 如果是预售 -->
					<template v-else>
						<text v-if="endTime < currentTime">该活动已结束</text>
					</template>

				</view>
			</template>
		</view>
	</view>
</template>
<script>
import countDown from '@/components/common/countdown/count-down.vue';
import { mapState } from 'vuex';
export default {
	name: '',
	components: { 'count-down': countDown },

	props: {
		goodData: {
			type: Object,
			default: () => {
				return {};
			}
		},
		skuData: {
			type: Object,
			default: () => {
				return {};
			}
		},
		skuType: String // 营销类型 拼团/团购/秒杀活动需传 普通（NORMAL，在这里规定普通商品的话值为空''，有值就是有活动） 团购（GROUP） 拼团（MERGE） 秒杀（SECKILL）
	},

	data() {
		return {
			isFixed: false
		};
	},
	computed: {
		...mapState(['wxMenuBut', 'timeDiff', 'stausBarHeight']),
		// 当前的时间戳
		currentTime() {
			return new Date().getTime() - this.timeDiff;
		},
		price(){
			// 如果有sku优惠折扣价格,则显示sku优惠折扣价格
			return this.skuData.skuItem.discountPrice || this.skuData.skuItem.discountPrice == 0 ? this.skuData.skuItem.discountPrice : this.skuData.skuItem.price
		},
		originalPrice(){
			// 如果有sku优惠折扣价格,则划线价为现价
			return this.skuData.skuItem.discountPrice || this.skuData.skuItem.discountPrice == 0 ? this.skuData.skuItem.price : this.skuData.skuItem.originalPrice
		},
		// 判断活动是否过期,true:j显示倒计时，false：关闭倒计时，显示活动已过期
		showTime() {
			return !!(this.endTime && this.endTime > new Date().getTime() - this.timeDiff);
		},
		// 判断是否显示开始时间，开始时间少于当前时间时，马上切换到结束时间
		showStartTime() {
			return this.startTime > new Date().getTime() - this.timeDiff;
		},

		// 用来接收skuData.skuItem.activitySkuDTO.startTime的变量
		startTime() {
			if (this.skuType && this.skuData.skuItem && this.skuData.skuItem.activitySkuDTO && this.skuData.skuItem.activitySkuDTO.startTimeStamp) {
				return this.skuData.skuItem.activitySkuDTO.startTimeStamp;
				/* 如果为预售商品
				*preSellProductBO：
					status: 商品预售状态：1：在定金支付时间段内 0：不在定金支付时间段内
					payPctType：支付方式,0:全额,1:定金尾款。
						如果是全额支付，支付状态是用预售开始时间saleStart和预售结束时间saleEnd来判断
						如果是定金尾款，支付状态是用定金支付开始时间depositStarts和定金支付结束时间depositEnds来判断
			*/
			} else if (this.goodData.preSellProductBO) {
				if (this.goodData.preSellProductBO.payPctType == 1) {
					return this.goodData.preSellProductBO.depositStarts;
				} else {
					return this.goodData.preSellProductBO.saleStart;
				}
			} else {
				return '';
			}
		},
		// 用来接收skuData.skuItem.activitySkuDTO.endTime的变量
		endTime() {
			if (this.skuType && this.skuData.skuItem && this.skuData.skuItem.activitySkuDTO && this.skuData.skuItem.activitySkuDTO.endTimeStamp) {
				return this.skuData.skuItem.activitySkuDTO.endTimeStamp;
				// 如果是预售商品
			} else if (this.goodData.preSellProductBO) {
				if (this.goodData.preSellProductBO.payPctType == 1) {
					return this.goodData.preSellProductBO.depositEnds;
				} else {
					return this.goodData.preSellProductBO.saleEnd;
				}
			} else {
				return '';
			}
		},
		
		/*
			定金：
				定金和尾款的算法：
					定金：skuData.skuItem.price*goodData.preSellProductBO.payPct/100,
					尾款：skuData.skuItem.price*(100-goodData.preSellProductBO.payPct)/100 - 总优惠金额
					总优惠金额：skuData.skuItem.price-skuData.skuItem.discountPrice (优惠金额在尾款里扣除，如果尾款少于优惠金额，则剩下的优惠金额在定金里扣)
		*/
		depositMoney(){
		   let money = 0
		   // 如果支付方式是定金尾款支付
		   if (this.skuData.skuItem && this.goodData.preSellProductBO && this.goodData.preSellProductBO.payPctType == 1) {
			   // 如果有sku优惠折扣价格
			   if (this.skuData.skuItem.discountPrice || this.skuData.skuItem.discountPrice == 0) {
				    // sku优惠折扣会在尾款里扣减,如果尾款不够扣减,则在定金里扣减
					if ((this.skuData.skuItem.price * (100 - this.goodData.preSellProductBO.payPct) / 100) < (this.skuData.skuItem.price - this.skuData.skuItem.discountPrice)) {
						money = this.skuData.skuItem.discountPrice
					}else{
						money = this.skuData.skuItem.price * this.goodData.preSellProductBO.payPct / 100
					}
			   }else{
				   money = this.skuData.skuItem.price * this.goodData.preSellProductBO.payPct / 100
			   }
		   }
		   return money
		},
			   
		// 尾款
		finalMoney(){
		   let money = 0
		   // 如果支付方式是定金尾款支付
		   if (this.skuData.skuItem && this.goodData.preSellProductBO && this.goodData.preSellProductBO.payPctType == 1) {
			   // 如果有sku优惠折扣价格
			   if (this.skuData.skuItem.discountPrice || this.skuData.skuItem.discountPrice == 0) {
				    // sku优惠折扣会在尾款里扣减,如果尾款不够扣减,则在定金里扣减
					if ((this.skuData.skuItem.price * (100 - this.goodData.preSellProductBO.payPct) / 100) < (this.skuData.skuItem.price - this.skuData.skuItem.discountPrice)) {
						money = 0
					}else{
						money = this.skuData.skuItem.price * (100 - this.goodData.preSellProductBO.payPct) / 100
					}
			   }else{
				   money = this.skuData.skuItem.price * (100 - this.goodData.preSellProductBO.payPct) / 100
			   }
		   }
		   return money
		},
	},

	watch: {},

	created() {},

	mounted() {},

	beforeDestroy() {},

	destroyed() {},

	methods: {
		_callback() {
			this.$emit('downCallback');
		},
		getIsFixed(flag) {
			this.isFixed = flag;
			this.$emit('isFixed', this.isFixed);
		},
		goGoodsDetail(){
			if (this.skuType) {
				this.$navigateTo(`/ModuleGoods/goodsDetail/goodsDetail?id=${this.skuData.skuItem.productId}`)
			}
		}
	}
};
</script>

<style lang="scss" scoped></style>
