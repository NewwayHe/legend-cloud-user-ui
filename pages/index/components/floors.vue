<!--
    * Desc    : 所有楼层组件集合(头部组件除外)
-->
<template>
	<view class="w-100" :style="{ '--themescolor': themes.color }">
		<!-- setUpHead头部组件的占位符：注意，【搜索+标签页】且点击的是海报时是用上面的setUpHead占位符，不是用这个，这个跟上面那个setUpHead占位符是相反的 -->
		<view class="w-100" :style="{ height:`${conHeight}px` }" v-if="!isPoster"></view>
			
		<view class="w-100 position-absolute top-0 right-0 font-0" v-if="indexData.backgroundImg&&!isPoster">
			<image class="w-100" :src="photoServer + indexData.backgroundImg" mode="widthFix"></image>
		</view>

		<!-- 后台设置头部组件类型选择了【 搜索+标签页】，并且点击的不是【首页】时 -->
		<view class="w-100 position-absolute top-0 right-0 font-0" v-if="floorData.backgroundImg&&isPoster">
			<image class="w-100" :src="photoServer + floorData.backgroundImg" mode="widthFix"></image>
		</view>

		<!-- 只有首页才会有这个 -->
		<template v-if="pageIndex==0">
			<!-- /头部 -->
			<view class="position-relative">
				<!-- 搜索+轮播图 -->
				<bannerHeadSearch
					:parmas="indexData"
					@offsetBottom="getOffsetBottom"
					:floors="indexData.head.data.searchAndBannerData.banner"
					v-if="indexData.head && indexData.head.type == 'searchAndBanner'"
				/>
			</view>
		</template>
		
		<!-- 楼层装修 -->
		<view class="position-relative" v-for="(item, index) in floorData.floors" :key="index">
			<banner :parmas="floorData" :floors="item" :key="item.uuid" v-if="item.type == 'banner' && judgeIndex(index)" />
			<menuTab :parmas="floorData" :floors="item" :key="item.uuid" v-if="item.type == 'menuTab' && judgeIndex(index)" />
			<cube :parmas="floorData" :floors="item" :key="item.uuid" v-if="item.type == 'cube' && judgeIndex(index)" />
			<navigation :parmas="floorData" :floors="item" :key="item.uuid" v-if="item.type == 'navigation' && judgeIndex(index)" />
			<navigationTab :parmas="floorData" :floors="item" :key="item.uuid" v-if="item.type == 'navigationTab' && judgeIndex(index)" />
			<prodList :parmas="floorData" :scrollTop="scrollTop" :floors="item" :key="item.uuid" v-show="judgeIndex(index)" v-if="item.type == 'prodList' && judgeIndex(index,true)" />
			<richText :parmas="floorData" :floors="item" :key="item.uuid" v-if="item.type == 'richText' && judgeIndex(index)" />
			<assistLine :parmas="floorData" :floors="item" :key="item.uuid" v-if="item.type == 'assistLine' && judgeIndex(index)" />
			<titleTab :parmas="floorData" :floors="item" :key="item.uuid" v-if="item.type == 'titleTab' && judgeIndex(index)" />
			<noticeBar :parmas="floorData" :floors="item" :key="item.uuid" v-if="item.type == 'noticeBar' && judgeIndex(index)" />
			<coupon :parmas="floorData" :floors="item" :key="item.uuid" v-if="item.type == 'coupon' && judgeIndex(index)" />
		</view>
		<!-- 楼层装修 -->
		
		<!-- 功能组件：悬浮按钮(备注：该组件如果放在跟setUpHead组件同级的话，会不显示) -->
		<suspendBut :parmas="floorData" :floors="floorData.suspendBut" v-if="floorData.suspendBut && floorData.suspendBut.show" />
		<view class="font-26 text-666 flex-center py-3 w-100" v-if="isLoading && prodListIndex.length > 0" >
			正在加载更多数据...
		</view>
		
		<!-- 这个是tabBar的占位符，以前是写在页面最外层的view的padding-bottom里的，现在改为这里 -->
		<view class="w-100 h-100r bg-transparent"></view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
// 装修功能组件
import suspendBut from '@/components/floor/setUp/suspendBut.vue';

// 本页面特有components
import bannerHeadSearch from './bannerHeadSearch.vue';

// 楼层组件
import banner from '@/components/floor/banner.vue';
import cube from '@/components/floor/cube.vue';
import menuTab from '@/components/floor/menuTab.vue';
import navigation from '@/components/floor/navigation.vue';
import navigationTab from '@/components/floor/navigationTab.vue';
import prodList from '@/components/floor/prodList.vue';
import noticeBar from '@/components/floor/noticeBar.vue';

