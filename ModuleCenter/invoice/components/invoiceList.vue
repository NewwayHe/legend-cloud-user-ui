<template>
	<!-- 发票列表 -->
	<view class="invoiceList">
		<!-- 顶部tab栏 -->
		<ls-tabs :list="tabList" :zIndex="98" fixed @change="switchTab" />
		
		<!-- 内容区域 -->
		<view v-if="!$u.test.isEmpty(invoiceList)" class="safearea-bb">
			<ls-load-more :status="paging.status">
				<view v-for="invoice in invoiceList" :key="invoice.id" class="bg-fff mt-2 py-2">
					<!-- 店铺信息 -->
					<view class="flex-center p-2 font-28 position-relative">
						<view class="flex-1 position-relative mr-2 flex-start" @click="$navigateTo(`/ModuleGoods/shopHome/shopIndex?shopId=${invoice.shopId}`)">
							<text class="iconfont icon-dianpu text-333 mr-1 flex-x-center" style="font-size: 28rpx;"></text>
							<text class="line-clamp1" style="width: auto; max-width: 5.3rem">{{ invoice.shopName || '&nbsp;' }}</text>
							<text class="iconfont icon-ArrowRight text-bbb" style="font-size: 28rpx;"></text>
						</view>
						<text class="font-28 text-main text-right" v-if="!invoice.hasInvoiceFlag">未开票</text>
						<!-- 已开票的图 -->
						<view class="position-absolute right-0 top-0 w-150r h-120r overflow-h" v-else>
							<ls-signet size="150" space="30" rotate="-30" fontSize="26" type="2"  color="#E4E4E4" scale="0.9" borderWidth="4">
								已开票
							</ls-signet>
						</view>
					</view>
					
					<!-- 商品内容 -->
					<view :class="[invoice.orderProductNum == 1 ? 'flex-start': 'position-relative']">
						<!-- 只有一件商品时 -->
						<template v-if="invoice.orderProductNum == 1">
							<view
								class="flex-start p-2 overflow-x flex-1"
								@click="goOrderDetail(invoice.orderId)"
							>
								<ls-image className="mr-2" :options="{ w: '160', h: '160', br: '20',bg:'#ffffff' }" :src="invoice.orderProductPics[0]" />
								<view class="overflow-h font-28 flex-1 flex-col-start overflow-h" style="height: 160rpx">
									<view class="line-clamp2" style="max-height: 72rpx; line-height: 36rpx">{{ invoice.productName ? invoice.productName : '&nbsp;' }}</view>
									<view class="text-999 mt-1 font-24 line-clamp1" style="line-height: 28rpx" v-if="invoice.attribute">
										{{ invoice.attribute }}
									</view>
								</view>
							</view>
							
						</template>
						
						<!-- 多件商品时 -->
						<template v-else>
							<view class="d-flex a-center py-2 pl-2" @click="goOrderDetail(invoice.orderId)">
								<scroll-view style="white-space: nowrap; width: 95%;" scroll-x>
									<view class="d-flex">
										<ls-image
											v-for="item in invoice.orderProductPics"
											:key='item'
											:src="item"
											:options="{ w: '160', h: '160', br: '20' }"
											className="mr-1"
											:customStyle="{flex:'0 0 160rpx'}"
										/>
									</view>
								</scroll-view>
							</view>
						</template>
						
						<!-- 价格显示 -->
						<view
							class="h-200r flex-col-end p-2 font-28"
							style="background-image: linear-gradient(to right, rgba(255,255,255,0.95), rgba(255,255,255,0.95));"
							:class="[invoice.orderProductNum == 1 ? '' : 'position-absolute right-0 top-0 l-gradient-b']"
						>	
							<ls-price notThemes :price="invoice.orderPrice" :options="{ is: 32, ds: 32 }" />
							<view class="font-24 mt-2 text-999">共{{ invoice.orderProductNum }}件</view>
						</view>
					</view>
					
					<!-- 发票备注 -->
					<view class="px-2 pb-2">
						<view class="bg-f8 font-24 p-2 rounded-12">
							<view class="text-333" v-if="invoice.type == 'DEDICATED'">增值税发票</view>
							<view class="text-333" v-else>普通发票-{{ invoice.titleType == 'PERSONAL' ? '个人' : '公司' }}</view>
							<view class="mt-1 text-999 line-clamp1">抬头名称 {{ invoice.company }}</view>
						</view>
					</view>
					
					<!-- 查看详情 -->
					<view class="p-2 flex-end">
						<ls-button className="w-160r h-60r flex-center m-0" :ripple="false" hoverClass="none"
							text="发票详情"
							@click="goVoiceDetail(invoice.id)"
							:options="{ br: '30', ls: '3', fs: '24', bd: '#DCDFE6', pl: '0', pr: '0' }"></ls-button>
					</view>
				</view>
			</ls-load-more>
		</view>
		
		<ls-empty v-else className="center-xy" title="您没有相关发票" :paging="paging" @reLoad="getData" reLoad/>
	</view>
</template>

<script>
	import { invoiceManage } from '@/api/ModulesUser'
	import pageUtil from '@/utils/pageUtils.js';
	const invoicePage = new pageUtil(invoiceManage.getUserInvoice, { field: { list: 'invoiceList'} });
	export default {
		data() {
			return {
				tabList: ['全部', '已开发票', '未开发票'],	//tab列表项
				paging: {		//这个必须写 因为pageUtils是在调用了loadListByPage之后才往this身上加paging 页面上ls-empty使用了该变量
					status: 'loading',
					error: false, // 是否错误
					emptylist: false // 是否显示列表为空时的样式
				},
				invoiceParams: {		//发票列表参数
					// curPage: 2,	//调试用
					pageSize: 6,
					hasInvoiceFlag: undefined,		//是否开发票 false为否
				},		
				invoiceList: [],		//发票列表数据
			}
		},
		mounted() {
			// console.log('重新Mounted')
			this.getData()
		},
		methods: {
			// 分页tab切换
			switchTab(item) {
				let invoiceStatus = [undefined, true, false];	//tab对应的请求参数
				this.invoiceParams.hasInvoiceFlag = invoiceStatus[item.index]
				this.getData()
			},
			
			getData() {
				invoicePage.loadListByPage(this, this.invoiceParams)
			},
			
			loadMore() {
				invoicePage.loadListByPageMore()
			},
			
			// 去往订单详情
			goOrderDetail(orderId) {
				uni.navigateTo({
					url: `/ModuleOrder/orderList/orderDetail?orderId=${orderId}`
				});
			},
			
			// 去往发票详情
			goVoiceDetail(invoiceId) {
				this.$u.route('/ModuleCenter/invoice/invoiceDetail', {
					invoiceId
				})
			}
		}
	}
</script>

<style lang='scss' scoped>
</style>
