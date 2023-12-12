<template>
	<view class="font-28" :class="[{'flex-col-start h-100vh':!isOpen}]" :style="{ '--themescolor': themes.color, '--gradientcolor': themes.rgb08 }" style="padding-bottom: calc(100rpx + var(--safe-area-inset-bottom));">
		<ls-header background="linear-gradient(to right, var(--themescolor), var(--gradientcolor))" showHeadSelect title="订单详情">
			<!-- 左右弧度 -->
			<view slot="bottom">
				<view class="text-fff position-relative flex-center px-4 py-1">
					<view class="flex-1 d-flex flex-column j-center pr-2 text-nowrap">
						<!-- status == 1：待付款(没有付款) -->
						<view v-if="orderDet.status == 1">
							<view class="font-weight">等待支付</view>
							<view class="mt-1 font-24">
								<count-down className="d-inline-block font-20" v-slot="{ times }" :time="orderDet.finalPayTime" :custom="true" @finish="countDownTimeFinish">
									<text v-if="times.days > 0">{{ times.days }}天</text>
									<text v-if="times.hours > 0">{{ times.hours }}时</text>
									<text>{{ times.minutes }}分</text>
									<text>{{ times.seconds }}秒</text>
								</count-down>
								后自动关闭
							</view>
						</view>
				
						<!-- status == 2：待成团(等待业务处理（成团）)， -->
						<view v-if="orderDet.status == 2">
							<view class="font-weight">已付款,等待成团</view>
							<view class="mt-1 font-24" v-if="orderDet.activityDetailDTO && orderDet.activityDetailDTO.endTime">
								需要在
								<count-down className="d-inline-block font-20" v-slot="{ times }" :time="new Date(orderDet.activityDetailDTO.endTime).getTime()" :custom="true" @finish="countDownTimeFinish">
									<text v-if="times.days > 0">{{ times.days }}天</text>
									<text v-if="times.hours > 0">{{ times.hours }}时</text>
									<text>{{ times.minutes }}分</text>
									<text>{{ times.seconds }}秒</text>
								</count-down>
								之内邀请
								<!-- 1位 -->
								好友成团
							</view>
						</view>
				
						<!-- status == 3：已付定金(预售商品已付定金) -->
						<view v-if="orderDet.status == 3">
							<view class="font-weight">已付定金，还未支付尾款：</view>
							<view class="mt-1 font-24" v-if="orderDet.preSellOrderBO && orderDet.preSellOrderBO.finalMEnds">
								<count-down className="d-inline-block font-20" v-slot="{ times }" :time="orderDet.preSellOrderBO.finalMEnds" :custom="true" @finish="countDownTimeFinish">
									<text v-if="times.days > 0">{{ times.days }}天</text>
									<text v-if="times.hours > 0">{{ times.hours }}时</text>
									<text>{{ times.minutes }}分</text>
									<text>{{ times.seconds }}秒</text>
								</count-down>
								后自动关闭
							</view>
						</view>
				
						<!-- status == 5：待发货(已经付款,但卖家没有发货) -->
						<view v-if="orderDet.status == 5">
							<view class="font-weight">等待{{ orderDet.orderType == 'SM' ? '备货' : '发货' }}</view>
							<view class="mt-1 font-24">请耐心等候商家{{ orderDet.orderType == 'SM' ? '备货' : '发货' }}</view>
						</view>
				
						<!-- status == 10：待签收(发货，导致实际库存减少)，status == 15：待收货(投递完成-已签收，待用户确认收货) -->
						<view v-if="orderDet.status == 10 || orderDet.status == 15">
							<view class="font-weight">{{ orderDet.orderType == 'SM' ? '待核销' : orderDet.status == 10?`卖家已发货`:'买家已签收' }}</view>
							<view class="mt-1 font-24">
								剩余
								<count-down class="d-inline-block font-20" v-slot="{ times }" :time="orderDet.orderType == 'SM' ? orderDet.orderSinceMention.mentionGoodsTimeStamp : orderDet.countDownTime" :custom="true" @finish="countDownTimeFinish">
									<text v-if="times.days > 0">{{ times.days }}天</text>
									<text v-if="times.hours > 0">{{ times.hours }}时</text>
									<text>{{ times.minutes }}分</text>
									<text>{{ times.seconds }}秒</text>
								</count-down>
								{{ orderDet.orderType == 'SM' ? '停止提货' : '自动确认收货' }}
							</view>
						</view>
				
						<!-- status == 20：已完成(交易成功（确认收货后），购买数增加1) -->
						<view v-if="orderDet.status == 20">
							<view class="font-weight">交易成功</view>
							<view class="mt-1 font-24">感谢您在{{ systemConfig&&systemConfig.domainName  ? systemConfig.domainName  : '' }}购物，欢迎您再次光临</view>
						</view>
				
						<!-- status == -5：已取消(交易失败,还原库存) -->
						<view v-if="orderDet.status == -5">
							<view class="font-weight">取消订单</view>
							<view class="mt-1 font-24">你的订单已取消</view>
						</view>
						
						<view class="mt-1 font-24 zindex-99"  v-if="orderDet.orderType == 'SM'&&orderDet.orderSinceMention" @click="$stringUtils.lsCopy(orderDet.orderSinceMention.sinceMentionCode)">
							<text class="">提货码：</text>
							<text class="position-relative">
								{{ orderDet.orderSinceMention.sinceMentionCode }}
								<text class="position-absolute bottom-0" style="right: -30rpx" >
									<u-icon name="file-text-fill" color="#ffffff"></u-icon>
								</text>
							</text>
						</view>
					</view>
					<image style="width: 240rpx;height:160rpx" :src="staticServer + 'static/images/order-state.png'" alt="" />
				</view>
				
				<view
					class="position-absolute rounded-circle bg-transparent w-40r h-40r left-0"
					:style="'bottom: -40rpx; box-shadow: -20rpx -20rpx 0rpx 0rpx' + themes.color"
				></view>
				<view
					class="position-absolute rounded-circle bg-transparent w-40r h-40r right-0"
					:style="'bottom: -40rpx; box-shadow: 20rpx -20rpx 0rpx 0rpx' + themes.rgb08"
				></view>
			</view>
			<!-- /左右弧度 -->
		</ls-header>
		<template v-if="!$u.test.isEmpty(orderDet)">
			<view :class="[{'overflow-h flex-1 w-100':!isOpen}]" @click.stop>
				<template>
					<!-- 快递最新信息 -->
					<view
						class="py-3 px-2 border-bottom  transition-all05"
						v-if="orderDet.orderLogisticsDTO && orderDet.orderLogisticsDTO.id && orderDet.orderLogisticsDTO.trackingInformation"
					>
						<view class="d-flex" @click.stop="$navigateTo('/ModuleOrder/logistics/logistics?orderNumber=' + orderDet.orderNumber)">
							<text class="iconfont icon-zuji1 mr-1 text-main" style="font-size: 36rpx;"></text>
							<view class="flex-1">
								<view class="d-flex a-center">
									<text class="">{{ JSON.parse(orderDet.orderLogisticsDTO.trackingInformation)[0].context }}</text>
								</view>
								<view class="text-999 mt-1">{{ JSON.parse(orderDet.orderLogisticsDTO.trackingInformation)[0].time }}</view>
							</view>
						</view>
					</view>
					<view class="py-3 px-2 text-333">
						<template v-if="orderDet.orderType != 'SM'">
							<view class="d-flex">
								<view class="w-30r h-30r mr-2"><u-icon name="map" :color="themes.color" size="36"></u-icon></view>
								<view>
									<view class="d-flex a-center">
										<!-- 收货人 -->
										<text class="">{{ orderDet.receiver }}</text>
										<!-- 收货人电话 -->
										<text class="ml-3">{{ orderDet.mobile }}</text>
									</view>
									<!-- 收货地址 -->
									<view class="mt-1 font-24 word-breakall">{{ orderDet.receiverAddress ? orderDet.receiverAddress : (orderDet.fullAddress || '' + orderDet.detailAddress || '') }}</view>
								</view>
							</view>
						</template>
						<template v-else>
							<view class="font-28" v-if="orderDet.orderSinceMention">
								<view class="flex-between">
									<text style="flex-basis: 180rpx;">提货人：</text>
									<text class="ml-1">{{ orderDet.orderSinceMention.userContactName }}</text>
								</view>
								<view class="my-3 flex-between">
									<text style="flex-basis: 180rpx;">手机号码：</text>
									<text class="ml-1">{{ orderDet.orderSinceMention.userContactPhone }}</text>
								</view>
								<view class="border-top"></view>
								<view class="mt-3 flex-between">
									<text style="flex-basis: 180rpx;">自提点：</text>
									<text class="ml-1">{{ orderDet.orderSinceMention.pointName }}</text>
								</view>
								<view class="mt-3 flex-between">
									<text style="flex-basis: 180rpx;">提货地址：</text>
									<text class="ml-1 word-breakall">{{ orderDet.orderSinceMention.provinceCityDistrictAddr + orderDet.orderSinceMention.sinceMentionDetailAddr }}</text>
								</view>
								<view class="mt-3 d-flex j-sb">
									<text style="flex-basis: 180rpx;">营业时间：</text>
									<view class="ml-1 flex-col-end">
										<text class="">{{ orderDet.orderSinceMention.period }}</text>
										<text v-for="(time, tIdx) in splitTimes(orderDet.orderSinceMention.businessHours)" :key="tIdx">{{ time }}</text>
									</view>
								</view>
								<view class="mt-3 flex-between">
									<text style="flex-basis: 180rpx;">自提点电话：</text>
									<text class="ml-1">{{ orderDet.orderSinceMention.sinceMentionPhone }}</text>
								</view>
							</view>
						</template>
					</view>
				</template>

				<view class="order-list border-top-20bg border-bottom-20bg">
					<view class="">
						<view class="flex-between px-2">
							<view class="d-flex font-28 py-2 a-center" @click="$navigateTo(`/ModuleGoods/shopHome/shopIndex?shopId=${orderDet.shopId}`)">
								<text class="iconfont icon-dianpu" style="font-size: 28rpx;"></text>
								<text class="ml-1">{{ orderDet.shopName }}</text>
							</view>
							<view class="text-main" v-if="orderTypeName">
								{{orderTypeName}}
							</view>
						</view>

						<view v-for="(item, index) in orderDet.orderItemDTOList" :key="index">
							<view class="d-flex pt-2 pb-3 mx-2" @click="toGoodsDetail(item)">
								<ls-image className="mr-1" :options="{ w: '180', h: '180', br: '12' }" :src="item.pic"/>
								<view class="flex-1 overflow-h d-flex">
									<view class="flex-1 overflow-h pr-4">
										<view class="line-clamp2 font-weight">{{ item.productName }}</view>
										<view class="line-clamp1 font-20 text-999">
											<text class="bg-f8 rounded-5 px-2 py" v-if="item.attribute">{{ item.attribute }}</text>
										</view>
										<view
											class="text-warning mt-1"
											style="color: #fa8c00;"
											v-if="orderDet.orderType != 'I' && item.deductionAmount"
										>
											积分已抵扣￥{{ item.deductionAmount }}
										</view>
									</view>
									<view class="font-28 text-right">
										<view v-if="orderDet.orderType == 'I'">{{ item.integral }}积分</view>
										<view class="" v-else>
											{{ item.price|priceFilter }}
											<view class="text-danger" v-if="item.selfPurchaseAmount">
												<text>省</text>
												{{item.selfPurchaseAmount|priceFilter}}
											</view>
										</view>
										<view class="font-24 text-999 mt-1">x{{ item.basketCount }}</view>
									</view>
								</view>
							</view>
							<view class="flex-1 d-flex  a-center border-bottom pb-2" v-if="orderDet.status >= 10">
								<view class="ml-2" style="color: #f56c6c" v-if="item.refundStatus == 1"><text>售后处理中</text></view>
								<view class="d-flex flex-1 j-end">
									<view
										v-if="currentTime < orderDet.finalReturnDeadlineTimestamp && !item.refundStatus"
										class="rounded-50 d-block pt-1 pb-1 pl-3 pr-3 mr-2 border border-e4"
										style="line-height: 36rpx"
										@click="$navigateTo(`/ModuleOrder/service/serviceRefund?orderId=${item.orderId}&orderItemId=${item.id}`)"
									>
										申请退货
									</view>
									<view
										class="rounded-50 d-block mr-2 w-160r h-56r flex-center border border-main text-main"
										@click="addCar(item.productId, item.skuId)"
									>
										加购物车
									</view>
								</view>
							</view>
						</view>
						<view class="d-flex j-center a-center py-2" v-if="contactInfo.openFlag">
			                <text class="iconfont icon-kefu2"></text>
							<view class="ml-1" @click="serviceChat">联系客服</view>
						</view>
					</view>
				</view>
				<view class="px-2 py-4 text-333">
					<view class="">
						<view class="text-nowrap">
							<view class="pb-3 flex-between">
								<text class="">订单编号：</text>
								<view class="flex-end">
									<text class="">{{ orderDet.orderNumber }}</text>
									<text class="ml-2 bg-f5 rounded-100 font-20 w-100r h-50r flex-center line-h" @click="$stringUtils.lsCopy(orderDet.orderNumber)">复制</text>
								</view>
							</view>
							<view class="pb-3 flex-between">
								<text class="">下单时间：</text>
								<text>{{ orderDet.createTime }}</text>
							</view>
							<view class="pb-3 flex-between" v-if="orderDet.payTime">
								<text class="">支付时间：</text>
								<text>{{ orderDet.payTime || '-' }}</text>
							</view>
							<view class="pb-3 flex-between" v-if="orderDet.deliveryTime">
								<text class="">发货时间：</text>
								<text>{{ orderDet.deliveryTime }}</text>
							</view>
							<view class="pb-3 flex-between">
								<text class="">配送方式：</text>
								<text>{{ orderDet.orderType == 'SM' ? '到店自提' : orderDet.orderLogisticsDTO&&orderDet.orderLogisticsDTO.logisticsCompany?orderDet.orderLogisticsDTO.logisticsCompany:'快递配送' }}</text>
							</view>
							<view class="pb-3 flex-between" v-if="orderDet.orderLogisticsDTO&&orderDet.orderLogisticsDTO.shipmentNumber" @click="$navigateTo('/ModuleOrder/logistics/logistics?orderNumber=' + orderDet.orderNumber)">
								<text class="">物流单号：</text>
								<view class="">
									<text>{{ orderDet.orderLogisticsDTO.shipmentNumber }}</text>
									<text class="iconfont icon-ArrowRight text-bbb" style="font-size: 30rpx;"></text>
								</view>
							</view>
							<view class="pb-3 flex-between" v-if="orderDet.orderLogisticsDTO && orderDet.orderLogisticsDTO.id && orderDet.orderLogisticsDTO.trackingInformation&&JSON.parse(orderDet.orderLogisticsDTO.trackingInformation)[0].time">
								<text class="">签收时间：</text>
								<view class="">
									<text>{{ JSON.parse(orderDet.orderLogisticsDTO.trackingInformation)[0].time }}</text>
								</view>
							</view>
							<view class="pb-3 flex-between" v-if="orderDet.completeTime">
								<text class="">收货时间：</text>
								<text>{{ orderDet.completeTime }}</text>
							</view>
							<!-- 如果是预售订单 -->
							<template v-if="orderDet.orderType == 'P'&&orderDet.preSellOrderBO">
								<view class="pb-3 pt-3 flex-between border-top border-f1">
									<text class="">商品类型：</text>
									<text>
										{{
											orderDet.preSellOrderBO.payPctType
												? `定金预售(定金:￥${orderDet.preSellOrderBO.preDepositPrice},尾款:￥${orderDet.preSellOrderBO.finalPrice})`
												: '全额预售'
										}}
									</text>
								</view>
								<view class="pb-3 flex-between">
									<text class="text-nowrap">预售时间：</text>
									<view class="zoom-09 d-inline-block">
										{{ orderDet.preSellOrderBO.preSaleStart }} 至 {{ orderDet.preSellOrderBO.preSaleEnd }}
									</view>
								</view>
								<view class="pb-3 flex-between">
									<text class="text-nowrap">发货时间：</text>
									<view class="zoom-09 d-inline-block">
										{{ orderDet.preSellOrderBO.preDeliveryTime }} 至 {{ orderDet.preSellOrderBO.preDeliveryEndTime }}
									</view>
								</view>
							</template>
						</view>
						<view class="pt-3 border-top border-f1">
							<view class="" v-if="deliveryDto.logisticsName || orderDet.status != 1 || orderDet.payTypeName">
								<view class="pb-3 flex-between" v-if="orderDet.status != 1 && orderDet.payTypeName && orderDet.orderType != 'I'">
									<text class="">支付类型：</text>
									<text>{{ orderDet.payTypeName }}</text>
								</view>
								<view class="pb-3 flex-between" v-if="deliveryDto.logisticsName">
									<text class="">配送方式：</text>
									<text>{{ deliveryDto.logisticsName }}</text>
								</view>
								<!-- 发票 -->
								<view class="" v-if="orderDet.orderType != 'I'">
									<view class="" v-if="deliveryDto.needInvoiceFlag">
										<view>
											<view class="pb-3 pt-3 flex-between border-top border-f1">
												<text class="">发票类型：</text>
												<text v-if="orderDet.invoiceType == 'NORMAL'">普通发票</text>
												<text v-else>增值税专票</text>
											</view>
											<view class="pb-3 d-flex j-sb">
												<text class="text-nowrap">发票抬头：</text>
												<text>{{ `[${orderDet.titleType == 'PERSONAL' ? '个人抬头' : '公司名称'}] ${orderDet.invoiceCompany}` }}</text>
											</view>
											<view class="" v-if="orderDet.invoiceType == 'DEDICATED'">
												<view class="pb-3 flex-between">
													<text class="">纳税人编号：</text>
													<text>{{ orderDet.invoiceHumNumber }}</text>
												</view>
												<view class="pb-3 d-flex j-sb">
													<text class="text-nowrap">开户银行：</text>
													<text>{{ orderDet.invoiceDepositBank }}</text>
												</view>
												<view class="pb-3 flex-between">
													<text class="">开户账号：</text>
													<text>{{ orderDet.invoiceBankAccountNum }}</text>
												</view>
												<view class="pb-3 d-flex j-sb">
													<text class="text-nowrap">注册地址：</text>
													<text>{{ orderDet.invoiceRegisterAddr }}</text>
												</view>
												<view class="pb-3 flex-between">
													<text class="">注册电话：</text>
													<text>{{ orderDet.invoiceRegisterPhone }}</text>
												</view>
											</view>
										</view>
									</view>
									<view class="pb-3 flex-between" v-else>
										<text class="">开具发票：</text>
										<text>不开具</text>
									</view>
								</view>
							</view>
							<view class="pb-3 d-flex j-sb">
								<text class="text-nowrap">买家留言：</text>
								<text class="word-breakall font-arial">{{ orderDet.message == null || orderDet.message === 'null' ? '暂无' : orderDet.message }}</text>
							</view>
						</view>
					</view>
					<view class="border-top border-f1 pt-3">
						<view class="">
							<view class="pb-3 d-flex j-sb" v-if="orderDet.activeId&&orderDet.activityDetailDTO">
								<text class="">商品活动价：</text>
								<view class="flex-col-end" v-if="orderDet.activityDetailDTO.freeFlag">
									{{orderDet.totalPrice|priceFilter}}
									<!-- 开启了团长优惠才显示 -->
									<view class="font-24">
										<text>(商品活动价</text>
										{{orderDet.activityDetailDTO.activityPrice|priceFilter}}
										<text>，团长优惠{{ orderDet.activityDetailDTO.headerDiscount * 10 }}折)</text>
									</view>
								</view>
								<view v-else>
									{{orderDet.activityDetailDTO.activityPrice|priceFilter}}
								</view>
							</view>
							<view class="pb-3 d-flex j-sb" v-if="orderDet.orderType == 'I'">
								<text class="">总积分：</text>
								<view>{{ orderDet.totalIntegral }}&nbsp;积分</view>
							</view>
							<template v-if="orderDet.orderType != 'I'">
								<view class="pb-3 d-flex j-sb">
									<text class="">商品总额：</text>
									<view><ls-price notThemes :price="orderDet.totalPrice" /></view>
								</view>
							</template>
							<view v-if="orderDet.orderType != 'SM'" class="pb-3 d-flex j-sb">
								<text class="">运&emsp;&emsp;费：</text>
								<view>{{orderDet.freightPrice|priceFilter}}</view>
							</view>
							<template v-if="orderDet.orderType != 'I'">
								<view class="pb-3 d-flex j-sb">
									<text class="">促销优惠：</text>
									<view>-{{orderDet.discountTotalAmount|priceFilter}}</view>
								</view>
								<view class="pb-3 d-flex j-sb" v-if="orderDet.orderType == 'O' || orderDet.orderType == 'P' || orderDet.orderType == 'SM'">
									<text class="">店铺优惠券：</text>
									<view>-{{orderDet.couponAmount|priceFilter}}</view>
								</view>
								<view class="pb-3 d-flex j-sb" v-if="orderDet.orderType == 'O' || orderDet.orderType == 'P'  || orderDet.orderType == 'SM'">
									<text class="">平台优惠券：</text>
									<view>-{{orderDet.platformCouponAmount|priceFilter}}</view>
								</view>
								<view class="pb-3 d-flex j-sb" v-if="orderDet.selfPurchaseAmount">
									<text class="">自购返优惠：</text>
									<view>-{{orderDet.selfPurchaseAmount|priceFilter}}</view>
								</view>
								<view class="pb-3 d-flex j-sb" v-if="orderDet.totalDeductionAmount">
									<text class="">积分抵扣：</text>
									<view>-<ls-price notThemes :price="orderDet.totalDeductionAmount" /></view>
								</view>
								<template v-if="orderDet.orderType == 'P' && orderDet.payPctType == 1">
									<view class="pb-3 d-flex j-sb">
										<text class="">定&emsp;&emsp;金：</text>
										<view><ls-price :notThemes="orderDet.isPayDeposit == 0 ? false : true" :price="orderDet.preDepositPrice" /></view>
									</view>
									<view class="pb-3 d-flex j-sb">
										<text class="">尾&emsp;&emsp;款：</text>
										<view><ls-price :notThemes="orderDet.isPayDeposit == 1 && orderDet.isPayFinal == 0 ? false : true" :price="orderDet.finalPrice" /></view>
									</view>
								</template>
								
								<!-- 暂时没有这功能，以后会有 -->
								<view class="pb-3 d-flex j-sb" v-if="orderDet.changedPrice && orderDet.changedPrice != 0">
									<text class="">商家改价：</text>
									<view>
										{{ orderDet.changedPrice > 0 ? '+' : '' }}￥
										<text class="now">{{ Money(orderDet.changedPrice)[0] }}</text>
										.{{ Money(orderDet.changedPrice)[1] }}
									</view>
								</view>
								
								<view class="pb-3 d-flex j-sb">
									<view v-if="orderDet.orderType == 'P' && orderDet.payPctType == 1 && orderDet.isPayDeposit == 0">
										<text class="">应付定金：</text>
										<ls-price :price="orderDet.preDepositPrice" :options="{ is: 32 }" />
									</view>
									<view v-else-if="orderDet.orderType == 'P' && orderDet.payPctType == 1 && orderDet.isPayDeposit == 1 && orderDet.isPayFinal == 0">
										<text class="">待付尾款(含运费)：</text>
										<ls-price :price="(orderDet.actualTotal - orderDet.preDepositPrice).toFixed(2)" :options="{ is: 32 }" />
									</view>
									<view class="text-right w-100" v-else>
										应付总额：<text class="text-main">{{orderDet.actualTotalPrice|priceFilter}}</text>
										<template v-if="orderDet.orderPayTypeList&&orderDet.orderPayTypeList.length">
											(
											<block v-for="(item1,index1) in orderDet.orderPayTypeList" :key="index1">
												<text :class="{'mr-2':index1<(orderDet.orderPayTypeList.length-1)}" v-if="item1.payAmount">{{item1.payName}}:￥{{item1.payAmount}}</text>
											</block>
											)
										</template>
									</view>
								</view>
							</template>
						</view>
					</view>
				</view>
			</view>

			<!-- 展开/收起 -->
			<view class="w-100 text-333 zindex-2" :class="isOpen ? 'is-open' : 'is-no-open'">
				<view class="m-0-auto text-center font-24" style="width: 160rpx;height: 50rpx;line-height: 50rpx;" @click="openContent">
					{{ isOpen ? '收起' : '展开' }}
					<text class="iconfont ml-1" :class="isOpen ? 'icon-ArrowUp' : 'icon-ArrowDown'" style="font-size: 24rpx;"></text>
				</view>
			</view>
			
			<!-- 底部按钮 -->
			<view class="position-fixed bottom-0 zindex-100 w-100 safearea-bb-white text-nowrap">
				<view class="bg-fff w-100 flex-end h-100r px-2 border-top font-24">
					<!-- status == 1：待付款(没有付款) -->
					<template v-if="orderDet.status == 1">
						<view class="py-1 px-3 border border-e4 rounded-100 mr-1">
							<picker @change="onConfirm($event, orderDet.orderNumber)" :value="0" :range="columns">取消订单</picker>
						</view>
						<view class="bg-main text-fff py-1 px-3 border rounded-100" @click="goPayOrder">立即付款</view>
					</template>

					<!-- status == 2：待成团(等待业务处理（成团）)，status == 5：待发货(已经付款,但卖家没有发货) -->
					<template v-if="orderDet.status == 2 || orderDet.status == 5">
						<view v-if="orderDet.refundStatus" class="flex-1 d-flex a-center ml-2">
							<view class="d-flex" style="color: #f56c6c"><text>售后处理中</text></view>
						</view>
						<view v-if="!orderDet.refundStatus" class="py-1 px-3 border border-e4 rounded-100" @click="showRefund = true">申请退款</view>
						<view class="py-1 px-3 border border-e4 rounded-100 ml-1" @click="goBuy(orderDet.orderNumber)">再来一单</view>
						<view
							v-if="orderDet.status != 2 && !orderDet.refundStatus"
							class="py-1 px-3 border border-main rounded-100 ml-1 bg-main text-fff"
							@click="remindDelivery(orderDet.shopId, orderDet.orderNumber)"
						>
							提醒{{ orderDet.orderType == 'SM' ? '备货' : '发货' }}
						</view>
						<view
							v-if="orderDet.orderType == 'SM'"
							class="py-1 px-3 border border-main rounded-100 ml-1 bg-main text-fff"
							@click="showVoucher(orderDet.orderSinceMention, orderDet.status)"
						>
							提货凭证
						</view>
					</template>

					<!-- status == 3：已付定金(预售商品已付定金)，refundStatus == 0：没有退货或退款 -->
					<template v-if="orderDet.status == 3">
						<view class="border border-e4 rounded-50 py-1 px-3 mr-2 pointer-none text-999" v-if="orderDet.preSellOrderBO.finalMEnds <= currentTime">已过期</view>
						<view
							class="border rounded-50 py-1 px-3"
							:class="
								orderDet.preSellOrderBO.finalMStarts < currentTime && currentTime < orderDet.preSellOrderBO.finalMEnds
									? 'border-main text-main'
									: 'border-e4 but-pe-none'
							"
							@click="goPayOrder"
						>
							立即付尾款
						</view>
					</template>

					<!-- status == 10：待签收(发货，待签收，导致实际库存减少)，status == 15 待收货（投递完成，待用户确认收货） -->
					<template v-if="orderDet.status == 10||orderDet.status == 15">
						<view
							class="py-1 px-3 border border-e4 rounded-100"
							@click="$navigateTo(`/ModuleOrder/service/serviceRefund?orderId=${orderDet.id}`)"
							v-if="!orderDet.refundStatus"
						>
							申请退货
						</view>
						<view class="py-1 px-3 border border-e4 rounded-100 ml-1" @click="goBuy(orderDet.orderNumber)">再来一单</view>
						<view v-if="orderDet.orderType != 'SM'" class="bg-main text-fff py-1 px-3 border rounded-100 ml-1" @click="confirmGoods(orderDet.id)">确认收货</view>
						<view v-else class="py-1 px-3 border border-main rounded-100 ml-1 bg-main text-fff" @click="showVoucher(orderDet.orderSinceMention, orderDet.status)">提货凭证</view>
					</template>

					<!-- status == 20：已完成(交易成功（确认收货后），购买数增加1),status == -5：已取消(交易失败,还原库存) -->
					<template v-if="orderDet.status == 20 || orderDet.status == -5">
						<view v-if="!orderDet.orderItemDTOList.some(v=>{return v.refundId && v.refundStatus!=2})" class="py-1 px-3 border border-e4 rounded-100 ml-1" @click="deleteOrder(orderDet.id)">删除订单</view>
						<view v-if="orderDet.status == 20 && orderDet.commentValidDayInvoice" class="py-1 px-3 border border-e4 rounded-100 ml-1" @click="$navigateTo(`/ModuleCenter/evaluate/evaluateInfo?orderNumber=${orderDet.orderNumber}`)">评论商品</view>
						<view class="d-flex flex-end ml-1">
							<view
								class="py-1 px-3 border border-e4 rounded-100"
								@click="$navigateTo(`/ModuleOrder/service/serviceRefund?orderId=${orderDet.id}`)"
								v-if="currentTime < orderDet.finalReturnDeadlineTimestamp && !orderDet.refundStatus"
							>
								申请售后
							</view>
							<view class="bg-main text-fff py-1 px-3 border rounded-100 ml-1" @click="goBuy(orderDet.orderNumber)">再次购买</view>
						</view>
					</template>
				</view>
			</view>
		</template>
		<ls-empty className="center-xy" :type="2" :title="'对不起，你要查找的订单不存在！'" :paging="paging" @reLoad="getorderDet(orderId)" reLoad />

		<!-- 售后弹窗 -->
		<u-popup v-model="showRefund" mode="center" border-radius="14" width="80%">
			<view class="p-4 font-24 w-100">
				<view class="flex-center font-32 font-weight mb-4">申请退款</view>
				<view class="d-flex mb-4 a-center">
					<text class="mr-2 flex-1">退款金额：</text>
					
					<view class="flex-2 font-28 text-main">
						<view v-if="orderDet.orderType != 'I' && orderDet.orderType != 'O' && orderDet.orderType != 'SM'">￥{{ orderDet.actualTotalPrice }}</view>
						<view v-else-if="orderDet.orderType == 'O'||orderDet.orderType == 'SM'" class="d-flex">
							<text>￥{{ orderDet.actualTotalPrice }}</text>
							<text v-if="orderDet.totalIntegral">+ {{ orderDet.totalIntegral }} 积分</text>
						</view>
						<view v-else-if="orderDet.orderType == 'I'">{{ orderDet.totalIntegral }} 积分</view>
					</view>
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
		
		<!-- 提货凭证 -->
		<voucherPop
			v-model="voucherShow"
			:voucherInfo="voucherInfo"
		/>
	</view>