// 其它组件
import richText from '@/components/floor/richText.vue';
import assistLine from '@/components/floor/assistLine.vue';
import titleTab from '@/components/floor/titleTab.vue';

// 营销组件
import coupon from '@/components/floor/coupon.vue';

export default {
	name: '',
	mixins: [],
	
	// #ifdef MP-WEIXIN
	// 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性。这时在<组件name> 里加style和class是不会生效的
	options: { virtualHost: true },
	// #endif

	components: {
		// 装修功能组件
		bannerHeadSearch,
		suspendBut,
		
		// 楼层组件
		banner,
		cube,
		menuTab,
		navigation,
		navigationTab,
		prodList,
		noticeBar,
		
		// 其它组件
		richText,
		assistLine,
		titleTab,
		
		// 营销组件
		coupon,
	},

	props: {
		indexData: { // 装修楼层值
			type: [Object, String],
			default: () => {}
		},
		floorData: { // 装修楼层值
			type: [Object, String],
			default: () => {}
		},
		paging: {
			type: [Object],
			default: () => {}
		},
		pageIndex: {
		    type: Number,
		    default: 0
		},
		scrollTop: {
		    type: Number,
		    default: 0
		},
		conHeight: {
		    type: [String, Number,Boolean],
		    default: 0 // setUpHead组件的占位符高度
		},
		isPoster: {
			type: [Boolean,String, Number],
		    default: false
		},
		isSwiper: {
			type: [Boolean,String, Number],
		    default: false
		},
	},

	data() {
		return {
			prodListIndex:[],// 当前楼层的数组
			preloadIndex:[],// 预加载的楼层的数组
			isLoading:false,
		};
	},

	computed: {
		judgeIndex() {
			return function(index,isPreload) {
				if(isPreload) {
					return index <= this.preloadIndex[0] || this.preloadIndex.length <= 0
				} else {
					return index <= this.prodListIndex[0] || this.prodListIndex.length <= 0
				}
			}
		}
	},

	watch: {
		// data: {handler(newVal, oldVal) {console.log(newVal);},immediate: true,deep: true}
	},

	created() {
		if(this.floorData.floors) {
			this.getProdListIndex()
		}
	},

	onLoad(option) {},

	onShow() {},

	onHide() {},

	mounted() {},

	// #ifdef MP-WEIXIN
	/** 微信自定义好友分享 */
	// onShareAppMessage(res) {},
	// #endif

	/** 监听屏幕滚动 */
	// onPageScroll(e) {},

	/** 顶部下拉刷新 */
	// onPullDownRefresh() {},

	/** 触底下拉加载 */
	// onReachBottom() {},

	destroyed() {},

	methods: {
		getProdListIndex() {
			this.floorData.floors.forEach((item,index) => {
				if(item.type == 'prodList') {
					this.prodListIndex.push(index)
					this.preloadIndex.push(index)
				}
			})
			if(this.prodListIndex[0] <= 4) { // 如果所有的商品列表楼层少于等于4个，则全部楼层一次性展示所有楼层
				this.prodListIndex.splice(0,3)
				this.preloadIndex.splice(0,3)
			} else { // 如果所有的商品列表楼层多于4个，则先展示前两个商品列表楼层以上的楼层(注：为了不让页面闪动，商品列表的前两个楼层以下的其它楼层，也同样不展示)
				this.prodListIndex.splice(0,1)
				this.preloadIndex.splice(0,1)
			}
			
			setTimeout(() => { // 1.5秒后，预加载第三第四个商品列表及其以上的楼层
				this.preloadIndex.splice(0,2)
			},1500)
		},
		
		// 这个不能删， 这个方法在父组件里onReachBottom下拉到底部时调用
		handleIndex() {
			if(this.isLoading) return
			if(this.prodListIndex.length > 0) {
				this.isLoading = true
				this.preloadIndex.splice(0,3)
				setTimeout(() => {
					this.prodListIndex.splice(0,3)
					this.isLoading = false
				},1000)
			} else {
				return 
			} 
		},
		
		scrolltolower(){},
		pageScrollTo(e){
			this.$emit('pageScrollTo',e)
		},
		getOffsetBottom(e){
			this.$emit('offsetBottom', e)
		}
	}
};
</script>

<!-- body或page的背景色要这样写(不能加scoped)且var的css变量名字里不能有大写字母，不然小程序不会生效 -->
<style>
/* page {background-color: var(--backgroundcolor);} */
</style>
<style lang="scss" scoped></style>
