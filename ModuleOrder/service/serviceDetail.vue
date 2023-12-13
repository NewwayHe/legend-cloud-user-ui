<template>
	<view :style="{ '--themescolor': themes.color }">
		<ls-header showHeadSelect title="查看售后"></ls-header>
		<view :style="{ 'padding-bottom': bottomBarHeight * 2 + 'rpx' }" v-if="!$u.test.isEmpty(refundData)">
			<!-- 退货倒计时 -->
			<view class="font-24 px-2 border-bottom-20bg py-2 text-wrap" v-if="showRefundCD(refundData)">
				需要在
				<count-down className="d-inline-block" v-slot="{ times }" :time="refundData.autoCancelRefundTime" theme :custom="true" @finish="getServiceDetail">
					<text v-if="times.days > 0">{{ times.days }}天</text>
					<text v-if="times.hours > 0">{{ times.hours }}时</text>
					<text>{{ times.minutes }}分</text>
					<text>{{ times.seconds }}秒</text>
				</count-down>
				内寄回商品，如逾期未处理，售后单将自动取消
			</view>
			
			
			<view class="d-flex a-center border-bottom-20bg font-28">
				<view class="flex-1 text-333 font-weight text-center p-2">
					<text class="iconfont icon-yucunkuan text-main mr-1"></text>
					<text>{{ refundData.applyType | getApplyType }}</text>
				</view>
				<view class="flex-1 text-main text-center p-2">
					<text>{{ refundData | getApplyStatus }}</text>
				</view>
			</view>
			
			<view class="py-3 px-2 font-28 border-bottom" v-if="logisticsInfo.ftime">
				<view class="d-flex" @click.native="$navigateTo(`/ModuleOrder/logistics/logistics?refundReturnLogisticsDTO=${encodeURIComponent(JSON.stringify(refundData.refundReturnLogisticsDTO))}`)">
					<text class="iconfont icon-motuoche text-main" style="font-size: 36rpx;"></text>
					<view class="flex-1">
						<view class="d-flex a-center font-28">
							<text class="line-clamp2">{{ logisticsInfo.context }}</text>
						</view>
						<view class="text-999 mt-1">{{ logisticsInfo.ftime }}</view>
					</view>
					<view class="w-30r h-30r" style="align-self: center;"><text class="iconfont icon-ArrowRight text-bbb" style="font-size: 30rpx;"></text></view>
				</view>
			</view>

			<view class="font-28 px-2 border-bottom-20bg py-2">
				<view class="py-2 flex-between">
					<text class="text-999">售后编号：</text>
					<view class="flex-end flex-1 overflow-h">
						<text class="flex-1 line-clamp1 text-right">{{ refundData.refundSn }}</text>
						<text class="ml-3 py-1 px-2 border rounded-100 font-20" @click="$stringUtils.lsCopy(refundData.refundSn)">复制</text>
					</view>
				</view>
				<view class="py-2 flex-between">
					<text class="text-999">申请时间：</text>
					<text class="">{{ refundData.createTime }}</text>
				</view>
				<!-- 解决不显示金额的Bug -->
				<view class="py-2 flex-between">
				    <text class="text-999">退款金额：</text>
					<ls-price :price="refundData.refundAmount" v-if="refundData.orderType != 'I' && refundData.orderType != 'O'"/>
					<view v-else-if="refundData.orderType == 'O'">
						<ls-price :price="refundData.refundAmount" />
						<text class="text-main" v-if="refundData.integral"> + {{refundData.integral }} 积分</text>
					</view>
					<text class="text-main" v-else-if="refundData.orderType == 'I'">{{ refundData.integral }} 积分</text>
				</view>
				<view class="py-2 flex-between">
					<text class="text-999">退款原因：</text>
					<text class="flex-1 word-breakall font-arial text-right">{{ refundData.reason }}</text>
				</view>
				<view class="py-2 d-flex j-sb">
					<text class="text-999 text-nowrap">退款说明：</text>
					<view class="word-breakall font-arial">
						{{ refundData.applyType===3 ? '商家主动取消订单，退款原因:'+refundData.sellerMessage : refundData.buyerMessage }}
					</view>
				</view>
				<view class="py-2 d-flex" v-if="refundData.applyType == 2 && refundData.returnType == 2">
					<text class="text-999">收货地址：</text>
					<view class="flex-1">
						<view class=" word-breakall font-arial">{{ refundData.returnConsignee }} ，{{ refundData.returnConsigneePhone }}</view>
						<view class="mt-2 word-breakall font-arial">{{ refundData.returnShopAddress }} {{ refundData.returnShopAddr }}</view>
					</view>
					<text class="ml-3 border px-2 py-1 rounded-100 font-24 h-56r" 
						@click.stop="$stringUtils.lsCopy((refundData.returnShopAddress||'')+(refundData.returnShopAddr||'')+'，'+(refundData.returnConsignee||'')+'，'+(refundData.returnConsigneePhone||''))"
					>复制</text>
				</view>
			</view>

			<view class="font-28 p-2">
				<view class="py-2 flex-between" @click="$navigateTo(`/ModuleOrder/orderList/orderDetail?orderId=${refundData.orderId}`)">
					<text class="text-999">订单编号：</text>
					<view class="flex-end">
						<text class="flex-1 line-clamp1">{{ refundData.orderNumber }}</text>
						<text class="ml-3 border px-2 py-1 rounded-100 font-24" @click.stop="$stringUtils.lsCopy(refundData.orderNumber)">复制</text>
						<text class="iconfont icon-ArrowRight text-bbb" style="font-size: 30rpx;"></text>
					</view>

				</view>
				<view class="py-2 flex-between">
					<text class="text-999">店铺名称：</text>
					<text class="">{{ refundData.shopName }}</text>
				</view>
				<view class="py-2">
					<text class="text-999">退款商品：</text>
					<view>
						<view class="d-flex font-28 py-3 mx-2" :class="[{'border-top':index!=0}]" v-for="(item, index) in refundData.orderItemDTOList" :key="index">
							<ls-image className="mr-1" :options="{ w: '160', h: '160', br: '20' }" :src="item.pic"/>
							<view class="flex-1 overflow-h">
								<view class="line-clamp1">{{ item.productName }}</view>
								<view class="line-clamp1 font-20 text-999">
									<text class="mr-1" v-if="item.attribute">{{ item.attribute }}</text>
									<text></text>
								</view>
								<view class="d-flex j-sb a-center font-24 mt-1">
									<ls-price notThemes :price="item.actualAmount" />
									<text class="goods-num">数量：{{ item.basketCount }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="py-2 border-top" v-if="refundData.photoVoucher&&refundData.photoVoucher.length">
					<view class="text-999">凭&emsp;&emsp;证：</view>
					<view class="flex-start flex-wrap">
						<view class="" v-for="(item, index) in refundData.photoVoucher" :key="index">
							<ls-image className="mt-2 mr-2" :options="{ w: '210', h: '210', br: '20' }" :src="item" :preImgList="refundData.photoVoucher" :current="index"/>
						</view>
					</view>
				</view>
			</view>
		</view>
		<ls-empty className="center-xy" title="'找不到该订单'" :paging="paging" @reLoad="getServiceDetail" reLoad/>
		<!-- sellerStatus：卖家处理状态:0为待审核,1为同意,-1为不同意 -->
		<view
			v-if="(refundData.applyStatus == 1 && refundData.sellerStatus == 0) || refundData.applyStatus == -3 || (refundData.goodsStatus == 1 && refundData.sellerStatus == 1) || (refundData.goodsStatus == 3 && refundData.sellerStatus == 1) || (refundData.goodsStatus == 5 && refundData.sellerStatus == 1)"
			class="bottomBar position-fixed bg-fff bottom-0 w-100 border-box font-28 d-flex a-center flex-end h-100r px-2"
			style="box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 7px 0px;"
		>
			<view
				v-if="refundData.applyStatus == 1 && refundData.sellerStatus == 0"
				class="rounded-50 d-block pt-1 pb-1 pl-3 pr-3 mr-2 border border-e4"
				style="line-height: 36rpx;"
				@click="cancelService"
			>
				取消售后
			</view>
			<!-- applyStatus == -3【商家拒绝申请】，canReapply：可以退货(款)，后台在canReapply里已经判断了applyStatus == -3，所以下面这里不用再判断applyStatus == -3 -->
			<view v-if="refundData.canReapply" class="rounded-50 d-block pt-1 pb-1 pl-3 pr-3 mr-2 border border-e4" style="line-height: 36rpx;" @click="goServiceRefund">
				重新申请
			</view>
			<view
				class="rounded-50 d-block pt-1 pb-1 pl-3 pr-3 mr-2 border border-e4"
				style="line-height: 36rpx;"
				@click="changePopup"
				v-if="refundData.goodsStatus == 1 && refundData.sellerStatus == 1 && ![-1,-2,3].includes(refundData.applyStatus)"
			>
				确认退货
			</view>
			<view
				class="rounded-50 d-block pt-1 pb-1 pl-3 pr-3 mr-2 border border-e4"
				style="line-height: 36rpx;"
				@click="(e)=>{changePopup(e,true)}"
				v-if="(refundData.goodsStatus == 3 && refundData.sellerStatus == 1) || (refundData.goodsStatus == 5 && refundData.sellerStatus == 1)"
			>
				修改物流
			</view>
		</view>
		<u-popup v-model="showPopup" zIndex="999" border-radius="28" safe-area-inset-bottom closeable>
			<view class="d-block font-weight font-32 py-1 px-2 my-2 text-center">填写物流信息</view>
			<view class="px-2">
				<view class=" d-flex border-bottom py-2 ">
					<text class="w-130r mr-2">物流公司</text>
					<view class="flex-1">
						<picker @change="logisticsChange" :value="logisticsIndex" :range="logisticsArr" range-key="name">
							<view class=" font-28 d-flex a-center" :class="{ 'text-999': !logisticsForm.company }">{{ logisticsForm.company || '选择快递物流公司名称' }}</view>
						</picker>
					</view>
				</view>
				<view class=" d-flex border-bottom py-2">
					<text class="w-130r mr-2 ">快递单号</text>
					<input type="text" class="flex-1" v-model="logisticsForm.logisticsNumber" placeholder="填写快递单号" maxlength="30"  @input="onInput"/>
				</view>
			</view>
			<view class="px-2"><ls-button className="but-main h-88r my-3" loading text="确定" @click="confirmShip" :options="{ cl: '#FFF', br: '50', fs: '30' }" /></view>
		</u-popup>
		<!-- 售后弹窗 -->
		<u-popup v-model="showRefund" mode="center" border-radius="14" width="80%">
			<view class="p-4 font-24 w-100">
				<view class="flex-center font-32 font-weight mb-4">申请退款</view>
				<view class="d-flex mb-4 a-center">
					<text class="mr-2 flex-1">退款金额：</text>
					<view class="flex-2"><ls-price :price="refundData.refundAmount" :options="{ is: 32 }" /></view>
				</view>
				<view class="d-flex mb-4 a-center position-relative">
					<text class="position-absolute" style="color: #f56c6c; left: -3%; top: 11%">*</text>
					<text class="mr-2 flex-1">退款原因：</text>
					<view class="flex-2">
						<picker :value="columsIndex" :range="columns" @change="changeReason">
							<view>{{ columns[columsIndex] || '请选择退款原因' }}</view>
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
	</view>
</template>
<script>
import { mapState } from 'vuex';
import { orderApi, refundApi } from '@/api/ModulesOrder';
import countDown from '@/components/common/countdown/count-down.vue';
export default {
	components: {
		countDown,
	},
	data() {
		return {
			refundId: '', // 售后订单Id
			refundData: '', // 售后详情订单
			bottomBarHeight: 50, // 底部栏的高度
			logisticsForm: {
				company: '',
				logisticsNumber: ''
			},
			logisticsInfo: {},
			logisticsArr: [{ name: '顺丰' }, { name: '韵达快递' }],
			logisticsIndex: 0,

			refundReason: '', // 退货原因
			columns: ['我不想买了', '信息填写错误，重新拍', '卖家缺货', '其他原因'],
			columsIndex: '',

			showPopup: false,
			showRefund: false,
			isEditLogistics:false ,// 是否修改物流
			
			paging: {
			    status: 'loading',
			    error: false, // 是否错误
			    emptylist: false // 是否显示列表为空时的样式
			},
		};
	},
	computed: {
		...mapState(['timeDiff', 'stausBarHeight', 'wxMenuBut']),
		
		// 是否显示退货倒计时(从下面的逻辑判断抄)
		showRefundCD() {
			return (data) => {
				if(data.applyType == 3) return false;
				else {
					if (data.applyStatus == -3) {
						return false;
					}
					if (data.applyStatus == -1 || data.applyStatus == -2) {
						return false;
					}
					if (data.applyStatus == 1 && data.sellerStatus == 0) {
						return false;
					}
					if (data.goodsStatus == 1 && data.sellerStatus == 1) {
						return true;
					}
				}
			}
		}
	},
	filters: {
		getApplyType(applyType) {
			const applyTypeDict = {
				1: '退款',
				2: '退货',
				'-1': '已撤销'
			};
			return applyTypeDict[applyType];
		},
		getApplyStatus(data) {
			// applyType=3是商家主动申请取消订单，状态需单独判断
			if(data.applyType == 3){
				if (data.applyStatus == 2) {
					return '处理中';
				}
				if (data.applyStatus == 3) {
					return '已通过';
				}
				if (data.goodsStatus == -4) {
					return '已拒绝';
				}
				if (data.goodsStatus == -1) {
					return '已取消';
				}
			}else{
				if (data.applyStatus == -3 || data.sellerStatus == -1) {
					return '已拒绝';
				}
				if (data.applyStatus == -1 || data.applyStatus == -2) {
					return '已取消';
				}
				if (data.applyStatus == 2) {
					return '待平台审核';
				}
				if (data.applyStatus == 3) {
					return '已完成';
				}
				if (data.applyStatus == 1 && data.sellerStatus == 0) {
					return '待商家确认';
				}
				if (data.goodsStatus == 1 && data.sellerStatus == 1) {
					return '待用户退货';
				}
				
				if ((data.goodsStatus == 3 && data.sellerStatus == 1) || (data.goodsStatus == 5 && data.sellerStatus == 1)) {
					return '待商家收货';
				}
			}
			
			return '-';
		},
	},
	mounted(){
		orderApi.cancelReason().then(res => {
			if(res.code && res.data.length){
				this.columns = res.data.map(v => { return v.value })
			}
		})
	},
	onLoad(options) {
		this.refundId = options.refundId || null;
		this.getServiceDetail();
		this.getBottomBarSize();
	},
	methods: {
		logisticsChange: function(e) {
			this.logisticsIndex = e.target.value;
			this.logisticsForm.company = this.logisticsArr[this.logisticsIndex].name;
		},
		changePopup($event,isEdit = false) {
			console.log(isEdit)
			this.isEditLogistics = isEdit
			this.showPopup = !this.showPopup;
		},
		goServiceRefund(refundData) {
			// 整单退
			if (this.refundData.orderStatus == 5 || this.refundData.orderStatus == 2) {
				this.refundReason = '';
				this.columsIndex = '';
				this.showRefund = true;
			// 部分退(refundData.orderStatus>5代表已发货)
			} else if(this.refundData.orderStatus > 5){
				this.$navigateTo(`/ModuleOrder/service/serviceRefund?orderId=${this.refundData.orderId}&orderItemId=${this.refundData.orderItemId}`);
			}
		},

		confirmShip() {
			if (
				!this.$checkInfo([
					{ type: 'hasValue', value: this.logisticsForm.company, msg: '请选择物流公司' },
					{ type: 'hasValue', value: this.logisticsForm.logisticsNumber, msg: '请输入物流单号' }
				])
			) {
				return;
			}
			if(this.isEditLogistics == false){
				const confirmParams = { ...this.logisticsForm, refundId: this.refundId, logisticsId: this.logisticsArr[this.logisticsIndex].id };
				refundApi.confirmShip(confirmParams).then(res => {
					if (res.code) {
						this.changePopup();
						this.getServiceDetail();
					}
				});
			}else{
				const confirmParams = { ...this.logisticsForm, refundId: this.refundId, id: this.refundData.refundReturnLogisticsDTO.id, logisticsCompanyId: this.logisticsArr[this.logisticsIndex].id, orderNumber: this.refundData.orderNumber };
				refundApi.updateLogistic(confirmParams).then(res => {
					if (res.code) {
						this.changePopup();
						this.getServiceDetail();
					}
				});
			}
		},
		// 获取详情信息
		getServiceDetail() {
			this.paging = {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false // 是否显示列表为空时的样式
			}
			orderApi
				.serverOrderGet({
					refundId: this.refundId
				})
				.then(res => {
					if (res.code) {
						this.refundData = res.data;
						if (res.data.refundReturnLogisticsDTO && res.data.refundReturnLogisticsDTO.logisticsCompanyId && res.data.refundReturnLogisticsDTO.trackingInformation) {
							this.logisticsInfo = JSON.parse(res.data.refundReturnLogisticsDTO.trackingInformation)[0];
						}else{
							this.logisticsInfo = {}
						}
						if (
							(this.refundData.goodsStatus == 1 && this.refundData.sellerStatus == 1) || 
							(this.refundData.goodsStatus == 3 && this.refundData.sellerStatus == 1) || 
							(this.refundData.goodsStatus == 5 && this.refundData.sellerStatus == 1)
						) {
							refundApi.logistics().then(res => {
								if (res.code) {
									this.logisticsArr = res.data;
								}
							});
						}
					}
				}).catch((err) => {
					this.paging.error = true
				}).finally((res) => {
					this.paging.status = 'noMore'
					if (!this.$checkInfo([{ type: 'hasValue', value: this.refundData }])) {
						this.paging.emptylist = true
					}
				});
		},

		// 取消售后
		cancelService() {
			orderApi
				.refundCancelApply({
					refundSn: this.refundData.refundSn
				})
				.then(res => {
					if (res.code) {
						uni.showToast({
							title: '取消成功',
							icon: 'none',
							mask: true,
							complete: () => {
								setTimeout(() => {
									this.$utils.pages.goBeforePage(1);
								}, 1500);
							}
						});
					}
				});
		},

		// 获取底部固定位置的高度
		getBottomBarSize() {
			this.$nextTick(() => {
				uni.createSelectorQuery()
					.in(this)
					.select('.bottomBar')
					.boundingClientRect(res => {
						if (res) {
							this.bottomBarHeight = res.height;
						}
					})
					.exec();
			});
		},

		// 选择退货原因
		changeReason(e) {
			this.columsIndex = e.target.value;
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
					orderId: String(this.refundData.orderId),
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
								this.getServiceDetail();
							}, 1000);
						}
					});
				});
		},
		
		onInput(e){
			setTimeout(() => {
				this.logisticsForm.logisticsNumber = this.$stringUtils.trim(e.detail.value,2)
			},10) 
		}
	}
};
</script>

<style></style>
