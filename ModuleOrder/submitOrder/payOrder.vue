<template>
	<!-- //免费支付不显示页面 -->
	<view class="overflow-h" :style="{ '--themescolor': themes.color }">
		<view class="" v-if="!$u.test.isEmpty(payInfo.businessOrderNumberList)">
			<!-- 支付金额 -->
			<view class="bg-white w-100 text-center">
				<view class="font-24">
					<view class="font-28 w-100 h-80r flex-start pl-2" style="background: #FFF7ED;color: #D68652;">
						<text class="iconfont icon-laba1 mr-1" style="font-size: 32rpx;"></text>
						提交成功，请尽快付款，逾期未付款订单自动关闭
					</view>
					<view class="pt-3">
						<view class="line-clamp1"><ls-price :price="payInfo.amount" :options="{ is: 56,ds:32, iw: 'bold' }" /></view>
					</view>
					<view class="font-24 pb-4">
						剩余支付时间：
						<count-down className="d-inline-block font-20" @finish="payTimeEnd" v-slot="{ times }" :time="payInfo.orderCancelCountdownEndTime" :custom="true">
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
			<!-- 业务单号 -->
			<view class="bg-white px-2 mt-2">
				<view class="d-flex a-center" style="padding: 24rpx 0;">
					<text class="item-b">业务单号：</text>
					<text class="flex-1 line-clamp1">{{ payInfo.businessOrderNumberList.join() }}</text>
				</view>
				<view class="d-flex a-center" style="padding-bottom: 24rpx;">
					<text class="item-b">交易信息：</text>
					<text class="flex-1 line-clamp1">{{ payInfo.subjectList.join() }}</text>
				</view>
			</view>

			<view class="bg-white mt-2 px-2">
				<radio-group @change="changePay">
					<label class="d-flex j-sb a-center pt-2 pb-2 font-28 border-bottom border-f8" v-for="(payItem, index) in payTypeList" :key="index">
						<view class="flex-center">
							<view class="w-60r h-100 mr-2">
								<text
									class="iconfont"
									:class="[payTypeIcons[payItem.payTypeId][0]]"
									:style="{ color: payTypeIcons[payItem.payTypeId][1], fontSize: `60rpx` }"
									v-if="!$u.test.isEmpty(payTypeIcons[payItem.payTypeId])"
								></text>
							</view>
							<text class="flex-1">{{ payItem.payTypeName }}</text>
						</view>
						<radio :value="payItem.payTypeId" class="scale-08" :checked="curPayType == payItem.payTypeId" :color="themes.color"></radio>
					</label>
				</radio-group>
			</view>
			<view class="px-2 position-fixed safearea-bb w-100 bottom-0">
				<ls-button className="but-main h-80r my-2" loading text="确认支付" :asyncFunction="surePay" :options="{ cl: '#FFF', br: '100', fs: '30' }" />
			</view>
		</view>
		<ls-empty className="center-xy" :title="paging.errMsg" :paging="paging" />
		<!-- #ifdef H5 -->
		<view class="" v-html="payDatas" v-if="payDatas&&curPayType=='ALI_PAY'"></view>
		<u-popup v-model="showWeiXinAliPay" mode="center" border-radius="14" width="80%" :key="payDatas">
			<view class="p-4 font-24 w-100">
				<view class="flex-center font-32 font-weight mb-4">请使用其它浏览器打开以下链接进行支付</view>
				<view class="w-100 px-2 text-pre-wrap overflow-h" style="max-height: 300rpx;">{{ payDatas }}</view>
				<view class="flex-center">
					<view class="weixin-tip-img" :class="$utils.getUa().isApple ? 'iphone' : 'android'"></view>
					<view class="weixin-tip"></view>
				</view>
				<view class="flex-center mt-2">
					<view class="flex-1 py-2 border border-e4 rounded-10 mr-2 text-center" @click="showWeiXinAliPay = false">取消支付</view>
					<view class="bg-main border border-main flex-1 py-2 rounded-10 text-fff text-center" @click="$stringUtils.lsCopy(payDatas)">复制链接</view>
				</view>
				<view class="font-24 mt-2 text-main w-100 text-center" v-if="payInfo.orderCancelCountdownEndTime">
					订单剩余支付时间
					<count-down className="d-inline-block font-20" @finish="payTimeEnd" v-slot="{ times }" :time="payInfo.orderCancelCountdownEndTime" :custom="true">
						<text v-if="times.days > 0">{{ times.days }}天</text>
						<text v-if="times.hours > 0">{{ times.hours }}时</text>
						<text>{{ times.minutes }}分</text>
						<text>{{ times.seconds }}秒</text>
					</count-down>
				</view>
			</view>
		</u-popup>
		<!-- #endif -->
		<!-- #ifdef APP-PLUS -->
		<!-- 易宝支付宝支付专用 -->
		<u-popup v-model="showWeiXinAliPay" mode="center" border-radius="14" width="80%" :key="payDatas" @open="painterOpen">
			<view class="p-4 font-24 w-100">
				<view class="flex-center font-32 font-weight mb-4">等待支付中...</view>
				<view class="flex-col-center">
					<text class="mt-2 text-999">
						{{ curPayType == 'YEEPAY_ALI_PAY' ? '可复制链接用浏览器识别后支付' : '请复制链接在微信中访问或者用微信扫二维码支付' }}
					</text>
					<!-- <l-painter width="400rpx" height="400rpx" :board="haiBaoData" isRenderImage isH5PathToBase64 @success="shareImg = $event" /> -->
					<LimePainter v-if="isPainterOk" :board="haiBaoData" isCanvasToTempFilePath @success="shareImg = $event"/>
				</view>
				<view class="font-24 mt-2 text-main w-100 text-center" v-if="payInfo.orderCancelCountdownEndTime">
					订单剩余支付时间
					<count-down className="d-inline-block font-24" @finish="payTimeEnd" v-slot="{ times }" :time="payInfo.orderCancelCountdownEndTime" :custom="true">
						<text v-if="times.days > 0">{{ times.days }}天</text>
						<text v-if="times.hours > 0">{{ times.hours }}时</text>
						<text>{{ times.minutes }}分</text>
						<text>{{ times.seconds }}秒</text>
					</count-down>
				</view>
				<view class="flex-center mt-2">
					<view class="flex-1 py-2 border border-e4 rounded-10 mr-2 text-center" @click="showWeiXinAliPay = false">取消支付</view>
					<view class="bg-main border border-main flex-1 py-2 rounded-10 text-fff text-center mr-2" @click="eventSave" v-if="curPayType == 'YEEPAY_WX_PAY'">
						保存图片
					</view>
					<view class="bg-main border border-main flex-1 py-2 rounded-10 text-fff text-center" @click="$stringUtils.lsCopy(payDatas)">复制链接</view>
				</view>
			</view>
		</u-popup>
		<!-- #endif -->
	</view>
