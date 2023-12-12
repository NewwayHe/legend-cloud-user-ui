<template>
	<view class="w750 font-24 h-100vh flex-col-start" :style="{ '--themescolor': themes.color, '--themesrgba02': themes.rgb02 }">
		<ls-header>
			<view class="flex-1 px-10">
				<ls-tabs-swiper
					ref="uTabs"
					:list="[{ name: '商品' }, { name: '店铺' }]"
					:active-color="themes.color"
					:current="current"
					@change="tabsChange"
					:is-scroll="false"
				></ls-tabs-swiper>
			</view>
			<view class="w-88r h-100 flex-center font-30 text-nowrap" slot="right" @click="edit">{{ clooseFlag ? '完成' : '编辑' }}</view>
		</ls-header>
		<!-- /头部 -->
		<!-- 我的收藏 -->
		<view class="flex-1 w-100">
			<swiper class="w-100 h-100" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
				<!-- 收藏商品 -->
				<swiper-item class="w-100 h-100">
					<scroll-view class="h-100 w-100" scroll-y @scrolltolower="onreachBottom">
						<ls-load-more :status="prodPaging.status" v-if="prodList && prodList.length" :key="current">
							<view class="flex-center p-2 border-f8-bottom-x20r bg-white" v-for="(item, index) in prodList" @click.stop="changeStatus(item)" :key="index">
								<view class="transition-all05" :style="{ width: clooseFlag ? '60rpx' : '0' }">
									<radio :checked="item.selected" :color="themes.color" style="transform:scale(0.8)" v-if="clooseFlag" />
								</view>
								<ls-image :src="item.pic" :options="{ w: '180', h: '180', br:'12' }" :key="item.id" />
								<view class="flex-1 flex-col-between pl-2" style="height: 180rpx">
									<view>
										<view class="line-clamp2 font-28">{{ item.productName }}</view>
										<view class="text-999 pt-1">{{ item.favoriteCount }}人收藏</view>
									</view>
									<view class="flex-between w-100"><ls-price :price="item.price" :options="{ is: '32' }"></ls-price></view>
								</view>
							</view>
						</ls-load-more>
						<ls-empty className="center-xy" :type="4" :title="'您还没有收藏过商品'" :paging="prodPaging" @reLoad="getData" reLoad />
					</scroll-view>
				</swiper-item>
				<!-- 收藏店铺 -->
				<swiper-item class="w-100 h-100">
					<scroll-view class="h-100 w-100" scroll-y @scrolltolower="onreachBottom">
						<ls-load-more className="p-2" :status="shopPaging.status" v-if="shopList && shopList.length" :key="current">
							<view class="flex-start" v-for="(item, index) in shopList" @click="changeStatus(item)" :key="index">
								<view class="transition-all05" :style="{ width: clooseFlag ? '60rpx' : '0' }">
									<radio :checked="item.selected" :color="themes.color" style="transform:scale(0.8)" v-if="clooseFlag" />
								</view>
								<view class="flex-1 p-2 mb-2 bg-white rounded-24 overflow-h">
									<view class="flex-start w-100">
										<ls-image :src="item.shopPic" :options="{ w: '80', h: '80', br:'100%' }" />
										<view class="flex-1 overflow-h pl-2">
											<view class="w-100 overflow-h flex-start">
												<view class="overflow-h" style="max-width: 100%;">
													<view class="line-clamp1 font-28">{{ item.shopName }}</view>
												</view>
												<text class="text-main border border-main px-1 rounded-5 font-sm text-nowrap ml-2" v-if="item.shopType === 0||item.shopType === 1||item.shopType === 2">
													{{ item.shopType === 0 ? '专营店' : item.shopType === 1 ? '旗舰店' : item.shopType === 2 ? '自营' : '' }}
												</text>
											</view>
											<view class="mt-1 text-999 line-h overflow-h">
												<!-- <text class="text-999 px-3">{{ item.score ? item.score : 0 }}分</text> -->
												<text class="">{{ item.favoriteCount | numFormat }}人收藏</text>
												<text class="border-left border-ccc pl-2 ml-2" v-if="item.recDate">收藏时间:{{item.recDate}}</text>
											</view>
										</view>
									</view>
									<view class="flex-start flex-nowrap overflow-h w-100" @click.capture="capture(item)">
										<view class="mr-2 mt-3" v-for="(itemGood,indexGood) in item.items" :key="indexGood" @click.stop="goGoodsDetail(itemGood.productId)">
											<ls-image :src="itemGood.pic" :options="{ h: '210', w: '210', br:'12' }"></ls-image>
										</view>
									</view>
								</view>
							</view>
						</ls-load-more>
						<ls-empty className="center-xy" :type="4" :title="'您还没有收藏过店铺'" :paging="shopPaging" @reLoad="getData" reLoad />
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>

		<template v-if="clooseFlag">
			<view class="position-fixed bottom-0 safearea-bb w-100" :class="[{ 'pointer-none': !resultList.length }]" :key="current">
				<view class="bg-white font-28 border-top flex-between w-100 p-2 ">
					<view @click.stop="allSelectChange">
						<radio :checked="allSelected" :color="themes.color" style="transform:scale(0.8)" />
						全选
					</view>
					<!-- 备注：下面这个判断Number(hasSelectedList.length)要加Number强转，不然小程序会判断不出来 -->
					<view class="rounded-100 w-200r h-80r flex-center border border-e4" :style="{ color: Number(hasSelectedList.length) ? '' : '#cccccc' }" @click="detCollection">
						{{ current == 1 || current == 3 ? '取消关注' : '取消收藏' }}({{ hasSelectedList.length }})
					</view>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
