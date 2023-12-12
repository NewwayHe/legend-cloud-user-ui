<template>
	<view :style="{ '--themescolor': themes.color,'--gradientcolor':themes.rgb07 }">
		<ls-header showHeadSelect title="优惠券">
			<ls-tabs
				slot="bottom"
				className="w-100"
				bgColor="#f2f2f2"
				:list="[{ name: '全部', type: '' }, { name: '店铺券', type: 1 }, { name: '平台券', type: 0 }, { name: '积分券', type: 2 }]"
				@change="checkType"
			/>
		</ls-header>
		<view class="safearea-bb pb-12 pt-2">
			<ls-load-more :status="paging.status" v-if="!paging.emptylist">
				<view class="d-flex bg-fff rounded-12 mx-2 mb-2 overflow-h h-240r"  v-for="item in list" :key="item.id">
					<view class="h-100 flex-1 p-2 flex-col-between position-relative overflow-h">
						<text class="line-clamp1 font-32">{{ item.title }}</text>
						<view class="mt-2 flex-1 w-100 flex-start">
							<ls-image :src="item.pic" :options="{ w: '140', h: '140', br: '12' }" />
							<view class="pl-2 pb-1 flex-col-between h-100 flex-1 overflow-h">
								<view class="font-24 w-100">
									<view class="line-clamp1" v-if="item.useStartTime">{{ item.useStartTime.replace(/\-/g, '.') }}至</view>
									<view class="line-clamp1" v-if="item.useEndTime">{{ item.useEndTime.replace(/\-/g, '.') }}</view>
								</view>
								<view class="flex-center text-999" @click="$navigateTo(`/ModuleCenter/coupon/couponDetail?id=${item.couponId}&couponUserId=${item.id}`)">
									<u-icon name="arrow-right" color="#999" size="20" :label="item.shopName||'详情'" label-size="24" label-color="#999" label-pos="left"></u-icon>
								</view>
							</view>
						</view>
					</view>
					<view class="w-200r flex-col-center position-relative text-main text-center font-24" :style="{backgroundColor:themes.rgb02}">
						<view class="w-100 overflow-x font-28">￥<text class="font-weight font-60">{{item.amount}}</text></view>
						<view v-if="item.minPoint > 0" class="">满{{item.minPoint}}可用</view>
						<text v-else class="">无门槛</text>
						<view class="text-white rounded-100 mt-1" :class="item.status == 0?'bg-ccc pointer-none':'l-gradient-r'" style="padding: 6rpx 26rpx 6rpx 26rpx;" @click="useCoupon(item)">去使用</view>
						<!-- 两个点 -->
						<view style="position: absolute; top: -10rpx; left: -10rpx; width: 20rpx; height: 20rpx; background: #f2f2f2; border-radius: 50%" />
						<view style="position: absolute; bottom: -10rpx; left: -10rpx; width: 20rpx; height: 20rpx; background: #f2f2f2; border-radius: 50%" />
						<!-- 三角形 -->
						<view class="position-absolute right-0 top-0" :style="{borderTop: `80rpx solid ${themes.color}`, borderLeft: `80rpx solid transparent`, borderBottom: `0rpx solid ${themes.color}`}" v-if="!item.shopName||item.receiveType==2">
							<text class="position-absolute text-nowrap font-20 text-white" style="transform:rotate(45deg) scale(0.8);bottom: 36rpx;right: -12rpx;">
								{{item.receiveType==2?'积分券':'平台券'}}
							</text>
						</view>
					</view>
				</view>
			</ls-load-more>
			<ls-empty className="center-xy" :title="'暂无相关优惠券'" :paging="paging" />
		</view>
		<view class="flex-center text-center position-fixed bottom-0 bg-fff w-100 font-28 py-3 safearea-bb">
			<view class="flex-1 border-right border-e4"  @click="$navigateTo(`/ModuleCenter/coupon/couponHistory`)">历史记录</view>
			<view class="flex-1"  @click="$navigateTo(`/ModuleCenter/coupon/couponCenter`)">领券中心</view>
		</view>
	</view>
</template>

<script>
import pageUtil from '@/utils/pageUtils.js';
import { couponApi } from '@/api/ModuleCenter';

const listPage = new pageUtil(couponApi.getCoupon);

export default {
	components: {},
	data() {
		return {
			exchangeHeight: 0,
			params: {
				status: 1,
				shopProviderFlag: '',
				receiveType: ''
			},
			list: [],
			paging: {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false // 是否显示列表为空时的样式
			},
		};
	},
	watch: {},
	onLoad() {
		listPage.loadListByPage(this, this.params);
	},
	mounted() {},
	onShow() {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {
		listPage.loadListByPageMore();
	},

	methods: {
		// 改变tab
		checkType(item) {
			this.params.shopProviderFlag = item.type;
			this.params.receiveType = '';
			if (this.params.shopProviderFlag === 2) {
				this.params.shopProviderFlag = 0;
				this.params.receiveType = 2;
			}
			listPage.loadListByPage(this, this.params);
		},

		// 使用优惠券
		useCoupon(coupon) {
			console.log('use coupon', coupon);
			if (!coupon.shopId) {
				this.$navigateTo(`/ModuleCenter/coupon/couponShops?id=${coupon.couponId}`);
				return;
			}

			if (coupon.useType == 0) {
				this.$navigateTo(`/ModuleGoods/shopHome/shopIndex?shopId=${coupon.shopId}`);
			} else {
				this.$navigateTo(`/ModuleCenter/coupon/couponGoods?id=${coupon.couponId}&shop=${coupon.shopId}&type=${coupon.useType}`);
			}
		}
	}
};
</script>

<style>page { background: #f2f2f2; }</style>
