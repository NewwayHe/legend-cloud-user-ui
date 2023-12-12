<template>
    <view :style="{ '--themescolor': themes.color }">
		<ls-header showHeadSelect title="历史优惠券">
			<ls-tabs slot="bottom" className="w-100" bgColor="#f2f2f2" :list="[{name:'已使用',status:2},{name:'已过期',status:-1}]" @change="checkType" />
		 </ls-header>
        <view class="safearea-bb pb-12 pt-2">
            <ls-load-more :status="paging.status" v-if="!paging.emptylist">
				<view class="d-flex bg-fff rounded-12 mx-2 mb-2 overflow-h h-240r"  v-for="item in list" :key="item.id">
					<view class="h-100 flex-1 p-2 flex-col-between position-relative overflow-h">
						<view class="w-100">
							<text class="line-clamp1 font-28">{{ item.title }}</text>
							<view class="mt-2 font-24 line-clamp2" v-if="item.orderNumber">订单编号：{{ item.orderNumber}}</view>
							<view class="mt-2 font-24" v-else>
								<view class="line-clamp1" v-if="item.useStartTime">{{ item.useStartTime.replace(/\-/g, '.') }}至</view>
								<view class="line-clamp1" v-if="item.useEndTime">{{ item.useEndTime.replace(/\-/g, '.') }}</view>
							</view>
						</view>
						<view class="flex-center text-999" @click="$navigateTo(`/ModuleCenter/coupon/couponDetail?id=${item.couponId}&couponUserId=${item.id}&type=history`)">
							<u-icon name="arrow-right" color="#999" size="20" :label="item.shopName||'详情'" label-size="24" label-color="#999" label-pos="left"></u-icon>
						</view>
						<view class="position-absolute" :class="{ used: item.status == 2, overdue: item.status == -1 }" style="width: 120rpx;height: 96rpx;top: 0;right: -5rpx;"></view>
					</view>
					<view class="bg-ccc w-200r flex-col-center position-relative text-white text-center">
						<view class="w-100 overflow-x">￥<text class="font-weight" style="font-size: 64rpx;">{{item.amount}}</text></view>
						<view v-if="item.minPoint > 0" class="">满{{item.minPoint}}可用</view>
						<text v-else class="">无门槛</text>
						<view style="position: absolute; top: -10rpx; left: -10rpx; width: 20rpx; height: 20rpx; background: #f2f2f2; border-radius: 50%" />
						<view style="position: absolute; bottom: -10rpx; left: -10rpx; width: 20rpx; height: 20rpx; background: #f2f2f2; border-radius: 50%" />
						<!-- 三角形 -->
						<view class="position-absolute right-0 top-0" style="border-top: 80rpx solid #ffffff; border-left: 80rpx solid transparent; border-bottom: 0rpx solid #ffffff;" v-if="!item.shopName">
							<text class="position-absolute text-nowrap font-20 text-ccc" style="transform:rotate(45deg) scale(0.8);bottom: 36rpx;right: -12rpx;">
								平台券
							</text>
						</view>
					</view>
				</view>
            </ls-load-more>
			<ls-empty title="没有历史优惠券" :paging="paging" :type="7"/>
        </view>
    </view>
</template>

<script>
import pageUtil from '@/utils/pageUtils.js'
import { couponApi } from '@/api/ModuleCenter'

const listPage = new pageUtil(couponApi.getCoupon)

export default {
    components: {},
    data() {
        return {
            params: {
                shopProviderFlag: '',
                status: 2,
            },
            list: [],
            paging: {
                status: 'loading',
                error: false, // 是否错误
                emptylist: false, // 是否显示列表为空时的样式
            },
        }
    },
    computed: { },
    watch: {},
    onLoad() {
        listPage.loadListByPage(this, this.params)
    },
    mounted() {},
    onShow() {},

    /**
     * 页面上拉触底事件的处理函数
     */
  onReachBottom() {
  	listPage.loadListByPageMore()
  },

    methods: {
        // 改变tab
        checkType(item) {
            this.params.status = item.status
            listPage.loadListByPage(this, this.params)
        },
    },
}
</script>
<style>page { background: #f2f2f2; }</style>
<style scoped>
.receive {
	background: url('@/static/images/receive.png') no-repeat 70% center;
	background-size: 100% 100%;
}
.used {
    background: url('@/static/images/used.png') no-repeat 70% center;
    background-size: 100% 100%;
}

.overdue {
    background: url('@/static/images/overdue.png') no-repeat 70% center;
    background-size: 100% 100%;
}
</style>