import pageUtil from '@/utils/pageUtils.js';

import { goodsApi, user } from '@/api/ModuleGoods.js';
import { shopDetail } from '@/api/ModuleShop.js';

const listPage1 = new pageUtil(goodsApi.favoriteProductPage, { field: { list: 'prodList', paging: 'prodPaging' } });
const listPage2 = new pageUtil(goodsApi.favoriteShopPage, { field: { list: 'shopList', paging: 'shopPaging' } });
export default {
	name: 'collection',
	components: {},
	data() {
		return {
			current: 0, // tab切换,0:商品，1:店铺
			swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
			clooseFlag: false, // 底部选择
			prodPaging: {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false // 是否显示列表为空时的样式
			},
			shopPaging: {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false // 是否显示列表为空时的样式
			},
			articlePaging: {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false // 是否显示列表为空时的样式
			},
			userPaging: {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false // 是否显示列表为空时的样式
			},
			prodList: [],
			shopList: [],
			articleList: [],
			userList: [],
			params: {
				articleType: 1
			}
		};
	},
	computed: {
		hasSelectedList() {
			//已经选中的列表
			return this.resultList.filter(item => item.selected);
		},
		allSelected() {
			return this.resultList.length != 0 && this.resultList.length == this.resultList.filter(item => item.selected).length;
		},
		resultList() {
			if (this.current == 0) {
				return this.prodList;
			} else if (this.current == 1) {
				return this.shopList;
			} else if (this.current == 2) {
				return this.articleList;
			} else {
				return this.userList;
			}
		}
	},
	onLoad() {},
	onShow() {
		this.getData();
	},
	mounted() {},

	// 下拉加载
	onReachBottom() {},
	methods: {
		/**
		 * 封装的从接口处获取数据的方法
		 * @param {*} current 点击‘商品’或‘店铺’获取数据，'prod'：商品数据，'shop'：店铺数据
		 * @param {*} isAppend 是否已经加载过，true：已经加载过，false：第一次加载
		 */
		getData() {
			//不往里面塞一个selected的话，computed里的hasSelectedList，allSelected值及HTML上不会因为selected变化而变化
			listPage1.loadListByPage(
				this,
				{},
				{
					listHandler: res => {
						res.forEach(item => {
							item['selected'] = false;
						});
						return res;
					}
				}
			);
			listPage2.loadListByPage(
				this,
				{},
				{
					listHandler: res => {
						res.forEach(item => {
							item['selected'] = false;
						});
						return res;
					}
				}
			);
		},
		// 切换商品或店铺tab
		tabsChange(index) {
			this.current = index;
			this.swiperCurrent = index;
			uni.pageScrollTo({
				scrollTop: 0
			}); // 回到页面顶部
		},
		// swiper-item左右移动，通知tabs的滑块跟随移动
		transition(e) {
			let dx = e.detail.dx;
			this.$refs.uTabs.setDx(dx);
		},

		// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
		// swiper滑动结束，分别设置tabs和swiper的状态
		animationfinish(e) {
			let current = e.detail.current;
			this.$refs.uTabs.setFinishCurrent(current);
			this.swiperCurrent = current;
			this.current = current;
		},

		// scroll-view到底部加载更多
		onreachBottom() {
			if (this.current === 0) {
				listPage1.loadListByPageMore();
			}
			if (this.current === 1) {
				listPage2.loadListByPageMore();
			}
		},

		// 唤起编辑栏
		edit() {
			this.clooseFlag = !this.clooseFlag;
			// 以下这段代码是由点击完成后,所有选中的都清空(如果不想清空选中，可以把下面这段代码屏蔽)
			if (this.clooseFlag == false && this.resultList && this.resultList.length) {
				this.resultList.forEach((item, index) => {
					item.selected = false;
				});
			}
		},

		// 单个选择
		changeStatus(item) {
			// 如果是跳转
			if (!this.clooseFlag) {
				if (this.current == 0) {
					this.$navigateTo(`/ModuleGoods/goodsDetail/goodsDetail?id=${item.productId}`);
				}
				if (this.current == 1) {
					if (item.status == 1) {
						this.$navigateTo(`/ModuleGoods/shopHome/shopIndex?shopId=${item.shopId}`);
					} else {
						uni.showToast({
							title: '店铺已下线！',
							icon: 'none'
						});
					}
				}
				// 如果是编辑
			} else {
				item.selected = !item.selected;
				this.$forceUpdate();
			}
		},
		// 先于@click.stop里的goGoodsDetail()来获取点击方法，
		capture(item){
			if (this.clooseFlag) {
				this.changeStatus(item)
			}
		},
		//与上面的capture()方法一起同时执行
		goGoodsDetail(id){
			if(!this.clooseFlag&&id){
				this.$navigateTo(`/ModuleGoods/goodsDetail/goodsDetail?id=${id}`)
			}
		},

		// 全部选择框改变
		allSelectChange() {
			const value = this.allSelected;
			console.log(value, 'value');
			this.resultList.forEach(element => {
				console.log(element, 'element');
				element.selected = !value;
			});
		},
		// 删除
		detCollection() {
			// 如果一个都没选中,则点击无效
			if (!this.hasSelectedList.length) return;
			const IdArr = []; // 存id
			const arr2 = []; // 存没有选中的最后更新列表
			this.resultList.forEach(element => {
				if (element.selected) {
					if (this.current == 0) {
						IdArr.push(element.productId);
					}
					if (this.current == 1) {
						IdArr.push(element.shopId);
					}
					if (this.current == 2) {
						IdArr.push(element.artId);
					}
				} else {
					arr2.push(element);
				}
			});

			uni.showModal({
				title: `取消${this.current == 0 ? '收藏' : '关注'}`,
				content: `是否确认取消${this.current == 0 ? '收藏' : '关注'}`,
				success: res => {
					if (res.confirm) {
						if (this.current == 0) {
							goodsApi
								.saveFavorite({
									productIds: IdArr,
									collectionFlag: false
								})
								.then(res => {
									if (res.code == 1) {
										this.prodList = arr2;
										//当全部都删完时，则显示ls-empty组件
										if (!this.prodList.length) {
											this.prodPaging.emptylist = true;
										}
									}
								});
						}
						if (this.current == 1) {
							shopDetail
								.favoriteShopFlag({
									shopIds: IdArr,
									collectionFlag: false
								})
								.then(res => {
									if (res.code == 1) {
										this.shopList = arr2;
										//当全部都删完时，则显示ls-empty组件
										if (!this.shopList.length) {
											this.shopPaging.emptylist = true;
										}
									}
								});
						}
					} else if (res.cancel) {
					}
				}
			});
		},
		// 分割多张图片 只显示第一张
		splitImage(images) {
			return images?images.split(',')[0]:null
		}
	}
};
</script>
<style>
	page {
		background-color: var(--backgroundcolor);
	}
</style>
<style lang="scss" scoped></style>
