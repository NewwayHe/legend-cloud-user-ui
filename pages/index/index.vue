<template>
	<!-- 下面这个overflow-h是为了解决tabbar有滚动条及IOS H5会移动屏幕的问题 -->
	<!-- style="padding-bottom: calc(100rpx + var(--safe-area-inset-bottom))"，这个100rpx写在scroll-view里，因为tabar栏类型为4时，效果不好看 -->
	<view
		class="w750"
		:class="[{'h-100vh overflow-h':isSwiper}]"
		style="padding-bottom: var(--safe-area-inset-bottom)"
		:style="{ '--themescolor': themes.color, backgroundColor: isPoster?'':indexData.backgroundColor }"
	>
		<!-- 如果有APP广告，则先显示APP广告(H5和小程序端isAppAd值永远为false) -->
		<template v-if="!isAppAd">
			<view class="position-relative w-100" :class="[{'flex-col-start h-100':isSwiper}]"  v-if="!$u.test.isEmpty(indexData)">
				<!-- setUpHead头部组件的占位符(【搜索+标签页】且点击的是海报时)：注意，这个backgroundColor与最外层view的backgroundColor，是相反的 -->
				<view class="w-100 overflow-h" :style="{ backgroundColor: isPoster?indexData.backgroundColor:'',height:`${conHeight}px` }" v-if="isPoster">
					<!-- 以下这段为新增，解决的问题：首页设置了【搜索+标签页】且设置了背景，如果没下面这段代码，只有首页的头部有背景图，tab海报页的头部是没有背景图的 -->
					<image class="w-100 font-0" :src="photoServer + indexData.head.backgroundImg" mode="widthFix" v-if="indexData.head.backgroundImg"></image>
				</view>
				<!-- 头部组件 -->
				<setUpHead
					ref="refSetUpHead"
					:parmas="indexData"
					:floors="indexData.head"
					:scrollTop="scrollTop"
					:offsetBottom="offsetBottom"
					:current="current"
					@getHeight="getHeight"
					@change="changTab"
				/>

				<swiper
					class="flex-1" 
					style="width: 100%;"
					:current="current"
					:disable-touch="tabList.length <= 1"
					@change="swiperChange"
					v-if="isSwiper"
				>
					<!-- 备注：如果遍历floorData代替tabList的话，实测调试时首页数据加载慢两秒 -->
					<swiper-item class="w-100 h-100" v-for="(item1, index1) in tabList" :key="index1" :catchtouchmove="tabList.length <= 1?'stopTouchMove':''">
						<scroll-view class="h-100 position-relative" :style="{ backgroundColor: isPoster?floorData[index1].backgroundColor:'' }" scroll-y @scroll="scroll" :scroll-top="scrollViewTop" @scrolltolower="scrolltolower" v-if="floorData[index1]&&floorData[index1].floors">
							<!-- 备注：这个<floors>要跟下面的<floors>完全一样，pageScrollTo功能由于未实现，可以删掉 -->
							<floors ref="floors" :conHeight="conHeight" :isPoster="isPoster" :indexData="indexData" :floorData="floorData[index1]" :pageIndex="index1" :scrollTop="scrollTop" :isSwiper="isSwiper" :paging="paging" @pageScrollTo="pageScrollTo" @offsetBottom="getOffsetBottom"></floors>
						</scroll-view>
					</swiper-item>
				</swiper>
				<template v-else>
					<view class="w-100 position-relative" v-for="(item1, index1) in tabList" :key="index1" :style="{ backgroundColor: isPoster?floorData[index1].backgroundColor:'' }" v-if="floorData[index1]&&floorData[index1].floors&&index1==current">
						<!-- 备注：这个<floors>要跟上面的<floors>完全一样，pageScrollTo功能由于未实现，可以删掉 -->
						<floors ref="floors" :conHeight="conHeight" :isPoster="isPoster" :indexData="indexData" :floorData="floorData[index1]" :pageIndex="index1" :scrollTop="scrollTop" :isSwiper="isSwiper" :paging="paging" @pageScrollTo="pageScrollTo" @offsetBottom="getOffsetBottom"></floors>
					</view>
				</template>
			</view>
		</template>
	
		<!-- #ifdef APP-PLUS -->
		<!-- 服务协议和隐私政策(应用宝APP上架必需) -->
		<!-- <androidAppAgree /> -->
		<!-- APP启动广告 -->
		<appStartAdv @timeOut="isAppAd = false" v-if="isAppAd" />
		<!-- #endif -->
		
		<!-- #ifndef APP-PLUS -->
		<popupAdvert v-if="popupAdvertRule.length" pageType='index'/>
		<!-- #endif -->
		
		<!-- 如果是商家端或PC后台跳进来预览，则加个遮罩层不让点击 -->
		<u-mask :show="isPreview" :duration="0" :custom-style="{background: 'rgba(0, 0, 0, 0)'}"></u-mask>
		
		<!-- ls-empty的父级用了v-show="!isAppAd"(如果是v-if就不能预加载index数据)，但这里却要加上v-if="!isAppAd"，是因为app端会出现该插件显示在app启动广告插件前面 -->
		<ls-empty className="center-xy" bgColor="#fff" title="暂无相关楼层数据" :paging="paging" skeleton="首页" @reLoad="getData" reLoad v-if="!isAppAd"/>
		
		<!-- tabbar占位符，当tabbar插件的type为4且后台设置了装修页面有背景颜色时，这个用来让其底部最后50px也有背景颜色 -->
		<tabBar ref="commentTabbat" :templateId="templateId" :indexData="indexData" />
	</view>
