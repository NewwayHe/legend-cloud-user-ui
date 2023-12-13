<template>
	<!-- text-nowrap为了解决申请退款在ios机型上出现文字不换行掉下来的问题，如果引出其他问题需要单独在下面的代码中给申请退款添加text-nowrap -->
	<view class="text-nowrap" :style="{ '--themescolor': themes.color }">
		<!-- 待付款 -->
		<view class="flex-end p-2" v-if="order.status == 1">
			<view class="w-160r h-60r flex-center border border-e4 rounded-100 mr-1"><picker @change="onConfirm($event, order.orderNumber)" :value="0" :range="columns">取消订单</picker></view>
			<view class="w-160r h-60r flex-center rounded-50 border border-main text-main" @click="buyNow(order)">立即付款</view>
		</view>
		<!-- 已付定金 (order.orderType == 'P')专用-->
		<view class="flex-end p-2" v-if="order.status == 3">
			<!-- 滚动通知 -->
			<view class="flex-1 overflow-h">
				<u-notice-bar bg-color="#ffffff" :list="[`尾款支付时间：${order.preSellOrderBO.finalMStart} 至 ${order.preSellOrderBO.finalMEnd}`]"></u-notice-bar>
			</view>
			<view class="w-160r h-60r flex-center border border-e4 rounded-50 mr-2 pointer-none text-999" v-if="order.payPctType == 1 && order.preSellOrderBO.finalMEnds <= currentTime">已过期</view>
			<view
				class="w-160r h-60r flex-center border rounded-50"
				:class="order.preSellOrderBO.finalMStarts < currentTime && currentTime < order.preSellOrderBO.finalMEnds ? 'border-main text-main' : 'border-e4 but-pe-none'"
				@click="buyNow(order)"
			>
				付尾款
			</view>
		</view>

		<!-- 待发货(order.status == 4已支付尾款的也是待发货状态，orderType=='I'时积分订单不应该有售后) -->
		<view class="flex-end p-2" v-if="order.status == 5&&order.orderType != 'I'">
			<view v-if="order.refundStatus == 1">
				<text style="color: #f56c6c">售后处理中</text>
			</view>

			<view class="flex-end flex-1">
				<ls-popover :boxShadow="boxShadow" ref="popover" position="top">
					<view class="px-2 py-1" slot="content">
						<!-- text-nowrap为了解决申请退款在ios机型上出现文字不换行掉下来的问题 -->
						<!-- 目前加在了最外层的view，如果有其他问题需要单独添加 -->
						<view v-if="!order.refundStatus" class="py-1" @click="refundOrder(order)">申请退款</view>
						<view
							v-else
							class="py-1"
							@click="$navigateTo(`/ModuleOrder/service/serviceDetail?refundId=${order.orderItemDTOList[0].refundId || order.refundId}`)"
						>
							查看售后
						</view>
					</view>
					<text class="iconfont icon-caidan1 text-999 px-3" style="font-size: 46rpx;"></text>
				</ls-popover>

				<view
					class="w-160r h-60r flex-center rounded-50 mr-2 border border-e4"
					@click="remindDelivery(order.shopId, order.orderNumber)"
					v-if="!order.refundStatus"
				>
					提醒{{ order.orderType == 'SM' ? '备货' : '发货' }}
				</view>
				<view class="w-160r h-60r flex-center rounded-50 border border-main text-main" @click="goBuy(order.orderNumber)">再来一单</view>
			</view>
		</view>

		<!-- 待签收 -->
		<view class="flex-end p-2" v-if="order.status == 10||order.status == 15">
			<ls-popover :boxShadow="boxShadow" position="top">
				<view class="px-2 py-1" slot="content">
					<view class="py-1" v-if="!order.refundStatus" @click="$navigateTo(`/ModuleOrder/service/serviceRefund?orderId=${order.id}`)">申请退货</view>
					<view class="py-1" v-else @click="$navigateTo(`/ModuleOrder/service/serviceDetail?refundId=${order.orderItemDTOList[0].refundId || order.refundId}`)">查看售后</view>
				</view>
				<text class="iconfont icon-caidan1 text-999 px-3" style="font-size: 46rpx;"></text>
			</ls-popover>
			
			<template v-if="order.orderType != 'SM'">
				<view class="w-160r h-60r flex-center border border-e4 rounded-50 mr-2"  @click="confirmGoods(order.id)">确认收货</view>
				<view
					class="w-160r h-60r flex-center rounded-50 mr-2 border border-e4"
					@click="$navigateTo(`/ModuleOrder/logistics/logistics?orderNumber=${order.orderNumber}`)"
				>
					查看物流
				</view>
			</template>
			<template v-else>
				<view class="w-160r h-60r flex-center border border-e4 rounded-50 mr-2"  @click="showVoucher(order.orderSinceMention, order.status)">提货凭证</view>
			</template>
			
			<view class="w-160r h-60r flex-center rounded-50 border border-main text-main" @click="goBuy(order.orderNumber)">再来一单</view>
		</view>

		<!-- 已完成 -->
		<view class="flex-end p-2" v-if="order.status == 20">
			<ls-popover :boxShadow="boxShadow" ref="popover" position="top" v-if="currentTime < order.finalReturnDeadlineTimestamp && !order.refundStatus">
				<view class="px-2 py-1" slot="content">
					<view class="py-1" @click="$navigateTo(`/ModuleOrder/service/serviceRefund?orderId=${order.id}`)">申请退货</view>
				</view>
				<text class="iconfont icon-caidan1 text-999 px-3" style="font-size: 46rpx;"></text>
			</ls-popover>
			<view
				v-if="order.commentValidDayInvoice"
				class="w-160r h-60r flex-center border border-e4 rounded-50 mr-2"
				@click="$navigateTo(`/ModuleCenter/evaluate/evaluateInfo?orderNumber=${order.orderNumber}`)"
			>
				评论商品
			</view>
			<view class="w-160r h-60r flex-center rounded-50 border border-main text-main" @click="goBuy(order.orderNumber)">再来一单</view>
		</view>

		<!-- 已取消 -->
		<view class="flex-end p-2" v-if="order.status == -5">
			<view class="w-160r h-60r flex-center rounded-50 border border-main text-main" @click="goBuy(order.orderNumber)">再来一单</view>
		</view>

		<!-- 售后弹窗 -->
		<u-popup v-model="showRefund" mode="center" border-radius="14" width="80%">
			<view class="p-4 font-24 w-100">
				<view class="flex-center font-32 font-weight mb-4">申请退款</view>
				<view class="d-flex mb-4 a-center">
					<text class="mr-2 flex-1">退款金额：</text>
					<view class="flex-2 font-28 text-main">
						<view v-if="activeOrderItem.orderType != 'I' && activeOrderItem.orderType != 'O'">￥{{ activeOrderItem.actualTotalPrice }}</view>
						<view v-else-if="activeOrderItem.orderType == 'O'" class="d-flex">
							<text>￥{{ activeOrderItem.actualTotalPrice }}</text>
							<text v-if="activeOrderItem.totalIntegral">+ {{ activeOrderItem.totalIntegral }} 积分</text>
						</view>
						<view v-else-if="activeOrderItem.orderType == 'I'">{{ activeOrderItem.totalIntegral }} 积分</view>
					</view>
				</view>
				<view class="d-flex mb-4 a-center position-relative">
					<text class="position-absolute" style="color: #f56c6c; left: -3%; top: 50%; transform: translate3d(0, -55%, 0);">*</text>
					<text class="mr-2 flex-1">退款原因：</text>
					<view class="flex-2">
						<picker :value="columsIndex" :range="columns" @change="changeReason">
							<view class="word-breakall" style="white-space: normal;">{{ columns[columsIndex] || '请选择退款原因' }}</view>
						</picker>
					</view>
				</view>
				<view class="d-flex mb-6 a-center">
					<text class="mr-2 flex-1">退款说明：</text>
					<view class="border border-e4 p-1 flex-2"><input type="text" class="font-24" v-model="refundReason" placeholder="请输入退款说明" /></view>
				</view>
				<view class="flex-around">
					<view class="px-8 py-15r border border-ccc rounded-10" @click="showRefund = false">取消</view>
					<view class="bg-main border border-main px-8 py-15r rounded-10 text-fff" @click="submitRefund">确定</view>
				</view>
			</view>
		</u-popup>
		
		<!-- 提货凭证 -->
		<voucherPop v-model="voucherShow" :voucherInfo="voucherInfo" />
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { orderApi } from '@/api/ModulesOrder';

