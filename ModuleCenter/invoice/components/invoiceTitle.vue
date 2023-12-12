<template>
	<!-- 发票抬头 -->
	<view class="invoiceTitle overflow-h">
		<!-- 内容区域 -->
		<view v-if="!$u.test.isEmpty(invoiceList)" class="invoiceContent">
			<ls-load-more :status="paging.status">
				<view v-for="invoice in invoiceList" :key='invoice.id' class="defaultTitle">
					<view>
						<view class="text-333 font-28" style="font-weight: 500; line-height: 40rpx;">
							<text v-if="invoice.type == 'DEDICATED'">增值税发票</text>
							<text v-else>普通发票-{{ invoice.titleType == 'PERSONAL' ? '个人' : '公司'}}</text>
							<text v-if="invoice.commonInvoiceFlag" class="ml-2 bg-main text-fff font-20" style="font-weight: normal; line-height: 28rpx; padding: 0 8rpx; border-radius: 4rpx; transform: translate3d(0,0,0)">默认</text>
						</view>
						<text class="line-clamp2">{{ invoice.company }}</text>
					</view>
					<text class="iconfont icon-bianji3 text-666 text-right" style="font-size: 28rpx;" @click="goVoiceoOperate(invoice.id)"></text>
				</view>
			</ls-load-more>
		</view>
		<ls-empty v-else className="center-xy" title="您还没有设置相关发票信息" :paging="paging" @reLoad="getData" reLoad/>
		<view class="w-100 safearea-bb-white position-fixed bottom-0 p-2 bg-fff">
			<ls-button
			    className="but-main w-100 h-80r"
			    text="新增"
			    @click="goVoiceoOperate(null)"
			    :options="{ br: '40', ls: '3', fs: '26' }"
			/>
		</view>
	</view>
</template>

<script>
	import { invoiceManage } from '@/api/ModulesUser'
	import pageUtil from '@/utils/pageUtils.js';
	const invoicePage = new pageUtil(invoiceManage.getInvoice, { field: { list: 'invoiceList'} });
	export default {
		data() {
			return {
				paging: {		//这个必须写 因为pageUtils是在调用了loadListByPage之后才往this身上加paging 页面上ls-empty使用了该变量
					status: 'loading',
					error: false, // 是否错误
					emptylist: false // 是否显示列表为空时的样式
				},
				invoiceParams: {		//抬头列表参数
					// curPage: 2,	//调试用
					pageSize: 10,
				},		
				invoiceList: [],		//抬头列表数据
			}
		},
		computed: {
		},
		mounted() {
			this.getData()
		},
		methods: {
			getData() {
				invoicePage.loadListByPage(this, this.invoiceParams)
			},
			
			loadMore() {
				invoicePage.loadListByPageMore()
			},
			
			// 去往 新增/编辑
			goVoiceoOperate(invoiceId) {
				this.$u.route('/ModuleCenter/invoice/invoiceTitle', { invoiceId });
			}
		}
	}
</script>

<style lang='scss' scoped>
.invoiceTitle {
	.invoiceContent {
		margin-bottom: calc(140rpx + var(--safe-area-inset-bottom));
	}
}
.defaultTitle {
	margin-top: 20rpx;
	padding: 20rpx 30rpx;
	background-color: #fff;
	display: flex;
	justify-content: space-between;
	align-items: center;
	>view:first-child {
		flex: 2;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		>text{
			&:first-child {
				color: #333;
				line-height: 40rpx;
				font-size: 28rpx;
				font-weight: 500;
			}
			&:last-child {
				margin-top: 4rpx;
				color: #999;
				font-size: 24rpx;
			}
		}
	}
	>text.iconfont {
		flex: 1;
	}
}
</style>
