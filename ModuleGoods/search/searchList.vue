<template>
    <view class="w750 h-100vh d-flex flex-column" :style="{ '--themescolor': themes.color }">
        <ls-header theme>
            <view class="flex-around flex-1 text-333 zindex-99" :class="current != 0 ? 'pr-3' : ''">
                <view class="flex-1 flex-start pl-2 pr-1 bg-bg rounded-50 h-60r position-relative overflow-h" @click.stop="closeKey">
                    <view class="pr-1">
						<text class="iconfont icon-sousuo text-ccc" style="font-size: 28rpx;"></text>
					</view>
					<!-- 搜索框上面的小模块 -->
					<view v-show="searchQuery.key && isInputKey" class="flex-1 text-fff font-24 position-absolute px-2 h-44r zindex-1 rounded-30" style="left: 60rpx; max-width: calc(100% - 80rpx); background-color: rgba(0, 0, 0, .5);">
						<view class="flex-center h-100 line-h overflow-h text-nowrap">
							<text class="flex-1 line-clamp1">{{ searchQuery.key }}</text>
							<view @click.stop="clearKey">
								<text class="iconfont icon-guanbi pl-1" style="font-size: 24rpx;"></text>
							</view>
						</view>
					</view>
                    <input
						:focus="isFocus"
						id="searchInput"
						ref="searchInput"
						v-show="!isInputKey"
                        class="w-80 font-28 text-333"
                        type="text"
                        v-model="searchQuery.key"
                        @confirm="enterSearch"
                        maxlength="50"
                        confirm-type="search"
                        :placeholder="searchQuery.key"
                        placeholder-style="color:#999; font-size:28rpx;"
                    />
                </view>
				<!-- 改变布局 -->
                <view v-show="current == 0" class="px-2" @click="changeType">
                    <text class="iconfont text-fff" :class="goodsType?'icon-fenlei2':'icon-fenlei4'" style="font-size: 40rpx;"></text>
                </view>
            </view>
        </ls-header>
		<!-- 顶部tab栏，备注：如果isCategory有值，则代表是分类进来，则不显示tab栏 -->
		<ls-tabs :bgColor="themes.color" lineColor="#fff" :inactiveStyle="{color:'#fff'}" :activeStyle="{color:'#fff'}" :current="current" :list="tabsList" fixed @change="switchType" v-if="!isCategory"/>
		<!-- 注意：这里的bg-f8，是下面写的${stausBarHeight-1}里的1px高 -->
		<view class="h-80r" :class="[{'bg-f8':!paging.emptylist&&!paging.error}]">
			<view class="position-fixed zindex-99 w-100 h-80r d-flex a-center font-28 bg-fff" :style="{ top: `calc(${88+(!isCategory?80:0)}rpx + ${stausBarHeight-1}px)` }">
				<view v-show="current == 0 || current == 1" class="flex-1 flex-center" :class="{ 'text-main': searchQuery.sortBy == 'multiple' }" @click="sortGood('multiple')">
					<text style="padding-bottom: 6rpx">综合</text>
				</view>
				<view v-show="current == 0 || current == 1" class="flex-1 flex-center" :class="{ 'text-main': searchQuery.sortBy == 'buys' }" @click="sortGood('buys')">
					<text style="padding-bottom: 6rpx">销量</text>
				</view>
				<view v-show="current == 1" class="flex-1 flex-center" :class="{ 'text-main': searchQuery.sortBy == 'praise' }" @click="sortGood('praise')">
					<text style="padding-bottom: 6rpx">好评</text>
					<view class="ml-1 scale-07 text-ccc">
						<view
							class="iconfont icon-caret-top"
							:class="{ 'text-main': searchQuery.sortBy == 'praise' && !searchQuery.descending }"
							style="font-size: 20rpx; margin-bottom: -12rpx"
						></view>
						<view
							class="iconfont icon-caret-bottom"
							:class="{ 'text-main': searchQuery.sortBy == 'praise' && searchQuery.descending }"
							style="font-size: 20rpx"
						></view>
					</view>
				</view>
				<!-- 没接口，先隐藏 -->
				<!-- v-show="current == 0" -->
				<view v-show="false" class="flex-1 flex-center" :class="{ 'text-main': searchQuery.sortBy == 'new' }" @click="sortGood('new')">
					<text style="padding-bottom: 6rpx">最新</text>
					<view class="ml-1 scale-07 text-ccc">
						<view
							class="iconfont icon-caret-top"
							:class="{ 'text-main': searchQuery.sortBy == 'new' && !searchQuery.descending }"
							style="font-size: 20rpx; margin-bottom: -12rpx"
						></view>
						<view
							class="iconfont icon-caret-bottom"
							:class="{ 'text-main': searchQuery.sortBy == 'new' && searchQuery.descending }"
							style="font-size: 20rpx"
						></view>
					</view>
				</view>
				<view v-show="current == 0" class="flex-1 flex-center" :class="{ 'text-main': searchQuery.sortBy == 'price' }" @click="sortGood('price')">
					<text style="padding-bottom: 6rpx">价格</text>
					<view class="ml-1 scale-07 text-ccc">
						<view
							class="iconfont icon-caret-top"
							:class="{ 'text-main': searchQuery.sortBy == 'price' && !searchQuery.descending }"
							style="font-size: 20rpx; margin-bottom: -12rpx"
						></view>
						<view
							class="iconfont icon-caret-bottom"
							:class="{ 'text-main': searchQuery.sortBy == 'price' && searchQuery.descending }"
							style="font-size: 20rpx"
						></view>
					</view>
				</view>
				<!-- 筛选-->
				<view v-show="current == 0" class="flex-1 flex-center" @click="filterShow = true">
					<text style="padding-bottom: 6rpx">筛选</text>
					<text class="iconfont icon-screening pl-1 pb" style="transform: scale(0.7)"></text>
				</view>
			</view>
		</view>
		<swiper :current="currentTab" @change="swiperChange" class="flex-1">
			<swiper-item class="w-100 h-100">
				<!-- 商品 -->
				<scroll-view @scroll="scrollView" :scroll-top="scrollViewTop"  class="h-100 w-100 bg-f8" scroll-y @scrolltolower="onreachBottom">
					<!-- 不加下面这个view的话，H5端(小程序端没问题)ls-load-more里的flag永远为false就不会显示出来 -->
					<view class="w-100">
						<ls-load-more className="h-100 w-100" :status="paging.status" v-if="list&&list.length" :key="'goods'">
							<products :horizontal="goodsType" >
								<productItem v-for="proItem in list" 
									:key="proItem.productId" 
									:parmas="proItem" 
									:name="proItem.productName" 
									:money="proItem.discountPrice||proItem.discountPrice==0?proItem.discountPrice:proItem.price" 
									:pic="proItem.productPic" 
									:originalPrice="proItem.discountPrice||proItem.discountPrice==0?proItem.price:proItem.originalPrice"
									:horizontal="goodsType"
								></productItem>
							</products>
						</ls-load-more>
						<ls-empty className="pt-20" :paging="paging" :title="'暂无搜索结果'" :type="3"/>
					</view>
				</scroll-view>
			</swiper-item>
			<!-- 店铺 -->
			<swiper-item class="w-100 h-100">
				<scroll-view @scroll="scrollView" :scroll-top="scrollViewTop"  class="h-100 w-100 bg-f8" scroll-y @scrolltolower="onreachBottom">
					<shopItem ref="shopItem" :searchQuery="searchQuery"></shopItem>
				</scroll-view>
			</swiper-item>
		</swiper>
		<!-- 筛选弹出层 -->
		<u-popup v-model="filterShow" mode="right" border-radius="24" width="80%">
			<view class="px-4 pb-10 overflow-h h-100" >
				<!-- start 解决全面屏、刘海屏 高度向上兼容性写法。H5不需要处理 -->
				<!-- #ifdef MP -->
					<view :style="{ paddingTop:  `88rpx`, height: `${stausBarHeight}px` }"></view>
				<!-- #endif -->
				<!-- #ifdef APP-PLUS -->
					<view :style="{ height: `${stausBarHeight}px` }"></view>
				<!-- #endif -->
				<!-- end -->
				<scroll-view scroll-y class="h-100">
					<view class="text-333">
						<!-- #ifndef MP -->
						<view class="pb-3 font-weight pt-4">价格区间</view>
						<!-- #endif -->
						
						<!-- #ifdef MP -->
						<view class="pb-3 font-weight">价格区间</view>
						<!-- #endif -->
						<view class="flex-center priceInterval">
							<!-- 如果这里的type改为digint 则只输入-[负号]时 input是监听不到的 而这里的需求是输入大于0的浮点数 -->
							<input type="text" v-model="minPrice" class="w-200r font-24 text-center px-7 bg-f5 h-60r rounded-50 h-56r" placeholder-style="font-size:24rpx;" placeholder="最低价" @input="(ev) => inputMoney(ev,'minPrice')">
							<text class="mx-1">-</text>
							<input type="text" v-model="maxPrice" class="w-200r font-24 text-center px-7 bg-f5 h-60r rounded-50 h-56r" placeholder-style="font-size:24rpx;" placeholder="最高价" @input="(ev) => inputMoney(ev,'maxPrice')">
						</view>
					</view>
					<view class="text-333" v-if="brands.length > 0">
						<view class="pt-4 pb-2 flex-between">
							<text class="font-weight flex-1">品牌</text>
							<view class="flex-center text-999 font-24" @click="packUp('brands')">
								<text>{{foldObj['brands'].isFold ? '收起' : '展开'}}</text>
								<text class="iconfont" :class="foldObj['brands'].isFold ? 'icon-ArrowUp' : 'icon-ArrowDown'"  style="font-style: 20rpx; transform: scale(0.5); padding-top: 2rpx;"></text>
							</view>
						</view>
						<view class="row" :class="foldObj['brands'].isFold ? 'h-100' : 'overflow-h h-80r'">
							<view v-for="(item, index) in brands" :key="item.id" :style="{ backgroundColor: searchQuery.brandId.includes(item.id) ? themes.rgb01 : '' }" :class="searchQuery.brandId.includes(item.id) ? 'border-main text-main' : 'bg-f5'" class="border border-transparent px-3 flex-center text-center rounded-100 text-333 mr-2 font-24 h-60r mb-2  py-2" @click="selectItem(item, item.id, 'brand')">
								{{item.brandName}}
							</view>
						</view>
					</view>
					<view class="text-333" v-if="categories.length > 0">
						<view class="pt-2 pb-2 flex-between">
							<text class="font-weight flex-1">商品类目</text>
							<view class="flex-center text-999 font-24" @click="packUp('categories')">
								<text>{{foldObj['categories'].isFold ? '收起' : '展开'}}</text>
								<text class="iconfont" :class="foldObj['categories'].isFold ? 'icon-ArrowUp' : 'icon-ArrowDown'" style="font-style: 20rpx; transform: scale(0.5); padding-top: 2rpx;"></text>
							</view>
						</view>
						<view class="row" :class="foldObj['categories'].isFold ? 'h-100' : 'overflow-h h-80r'">
							<view v-for="(item, index) in categories" :key="item.categoryId" :style="{ backgroundColor: searchQuery.categoryId == item.categoryId ? themes.rgb01 : '' }" :class="searchQuery.categoryId == item.categoryId ? 'border-main text-main' : 'bg-f5'" class="border border-transparent px-3 flex-center text-center rounded-100 text-333 mr-2 font-24 h-60r mb-2 py-2" @click="selectItem(item, item.categoryId, 'cate')">
								{{item.categoryName}}
							</view>
						</view>
					</view>
					<view class="text-333" v-for="(item, index) in screenList " :key="index" v-if="screenList&&screenList.length">
						<view class="pt-2 pb-2 flex-between">
							<text class="font-weight flex-1">{{item.k.paramName}}</text>
							<view class="flex-center text-999 font-24" @click="packUp(item.k.paramId)">
								<text>{{foldObj[item.k.paramId].isFold ? '收起' : '展开'}}</text>
								<text class="iconfont" :class="foldObj[item.k.paramId].isFold ? 'icon-ArrowUp' : 'icon-ArrowDown'"  style="font-style: 20rpx; transform: scale(0.5); padding-top: 2rpx;"></text>
							</view>
						</view>
						<view class="row" :class="foldObj[item.k.paramId].isFold ? 'h-100' : 'overflow-h h-80r'">
							<view @click="selectItem(item, childIndex, 'params', childItem)" v-for="(childItem, childIndex) in item.options" :key="childIndex" :style="{ backgroundColor: selectScreen[item.k.paramId] && selectScreen[item.k.paramId].includes(childItem.valueId) ? themes.rgb01 : '' }" :class="selectScreen[item.k.paramId] && selectScreen[item.k.paramId].includes(childItem.valueId) ? 'border-main text-main' : 'bg-f5'" class="border border-transparent flex-center text-center rounded-100 text-333 mr-2 font-24 h-60r mb-2" style="padding: 26rpx">
								{{childItem.valueName}}
							</view>
						</view>
					</view>
				</scroll-view>
				<!-- 底部按钮 -->
				<view class="position-fixed w-100 left-0 bottom-0 bg-fff safearea-bb-white">
					<view class="flex-center px-4 py-2 font-24 letter-sp10">
						<view shape="circle" class="border flex-center rounded-100 w-50 bg-fff h-70r text-333" style="border-color: #DCDFE6;" @click="cleanSelectItem">重置</view>
						<view shape="circle" class="flex-center rounded-100 w-50 ml-3 bg-main text-fff h-70r" @click="confirmSearch">确定</view>
					</view>
				</view>
			</view>
		</u-popup>
        <!-- 回到顶部按钮 -->
        <back-top :scrollTop="scrollTop" :showScroll="scrollNum" bgColor="rgba(0,0,0,.3)" buttonFixed @scrollViewBack="scrollViewGoBack"/>
    </view>
