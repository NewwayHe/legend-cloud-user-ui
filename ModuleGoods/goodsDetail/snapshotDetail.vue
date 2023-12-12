<template>
	<view class="w750" :style="{ '--themescolor': themes.color, '--themesrgba02': themes.rgb02 }">
		<!-- 顶部栏 -->
		<good-head :tabArr="tabArr" :scrollTop="scrollTop" :fixPoint="bannerBottom" :tabCur="tabIndex" @tabSelect="tabSelect" v-if="!isActiveHeadFixed" />

		<!-- 商品详情 -->
		<view class="class-page pb-12" v-show="goodDataHasValue">
			<!-- banner图 -->
			<good-banner class="class-banner" :brandParmas="brandParmas" :bannerPics="[goodData.pic]" :videoUrl="goodData.video" v-if="goodData.pic"/>

			<!-- 活动商品详情banner图下的活动价格及倒计时(注意：如果不加v-if="skuData.skuItem.price"，则不能计算出active-head里的ls-sticky的top值) -->
			<active-head
				:skuType="parmas.skuType"
				:skuData="skuData"
				@downCallback="getDetaildata"
				@isFixed="getIsFixed"
				v-if="skuData.skuItem.activitySkuDTO && skuData.skuItem.activitySkuDTO.price && parmas.activityId && parmas.skuType"
			/>

			<!-- 名称,价格,分销,描述 -->
			<view class="py-1 px-2">
				<ls-price :price="goodData.price" :options="{ is: 48, ds: 24 }" />
				<text class="text-999 font-24 line-through ml-2">¥{{ goodData.originalPrice }}</text>
			</view>
			<view class="px-2 py-1">
				<p class="font-32">{{ goodData.name }}</p>
				<p class="font-24 text-999 my-1">{{ goodData.brief }}</p>
			</view>
			
			<!-- 预售规则 -->
			<presell-floor className="border-top-20bg" :goodData="goodData" v-if="goodData.preSellProductBO && goodData.preSellProductBO.status == 1" />

			<!-- 店铺信息 -->
			<shop-info className="border-top-20bg" :shopData="shopData" v-if="shopData" />
			<!--评论列表(只显示一个)-->
			<view class="class-comment"><good-comment className="border-top-20bg" :prodId="parmas.productId" :num="1" /></view>

			<!-- 商品详情 -->
			<view class="class-detail">
				<view class="border-top-20bg" v-if="goodData.paramGroupBOList && goodData.content">
					<!-- 商品参数 -->
					<good-params :prodList="goodData.paramGroupBOList" />
					<!-- 商品介绍 -->
					<view class="py-4 font-weight font-32 text-333 pl-2">商品介绍</view>
					<view class="overflow-h">
						<u-parse class="font-28 text-333 word-breakall" :html="goodData.content" v-if="goodData.content"></u-parse>
					</view>
				</view>
			</view>

			<!-- 底部TabBar -->
			<good-tabBar ref="goodsTabBar" :parmas="{ consultId: skuData.skuItem.id, consultType: 'prod', shopId: goodData.shopId }" v-if="skuData.skuItem.id">
				<!-- 没参与活动的普通正常商品能正常购买，参与团购和拼团的商品也能正常购买 -->
				<view class="flex-1 flex-center h-100r overflow-h">
					<view class="w-100 flex-center h-80r rounded-100 overflow-h ml-1 mr-2 overflow-h">1231231231243546456</view>
				</view>
			</good-tabBar>

			<!-- 回到顶部按钮 -->
			<back-top :scrollTop="scrollTop" :showScroll="220" bgColor="rgba(0,0,0,.3)" buttonFixed />
		</view>

		<!-- 骨架屏 -->
		<ls-empty className="center-xy" :title="paging.errMsg" :paging="paging" skeleton="商品详情" @reLoad="getDetaildata" reLoad />
		
		<!-- 如果是商家端或PC后台跳进来预览，则加个遮罩层不让点击 -->
		<u-mask :show="isPreview" :duration="0" :custom-style="{background: 'rgba(0, 0, 0, 0)'}"></u-mask>
	</view>
