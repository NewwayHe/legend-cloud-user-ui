<template>
	<view class="addEvaluate safearea-bb" :style="{ '--themescolor': themes.color }">
		<!-- 头部 -->
		<ls-header>
			<ls-image className="imgScale" :key='goodProdPic' :options="{ w: '60', h: '60', br: '4' }" :osOptions="{ w: 500, h: 500 }" :src="goodInfo.prodPic"/>
			<view class="pr-3" slot='right'>
				<ls-button className="but-main"
					:cssStyle="{ 'width': '112rpx', 'height': '56rpx' }"
					text="提交"
					name="addEvaluate"
					:asyncFunction="handleSubmit"
					:options="{ br: '28', fs: '24', bd: themes.color , pl: '0', pr: '0' }">
				</ls-button>
			</view>
		</ls-header>
		
		<!-- 初评展示 -->
		<template v-if="!!queryParams && queryParams.operation == 1">
			<view class="mt-2 px-2 py-3 pb-4 bg-fff scoreArea">
				<view class="rateArea">
					<text>宝贝评分</text>
					<u-rate :count="5" v-model="formData.score" size="36" gutter="20" min-count='1' active-color='#EE0A24' inactive-color='#999999'></u-rate>
					<text>{{ starStatus(formData.score) }}</text>
				</view>
				<view class="rateArea">
					<text>店铺评分</text>
					<u-rate :count="5" v-model="formData.shopScore" size="36" gutter="20" min-count='1' active-color='#EE0A24' inactive-color='#999999'></u-rate>
					<text>{{ starStatus(formData.shopScore) }}</text>
				</view>
				<view class="rateArea">
					<text>物流评分</text>
					<u-rate :count="5" v-model="formData.logisticsScore" size="36" gutter="20" min-count='1' active-color='#EE0A24' inactive-color='#999999'></u-rate>
					<text>{{ starStatus(formData.logisticsScore) }}</text>
				</view>
				<view class="pt-3 d-flex" style="border-top: 2rpx solid #f8f8f8;">
					<text class="font-28 text-333" style="font-weight: 600; line-height: 40rpx;">综合评分</text>
					<view class="ml-3 flex-col-between">
						<u-rate :count="5" :current="totalRate" disabled size="36" gutter="20" style="margin-bottom: 20rpx;"></u-rate>
						<text class="text-999 font-24 pl-1">综合评分=（宝贝评分+店铺评分+物流评分）/3</text>
					</view>
				</view>
			</view>
		</template>
		
		<view class="position-relative px-2 py-3 d-flex a-center bg-fff mt-2" v-if="!!queryParams && queryParams.operation == 3">
			<text class="font-28 text-333" style="font-weight: 600; line-height: 40rpx;">综合评分</text>
			<u-rate :count="5" :current="totalRate" disabled size="36" gutter="20" style="margin-left: 30rpx;"></u-rate>
		</view>
		
		<view class="commArea bg-fff px-2 pb-4 mt-2">
			<view class="py-3 text-333 font-28" style="border-bottom: 2rpx solid #f8f8f8; line-height: 40rpx; font-weight: 600;">评论内容</view>
			<view class="pt-3">
				<view class="position-relative">
					<text class="iconfont icon-bianji3 position-absolute" style="font-size: 28rpx; top: 4rpx; left: 4rpx;"></text>
					<u-input v-model="formData.content" placeholder="请填写评论内容"
					:clearable='false' type='textarea' :auto-height='false' maxlength='50'
					:custom-style="{ 'font-size': '28rpx', 'line-height': '40rpx', 'text-indent': '1.5em', 'padding': '0'}"
					></u-input>
				</view>
				<text class="font-28" style="line-height: 40rpx;">
					<text style="color: #F56C6C;">{{ formData.content.length }}</text>
					<text class="text-333">/50字符</text>
				</text>
			</view>
			<view class="pt-3">
				<ls-dragImage
				    :column="3"
				    :maxImageNum="5"
				    :maxUploadNum="5"
					:openVideo="false"
					:type="1"
					v-model="picFile"
				></ls-dragImage>
				
			</view>
			<!-- 初评使用 -->
			<view class="anonymousFlag pt-3" v-if="!!queryParams && queryParams.operation == 1">
				<u-radio-group v-model="anonymousFlag" size='36' label-size='24' icon-size='24' @change='anoyFlagChange'>
					<u-radio :label-disabled="false" :name='1'>匿名评价</u-radio>
				</u-radio-group>
			</view>
		</view>
		
	</view>
</template>

