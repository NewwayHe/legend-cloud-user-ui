<template>
	<view class="" :style="{ '--themescolor': themes.color }">
		<ls-header title="申请售后" showHeadSelect></ls-header>
		<view class="font-28" style="padding-bottom: calc(100rpx + var(--safe-area-inset-bottom));">
			<view class="my-2 bg-white px-2 py-3">
				<text class="font-weight">{{ form.refundType == 1 ? '退款' : '退货' }}商品</text>
				<view class="mt-2 grid-column3 grid-rc-20">
					<label class="w-100 position-relative pb-100pre h-0 border-box" @click="checkboxChange(item)" v-for="(item, index) in orderList" :key="index">
						<view
							class="position-absolute h-100 w-100 left-0 top-0 bg-ccc rounded-10 overflow-h"
							:style="{ border: orderList.length > 1 && item.status == 1 && form.orderItemIds.includes(item.id) ? `4rpx solid ${themes.color}` : '' }"
						>
							<ls-image :src="item.pic" :options="{ w: '100%', h: '100%' }" />
						</view>
						<view
							class="iconfont icon-success text-main position-absolute top-0 right-0 mt-1 mr-1" style="font-size: 36rpx;"
							v-if="orderList.length > 1 && item.status == 1 && form.orderItemIds.includes(item.id)"
						></view>
					</label>
				</view>
			</view>
			<view class="my-2 bg-white px-2 py-3">
				<view class="flex-between">
					<view class="flex-1 font-weight">
						售后类型
					</view>
					<radio-group class="d-flex" @change="changeType">
						<radio value="2" :color="themes.color" :checked="form.refundType == 2" style="transform:scale(0.75)"><text class="font-36 ml-1 mr-2">退货</text></radio>
						<radio value="1" :color="themes.color" :checked="form.refundType == 1" style="transform:scale(0.75)"><text class="font-36 ml-1">退款</text></radio>
					</radio-group>
				</view>
				<view class="flex-between mt-3" @click="show=!show">
					<view class="font-weight" style="flex: 1 0 60%;">
						{{ form.refundType == 1 ? '退款' : '退货' }}原因
					</view>
					<view :class="[{ 'text-999': !form.reason }, 'text-wrap', 'position-relative', 'pr-3']">
						<text class="mr-1"> {{ form.reason || '必选' }} </text>
						<text class="position-absolute right-0 iconfont icon-ArrowRight" style="font-size: 20rpx; top: 50%; transform: translateY(-50%);"></text>
					</view>
					<u-picker v-model="show" mode="selector" :range="columns" safe-area-inset-bottom @confirm="changeReason"></u-picker>
				</view>
				<view v-if="form.refundType == 1" class="flex-between mt-3">
					<view class="flex-1 font-weight">
						退款金额
					</view>
					<input class="text-right" v-model="form.refundAmount" :placeholder="'最多可退款' + applyData.totalIntegral + '积分'" v-if="applyData.orderType == 'I'" :focus="focus"/>
					<input
						class="text-right"
						v-model="form.refundAmount"
						:focus="focus"
						:placeholder="`最多可退款${refundAmount}元${(applyData.totalIntegral && applyData.totalIntegral + '积分') || ''}`"
						 v-else-if="applyData.orderType == 'O'"
					/>
					<input class="text-right" v-model="form.refundAmount" :placeholder="'最多可退款' + refundAmount + '元'" :focus="focus" v-else/>
				</view>
			</view>

			<view class="bg-white mt-2 mb-6 py-3 px-2 ">
				<view class="pb-3 font-weight border-bottom border-f8">{{ form.refundType == 1 ? '退款' : '退货' }}说明</view>
				<view class="py-3 position-relative">
					<text class="iconfont icon-bianji3 position-absolute top-0 left-0 pt-3 bg-white zindex-2" style="font-size: 30rpx;" v-if="form.buyerMessage.length<100"></text>
					<textarea
						class="font-24 w-100 line-h-md"
						maxlength="200"
						placeholder-style="color:#ccc"
						style="height: 160rpx;"
						:style="{'text-indent':form.buyerMessage.length<100?'50rpx':''}"
						v-model="form.buyerMessage"
						:placeholder="'请输入' + (form.refundType == 1 ? '退款' : '退货') + '说明'"
					/>
				</view>
				<view class="mb-3">
					<text class="text-main">{{form.buyerMessage.length}}</text>/200字符
				</view>
				<ls-dragImage v-model="form.photoVoucher" width="200" height="200" :column="3" :maxImageNum="5" :maxUploadNum="5" fillName="上传凭证"></ls-dragImage>
				<view class="font-24 text-999 mt-3">
					长按拖拽排序，支持png/jpg/jpeg/bmp格式，大小5M以内；最多可添加 5 张图片
				</view>
			</view>

		</view>
		<view class="position-fixed  bottom-0 w-100  safearea-bb">
			<view class="w-100 px-2 h-100r flex-center">
				<ls-button className="w-100 but-main h-80r" loading text="保存并提交" :asyncFunction="onSubmit" :options="{ br: '100', ls: '2', fs: '26' }" />
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { refundApi } from '@/api/ModulesOrder.js';
export default {
	components: {},
	data() {
		return {
			columns: ['我不想买了','信息填写错误，重新拍','卖家缺货', '其他原因'],
			form: {
				buyerMessage: '',
				orderId: '',
				refundAmount: '',
				refundType: 2,
				orderItemIds: [],
				photoVoucher: [],
				reason: ''
			},
			applyData: '',
			orderItemId: '',
			orderList: [],
			show:false,
			focus:false,
		};
	},
	computed: {
		...mapState(['timeDiff', 'stausBarHeight', 'wxMenuBut']),
		// 是否只有一条数据
		isFirst() {
			return this.orderList.length == 1;
		},
		// 最多退款金额
		refundAmount() {
			return this.orderList.reduce((pre, item, index) => {
				if (this.form.orderItemIds.includes(item.id)) {
					pre += item.refundAmount;
				}
				return pre;
			}, 0);
		}
	},
	watch: {
		'form.refundAmount'(newValue, oldValue) {
			if (newValue) {
				const __setOldVal = () => {
					setTimeout(() => {
						this.form.refundAmount = oldValue;
					}, 0);
				};
				if (!this.$checkInfo([{ type: 'amount', value: newValue }])) {
					__setOldVal();
				}
				if (this.applyData.orderType == 'I') {
					if (newValue > this.applyData.totalIntegral) {
						__setOldVal();
					}
				} else {
					if (newValue > this.refundAmount) {
						__setOldVal();
					}
				}
			}
		},
		'form.refundType'(newValue, oldValue) {
			if (!this.isFirst) {
				this.form.orderItemIds = [];
			}
		}
	},
	onLoad(options) {
		this.form.orderId = options.orderId || '';
		this.orderItemId = options.orderItemId || '';
		this.getRefundDetail();
	},
	onShow() {},
	mounted(){
		refundApi.cancelReason().then(res => {
			if(res.code && res.data.length){
				this.columns = res.data.map(v => { return v })
			}
		})
	},
	methods: {
		// 获取退货信息
		getRefundDetail() {
			refundApi.refundApply({ orderId: this.form.orderId, orderItemId: this.orderItemId }).then(res => {
				if (res.code) {
					this.applyData = res.data;
					this.columns = res.data.refundReasonList;
					this.orderList = res.data.orderItemList;
					if (this.orderList.length == 1) {
						this.form.orderItemIds = [this.orderList[0].id];
					}
				}
			});
		},
		// 选择退货原因
		changeReason(e) {
			this.form.reason = this.columns[e[0]];
		},
		// checkbox改变
		checkboxChange(item) {
			const check = this.form.orderItemIds.includes(item.id);
			if (item.status != 1 || this.isFirst) return;
			// 如果点击项已勾选
			if (check) {
				if (this.form.refundType == 1) {
					this.form.orderItemIds = [];
				} else {
					this.form.orderItemIds = this.form.orderItemIds.filter(id => {
						return item.id != id;
					});
				}
			} else {
				if (this.form.refundType == 1) {
					this.form.orderItemIds = [item.id];
				} else {
					this.form.orderItemIds.push(item.id);
				}
			}
		},

		// 保存并提交
		onSubmit() {
			return new Promise((resolve) => {
				if (!this.form.orderItemIds.length) {
					this.$pageScrollTo()
					uni.showToast({
						title: '请勾选' + (this.form.refundType == 1 ? '退款' : '退货') + '商品',
						icon: 'none'
					});
					return resolve()
				}
				if (!this.$checkInfo([{ type: 'hasValue', value: this.form.reason, msg: '请选择原因' }])) {
					this.show = true
					return resolve()
				}
				if (this.form.refundType == 1) {
					if (!this.$checkInfo([{ type: 'hasValue', value: this.form.refundAmount, msg: `请输入退款${this.applyData.orderType == 'I' ? '积分' : '金额'}` }])) {
						this.focus = true
						return resolve()
					}
				}
				if (this.form.refundType == 1 && this.form.refundAmount * 1 > this.refundAmount * 1) {
					this.focus = true
					uni.showToast({
						title: '退款金额大于最大退款金额',
						icon: 'none'
					});
					return resolve()
				}
				
				refundApi.refundItem(this.form).then(res => {
					if (res.code) {
						this.$navigateTo(`/ModuleOrder/service/serviceList`);
					}
				}).finally(() => { return resolve() })
			})
		},
		// 切换售后类型
		changeType(e) {
			this.form.refundType = e.detail.value;
		}
	}
};
</script>

<style>
page {
	background-color: var(--backgroundcolor);
}
</style>
