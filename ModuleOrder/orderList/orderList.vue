<template>
	<view :style="{ '--themescolor': themes.color,'--gradientcolor':themes.rgb06 }">
		<ls-header>
			<view class="d-flex flex-1 text-333 zindex-99">
				<view class="flex-1 flex-start pl-2 pr-1 mr-2 bg-bg rounded-50 h-56r" v-show="isShow">
					<ls-popover ref="popover" @change="changePopover">
						<text class="mr-1 font-24">{{ popoverOptions[selectKey] }}</text>
						<text
							class="iconfont icon-caret-bottom text-999 d-inline-block transition-all05 mr-2"
							style="font-size: 20rpx;"
							:style="{ transform: `rotate(${!showSelect ? 0 : 180}deg)` }"
						></text>
						<view class="p-2" slot="content">
							<view
								class="h-60r flex-center"
								:class="[{ 'text-main': selectKey == key }]"
								@click="changeSelect(key, val)"
								v-for="(val, key, index) in popoverOptions"
								:key="index"
							>
								<text>{{ val }}</text>
							</view>
						</view>
					</ls-popover>
					<!-- H5端不支持type动态切换，如 :type="selectKey=='receiverMobile'?'number':'text'" -->
					<input
						class="flex-1 font-28 text-bbb"
						v-model="params[selectKey]"
						:placeholder="`请输入${popoverOptions[selectKey]}`"
						confirm-type="search"
						placeholder-style="color:#bbbbbb; font-size:24rpx;"
						@confirm="getData"
						:maxlength="selectKey == 'receiverMobile' ? 11 : 30"
						v-if="selectKey == key"
						v-for="(val, key, index) in popoverOptions"
						:key="key"
					/>
					<view class="w-60r h-60r flex-center" @click.stop="params[selectKey] = ''" v-if="params[selectKey]">
						<view class="iconfont icon-close text-ccc" style="font-size: 36rpx;"></view>
					</view>
				</view>
				<view class="flex-1 text-center font-32" @click="changeShowList" v-show="!isShow">
					<text class="mr-2">{{ orderTypeObj[params.orderType] }}</text>
					<text
						class="iconfont icon-caret-bottom d-inline-block transition-all05"
						style="font-size: 20rpx;"
						:style="{ transform: `rotate(${!showList ? 0 : 180}deg)` }"
					></text>
				</view>
			</view>
			<view slot="right" class="font-32 flex-center h-88r pr-2" @click="clickSearch">
				<text class="iconfont icon-sousuo" style="font-size: 28rpx;"></text>
			</view>
		</ls-header>

		<!-- start头部下拉列表 -->
		<!-- 这个是遮罩层 -->
		<view class="position-fixed top-0 bottom-0 left-0 right-0 h-100vh w-100vw" style="background: rgba(0,0,0,0.5);z-index: 108;" @click.stop="changeShowList" v-if="showList"></view>
		<view
			class="position-fixed w-100 font-24 transition-all05 bg-white overflow-h zindex-109 pl-4 pr-2 py-3"
			style="border-bottom-right-radius: 24rpx;border-bottom-left-radius: 24rpx;"
			:style="{ top: `calc(88rpx + ${stausBarHeight}px)`, transform: `translateY(${showList ? 0 : '-100%'})`, 'transform-origin': '0% 0%' }"
		>
			<view class="d-inline-block w-33 pr-2 pb-2" v-for="(val, key, index) in orderTypeObj" :key="index" @click="changeList(key)">
				<view
					class="rounded-100 bg-f5 flex-center w-100 h-60r"
					:class="{ 'text-main border border-main': params.orderType == key }"
				>
					<text>{{ val }}</text>
				</view>
			</view>
		</view>
		<!-- end头部下拉列表 -->

		<!-- 顶部tab栏 -->
		<ls-tabs :current="current" :list="statusValues" fixed @change="switchType" :zIndex="98" :key="params.orderType+'1'"/>

		<!-- 内容区域 -->
		<view class="safearea-bb mt-2">
			<ls-load-more :status="paging.status" v-if="!paging.emptylist">
				<block v-for="(order, orderIndex) in list" :key="orderIndex">
					<view class="bg-fff mb-2 py-2 overflow-h">
						<view class="d-flex p-2 font-28">
							<!-- 店铺信息 -->
							<view class="flex-1 position-relative mr-2 flex-start" @click="$navigateTo(`/ModuleGoods/shopHome/shopIndex?shopId=${order.shopId}`)">
								<view class="flex-center mr-1" :class="[order.orderType=='O'?'text-333':'text-white l-gradient-lb rounded-5']" style="width: 36rpx; height: 36rpx">
									<text class="iconfont icon-dianpu" style="font-size: 28rpx;" v-if="order.orderType=='O'"></text>
									<text class="font-20" v-else>{{ guideOrderType(order.orderType) }}</text>
								</view>

								<text class="line-clamp1" style="width: auto; max-width: 5.3rem">{{ order.shopName ? order.shopName : '&nbsp;' }}</text>
								<text class="iconfont icon-ArrowRight text-bbb" style="font-size: 28rpx;"></text>
								<!-- 退款状态 未退款（0）、退货退款处理中（1）、已完成（2） -->
								<view class="ml-2" style="color: #f56c6c" v-if="order.refundStatus">{{order.refundStatus==1?'售后处理中':order.refundStatus==1?'退款完成':''}}</view>
							</view>

							<view class="text-right flex-start position-relative">
								<template v-if="order.status == 20 || order.status == -5">
									<ls-signet top="-80" right="40" type="2" size="140" space="25" color="#E4E4E4" rotate="-25" borderWidth="5">
										{{ order.status == 20?'已完成':'已取消' }}
									</ls-signet>
								</template>
								<template v-else>
									<view class="d-inline-block v-top font-28 text-main font-weight-600">
										{{ order.status | getOrderStatus(order.orderType) }}
									</view>
								</template>
								<text class="iconfont icon-delete ml-1 v-middle" @click="deleteOrder(order.id)" v-if="order.status == 25 || order.status == 20"></text>
							</view>
						</view>

						<!-- 商品内容 -->
						<view :class="[order.orderItemDTOList.length == 1 && order.orderNumber?'flex-start':'position-relative']">
							<!-- 只有一件商品时 -->
							<template v-if="order.orderItemDTOList.length == 1 && order.orderNumber">
								<view
									class="flex-start p-2 overflow-x flex-1"
									v-for="(item, subItemIndex) in order.orderItemDTOList"
									:key="subItemIndex"
									@click="goOrderDetail(order.id, orderIndex)"
								>
									<ls-image className="mr-2" :options="{ w: '160', h: '160', br: '20',bg:'#ffffff' }" :src="item.pic" />
									<view class="overflow-h font-28 flex-1 flex-col-start overflow-h" style="height: 160rpx">
										<view class="line-clamp2" style="max-height: 72rpx; line-height: 36rpx">{{ item.productName ? item.productName : '&nbsp;' }}</view>
										<view class="text-999 mt-1 font-24 line-clamp1" style="height: 28rpx; line-height: 28rpx" v-if="item.attribute">
											{{ item.attribute }}
										</view>
										<view class="text-main font-24 mt-1 overflow-x-scroll text-nowrap w-100" v-if="order.status == 1">
											剩余可支付时间：
											<count-down className="d-inline-block" v-slot="{ times }" :time="order.finalPayTime" :custom="true" @finish="countDownTimeFinish()">
												<!-- 解决小程序中插槽内容不加载：添加占位标签&&延迟修改渲染内容 -->
												<!-- #ifdef MP -->
												<view class="w-0 h-0">{{ slotPlace }}</view>
												<!-- #endif -->
												<text v-if="times.days > 0">{{ times.days }}天</text>
												<text v-if="times.hours > 0">{{ times.hours }}时</text>
												<text>{{ times.minutes }}分</text>
												<text>{{ times.seconds }}秒</text>
											</count-down>
										</view>
										<!-- status == 2是拼团(order.orderType == 'MG')专用 -->
										<view class="text-main font-24 mt-1 overflow-x-scroll text-nowrap w-100" v-if="order.status == 2&&order.activityDetailDTO&&order.activityDetailDTO.expirationTimestamp">
											剩余成团时间：
											<count-down className="d-inline-block" v-slot="{ times }" :time="order.activityDetailDTO.expirationTimestamp + 1000" :custom="true" @finish="countDownTimeFinish(order)">
												<!-- 解决小程序中插槽内容不加载：添加占位标签&&延迟修改渲染内容 -->
												<!-- #ifdef MP -->
												<view class="w-0 h-0">{{ slotPlace }}</view>
												<!-- #endif -->
												<text v-if="times.days > 0">{{ times.days }}天</text>
												<text v-if="times.hours > 0">{{ times.hours }}时</text>
												<text>{{ times.minutes }}分</text>
												<text>{{ times.seconds }}秒</text>
											</count-down>
										</view>
									</view>
								</view>
							</template>
							
							<!-- 多件商品时 -->
							<template v-else>
								<view class="d-flex a-center py-2 pl-2 " @click="goOrderDetail(order.id, orderIndex)">
									<scroll-view style="width: 95%" scroll-x="true">
										<view class="d-flex">
											<ls-image
												:customStyle="{flex: '0 0 160rpx'}"
												v-for="item in order.orderItemDTOList"
												className="mr-1"
												:options="{ w: '160', h: '160', br: '20' }"
												:src="item.pic"
											/>
										</view>
									</scroll-view>
								</view>
							</template>
							<view
								class="h-200r flex-col-end p-2 font-28"
								style="background-image: linear-gradient(to right, rgba(255,255,255,0.95), rgba(255,255,255,0.95));"
								:class="[order.orderItemDTOList.length == 1 && order.orderNumber?'':'position-absolute right-0 top-0 l-gradient-b']"
							>	
								<ls-price notThemes :price="order.actualTotalPrice" :options="{ is: 32,ds:32 }" />
								<view class="font-24 mt-2 text-999" v-if="order.productQuantity">共{{ order.productQuantity }}件</view>
							</view>
						</view>


						<!-- 结算 -->
						<view>
							<!-- //预售订单(暂不显示) -->
							<view class="font-24 p-2 d-flex" style="line-height: 48rpx" v-if="false">
								<view class="left" :class="order.isPayDeposit == 0 ? 'text-main' : 'text-999'">
									<text :class="order.isPayDeposit == 0 ? 'theme-circle-num' : 'circle-num'">1</text>
									定&nbsp;金
								</view>

								<view class="right flex-1 text-right">
									<text class="mr-2 d-inline-block v-top" v-if="true">(已过期)</text>
									<text class="mr-2 d-inline-block v-top" v-if="false">(已付款)</text>
									<text class="mr-2 d-inline-block v-top" v-if="false">(待付款)</text>
									<view class="mr-2 d-inline-block v-top">
										小计：
										<view class="price font-24" style="height: 32rpx; line-height: 32rpx">
											<ls-price :notThemes="order.isPayDeposit == 0 ? false : true" :price="order.preDepositPrice" :options="{ is: 32 }" />
										</view>
									</view>
								</view>
							</view>

							<!-- //运费 -->
							<view class="font-24 p-2 d-flex" style="line-height: 48rpx" v-if="false">
								<view class="left" :class="order.freightAmount ? 'text-main' : 'text-999'">
									<text :class="order.freightAmount ? 'theme-circle-num' : 'circle-num'">2</text>
									运&nbsp;费
								</view>
								<view class="right flex-1 text-right">
									<view class="mr-2 d-inline-block v-top">
										<view class="font-24">
											<ls-price :notThemes="order.freightAmount ? false : true" :price="order.freightAmount" :options="{ is: 32 }" />
										</view>
									</view>
								</view>
							</view>

							<!-- 暂不显示 -->
							<view class="font-24 p-2 d-flex" style="line-height: 48rpx" v-if="false">
								<view class="left" :class="order.isPayDeposit == 1 && order.isPayFinal == 0 ? 'text-main' : 'text-999'">
									<text :class="order.isPayDeposit == 1 && order.isPayFinal == 0 ? 'theme-circle-num' : 'circle-num'">3</text>
									尾&nbsp;款
								</view>
								<view class="right flex-1 text-right">
									<text class="" v-if="order.isPayDeposit == 1 && order.isPayFinal == 0">(待付款)</text>
									<view class="mr-2 d-inline-block v-top">
										小计：
										<view class="price font-24">
											<ls-price
												:notThemes="order.isPayDeposit == 1 && order.isPayFinal == 0 ? false : true"
												:price="order.finalPrice"
												:options="{ is: 32 }"
											/>
										</view>
									</view>
								</view>
							</view>
						</view>
						<orderOperation :order="order" :columns="columns" @orderOperaChange="getData"></orderOperation>
					</view>
				</block>
			</ls-load-more>
		</view>

		<!-- 取消订单弹窗 -->
		<u-popup v-model="showCancel" mode="center" border-radius="14" width="80%">
			<view class="p-4 font-24 w-100">
				<view class="flex-center font-32 font-weight mb-4">取消订单</view>
				<view class="font-24 text-center text-999 mb-4">取消订单后，无法恢复。确定取消？</view>
				<view class="flex-around">
					<view class="px-8 py-15r border rounded-10" @click="showCancel = false">再想想</view>
					<view class="bg-main border border-main px-8 py-15r rounded-10 text-fff" @click="cancelOrder()">坚持取消</view>
				</view>
			</view>
		</u-popup>

		<!-- 售后弹窗 -->
		<u-popup v-model="showRefund" mode="center" border-radius="14" width="80%">
			<view class="p-4 font-24 w-100">
				<view class="flex-center font-32 font-weight mb-4">申请退款</view>
				<view class="d-flex mb-4 a-center">
					<text class="mr-2 flex-1">退款金额：</text>
					<view class="flex-2"><ls-price :price="activeOrderItem.actualTotalPrice" :options="{ is: 32 }" /></view>
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
					<view class="border p-1 flex-2"><input type="text" class="font-24" v-model="refundReason" placeholder="请输入退款说明" /></view>
				</view>
				<view class="flex-around">
					<view class="px-8 py-15r border rounded-10" @click="showRefund = false">取消</view>
					<view class="bg-main border border-main px-8 py-15r rounded-10 text-fff" @click="submitRefund">确定</view>
				</view>
			</view>
		</u-popup>
		<ls-empty className="center-xy" :title="'您没有相关订单'" :paging="paging" @reLoad="getData" reLoad/>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import pageUtil from '@/utils/pageUtils.js';
