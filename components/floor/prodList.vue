<template>
	<!-- /*
     * @Descripttion:(楼层组件：商品列表)：prodList
    */ -->
	<view class="border-box scrollFlag" :style="{ backgroundColor: floors.themeColor ? parmas.themeColor : floors.backgroundColor, 'min-height': `${minHeight}rpx` }">
		<!-- 如果是换行模式，或详情列表 -->
		<template v-if="floors.wrap || floors.listType == 1">
			<view class="p-2 overflow-h grid-gap20" :class="[`grid-column${floors.listType}`]" v-if="goodsList && goodsList.length">
				<view class="overflow-h" v-for="(item, index) in goodsList" :key="index">
					<view
						class="overflow-h bg-white"
						:class="[floors.cardType ? 'rounded-20 translate3d0' : '', floors.listType == 1 ? 'flex-start' : 'flex-col-start']"
						@click="jumpPage(item, shopId)"
					>
						<view class="position-relative" :class="[floors.listType == 1 && (floors.showSpuName || floors.showPrice) ? 'w-200r h-200r' : 'w-100 h-0 pb-100pre']">
							<view class="position-absolute left-0 w-100 h-100">
								<ls-image :options="{ w: '100.5%', h: '100.5%' }" :osOptions="{ w: 500, h: 500 }" :src="pic(item)" mode="aspectFill" />
							</view>
							<text
								class="iconfont icon-remai position-absolute left-0 zindex-2"
								style="font-size: 64rpx;top:-1px"
								:style="{ color: parmas.themeColor }"
								v-if="floors.showIcon == 'hot'"
							/>
							<text
								class="iconfont icon-xinpin position-absolute left-0 zindex-2"
								style="font-size: 64rpx;top:-1px"
								:style="{ color: parmas.themeColor }"
								v-if="floors.showIcon == 'new'"
							/>
							<!-- 白色三角形，用来做热卖或新品图标的底色 -->
							<text
								class="position-absolute left-0 top-0"
								style=" border-top: 56rpx solid #ffffff; border-right: 56rpx solid transparent; border-bottom: 0rpx solid #ffffff;"
								v-if="floors.showIcon == 'hot' || floors.showIcon == 'new'"
							></text>
							<image
								class="position-absolute left-0"
								style="height: 60rpx; width: 60rpx;top:-1px"
								:src="photoServer + floors.iconImg"
								alt=""
								v-if="floors.iconImg && floors.showIcon == 'diy'"
							/>
						</view>

						<view
							class="p-2 position-relative border-box overflow-h"
							v-if="floors.showSpuName || floors.showPrice"
							:class="[floors.listType == 1 ? 'flex-1 h-200r flex-col-between' : 'w-100']"
						>
							<view
								:class="[floors.listType == 3 || floors.listType == 4 ? 'font-24' : 'font-28']"
								:style="{ height: `${floors.listType == 3 || floors.listType == 4 ? '68' : '72'}rpx` }"
								v-if="floors.showSpuName"
							>
								<text class="line-clamp2">{{ name(item) }}</text>
							</view>
							<view
								class="font-24 font-arial flex-between w-100"
								:class="[floors.showSpuName ? 'pt-1' : '']"
								:style="{ color: parmas.themeColor }"
								v-if="floors.showPrice"
							>
								<view class="flex-1 overflow-x-scroll text-nowrap">
									￥
									<text :class="[floors.listType == 4 ? 'font-24' : 'font-32']">{{ price(item)[0] }}</text>
									<text v-if="price(item)[1]">.{{ price(item)[1] }}</text>
								</view>
								<!-- (由于点击是不会进入购物车的，应客户要求屏蔽掉) -->
								<!-- <text class="iconfont icon-gouwuche bg-white" style="font-size: 36rpx" :style="{ color: parmas.themeColor }" v-if="floors.showShopCart" /> -->
							</view>
						</view>
					</view>
				</view>
			</view>
		</template>
		<!-- 如果不换行 -->
		<template v-else>
			<!-- v-if="imgTwoDimList && imgTwoDimList[0] && imgTwoDimList[0].length >= floors.listType" -->
			<swiper
				class="py-2 pl-2 border-box"
				style="width: 100%"
				:style="{ height: `${currentHeight}px` }"
				circular
				:next-margin="imgTwoDimList.length <= 1 ? '0px' : nextMargin"
				:disable-touch="imgTwoDimList.length <= 1"
				v-if="imgTwoDimList && imgTwoDimList[0]"
			>
				<template v-for="(itemTwo, indexTwo) in imgTwoDimList">
					<!-- itemTwo.length >= floors.listType：如果最后一排不够数，为了美观，则不显示 -->
					<!-- <swiper-item class="w-100" :key="indexTwo" v-if="itemTwo.length >= floors.listType"> -->
					<swiper-item class="w-100" :key="indexTwo">
						<view
							class="d-inline-block listItem"
							:style="{
								width: !floors.wrap ? (floors.listType == 2 ? '50%' : floors.listType == 3 ? '33%' : floors.listType == 4 ? '25%' : '100%') : ''
							}"
							v-for="(item, index) in itemTwo"
							:key="index"
						>
							<view class="overflow-h" :class="[{ 'mr-2': !floors.wrap }]">
								<view class="overflow-h bg-white flex-col-start" :class="[floors.cardType ? 'rounded-20 translate3d0' : '']" @click="jumpPage(item, shopId)">
									<view class="position-relative w-100 h-0 pb-100pre">
										<view class="position-absolute left-0 w-100 h-100">
											<ls-image :options="{ w: '100.5%', h: '100.5%' }" :osOptions="{ w: 500, h: 500 }" :src="pic(item)" mode="aspectFill" />
										</view>
										<text
											class="iconfont icon-remai position-absolute left-0 zindex-2"
											style="font-size: 64rpx;top:-1px"
											:style="{ color: parmas.themeColor }"
											v-if="floors.showIcon == 'hot'"
										/>
										<text
											class="iconfont icon-xinpin position-absolute left-0 zindex-2"
											style="font-size: 64rpx;top:-1px"
											:style="{ color: parmas.themeColor }"
											v-if="floors.showIcon == 'new'"
										/>
										<!-- 白色三角形，用来做热卖或新品图标的底色 -->
										<text
											class="position-absolute left-0 top-0"
											style=" border-top: 56rpx solid #ffffff; border-right: 56rpx solid transparent; border-bottom: 0rpx solid #ffffff;"
											v-if="floors.showIcon == 'hot' || floors.showIcon == 'new'"
										></text>
										<image
											class="position-absolute left-0"
											style="height: 60rpx; width: 60rpx;top:-1px"
											:src="photoServer + floors.iconImg"
											alt=""
											v-if="floors.iconImg && floors.showIcon == 'diy'"
										/>
									</view>

									<view class="p-2 position-relative border-box w-100 overflow-h" v-if="floors.showSpuName || floors.showPrice">
										<view
											class="line-clamp1"
											:class="[floors.listType == 3 || floors.listType == 4 ? 'font-24' : 'font-28']"
											v-if="floors.showSpuName"
										>
											<!-- :style="{ height: `${floors.listType == 3 || floors.listType == 4 ? '42' : '46'}rpx` }" -->
											{{ name(item) }}
										</view>
										<view class="font-24 font-arial flex-between w-100" :style="{ color: parmas.themeColor }" v-if="floors.showPrice">
											<view class="flex-1 overflow-h text-nowrap">
												￥
												<text :class="[floors.listType == 4 ? 'font-24' : 'font-32']">{{ price(item)[0] }}</text>
												<text v-if="price(item)[1]">.{{ price(item)[1] }}</text>
											</view>
											<!-- (由于点击是不会进入购物车的，应客户要求屏蔽掉) -->
											<!-- <text
												class="iconfont icon-gouwuche bg-white"
												style="font-size: 36rpx"
												:style="{ color: parmas.themeColor }"
												v-if="floors.showShopCart"
											/> -->
										</view>
									</view>
								</view>
							</view>
						</view>
					</swiper-item>
				</template>
			</swiper>
		</template>
	</view>
