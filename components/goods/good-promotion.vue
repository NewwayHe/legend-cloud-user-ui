<!-- 促销 -->
<template>
	<view>
		<!-- 促销 -->
		<view class="p-2 flex-between overflow-h" :class="className" @click="changePromoPopup">
		    <text class="text-333 pr-2 font-weight">促销</text>
		    <view class="text-999 flex-1 overflow-h flex-between">
		        <view class="d-flex flex-wrap" style="transform: scale(0.7) ;transform-origin: left center;">
					<view v-if="promoData.limitDiscountsMarketingId" class="border border-main d-inline-block mr-2 font-24 overflow-h position-relative rounded-5 pr-1">
						<text style="border-bottom-right-radius: 10rpx;" class="d-inline-block px-1 mr-1 py h-100 l-gradient-l text-fff bg-main">限时</text> 
						<text class="text-main">折扣</text>
					</view>
					<view v-for="(item, index) in promoData.optionalRewardMarketingList" :key="index" class="d-inline-block mr-2 text-main border border-main mx text-fff font-24 px-1 py position-relative rounded">
						{{ item.type | getStatusStr }}
					</view>
				</view>
		        <text class="px-3"></text>
		    </view>
		    <text class="iconfont icon-caidan1 text-999"></text>
		</view>
		<!-- 促销弹出层 -->
		<u-popup mode="bottom" border-radius="24" v-model="promoVisible" safe-area-inset-bottom>
			<view class="content h-60vh text-333">
				<view class="position-relative p-3 flex-center">
				    <text class="font-32 text-center font-weight-500" style="line-height: 44rpx;">促销</text>
					<view class="position-absolute flex-center custom-close" @click.stop="promoVisible = false">
						<text class="iconfont icon-guanbi" style="color: #666666; font-size: 24rpx;"></text>
					</view>
				</view>
				<view v-if="promoData.limitDiscountsMarketingId">
					<view class="flex-start py-3 px-4">
						<view>
							<view class="d-flex flex-wrap" style="transform: scale(0.8); transform-origin: left center;">
								<view class="border border-main d-inline-block mr-1 font-20 overflow-h position-relative rounded-5">
									<text style="border-bottom-right-radius: 10rpx;" class="d-inline-block px-1 h-100 l-gradient-l text-fff bg-main">限时</text> 
									<text class="text-main px-1">折扣</text>
								</view>
							</view>
							<view class="text-333 mt-2" style="line-height: 40rpx;">
								<text v-for="(item, index) in promoData.optionalLimitDiscountsMarketing" :key="index" space="nbsp">{{ item.desc.replace(/\.0+$/g, '') }}</text>
							</view>
						</view>
					</view>
				</view>
				<view v-for="(item1, index1) in promoData.optionalRewardMarketingList" :key="index1">
					<view class="flex-between py-3 px-4">
						<view>
							<view class="d-flex flex-wrap" style="transform: scale(0.8); transform-origin: left center;">
								<view class="px border border-main d-inline-block mr-1 font-20 overflow-h position-relative rounded-5">
									<text class="text-main">{{ item1.type | getStatusStr }}</text>
								</view>
							</view>
							<view class="text-333 mt-2" style="line-height: 40rpx;">
								<text v-for="(item2, index2) in item1.descList" :key="index2">
									{{ item2.replace(/\.0+/g, '') }}
								</text>
							</view>
						</view>
						<view class="d-flex a-baseline" @click="goAddOnList(item1)">
							<text class="font-24 text-999 mr-1">去凑单</text>
							<text class="iconfont icon-ArrowRight" style="font-size: 20rpx; color: #333;"></text>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		name: 'GoodPromotion',
		filters: {
		    getStatusStr(status) {
		        const statusType = {
		            0: '满减',
		            1: '满折',
		            2: '限时折扣'
		        }
		        return statusType[status]
		    }
		},
		props: {
			className: String,
			promoData: {
			    type: Object,
			    default() {
			        return {}
			    }
			},
		},
		data() {
			return {
				promoVisible: false, // 控制促销弹出层的显示与隐藏
			}
		},
		watch:{
			'promoData'(newVal) {
				console.log('zxcsadsa', newVal)
			}
		},
		created() {
		},
		mounted() {
		},
		methods: {
			// 切换弹出层的显示与隐藏
			changePromoPopup() {
				this.promoVisible = !this.promoVisible
			},
			// 跳转到凑单列表页面
			goAddOnList(value) {
				this.changePromoPopup();
				uni.navigateTo({ url: `/ModuleActive/addOn/addOnList?id=${value.marketId}` });
			}
		}
	}
</script>

<style lang="scss" scoped>
	.custom-close {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		background-color: #F5F5F5;
		top: 30rpx;
		right: 30rpx;
	}
</style>
