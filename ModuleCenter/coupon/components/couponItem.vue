<template>
	<view :class="className" :style="{ '--themescolor': themes.color, '--gradientcolor': themes.rgb07 }">
		<view class="d-flex bg-fff rounded-12 overflow-h h-240r">
			<view class="h-100 flex-1 p-2 flex-col-between position-relative overflow-h" @click="goCouponDetail">
				<text class="line-clamp1 font-32">{{ value.title }}</text>
				<view class="mt-2 flex-1 w-100 flex-start">
					<ls-image :src="value.pic" :options="{ w: '140', h: '140', br: '12' }" />
					<view class="pl-2 pb-1 flex-col-between h-100 flex-1 overflow-h">
						<view class="font-24 w-100 text-main">
							<view class="">
								￥
								<text class="font-weight font-36">{{ value.amount }}</text>
							</view>
							<view v-if="value.minPoint > 0" class="">满{{ value.minPoint }}元可用</view>
							<text v-else class="">无门槛</text>
						</view>
						<view class="flex-center text-999">
							<u-icon :name="type==1?'arrow-right':''" color="#999" size="20" :label="value.shopName || '平台优惠券'" label-size="24" label-color="#999" label-pos="left"></u-icon>
						</view>
					</view>
				</view>

				<!-- 如果该组件是优惠券中心的元素 -->
				<template v-if="type==1">
					<view class="position-absolute receive" style="width: 100rpx;height: 80rpx;top: 0;right: -5rpx;" v-if="value.receivedFlag"></view>
				</template>
				<!-- 如果该组件是优惠券详情的元素 -->
				<template v-if="type==2">
					<view class="position-absolute used" style="width: 100rpx;height: 80rpx;top: 0;right: -5rpx;" v-if="source=='history'"></view>
					<view class="position-absolute receive" style="width: 100rpx;height: 80rpx;top: 0;right: -5rpx;" v-else-if="value.receivedFlag && (value.status == 1 || (value.couponUserDTO && value.couponUserDTO.status == 1))"></view>
					<view class="position-absolute used" style="width: 100rpx;height: 80rpx;top: 0;right: -5rpx;" v-else-if="value.receivedFlag && value.couponUserDTO && value.couponUserDTO.status == 2"></view>
					<view class="position-absolute overdue" style="width: 100rpx;height: 80rpx;top: 0;right: -5rpx;" v-else-if="value.status == -1||(value.couponUserDTO && value.couponUserDTO.status == -1)"></view>
				</template>
			</view>
			<view class="w-200r flex-col-center position-relative text-center font-24" style="border-left: 2rpx dashed #e4e4e4;">
				<view class="position-relative d-flex text-center">
					<cmdCircle
						style=""
						type="dashboard"
						:cid="value.id+'##'"
						:percent="Math.round((value.receiveCount / value.count) * 100)"
						:showInfo="false"
						:width="60"
						:stroke-width="4"
						stroke-shape="round"
						:stroke-color="themes.color"
						stroke-background="#f5f5f5"
					></cmdCircle>
					<view class="position-absolute text-center font-24 w-100" style="top: 25%; left: 0">
						<text class="d-inline-block" style="letter-spacing: 2px; width: 80%; padding: 0 10rpx">已领{{ Math.round((value.receiveCount / value.count) * 100) }}%</text>
					</view>
				</view>
				<view class="" style="margin-top: -6rpx;">
					<template v-if="value.receiveCount == value.count">
						<view class="flex-center text-white rounded-100 bg-ccc pointer-none" style="width: 140rpx;height: 56rpx;" v-if="!value.receivedFlag">已领取完</view>
						<view
							class="flex-center rounded-100 border"
							:class="value.status == 0 ? 'text-ccc border-ccc pointer-none' : 'text-main border-main'"
							style="width: 140rpx;height: 56rpx;"
							@click="toCouponGood(value)"
							v-else
						>
							去使用
						</view>
					</template>
					<template v-else>
						<view class="flex-center text-white rounded-100 l-gradient-r text-nowrap overflow-x" style="width: 140rpx;height: 56rpx;" @click="getCoupon(value.id)" v-if="!value.receivedFlag">
							{{value.receiveType==2?(value.integral || 0)+'积分兑换':'立即领取'}}
						</view>
						<view
							class="flex-center rounded-100 border"
							:class="value.status == 0||source=='history'||value.useFlag||(value.couponUserDTO&&value.couponUserDTO.status==0) ? 'text-ccc border-ccc pointer-none' : 'text-main border-main'"
							style="width: 140rpx;height: 56rpx;"
							@click="toCouponGood(value)"
							v-else
						>
							{{source=='history'||value.useFlag?'已使用':'去使用'}}
						</view>
					</template>
				</view>

				<!-- 两个点 -->
				<view style="position: absolute; top: -10rpx; left: -10rpx; width: 20rpx; height: 20rpx; background: #f2f2f2; border-radius: 50%" />
				<view style="position: absolute; bottom: -10rpx; left: -10rpx; width: 20rpx; height: 20rpx; background: #f2f2f2; border-radius: 50%" />
			</view>
		</view>
	</view>
</template>

<script>
import cmdCircle from '@/components/common/cmd-circle/cmd-circle.vue';
import { couponApi } from '@/api/ModuleCenter.js';
import { mapState } from 'vuex';

export default {
	components: { cmdCircle },
	props: {
		className:String,
		value: {
			type: Object,
			default() {
				return {};
			}
		},
		/**
		 * 1：优惠券中心，2：优惠券详情
		 */
		type: {
			type: [Number, String],
			default: 1
		},
		/**
		 *  是从哪里跳进来的: center=>领券中心; user=>用户; integral=>积分优惠券
		 * 	备注：type == 2：优惠券详情 页面上才用到该变量
		 */
		source:String,
	},
	data() {
		return {};
	},
	computed: {
		...mapState(['userInfo'])
	},
	watch: {},
	onLoad() {},
	mounted() {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {},

	methods: {
		// 领取优惠券
		getCoupon(id) {
			this.$u.throttle(() => {
				couponApi.addCoupon(id).then(res => {
					if (res.code) {
						uni.showToast({
							title: '领取成功',
							icon: 'success',
							mask: true,
							complete: () => {
								// setTimeout(() => {
									this.value.receiveCount ++
									this.value.receivedFlag = true;
									this.$emit('input', this.value);
								// }, 1500);
							}
						});
					} else {
						uni.showToast({ title: res.msg, icon: 'none', mask: true });
					}
				});
			});
		},
		// 去优惠券商品列表页
		toCouponGood(coupon) {
			if (coupon.shopProviderFlag) {
				this.$navigateTo(`/ModuleCenter/coupon/couponGoods?id=${coupon.id}&shop=${coupon.shopId}&type=${coupon.useType}`);
			} else {
				this.$navigateTo(`/ModuleCenter/coupon/couponShops?id=${coupon.id}`);
			}
		},
		goCouponDetail(){
			if(this.type==1){
				this.$navigateTo(`/ModuleCenter/coupon/couponDetail?id=${this.value.id}&type=center`)
			}
		}
	}
};
</script>
<style scoped>
.receive {
	background: url('@/static/images/receive.png') no-repeat 70% center;
	background-size: 100rpx 80rpx;
}
.overdue {
	background: url('@/static/images/overdue.png') no-repeat 70% center;
	background-size: 100rpx 80rpx;
}
.used {
	background: url('@/static/images/used.png') no-repeat 70% center;
	background-size: 100rpx 80rpx;
}
</style>