</template>

<script>
const isSwiper = false//true：采用swiper布局，后台设置了【 搜索+标签页】的话，此时tab可以左右划动(但这个上下滚动和左右划动在小程序上会消耗性能)；false：除后台设置了【 搜索+标签页】外，都用普通view层来上下滚动
// API接口
import { trim } from '@/api/ModulesCommon';

import floors from './components/floors.vue';

// 装修功能组件
import tabBar from '@/components/common/tabbar/tabbar.vue';

//本页面特有components
// import androidAppAgree from './components/androidAppAgree.vue';
import appStartAdv from './components/appStartAdv.vue';
import popupAdvert from '@/components/common/popupAdvert/popupAdvert.vue'
import setUpHead from './components/setUpHead.vue';


import { mapState } from 'vuex';

export default {
	components: {
		tabBar,
		// androidAppAgree,
		appStartAdv,
		popupAdvert,
		
		floors,
		// 装修功能组件
		setUpHead,
	},
	data() {
		return {
			tabList:[],
			indexData: {}, // 接收mobile/index接口的res.data
			floorData: [],//数组的第一个用来放indexData的楼层，indexData.head.type=='searchAndTab'时，数组的2~N个是用来放置海报页面的数组

			offsetBottom: 320, // 用来计算tabOpacity的值，必须要给默认值，因为某些特殊情况会算不出offsetBottom值
			scrollTop: 0, // 滚动高
			scrollTopTemp:0,//scrollTop的缓冲数据。小程序端直接改的值的话，视图层会频繁的向逻辑层发送数据，造成卡顿，所以要用一个中间值来接收
			paging: {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false // 是否显示列表为空时的样式
			},
			isAppAd: false, //是否显示app广告，APP端才用到(注意：这个变量不定义在computed里，因为computed执行比较慢)
			templateId:'',//预览海报模板ID，如果有该id，则该页面是调用trim.sDecoratePageShow()接口
			isPreview: false,//如果是shareUrlRedirect页面跳过来预览(商家端或PC后台跳进来)，就加个遮罩层防止点击
			current: 0, // 当前的索引
			scrollViewTop:0,
			conHeight:0,//setUpHead组件的占位符高度
			isSwiper:isSwiper,
		};
	},
	computed: {
		...mapState(['systemConfig', 'popupAdvertRule']),
		// 当 后台设置头部组件类型选择了【 搜索+标签页】，并且点击的不是【首页】时。(即此时页面是显示海报页的数据)
		isPoster(){
			return this.current&&this.indexData.head.type=='searchAndTab'
		},
	},
	watch: {
		scrollTopTemp: {
			handler(val) {
				this.$nextTick(()=> {
					this.scrollTop = val;
				});
			}
		},
	},
	created() {},
	onLoad(option) {
		// #ifdef APP-PLUS
		// 如果是刚打开app并且缓存里有APP启动广告
		if (getApp().globalData.onLaunch && uni.getStorageSync('appStartAdv')) {
			this.isAppAd = true;
		}
		// #endif
		this.templateId = option.templateId || null
		this.isPreview = option.isPreview&&option.isPreview!='false' ? true : false
		this.getData();
	},

	mounted() {
	},

	onShow() {
		if (this.$refs.refSetUpHead) {
			this.$refs.refSetUpHead.getMyInfo()
		}
		this.$nextTick(()=>{
			this.$refs.commentTabbat.setCurRoute()//这个是为了解决小程序端animate_动画播放过后，再次点击时，动画不生效的bug。
		})
	},

	// 页面滚动执行方式
	onPageScroll(e) {
		// 关闭swiper才用到,开启了swiper是用下面的scroll(e)
		if(!isSwiper){
			this.scrollTopTemp = parseInt(e.scrollTop);
		}
	},

	onPullDownRefresh(e) {
		this.getData();
	},

	// 页面上拉触底事件的处理函数
	onReachBottom() {
		if(!isSwiper && this.$refs.floors[0].prodListIndex.length == 0){
			this.scrolltolower()
		} else {
			this.$refs.floors[0].handleIndex()
		}
	},

	// 自定义好友分享。
	// #ifdef MP
	onShareAppMessage(res) {
		if (res.from === 'button') {
			// 来自页面内转发按钮
		}
		return {
			title: this.systemConfig && this.systemConfig.domainName ? this.systemConfig.domainName : '',
			path: this.$utils.pages.getPageRoute().url
		};
	},
	// #endif

	methods: {
		// 获取楼层数据
		getData() {
			const api = this.templateId ? 'adminDecoratePageShow' : 'index'//this.templateId 如果是后台显示的预览页面
			const parmas = this.templateId ? { id: this.templateId} : ''
			this.paging = {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false // 是否显示列表为空时的样式
			};
			trim[api](parmas).then((res) => {
				if (res.code == 1) {
					if (res.data) {
						this.indexData = this.templateId?JSON.parse(res.data.data):JSON.parse(res.data) ;
						
						this.$set(this, 'tabList', this.$u.deepClone(this.indexData.head?.data?.searchAndTabData?.tabList || []))
						// 下面这个判断主要是为了兼容旧数据,改版前的旧数据没有tabList数据,这时要强行加一个,不然首页会显示不出来
						if(!this.tabList.length){
							this.tabList = [{isSelect: true,title: '首页',type: 'homePage'}]
						}
						this.floorData = this.$u.deepClone(this.tabList)
						this.$set(this.floorData, 0, this.$u.deepClone(this.indexData))//给首页赋值
						console.log('indexData:', this.indexData);
						// 如果是【搜索+标签页】并且是【启用菜单】了
						if (this.indexData.head.type=='searchAndTab'&&this.indexData.head.data.searchAndTabData.tabsShow) {
							if (this.tabList&&this.tabList.length) {
								this.current =  this.tabList.findIndex(item => item.isSelect)||0
								if (this.current) {
									this.getPoster(this.tabList[this.current].url.id)
								}
							}
						}
					}
				}
			})
			.catch(err => {
				this.paging.error = true;
			})
			.finally(res => {
				this.paging.status = 'noMore';
				//如果没有数据
				if (!this.current&&!this.$checkInfo([{ type: 'hasValue', value: this.floorData[0].floors }])&&!(this.indexData.foot && this.indexData.foot.type == 'goodList')) {
					this.paging.emptylist = true;
				}
				uni.stopPullDownRefresh();
			});
		},
		// 获取海报数据
		getPoster(pageId) {
			trim.showMobilePosterPage({ pageId:pageId }).then(res => {
				if (res.code&&res.data) {
					this.$set(this.floorData, this.current, this.$u.deepClone(res.data))
				}
		    }).catch((err) => {
				this.paging.error = true
			}).finally((res) => {
				this.paging.status = 'noMore'
				//如果没有数据
				this.setEmpty()
				uni.stopPullDownRefresh();
			});
		},
		
		// 轮播图指示器改变
		swiperChange(e) {
			this.changTab(e.detail.current)
		},
		
		changTab(index) {
			this.pageScrollTo(0)
			this.current = index
			// 如果是首页
			if(!this.current){
				this.setEmpty()
			// 如果是海报页
			}else{
				// 如果还未获取到数据
				if(this.$u.test.isEmpty(this.floorData[index].head)) {
					// 由于下面用了debounce,所以要在这里给paging还原默认值,而不是在getPoster()方法里
					this.paging = {
						status: 'loading',
						error: false, // 是否错误
						emptylist: false // 是否显示列表为空时的样式
					}
					
					// #ifndef MP
					uni.$u.debounce(() => {this.getPoster(this.tabList[index].url.id)})
					// #endif
					// #ifdef MP
					// 注意：用uni.$u.debounce(() => {this.getPoster(this.tabList[index].url.id)})的话，在小程序刷新页面后快速向下滚动后，该getPoster方法会失效
					if(isSwiper){
						uni.$u.debounce(this.getPoster(this.tabList[index].url.id))
					}else{
						uni.$u.debounce(() => {this.getPoster(this.tabList[index].url.id)})
					}
					// #endif
				// 如果已经获取到数据
				}else{
					this.setEmpty()
				}
			}
		},
		setEmpty(){
			this.paging.emptylist = false
			this.paging.error = false
			//如果没有数据
			if (!this.$checkInfo([{ type: 'hasValue', value: this.floorData[this.current].floors }])&&!(this.floorData[this.current].foot && this.floorData[this.current].foot.type == 'goodList')) {
				this.paging.emptylist = true
			}
		},
		
		scroll(e){
			// #ifdef MP
			//用节流的话，头部的颜色渐变和绽放效果会失效，但当页面太多数据时，性能会下降很多，导致滚动出错，这时要放弃头部的效果来换取性能
			uni.$u.debounce(() => {
				this.scrollTop = e.detail.scrollTop * 1
			},10)
			// #endif
			// #ifndef MP
			this.scrollTopTemp = e.detail.scrollTop * 1;
			// #endif
		},
		
		pageScrollTo(top){
			let topTemp = top
			if(isSwiper){
				topTemp = top - 40
			}
			if(isSwiper){
				// 解决view层不同步的问题
				this.scrollViewTop = this.scrollTop
				this.$nextTick(()=> {
					this.scrollViewTop = topTemp
				});
			}else{
				this.$nextTick(()=> {
					this.$pageScrollTo(topTemp)
				});
			}
		},
		
		scrolltolower(){
			if (this.$refs.floors&&this.$refs.floors[0]) {
				this.$refs.floors[0].scrolltolower();
			}
		},
		
		getHeight(e){
			this.conHeight = e
		},
		getOffsetBottom(e){
			this.offsetBottom = e
		}
		
	}
};
</script>

<style lang="scss" scoped>
uni-page-body {
	height: 100%;
}
</style>