</template>

<script>
import { mapState } from 'vuex';
import platformPayto from '@/service/payTo.js'; // 调用支付
import { orderApi } from '@/api/ModulesOrder.js';
import countDown from '@/components/common/countdown/count-down.vue';
import LimePainter from '@/components/l-painter-new/l-painter/l-painter.vue';
import { appToken } from '@/utils/Cache.js';

export default {
	components: { countDown, LimePainter },
	data() {
		return {
			payDatas: '', // 支付成功返回的
			payParams: {},
			curPayType: 'FREE_PAY',
			payInfo: {
				// 支付信息
				payTypeList: [], // 支付类型
				businessOrderNumberList: [], // 业务单号
				subjectList: [] // 交易信息
			},
			altPayImgCue: false, // 支付宝支付提示
			platform: '', // 用户手机系统类型 安卓、苹果
			payTypeIcons: {
				FREE_PAY: ['icon-mianfei', '#40CDA9'], //免费支付
				ALI_PAY: ['icon-zhifubao', '#0CAEEF'], //支付宝支付
				WX_PAY: ['icon-weixinzhifu', '#01CA02'], //微信支付
				SIMULATE_PAY: ['icon-qianbao1', '#FEB347'], //模拟支付
				GNETE_PAY: ['icon-yinhangka', '#0CAEEF'], //银联支付
			},
			paging: {
				status: 'loading',
				error: false, // 是否错误
				errMsg: '暂无数据',
				emptylist: false // 是否显示列表为空时的样式
			},
			showWeiXinAliPay: false, //如果是微信端打开支付宝支付或者APP端易宝支付宝支付，并且请求接口成功，
			timeOut: '',
			haiBaoData: {}, // 易宝支付宝/微信支付专用(链接的支付二维码)
			shareImg: '', // 支付二维码
			timer: null,
			slotPlace: '',
			isPainterOk: false,
		};
	},
	computed: {
		...mapState(['userInfo']),
		payTypeList() {
			return this.payInfo.payTypeList.filter((item, index) => {
				if (this.$utils.getUa().isMP && (item.payTypeId == 'YEEPAY_ALI_PAY'||item.payTypeId == 'ALI_PAY')) {
					return;
				} else {
					return item;
				}
			});
		}
	},
	watch: {
		showWeiXinAliPay(newValue) {
			if (!newValue) {
				// clearInterval(this.timeOut);
			}
		}
	},
	onLoad(option) {
		this.payParams = option;
		if (option.orderNumber) {
			this.payParams.orderNumber = JSON.parse(decodeURIComponent(option.orderNumber))
		}
		// 如果是APP端选择了易宝微信支付，调起小程序，则只执行surePay()方法--只有APP端拉起微信小程序支付才会传payType值
		if (!(this.payParams.payType=='YEEPAY_WX_PAY')) {
			this.toPay();
		}
		// #ifdef MP
		clearTimeout(this.timer)
		this.timer = setTimeout(() => {
			this.slotPlace = '     '
		}, 500)
		// #endif
	},
	onShow() {
		// #ifdef MP
		// 如果是APP端选择了易宝微信支付，就直接调起微信小程序进行支付--只有APP端拉起微信小程序支付才会传payType值
		this.$nextTick(()=>{
			if (this.payParams.payType=='YEEPAY_WX_PAY') {
				this.curPayType = this.payParams.payType
				this.surePay(this.curPayType)
			}
		})
		// #endif
	},
	mounted() {},
	destroyed() {
		clearInterval(this.timeOut);
	},
	methods: {
		payTimeEnd() {
			uni.redirectTo({ url: `/ModuleOrder/orderList/orderList` });
		},
		changePay(e) {
			this.curPayType = e.detail.value;
		},

		// 发起支付
		toPay() {
			this.paging = {
				status: 'loading',
				error: false, // 是否错误
				errMsg: '暂无数据',
				emptylist: false // 是否显示列表为空时的样式
			};
			orderApi
				.payOrder({
					businessOrderNumberList: this.payParams.orderNumber,
					settlementType: this.payParams.settlementType
				})
				.then(res => {
					if (res.code) {
						this.payInfo = res.data;
						if (this.payInfo.amount == 0) {
							this.curPayType = 'FREE_PAY';
							this.surePay();
							return;
						}
						setTimeout(()=>{
							if (this.payTypeList && this.payTypeList.length) {
								this.curPayType = this.payTypeList[0].payTypeId;
							}
						},100)
					} else {
						this.paging.errMsg = res.msg;
					}
				})
				.catch(err => {
					this.paging.error = true;
					this.paging.errMsg = err.response && err.response.data && err.response.data.msg;
				})
				.finally(res => {
					this.paging.status = 'noMore';
					if (!this.$checkInfo([{ type: 'hasValue', value: this.payInfo.businessOrderNumberList }])) {
						this.paging.emptylist = true;
					}
				});
		},
		// 返回
		goback() {
			uni.showModal({
				title: '是否放弃付款？',
				success: res => {
					if (res.confirm) {
						uni.redirectTo({ url: `/ModuleOrder/orderList/orderList` });
					} else if (res.cancel) {
					}
				}
			});
		},
		// 确认支付
		surePay(payType) {
			return new Promise((resolve) => {
				this.platform = uni.getSystemInfoSync().platform;
				uni.showLoading({ title: '正在支付...', mask: true });
				// 如果是【APP端易宝微信支付】，则直接拉起小程序
				if(this.$utils.getUa().isAPP&&this.curPayType == 'YEEPAY_WX_PAY'){
					this.setTimeout(); //打开定时器每两秒请求一次接口看有没有支付成功
					setTimeout(()=>{
						// 30分钟内还未支付的话,终止
						uni.hideLoading();
						return resolve()
						clearInterval(this.timeOut);
					},1800000)
					
					// 唤醒微信app并访问H5页面(但要申请第三方ticket)
					// plus.runtime.openURL(`weixin://dl/business/?ticket=${res.data.paymentResult}`);
									
					//找出分享到微信端
					plus.share.getServices(
						(shareRes)=> {
							var shares = {};
							for (var i = 0; i < shareRes.length; i++) {
								var t = shareRes[i];
								shares[t.id] = t;
								// console.log(t.id);//sinaweibo,qq,weixin
							}
							var sweixin = shares['weixin'];
							// console.log('sweixin:',sweixin);//{ "id": "weixin", "description": "微信", "authenticated": true, "accessToken": "", "nativeClient": true }
							const parmas = {
								orderNumber:encodeURIComponent(JSON.stringify(this.payParams.orderNumber)),
								settlementType:this.payParams.settlementType,
								payType:this.curPayType,
							}
							const url = `/ModuleOrder/submitOrder/payOrder${this.$u.queryParams(parmas)}`
							// console.log('url:',url);
							//拉起微信小程序
							sweixin
								? sweixin.launchMiniProgram({
									id: this.$config.wxOriginalId, //https://mp.weixin.qq.com/里【设置】-【帐号信息】->【原始ID】
									path: url
								})
								: plus.nativeUI.alert('当前环境不支持微信操作!');
							return resolve()
						},
						(e)=> {
							return resolve()
							console.log('获取分享服务列表失败：' + e.message);
						}
					);
				// 如果是【APP端易宝微信支付】以外的支付
				}else{
					platformPayto.pay(this.curPayType, this.payParams.orderNumber, this.payParams.settlementType).then(res => {
						// platformPayto.orderPay(payTypeValue, 1, passwordCallback, subNumbers).then(res => {
						console.log('支付成功, 业务回调: %o', res);
						if (res.success) {
							uni.hideLoading();
							// 说明返回的类型是表单, 需要前端发起请求真实支付 处理成功后由后端重定向到支付结果:小程序没有form表单
							if (res.dataType == 'form') {
								// this.payDatas = res.data.prepayResult; 
								// this.payDatas = res.data.paymentResult; //后端加密了paymentResult,在payTo.js中将解密后的内容放在res.form中
								this.payDatas = res.form;
								// 如果是微信端打开支付宝支付
								if (this.$utils.getUa().isWeixin && (this.curPayType == 'YEEPAY_ALI_PAY' || this.curPayType == 'ALI_PAY')) {
									// const jumpAddress = `/ModuleOrder/submitOrder/wxAliPay?payData=${encodeURIComponent(res.data.paymentResult)}&subSettlementSn=${encodeURIComponent(res.data.paySettlementSn)}`
									// location.replace(jumpAddress)// 由于IOS上点右上角的复制链接时，用uni.redirectTo跳转的话，?后面的参数是复制不了的，所以要用到location.replace()方法
									// // uni.redirectTo({url: `/ModuleOrder/submitOrder/wxAliPay?payData=${encodeURIComponent(res.data.paymentResult)}&subSettlementSn=${encodeURIComponent(res.data.paySettlementSn)}`});
									this.setTimeout(); //打开定时器每两秒请求一次接口看有没有支付成功
									this.$nextTick(()=>{
										// 易宝支付宝支付,res.data.paymentResult是带有HTTP开头的链接
										if (this.curPayType == 'YEEPAY_ALI_PAY') {
											this.showWeiXinAliPay = true; //打开popup弹框
										}
										// 支付宝支付,res.data.paymentResult是带有<form>表单格式
										if (this.curPayType == 'ALI_PAY') {
											document.forms[0].submit();
										}
									})
								} else {
									this.$nextTick(() => {
										if(this.curPayType=='YEEPAY_ALI_PAY'){
											window.location.href = res.data.paymentResult;
											// window.open(res.data.paymentResult);
										}else{
											document.forms[0].submit();
										}
									});
								}
							// 否则返回的是JSON
							} else {
								// 如果是APP及易宝支付宝支付,则跳H5页面上访问支付宝的易宝链接，在H5页面上拉起支付宝支付
								if (this.$utils.getUa().isAPP&&this.curPayType == 'YEEPAY_ALI_PAY') {
									this.payDatas = res.data.paymentResult;
									const haiBaoDataTemp = {
										css: {
											width: '400rpx',
											height: '400rpx',
											borderRadius: '16rpx',
											background: '#fff',
										},
										// width: '400rpx',
										// height: '400rpx',
										// radius: '16rpx',
										// background: '#fff',
										views: [
											{
												type: 'qrcode',
												text: res.data.paymentResult,
												css: {
													width: '380rpx',
													height: '380rpx',
													color: '#000',
													border: '20rpx solid #fff'
												}
											}
										]
									};
									this.$set(this, 'haiBaoData', haiBaoDataTemp);
									this.setTimeout(); //打开定时器每两秒请求一次接口看有没有支付成功
									this.$nextTick(() => {
										this.showWeiXinAliPay = true; //打开popup弹框
										plus.runtime.openWeb(res.data.paymentResult);
									});
								// 如果是正常支付(APP或小程序)
								} else {
									// 如果是APP端选择了易宝微信支付，调起小程序支付成功后，
									if (payType=='YEEPAY_WX_PAY') {
										const payParams = {
											orderNumber:encodeURIComponent(JSON.stringify(this.payParams.orderNumber)),//【支付失败】后点击【重新支付】用
											settlementType:this.payParams.settlementType,//【支付失败】后点击【重新支付】用
											amount:this.payInfo.amount,//【支付失败】后点击【重新支付】用
											subSettlementSn:res.data.paySettlementSn,
											payType:payType
										};
										uni.redirectTo({
											url: `/ModuleOrder/submitOrder/orderPayResult${this.$u.queryParams(payParams)}`
										});
									}else{
										const payParams = {
											orderNumber:encodeURIComponent(JSON.stringify(this.payParams.orderNumber)),//【支付失败】后点击【重新支付】用
											settlementType:this.payParams.settlementType,//【支付失败】后点击【重新支付】用
											amount:this.payInfo.amount,//【支付失败】后点击【重新支付】用
											subSettlementSn:res.data.paySettlementSn,
										};
										uni.redirectTo({
											url: `/ModuleOrder/submitOrder/orderPayResult${this.$u.queryParams(payParams)}`
										});
									}
								}
							}
						} else {
							uni.showToast({ title: res.msg, duration: 2000, icon: 'none' });
						}
					}).catch(res=>{
						// 如果没有微信授权
						if (res.code==-1000) {
							// #ifdef MP
							appToken.toLogin()
							// #endif
							// #ifdef H5
							if(this.$utils.getUa().isWeixin){
								appToken.toLogin()
							}
							// #endif
						}
					}).finally(()=>{ return resolve() })
				}
			})
		},
		setTimeout() {
			clearInterval(this.timeOut);
			this.timeOut = setInterval(() => {
				// 获取成功的订单数据
				orderApi.orderSuccess(this.payParams.orderNumber).then(respond => {
					if (respond.code == 1) {
						if (respond.data.state === 1) {
							this.showWeiXinAliPay = false;
							uni.showToast({
								title: '支付成功',
								mask: true,
								complete: () => {
									setTimeout(() => {
										const payParams = {
											orderNumber:encodeURIComponent(JSON.stringify(this.payParams.orderNumber)),//【支付失败】后点击【重新支付】用
											settlementType:this.payParams.settlementType,//【支付失败】后点击【重新支付】用
											amount:this.payInfo.amount,//【支付失败】后点击【重新支付】用
											subSettlementSn:respond.data.settlementSn,
										};
										uni.redirectTo({
											url: `/ModuleOrder/submitOrder/orderPayResult${this.$u.queryParams(payParams)}`
										});
									}, 1500);
								}
							});
						}
					}
				});
			}, 2000);
		},

		// 保存图片(易宝支付专用)
		eventSave() {
			uni.saveImageToPhotosAlbum({
				filePath: this.shareImg,
				success: res => {
					if (res.errMsg == 'saveImageToPhotosAlbum:ok') {
						uni.showToast({
							title: '保存图片成功',
							duration: 2000
						});
					}
				},
				fail: err => {
					if (!err.errMsg.includes('cancel')) {
						uni.showToast({
							title: '检测到您未打开“相册”权限，是否前往开启',
							duration: 2000
						});
					}
				}
			});
		},
		
		// 用于小程序做画板渲染 否则小程序上会出现两张图片 一张其实是canvas引起的bug
		// 因此要确保popup渲染完后再v-if lime-painter
		painterOpen() {
			this.$nextTick(() => {
				this.isPainterOk = true;
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

<style scoped lang="scss">
// start--H5微信浏览器上打开支付的弹框
.weixin-tip {
	box-sizing: border-box;
	position: absolute;
	bottom: 40px;
	right: 20px;
	width: 265px;
	padding: 75px 0 0;
	text-align: right;
	margin-bottom: 30px;
	font-size: 14px;
	background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAACICAMAAABQgAwUAAAAMFBMVEUAAADY2NjY2NjY2NjY2NjY2NjY2NjY2NjX19fY2NjY2NjY2NjY2NjY2NjY2NjY2Njr/TvvAAAAD3RSTlMAxy89c9CdTRyG7lvcD7FzqbJAAAACFklEQVR42uWYy4rkMBAErZdlPdzx/3+7LAw0tH0Y2orDsnnyKQlSVaWytoc6xrEpigFoinUAIBnWABAE5woW9o6GPbGwI1jYGSzsgoV9goU9wMLe0bA7FnYCC7uBhV2wsE+wsAdY2AENGyzsBBZ2Q8MuWNgH94pLbgELO6Bhg4VdwcJuaNgTCzuChZ3Bwg5o2GBhV7CwdzTsjoUdwcLOYGEXLOwTLOwBFvaOht2xsBNY2I1f6lhaenvhrfpkAblab+k9b/OD0iuX2F9/x8D+7ZL2pmpbuj+6o3Vg//oWmPU9p65VkXL6+oIJ8S738nwj62Pb1lvHACH+fBs7sG59U3yrVD3rce3GVcp8qGkPAGTprQUYy6xfaE8i82b6S7/pfZnzdYQIHeOXdfYKpHoFcmrvWlM8RW+CDO8JMWoNM/+FeyB4UfMpL48g5qG1Iqc29YI3mqq2knXvEJu2onJoQy9ok4mkQZf/GjqitUvQyqN6SU8NOvOhHq25xNCWj6LFQdLiyKuaZWpxBC2OrFVHxdryElbQsVtBx6KN0qAd4a71yo610uxa2b0s5xg052I5p26d4MCqusZFwzrAnqQhSogSMnkNcr+GUS3kEKWS62NJFlNCToWLZpWMe14RReGqdjz2PfNECbkGbrQ/Nj5q5y7j8/HRTW5UhvHfA7Mdzitji8rfWsgX3gVZ91eO22odKed6LLf9A/sRnc74RV7lAAAAAElFTkSuQmCC)
		no-repeat right bottom;
	background-size: 45px 68px;
	transform: rotate(180deg) rotateY(180deg);
}

.weixin-tip-img::after {
	display: block;
	margin: 15px auto;
	content: ' ';
	background-size: cover;
}

.iphone::after {
	width: 150px;
	height: 150px;
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAMAAABOo35HAAAAXVBMVEUAAADq6vHs7PLu7vPu7vPu7vMeiPL///8cm/UarfcfdfAavvkczvvG5/oDAABd0/qh2/r7ExFSovWGvPPi3c4FCkfSv6VWBwCIhpJPir+pSCoFSZG8hWdPUE/v7/SejHF2AAAABnRSTlMAI0XUl2pd6vM9AAARD0lEQVR4XuzYwY3EMAxD0Ugk21D/ZS529ziXITCTODFfCR+y7ORYQlVLJPFr/uEPSamrjjiqRWLeAFJdG2fC2LBdsnrpZBfbI1gT8xFgP32i5qOo2nukMmDN+SL2fqXSq4g5BVjHvQlzIujOQzWnY2VTGdg5fwbomamSS7MAZaoM0HNSJVdjloI+VlWY5aDyBDWwcgUadNsTmLPIWRxzBxrQGSsDM1YGdMbKwFyCBlTeVgblCBq4+BHMUey5rc66MijrysCsKwMqrZxaWe2Gzmo3dFoZlFYG5clgYFoZmFYGppWBaWVgWhmYN4NBaWVQWhl0zbdzvhNrHq8u+H+V/1uYDSAPLANzERqUi9DQuQgNleX+PmS5G3j5cv9h145WHIdhKIBu65SwxOLex5kX/f9nbuVoiKHDslltpIFZpa2MHw9XhtZdc0rX2kP+lisVr8pjq2VT1XO1qgNrLamaY+teYVXPdS8YwrWw8gdxqbGqj9aSPoRrbSUNYv0Q1g9i8hCWV+Yg3vQ7Y+kteQi/zyA+aq3qtR6pQ/h9BnH5j7UEgpWDpUIC6KMAgKIBrJRotQorIfqnBUqFVvuyX6AF/bcFyY/WPSNYGpD6p16aEK2HpmJxprI1n331jtkR1EwsfXyxn0eVfS7os6ljjTUM8ChqIlZLCJb+XaogA8nfE5o42GmuhNuLloYleEmUYkrWtC+YUNOwWsLl18kJhCMZiHLv6540GhgdjWfDpZdHS+N1MlZibzEV7yNZo9PA4NtyNlwar8uDpSdiZTD06ICHyLo3woMHX38QU+JY8Wi1FCz1WB2RGTsvWHLswgPoBUnBavXX9fPJjj1a5KF0NJ0Cxmc3Ujggg1jxaLUMLJlSRPvA5NL7Zn1vLijwzmkSOzOw2tV/XPvTXJEeLQfZDMhe47G+r+FmNCfioNQAVvymZ7keS2UQAJ4YiIvAoT4Rw442rAhX69tGvR5rCdxSRLGUGAr8gOpjw11eX9b9Id2UOqze3zsDWNG7i+V6LKPZngLww2qI2Ybtvjy2ty89h7aA0D7f3n52MIAVjJZejiXov2i3ux5HdRgMwGf7MYdoJ7JLbgCh/P+fubFx91UQdKeVXtMhZkSQeOSYqzQAkfaXNTganwV0MAIQ9337xLKuc7uQTMeq3M1Mr6xcRbSNkjWI3CR0Isc/AhKZakundZn96pUWdRPUlY1V3QpafgkSyCAJKCRq0NNjmaLUpLKxrsftnY2lvgatoKCF6Lwg1Ycxp/XxmJKoignqqRZzD9SNjbXZSDazLbXze2FfwaVZDZKDWpSNdWNuZ3pl5Vrd+ns3JrNKkjWkz5s8cQvUpZKx1Hmg9VEks1pmUZVYzOdti7hN5UbGciBR/fbzh1rD+jArVTzM2tYJFm8dViIWvoThJB9pWbtqMcvuGZK5WJW4+etFx4LWB1hps1qHbbLgOUrGuvA26ZwWlkjnlNrR//ZpDHHz5FbLDL5vyXretXhbeioPCx0rq2xKHp51VshwVwrWYXpsVpgj+vwmKher7lYhF6sWvF3UTIrCgRUucPy9Z14fHtNzDqgsr1ysC22r3ElhBZeqhMpPD7QrtwrN5ydVXF+5WP06vFKxqrYaEZHgEtTMD48prNbZZvpsPM3HSsW60jb3HhWWvWExpjaKXx3/9tc+WruKhhX/s2pzMTUzu85MrH5n3Z2LFaUkRSWFx4nWkd28dlbh5UTiZM7Gxbp3LYuJVcVrwU4gQBlZQGfPZe0qolklTIgSE1Fto1QiVt+0KhUrm4O3LASoUCmR9gGrdQgq3OQf2KyWZSpWhdWFi1VMQbN/6dNb4e0qYhlSBKREs+oGXrhYF6xCLpZEg9GsIudcB5AzrJZ5DzmWrHicVCoW1uGVipVHAwgv1fTDwBJEw+px40M4ihhdpmJd0bKoWM4j8ny1z6ymYW8F/1wsUSYWmtYvLlYxgKKq8na7Om9YWIsS/IWJhU0Edy6WPGvgLay5s/r6N65wse7o70SsOnb14j8f+z+kntsSRMz7KXhQGkWk2FipWDdKf69H/b0UkRFaOPnYpUdWoOzmGpTmFmp5pmJd0bKIWNoAxu2VioOhgjAitdPXFEpo7gOEwCuaFQ9VHhaa1oWO5SFFNeuYhheVFUdvtXR11U/E4qZjXdDfeVjFAfbv60M/Pm/7WnqrGRPswAR4jZYUHhY6/I2LJcYwjikB5+CAwuhWiPkfcyS3KMPAxEKHv/KxJOeay6YVZLsf0rzuGhZuOynGNHgIDwsdvpKxhi1QWQGGM9LBOs/aW4EKc5BGJDpWxceQhzW6QTsQZ1wp1hK0FpAc4KLD29VIxvqFjyEVaxQZZWyRIDUgR0h7R9NCc99iX5KB+4cbe9ttG4bBANw1iaUVIMb9vNmGgu//mANFsYwXL7UvZBSi5Qg+wAA/ULQRCQAeipWvw9sJWC0pb8RPA1pWWma1L4Zi5evwOhxrd3wnp9Ku9esA1fiedf1aWFxcqvet933CvrprxQlYl3PehsCnauJU2rby/mfZZ0WkbXnLMKz8dtDBWGIrhPTTflWh3conqodiPJbal8NwrH0BU0orrl8O69t4LK51CRCgHSzrzU+RIQWVSvXbfGxvFaTEzHAsHo/1OhwLzuT/0qAhrMLPsCHFIEcNsM3wCxBSVbsfw7FeX26jsTwRjaa1WSq+htKq5j3/L6yEBOyHRmPdxmOpZWL7s7yhSaWyErH52RZPho7Huo7GKvCEt7UcMKwc995nu2WlO4QFjRRlNNb1BCypi+UCZmOwsd69uUdZEfyeHDZv7u4sTGS+MgVWMxIlQct8Y11JY2pcFBA5HlZigAP9efZg8AlYl+FYBANyqArBsg6z0qgsCaIcMWUEohDl00DDsS4nYJVMiD29LJHesKKy4BKr341y/MADq5J7ocyBJTUSYywPASrdl0I1qRJqHWkoVLxlzYAVCFLI0B6iUq8r5WVvrOkqnHwOrBJNayskvhhkOR748EeZBYsRMlIfrUxLFQed+tLuLb7yCVj6oidgkfT24mpIGKgXFmE5GEIILptoGqzCLa1ORSlTqVkpH6WK52SBzoOVPEIkCcAl29XxEA0u0ERYRSKpyC+bez/zZuPtfs4pz8QII+3VWmbCaiDggPFsoXHJj4PM55jySs7J7R2LZ8HK0oLIXfJupRxEtgWXH+f8zxnYLxhBhr/snUFr6zAQhPuaZxkEC8vsXf//Zz4mmku7xM85rE1FNbWVqrn0Y3YkElsmm0WWDvKPPOHeWkcARlaRCk6dhqj0DvnJQuysGpZUD0tytC//J0uHVZloZER5LDw0v5JW7Is5ix7qvYXTYfREzGjvHJXYJWn8Gza4obcGjmEsB2s39D4zJwZZCd//JGA85nmeQFpsXH+sB2v31tmaj6AbLARCLPSTDo3rVaAJuT9hswhXhDWCrGAGrbeao38Hk3GJmF6Eg7YKGnQW9rgOVvXHyrkQAbrCwABLYF6h0hjhOJE9aXEgzYQ/9DP4LFfMxDA6w1o/1YRLv7iDAR+dDb6vCms48TSwb0Gj5TLMkSUB6o3ewgwsH5fC2oph5fWDEsdCEKyfajDhg4UgpsD64d9IZ1oN9ATIqpGX83RGQcas5DDRIqtLYX3Ww8qV2GEM9wgZhiOvAwyKOgvNhoEmVpfC+iy85OiYViMnEaAcB5bSWww0oqhmVgtcn/WCFlmB7viaXJOL1EKWak+6zVyFKFaXw/q4CFZeQYBFOFhaOqghPOpkKehNxNtStl8Fq+oC3GMZupqxEolAQxAl+U1dWJvZZjxR8LFfDetRf2n3MS2+gNNhJMD8/gKLCDkHDsxZE3HE6udeB38sU9VBRWZGEpNIEyw6KfRnn6aTwsZ+D6ztDlj7kLmU4gOTCiOMKb5Pw7lNs4WMl2x1Jayt9EanY5k34RIMOmcnsP6E1Yzj7FWPUti+3wLrs/oWumNzRVdDzDLDTmATFqFhCBROVWD9LXQfF8PKuCTIYUOwBg+BkkBUd8GqvO33fVya7UywXDmVcv0eWI/KG8rP40JPLQ/hDKr6G8q3+2AJV+aVSRHVrbC2wk0w3uf1AhhOkyrfBOO26TDz8ggA30GFJ1I3TYbVG/e8bzBzDzV3e89S1Rv3FCV8jW7Pd2r7hXUq36tCq0T3Rxb1C+v/Kth6U1qP1eP8PtS/sLaK7YKldVjlZw0UwFqL1ajZ4lxaDNbfqs3zpaWMtVU9lkFaB5VWWUWLB2kdVo/0KJkCrYFKkVW4eJAWQJUfFjbK2n4VsH/snc2O5CAMhPf3SKm1MYYEyPs/5jahe0ryTCtpsWgv1IUZy6dPZafg0vs4Xf1htSlOIedw6nwKz+dw6v2fGZ1TeH0O5xSe5dIpJtL353BOob0fTtl7Yccczik07zRT5nXmctSaIev6ip/r/eqKn+u911rTWOcpfqb38/Qwc0NHepi54cRa01gd1prGMsF0ily6rDWNZbfW3FijraVDAIi4/2GswdYSYB3AKiDVk1JgHW6s0dZSYLE1ueulYy7C8rdPFfdVo5XrMdZoa2VYY2lAVXJfMSBaIw2rQWNhpXtTiVSpHQFGaYCx+m+IGfC+FMCXhxqIDfAx1vptt9rgi3vl0AuwMqiKveHL8LHqONaOW+E4a2UAOFg1Wh7A2nYLt47RRoAvnJVj1Lsy/KJVMR6kns5SObRhFVFHjjzGGav/XStgseZZuXY+w3Kni93It2HjP1WZw3wCq+Md65+/a+W2mnJcCGsxf4moGFismZwg4eEotDM3PvkY8lIGwOI71mhrScDSjtU6q84M1/1R3FC1sPbYVRlY68ldZU+iGAOLxhoYHzYkO1512+yUPtf9Wv0BX4pjbW0NQPmvsBgbRu74Dd5ZWBIqCjFGU3jX+mxN22fzEiwN6wBY3O4DB1E2ILUPVPA3EVH3KFeV6IxDGixb08rqEqyWogjrOdjeA/4uJq2OIRy04yWgwgqglgdFLe1fJnYlLFPTCuAclmQAPu4WVot6KFVHjPFIHdt90CBmADGkPddQHVoqdGyQ/ISnMZYAjqGpNUiE5eMhoJ1Hj+QAcBcSFvMsx3DAEHbkeF5c2pYgBNuRPj58hbBMzcKCUesBAl4u+ExYHdl95CBKWPYvYElZ+SFMuwJpkdpBWKx96axF7tLn+YC8ulfRgYGOHR1DOOyLaGDxUkdYGYnl1mdqhPV+dOBVgR2Dh5CD2A+L+bRBUSy7jQ6sWVj1cIa57GewCD91DeHgL6KAsDghH1bBn+d1SANhmZqB9dmgZ7AUWNjRMYSDB1Hb24gqsKrWP2/VWkc1AIkBHvDlxp3FWjcsCUjs6BvCodFUYbW00FDlV14N060arsEytbdhiYoGLPSVdwTcH0eH3REVSVXlKVVtdalVPimI4/IxtavPyhuTuaLq9lE335aOO+GotcVwMEZi3skymEkDSvkwVkiOPveuY2ENW1vjpZHOeu1B69c3Wf1t185uGwaCIIjO0Z2G8w/TsAX/qyHJosh6IRRmDxK79ZjmlV9geLgWMC8bArrw69Hc8grkfn2BWtv1JM1BGBgOwoA5CAOmVcC0CogLVkC0CohWAdEqIFoFRKuAuTMETKuAaRUYvp0Dvfy/SmrRKiCuDAGztQeGrT3Qy3YVENtVwGxXgV6WYEAswcB8zHDt1PuJsQrMMlYBMVaBXg7BgLlbBVrHTKWuI+plBQZmOQMDPlCudR2dl1QBcwQmvExVwEuqwOg9qTT1iVpcQRNe1l+g9U+9Vl0nMGKnSowolZjXrMfV1Cm1nzxgcteZjZaRSrQfK7Zy15X03Irlnabrmnqs+5qtbpnQPbak/fWX54cke/oYlb4BOpAsA4h+WeAAAAAASUVORK5CYII=);
}

.android::after {
	width: 173px;
	height: 240px;
	background-image: url(data:image/png;base64,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);
}
// end--H5微信浏览器上打开支付的弹框
</style>
