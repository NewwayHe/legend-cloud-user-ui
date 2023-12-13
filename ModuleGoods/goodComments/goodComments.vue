<!-- 如果是只显示前num条 -->
<template>
	<view class="pb-20 font-24" :style="{ '--themescolor': themes.color }">
		<!-- 头部 -->
		<ls-header titleStyle="font-weight: normal;" title="商品评论" @backTap="backClick" ref="backTap" :showHeadSelect="true"></ls-header>
		<view class="h-88r">
			<view class="w-100 h-88r flex-center bg-fff position-fixed zindex-99">
				<view class="h-100 flex-1 flex-center font-28" @click="changeTab('time')" :class="currentTab == 0 ? 'text-main' : 'text-333'">时间排序</view>
				<view class="h-100 flex-1 flex-center font-28" @click="changeTab('rate')" :class="currentTab == 1 ? 'text-main' : 'text-333'">评分排序</view>
			</view>
		</view>
		<view class="px-2 pt-2 bg-fff mt-2">
			<view class="text-333">
				<text class=" font-32 font-weight mr-2">评论</text>
				综合评分
				<text class="font-24">{{ comScore }}</text>
				<view class="position-absolute bottom-0 border-bottom"></view>
			</view>
		</view>
		<block v-for="(item, index) in list" :key="index">
			<view class="border-bottom border-bg">
				<view class="px-2 bg-fff mb-2">
					<view class="pt-4 d-flex j-sb">
						<view class="flex-1 flex-start overflow-h">
							<ls-image :src="item.portrait" :options="{w:'70',h:'70', br: '50%',bg:'#cccccc'}" :errorStyle="1" :key="index"/>
							<view class="flex-1 pl-2 overflow-h ">
								<view class="line-clamp1 font-28 text-333">
									{{ item.anonymousFlag ? '匿名用户' : item.nickName }}
								</view>
								<u-rate style="vertical-align: top; margin-left: -5rpx" :gutter="3" :count="5" :current="item.score || 0" disabled size="20" :active-color="themes.color" allowHalf inactive-icon="star-fill"></u-rate>
							</view>
						</view>
					   <view class="d-flex a-end">
						   <text class="text-999">
							   {{ item.addTime | dateformat('YYYY-MM-DD HH:mm:ss') }}
						   </text>
					   </view>
					</view>
					
					<view class="mt-2">
						<view>
							<text class="overflow-h text-333 text-pre-wrap" style="line-height: 40rpx">{{ item.content }}</text>
							<view class="img mt-1 d-flex flex-wrap overflow-h" :class="item.photoList.length >= 4 ? 'h-220r' : ''">
								<view
									class="img-item d-block text-center bg-fff position-relative overflow-h mr-1 mb-2 rounded-12 w-220r h-220r"
									v-for="(pics, indexPic) in item.photoList"
									:key="indexPic"
								>
									<ls-image :options="{ w: '220', h: '220', br: '24' }" :src="photoServer + pics" @click="clickImage(item.photoList,indexPic)" >
										<!-- 遮罩层 -->
										<view @click.stop="clickImage(item.photoList,2)" v-if="item.photoList.length >= 4 && indexPic == 2" class="position-absolute top-0 right-0 w-220r h-220r rounded-24 shadow flex-center overflow-h" style="background-color: rgba(0, 0, 0, .5);">
											<text class="text-fff font-24 font-weight">共{{item.photoList.length}}张 > </text>
										</view>
									</ls-image>
								</view>
							</view>
							<view class="date-of-purchase pt-1 pb-4 d-flex" style="line-height: 40rpx">
								<view class="sku flex-1 text-999">{{ item.attribute ? item.attribute : '默认规格' }}</view>
							</view>
						</view>
						<view class="py-4 border-top border-f1" v-if="item.replyFlag">
							<view class="rounded-12 bg-f8 p-3">
								<view class="flex-between pb-2">
									<text class="text-main">商家回复：</text>
									<text class="text-999">{{ item.shopReplyTime }}</text>
								</view>
								<text class="text-999">
									{{ item.shopReplyContent }}
								</text>
							</view>
						</view>
						<view class="pb-4" v-if="item.addStatus > 0">
							<view class="to-pursue mb-1 pt-2 border-top border-f1 font-weight font-28 text-333" v-if="item.appendDays > 0">
								用户{{ item.appendDays }}天后追评
							</view>
							<view class="to-pursue mb-1 pt-4 border-top border-f1 font-weight font-28 text-333" v-if="item.appendDays == 0">
								用户当天追加评论
							</view>
							<text class="overflow-h" style="line-height: 40rpx" v-if="item.addStatus > 0">{{ item.addContent }}</text>
							<view class="img mt-1 d-flex flex-wrap overflow-h" :class="item.photoList.length >= 4 ? 'h-220r' : ''">
								<view
									class="img-item d-block text-center bg-fff position-relative overflow-h mr-1 mb-2 w-220r h-220r"
									v-for="(pics, indexAddpic) in item.addPhotoList"
									:key="indexAddpic"
								>
									<ls-image :options="{ w: '220', h: '220', br: '24' }" :src="photoServer + pics" @click="clickImage(item.addPhotoList,indexAddpic)">
										<!-- 遮罩层 -->
										<view @click.stop="clickImage(item.addPhotoList, 2)" v-if="item.addPhotoList.length >= 4 && indexAddpic == 2" class="position-absolute top-0 right-0 w-220r h-220r rounded-24 shadow flex-center" style="background-color: rgba(0, 0, 0, .5);">
											<text class="text-fff font-24 font-weight">共{{item.addPhotoList.length}}张 > </text>
										</view>
									</ls-image>
								</view>
							</view>
						</view>
						<view class="py-4 border-top border-f1" v-if="item.addReplyFlag">
							<view class="line-h-md">
								<text class="text-main">商家回复：</text>
								<text class="text-999">
									{{ item.addShopReplyContent }}
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</block>
		<!-- 回到顶部按钮 -->
		<back-top :scrollTop="scrollTop" :showScroll="220" bgColor="rgba(0,0,0,.3)" buttonFixed />
	</view>
