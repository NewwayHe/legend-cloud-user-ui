<template>
    <view class="w750 font-24" :style="{ '--themescolor': themes.color }">
        <!-- /头部 -->
        <ls-header showHeadSelect>
            <view class="flex-around flex-1 pr-5">
                <view class="flex-center flex-1 text-333 font-28 px-8">
                    <view class="flex-1 flex-center"><text>信息详情</text></view>
                </view>
            </view>
        </ls-header>
        <!-- 内容区域 -->
        <view class="p-3">
			<view class="font-40 font-weight-500 text-333 word-breakall" style="line-height: 56rpx;">{{ resData.title }}</view>
			<view class="font-24 text-999 mt-1" v-if="resData.recDate || resData.createTime">
				{{(new Date(((resData.recDate ? resData.recDate : resData.createTime).replace(/\-/g, '/'))).getTime()) | dateformat('YYYY年MM月DD日 HH:mm:ss') }}
			</view>
			<view class="mt-4 font-28">
				<u-parse class="font-28 text-333 word-breakall" :html="resData.content"></u-parse>
			</view>
        </view>
		<!-- 商品区域 -->
		<!-- 有接口时对接 -->
		<view class="px-3" v-if="orderDet && orderDet.orderItemDTOList">
			<view class="d-flex overflow-h bg-f8 rounded-12 overflow-h" @click="goOrderDetail">
				<ls-image :src="orderDet.orderItemDTOList[0].pic" mode="aspectFill" :options="{ w:'180', h:'180', br: '10'}"/>
				<view class="font-28 p-2 flex-1 flex-col-between">
					<text class="line-clamp2">{{ orderDet.orderItemDTOList[0].productName }}</text>
					<view class="font-24">
						查看订单
						<text class="iconfont icon-ArrowRight" style="font-size: 20rpx;"></text>
					</view>
				</view>
			</view>
		</view>
    </view>
</template>

<script>
import { orderApi } from '@/api/ModulesOrder.js';
import { infoLise } from '@/api/ModulesCommon.js'
export default {
    name: '',
    components: {},
    data() {
        return {
            resData: [], // 详情
			orderDet: {}, // 商品订单详情
        }
    },
    computed: { },
    watch: {},
    onLoad(options) {
        this.getlist(options)
    },
    onShow() {},
    created() {
    },
    methods: {
        getlist(options) {
            if (options.pubId) {
                infoLise.getInfoDetail({ pubId: options.pubId }).then((res) => {
                    this.resData = res.data
                })
            } else if (options.msgId) {
                infoLise.getSystemInfoDetail({ msgId: options.msgId }).then((res) => {
                    this.resData = res.data
                })
            }
        },
		// 获取商品订单详情数据
		getorderDet(orderId) {
			orderApi.orderDetail({ orderId: orderId }).then(res => {
				if (res.code) {
					this.orderDet = res.data;
				}
			})
		},
		// 跳转到商品详情
		toGoodsDetail(productId) {
			this.$navigateTo(`/ModuleGoods/goodsDetail/goodsDetail?id=${productId}`)
		},
		// 跳到订单详情
		goOrderDetail() {
			this.$navigateTo(`/ModuleOrder/orderList/orderDetail?orderId=${this.resData.detailId}`)
		}
    }
}
</script>

<style lang="scss" scoped>
</style>
