<template>
	<view class="w750" :style="{ '--themescolor': themes.color }">
		<!-- 头部搜索栏 -->
		<ls-header :background="isFixed ? themes.color : ''" showHeadSelect :headSelectIcon="2" :zIndex="9999">
			<view class="flex-around flex-1 zindex-9999">
				<view class="flex-1 flex-start pl-2 pr-1 mr-1 bg-bg rounded-50 h-56r position-relative ">
					<text class="iconfont icon-sousuo" :style="{ color: '#ddd' }"></text>
					<input
						class="w-100 font-28 text-bbb ml-2"
						type="text"
						v-model="searchQuery.key"
						@confirm="enterSearch"
						confirm-type="search"
						maxlength="50"
						placeholder="搜索店铺商品"
						placeholder-style="color:#bbbbbb; font-size:28rpx;"
					/>
					<view class="w-60r h-60r flex-center" @click.stop="clean('key')" v-show="searchQuery.key">
						<view class="iconfont icon-close text-ccc" style="font-size: 36rpx;"></view>
					</view>
				</view>
			</view>
		</ls-header>
		<!-- /头部搜索栏 -->
		<view class="h-120r p-2 overflow-h flex-between font-24 bg-fff" v-if="shopHeadData" @click="toShopDetails">
			<ls-image :src="shopHeadData.shopAvatar" :options="{ w: '100', h: '100', br: '8' }" />
			<view class="flex-1 h-100 pl-2 flex-between overflow-h">
				<view class="flex-1 overflow-h">
					<view class="flex-col-between font-32 font-weight line-clamp1">{{ shopHeadData.shopName }}</view>
					<view class="">
						<u-rate
							style="vertical-align: top;"
							:count="5"
							:gutter="3"
							:current="shopHeadData.score || 0"
							disabled
							size="20"
							:active-color="themes.color"
							allowHalf
							inactive-icon="star-fill"
						></u-rate>
					</view>
				</view>
				<!-- 备注：下面之所以加上zindex-109，是因为不加上zindex-109的话，小程序上点击关注按钮，点不动 -->
				<view class="rounded-30 px-2 py-1 zindex-109 text-white" :style="{ background: themes.color }" @click.stop="shopEditCollect(shopHeadData)">
					<text class="iconfont icon-guanzhu" style="font-size: 24rpx;" v-show="!shopHeadData.collectionFlag"></text>
					<text class="v-text-top pl">{{ shopHeadData.collectionFlag ? '已' : '' }}关注</text>
				</view>
			</view>
		</view>

		<view class="class-tab pb-10">
			<view class="border-top-20bg" v-show="action == '分类'">
				<ls-collapse :accordion="true" v-if="category && category.length" style="height: 100%;">
					<ls-collapse-item
						v-for="(item, index) in category"
						:key="index"
						:title="item.name"
						:show-animation="true"
						:showIcon="item.children && item.children.length ? true : false"
						showBlock
						:blockColor="themes.color"
						@change="choiseCategory(1, item.id, item.children && item.children.length ? true : false)"
					>
						<ls-collapse :accordion="true">
							<ls-collapse-item
								style="padding-left: 60rpx;"
								v-for="(item1, index1) in item.children"
								:key="index1"
								:title="item1.name"
								:show-animation="true"
								:showIcon="item1.children && item1.children.length ? true : false"
								openBgColor="#ffffff"
								@change="choiseCategory(2, item1.id, item1.children && item1.children.length ? true : false)"
							>
								<view class="w-100 pb-3 bg-white">
									<view
										class="d-inline-block rounded-100 bg-f5 ml-3 mt-3 px-2 py-15r"
										v-for="(item2, index2) in item1.children"
										:key="index2"
										@click="choiseCategory(3, item2.id)"
									>
										{{ item2.name }}
									</view>
								</view>
							</ls-collapse-item>
						</ls-collapse>
					</ls-collapse-item>
				</ls-collapse>
				<ls-empty className="center-xy" :color="themes.color" :type="3" :title="'该店铺暂未设置商品分类'":paging="catPaging"/>
			</view>

			<!-- 全部商品 -->
			<view v-show="action == '商品'">
				<view class="position-sticky zindex-2" :style="{ top: 88 + 'rpx', paddingTop: stausBarHeight + 'px', marginTop: -stausBarHeight + 'px' }">
					<view class="m-tabs d-flex a-center text-center font-28 bg-fff h-80r">
						<view class="flex-1 flex-center" :class="{ 'text-main': searchQuery.sortBy == 'multiple' }" @click="sortGood('multiple')"><text>综合</text></view>
						<view class="flex-1 flex-center" :class="{ 'text-main': searchQuery.sortBy == 'buys' }" @click="sortGood('buys')">
							<text>销量</text>
							<view class="ml-1 scale-07 text-ccc">
								<view
									class="iconfont icon-caret-top"
									:class="{ 'text-main': searchQuery.sortBy == 'buys' && !searchQuery.descending }"
									style="font-size: 20rpx; margin-bottom: -12rpx"
								></view>
								<view
									class="iconfont icon-caret-bottom"
									:class="{ 'text-main': searchQuery.sortBy == 'buys' && searchQuery.descending }"
									style="font-size: 20rpx"
								></view>
							</view>
						</view>
						<view class="flex-1 flex-center" :class="{ 'text-main': searchQuery.sortBy == 'price' }" @click="sortGood('price')">
							<text style="padding-bottom: 6rpx;">价格</text>
							<view class="ml-1 scale-07 text-ccc">
								<view
									class="iconfont icon-caret-top"
									:class="{ 'text-main': searchQuery.sortBy == 'price' && !searchQuery.descending }"
									style="font-size: 20rpx;margin-bottom: -12rpx;"
								></view>
								<view
									class="iconfont icon-caret-bottom"
									:class="{ 'text-main': searchQuery.sortBy == 'price' && searchQuery.descending }"
									style="font-size: 20rpx;"
								></view>
							</view>
						</view>
					</view>
				</view>
				<view class="overflow-h border-top-20bg w-100 font-28">
					<!-- 新组件(其实就是搜索页面的商品列表) -->
					<ls-load-more :status="paging.status" v-if="!paging.emptylist">
						<products :horizontal="changeType">
							<productItem
								v-for="proItem in list"
								:key="proItem.productId"
								:parmas="proItem"
								:name="proItem.productName"
								:money="proItem.discountPrice || proItem.discountPrice == 0 ? proItem.discountPrice : proItem.price"
								:pic="proItem.productPic"
								:originalPrice="proItem.discountPrice || proItem.discountPrice == 0 ? proItem.price : proItem.originalPrice"
								:horizontal="changeType"
								:type="2"
								:color="themes.color"
							></productItem>
						</products>
					</ls-load-more>
					<ls-empty className="center-xy" :color="themes.color" :type="3" :title="'暂无数据'" :paging="paging" @reLoad="getList" reLoad />
				</view>
			</view>
		</view>

		<!-- 底部TabBar,下面这个z-index，设999，会把u-popup抽屉（商品分类）挡住，设99，会被装修楼层挡住，所以取998 -->
		<view
			class="w-100 bg-white shadow-lg safearea-bb-white position-fixed bottom-0 right-0 content-box"
			style="z-index: 998; border-bottom: var(--safe-area-inset-bottom) solid #FFFFFF;"
		>
			<view class="h-100r w-100 flex-around font-sm text-666 text-nowrap">
				<view class="flex-col-center flex-1" :style="{ color: action == '商品' ? themes.color : '' }" @click="changeTab('商品')">
					<text class="iconfont icon-shangpin1 font-weight" style="font-size: 40rpx"></text>
					<text>商品</text>
				</view>
				<view class="flex-col-center flex-1" :style="{ color: action == '分类' ? themes.color : '' }" @click="changeTab('分类')">
					<text class="iconfont icon-fenlei2 font-weight" style="font-size: 40rpx"></text>
					<text>分类</text>
				</view>
				<view class="flex-col-center flex-1" :style="{ color: action == '客服' ? themes.color : '' }" @click="changeTab('客服')" v-if="contactInfo.openFlag">
					<text class="iconfont icon-kefu2" style="font-size: 40rpx" />
					<text>客服</text>
				</view>
			</view>
		</view>
		<!-- 如果是商家端或PC后台跳进来预览，则加个遮罩层不让点击 -->
		<u-mask :show="isPreview" :duration="0" :custom-style="{background: 'rgba(0, 0, 0, 0)'}"></u-mask>
	</view>