<script>
	import { evaluate } from '@/api/ModulesUser'
	export default {
		name: 'AddEvaluate',
		components: {
		},
		data() {
			return {
				goodProdPic: 0,	// 刷新ls-image更新
				goodInfo: { prodPic: '' },	// 当前评论的商品信息
				queryParams: null,
				oldAnonymousFlag: 0,	// 保存一份旧的匿名标签
				anonymousFlag: 0,	// 0为非匿名 1为匿名
				picFile: [],
				formData: {
					// 初评
					score: 5,	// 宝贝评分
					shopScore: 5,	// 店铺评分
					logisticsScore: 5,	// 物流评分
					orderItemId: null,	// 初评需要用到
					anonymousFlag: false,	// 是否匿名
					
					content: '',		// 评论内容
					photos: '',		// 图片/视频
					
					productCommentId: null,	// 追评使用
				},
			}
		},
		computed: {
			starStatus() {
				const status = ['差','还行','一般','好', '非常好']
				return (star) => {
					return status[star - 1]
				}
			},
			// 总评分
			totalRate() {
				// 默认为1星
				const { score = 5, shopScore = 5, logisticsScore = 5 } = this.formData
				return ((score * 1 + shopScore * 1 + logisticsScore * 1) / 3).toExponential(2)
			}
		},
		onLoad(options) {
			console.log('ADDoptions--', options)
			this.queryParams = options;
			this.getGoodData()
		},
		methods: {
			// 获取数据
			getGoodData() {
			    evaluate.getEvaluateInfo({ orderItemId: Number(this.queryParams.orderItemId) }).then((res) => {
			        if (res.code == 1) {
			            Object.assign(this.goodInfo, res.data)
						// console.log('goodInfo--', this.goodInfo)
						++this.goodProdPic;
			        }
			    })
				if(this.queryParams.operation == 3) {	// 如果是追评 要获取之前的评分
					evaluate.getEvaluateDetail({ id: this.queryParams.id }).then((res) => {
						if (res.code == 1) {
							const { score = 1, shopScore = 1, logisticsScore = 1 } = res.data
							Object.assign(this.formData, {
								score,
								shopScore,
								logisticsScore,
							})
						}
					})
				}
			},
			// 是否匿名切换
			anoyFlagChange(name) {
				// console.log('切换--', name)
				if(this.oldAnonymousFlag == name) {	// 取反操作
					this.anonymousFlag = 0;
					this.oldAnonymousFlag = 0;
				}else {
					this.oldAnonymousFlag = name;
				}
			},
			// 提交
			handleSubmit() {
				const _that = this;
				return new Promise((resolve) => {
					const { operation } = _that.queryParams;
					console.log('提交--', _that.anonymousFlag)
					// this.formData.anonymousFlag = this.anonymousFlag == 1 ? true : false;
					let params = {};
					if (!_that.formData.content) {
						uni.showToast({ title: '请输入评论内容', icon: 'none' })
						return resolve()
					}
					// operation:1=去评论，2=查看评论 3=去追评， 4=查看追评
					if (operation == 1) {
						// 初评保存
						
						params = {
							anonymousFlag: _that.anonymousFlag == 1,
							score: _that.formData.score,
							shopScore: _that.formData.score,
							logisticsScore: _that.formData.logisticsScore,
							content: _that.formData.content,
							orderItemId: +_that.queryParams.orderItemId,
							photos: _that.picFile.length ? JSON.stringify(_that.picFile) : ''
						}
						console.log('提交的数据', params)
						// return;
						evaluate.addEvaluateDetail(params).then((res) => {
							if (res.code == 1) {
								uni.showToast({
									title: '提交成功!',
									icon: 'none',
									complete:() => {
										setTimeout(() => {
											_that.$utils.pages.goBeforePage(1)
										}, 700)
									}
								})
							}
						}).finally(() => {
							return resolve()
						})
					} else if (operation == 3) {
						// 追评保存
						params = {
							productCommentId: Number(_that.queryParams.id),
							content: _that.formData.content,
							photos: _that.picFile.length ? JSON.stringify(_that.picFile) : ''
						}
						console.log('追评数据--', params);
						// return;
						evaluate.addEvaluateInfo(params).then((res) => {
							if (res.code == 1) {
								uni.showToast({
									title: '提交成功!',
									icon: 'none',
									complete:() => {
										setTimeout(() => {
											_that.$utils.pages.goBeforePage(1)
										}, 700)
									}
								})
							}
						}).finally(() => {
							return resolve()
						})
					}
				})
			},
		}
	}
</script>

<style>
page {
    background-color: var(--backgroundcolor);
}
</style>

<style lang='scss' scoped>
.scoreArea {
	.rateArea {
		display: flex;
		align-items: center;
		margin-bottom: 40rpx;
		>text:first-child {
			font-size: 28rpx;
			color: #333;
			font-weight: 600;
			line-height: 40rpx;
		}
		>text:last-child {
			color: #ccc;
			font-size: 24rpx;
		}
		::v-deep .u-rate {
			margin: 0 10rpx 0 30rpx;
		}
	}
	
	
}

.anonymousFlag {
	::v-deep .u-radio__label {
		font-size: 24rpx;
		color: #333;
	}
}

.addEvaluate {
	::v-deep .imgScale {
		/* animation: imgScale 2.5s steps(12) infinite; */
	}
}


@keyframes imgScale {
	0% {
		transform: scale(1);
	}
	25% {
		transform: scale(1.5);
	}
	50% {
		transform: scale(2);
	}
	75% {
		transform: scale(1.5);
	}
	100% {
		transform: scale(1);
	}
}
</style>
