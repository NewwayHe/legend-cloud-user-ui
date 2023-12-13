<template>
	<!-- /*
     * @Descripttion:(头部)
    */ -->
	<!-- 这个占位符高度conHeight要写在父级，因为它要放在<swiper-item>里 -->
	<!-- <view class="bg-transparent w-100vw" :style="{height:conHeight}"> -->
		<view class="w-100 zindex-999 bg-transparent max-750 min-320 m-0-auto translate3d0 top-0 position-fixed" v-if="showFloor">
			
			<!-- 以下这段为新增，后台头部增加一个背景图片的变量 -->
			<view class="w-100 position-absolute top-0 left-0 overflow-h" :style="{height:`${conHeight}px` }" v-if="parmas.head.backgroundImg&&!showBanner">
				<image class="w-100" :src="photoServer + parmas.head.backgroundImg" mode="widthFix"></image>
			</view>
			
			<view class="position-relative" :class="[{'transition-all10':animation=='css'}]" :style="{ borderTop: stausBarHeight + 'px solid transparent',backgroundColor:themesRGBA}">
				<view class="flex-between h-88r w-100 content-box" :style="{ color: floors.color || '#ffffff',paddingBottom:hasName?`${ 80 - 80*(1-midConOpacity)}rpx`:'' }">
					<view class="font-28 pl-2 flex-center overflow-h" style="margin-top: -1px;" @click.stop="getLocation" v-if="floors && floors.locationAndLogo && floors.locationAndLogo.flag == 1">
						<view class="pr-1 overflow-h" style="max-width: 200rpx;">
							<text class="line-clamp1">{{ location.region }}</text>
						</view>
						<text class="iconfont icon-ArrowDown" style="font-size: 28rpx" />
					</view>
					<view class="font-28 pl-2 flex-center overflow-h h-56r" v-if="floors && floors.locationAndLogo && floors.locationAndLogo.flag == 2">
						<ls-image :src="floors.locationAndLogo.logo" :options="{h: '100%', w: floors.locationAndLogo.logoWidth * 2, br:floors.locationAndLogo.logoBorderRadius * 2}" :isPreview="false"></ls-image>
					</view>
					<view class="flex-1 h-100 position-relative flex-start mid-con">
						<view class="pl-2 line-clamp1" :class="[{'transition-all02':animation=='css'}]" :style="{fontSize: floors.title.size*2+'rpx',opacity:midConOpacity,fontWeight: floors.title.fontWeight ? 'bold' : 'unset',}" v-if="hasName">{{floors.title.name}}</view>
						<view class="flex-start rounded-50 h-56r overflow-h zindex-2"
							:class="[hasName?`position-absolute ${animation=='css'?'transition-all02':''}`:'mx-2']"
							:style="{backgroundColor:floors.seachColor?floors.seachColor:(floors.backgroundColor=='#FFFFFF'||!floors.backgroundColor)?'#f6f7f8':'#ffffff',
								left:hasName?`calc( -${midConInfo.offsetLeft}px + 20rpx + ${(midConInfo.offsetLeft)*(1-midConOpacity)}px)`:'',
								bottom:hasName?`${ -60 + 76*(1-midConOpacity)}rpx`:'',
								width:hasName?(midConInfo.offsetWidth?`calc( ${midConInfo.offsetWidth}px - 20rpx + ${100*midConOpacity}vw - ${40*midConOpacity}rpx - ${midConInfo.offsetWidth*midConOpacity}px + ${20*midConOpacity}rpx )`:'calc( 100vw - 40rpx)'):'100%'
							}"
							@click.stop="$navigateTo(`/ModuleGoods/search/search`)"
						>
							<view class="pr-1 pl-2 position-absolute"><text class="iconfont icon-sousuo text-ccc" style="font-size: 28rpx;"></text></view>
							<view class="font-28 text-bbb pl-6 text-nowrap">搜索商品</view>
						</view>
						
					</view>	
					
					<view class="flex-col-center pl-1 pr-3 position-relative" @click="$navigateTo(`/ModuleCenter/message/message`)" v-if="floors && floors.showMessage">
						<text class="iconfont icon-xiaoxi2" style="font-size: 40rpx" />
						<text class="line-h font-20" style="transform: scale(0.9)">消息</text>
						<text
							class="position-absolute rounded-50 py px-1 font-20 flex-center"
							style="top: -10rpx; left: 30rpx; height: 30rpx; transform: scale(0.8); transition: all ease .6s;"
							:style="{
								color: floors.color || '#ffffff',
								backgroundColor: themesRGBA,
								opacity: myInfo.message ? 1 : 0
							}"
						>
							{{ myInfo.message > 99 ? '99+' : myInfo.message||0 }}
						</text>
					</view>
					<!-- 如果是是微信端，放一个胶囊的点位符 -->
					<!-- #ifdef MP -->
					<view :style="{ width: wxMenuBut.placeholder + 'px', display: 'block' }"></view>
					<!-- #endif -->
				</view>
			</view>
			<view ref="tabs" class="flex-start w-100 overflow-h h-80r position-relative" :style="{ backgroundColor: tabThemesRGBA}"  v-if="showTabs">
				<view class="flex-1 overflow-h">
					<ls-tabs
						:list="tempList"
						bgColor="transparent"
						:lineShow="searchAndTabData.tabsType == 'line'"
						:pills="searchAndTabData.tabsType == 'pills'"
						:pillsScale="1.3"
						shadow
						:current="current"
						:activeStyle="{color:searchAndTabData.tabCurThemeColor ? parmas.themeColor : searchAndTabData.tabCurColor}"
						:inactiveStyle="{color:searchAndTabData.tabNoCurColor}"
						:lineColor="searchAndTabData.tabCurThemeColor ? parmas.themeColor : searchAndTabData.tabCurColor"
						lineBottom="15%"
						keyName="title"
						alwaysScroll
						@change="changeTab"
						v-if="searchAndTabData.tabsShow"
					/>
				</view>
				<view class="flex-end ml-2" :style="{color: searchAndTabData.tabNoCurColor}" @click="$switchTab('/pages/category/category')" v-if="searchAndTabData.showCategoryIcon||searchAndTabData.showCategoryText">
					<view class="iconfont icon-fenlei4 mr-1" v-if="searchAndTabData.showCategoryIcon"></view>
					<view class="mr-1" v-if="searchAndTabData.showCategoryText">分类</view>
				</view>
			</view>
		</view>
	<!-- </view> -->