</template>

<script>
// JS方法
import pageUtils from '@/utils/pageUtils.js';

// API接口
import { trim } from '@/api/ModulesCommon.js';
import { search } from '@/api/ModuleGoods.js';
import { shopDetail } from '@/api/ModuleShop.js';

import products from '@/components/ls-app/ls-products/products';
import productItem from '@/components/ls-app/ls-products/productItem';

import mpShare from '@/mixins/mpShare.js'
import pageScroll from '@/mixins/pageScroll.js'
import { mapState } from 'vuex';
const listPage = new pageUtils(search.searchProduct,{ notReset:true });
export default {
	components: {
		products,
		productItem,
	},
	mixins: [mpShare,pageScroll],
	data() {
		return {
			action: '商品', // 点击tab时获取的索引
			shopHeadData: '', // 店铺首页头部数据
			searchQuery: {
				key: '', // 搜索词
				descending: false,
				sortBy: 'multiple', // multiple 默认排序  // price 价格排序  //sale 销量排序
				distType: 1
			},
			searchText: '', // 输入的搜索内容
			active: 'recDate', // 商品列表头部栏(排序)
			buysSort: '', // 商品列表头部栏(‘销量’点击事件)
			commentsSort: '', // 商品列表头部栏(‘评论’点击事件)
			cashSort: '', // 商品列表头部栏(‘价格’点击事件)
			changeType: true, // 切换列表时用

			offsetTop: '', // 获取tab栏顶部在屏幕中的位置
			isFixed: false, // 标记头部是否变色
			list: [],
			paging: {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false // 是否显示列表为空时的样式
			},
			catPaging: {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false // 是否显示列表为空时的样式
			},
			category: [], // 一级分类,
			contactInfo: {}, // 客服信息
			isPreview: false,// 如果是shareUrlRedirect页面跳过来预览(商家端或PC后台跳进来)，就加个遮罩层防止点击

		};
	},
	watch: {
		scrollTop: {
			handler(val) {
				this.$nextTick(() => {
					uni.$u.debounce(() => {
						if (val >= this.offsetTop) {
							this.isFixed = true;
						} else {
							this.isFixed = false;
						}
					},10)
				});
			}
		},
	},
	computed: {
		...mapState(['stausBarHeight']),
	},
	onLoad(option) {
		// #ifdef APP-PLUS
		plus.navigator.setStatusBarStyle('dark');
		// #endif
		// #ifdef MP
		if (option.scene) return; // 如果是扫小程序码进过来的,就在这里return掉。则用sceneCallBack()方法来执行getDetaildata()
		// #endif
		// 在这里设置点击sCategory页面里的“全部商品”时的跳转方法
		this.$data['option'] = option;
		this.searchQuery.shopId = option.shopId || '';
		this.isPreview = !!(option.isPreview && option.isPreview != 'false')
		this.getList()
		this.getShopHead(); // 获取页面上店铺的头部信息
		this.$nextTick(() => {
			this.getOffsetTop(); // 获取tab栏在屏幕中的位置
		});
		this.$store.dispatch('getContactInfo', option.shopId).then(res => {
			if (res) {
				this.contactInfo = res;
			}
		});
	},
	mounted() {},

	// 下拉加载
	onReachBottom() {
		if (this.action === '商品') {
			listPage.loadListByPageMore();
		}
	},

	// #ifdef MP-WEIXIN
	// 自定义好友分享。
	onShareAppMessage(res) {
		return {
			title: this.shopHeadData.siteName,
			path: this.$utils.pages.getPageRoute().url
		};
	},
	// #endif

	methods: {
		// 小程序码跳转进来[mixin->mpShare]
		sceneCallBack(data){
			console.log('sceneCallBack：',data);
			this.$data['option'] = data;
			this.searchQuery.shopId = data.shopId;
			this.getList()
			this.getShopHead(); // 获取页面上店铺的头部信息
			this.$nextTick(() => {
				this.getOffsetTop(); // 获取tab栏在屏幕中的位置
			});
			this.$store.dispatch('getContactInfo', data.shopId).then(res => {
				if (res) {
					this.contactInfo = res;
				}
			});
		},
		toShopDetails(){
			uni.navigateTo({
				url: `/ModuleGoods/shopHome/shopDetails?id=${this.$data.option.shopId}`
			});
		},
		getShopHead() {
			// 获取页面上店铺的头部信息
			trim.shopIndex({ shopId: this.$data.option.shopId }).then(res => {
				if (res.code == 1) {
					this.shopHeadData = res.data;
				}
			});
		},

		// 获取全部商品数据
		getList() {
			this.$u.debounce(() => {
				console.log(this.searchQuery);
				listPage.loadListByPage(this, { ...this.searchQuery });
			});
		},

		// 点击tab栏时的方法
		changeTab(item) {
			this.$u.throttle(() => {
				if (item == '商品') {
					this.searchQuery = {
						key: '', // 搜索词
						descending: false,
						sortBy: 'multiple', // multiple 默认排序  // price 价格排序  //sale 销量排序
						shopId: this.$data.option.shopId || ''
					};
				}
				if (item == '商品' && this.action == '商品') {
					this.getList();
					return
				}
				this.action = item;
				if (this.action == '商品' && !this.$checkInfo([{ type: 'hasValue', value: this.list }])) {
					this.getList(); // 获取全部商品数据
				}
				if (this.action == '分类' && !this.$checkInfo([{ type: 'hasValue', value: this.category }])) {
					this.toSCategory();
				}
				if (this.action == '客服') {
					this.$navigateTo(`/ModuleCenter/contact/contact?shopId=${this.$data.option.shopId}&shopContactDTO=${encodeURIComponent(JSON.stringify(this.contactInfo))}`);
					this.$nextTick(() => {
						this.action = '商品';
					});
				}
				this.$pageScrollTo(); // 返回顶部
			})
		},

		// 排序
		sortGood(type) {
			if (type == 'price') {
				if (this.searchQuery.sortBy != 'price') {
					this.searchQuery.descending = true;
				} else {
					this.searchQuery.descending = !this.searchQuery.descending;
				}
				this.searchQuery.sortBy = type;
			}
			if (type == 'buys') {
				this.searchQuery.sortBy = type;
				this.searchQuery.descending = !this.searchQuery.descending;
			}
			if (type == 'multiple') {
				if (this.searchQuery.sortBy == type) return;
				else this.searchQuery.sortBy = type;
				this.searchQuery.descending = false;
			}
			this.$pageScrollTo(); // 返回顶部
			this.getList();
		},

		shopEditCollect(content) {
			this.$u.debounce(() => {
				shopDetail
					.favoriteShopFlag({
						shopIds: [content.shopId],
						collectionFlag: !content.collectionFlag
					})
					.then(res => {
						uni.showToast({
							title: `${!content.collectionFlag ? '收藏成功' : '取消收藏'}`,
							icon: 'none'
						});
						this.getShopHead();
					});
			});
		},

		enterSearch(event) {
			this.action = '商品';
			this.searchText = this.$stringUtils.trim(this.searchQuery.key, 2);
			listPage.loadListByPage(this, { ...this.searchQuery });
		},

		// 店内搜索
		search() {
			this.action = '商品';
			this.params = {}; // 先清除数据，再只搜索shopId，和key、curPageNO，不清除数据，会出现各种bug
			this.params.shopId = this.$data.option.shopId;
			this.params.key = this.searchText;
			listPage.loadListByPage(this, { ...this.searchQuery });
		},

		// 去店铺分类,关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。如果用uni.navigateTo跳转，会出现多次点击‘分类’后再点击返回有空白页面的bug
		toSCategory() {
			if (!this.category.length) {
				this.catPaging = {
					status: 'loading',
					error: false, // 是否错误
					emptylist: false // 是否显示列表为空时的样式
				}
				shopDetail
					.prodCategory({
						shopId: this.$data.option.shopId,
						status: 1
					})
					.then(res => {
						console.log(res.data);
						if (res.code == 1) {
							this.category = res.data;
						} else {
							uni.showToast({
								title: res.msg,
								duration: 1000,
								icon: 'none'
							});
						}
					}).catch(err => {
						this.catPaging.error = true;
					})
					.finally(res => {
						this.catPaging.status = 'noMore';
						if (!this.$checkInfo([{ type: 'hasValue', value: this.category }])) {
							this.catPaging.emptylist = true;
						}
						uni.stopPullDownRefresh();
					});
			}
		},

		choiseCategory(flag, id, showIcon) {
			this.action = '商品';
			console.log(id);
			this.searchQuery = {}; // 先清除数据，再只搜索shopId，和key、curPageNO，不清除数据，会出现各种bug
			this.searchQuery.shopId = this.$data.option.shopId;
			this.searchQuery.shopCategoryId = id;

			// this.searchQuery.shopFirstCatId = flag==1?id:''
			// this.searchQuery.shopSecondCatId = flag==2?id:''
			// this.searchQuery.shopThirdCatId = flag==3?id:''
			listPage.loadListByPage(this, { ...this.searchQuery });
			if (flag == 3 || !showIcon) {
				// this.classType = false;
			}
		},

		// 去商品详情
		toGoodsDetail(event) {
			const goodsInfoId = event.productId;
			uni.navigateTo({
				url: `/ModuleGoods/goodsDetail/goodsDetail?id=${goodsInfoId}`
			});
		},

		// 清除输入框的内容
		clean(flag) {
			this.searchQuery[flag] = '';
		},

		// 获取tab栏在屏幕中的位置
		async getOffsetTop() {
			const tabRect = await this.$utils.getRect(this, '.class-tab');
			this.offsetTop = tabRect.top;
		},

		changeList() {
			// 全部商品页面处切换横向列表和纵向列表
			this.changeType = !this.changeType;
		}
	}
};
</script>

<style>
	page {
		background-color: #F8F8F8;
	}
</style>
<style lang="scss" scoped></style>
