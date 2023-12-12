<!-- 提现记录 -->
<template>
	<view :style="{ '--themescolor': themes.color }">
		<!-- 头部下拉列表 -->
		<head-dropdown :list="listDropdown" title="提现记录" :state="parmas.state" @change="changeList" span="2"></head-dropdown>
		
		<view class="w-100 h-80r">
			<view class="flex-start position-fixed px-3 py-1 bg-f8 w-100 h-80r zindex-99" :style="{ top: `calc(88rpx + ${stausBarHeight}px)` }">
				<view class="flex-1" @click="selectDate" :class="[{ 'text-999': !showBut }]">
					<u-icon name="clock" size="32"></u-icon>
					{{ parmas.startDate | dateformat('YYYY年MM月DD日') || '开始年月日' }} - {{ parmas.endDate | dateformat('YYYY年MM月DD日') || '结束年月日' }}
					<text
						class="iconfont icon-ArrowDown d-inline-block transition-all05 pl-1"
						style="font-size: 30rpx;"
						:style="{ transform: `rotate(${!dateShow ? 0 : 180}deg)` }"
					></text>
				</view>
				<ls-button
					:className="`${showBut ? 'but-main' : 'bg-ccc flex-center text-white pointer-none'} h-60r ml-2`"
					@click="getData"
					:text="'筛选'"
					:options="{ br: '100', fs: '30' }"
				/>
			</view>
		</view>

		<view class="safearea-bb order-list">
			<ls-load-more :status="paging.status" v-if="!paging.emptylist">
				<view class="px-2">
					<block v-for="(value, key, index) in accountObj" :key="index">
						<view class="border-bottom-dashed-ddd">
							<view class="flex-between h-80r ">
								<view class="font-weight font-30">{{ key }}</view>
								<view>
									收入
									<ls-price :price="getTotal(value, 'ADDITION')" notThemes="" :options="{ is: 28, ds: 24 }" />
									支出
									<ls-price :price="getTotal(value, 'DEDUCTION')" notThemes="" :options="{ is: 28, ds: 24 }" />
								</view>
							</view>
							<view class="flex-between h-80r text-999" v-for="(item, childIndex) in value">
								<view class="text-999">{{ item.businessTypeName }}</view>
								<view class="flex-1  text-right">
									<view>
										余额{{ item.operationType == 'DEDUCTION' ? '-' : '+' }}
										<ls-price :price="item.amount" notThemes="" :options="{ is: 28, ds: 24 }" />
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</ls-load-more>
			<ls-empty className="center-xy" :title="'暂无列表信息'" :paging="paging" @reLoad="getData" reLoad/>
		</view>
		<u-calendar
			:active-bg-color="themes.color"
			btn-type="error"
			:range-bg-color="themes.rgb02"
			:range-color="themes.color"
			safe-area-inset-bottom
			v-model="dateShow"
			mode="range"
			@change="dateChange"
		></u-calendar>
	</view>
</template>

<script>
import { mapState } from 'vuex';

import pageUtil from '@/utils/pageUtils.js';
import headDropdown  from '@/components/ls-app/ls-header/head-dropdown.vue'
import { depositApi } from '@/api/ModuleCenter';
const listPage = new pageUtil(depositApi.walletDetailsPage);
export default {
	components: {'head-dropdown':headDropdown},
	data() {
		return {
			parmas: {
				businessType:'CASH_WITHDRAWAL',//业务类型,可用值:DISTRIBUTION_REWARDS(分销奖励),PAYMENT_RECHARGE(付款充值),PLATFORM_COMPENSATION(平台补偿),ORDER_DEDUCTION(订单抵扣),PAYMENT_DEDUCTION(支付抵扣),CASH_WITHDRAWAL(现金提现),PLATFORM_DEDUCTION(平台扣款)
				endDate: null,
				startDate: null,
				state:'',//记录状态 WalletDetailsStateEnum。0：默认(待审核)，1：成功(提现成功)，-999拒绝
			},
			paging: {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false // 是否显示列表为空时的样式
			},
			list: [],
			dateShow: false ,//日历是否隐藏
			listDropdown: [
				{
					name: '全部',
					value: null,
					icon: 'icon-fenlei'
				},
				{
					name: '审核中',
					value: '0',
					icon: 'icon-daojishi'
				},
				{
					name: '成功',
					value: '1',
					icon: 'icon-success'
				},
				{
					name: '拒绝',
					value: '-999',
					icon: 'icon-tanhao1'
				}
			],
		};
	},
	computed: {
		...mapState(['stausBarHeight']),
		showBut() {
			return this.parmas.startDate && this.parmas.endDate;
		},
		accountObj() {
			let obj = {};
			this.list.forEach(item => {
				let currentTime = this.$options.filters.dateformat(item.updateTime,'YYYY-MM-DD');
				if (obj.hasOwnProperty(currentTime)) {
					obj[currentTime].push(item);
				} else {
					obj[currentTime] = [item];
				}
			});
			return obj;
		}
	},
	// 下拉加载
	onReachBottom() {
		listPage.loadListByPageMore();
	},
	onLoad(options) {
		this.getData();
	},
	methods: {
		//获取总收入和总支出
		getTotal(list, type = 'DEDUCTION') {
			return list.reduce((pre, cur, curIndex) => {
				if (cur.operationType == type) {
					return pre + Number(cur.amount);
				}
				return pre;
			}, 0);
		},
		getData() {
			listPage.loadListByPage(this, this.parmas);
		},
		selectDate() {
			this.dateShow = true;
		},
		dateChange(e) {
			this.parmas.startDate = this.$options.filters.dateformat(e.startDate,'YYYY-MM-DD HH:mm:ss');
			this.parmas.endDate = this.$options.filters.dateformat(e.endDate,'YYYY-MM-DD HH:mm:ss');
		},
		// 选择下拉列表
		changeList(index) {
			this.parmas.state = this.listDropdown[index].value;
			listPage.loadListByPage(this, this.parmas);
		},
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