</template>

<script>
import floorMixin from '@/mixins/floor.js';
import { trim } from '@/api/ModulesCommon';
const scrollLoad = false// 是否开启滚动到该楼层时才请求接口加载功能。当很多个楼层时，prodList组件在小程序端用jugeRefresh的话有可能会出现白屏，而且由于已经做了图片懒加载功能，其实一开始调用所有接口，并不会浪费太多流量
export default {
	components: {},
	mixins: [floorMixin],
	filters: {},
	props: {
		floors: {
			type: Object,
			default: () => {
				return {};
			}
		},
		parmas: {
			type: Object,
			default: () => {
				return {};
			}
		},
		scrollTop: {
			type: Number
		},
		shopId: {
			// 如果有传shopId，则是店铺装修的组件
			type: [String, Number],
			default: ''
		}
	},
	data() {
		return {
			goodsList: [],

			windowHeight: 0, // 可视区的高
			rangeTop: 0, // 距离顶部
			loadState: false, // 是否加载过
			nextMargin: '40rpx', // 后边距，可用于露出后一项的一小部分，接受 px 和 rpx 值
			currentHeight: 205,
			minHeight:0
		};
	},
	computed: {
		imgTwoDimList() {
			const arr = this.goodsList;
			const num = this.floors.listType;
			return this.$arrayUtils.arrToTwoDim(arr, num);
		},
		name() {
			// 统一管理商品名字
			return function(item) {
				return item.productName || item.name ? item.productName || item.name : '商品示例名名称';
			};
		},
		pic() {
			// 统一管理商品图片
			return function(item) {
				return item.pic || item.image || item.productPic;
			};
		},
		price() {
			// 统一管理商品价格
			return function(item) {
				let arr = [];
				if (item.price && item.price.toString().indexOf('~') != -1) {
					// 判断money是否为1.00~2.00的模式
					arr = [item.price, ''];
				} else {
					arr = this.$stringUtils.formatNumber(item.price ? item.price : 999);
				}
				return arr;
			};
		}
	},
	watch: {
		// 由于该组件与footGoodList组件在获取定位时有冲突(因为本组件未执行loadData时是没东西的,那footGoodList组件在执行jugeRefresh时获取的高度值是错误的)，先屏蔽
		floors: {
		    handler(val) {
				if(scrollLoad){
					this.setMinHeight()// 设置最少高度
					if (this.loadState) {
						this.loadState = false
						this.$nextTick(() => {
							this.jugeRefresh()
						})
					}
				}
		    },
		    immediate: true
		},
		// 由于该组件与footGoodList组件在获取定位时有冲突(因为本组件未执行loadData时是没东西的,那footGoodList组件在执行jugeRefresh时获取的高度值是错误的)，先屏蔽
		scrollTop(val) {
			if (scrollLoad) {
				if (!this.loadState && this.rangeTop <= this.windowHeight + val + 100) {
				    this.loadData()
				}
			}
		}
	},
	mounted() {
		// 由于该组件与footGoodList组件在获取定位时有冲突(因为本组件未执行loadData时是没东西的,那footGoodList组件在执行jugeRefresh时获取的高度值是错误的)，先屏蔽
		this.$nextTick(() => {
			if (scrollLoad) {
				this.jugeRefresh();
			}else{
				this.loadData()
			}
		});
	},
	destroyed() {},
	methods: {
		async jugeRefresh(flag) {
			// 由于该组件与footGoodList组件在获取定位时有冲突(因为本组件未执行loadData时是没东西的,那footGoodList组件在执行jugeRefresh时获取的高度值是错误的)，先屏蔽
			// // 获取可视区的高
			const SystemInfo = uni.getSystemInfoSync()
			this.windowHeight = SystemInfo.windowHeight

			// // 获取组件的尺寸信息
			const tabRect = await this.$utils.getRect(this, '.scrollFlag', true)
			this.rangeTop = tabRect[0].top + this.scrollTop || 0
			if (flag != 'api') { // loadData()方法里再次执行jugeRefresh()时不执行loadData()，不然会进入死循环
				if (this.windowHeight >= this.rangeTop) {
					this.loadData();
				}
			}
		},

		// 类型懒加载，针对商品类型的特效情况
		loadData() {
			this.loadState = true;
			if (this.floors.sourceType == 'goods') {
				const productIdList = this.floors.data.goodsList.map(item => {
					return item.id;
				});
				trim.productList({ productIdList: productIdList }).then(res => {
					if (res.code == 1) {
						if (res.data && res.data.length) {
							this.goodsList = res.data.map(item => {
								return { type: '商品', ...item };
							});
							this.$nextTick(() => {
								this.init();
							});

							this.floors.data.goodsList.forEach(element => {
								if (element.diyPic) {
									// 如果是自定义图片，则用自定义图片替换商品图片
									this.goodsList[this.goodsList.findIndex(item => item.id === element.id)].pic = element.pic;
								}
							});
						}
						this.$nextTick(() => {
							this.setMinHeight(this.goodsList,'api')// 重新设置最少高度
						})
					}
				});
			}

			if (this.floors.sourceType == 'category') {
				let categoryId = '';
				if (this.floors.data && this.floors.data.categoryData && this.floors.data.categoryData.id && this.floors.data.categoryData.id.length) {
					categoryId = this.floors.data.categoryData.id[this.floors.data.categoryData.id.length - 1];
				}
				if (categoryId) {
					trim[this.shopId ? 'shopCategoryProduct' : 'categoryProd']({ categoryId: categoryId, pageSize: this.floors.maxNum }).then(res => {
						if (res.code == 1) {
							if (res.data) {
								this.goodsList = res.data.map(item => {
									return { type: '商品', pic: item.productPic, id: item.productId, ...item };
								});
								this.$nextTick(() => {
									this.init();
									this.setMinHeight(this.goodsList,'api')// 重新设置最少高度
								});
							}
						}
					});
				}
			}

			if (this.floors.sourceType == 'prodGroup') {
				if (this.floors.data.prodGroupData && this.floors.data.prodGroupData.id) {
					trim.groupProduct({ productGroupId: this.floors.data.prodGroupData.id, pageSize: this.floors.maxNum }).then(res => {
						if (res.code == 1) {
							if (res.data) {
								this.goodsList = res.data.map(item => {
									return { type: '商品', ...item };
								});
								this.$nextTick(() => {
									this.init();
									this.setMinHeight(this.goodsList,'api')// 重新设置最少高度
								});
							}
						}
					});
				}
			}
		},

		// 设置一个init方法，方便多处调用
		async init() {
			// 获取组件的尺寸信息
			const tabRect = await this.$utils.getRect(this, '.listItem');
			this.currentHeight = tabRect.height + 20;
		},
		setMinHeight(lists,api){
			if (scrollLoad) {
				const itemHeight = this.floors.listType == 1 ? 100 : this.floors.listType == 2 ? 258.5 : this.floors.listType == 3 ? 195 : 160 // 每个元素的高度：详细列表，详细列表是140
				const diyLength = this.floors.sourceType == 'goods' && this.floors.data.goodsList ? this.floors.data.goodsList.length : this.floors.maxNum
				const row = this.floors.wrap ? Math.ceil((lists ? lists.length : diyLength) / this.floors.listType) : 1 // 占多少行， wrap==true:商品换行
				this.minHeight = itemHeight * row * 2 * 0.93 // 后面这个2，是rpx的意思 ， 每个元素的倍率系数：0.93是最少高度要是真实调试的93%(防止大于真实高度，如果设95%的话，不换行且三列时，最少高度会大于真实高度)，
				if (api == 'api') {
					if (!lists || !lists.length) {
						this.minHeight = 0
					}
					this.jugeRefresh('api')// 接口请求完之后，重新设置一下rangeTop值
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped></style>
