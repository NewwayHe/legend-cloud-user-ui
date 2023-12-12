<template>
	<view class="h-100" :style="{ '--themescolor': themes.color }">
		<ls-header showHeadSelect title="账单明细"></ls-header>
		<view class="w-100 h-80r bg-fff">
			<view class="flex-start position-fixed px-3 py-2 bg-fff w-100 h-80r zindex-99" :style="{ top: `calc(88rpx + ${stausBarHeight}px)` }">
				<view class="flex-1 text-333 font-28" style="line-height: 40rpx;" @click="selectDate">
					{{ params.startDate | dateformat('YYYY年MM月DD日') || '开始年月日' }} - {{ params.endDate | dateformat('YYYY年MM月DD日') || '结束年月日' }}
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
				
				<view class="order-list" v-for="(value,index) in cacheList" :key="value.dateGroupId">
					<view class="h-90r py-2 px-3 flex-between">
						<text class="text-333 font-36" style="line-height: 50rpx; font-weight: 600;">{{ value.dateGroup }}</text>
						<view class="flex-1 flex-end text-999 font-28">
							<view>收入<ls-price :price="value.incomeAmount" notThemes :options="{ is: 28, ic: '#999999', ds: 28, dc: '#999999' }" style="font-weight: normal;"/>，</view>
							<view>支出<ls-price :price="value.expenditureAmount" notThemes :options="{ is: 28, ic: '#999999', ds: 28, dc: '#999999' }" style="font-weight: normal;"/></view>
						</view>
					</view>
					<view class="bg-fff py-4 px-3 flex-between" v-for="(val,valIdx) in value.customerBillDTOList" :key='val.id'
						:style="{'border-top': valIdx != 0 ? '1px solid #f8f8f8' : ''}"
						:class="{'top-radius': valIdx == 0, 'btm-radius': valIdx == value.customerBillDTOList.length -1 }"
						@click="goBillPage(val.id)"
						@longpress="delBill(val.id, index, valIdx)"
					>
						<view class="a-self-start text-333 flex-col-between" style="flex: 2;">
							<text class="font-28 line-clamp2">{{ val.tradeExplain }}</text>
							<text class="font-24 text-999 mt-1">{{ val.createTime }}</text>
						</view>
						<view class="flex-col-between" style="flex: 1; align-items: flex-end;">
							<view class="font-32" style="font-weight: bold;margin-bottom: 6rpx;" :style="{ 'color': val.mode != 'INCOME' ? '#999' : '#333'}">
								{{ val.mode != 'INCOME' ? '-' : '+' }}
								<ls-price :price="val.amount" notThemes :options="{ is: 32, ic: `${val.mode != 'INCOME' ? '#999999' : '#333333'}`, iw: 600, ds: 32, dc: `${val.mode != 'INCOME' ? '#999999' : '#333333'}`, dw: 600 }" />
							</view>
							<!-- <view class="font-24 text-999">可用余额</view> -->
						</view>
					</view>
				</view>
			</ls-load-more>
			<ls-empty v-else className="center-xy" type="2" title="暂无数据" :paging="paging" @reLoad="searchBill" reLoad/>
		</view>
		<u-toast ref="msgToast" />
		<u-calendar
			:active-bg-color="themes.color"
			btn-type="primary"
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
import { billDetail } from '@/api/ModulesUser';
import pageUtil from '@/utils/pageUtils.js';
const listPage = new pageUtil(billDetail.getBillDetail);

export default {
	components: {},
	data() {
		return {
			// billData: [],
			params: {
				pageSize: 20,
				// tradeExplain: '', // 交易说明
				startDate: null,
				endDate: null
			},
			paging: {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false // 是否显示列表为空时的样式
			},
			list: [],
			dateShow: false, //日历是否隐藏
			cacheList: [],	//缓存处理过的数组
		};
	},
	filters: {},
	onLoad(options) {
		listPage.loadListByPage(this, this.params);
	},
	onShow() {},
	mounted() {},
	computed: {
		...mapState(['stausBarHeight']),
		// 账单列表（按月份分组）
		dateList() {
			const dateList = this.list.reduce((pre, item) => {
				const i = pre.findIndex(val => val.dateGroupId == item.dateGroupId);
				if (i < 0) {
					pre.push(item);
				} else {
					pre[i]['customerBillDTOList'].push(...item.customerBillDTOList);
				}
				return pre;
			}, []);
			return dateList;
		}
	},
	watch: {
		// 监听list数组的变化 如果是加载更多的话 list的长度会加一
		// 此时拿该下标的数组内容 做数据处理
		// 搜索时 list会被置空 导致长度为0 要排除这种情况的处理 同时清除cacheList
		list(nL, oL) {
			let oLen = oL.length;
			// console.log('nL--', nL)
			if(nL.length) {
				let operateList = nL.slice(oLen);	//切割获取新增加的数据
				operateList = this.$u.deepClone(operateList);
				operateList.forEach((li) => {
					const existLi = this.cacheList.findIndex(item => item.dateGroupId == li.dateGroupId)
					if (existLi < 0) {
						this.cacheList.push(li);
					} else {
						this.cacheList[existLi]['customerBillDTOList'].push(...li.customerBillDTOList);
					}
				})
			}else {			//重新搜索
				this.cacheList = []
			}
			// console.log('cacheList--', this.cacheList)
		}
	},
	// 下拉加载
	onReachBottom() {
		listPage.loadListByPageMore();
	},
	methods: {
		selectDate() {
			this.dateShow = true;
		},
		dateChange(e) {
			this.params.startDate = this.$options.filters.dateformat(e.startDate, 'YYYY-MM-DD');
			this.params.endDate = this.$options.filters.dateformat(e.endDate, 'YYYY-MM-DD');
			this.searchBill()
		},
		searchBill() {
			listPage.loadListByPage(this, this.params);
		},

		// 删除账单
		delBill(id, index, index2) {
			uni.showModal({
				title: '删除',
				content: '请问要删除本条账单吗？',
				success: async res => {
					if (res.confirm) {
						billDetail
							.delBill(id)
							.then(res => {
								console.log('用户点击确定');
								// this.list[index].customerBillDTOList.splice(index2, 1); // 删除账单
								if(res.code) {
									this.cacheList[index].customerBillDTOList.splice(index2, 1)
									this.$refs.msgToast.show({
										title: '删除成功',
										duration: 800,
										type: 'success',
									})
								}
							})
							.catch(err => {
								console.error('删除失败');
								this.$refs.msgToast.show({
									title: '删除失败',
									duration: 800,
									type: 'error',
								})
							});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		// 跳转详情
		goBillPage(id) {
			// console.log(id);
			uni.navigateTo({
				url: `/ModuleCenter/billInfo/billInfo?id=${id}`
			});
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
