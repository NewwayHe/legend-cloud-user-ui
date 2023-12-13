<template>
	<view :class="className" :style="{ '--themescolor': themes.color, '--gradientcolor': themes.rgb07 }">
		<view class="d-flex bg-fff rounded-12 overflow-h h-240r"  @click="goCouponDetail">
			<!-- 左侧 -->
			<view class="p-2 position-relative">
				<ls-image :src="value.pic" :options="{ w: '200', h: '200', br: '12' }" />
				<view style="position: absolute; top: -10rpx; right: -10rpx; width: 20rpx; height: 20rpx; background: #f2f2f2; border-radius: 50%" />
				<view style="position: absolute; bottom: -10rpx; right: -10rpx; width: 20rpx; height: 20rpx; background: #f2f2f2; border-radius: 50%" />
			</view>
			<!-- 右侧 -->
			<view class="d-flex flex-column overflow-h w-100 p-2" style="border-left: 1px dashed rgb(228, 228, 228);">
				<text class="line-clamp1 font-28">{{ value.title }}</text>
				<view class="flex-start font-24 mt-1">
					<view class="text-main v-bottom">￥<text class="font-weight font-36">{{ value.amount }}</text></view>
					<view v-if="value.minPoint > 0" class="ml-1">满{{ value.minPoint }}元可用</view>
					<text v-else class="">无门槛</text>
				</view>
				<!-- 进度条 -->
				<view class="flex-start mt-1">
					<u-line-progress style="width: 25%;" :active-color="themes.color" height="12" :show-percent="false" :percent="Math.round((value.receiveCount / value.count) * 100)"></u-line-progress>
					<text class="font-24 text-999 ml-1">{{ value.receiveCount}}人已兑换</text>
				</view>
				<view class="flex-between">
					<view class="flex-center font-24" v-show="value.receiveType==2">
						<text >{{value.integral}}</text>
						<image style="width: 28rpx;height: 28rpx;margin: 0rpx 6rpx;" src="../../../static/images/jifen.png" mode=""></image>
						兑换
					</view>
					<!-- 按钮组 -->
					<view style="margin-left: auto;">
						<template v-if="value.receiveCount == value.count">
							<view class="flex-center text-white rounded-100 bg-ccc pointer-none" style="width: 140rpx;height: 56rpx;" v-if="!value.receivedFlag">已领取完</view>
							<view
								class="flex-center rounded-100 border font-24"
								:class="value.status == 0 ? 'text-ccc border-ccc pointer-none' : 'text-main border-main'"
								style="width: 140rpx;height: 56rpx;"
								@click.stop="toCouponGood(value)"
								v-else
							>
								去使用
							</view>
						</template>
						<template v-else>
							<view class="flex-center font-24 text-white rounded-100 l-gradient-r text-nowrap overflow-x" style="width: 140rpx;height: 56rpx;" @click.stop="getCoupon(value.id)" v-if="!value.receivedFlag">
								{{value.receiveType==2?'立即兑换':'立即领取'}}
							</view>
							<view
								class="flex-center rounded-100 border font-24"
								:class="value.status == 0||source=='history'||value.useFlag||(value.couponUserDTO&&value.couponUserDTO.status==0) ? 'text-ccc border-ccc pointer-none' : 'text-main border-main'"
								style="width: 140rpx;height: 56rpx;"
								@click.stop="toCouponGood(value)"
								v-else
							>
								{{source=='history'||value.useFlag?'已使用':'去使用'}}
							</view>
						</template>
					</view>
					<template v-if="type==1">
						<view class="position-absolute receive" style="width: 100rpx;height: 80rpx;top: 0;right: -5rpx;"  v-if="value.receivedFlag"></view>
					</template>
					<template v-if="type==2">
						<view class="position-absolute used" style="width: 100rpx;height: 80rpx;top: 0;right: -5rpx;" v-if="source=='history'"></view>
						<view class="position-absolute receive" style="width: 100rpx;height: 80rpx;top: 0;right: -5rpx;" v-else-if="value.receivedFlag && (value.status == 1 || (value.couponUserDTO && value.couponUserDTO.status == 1))"></view>
						<view class="position-absolute used" style="width: 100rpx;height: 80rpx;top: 0;right: -5rpx;" v-else-if="value.receivedFlag && value.couponUserDTO && value.couponUserDTO.status == 2"></view>
						<view class="position-absolute overdue" style="width: 100rpx;height: 80rpx;top: 0;right: -5rpx;" v-else-if="value.status == -1||(value.couponUserDTO && value.couponUserDTO.status == -1)"></view>
					</template>
				</view>
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
									this.value.receiveCount++
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
			if(this.type == 1){
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
