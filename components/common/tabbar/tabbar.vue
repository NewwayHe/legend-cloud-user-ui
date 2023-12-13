<!-- 
    首页的底部导航栏，用来代替原生的tabbar
 -->

<template>
	<!-- 下面这个position-relative，是因为首页其它同级组件加了position-relative，如果这个不加的话，层级会没他们高而被覆盖 -->
	<view class="position-relative" :style="{zIndex:zIndex}">
		<view
			class="w-100 font-20 position-fixed bottom-0 left-0 right-0 max-750 min-320 m-0-auto zindex-99"
			:class="[{ 'borderTopColor bgColor':!isMidButDataType4 },className]"
			style="height: calc(100rpx + var(--safe-area-inset-bottom));background-size:100%;"
			:style="{
				'--themescolor': themes.color,
				'--backgroundcolor': tabbarData.backgroundColor,
				'--bordertopcolor':  tabbarData.borderTopColor,
				'padding-bottom': `var(--safe-area-inset-bottom) solid ${!tabbarData.backgroundColor}`,
				color:tabbarData.color,
				'background-image': !isMidButDataType4&&tabbarData.backgroundImg?`url(${photoServer+tabbarData.backgroundImg})`:'',
				zIndex:zIndex,
			}"
			v-if="!$u.test.isEmpty(tabbarData)"
		>
			<view class="flex-center w-100 border-box m-0-auto position-relative"
				:class="isMidButDataType4?'':''"
				:style="{'border-bottom':isMidButDataType4?`var(--safe-area-inset-bottom) solid ${tabbarData.backgroundColor}`:'',height: isMidButDataType4?`calc(100rpx + var(--safe-area-inset-bottom))`:'100rpx'}">
				<view class="flex-1 flex-col-center h-100 zindex-2"
					:class="{ 'bgColor': isMidButDataType4, 'overflow-h':isMidButDataType4&&listTemp.length==6 }"
					:style="{ 
						'border-top-right-radius':  index == (listTemp.length / 2 - 1) ? borderTopRadius : '',
						'margin-right': isMidButDataType4 && index != (listTemp.length/2-1) ? '-2rpx' : '',
						'color':curRoute == pageOjb(item.url.name) ? compColor: ''
					}"
					v-for="(item,index) in listTemp"
					:key="index"
					@click.stop="switchTabFunc(item.url)"
					v-if="!tabbarData.showMidButton || listTemp.length%2 != 0 || (tabbarData.showMidButton&&listTemp.length%2 == 0&&index<(listTemp.length/2))">
					<view class="iconfont position-relative"
						:class="[curRoute == pageOjb(item.url.name) ? item.selectedIconfont : item.iconfont,curRoute == pageOjb(item.url.name)?`animate_${tabbarData.animate}`:'']"
						:style="{fontSize: `${tabbarData.fontSize*2}rpx`}"
						v-if="item.isIconfont">
						<text class="car-num" v-if="cartNum&&item.url.name=='购物车'">{{ cartNum > 99 ? '99+' : cartNum }}</text>
					</view>
					<ls-image
						:class="[curRoute == pageOjb(item.url.name)?`animate_${tabbarData.animate}`:'']"
						:src="curRoute == pageOjb(item.url.name) ? item.selectedIconPath : item.iconPath"
						:options="{ w: tabbarData.fontSize*2, h: tabbarData.fontSize*2, br: 10 }"
						:customStyle="{marginBottom: '4rpx',marginTop: '4rpx'}"
						:lazyLoad="false"
						v-else></ls-image>
					<text class="line-h-sm" v-if="!tabbarData.hideText">{{item.text}}</text>
				</view>

				<!-- 中间按钮 -->
				<!-- 以前的写法是这样的，如果某些机型有bug，可以换回以下写法(但这写法不支持pad)：
					flex: isMidButDataType4&&tabbarData.midButData.size == 'small' ? '' : listTemp.length == 2 ? 0.5 : 1,
					width: isMidButDataType4&&tabbarData.midButData.size == 'small'&&listTemp.length != 6 ? '124rpx' : ''
					为了兼容pad，flex和width改为下面的写法
				-->
				<view
					class="flex-col-center position-relative h-100"
					:class="[!isMidButDataType4?'zindex-99':'']"
					:style="{
						flexShrink: 0,
						flex: isMidButDataType4 ? '' : listTemp.length == 2 ? 0.5 : 1,
						width: isMidButDataType4 ? (tabbarData.midButData.size == 'small'?(listTemp.length == 6?'':'124rpx'):(listTemp.length == 6?'108rpx':'150rpx')) : ''
					}"
					v-if="tabbarData.showMidButton&&listTemp.length%2 == 0">
					<template v-if="tabbarData.midButData.type == 1">
						<ls-popover position="top" :bgColor="Number(tabbarData.midButData.listType)==1 ?'transparent':''" :conBorderColor="Number(tabbarData.midButData.listType)==1?'transparent':themes.rgb01" :disabled="!(tabbarData.midButData.showMidBtn&&tabbarData.midButData.list&&tabbarData.midButData.list.length)" @change="midBtn">
							<view class="flex-1 w-100 flex-col-center">
								<ls-image
									className="overflow-h"
									:src="tabbarData.midButData.img"
									:options="{ w: 80*midButScale, h: 80*midButScale, br: '100%',bg:midbutColor }"
									:lazyLoad="false"
									v-if="!tabbarData.midButData.isIconfont"></ls-image>
								<text class="iconfont"
									:class="tabbarData.midButData.iconfont"
									:style="{ color:midbutColor, fontSize:`${80*midButScale}rpx` }"
									v-else />
							</view>
							<mid-btn-content :type="Number(tabbarData.midButData.listType)" :list="tabbarData.midButData.list" slot="content"></mid-btn-content>
						</ls-popover>
					</template>

					<template v-if="tabbarData.midButData.type == 2">
						<view class="rounded-circle position-absolute" :style="{height: `${110*midButScale-2}rpx`, width: `${110*midButScale-2}rpx`, bottom: `${30/(midButScale*midButScale)}rpx`}">
							<ls-popover position="top" :bgColor="Number(tabbarData.midButData.listType)==1?'transparent':''" :conBorderColor="Number(tabbarData.midButData.listType)==1?'transparent':themes.rgb01" :disabled="!(tabbarData.midButData.showMidBtn&&tabbarData.midButData.list&&tabbarData.midButData.list.length)" @change="midBtn">
								<ls-image
									:src="tabbarData.midButData.img"
									:options="{ w: 110*midButScale, h: 110*midButScale, br: '100%',bg:midbutColor }"
									:lazyLoad="false"
									v-if="!tabbarData.midButData.isIconfont"></ls-image>
								<view
									class="iconfont bg-white rounded-circle position-absolute"
									:class="[tabbarData.midButData.iconfont]"
									:style="{ color:midbutColor, width: `${110*midButScale}rpx`,height: `${110*midButScale}rpx`,fontSize: `${110*midButScale}rpx`,top: `${-5/midButScale}rpx` }"
									v-else>
								</view>
								<mid-btn-content :type="Number(tabbarData.midButData.listType)" :list="tabbarData.midButData.list" slot="content"></mid-btn-content>
							</ls-popover>
						</view>
					</template>

					<template v-if="tabbarData.midButData.type == 3">
						<view
							class="rounded-circle position-absolute bg-white"
							style="box-shadow: rgb(0, 0, 0, 0.15) 0px -3px 2px -2px"
							:style="{height: `${150*midButScale}rpx`, width: `${150*midButScale}rpx`,bottom:tabbarData.midButData.size == 'small'?`35rpx`:'0rpx' }">
							<ls-popover position="top" :bgColor="Number(tabbarData.midButData.listType)==1?'transparent':''" :conBorderColor="Number(tabbarData.midButData.listType)==1?'transparent':themes.rgb01" :disabled="!(tabbarData.midButData.showMidBtn&&tabbarData.midButData.list&&tabbarData.midButData.list.length)" @change="midBtn">
								<view class="flex-center" :style="{height: `${150*midButScale}rpx`, width: `${150*midButScale}rpx` }">
									<ls-image
										:src="tabbarData.midButData.img"
										:options="{ w: 110*midButScale, h: 110*midButScale, br: '100%',bg:midbutColor }"
										:lazyLoad="false"
										v-if="!tabbarData.midButData.isIconfont"></ls-image>
									<text
										class="iconfont"
										:class="tabbarData.midButData.iconfont"
										:style="{ color:midbutColor, fontSize:`${110*midButScale}rpx` }"
										v-else></text>
								</view>
								<mid-btn-content :type="Number(tabbarData.midButData.listType)" :list="tabbarData.midButData.list" slot="content"></mid-btn-content>
							</ls-popover>
						</view>
					</template>

					<template v-if="tabbarData.midButData.type == 4">
						<view
							class="position-absolute rounded-circle"
							:class="[midButClass]"
							:style="{ 
								width:`${listTemp.length==6?140:listTemp.length==2?164:164}rpx`,
								height:`${listTemp.length==6?140:listTemp.length==2?152:164}rpx`,
								bottom:`${listTemp.length==6?30:10}rpx`,
								boxShadow: boxShadow
							}"></view>
						<ls-popover position="top" :bgColor="Number(tabbarData.midButData.listType)==1?'transparent':''" :conBorderColor="Number(tabbarData.midButData.listType)==1?'transparent':themes.rgb01" :remove="removeNum" :disabled="!(tabbarData.midButData.showMidBtn&&tabbarData.midButData.list&&tabbarData.midButData.list.length)" @change="midBtn">
							<view style="margin-bottom: 80rpx" :class="[midButClass]">
								<ls-image
									:src="tabbarData.midButData.img"
									:options="{w:listTemp.length==6?100:140,h:listTemp.length==6?100:140,br:'100%',bg:midbutColor}"
									:lazyLoad="false"
									v-if="!tabbarData.midButData.isIconfont"></ls-image>
								<view
									class="iconfont rounded-circle overflow-h"
									:class="tabbarData.midButData.iconfont"
									:style="{
										color:midbutColor,
										fontSize:`${listTemp.length==6?100:140}rpx`,
										width:`${listTemp.length==6?100:140}rpx`, 
										height:`${listTemp.length==6?100:140}rpx`, 
									}"
									v-else></view>
							</view>
							<mid-btn-content :type="Number(tabbarData.midButData.listType)" :list="tabbarData.midButData.list" slot="content"></mid-btn-content>
						</ls-popover>
					</template>
				</view>

				<!-- 右边 -->
				<view class="flex-1 flex-col-center h-100 zindex-2"
					:class="{ 'bgColor': isMidButDataType4, 'overflow-h': isMidButDataType4&&listTemp.length==6 }"
					:style="{ 
						'border-top-left-radius':  index == (listTemp.length / 2) ? borderTopRadius : '',
						'margin-left': isMidButDataType4 && index != (listTemp.length/2) ? '-2rpx' : '',
						'color':curRoute == pageOjb(item.url.name) ? compColor: ''
					}"
					v-for="(item,index) in listTemp"
					:key="index"
					@click.stop="switchTabFunc(item.url)"
					v-if="(tabbarData.showMidButton&&listTemp.length%2 == 0&&index>=(listTemp.length/2))">
					<view class="iconfont position-relative"
						:class="[curRoute == pageOjb(item.url.name) ? item.selectedIconfont : item.iconfont, curRoute == pageOjb(item.url.name)?`animate_${tabbarData.animate}`:'']"
						:style="{fontSize: `${tabbarData.fontSize*2}rpx`}"
						v-if="item.isIconfont">
						<text class="car-num" v-if="cartNum&&item.url.name=='购物车'">{{ cartNum > 99 ? '99+' : cartNum }}</text>
					</view>
					<ls-image
						:class="[curRoute == pageOjb(item.url.name)?`animate_${tabbarData.animate}`:'']"
						:customStyle="{marginBottom: '4rpx',marginTop: '4rpx'}"
						:src="curRoute == pageOjb(item.url.name) ? item.selectedIconPath : item.iconPath"
						:options="{ w: tabbarData.fontSize*2, h: tabbarData.fontSize*2, br: 10 }"
						:lazyLoad="false"
						v-else></ls-image>
					<text class="line-h-sm" v-if="!tabbarData.hideText">{{item.text}}</text>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import midBtnContent from './components/mid-btn-content.vue';
	import floorMixin from '@/mixins/floor.js';
	import { defaultData } from '@/components/common/tabbar/defaultData.js';
	export default {
		components: { 'mid-btn-content': midBtnContent },
		// #ifdef MP-WEIXIN
		// 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性。这时在<组件name> 里加style和class是不会生效的
		options: { virtualHost: true },
		// #endif
		props: {
			className: {
				type: [String, Array, Boolean], // 这里加个Boolean，是因为如果传className=""，小程序端会报错
				default: ''
			},
			templateId: {
				type: [Number, String,Boolean],
				default: ''
			},
			indexData: { // 装修楼层值
				type: [Object, String],
				default: () => {}
			},
			zIndex: {
				type: [Number, String],
				default: 999
			},
			active: {
			    // 当前选择那个按钮
			    type: String,
			    default: 'index'
			}
		},
		data() {
			return {
				// tabbarData: {},
				curRoute: '', // 当前页面
				tabbar:defaultData.tabbar
			};
		},
		mixins: [floorMixin],
		computed: {
			...mapState(['cartNum']),
			listTemp() {
				let list = []
				if (this.tabbarData && this.tabbarData.list && this.tabbarData.list.length) {
					list = this.tabbarData.list.filter(item => { return item.visible })
				}
				return list
			},
			isMidButDataType4() {
				// 如果是显示中间按钮,并且按钮的样式是4
				return this.tabbarData.showMidButton && this.listTemp.length % 2 == 0 && this.tabbarData.midButData && this.tabbarData.midButData.type == 4
			},
			// midButData.type == 4专用。用来处理当设置中间按钮[大][中][小]时相对应用到的class
			midButClass() {
				let midButClass = ''
				if (this.tabbarData.midButData) {
					if (this.tabbarData.midButData.type == 1 || this.tabbarData.midButData.type == 2) {
						midButClass = this.tabbarData.midButData.size == 'big' ? 'scale-12' : this.tabbarData.midButData.size == 'small' ? 'scale-08' : 'scale-10'
					}
					if (this.tabbarData.midButData.type == 3) {
						midButClass = this.tabbarData.midButData.size == 'big' ? 'scale-12 origin-c-b' : this.tabbarData.midButData.size == 'small' ? 'scale-08 origin-c-t' : 'scale-10'
					}
					if (this.tabbarData.midButData.type == 4) {
						midButClass = this.tabbarData.midButData.size == 'big' ? 'scale-12 origin-c-b' : this.tabbarData.midButData.size == 'small' ? 'scale-08 origin-c-b' : 'scale-10'
					}
				}
				return midButClass
			},
			// midButData.type == 1，2，3专用。用来处理当设置中间按钮[大][中][小]时相对应用到的到小,
			midButScale() {
				let scale = ''
				if (this.tabbarData.midButData) {
					if (this.tabbarData.midButData.type == 1 || this.tabbarData.midButData.type == 2) {
						scale = this.tabbarData.midButData.size == 'big' ? 1.2 : this.tabbarData.midButData.size == 'small' ? 0.8 : 1
					}
					if (this.tabbarData.midButData.type == 3) {
						scale = this.tabbarData.midButData.size == 'big' ? 1.2 : this.tabbarData.midButData.size == 'small' ? 0.8 : 1
					}
					if (this.tabbarData.midButData.type == 4) {
						scale = this.tabbarData.midButData.size == 'big' ? 1.2 : this.tabbarData.midButData.size == 'small' ? 0.8 : 1
					}
				}
				return scale
			},

			borderTopRadius() {
				let radius = ''
				if (this.isMidButDataType4) {
					// 如果是2个底部按钮
					if (this.listTemp.length == 2) {
						if (this.tabbarData.midButData.size == 'big') {
							radius = '68%'
						} else if ((this.tabbarData.midButData.size == 'small')) {
							radius = '56%'
						} else {
							radius = '50%'
						}
						// 如果是6个底部按钮
					} else if (this.listTemp.length == 6) {
						if (this.tabbarData.midButData.size == 'big') {
							radius = '75%'
						} else if ((this.tabbarData.midButData.size == 'small')) {
							radius = '50%'
						} else {
							radius = '60%'
						}
						// 如果是4个底部按钮
					} else {
						if (this.tabbarData.midButData.size == 'big') {
							radius = '70%'
						} else if ((this.tabbarData.midButData.size == 'small')) {
							radius = '55%'
						} else {
							radius = '45%'
						}
					}
				}
				return radius
			},

			boxShadow() {
				let num = 59
				if (this.isMidButDataType4) {
					// 如果是2个底部按钮
					if (this.listTemp.length == 2) {
						if (this.tabbarData.midButData.size == 'big') {
							num = 70
						} else if ((this.tabbarData.midButData.size == 'small')) {
							num = 57
						} else {
							num = 60
						}
						// 如果是6个底部按钮
					} else if (this.listTemp.length == 6) {
						if (this.tabbarData.midButData.size == 'big') {
							num = 70
						} else if ((this.tabbarData.midButData.size == 'small')) {
							num = 59
						} else {
							num = 59
						}
						// 如果是4个底部按钮
					} else {
						if (this.tabbarData.midButData.size == 'big') {
							num = 70
						} else if (this.tabbarData.midButData.size == 'small') {
							num = 59
						} else {
							num = 59
						}
					}
				}
				return `0px ${num * 2}rpx 0rpx 40rpx ${this.tabbarData.backgroundColor}`
			},
			// 当tabbarData.midButData.type == 4时,用来调整弹出框与按钮之间的位置
			removeNum() {
				let num = -16
				if (this.isMidButDataType4) {
					// 如果是2个底部按钮
					if (this.listTemp.length == 2) {
						if (this.tabbarData.midButData.size == 'big') {
							num = -48
						} else if ((this.tabbarData.midButData.size == 'small')) {
							num = 12
						} else {
							num = -16
						}
						// 如果是6个底部按钮
					} else if (this.listTemp.length == 6) {
						if (this.tabbarData.midButData.size == 'big') {
							num = -36
						} else if ((this.tabbarData.midButData.size == 'small')) {
							num = 4
						} else {
							num = -16
						}
						// 如果是4个底部按钮
					} else {
						if (this.tabbarData.midButData.size == 'big') {
							num = -48
						} else if ((this.tabbarData.midButData.size == 'small')) {
							num = 12
						} else {
							num = -16
						}
					}
				}
				return num
			},
			midbutColor() {
				return this.tabbarData.midButData ? (this.tabbarData.midButData.themeColor ? this.themes.color : this.tabbarData.midButData.color) : ''
			},
			compColor() {
				// 模板页面下用装修里面的颜色（临时解决方案 有bug 模板链接单独拿出来切换tab会有问题，模板一般不会用来切换tab）
				if (this.templateId) {
					return this.indexData.tabbar?.themeColor ? this.indexData.themeColor : (this.indexData.tabbar?.selectedColor || this.indexData.themeColor)
				} else {
					// themeColor为true时使用主题色， false使用自定义颜色 
					return this.tabbarData.themeColor ? this.themes.color : (this.tabbarData?.selectedColor || this.themes.color)
				}
			},
			tabbarData(){
				return this.templateId && this.indexData.tabbar ? this.indexData.tabbar : this.tabbar
			}
		},
		watch: {
			// tabbar: {
			// 	handler(newVal) {
			// 		if (newVal) {
			// 			// console.log(111,newVal);
			// 			// this.tabbarData = newVal
			// 		}
			// 	},
			// 	immediate: true,
			// 	deep: true
			// }
		},
		created() {
			uni.hideTabBar(); // 隐藏系统原生的tabBar(如果是复制的链接进来，点击返回跳到该页面的话，会出现两个tabbar，所以在这里加入该方法防止该bug)
		},
		mounted() {},
		methods: {
			setCurRoute(val){
				this.curRoute = this.$utils.pages.getPageRoute().route // 这个是为了解决小程序端animate_动画播放过后，再次点击时，动画不生效的bug。
			},
			/**
			 * @name tab点击事件
			 * @param {number} flag 当前点击的索引
			 * @param {string} url 当前点击带进来的链接
			 * */
			switchTabFunc(url) {
				if (this.curRoute == this.pageOjb(url.name)) return // 如果同一按钮点击了两次，则不处理
				// 备注:如果下面写成curRoute = '',当tab是switchTab页面跟普通页面混搭时,点击switchTab页面,普通页面的图标会出现闪一下(先显示selectedIconfont图标 再显示 iconfont图标)的bug
				this.curRoute = undefined// 这个是为了解决小程序端animate_动画播放过后，再次点击时，动画不生效的bug。原理是在五个tabar页面的onShow()给curRoute赋值前，让curRoute值改变一下，让渲染层发生变化而触发动画
				// 由于jumpPage()加了防抖,点击起来会延时影响体验,所以switchTab时在这里直接跳
				if(url.name == '首页' || url.name == '商品类目' || url.name == '商品品牌' || url.name == '购物车' || url.name == '个人中心'){
					const status = {
						首页: '/pages/index/index',
						商品类目: '/pages/category/category',
						商品品牌: '/pages/category/category',
						购物车: '/pages/cart/cart',
						个人中心: '/pages/my/my',
					}
					// 使用switchTab不支持传参 所以要使用storage来存取
					const options = {
						商品品牌: { isBrand: true },
					}
					try {
					    uni.setStorageSync('floors-switch-option', options[url.name]);
					} catch (e) {
						console.error('floors存储tabbar参数失败')
					}
					uni.switchTab({
						url: status[url.name],
						fail(e) {
							uni.showToast({
								title: '此页面正在开发中！',
								duration: 2000,
								icon: 'none'
							})
						}
					})
				}else{
					this.jumpPage(url);
				}
			},

			midBtn(flag) {
				// this.$u.debounce(() => {
					if (!this.tabbarData?.midButData?.showMidBtn && this.tabbarData?.midButData?.url) {
						this.switchTabFunc(this.tabbarData.midButData.url)
					}
					// this.showMidBtn = flag;
				// });
			},

			pageOjb(name) {
				let flag = false;
				if (name == '首页' || name == '分类' || name == '商品类目' || name == '购物车' || name == '个人中心') {
					const obj = {
						首页: 'pages/index/index',
						分类: 'pages/category/category',
						商品类目: 'pages/category/category',
						购物车: 'pages/cart/cart',
						个人中心: 'pages/my/my',
					};
					flag = obj[name];
				}
				return flag;
			},
		}
	};
</script>
<style lang="scss" scoped>
	.bgColor {
		background-color: var(--backgroundcolor);
	}

	.borderTopColor {
		// border-top:2rpx solid var(--bordertopcolor);
		box-shadow: 0 -2rpx 6rpx var(--bordertopcolor);
	}

	.car-num {
		position: absolute;
		top: -4rpx;
		right: -20rpx;
		z-index: 2;
		background-color: var(--themescolor);
		border-radius: 20rpx;
		padding: 0rpx 8rpx;
		font-size: 20rpx;
		color: #fff;
	}
</style>
