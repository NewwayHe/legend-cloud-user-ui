<!-- 退款/货列表 -->
<template>
	<view :style="{ '--themescolor': themes.color }">
		<!-- 头部下拉列表 -->
		<head-dropdown :list="listDropdown" :state="parmas.applyType" @change="changeList"></head-dropdown>

		<!-- 顶部tab栏 -->
		<ls-tabs className="w-100" :current="current" :list="orderRefundStatusValues" :zIndex="98" fixed @change="switchType" />

		<view class="safearea-bb border-top-20bg order-list">
			<ls-load-more :status="paging.status" v-if="!paging.emptylist">
				<block v-for="order in list" :key="order.id">
					<view class="font-28 p-2 border-bottom-20bg order-item position-relative overflow-h">
						<ls-signet top="-30" right="-15" type="2" size="140" space="25" rotate="-25" borderWidth="5">{{refundStatusFilter(order)}}</ls-signet>
						<view class="mb-4">
							<text class="text-999">售后编号：{{ order.refundSn }}</text>
						</view>
						<view class="d-flex mb-2 border-bottom pb-4">
							<view class="mr-2">
								<view style="width: 160rpx; height: 160rpx"><ls-image :src="order.productImage" :options="{ w: '100%', h: '100%', br: '20' }" /></view>
							</view>
							<view class="d-flex flex-column j-sa">
								<view class="line-clamp3">
									<text>{{ order.productName }}</text>
								</view>
								<view>
									<text class="text-999">{{ order.productAttribute }}</text>
								</view>
							</view>
						</view>
						<view class="d-flex flex-end">
							<view
								@click="cancelService(order)"
								v-if="isShowCancelRefund(order)"
								class="rounded-50 d-block pt-1 pb-1 pl-3 pr-3 mr-2 border border-e4"
								style="line-height: 36rpx"
							>
								取消售后
							</view>
							<view
								class="rounded-50 border border-main text-main d-block pt-1 pb-1 pl-3 pr-3 mr-2"
								style="line-height: 36rpx"
								@click="$navigateTo(`/ModuleOrder/service/serviceDetail?refundId=${order.id}`)"
							>
								查看售后
							</view>
						</view>
					</view>
				</block>
			</ls-load-more>
			<ls-empty className="center-xy" :title="'暂无售后订单'" :paging="paging" @reLoad="getData" reLoad/>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import headDropdown  from '@/components/ls-app/ls-header/head-dropdown.vue'
import lsSignet from '@/components/ls-app/ls-signet/ls-signet.vue'
import pageUtil from '@/utils/pageUtils.js';
import { refundApi, orderApi } from '@/api/ModulesOrder';
const listPage = new pageUtil(refundApi.refundPage);

export default {
	components: {'head-dropdown':headDropdown,'ls-signet':lsSignet},
	data() {
		return {
			current: 0, // 默认选中tab的下标
			orderRefundStatusObj: {
				'0': '全部',
				'1': '处理中',
				'2': '已完成/已结束'
			},
			parmas: {
				applyType: '', //’'':全部,1:退款,2:退款且退货
				orderRefundStatus: 0 ,// 0:默认,1:在处理,2:处理完成
			},
			paging: {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false // 是否显示列表为空时的样式
			},
			list: [],
			listDropdown: [
				{
					name: '全部',
					value: '',
				},
				{
					name: '退款列表',
					value: '1',
				},
				{
					name: '退货列表',
					value: '2',
				}
			],
		};
	},
	computed: {
		...mapState(['timeDiff', 'stausBarHeight', 'wxMenuBut']),
		//备注：如果直接在HTML上用Object.values(statusObj)的话(该过程会导致list连续变化，ls-tabs会连续执行多次init()方法，导致ls-tabs会定位不准确)
		orderRefundStatusValues() {
			return Object.values(this.orderRefundStatusObj);
		},
		orderRefundStatusKeys() {
			return Object.keys(this.orderRefundStatusObj);
		},
		// 是否显示 取消售后按钮
		isShowCancelRefund() {
			// 这里需要重新写。。。
			return (order) => {
				return order.applyStatus != -1 && 
					order.applyStatus != 3 && 
					order.applyStatus != 2 && 
					order.applyStatus != -3 && 
					order.applyStatus != -2 &&
					order.handleSuccessStatus == 0 &&
					!(order.applyStatus != 3 && (order.applyStatus == -3 || order.sellerStatus == -1))
			}
		}
	},
	onLoad(options) {
		if (options.status) {
			this.current = this.orderRefundStatusKeys.findIndex(key => key == option.status) || 0;
			this.parmas.orderRefundStatus = options.status;
		}
		this.getData();
	},
	onReachBottom() {
		listPage.loadListByPageMore();
	},
	methods: {
		getData(){
			listPage.loadListByPage(this, this.parmas);
		},
		// 选择下拉列表
		changeList(index) {
			this.parmas.applyType = this.listDropdown[index].value;
			this.getData();
		},
		refundStatusFilter(order){
			// 这里的逻辑从serviceDetail搬运
			const { applyStatus, applyType, sellerStatus, goodsStatus } = order;
			// applyType=3是商家主动申请取消订单，状态需单独判断
			console.log(111,applyType,goodsStatus);
			if(applyType == 3) {
				if (applyStatus == 2) {
					return '处理中';
				}
				if (applyStatus == 3) {
					return '已通过';
				}
				if (goodsStatus == -4||applyStatus == -4) {
					return '已拒绝';
				}
				if (goodsStatus == -1||applyStatus == -1 || applyStatus == -2) {
					return '已取消';
				}
			}else {
				if (applyStatus == -3 || sellerStatus == -1) {
					return '已拒绝';
				}
				if (applyStatus == -1 || applyStatus == -2) {
					return '已取消';
				}
				if (applyStatus == 1 && sellerStatus == 0) {
					return '处理中';
				}
				if (goodsStatus == 1 && sellerStatus == 1) {
					return '处理中';
				}
				if (applyStatus == 2) {
					return '处理中';
				}
				if (applyStatus == 3) {
					return '已完成';
				}
				if ((goodsStatus == 3 && sellerStatus == 1) || (goodsStatus == 5 && sellerStatus == 1)) {
					return '处理中';
				}
			}
			return '-'
		},
		// 取消售后
		cancelService(refundItem) {
			orderApi.refundCancelApply({ refundSn: refundItem.refundSn }).then(res => {
				if (res.code) {
					uni.showToast({
						title: '取消成功',
						icon: 'none',
						mask: true,
						complete: () => {
							this.getData();
						}
					});
				}
			});
		},

		// 切换tabs`
		switchType(item) {
			this.current = item.index;
			this.parmas.orderRefundStatus = this.orderRefundStatusKeys[this.current];
			this.getData();
		}
	}
};
</script>

<style lang="scss" scoped>
.order-item {
	&:last-child {
		border-bottom: 0 !important;
	}
}
</style>
