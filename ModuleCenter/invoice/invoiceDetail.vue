<template>
	<view class="invoiceDetail" :style="{ '--themescolor': themes.color }">
		<ls-header theme></ls-header>
		<template v-if="!$u.test.isEmpty(detailData)">
			<view class="statusWrap flex-center m-0-auto text-fff pb-6">
				<view class="flex-col-center">
					<view class="mb-1">
						<text :class="['iconfont', detailData.hasInvoiceFlag ? 'icon-chenggong': 'icon-shibai']" style="font-size: 32rpx;"></text>
						<text class="font-36 ml-1" style="font-weight: 600; line-height: 50rpx;">{{ detailData.hasInvoiceFlag ? '已' : '未' }}开票</text>
					</view>
					<text class="font-24">商家开具的发票，金额以实际开票为准</text>
				</view>
			</view>
			
			<view class="mainWrap bg-fff text-333">
				<view class="p-4">
					<view>
						<view class="flex-col-center">
							<text class="text-center mb-5 font-28" style="line-height: 40rpx;">{{ detailData.type == 'DEDICATED' ? '增值税' : '普通' }}发票</text>
							<view class="d-flex position-relative">
								<view class="flex-col-center">
									<text class="iconfont icon-success mb-1" :style="{ 'font-size': '32rpx', 'color': themes.color }"></text>
									<text class="font-24">订单提交</text>
								</view>
								<!-- 步骤线 -->
								<view class="stepLine mx-1"></view>
								<view class="flex-col-center">
									<text :class="['iconfont', 'mb-1', detailData.hasInvoiceFlag ? 'icon-success' : 'circle-ball']" :style="{ 'font-size': '32rpx', 'color': detailData.hasInvoiceFlag ? themes.color : '' }"></text>
									<text :class="['font-24', { 'text-ccc' : !detailData.hasInvoiceFlag }]">商家开票</text>
								</view>
							</view>
						</view>
					</view>
					<u-line color="#f8f8f8" :hair-line='false' margin='60rpx 0 40rpx'/>
					<view>
						<view class="invoiceLabel">
							<text class="label-title">发票类型：</text>
							<text>{{ detailData.type == 'DEDICATED' ? '增值税' : '普通' }}发票</text>
						</view>
						<view class="invoiceLabel">
							<text class="label-title">发票内容：</text>
							<text class="line-clamp2">商品明细</text>
						</view>
						<view class="invoiceLabel" v-if="detailData.type != 'DEDICATED'">
							<text class="label-title">抬头类型：</text>
							<text>{{ detailData.titleType == 'PERSONAL' ? '个人' : '公司' }}</text>
						</view>
						<view class="invoiceLabel">
							<text class="label-title">抬头名称：</text>
							<text class="line-clamp2">{{ detailData.company }}</text>
						</view>
						<view class="invoiceLabel">
							<text class="label-title">申请时间：</text>
							<text>{{ detailData.createTime }}</text>
						</view>
					</view>
				</view>
				
				<u-gap height="20"></u-gap>
				<view class="p-4">
					<view class="invoiceLabel">
						<text class="label-title">收件人：</text>
						<text>{{ detailData.name }}</text>
					</view>
					<view class="invoiceLabel">
						<text class="label-title">联系电话：</text>
						<text>{{ detailData.mobile }}</text>
					</view>
					<view class="invoiceLabel">
						<text class="label-title">详细地址：</text>
						<text class="line-clamp2">{{ detailData.address }}</text>
					</view>
				</view>
				
				<u-gap height="20"></u-gap>
				<view class="py-2" v-if="!$u.test.isEmpty(detailData.orderInvoiceDTO) && detailData.orderInvoiceDTO.orderItemList.length">
					<!-- 店铺信息 -->
					<view class="flex-center p-2 font-28 position-relative">
						<view class="flex-1 position-relative mr-2 flex-start text-333" @click="$navigateTo(`/ModuleGoods/shopHome/shopIndex?shopId=${detailData.shopId}`)">
							<text class="iconfont icon-dianpu mr-1 flex-x-center text-000" style="font-size: 32rpx;"></text>
							<text class="line-clamp1" style="width: auto; max-width: 5.3rem; line-height: 40rpx;">{{ detailData.shopName || '&nbsp;' }}</text>
							<text class="iconfont icon-ArrowRight" style="font-size: 20rpx;"></text>
						</view>
					</view>
					
					<view :class="[detailData.orderInvoiceDTO.orderItemList.length == 1 ? 'flex-start': 'position-relative']">
						<!-- 只有一件商品时 -->
						<template v-if="detailData.orderInvoiceDTO.orderItemList.length == 1">
							<view
								class="flex-start p-2 overflow-x flex-1"
								@click="goOrderDetail(detailData.orderId)"
							>
								<ls-image className="mr-2" :options="{ w: '160', h: '160', br: '20',bg:'#ffffff' }" :src="detailData.orderInvoiceDTO.orderItemList[0].pic" />
								<view class="overflow-h font-28 flex-1 flex-col-start overflow-h" style="height: 160rpx">
									<view class="line-clamp2" style="max-height: 72rpx; line-height: 36rpx">{{ detailData.orderInvoiceDTO.orderItemList[0].productName ? detailData.orderInvoiceDTO.orderItemList[0].productName : '&nbsp;' }}</view>
									<view class="text-999 mt-1 font-24 line-clamp1" style="height: 28rpx; line-height: 28rpx" v-if="detailData.orderInvoiceDTO.orderItemList[0].attribute">
										{{ detailData.orderInvoiceDTO.orderItemList[0].attribute }}
									</view>
								</view>
							</view>
							
						</template>
						
						<!-- 多件商品时 -->
						<template v-else>
							<view class="d-flex a-center py-2 pl-2" @click="goOrderDetail(detailData.orderId)">
								<scroll-view style="white-space: nowrap; width: 95%;" scroll-x>
									<view class="d-flex">
										<ls-image
											v-for="item in orderPics"
											:key='item'
											:src="item"
											:options="{ w: '160', h: '160', br: '20' }"
											className="mr-1"
											:customStyle="{flex: '0 0 160rpx'}"
										/>
									</view>
								</scroll-view>
							</view>
						</template>
						
						<!-- 价格显示 -->
						<view
							class="h-200r flex-col-end p-2 font-28"
							style="background-image: linear-gradient(to right, rgba(255,255,255,0.95), rgba(255,255,255,0.95));"
							:class="[detailData.orderInvoiceDTO.orderItemList.length == 1 ? '' : 'position-absolute right-0 top-0 l-gradient-b']"
						>	
							<ls-price notThemes :price="detailData.orderInvoiceDTO.actualTotalPrice" :options="{ is: 32, ds: 32 }" />
							<view class="font-24 mt-2 text-999">共{{ detailData.orderInvoiceDTO.productQuantity }}件</view>
						</view>
					</view>
				</view>
			</view>
		</template>
		
		<ls-empty className="center-xy" :paging="paging" @reLoad="getData" reLoad/>
	</view>