</template>

<script>
import countDown from '@/components/common/countdown/count-down.vue';
import voucherPop from './components/voucherPop.vue';

import { orderApi, refundApi } from '@/api/ModulesOrder.js';
import { mapState } from 'vuex';

export default {
	components: { 'count-down': countDown, voucherPop },
	data() {
		return {
			Money: this.$stringUtils.formatNumber,
			orderDet: '',
			addressDto: '', // 地址
			deliveryDto: '',
			columns: ['我不想买了', '信息填写错误，重新拍', '卖家缺货', '其他原因'],
			columsIndex: '', // 退货原因下标
			refundReason: '', // 退货原因
			orderId: '',
			wuliuType: false,
			countDownTimeIsFinish: false, // 让countDownTime与当前时间对比，如果countDownTime小于当前时间，则已过时，让该值变为true
			finalMEndIsFinish: false, // 让finalMEnd与当前时间对比，如果finalMEnd小于当前时间，则已过时，让该值变为true
			isOpen: false, // 展开/收起
			showRefund: false,
			paging: {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false // 是否显示列表为空时的样式
			},
			contactInfo:{},//客服信息
			
			voucherShow: false,	//提货凭证弹窗
			voucherInfo: {},	//提货凭证信息
		};
	},
	computed: {
		...mapState(['timeDiff','systemConfig']),
		// 当前的时间戳
		currentTime() {
			return new Date().getTime() - this.timeDiff;
		},
		orderTypeName(){
			let name = ''
			// 如果是普通订单
			if (this.orderDet.orderType == 'O') {
				name = ''
			}else if(this.orderDet.orderType == 'P'){
				name = '预售订单'
			}else if(this.orderDet.orderType == 'S'){
				name = '秒杀订单'
			}else if(this.orderDet.orderType == 'G'){
				name = '团购订单'
			}else if(this.orderDet.orderType == 'MG'){
				name = '拼团订单'
			}else if(this.orderDet.orderType == 'I'){
				name = '积分订单'
			}else if(this.orderDet.orderType == 'SM'){
				name = '门店自提订单'
			}
			return name
		},
	},
	onLoad(option) {
		this.orderId = option.orderId || null;
	},
	mounted() {
		refundApi.cancelReason().then(res=>{
			if(res.code && res.data.length){
				this.columns = res.data.map(v=>{return v})
			}
		})
	},
	onShow() {
		this.$nextTick(() => {
			if (this.$u.test.isEmpty(this.orderDet)) {
				this.getorderDet(this.orderId);
			}
		});
	},
	methods: {
		// 获取订单详情数据
		getorderDet(orderId) {
			this.paging = {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false // 是否显示列表为空时的样式
			};
			orderApi
				.orderDetail({ orderId: orderId })
				.then(res => {
					if (res.code == 1) {
						this.orderDet = res.data;
						this.addressDto = res.data.detail_address;

						this.deliveryDto = res.data;
						
						if (this.orderDet.shopId) {
							this.$store.dispatch('getContactInfo',this.orderDet.shopId).then(res => {
								if (res) {
									this.contactInfo = res
									console.log(222,this.contactInfo);
								}
							})
						}
						
					}
				})
				.catch(err => {
					this.paging.error = true;
				})
				.finally(res => {
					this.paging.status = 'noMore';
					if (!this.$checkInfo([{ type: 'hasValue', value: this.orderDet }])) {
						this.paging.emptylist = true;
					}
				});
		},
		// 展开/收起
		openContent() {
			this.isOpen = !this.isOpen;
		},
		// 确认收货
		confirmGoods(orderId) {
			uni.showModal({
				title: '确认收货',
				content: '您确定要收货?请务必要收到货后再执行此操作',
				success: res => {
					if (res.confirm) {
						orderApi.confirmDeliver({ orderId }).then(res => {
							if (res.code == 1) {
								uni.showToast({
									title: '收货成功!',
									icon: 'none',
									mask: true,
									complete: () => {
										setTimeout(() => {
											this.getorderDet(this.orderId);
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
		// 去客服
		serviceChat() {
			this.$navigateTo(`/ModuleCenter/contact/contact?shopId=${this.orderDet.shopId}&shopContactDTO=${encodeURIComponent(JSON.stringify(this.contactInfo))}`)
		},

		// 删除订单
		deleteOrder(orderId) {
			console.log(orderId);
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
											uni.redirectTo({
												url: '/ModuleOrder/orderList/orderList'
											});
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
		// 提醒发货
		remindDelivery(shopId, orderNumber) {
			orderApi.remindDelivery({ shopId: shopId, orderNumber: orderNumber }).then(res => {
				if (res.code == 1) {
					uni.showToast({ title: '提醒成功，商家正在尽快处理', icon: 'none' });
				}
			});
		},
		// 取消订单
		cancelOrder(orderId) {
			this.orderId = orderId;
		},

		// 最终确认取消订单
		onConfirm(e, orderNumber) {
			orderApi.cancelOrder({ cancelReason: this.columns[e.target.value], orderNumber: orderNumber }).then(res => {
				if (res.code == 1) {
					this.getorderDet(this.orderId);
					uni.showToast({title: '取消订单成功',icon: 'none',mask: true});
				}
			});
		},
		goPayOrder() {
			let payParams = {
				orderNumber: encodeURIComponent(JSON.stringify([this.orderDet.orderNumber])),
				settlementType: this.orderDet.orderType == 'P' ? (this.orderDet.status == 3 ? 'PRE_SALE_ORDER_FINAL' : 'PRE_SALE_ORDER_DEPOSIT') : 'ORDINARY_ORDER'
			};
			this.$navigateTo(`/ModuleOrder/submitOrder/payOrder${this.$u.queryParams(payParams)}`);
		},

		// 加入购物车
		addCar(prodId, skuId) {
			orderApi
				.addCart({
					count: 1,
					productId: prodId,
					shopId: this.orderDet.shopId,
					skuId: skuId
				})
				.then(res => {
					if (res.code) {
						uni.showToast({ title: '加入购物车成功', icon: 'success' });
						setTimeout(() => {
							this.$navigateTo('/pages/cart/cart');
						}, 2000);
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		// 再次购买
		goBuy(orderNumber) {
			orderApi.buyAgain({ orderNumber }).then(res => {
				if (res.code == 1) {
					this.$switchTab(`/pages/cart/cart`);
				}
			});
		},
		refreshPage() {
			this.getorderDet(this.orderId);
		},
		// count-down组件回调
		countDownTimeFinish() {
			this.countDownTimeIsFinish = true;
			this.getorderDet(this.orderId);
		},
		// count-down组件回调
		finalMEndFinish() {
			this.finalMEndIsFinish = true;
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
					orderId: this.orderId,
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
								this.getorderDet(this.orderId);
							}, 1000);
						}
					});
				})
				.catch(err => {
					console.log('refund err', err);
				});
		},

		// 点击客服
		goService() {
			uni.showToast({
				title: '该商家未设置客服',
				icon: 'none'
			});
		},

		// 跳转到商品详情
		toGoodsDetail(item) {
			console.log(item, 'item');
			const obj = { MG: 'MERGE', G: 'GROUP', S: 'SECKILL' };
			const skuType = obj[this.orderDet.orderType];
			if (item.productStatus === 0) {
				this.$navigateTo(
					`/ModuleGoods/goodsDetail/snapshotDetail?id=${item.productId}&snapshotId=${item.snapshotId}&activityId=${this.orderDet.activeId}&skuType=${skuType}${skuType == 'SECKILL' ? '&skuId=' + item.skuId : ''}`
				);
			} else {
				if (skuType) {
					// 活动商品的跳转
					this.$navigateTo(
						`/ModuleGoods/goodsDetail/goodsDetail?id=${item.productId}&activityId=${this.orderDet.activeId}&skuType=${skuType}${skuType == 'SECKILL' ? '&skuId=' + item.skuId : ''}`
					);
				} else {
					// 普通商品和预售的跳转
					this.$navigateTo(`/ModuleGoods/goodsDetail/goodsDetail?id=${item.productId}`);
				}
			}
		},
		
		// 展示提货凭证
		showVoucher(orderSinceMention, orderStatus) {
			this.voucherShow = true;
			this.voucherInfo = { ...orderSinceMention, orderStatus };
		},
		
		// [自提订单]切割时间段
		splitTimes(times) {
			return times.split(',')
		},
	}
};
</script>

<style lang="scss" scoped>
.is-no-open {
	background-image: linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.8));
	padding-top: 80rpx;
	padding-bottom: 20rpx;
	margin-top: -80rpx;
}
.is-open {
	position: relative;
	padding-bottom: 40rpx;
	margin-top: -40rpx;
}
</style>