</template>
<script>
import { mapState } from 'vuex'
import pageUtil from '@/utils/pageUtils.js'
import { searchHistory } from '@/utils/Cache'
import { search } from '@/api/ModuleGoods.js'
import  products  from '@/components/ls-app/ls-products/products'
// 商品页面
import  productItem  from '@/components/ls-app/ls-products/productItem'
// 店铺页面
import  shopItem  from '@/components/ls-app/ls-products/shopItem'
// 用户页面
import backTop from '@/components/goods/back-top.vue';
let listPage = new pageUtil(search.searchProduct)
import pageScroll from '@/mixins/pageScroll.js'
export default {
    components: {
		products,
		productItem,
		backTop,
		shopItem,
	},
	mixins: [pageScroll],
	watch: {
		'minPrice'(newValue, oldValue) {
		},
		'maxPrice'(newValue, oldValue) {
		},
		"current"(newValue) {
			uni.pageScrollTo({ scrollTop: 0 }) // 回到页面顶部
		}
	},
	computed: {
	    ...mapState(['stausBarHeight','systemConfig'])
	},
	onShow() {},
    data() {
        return {
			isFocus: false, // 输入框是否获取焦点
			scrollNum: 100, // 设置为data，解决用户页面不显示的bug
			scrollViewTop: "", // scroll-view滚动的距离
			isInputKey: true, // 控制搜索框上面的搜索小模块
			current: 0, // 默认选中tab的下标
            goodsType: true, // 默認-纵向列表
            searchQuery: {
                key: '', // 搜索词
                descending: false,
				// priceInterval: [], // 价格区间
                sortBy: 'multiple' ,// multiple 默认排序(综合)  // price 价格排序  // sale 销量排序  // new 最新 // praise 好评
				brandId: [], // 品牌
				categoryId: "", // 商品类目
            },
			minPrice: "", // 最低价
			maxPrice: "", // 最高价
            list: [],
            paging: {
                status: 'loading',
                error: false, // 是否错误
                emptylist: false // 是否显示列表为空时的样式
            },
			filterShow: false, // 筛选弹出层
			tabsList: [
				"商品",
				"店铺",
			],
			brands: [], // 品牌
			categories: [], // 商品类目
			screenList : [], // 其他参数
			style: "find", // 内容类型
			currentTab: 0, // swiper用到的current值
			selectScreen: {}, //筛选中ids {1:[],2:[],3:[]}
			foldObj: {}, // 展开和收起对象
			isCategory:false,//如果是点击【分类】进入本页面
			isBrand:false,//如果是点击【品牌】进入本页面
        }
    },
    onLoad(option) {
        this.$data['option'] = option || null
        this.searchQuery.key = option.searchText || '' // 搜索词进来
        this.searchQuery.categoryId = option.categoryId || null // 分类进来
		this.isCategory = option.categoryId ? true : false // 分类进来
        this.searchQuery.shopId = option.shopId || null // 店铺首页装修进来
        this.searchQuery.shopCategoryId = option.shopCategoryId || null // 店铺分类进来
        if (option.brandId) {
            this.searchQuery.brandId = [option.brandId] // 品牌id
			this.isBrand = true
        }
		this.getData()
		this.$nextTick(()=>{
			this.$refs.shopItem.getData()
		})
    },
    mounted() {

	},
    methods: {
		onreachBottom:uni.$utils.debounce(function(){
			// console.log(666);
			if (this.current == 1) {
				// 如果是店铺模块那么就让店铺模块的进行加载下一页
				this.$refs.shopItem.loadMore()
			} else {
				// 否则就是当前商品页面,就只需要加载商品的下一页内容
				listPage.loadListByPageMore()
			}
		}),
        // 商品列表切换模式
        changeType() {
            this.goodsType = !this.goodsType
        },
		enterSearch:uni.$utils.debounce(function(event){
			if(this.currentTab===1){
				this.$refs.shopItem.getData()
			}else{
				listPage = new pageUtil(search.searchProduct)
				const searchText = this.searchQuery.key&&this.$stringUtils.trim(this.searchQuery.key, 2)
				searchHistory.addSearchHistory(searchText)
				listPage.loadListByPage(this, this.searchQuery)
			}
		}),
        enterGoods(event) {
            const id = event.productId
            uni.navigateTo({ url: `/ModuleGoods/goodsDetail/goodsDetail?id=${id}` })
        },

        // 排序
        sortGood(type) {
            if (type == 'price') {		// 价格
                if (this.searchQuery.sortBy != 'price') {
                    this.searchQuery.descending = false//第一次进来时，默认是商品价格从低到高排序
                } else {
                    this.searchQuery.descending = !this.searchQuery.descending
                }
                this.searchQuery.sortBy = type
            } 
			// 如果是 [销量] 默认只做降序 不考虑升序
			else if(type == 'buys') {
				if (this.searchQuery.sortBy == type) return;
				else this.searchQuery.sortBy = type;
				this.searchQuery.descending = true
			}
			else if(type=='multiple') { 	// 默认综合 
                if (this.searchQuery.sortBy == type) return;
				else this.searchQuery.sortBy = type;
				this.searchQuery.descending = false
			}
			else{
				if (this.searchQuery.sortBy != type) {
					this.searchQuery.descending = true
				} else {
					this.searchQuery.descending = !this.searchQuery.descending
				}
				this.searchQuery.sortBy = type
			}
			if(this.currentTab===1){
				this.$refs.shopItem.getData()
			}else{
				this.getData()
			}
        },
		// 获取参数列表
		screenParams(code, res) {
			if (res.code == 1) {
				if (res.data.specs) {
					// 搜索列表数据	需要带有缓存，即如果 参数、品牌、分类的数组长度为0再复制
					if(this.screenList && !this.brands.length && !this.categories.length && !this.screenList.length){
						// 参数数据
						this.screenList = res.data.specs
						// 品牌数据
						this.brands =  res.data.brands
						this.foldObj['brands'] = {
							isFold: false
						}
						// 分类数据
						this.categories =  res.data.categories
						this.foldObj['categories'] = {
							isFold: false
						}
						if (!this.getScreenParams()) {
							res.data.specs.forEach((item) => {
								this.selectScreen[item.k.paramId] = []
								// 让每一个数据组都循环添加一个isFold
								this.foldObj[item.k.paramId] = {
									isFold: false
								}
							})
						}
					}
					
				}
			}
		},
		
		// 获取搜索商品数据
		// 备注:这里的防抖不能用$u.debounce,不然会进不了方法(原因:u-view里的debounce,同一页面同时执行几个不同的debounce方法时,只会执行到第一个,其它的方法都执行不到)
		getData:uni.$utils.debounce(function(){
			// viewType:'good', // 展示类型 shop店铺类型 good 商品类型
			//搜索商品
			this.getScreenParams()
			//搜索商品
			listPage.loadListByPage(this, { ...this.searchQuery, priceInterval: this.checkPrice(), env: this.getScreenParams() }, { success: this.screenParams })
		}),
		// 清除输入框的内容
		clean(flag) {
		    this.searchQuery.key = ''
		},
		// 拼接其他参数
		getScreenParams() {
			let resultParams = ''
			for (let key in this.selectScreen) {
				if (this.selectScreen[key] && this.selectScreen[key].length) {
					resultParams += key + '_' + this.selectScreen[key].join('|') + ';'
				}
			}
			// 最后一个分号不需要
			return resultParams.substring(0, resultParams.length - 1)
			// this.searchQuery.ev = resultParams.substring(0, resultParams.length - 1)
		},
		// 选择筛选条件
		selectItem(item, id, type, currentItem) {
			// selectParamsAry
			// 品牌
			if (type == 'brand') {
				if (!this.searchQuery.brandId.includes(id)) {
					this.searchQuery.brandId.push(id)
				} else {
					const index = this.searchQuery.brandId.findIndex((item) => item == id)
					this.searchQuery.brandId.splice(index, 1)
				}
			}  else if (type == 'cate') { 	// 分类
				if (this.searchQuery.categoryId == item.categoryId) {
					this.searchQuery.categoryId = ""
				} else {
					this.searchQuery.categoryId = item.categoryId
				}
			} else { // 其他参数
				if (this.selectScreen[item.k.paramId].includes(currentItem.valueId)) {
					this.selectScreen[item.k.paramId] = this.selectScreen[item.k.paramId].filter((id) => id != currentItem.valueId)
				} else {
					this.selectScreen[item.k.paramId].push(currentItem.valueId)
					this.getScreenParams();
				}
				this.$forceUpdate()
			}
		},
		// 筛选弹出层里面的点击了重置
		cleanSelectItem() {
			this.minPrice = "";
			this.maxPrice = "";
			if (!this.isCategory) {
				this.searchQuery.categoryId = "";//如果是分类进来，这个不需要变动
			}
			if(!this.isBrand){
				this.searchQuery.brandId = [];//如果是品牌进来，品牌ID也不需要变动
			}
			for(let key in this.selectScreen) {
				this.selectScreen[key] = []
			}
			this.getData()
			this.$forceUpdate();
		},
		// 筛选弹出层里面的点击了确认按钮
		confirmSearch() {
			this.filterShow = false
			console.log(this.searchQuery)
			this.getData()
		},
		// 筛选弹出层里面的收起和展开
		packUp(key) {
			/*
				思路：跟其他参数点击高亮的做法一致，也是在获取参数的同时存到一个变量对象中，键就取决于brands、categories，这两个是固定的
				其他参数：foldObj[item.k.paramId]
				然后通过foldObj[item.k.paramId] = { isFold: false } 设置默认值
				最后在每一个class="row"的view标签身上添加:class="foldObj['brands'].isFold ? 'h-100' : 'overflow-x-h h-80r'"
				不展开的时候就默认高度h-80r并且overflow: hidden
				展开的时候就height: 100%
			*/
			this.foldObj[key].isFold = !this.foldObj[key].isFold
			this.$forceUpdate()
		},
		// 切换tabs   商品、店铺、内容、用户
		switchType(item) {
		    this.current = item.index;
			this.currentTab = item.index;
		},
		// 点击搜索框，关闭关键字模块并且获取焦点
		closeKey() {
			this.isInputKey = false;
			this.isFocus = true
		},
		// 点击了关键字模块的关闭图标并且获取焦点
		clearKey() {
			this.searchQuery.key = "";
			this.isInputKey = false;
			this.isFocus = true;
			this.getData()
		},
		// swiper滑动时触发，让tab栏也跟着切换
		swiperChange(e) {
			this.current = e.detail.current
			this.currentTab = e.detail.current
		},
		// 点击了返回顶部按钮，然后让scroll-view返回顶部
		scrollViewGoBack() {
			// 设置为0不生效，只能通过这种方式
			this.$nextTick(()=>{
				this.scrollViewTop = Math.random();
			})
		},
		// scroll-view滚动时触发,把滚动的距离赋值给scrollTop
		scrollView(e) {
			this.$nextTick(()=> {
				this.scrollTop = e.detail.scrollTop
			});
		},
		
		// 	价格区间判断并且自动切换
		checkPrice() {
			let priceAccount = []
			// 如果只有最少价格，没有输入最大价格
			if (this.minPrice&&!this.maxPrice) {
				priceAccount = [this.minPrice, '']
			}else{
				// 直接调用sort()排序：a-b数字升序，b-a数字降序
				priceAccount = [this.minPrice, this.maxPrice].sort(function(a,b){return a-b});
				this.minPrice = priceAccount[0];
				this.maxPrice = priceAccount[1];
			}
			return priceAccount
		},
		inputMoney(ev, key) {
			let { detail: { value } } = ev;
			let price = ''
			// value != 0 && (price = value.replace(/^(\d+(\.\d{0,2})?)(.*)$/gi, "$1"))
			if(value){
				price = value.replace(/^(\D*)((\d+(\.\d{0,2})?)?)(.*)$/gi, "$2")
			}
			// 这里必须用nextTick 否则会赋值失败
			this.$nextTick(() => {
				this[key] = price;
			})
		}
    }
}
</script>
