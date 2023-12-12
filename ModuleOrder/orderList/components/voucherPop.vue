<!-- 提货凭证 -->
<template>
	<u-popup v-model="popShow"
		mode="center"
		width="80%"
		safe-area-inset-bottom
		border-radius="24"
		class="voucher-pop"
		@open="painterOpen"
	>
		<view class="pt-3 text-333 font-28">
			<view class="flex-col-center">
				<view v-if="noticeList.length" class="w-100 overflow-h">
					<u-notice-bar
						:list="noticeList"
						:type="voucherInfo.orderStatus == 15 ? 'success' : 'warning'"
						:no-list-hidden="false"
						:autoplay="true"
						volume-size="28"
						padding="10rpx"
						border-radius="10"
						class="noticeBar"
					/>
				</view>
				<text class="font-32 font-weight-600">提货凭证</text>
				<view class="my-2 w-400r h-400r position-relative">
					<LimePainter ref="limePainter" :board="haiBaoData" isCanvasToTempFilePath @success="imageUrl = $event;isLoading = false" customStyle="position: fixed; left: 200%;" v-if="isPainterOk"/>
					<view class="w-100 h-100 flex-col-center" v-if="isLoading">
						<view class="w-200r h-200r">
							<loadingCss/>
						</view>
					</view>
					<view v-else-if="!voucherInfo.sinceMentionCode" class="w-100 h-100 flex-col-center">
						<u-icon name="warning-fill" :color="themes.color" size="200"></u-icon>
						<text class="mt font-28 text-main">提货码无效</text>
					</view>
					<view v-else-if="imageUrl" class="w-100 h-100 flex-col-center">
						<image :src="imageUrl" mode="" class="w-400r h-400r"></image>
					</view>
					<view v-else-if="!imageUrl" class="w-100 h-100 flex-col-center" @click="remakeQrcode">
						<u-icon name="reload" :color="themes.color" size="200"></u-icon>
						<text class="mt font-28 text-main">重新生成二维码</text>
					</view>
				</view>
				<template v-if="voucherInfo.sinceMentionCode">
					<text>提货码</text>
					<text class="mt font-weight-600">{{ voucherInfo.sinceMentionCode }}</text>
				</template>
			</view>
			
			<view class="mt-2 p-2 d-flex j-start a-start" v-if="voucherInfo.userContactName">
				<text style="flex-basis: 120rpx;">提货人</text>
				<text class="ml-1 flex-1 word-breakall">{{ voucherInfo.userContactName }}</text>
			</view>
			<view class="p-2 d-flex j-start a-start" v-if="voucherInfo.userContactPhone">
				<text style="flex-basis: 120rpx;">手机号</text>
				<text class="ml-1 flex-1">{{ voucherInfo.userContactPhone }}</text>
			</view>
			<view class="p-2 d-flex j-start a-start" v-if="voucherInfo.pointName">
				<text style="flex-basis: 120rpx;">自提点</text>
				<text class="ml-1 flex-1 word-breakall">{{ voucherInfo.pointName }}</text>
			</view>
			<view class="p-2 d-flex j-start a-start" v-if="voucherInfo.provinceCityDistrictAddr||voucherInfo.sinceMentionDetailAddr">
				<text style="flex-basis: 120rpx;">提货地址</text>
				<text class="ml-1 flex-1 text-wrap">{{ voucherInfo.provinceCityDistrictAddr + voucherInfo.sinceMentionDetailAddr }}</text>
			</view>
			
			<view class="mt-4 w-100 h-80r bg-main text-white font-32 flex-center" @click.stop="eventSave()">
				<!-- #ifdef H5 -->
				<text>长按二维码保存</text>
				<!-- #endif -->
				<!-- #ifndef H5 -->
				<text>保存二维码</text>
				<!-- #endif -->
			</view>
		</view>
	</u-popup>
</template>

<script>
	import LimePainter from '@/components/l-painter-new/l-painter/l-painter.vue';
	import loadingCss from '@/static/cssImage/loadingCss.vue';
	export default {
		name: 'voucherPop',
		components: {
			LimePainter,
			loadingCss,
		},
		props: {
			value: {
				type: Boolean,
				default: false,
			},
			voucherInfo: {
				type: Object,
				default: () => ({})
			}
		},
		computed: {
			popShow: {
				get() {
					return this.value
				},
				set(nS) {
					this.$emit('input', nS)
				}
			},
			noticeList() {
				const { orderStatus } = this.voucherInfo;
				return orderStatus == 5 ? ['商家正在为您备货中，请耐心等候~'] : orderStatus == 15 ? ['商家已备货完成，请在提货期内尽快提取~'] : []
			},
			haiBaoData(){
				const haiBaoDataTemp = {
					css: {
						width: '400rpx',
						height: '400rpx',
						borderRadius: '16rpx',
						background: '#fff',
					},
					views: [
						{
							type: 'qrcode',
							text: this.voucherInfo.orderId,
							css: {
								width: '380rpx',
								height: '380rpx',
								color: '#000',
								border: '10rpx solid #fff'
							}
						}
					]
				};
				return haiBaoDataTemp
			}
		},
		data() {
			return {
				isLoading: true,	//是否在生成二维码
				imageUrl: null,	//图片地址
				isPainterOk: false,
			}
		},
		mounted() {
		},
		methods: {
			// 重新生成
			remakeQrcode() {
				this.isLoading = true;
				this.$refs.limePainter.render(this.haiBaoData);
			},
			
			// 保存图片
			eventSave() {
				// #ifdef H5
					return;
				// #endif
				
				// #ifndef H5
				uni.saveImageToPhotosAlbum({
					filePath: this.imageUrl,
					success:(res)=> {
						if (res.errMsg == 'saveImageToPhotosAlbum:ok') {
							uni.showToast({
								title: '保存图片成功',
								duration: 2000
							});
							this.$emit('input', false)
						}
					},
					fail:(err)=> {
						if (!err.errMsg.includes('cancel')) {
							// 如果微信没有授权，则要重新请求相册授权
							uni.showModal({
								title: '保存图片失败',
								content: '检测到您未打开“相册”权限，是否前往开启',
								confirmText: '前往开启',
								cancelText: '取消',
								success: (res) => {
									if (res.confirm) {
										uni.openSetting({
											success: res => {}
										});
									} else if (res.cancel) {
										this.$emit('input', false)
									}
								}
							});
						}
					}
				});
				// #endif
				
			},
			
			// 用于小程序做画板渲染 否则小程序上会出现两张图片 一张其实是canvas引起的bug
			// 因此要确保popup渲染完后再v-if lime-painter
			painterOpen() {
				this.$nextTick(() => {
					this.isPainterOk = true;
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.voucher-pop {
		::v-deep .noticeBar {
			margin: 0 20rpx 15rpx;
		}
	}
</style>