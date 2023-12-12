<template>
    <view class="h-100" :style="{ '--themescolor': themes.color}">
        <ls-header showHeadSelect title="账单明细"/>
        
		<view class="bill safearea-bb" v-if="!!list">
			<view class="bill-top py-6 flex-col-center">
				<text class="text-666 font-28" style="line-height: 40rpx;">{{ list.tradeExplain }}</text>
				<view class="text-333 my-2" style="font-size: 64rpx; font-weight: bold;">
					{{ list.mode == 'INCOME' ? '+' : '-' }}
					<ls-price :price="list.amount" notThemes :options="{ is: 64, ic: '#333333', iw: 600, ds: 64, dc: '#333333', dw: 600 }" />
				</view>
				<view class="text-999 font-30 text-center">{{ list.type == 'PAYMENT_GOODS' ? '交易成功' : '退款成功' }}</view>
			</view>
			<view class="py-4 px-2 bill-btm">
				<view class="label-wrap">
					<text class="label-title">{{ list.type == 'PAYMENT_GOODS' ? '交易说明：' : '退款说明：' }}</text>
					<text class="flex-1 word-breakall line-clamp3 text-right">{{ list.tradeExplain }}</text>
				</view>
				<view class="label-wrap">
					<text class="label-title">{{ list.type == 'PAYMENT_GOODS' ? '支付方式：' : '退款至：' }}</text>
					<text class="flex-1 word-breakall text-right">{{ list.payTypeName }}</text>
				</view>
				<view class="label-wrap">
					<text class="label-title">交易时间：</text>
					<text class="flex-1 word-breakall text-right">{{ list.createTime }}</text>
				</view>
				<view class="label-wrap" v-if="list.relatedBizOrderList && list.relatedBizOrderList.length > 1" @click="show=true">
					<text class="label-title">关联记录：</text>
					<text class="flex-1 word-breakall text-right">
						<text class="iconfont icon-ArrowRight" style="font-size: 28rpx;"></text>
					</text>
				</view>
				<view class="label-wrap">
					<text class="label-title">订单编号：</text>
					<text class="flex-1 word-breakall text-right">{{ list.bizOrderNo }}</text>
				</view>
				<view class="label-wrap">
					<text class="label-title">商户单号：</text>
					<text class="flex-1 word-breakall text-right">{{ list.innerPaymentNo }}</text>
				</view>
			</view>
		</view>
		
		<ls-empty v-else className="center-xy" type="2" title="没有符合条件的数据" :paging="paging" @reLoad="getData" reLoad/>
		
		
		<u-popup v-model="show" mode="bottom" border-radius="14" safe-area-inset-bottom closeable>
            <view style="background-color: #f6f7f8" v-if="!!list">
                <view class="text-999 font-28 text-center p-2 bg-fff">全部关联记录</view>
                <view
                    class="border-top px-4 py-2 bg-fff flex-between"
                    v-for="(item, index) in list.relatedBizOrderList"
                    :key="index"
                    @click="getBillInfo(item.id, item.currentFlag)"
                >
                    <view class="line-clamp1 font-28 flex-1">
                        <text class="text-fff font-24 p-1 mr-1" style="background-color: #dd4a68" v-if="item.currentFlag">当前</text>
                        <text class=" ">{{ item.tradeExplain }}</text>
                    </view>
                    <view class="text-right" style="flex-basis: 30%;">
                        <text class="text-999 font-28 ml-3 mr-1">
							{{ item.mode == 'INCOME' ? '+' : '-' }}{{ (item.amount||0) | priceFilter }}
						</text>
                        <text class="text-999">{{ item.currentFlag ? '' : '&gt;' }}</text>
                    </view>
                </view>
                <view class="text-center mt-2 p-2 bg-fff font-30" @click="show=false">取消</view>
            </view>
        </u-popup>
    </view>
</template>

<script>
import { billDetail } from '@/api/ModulesUser'
export default {
	components: {},
    data() {
        return {
			billId: null,	//当前账单的ID 存储一份用于empty重新加载
            list: null,
            show: false,
			paging: {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false // 是否显示列表为空时的样式
			},
        }
    },
    filters: {},
	computed: { },
    onLoad(options) {
		this.billId = options.id
        this.getBillInfo(options.id)
    },
    onShow() {},
    mounted() {},

    methods: {
        //  获取账单列表
        getBillInfo(id, currentFlag = false) {
            if (currentFlag) return;
			this.paging = {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false // 是否显示列表为空时的样式
			};
			!id && (id = this.billId);
            billDetail
                .getBillInfo(id)
                .then((res) => {
					if(res.code) {
						this.list = res.data
						this.show = false
					}
                })
                .catch((err) => {
                    console.log(err)
					this.paging.error = true;
                })
				.finally(() => {
					this.paging.status = 'noMore'
					!this.list && (this.paging.emptylist = true);
				})
        },
    }
}
</script>
<style lang='scss' scoped>
.bill {
	.bill-top {
		/* height: 250rpx; */
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