import countDown from '@/components/common/countdown/count-down.vue';
import voucherPop from './voucherPop.vue';

export default {
	components: {
		countDown,
		voucherPop
	},
	props: {
		order: {
			type: [Object, String, Array] //
		},
		columns:{ // 退款原因
			type:[Array],
			default:() => { return [] }
		}

	},
	data() {
		return {
			orderDet: '',
			// columns: ['我不想买了', '信息填写错误，重新拍', '卖家缺货', '其他原因'],
			columsIndex: '',
			params: {
				status: ''
			},
			refundReason: '', // 退货原因
			activeOrderItem: {}, // 进行操作的订单
			showCancel: false,
			showRefund: false,
			boxShadow:'0px 0px 4px 2px rgba(0, 0, 0, 0.05)',
			
			voucherShow: false,	// 提货凭证弹窗
			voucherInfo: {},	// 提货凭证信息
		};
	},
	computed: {
		...mapState(['timeDiff', 'stausBarHeight', 'wxMenuBut']),
		// 当前的时间戳
		currentTime() {
			return new Date().getTime() - this.timeDiff;
		}
	},
	onLoad(option) {
	},
	mounted() {},
	onShow() {},
	onReachBottom() {},
	// 下拉刷新
	onPullDownRefresh() {},
	methods: {
		// 再次购买
		goBuy(orderNumber) {
			orderApi.buyAgain({ orderNumber: orderNumber }).then(res => {
				if (res.code == 1) {
					this.$switchTab('/pages/cart/cart');
				}
			});
		},
		// 立即购买
		buyNow(order) {
			const payParams = {
				orderNumber: encodeURIComponent(JSON.stringify([order.orderNumber])),
				settlementType: order.settlementType
			};
			uni.navigateTo({ url: `/ModuleOrder/submitOrder/payOrder${this.$u.queryParams(payParams)}` });
		},

		// 确认收货
		confirmGoods(orderId) {
			uni.showModal({
				title: '确认收货',
				content: '您确定要收货？请务必要收到货后再执行此操作',
				success: res => {
					if (res.confirm) {
						orderApi.confirmDeliver({ orderId }).then(res => {
							if (res.code == 1) {
								uni.showToast({
									title: '收货成功!',
									icon: 'none',
									mask: true,
									complete: () => {
										setTimeout(() => {
											this.$emit('orderOperaChange');
										}, 1000);
									}
								});
							}
						});
					} else if (res.cancel) {
					}
				}
			});
		},

		// 取消订单
		cancelOrder() {
			orderApi.cancelOrder({ orderNumber: this.activeOrderItem.orderNumber }).then(res => {
				if (res.code == 1) {
					uni.showToast({
						title: '取消订单成功',
						icon: 'none',
						mask: true,
						complete: () => {
							this.showCancel = false;
							setTimeout(() => {
								this.$emit('orderOperaChange');
							}, 1000);
						}
					});
				}
			});
		},

		// 提醒发货
		remindDelivery(shopId, orderNumber) {
			orderApi.remindDelivery({ shopId: shopId, orderNumber: orderNumber }).then(res => {
				if (res.code == 1) {
					uni.showToast({ title: '提醒成功，商家正在尽快处理', icon: 'none' });
				}
			});
		},

		// 待发货 - 申请全额退款
		submitRefund() {
			if (!this.columns[this.columsIndex]) {
				uni.showToast({
					title: '请选择退款原因',
					icon: 'none',
					mask: true
				});
				return;
			}
			orderApi
				.refundApplyOrder({
					orderId: String(this.activeOrderItem.id),
					reason: this.columns[this.columsIndex],
					buyerMessage: this.refundReason
				})
				.then(res => {
					uni.showToast({
						title: '申请退款成功',
						icon: 'none',
						mask: true,
						complete: () => {
							this.showRefund = false;
							setTimeout(() => {
								this.$emit('orderOperaChange');
							}, 1000);
						}
					});
				})
				.catch(err => {
					console.log('refund err', err);
				});
		},

		// 选择退货原因
		changeReason(e) {
			this.columsIndex = e.target.value;
		},

		// 显示退款弹窗
		refundOrder(order) {
			this.$refs.popover.change();
			this.activeOrderItem = order;
			this.refundReason = '';
			this.columsIndex = '';
			this.showRefund = true;
		},
		// 最终确认取消订单
		onConfirm(e, orderNumber) {
			orderApi.cancelOrder({ cancelReason: this.columns[e.target.value], orderNumber: orderNumber }).then(res => {
				if (res.code == 1) {
					uni.showToast({
						title: '取消订单成功',
						icon: 'none',
						mask: true,
						complete: () => {
							this.showCancel = false;
							setTimeout(() => {
								this.$emit('orderOperaChange');
							}, 1000);
						}
					});
				}
			});
		},
		
		// 展示提货凭证
		showVoucher(orderSinceMention, orderStatus) {
			this.voucherShow = true;
			this.voucherInfo = { ...orderSinceMention, orderStatus };
		},
	}
};
</script>

<style>
page {
	background-color: var(--backgroundcolor);
}
</style>
<style scoped>
</style>