</template>

<script>
// JS方法
import { appToken } from '@/utils/Cache.js';
import amapFile from '@/libs/amap-wx';
import Gps from '@/libs/json-gps/js_sdk/gps.js';
const gps = new Gps()
import { mapState } from 'vuex';
export default {
	// #ifdef MP-WEIXIN
	// 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性。这时在<组件name> 里加style和class是不会生效的
	options: { virtualHost: true },
	// #endif
	components: {},
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
			type: [String, Number],
			default: 0
		},
		offsetBottom: {
			// 用来计算tabOpacity的值
			type: [String, Number],
			default: 320
		},
		// 当前的索引
		current: {
			type: [String, Number],
			default: 0
		},
		
		// 搜索框的渐变色采用哪一种方式实现：小程序：css(由于scrollTop值监听频繁向逻辑层发送数据，小程序用js实现的话会造成卡顿，所以优先考虑用css实现)，H5和APP：js
		animation: {
			type: [String],
			// #ifdef MP
			default: 'css',
			// #endif
			// #ifndef MP
			default: 'js',
			// #endif
		},
	},
	data() {
		return {
			// #ifdef MP
			locaAuth: false, /* 判断位置是否已经授权，是选择地图位置点击取消触发的fail，再选择位置 */
			// #endif
			midConInfo:{},
		};
	},
	computed: {
		...mapState(['location', 'stausBarHeight', 'wxMenuBut', 'myInfo']),

		themesRGBA() {
			let colorObj = { r: '', g: '', b: '' };
			let opacity = 0;
			if (this.parmas && this.floors && ['searchAndBanner', 'searchAndTab'].includes(this.floors.type) && this.offsetBottom) {
				const tempColor = this.floors.themeColor ? this.parmas.themeColor : this.floors.backgroundColor
				colorObj = this.$utils.color.colorRgb(tempColor);
				opacity = this.floors.bgGradualChange ? this.tabOpacity : 1;
			}
			return colorObj.r ? `rgba(${colorObj.r}, ${colorObj.g},${colorObj.b},${opacity})!important` : 'transparent';
		},
		
		tabThemesRGBA() {
			let colorObj = { r: '', g: '', b: '' };
			let opacity = 0;
			if (this.parmas && this.floors && ['searchAndBanner', 'searchAndTab'].includes(this.floors.type) && this.offsetBottom) {
				const tempColor = this.searchAndTabData?.tabBgThemeColor ? this.parmas.themeColor : this.$utils.color.getHexColor(this.searchAndTabData?.tabBgColor)
				colorObj = this.$utils.color.colorRgb(tempColor)
				opacity = this.searchAndTabData?.bgGradualChange ? this.tabOpacity : 1;
			}
		    return colorObj.r ? `rgba(${colorObj.r}, ${colorObj.g},${colorObj.b},${opacity})` : ''
		},
		
		tabOpacity() {
			// 控制头部背景透明度的变量，默认是0，最大是1
			// 如果是小程序,用实时渐变的话会造成卡顿(主要是onPageScroll频繁的向逻辑层发送数据而造成的卡顿)，改用css动画效果transition来实现
			if(this.animation == 'css'){
				const offset = this.showBanner ? this.offsetBottom : uni.upx2px(100)
				return this.scrollTop >= offset ? 1 : 0;
			// 如果是H5或app,则实时渐变
			}else{
				return (this.scrollTop >= this.offsetBottom ? 1 : (this.scrollTop / this.offsetBottom).toFixed(2)) || 0;
			}
		},
		
		midConOpacity(){
			// 控制搜索框滚动的变量，默认是1(scrollTop==0时)，最少是0(scrollTop>=80rpx时)
			const offset = uni.upx2px(80)
			
			// 如果是小程序,用实时缩放的话会造成卡顿(主要是onPageScroll频繁的向逻辑层发送数据而造成的卡顿)，改用css动画效果transition来实现
			if(this.animation == 'css'){
				return this.scrollTop >= offset ? 0 : 1
			// 如果是H5或app,则实时缩放
			}else{
				return this.scrollTop == 0 ? 1 : this.scrollTop >= offset ? 0 : ((offset - this.scrollTop) / offset).toFixed(2)
			}
		},
		
		searchAndTabData(){
			return this.floors.type == 'searchAndTab' ? this.floors?.data?.searchAndTabData : ''
		},
		
		tempList() {
			const arr = this.searchAndTabData && this.searchAndTabData.tabList && this.searchAndTabData.tabList.length ? this.searchAndTabData.tabList : [];
			return arr;
		},

		// 是否显示整个楼层
		showFloor(){
			return this.floors && ['searchAndBanner', 'searchAndTab'].includes(this.floors.type)
		},
		
		// 如果是后台选择了[搜索+轮播图]且开了轮播图开关且已经上传了轮播图
		showBanner(){
			return this.floors && this.floors.type == 'searchAndBanner' && this.floors.data.searchAndBannerData.showBanner && this.floors.data.searchAndBannerData.banner.imgList.length
		},
		
		// 是否显示tab栏(后台设置头部组件类型选择了【 搜索+标签页】才会显示)
		showTabs(){
			return this.tempList && this.tempList.length && this.floors.type == 'searchAndTab' && this.searchAndTabData && this.searchAndTabData.tabsShow
		},
		
		// 这个是为了兼容旧数据
		hasName(){
			return this.floors?.title?.name
		},
		
		conHeight(){
			let height = 0
			// 如果不显示这个楼层 或者 除了后台选择了[搜索+轮播图]且开了轮播图开关且已经上传了轮播图外(取反)，都加上手机状态栏的占位符
			if(!this.showFloor || !this.showBanner){
				height = height + this.stausBarHeight
			}
			
			if (this.showFloor){
				// 如果没有轮播图
				if(!this.showBanner){
					// 如果开启了头部组件且这时没有开启轮播图，则加个最基础的88rpx
					height = height + uni.upx2px(88)
					// 如果后台设置了商城名字,则加一个80rpx的占位符
					if(this.hasName) height = height + uni.upx2px(80 * this.midConOpacity)
				} 
				
				// 如果后台设置头部组件类型选择了【搜索+标签页】，,则加一个80rpx的占位符
				if(this.showTabs) height = height + uni.upx2px(80)
			} 
			return height
		},
	},
	watch: {
		parmas: {
			handler(newValue, oldValue) {
				if(!uni.$u.test.isEmpty(newValue)) {
					if(newValue.head){
						this.$nextTick(() => {
							// 不加setTimeout的话,APP端会有50%机率显示不出搜索框
							// #ifdef APP-PLUS
							setTimeout(() => {
							// #endif
								this.getMidCon()
							// #ifdef APP-PLUS
							},200)// (50ms的话真机调试没问题，但打包安装后，却不行，100ms的话，APP里10次会有1次拿不到值)
							// #endif
						})
					}
				}
			},
			deep: true,
			immediate: true
		},
		conHeight: {
			handler(newValue) {
				this.$emit('getHeight',newValue)
			},
			deep: true,
			immediate: true
		},
	},
	created() {
	},
	mounted() {
		if (this.floors && this.floors?.locationAndLogo?.flag == 1) {
			this.$store.dispatch('getLocation').then((res) => {
				// setTimeout(()=>{
				// 	console.log(111,res);//只有小程序和APP端才有resolve() res出来
				// },1000)
			}) // 有些页面要拿到经纬度才请求接口，如果是复制链接进去的话，要先拿到经纬度
		}
	},
	destroyed() {},
	updated(){},
	methods: {
		// 手动定位(进入地图)
		getLocation() {
			this.$store.dispatch('setLocation')
		},
		
		getMyInfo(){
			if(appToken.isLogin() && this.floors && this.floors.showMessage){
				this.$store.dispatch('getMyInfo');
			}
		},
		
		// 切换tabs
		changeTab(item) {
			this.$emit('change', item.index)
		},

		// 获取搜索框的宽度和位置信息
		async getMidCon() {
			const itemRect = await this.$utils.getRect(this,'.mid-con');
			if(itemRect){
				this.$set(this.midConInfo,'offsetLeft',Number(itemRect.left).toFixed(2)) // 搜索框的居左位置
				this.$set(this.midConInfo,'offsetWidth',Number(itemRect.width).toFixed(2)) // 搜索框的总宽度
			}
		}
	}
};
</script>

<style lang="scss" scoped></style>
