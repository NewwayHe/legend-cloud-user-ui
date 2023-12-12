<template>
    <!-- （账单详情） -->
    <view class="w750 p-2 overflow-h" :style="{ '--themescolor': themes.color }">
		<ls-header showHeadSelect title="账户明细详情"></ls-header>
		
		<view class="bill safearea-bb" v-if="!!detailInfo">
			<view class="bill-top py-6 flex-col-center">
				<text class="text-666 font-28" style="line-height: 40rpx;">订单支付</text>
				<view class="text-333" style="font-size: 64rpx; font-weight: bold;">
					{{ detailInfo.operationType == 'DEDUCTION' ? '-' : '+' }}
					<ls-price :price="detailInfo.amount" notThemes :options="{ is: 64, ic: '#333333', iw: 700, ds: 64, dc: '#333333', dw: 700 }" />
				</view>
			</view>
			<view class="py-4 px-2 bill-btm">
				<view class="label-wrap">
					<text class="label-title">当前状态：</text>
					<text class="flex-1 word-breakall">{{ detailInfo.stateName }}</text>
				</view>
				<view class="label-wrap">
					<text class="label-title">收支类型：</text>
					<text class="flex-1 word-breakall">{{ detailInfo.operationType == 'ADDITION' ? '收入' : '支出' }}</text>
				</view>
				<view class="label-wrap">
					<text class="label-title">交易类型：</text>
					<text class="flex-1 word-breakall">{{ detailInfo.businessTypeName }}</text>
				</view>
				<view class="label-wrap">
					<text class="label-title">申请编号：</text>
					<text class="flex-1 word-breakall">{{ detailInfo.serialNo }}</text>
				</view>
				<view class="label-wrap">
					<text class="label-title">支付时间：</text>
					<text class="flex-1 word-breakall">{{ detailInfo.updateTime }}</text>
				</view>
				<view class="label-wrap">
					<text class="label-title">备注：</text>
					<text class="flex-1 word-breakall">{{ detailInfo.remarks }}</text>
				</view>
			</view>
		</view>
		
        <ls-empty v-else className="center-xy" type="2" title="没有符合条件的数据" :paging="paging" @reLoad="getData" reLoad/>
    </view>
</template>

<script>
import { depositApi } from '@/api/ModuleCenter';
export default {
    components: {},
    data() {
        return {
            pdCashLogDetailData: {},
			paging: {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false // 是否显示列表为空时的样式
			},
			detailInfo: null,
        };
    },
    computed: { },
    onLoad(options) {
		console.log('明细详情--', options)
		this.getData(options.id)
    },
    mounted() { },
	methods: {
		getData(id) {
			depositApi.walletDetail({ id }).then(res => {
				console.log('res--', res.data)
				if(res.code) {
					this.detailInfo = res.data
				}
			})
			.catch(err => {
				this.paging.error = true
			})
			.finally(() => {
				this.paging.status = 'noMore'
				if(this.$u.test.isEmpty(this.detailInfo)) {
					this.paging.emptylist = true
				}
			})
		}
	}
};
</script>

<style lang='scss' scoped>
.bill {
	.bill-top {
		height: 250rpx;
		border-bottom: 2rpx solid #f8f8f8;
	}
	.bill-btm {
		font-size: 28rpx;
		color: #333;
		line-height: 40rpx;
		.label-wrap {
			display: flex;
			.label-title {
				color: #999;
				flex-basis: 140rpx;
				margin-right: 20rpx;
			}
			&+.label-wrap {
				margin-top: 20rpx;
			}
		}
	}
}
</style>