</template>
<script>
// JS方法

// API接口
import { goodsApi } from '@/api/ModuleGoods.js';

// 楼层组件
import goodsHead from '@/components/goods/good-head.vue';
import goodsbanner from '@/components/goods/good-banner.vue';
import activeHead from '@/components/goods/active-head.vue';
import goodInfo from '@/components/goods/good-Info.vue';
import goodCoupon from '@/components/goods/good-coupon.vue';
import goodPromotion from '@/components/goods/good-promotion.vue'; // 促销
import goodComment from '@/components/goods/good-comment.vue';
import goodParams from '@/components/goods/good-params.vue';

// 活动专用楼层组件
import presellFloor from '@/components/goods/presell-floor.vue';

// 楼层功能组件
import skuDet from '@/components/goods/sku-det.vue';
import shopInfo from '@/components/goods/shop-info.vue';
import backTop from '@/components/goods/back-top.vue';

import { mapState } from 'vuex';

export default {
	name: 'snapshotDetail',
	components: {
		'good-head': goodsHead,
		'good-banner': goodsbanner,
		'active-head': activeHead,
		'good-Info': goodInfo,
		'good-coupon': goodCoupon,
		'good-promotion': goodPromotion,
		'good-comment': goodComment,
		'good-params': goodParams,

		'presell-floor': presellFloor,

		'sku-det': skuDet,
		'shop-info': shopInfo,
		'back-top': backTop
	},
	data() {
		return {
			parmas: {
				productId: '', // SPU的商品id
				activityId: '', //活动id 拼团/团购/秒杀活动需传
				skuId: '', //秒杀skuId 秒杀活动需传
				skuType: '' //营销类型： 拼团/团购/秒杀活动需传 普通（''，普通商品的话值为空''，有值就是有活动） 团购（GROUP） 拼团（MERGE） 秒杀（SECKILL）
			},
			snapshotId: null,
			goodData: {}, // 获取商品详情(注意，这个要写成''，不能写成{}，不然判断该对象时内容为空但依然为true)

			scrollTop: '',

			bannerBottom: '', // 记录banner图部的位置，用来计算tabOpacity的值
			detailTop: '', // 用来记录商品介绍的位置
			commentTop: '', // 用来记录商品评论的位置

			tabIndex: 0, // goods-head插件专用，用来控制点击头部tab栏
			hasClickTab: false, // 记录是否已点击了good-head组件的tab栏

			skuData: {
				skuItem: {}, // SKU
				picList: [], // 图片列表
				skuBuyNum: 1
			},

			skuCouponObj: {}, // 优惠券和促销活动的一个大对象
			isActiveHeadFixed: false,

			showPopup: false,
			// Nomsg: false, // 该商品是否下架
			paging: {
				status: 'loading',
				error: false, // 是否错误
				errMsg: '该商品已被删除或已被下线',
				emptylist: false // 是否显示列表为空时的样式
			},
			isPreview: false,//如果是shareUrlRedirect页面跳过来预览(商家端或PC后台跳进来)，就加个遮罩层防止点击
		};
	},

	computed: {
		...mapState(['stausBarHeight', 'timeDiff', 'userInfo']),
		goodDataHasValue() {
			return this.$checkInfo([
				{
					type: 'hasValue',
					value: this.goodData
				}
			]);
		},
		tabArr() {
			let arr = ['商品', '详情', '评价'];
			this.$nextTick(() => {
				//不加$nextTick的话如果是 ['商品', '详情', '评价']，会先变成 ['商品', '评价']再变回['商品', '详情', '评价']
				if (!this.goodData.content && !this.goodData.paramGroupBOList) {
					arr = arr.filter(item => {
						return item != '详情';
					});
				}
			});
			return arr;
		},
		// 传到banner图里的品牌参数
		brandParmas() {
			return {
				brandPic: this.goodData.brandPic,
				brandName: this.goodData.brandName,
				brandId: this.goodData.brandId
			};
		},
		shopData() {
			// 传送到shop-info组件的变量(注意请参考shop-info组件的格式名字传里面的变量)
			let data = {};
			if (this.goodDataHasValue) {
				data = {
					type: 'common',
					dvyTypeAvg: this.goodData.shopDetailBO.dvyTypeAvg,
					productCommentAvg: this.goodData.shopDetailBO.productCommentAvg,
					shopAvatar: this.goodData.shopDetailBO.shopAvatar,
					shopCommAvg: this.goodData.shopDetailBO.shopCommAvg,
					shopId: this.goodData.shopDetailBO.shopId,
					shopName: this.goodData.shopDetailBO.shopName,
					shopType: this.goodData.shopDetailBO.shopType,
					score: this.goodData.shopDetailBO.score
				};
			}
			return data;
		},

		// 邀请码(有parmas.skuType时会才用到该参数)
		invitationCode() {
			let str = '';
			if (this.userInfo) {
				str = this.userInfo.distribution.invitationCode;
			}
			return str;
		},
	},

	watch: {
		// 监听切换SKU而触发的监听
		'skuData.skuItem': function() {}
	},

	async onLoad(option) {
		this.$data['option'] = option;
		this.parmas = {
			token: option.token || null, // 预览token
			productId: option.id || null, // SPU的商品id
			activityId: option.activityId || null, //活动id 拼团/团购/秒杀活动需传
			skuId: option.skuId || null, //秒杀skuId 秒杀活动需传
			skuType: option.skuType || null //营销类型： 拼团/团购/秒杀活动需传 普通（''，普通商品的话值为空''，有值就是有活动） 团购（GROUP） 拼团（MERGE） 秒杀（SECKILL）
		};
		this.snapshotId = option.snapshotId || null;
		this.isPreview = option.isPreview&&option.isPreview!='false' ? true : false
	},
	mounted() {},
	onShow() {
		this.$nextTick(() => {
			if (!this.$data.option.scene) {
				this.getDetaildata(); // 防止进入分享链接重新登陆后无法显示参团
			}
		});
	},
	onHide() {},
	// #ifdef MP-WEIXIN
	// 自定义好友分享。
	onShareAppMessage(res) {
		return {
			title: `￥${this.parmas.skuType ? this.skuData.skuItem.activitySkuDTO.price : this.skuData.skuItem.price} ${this.goodData.name}`,
			path: this.$utils.pages.getPageRoute().url + `&invitationCode=${this.invitationCode || null}`,
			imageUrl: this.photoServer + this.goodData.pic
		};
	},
	// #endif

	// 下拉加载
	onReachBottom() {
		if (this.tabIndex == 2) {
			this.$refs.lsGoodComment.pageMore();
		}
	},

	// 页面滚动执行方式
	onPageScroll(e) {
		// console.log(e.scrollTop);
		this.scrollTop = e.scrollTop;
		if (!this.hasClickTab) {
			this.changeTab(this.scrollTop); // 屏幕滚动到商品详情位置时，改变tab栏的下标
		}
	},

	/*  //监听页面返回(相当于vue原生的beforeRouteLeave)
	 *   Android 实体返回键 (options.from = backbutton)
	 *   顶部导航栏左边的返回按钮 (options.from = backbutton)
	 *   返回 API，即 uni.navigateBack() (options.from = navigateBack)
	 *   注意：1、H5 平台，顶部导航栏返回按钮支持 onBackPress()，浏览器默认返回按键及Android手机实体返回键不支持 onBackPress()。2、暂不支持直接在自定义组件中配置该函数，目前只能是在页面中来处理。
	 */
	onBackPress(options) {},

	methods: {
		// 获取页面初始数据
		getDetaildata() {
			this.paging = {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false, // 是否显示列表为空时的样式
				errMsg: '该商品已被删除或已被下线'
			};
			goodsApi
				.productSnapshot({
					snapshotId: this.snapshotId
				})
				.then(res => {
					console.log(res, 'resss');
					if (res.code == 1) {
						this.goodData = res.data; // 原始数据
						this.$nextTick(() => {
							this.getPosition();
						});
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
					if (
						!this.$checkInfo([
							{
								type: 'hasValue',
								value: this.goodData
							}
						])
					) {
						this.paging.emptylist = true;
					}
				});
		},

		changeSku(flag) {
			this.showPopup = flag;
		},

		// 点击组件里tab栏
		tabSelect(tabIndex) {
			/*
				    parmas:hasClickTab
				    hasClickTab值是记录是否已点击了ls-good-head组件的tab栏。当商品详情页的内容比较少(整个页面高度只大于手机屏幕高度+banner图高度一点点时)，但又触发了颜色渐变时，
				    不设该值的话，会出现点击tab栏的‘评分’，再点击‘详情’，会强行触发changeTab方法导致tab栏上的‘商品’按钮马上高亮的bug
				 */
			this.hasClickTab = true;
			setTimeout(() => {
				this.hasClickTab = false;
			}, 2000);
			this.tabIndex = tabIndex;
			if (tabIndex == 0) {
				this.$nextTick(() => {
					// 必需要用$nextTick，不然数据v-show切换后，pageScrollTo会失效
					uni.pageScrollTo({
						scrollTop: 0
					});
				});
			}
			if (this.tabIndex == 1) {
				this.$nextTick(() => {
					// 必需要用$nextTick，不然数据v-show切换后，pageScrollTo会失效
					uni.pageScrollTo({
						scrollTop: this.detailTop
					});
				});
			}
			if (tabIndex == 2) {
				this.$nextTick(() => {
					// 必需要用$nextTick，不然数据v-show切换后，pageScrollTo会失效
					uni.pageScrollTo({
						scrollTop: this.commentTop
					});
				});
			}
		},
		// 获取所需楼层在屏幕中的位置
		async getPosition() {
			this.$nextTick(() => {
				this.$utils.getRect(this, '.class-banner').then(resBanner => {
					if (resBanner) {
						this.$utils.getRect(this, '.class-page').then(resPage => {
							if (resPage) {
								this.bannerBottom = resBanner.bottom - uni.upx2px(88);
							}
						});
					}
				});
				this.$utils.getRect(this, '.class-detail').then(resDetail => {
					if (resDetail) {
						// 这里加(this.parmas.skuType?uni.upx2px(88):0),是考虑了活动商品时,<active-head>组件点的位置
						this.detailTop = resDetail.top - this.stausBarHeight - (this.parmas.skuType ? uni.upx2px(88 + 80) : uni.upx2px(80));
					}
				});
				this.$utils.getRect(this, '.class-comment').then(resDetail => {
					if (resDetail) {
						// 这里加(this.parmas.skuType?uni.upx2px(88):0),是考虑了活动商品时,<active-head>组件点的位置
						this.commentTop = resDetail.top - this.stausBarHeight - (this.parmas.skuType ? uni.upx2px(88 + 80) : uni.upx2px(80));
					}
				});
			});
		},

		changeTab(scrollTop) {
			this.$u.debounce(() => {
				// 屏幕滚动到商品详情位置时，改变tab栏的下标
				// if (this.bannerBottom != 'none') {
				// 当页面内容+banner图高度大于可使用窗口高度时，才触发屏幕滚动到商品详情位置时，改变tab栏的下标
				if (scrollTop >= this.detailTop) {
					this.tabIndex = 1;
				} else if (scrollTop >= this.commentTop) {
					this.tabIndex = 2;
				} else {
					this.tabIndex = 0;
				}
				// }
			}, 100);
		},

		getIsFixed(flag) {
			console.log(flag);
			this.isActiveHeadFixed = flag;
		}
	}
};
</script>

<style lang="scss" scoped></style>
