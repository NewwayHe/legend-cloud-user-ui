<template>
    <u-popup  v-model="showPopup" zIndex="999" border-radius="28" safe-area-inset-bottom closeable :style="{ '--themescolor': themes.color, '--themesrgba02': themes.rgb01 }">
		<view>
			<text class="d-block font-weight font-32 py-1 px-2 my-2 text-center">优惠券</text>
			<ls-tabs
				className="w-100"
				lineHeight="8"
				lineBottom="0"
				:list="['可用','不可用']"
				:current="current"
				@change="changeTab"
				v-if="(Number(couponList.length) )||(Number(unCouponList.length))"
			/>
		</view>
		<view class="dialogCoupon" style="height: 700rpx;">
			<scroll-view class="h-100" scroll-y @scroll="scroll">
				<view class="h-100 border-box px-2">
					<template v-if="list && list.length">
						<template v-for="item in list">
							<view class="my-2 transition-all05" :key="item.couponId" @click="chooseCoupon(item)" :class="{  'disable': item.selectStatus == -1 }">
								<view class="flex-start position-relative">
									<view class="flex-col-center text-center p-2 h-100 flex-shrink overflow-h"  :class="item.selectStatus == -1?'disable text-white':'but-main-rgb02'"  style="width: 250rpx;min-height: 200rpx;">
										<view class="overflow-x w-100">
											￥<text class="font-60 font-weight">{{item.amount}}</text>
										</view>
										{{ item.minPoint == 0 ? '无门槛' : `满${item.minPoint}可用` }}
									</view>
									<view class="flex-1 flex-start bg-white" 
										style="min-height: 200rpx; box-shadow: 0px 1px 4px -1px rgba(0, 0, 0, .1);"
									>
										<view class="overflow-h h-100 p-2 flex-col-between flex-1" style="min-height: 200rpx;">
											<view class="w-100 ">
												<view class="line-clamp2 pr-2 flex-1">
													{{ item.couponName }}
												</view>
												
												<view class="line-clamp2 pr-2 flex-1 text-danger font-20 mt-1"  v-if="item.unAvailableReason">
													{{item.unAvailableReason}}
												</view>
												<view class="font-24 line-clamp1">
													<text>{{ item.useStartTime | dateformat('YYYY.MM.DD') }} - {{ item.useEndTime | dateformat('YYYY.MM.DD') }}</text>
												</view>
											</view>
											<view class="w-100 text-999 flex-between">
												{{couponType(item)}}
												<text
												    class="choose-new mr-2 flex-shrink"
												    :class="{ cur:  item.selectStatus == 1}"
												>
												</text>
											</view>
										</view>
									</view>
									<view class="dotted-line-y-15r position-absolute h-100" style="left: -8rpx;"></view>
								</view>
							</view>
							
							<!-- 这里循环出可用的优惠券 -->
						</template>
					</template>
					<ls-empty title="暂无可用优惠券" v-else></ls-empty>
				</view>
			</scroll-view>
		</view>
    </u-popup>
</template>
<script>
	export default {
		components: {},
		props: {
			couponList: { // 可用优惠券
				type: Array | Object,
				default() {
					return []
				}
			},
			unCouponList: { // 不可用优惠券
				type: Array | Object,
				default() {
					return []
				}
			}
		},
		data() {
			return {
				current: 0,
				list: [],
                showPopup:false,
			}
		},
		computed: { },
		watch: {
			couponList: {
				handler(newVal) {
					if (newVal && newVal.length == 0) {
						this.current = 1
					}else{
						this.current = 0
					}
					this.list = this.current === 0 ? this.couponList : this.unCouponList
				},
				immediate: true,
				deep: true
			},
		},
		created() {},
		mounted() {},
		onShow() {},
		methods: {
			couponType(coupon){
				if(coupon.shopProviderFlag){
					if(coupon.productItems && coupon.productItems.length > 0){
						return '店铺商品券'
					}else{
						return '店铺通用券'
					}
				}else{
					if(coupon.shopItems && coupon.shopItems.length > 0){
						return '平台店铺券'
					}else{
						return '平台通用券'
					}
				}
			},
			// 显示弹窗，并重置数据
			changePopup() {
				this.$nextTick(() => {
                    this.showPopup = !this.showPopup
					// this.$refs.couponPopup.changePopup()
				})
			},
			
			chooseCoupon(couponItem) {
				if (couponItem.selectStatus == -1) {
					return
				}
				this.$emit('couponHandle', couponItem)
			},
			changeTab(item){
				this.list = item.index === 0 ? this.couponList : this.unCouponList
			},
			scroll() {}
		}
	}
</script>

<style scoped>
	.active {
		border-bottom: 4rpx solid red;
	}

	.active-padding {
		padding: -1px;
	}

	.disable {
		background: #ccc !important;
	}
	
	.dialogCoupon .choose-new {
		display: inline-block;
		width: 36rpx;
		height: 36rpx;
		vertical-align: top;
		background: url('~@/static/images/choose.png') no-repeat;
		background-size:  36rpx;
		cursor: pointer;
	}
	
	.dialogCoupon .choose-new.cur {
		background: url('~@/static/images/choosed.png') no-repeat;
		background-color: var(--themescolor);
		background-size:  36rpx;
		border-radius: 50%;
	}
</style>