</template>

<script>
	import backTop from '@/components/goods/back-top.vue';
	// JS方法
	import pageUtil from '@/utils/pageUtils.js'
	
	// API接口
	import { goodsApi } from '@/api/ModuleGoods.js'
	
	import { mapState } from 'vuex'
	
	const listPage = new pageUtil(goodsApi.commentPage,{ notReset:true })
	import pageScroll from '@/mixins/pageScroll.js'
	export default {
		name: 'GoodComments',
		mixins: [pageScroll],
		onLoad(options) {
			this.comScore = options.comScore
			this.params.productId = options.productId
			listPage.loadListByPage(this, this.params)
		},
		computed: {
			...mapState(['stausBarHeight']),
		},
		components: {
			'back-top': backTop
		},
		data() {
			return {
				currentTab: 0, // 时间排序和评分排序的索引值
				list: [],
				comScore: 0, // 综合评分
				// 请求所携带的参数
				params: {
				    condition: 'all',
				    orderBy:'addtime',// 排序方式 按评论时间排序： addtime 按评论平均分数排：averageScore
				    productId: ''
				},
				paging: {
				    status: 'loading',
				    error: false, // 是否错误
				    emptylist: false // 是否显示列表为空时的样式
				},
				goodScore: 0, // 商品评论总分
				commentNumber: '', // 评论的数量
			}
		},
		onShow() {},
		methods: {
			// 切换排序方式
			changeTab(style) {
				if (style == 'rate') {
					this.currentTab = 1;
					this.params.orderBy = 'averageScore'
				} else {
					this.currentTab = 0;
					this.params.orderBy = 'addtime'
				}
				listPage.loadListByPage(this, this.params)
			},
			// 点击图片预览
			clickImage(picArr,index) {
				const arrPic = picArr.map(item => {
					let pic = this.photoServer + item;
					if (pic.indexOf('dev6.0//dev6.0') != -1) {
						pic = pic.replace('dev6.0//dev6.0', 'dev6.0');// 此判断是为了兼容旧数据
					}
					return pic
				});
			    uni.previewImage({
			        current: index,
			        urls: arrPic
			    })
			},
		},
	}
</script>

<style>
	page {
		background-color: #f8f8f8;
	}
</style>

<style scoped>

</style>