import orderOperation from './components/orderOperation.vue';

import { orderApi,refundApi } from '@/api/ModulesOrder';
import countDown from '@/components/common/countdown/count-down.vue';
const listPage = new pageUtil(orderApi.orderPage);

export default {
	components: {
		'count-down':countDown,
		orderOperation
	},
	data() {
		return {
			current: 0, // 默认选中tab的下标
			orderTypeObj: {
				'': '全部订单',
				O: '普通订单',
				P: '预售订单',
				// S: '秒杀订单',
				// G: '团购订单',
				// MG: '拼团订单',
				// I: '积分订单',
				// SM: '门店自提订单',
			},
			columns: ['我不想买了', '信息填写错误，重新拍', '卖家缺货', '其他原因'],
			columsIndex: '',
			params: {
				pageSize: 6,
				status: '', // 订单状态 全部（0）、待付款（1）、待成团（2）、待发货（5）、待签收（10）、待收货（15）、已完成（20）、已取消（-5）
				orderType: '', // 订单类型 ['':'全部订单',O:普通订单,P:预售订单,S:秒杀订单,G:团购订单,MG:拼团订单,I:积分订单]
				productName: '', // 商品名称
				orderNumber: '', // 订单编号
				shipmentNumber: '', // 物流单号
				shopName: '', // 商家名称
			},
			list: [], // 列表数据
			paging: {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false // 是否显示列表为空时的样式
			},

			refundReason: '', // 退货原因
			activeOrderItem: {}, // 进行操作的订单
			isShow: false,
			showList: false,
			showCancel: false,
			showRefund: false,
			timer: null,
			slotPlace: '',
			popoverOptions: { productName: '商品名称', orderNumber: '订单编号', shipmentNumber: '物流单号', shopName: '商家名称' },
			selectKey: 'productName',
			showSelect: false,
		};
	},
	filters: {
		getOrderStatus(status, orderType) {
		    const orderStatusDict = {
		        1: '待付款',
		        2: '待成团',
		        3: '已付定金',
		        5: '待发货',
		        10: '待签收',
		        15: '待收货',
		        20: '已完成',
		        [-5]: '已取消',
		    };
		    return orderStatusDict[status] || '-'
		},
	},
	computed: {
		...mapState(['stausBarHeight']),
		statusObj() {
			let obj = {};
			// 如果是拼团或团购订单(增加一个'2':'待成团')
			// if (this.params.orderType == 'G' || this.params.orderType == 'MG') {
			// 	obj = { '0': '全部', '1': '待付款', '2': '待成团', '5': '待发货', '10': '待签收', '15': '待收货', '20': '已完成', '-5': '已取消' };
			// // 如果是预售订单
			// } else 
			if(this.params.orderType == 'P') {
				obj = { '0': '全部', '1': '待付款', '3': '已付定金', '5': '待发货', '10': '待签收', '15': '待收货', '20': '已完成', '-5': '已取消' };
			// 如果是自提订单
			// } else if(this.params.orderType == 'SM'){
			// 	obj = { '0': '全部', '1': '待付款', '5': '待备货', '15': '待核销', '20': '已完成', '-5': '已取消' };
			// // 如果是全部
			// } else if(!this.params.orderType){
			// 	obj = { '0': '全部', '1': '待付款', '5': '待发/备货', '10': '待签收', '15': '待收货/核销', '20': '已完成', '-5': '已取消' };
			} else {
				obj = { '0': '全部', '1': '待付款', '5': '待发货', '10': '待签收', '15': '待收货', '20': '已完成', '-5': '已取消' };
			}
			return obj;
		},
		
		// 备注：如果直接在HTML上用Object.values(statusObj)的话(该过程会导致list连续变化，ls-tabs会连续执行多次init()方法，导致ls-tabs会定位不准确)
		statusValues() {
			return Object.values(this.statusObj);
		},
		statusKeys() {
			return Object.keys(this.statusObj);
		},
		// 区分orderType
		guideOrderType() {
			const typeMap = {
				'P': '预',
				'G': '团',
				'S': '秒',
				'MG': '拼',
				'I': '积',
				'SM': '提'
			}
			return (orderType) => {
				return typeMap[orderType] || ''
			}
		},
	},
	onLoad(option) {
		this.$data['option'] = option;
		if (isNaN(parseInt(option.status))) {
			this.params.status = 0;
		} else {
			this.params.status = option.status;
			this.current = this.statusKeys.findIndex(key => key == option.status) || 0;
		}
		// #ifdef MP
		clearTimeout(this.timer)
		this.timer = setTimeout(() => {
			this.slotPlace = '     '
		}, 500)
		// #endif
	},
	mounted() {
		refundApi.cancelReason().then(res => {
			if(res.code && res.data.length){
				this.columns = res.data.map(v => { return v })
			}
		})
	},
	onShow() {
		if (this.$u.test.isEmpty(this.list)) {
			this.getData();
		}
	},
	onReachBottom() {
		listPage.loadListByPageMore();
	},
	// 下拉刷新
	onPullDownRefresh() {
		this.getData();
	},
	methods: {
		getData(){
			listPage.loadListByPage(this, this.params);
		},
		// 选择orderType订单类型
		changeList(key) {
			this.params.status = 0; // 重置ls-tabs的下划线
			this.current = 0; // 重置ls-tabs的下划线
			this.params.orderType = key;
			this.changeShowList();
			this.getData();
		},

		// 显示下拉框
		changeShowList() {
			this.showList = !this.showList;
		},

		// 点击右上角的搜索按钮
		clickSearch() {
			// 如果搜索框是正在打开状态，则点击搜索按钮进行搜索
			if (this.isShow) {
				this.getData();
			}
			this.isShow = !this.isShow;
		},

		goOrderDetail(orderId, orderIndex) {
			// 注意:由于APP端,直接用orderId,点击tab栏切换时，orderId拿到的是上一个list里的orderId(具体原因不明)，所以只能用index来取值
			uni.navigateTo({
				url: `/ModuleOrder/orderList/orderDetail?orderId=${this.list[orderIndex].id}`
			});
		},

		// 切换tabs
		switchType(item) {
			this.current = item.index;
			this.params.status = this.statusKeys[item.index];
			listPage.loadListByPage(this, this.params, {
				complete: () => {
					this.$forceUpdate();
				}
			});
		},

		// 取消订单
		cancelOrder() {
			orderApi
				.cancelOrder({
					orderNumber: this.activeOrderItem.orderNumber
				})
				.then(res => {
					if (res.code == 1) {
						uni.showToast({
							title: '取消订单成功',
							icon: 'none',
							mask: true,
							complete: () => {
								this.showCancel = false;
								setTimeout(() => {
									this.getData();
								}, 1000);
							}
						});
					}
				});
		},
		// 删除订单
		deleteOrder(orderId) {
			uni.showModal({
				title: '删除订单',
				content: '你确认是否删除该订单',
				success: res => {
					if (res.confirm) {
						orderApi.removeOrder(orderId).then(res => {
							if (res.code == 1) {
								uni.showToast({
									title: '删除订单成功',
									icon: 'none',
									mask: true,
									complete: () => {
										setTimeout(() => {
											this.getData();
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
								this.getData();
							}, 1000);
						}
					});
				})
				.catch(err => {
					console.log('refund err', err);
				});
		},

		// 倒计时结束回调函数
		countDownTimeFinish(order) {
			this.getData();
		},

		// 选择退货原因
		changeReason(e) {
			this.columsIndex = e.target.value;
		},
		
		changeSelect(key, val) {
			// console.log(key, val);
			this.selectKey = key;
			for (const key1 in this.popoverOptions) {
				if (key1 != key) {
					this.params[key1] = '';
				}
			}
			this.$refs.popover.change();
		},
		
		changePopover(flag) {
			this.showSelect = flag;
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
/* start 这段是修改预售、秒杀订单用 */
.circle-num {
	display: inline-block;
	width: 12px;
	height: 12px;
	line-height: 12px;
	font-size: 12px;
	border: 1px solid #999;
	border-radius: 50%;
	color: #999;
	margin-right: 5px;
	vertical-align: top;
	margin-top: 6px;
	text-align: center;
	font-family: arial;
}

.theme-circle-num {
	display: inline-block;
	width: 12px;
	height: 12px;
	line-height: 12px;
	font-size: 12px;
	border: 1px solid var(--themescolor);
	border-radius: 50%;
	color: var(--themescolor);
	margin-right: 5px;
	vertical-align: top;
	margin-top: 6px;
	text-align: center;
	font-family: arial;
}
/* end 这段是修改预售、秒杀订单用 */
</style>
