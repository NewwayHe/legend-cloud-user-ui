<!-- 账户明细 -->
<template>
	<view :style="{ '--themescolor': themes.color }">
		<ls-header showHeadSelect title="账户明细"></ls-header>
		<view class="w-100 h-80r bg-fff">
			<view class="flex-start position-fixed px-3 py-2 bg-fff w-100 h-80r zindex-99" :style="{ top: `calc(88rpx + ${stausBarHeight}px)` }">
				<view class="flex-1 text-333 font-28" style="line-height: 40rpx;" @click="selectDate">
					<text>
						{{ params.startDate | dateformat('YYYY年MM月DD日') || '开始年月日' }} - {{ params.endDate | dateformat('YYYY年MM月DD日') || '结束年月日' }}
					</text>
					<text
						class="iconfont icon-ArrowDown d-inline-block transition-all05 ml-1"
						style="font-size: 28rpx;"
						:style="{ 'transform': `rotate(${!dateShow ? 0 : 180}deg)` }"
					></text>
				</view>
			</view>
		</view>

		<view class="safearea-bb p-2">
			<ls-load-more :status="paging.status" v-if="!paging.emptylist">
				<view class="order-list" v-for="(value, key) in accountObj" :key="key">
					<view class="h-90r py-2 px-3 flex-between">
						<text class="text-333 font-36" style="line-height: 50rpx; font-weight: 600;">{{ key.replace(/-/g,'.') }}</text>
						<view class="flex-1 flex-end text-999 font-28">
							<view>收入<ls-price :price="getTotal(value, 'ADDITION')" notThemes :options="{ is: 28, ic: '#999999', ds: 28, dc: '#999999' }" style="font-weight: normal;"/>，</view>
							<view>支出<ls-price :price="getTotal(value, 'DEDUCTION')" notThemes :options="{ is: 28, ic: '#999999', ds: 28, dc: '#999999' }" style="font-weight: normal;"/></view>
						</view>
					</view>
					<view class="bg-fff py-4 px-3 flex-between" v-for="(val,valIdx) in value" :key='val.id'
						:style="{'border-top': valIdx != 0 ? '1px solid #f8f8f8' : ''}"
						:class="{'top-radius': valIdx == 0, 'btm-radius': valIdx == value.length -1 }"
						@click="toBillDetail(val)"
					>
						<text class="font-28 text-333 a-self-start">{{ val.businessTypeName }}</text>
						<view class="flex-col-between" style="align-items: flex-end;">
							<view class="font-32" style="font-weight: bold;margin-bottom: 6rpx;" :style="{ 'color': val.operationType == 'DEDUCTION' ? '#999' : '#333'}">
								{{ val.operationType == 'DEDUCTION' ? '-' : '+' }}
								<ls-price :price="val.amount" notThemes :options="{ is: 32, ic: `${val.operationType == 'DEDUCTION' ? '#999999' : '#333333'}`, iw: 600, ds: 32, dc: `${val.operationType == 'DEDUCTION' ? '#999999' : '#333333'}`, dw: 600 }" />
							</view>
							<view class="font-24 text-999">可用余额 {{ val.availableAdmount | priceFilter }}</view>
						</view>
					</view>
				</view>
			</ls-load-more>
			<ls-empty className="center-xy" title="暂无列表信息" :paging="paging" @reLoad="getData" reLoad/>
		</view>
		<u-calendar
			:active-bg-color="themes.color"
			btn-type="primary"
			:range-bg-color="themes.rgb02"
			:range-color="themes.color"
			safe-area-inset-bottom
			v-model="dateShow"
			showMonth
			mode="range"
			@change="dateChange"
		></u-calendar>
	</view>
</template>

<script>
import { mapState } from 'vuex';

import pageUtil from '@/utils/pageUtils.js';
import { depositApi } from '@/api/ModuleCenter';
const listPage = new pageUtil(depositApi.walletDetailsPage);
export default {
	components: {},
	data() {
		return {
			params: {
				curPage: 1,
				endDate: null,
				startDate: null
			},
			paging: {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false // 是否显示列表为空时的样式
			},
			list: [],
			dateShow: false ,// 日历是否隐藏
		};
	},
	computed: {
		...mapState(['stausBarHeight']),
		showBut() {
			return this.params.startDate && this.params.endDate;
		},
		accountObj() {
			const obj = {};
			this.list.forEach(item => {
				const currentTime = this.$options.filters.dateformat(item.updateTime,'YYYY-MM-DD');
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
		// 获取总收入和总支出
		getTotal(list, type = 'DEDUCTION') {
			return list.reduce((pre, cur, curIndex) => {
				if (cur.operationType == type) {
					return pre + Number(cur.amount);
				}
				return pre;
			}, 0);
		},
		getData() {
			listPage.loadListByPage(this, this.params);
		},
		selectDate() {
			this.dateShow = true;
		},
		dateChange(e) {
			this.params.startDate = this.$options.filters.dateformat(e.startDate,'YYYY-MM-DD HH:mm:ss');
			this.params.endDate = this.$options.filters.dateformat(e.endDate,'YYYY-MM-DD HH:mm:ss');
			this.getData()
		},
		// 去往订单详情
		toBillDetail(bill) {
			this.$u.route('/ModuleCenter/wallet/accountBill', {
				id: bill.id
			})
		}
	}
};
</script>

<style>
page {
    background-color: var(--backgroundcolor);
}
</style>

<style lang="scss" scoped>
.order-list {
	.top-radius {
		border-top-left-radius: 12rpx;
		border-top-right-radius: 12rpx;
	}
	.btm-radius {
		border-bottom-left-radius: 12rpx;
		border-bottom-right-radius: 12rpx;
	}
}
</style>