</template>

<script>
	import { invoiceManage } from '@/api/ModulesUser'
	export default {
		data() {
			return {
				invoiceId: null,	// 当前的发票ID
				detailData: null,	// 当前内容
				paging: {
					status: 'loading',
					error: false, // 是否错误
					emptylist: false // 是否显示列表为空时的样式
				},
			}
		},
		computed: {
			// 订单的图片集合
			orderPics({ detailData }) {
				if(!this.$u.test.isEmpty(detailData.orderInvoiceDTO) && detailData.orderInvoiceDTO.orderItemList.length) {
					return detailData.orderInvoiceDTO.orderItemList.map(item => item.pic)
				}else {
					return []
				}
			}
		},
		onLoad(options) {
			// console.log('发票详情--', options)
			this.invoiceId = options.invoiceId
			this.getData()
		},
		methods: {
			// 获取当前发票详情信息
			getData() {
				this.paging = {
					status: 'loading',
					error: false, // 是否错误
					emptylist: false // 是否显示列表为空时的样式
				}
				invoiceManage.getInvoiceDetailFromLi({
					id: this.invoiceId
				}).then(res => {
					// console.log('res--', res.data)
					if(res.code) {
						this.detailData = res.data;
					}
				}).catch(err => {
					this.paging.error = true
				}).finally(() => {
					this.paging.status = 'noMore'
					if (!this.$checkInfo([{ type: 'hasValue', value: this.detailData }])) {
						this.paging.emptylist = true
					}
				})
			},
			
			// 去往订单详情
			goOrderDetail(orderId) {
				uni.navigateTo({
					url: `/ModuleOrder/orderList/orderDetail?orderId=${orderId}`
				});
			},
		}
	}
</script>

<style>
	page {
		background-color: var(--backgroundcolor);
	}
</style>

<style lang="scss" scoped>
.invoiceDetail {
	.statusWrap {
		height:  154rpx;
		background-color: var(--themescolor);
	}
	.mainWrap {
		margin-top: -24rpx;
		border-radius: 24rpx 24rpx 0 0;
		.stepLine {
			width: 80rpx;
			height: 2rpx;
			background-color: #e4e4e4;
			transform: translateY(16rpx) scaleX(2);
		}
		.circle-ball {
			width: 32rpx;
			height: 32rpx;
			background-color: #e4e4e4;
			border-radius: 50%;
		}
		.invoiceLabel {
			font-size: 28rpx;
			line-height: 40rpx;
			color: #333;
			display: flex;
			.label-title {
				flex-shrink: 0;
				flex-basis: 140rpx;
				color: #999;
				margin-right: 20rpx;
			}
			&+.invoiceLabel {
				margin-top: 20rpx;
			}
		}
		::v-deep .u-gap {
			background-color: var(--backgroundcolor) !important;
		}
	}
}
</style>
