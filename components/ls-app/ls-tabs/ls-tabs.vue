<template>
	<!--
	    自定义 tab ，如果要用fiexd可以在它父级包一个带position-sticky的view来实现fiexd，会自动根据最后一个元素是否超出父级元素来判断是否开启scroll(否则采用flex居中模式)，支持 h5 小程序 app。
	    支持角标，这个是参考u-view2.0来写的，性能比dev6.0参考u-view1.0的强，但功能没dev6.0旧版本的完善
	    根据uView-UI的;u-tabs改造而成
	    特别注意：如果小程序不能滚动，请加上如下示例加上className="w-100"
	    用法一(下划线模式)：
	    <ls-tabs className="w-100" :current="current" :list="navArr" :keyName="'name'" @change="switchType"/>
	-->
	<view class="u-tabs" :class="[className]">
		<view class="u-tabs__wrapper w-100" :style="{ position: fixed ? 'fixed' : '', zIndex: fixed ? zIndex : '', background: bgColor, boxShadow: shadow?'0 1px 12px 0 rgba(0, 0, 0, 0.05)':'' }">
			<slot name="left" />
			<view class="u-tabs__wrapper__scroll-view-wrapper">
				<scroll-view
					:scroll-x="scroll"
					:scroll-left="scroll ? scrollLeft : 0"
					:scroll-with-animation="scroll"
					class="u-tabs__wrapper__scroll-view"
					:show-scrollbar="false"
					ref="u-tabs__wrapper__scroll-view"
				>
					<view
						class="u-tabs__wrapper__nav"
						ref="u-tabs__wrapper__nav"
						:style="[
							{
								display: scroll ? 'inline-flex' : 'flex',
								whiteSpace: scroll ? 'nowrap' : 'normal',
								flex: scroll ? 0 : 1
							}
						]"
					>
						<view
							class="u-tabs__wrapper__nav__item position-relative text-nowrap text-center zindex-2"
							v-for="(item, index) in listTemp"
							:key="index"
							@tap="clickHandler(item, index)"
							:style="[tabItemStyle(index)]"
							:class="[`u-tabs__wrapper__nav__item-${index}`, item.disabled && 'u-tabs__wrapper__nav__item--disabled']"
						>
							<text
								:class="[`u-tabs__wrapper__nav__item__text-${index}`, item.disabled && 'u-tabs__wrapper__nav__item__text--disabled']"
								class="u-tabs__wrapper__nav__item__text"
								:style="[textStyle(index)]"
							>
								{{ keyName?item[keyName]:item.name }}
							</text>
							<badge
								:show="!!(item.badge && (item.badge.show || item.badge.isDot || item.badge.value))"
								:isDot="(item.badge && item.badge.isDot) || propsBadge.isDot"
								:value="(item.badge && item.badge.value) || propsBadge.value"
								:max="(item.badge && item.badge.max) || propsBadge.max"
								:type="(item.badge && item.badge.type) || propsBadge.type"
								:showZero="(item.badge && item.badge.showZero) || propsBadge.showZero"
								:bgColor="(item.badge && item.badge.bgColor) || propsBadge.bgColor"
								:color="(item.badge && item.badge.color) || propsBadge.color"
								:shape="(item.badge && item.badge.shape) || propsBadge.shape"
								:numberType="(item.badge && item.badge.numberType) || propsBadge.numberType"
								:inverted="(item.badge && item.badge.inverted) || propsBadge.inverted"
								customStyle="margin-left: 4px;"
							></badge>
						</view>
						<!-- 下划线--有动画过渡效果 -->
						<view class="u-tabs__wrapper__nav__line" ref="u-tabs__wrapper__nav__line" :style="[tabLineStyle]" v-if="lineShow&&!pills"></view>
						<!-- 胶囊 -->
						<view v-if="pills" class="position-absolute" :style="[tabPillsStyle]"></view>
					</view>
				</scroll-view>
			</view>
			<slot name="right" />
		</view>
		<view class="w-100" :style="{ height: fixed ? itemStyle.height : '0' }" v-if="fixed" ></view>
	</view>
</template>

<script>
// #ifdef APP-NVUE
const animation = uni.requireNativePlugin('animation');
const dom = uni.requireNativePlugin('dom');
// #endif
import badgeJs from './badge.js'
import badge from './badge.vue'
import mixin from '../../uview-ui/libs/mixin/mixin.js'
/**
 * Tabs 标签
 * @description tabs标签组件，在标签多的时候，可以配置为左右滑动，标签少的时候，可以禁止滑动。 该组件的一个特点是配置为滚动模式时，激活的tab会自动移动到组件的中间位置。
 * @tutorial https://www.uviewui.com/components/tabs.html
 * @property {String | Number}	duration			滑块移动一次所需的时间，单位秒（默认 200 ）
 * @property {String | Number}	swierWidth			swiper的宽度（默认 '750rpx' ）
 * @property {String}	keyName	 从`list`元素对象中读取的键名（默认 '' ）
 * @property {Boolean} fixed = [true | false] 是否固定
 * @event {Function(index)} change 标签改变时触发 index: 点击了第几个tab，索引从0开始
 * @event {Function(index)} click 点击标签时触发 index: 点击了第几个tab，索引从0开始
 * @property {Boolean} pills = [true | false] 是否胶囊样式
 * @property {Boolean} pillsInactive = [true | false] 未选中项是否胶囊样式(只能在pills=true时才会实现)
 * @property {String} pillsColor = '#2979ff' 胶囊背景色
 * @property {String} pillsBr = '10rpx' 胶囊圆角大小
 * @example <u-tabs :list="list" :is-scroll="false" :current="current" @change="change"></u-tabs>
 */
export default {
	name: 'u-tabs',
	mixins: [mixin],
	// #ifdef MP-WEIXIN
	// 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性。这时在<组件name> 里加style和class是不会生效的
	options: { virtualHost: true },
	// #endif
	components: { badge },
	props: {
		className:{
			type: [String, Array,Boolean],//这里加个Boolean，是因为如果传className=""，小程序端会报错
			default: ''
		},
		// 字体大小
		fontSize: {
			type: [String, Number],
			default: 28
		},
		// 单个tab的左或有内边距（左右相同）
		paddingItem: {
			type: [String, Number],
			default: '0 22rpx'
		},
		// 标签的宽度
		itemWidth: {
			type: [Number, String],
			default: 'auto'
		},
		// 活动tab字体是否加粗
		bold: {
			type: Boolean,
			default: false
		},
		// 滑块的移动过渡时间，单位ms
		duration: {
			type: Number,
			default: 300
		},
		// tabs标签数组
		list: {
			type: Array,
			default: () => []
		},
		// 滑块颜色
		lineColor: {
			type: String,
			default: ''
		},
		// 菜单选择中时的样式
		activeStyle: {
			type: [String, Object],
			default: () => ({}),
		},
		// 菜单非选中时的样式
		inactiveStyle: {
			type: [String, Object],
			default: () => ({}),
		},
		// 滑块高度
		lineHeight: {
			type: [String, Number],
			default: 4
		},
		// 菜单item的样式
		itemStyle: {
			type: [String, Object],
			default:  () => ({ height: '80rpx' }), // tab栏的高度默认88rpx
		},
		closeScroll: {
			// 值为true时：这时强行关闭scorll，这时tab不能划动，并且开启flex布局，这时所有元素都居中显示
			type: Boolean,
			default: false
		},
		alwaysScroll: {
			// 值为true时：如果最后一个元素的左边框在容器框内,但又想所有元素居左显示，这时所有元素都居左显示
			type: Boolean,
			default: false
		},
		// 当前选中标签的索引
		current: {
			type: [Number, String],
			default: 0
		},
		// 默认读取的键名
		keyName: {
			type: String,
			default:''
		},
		fixed: {
			type: Boolean,
			default: false
		},
		fixedParams: {
			type: Object,
			default: () => {
				return {} //{top: top} tab栏往下移动的距离
			}
		},
		zIndex: {
			// 层级
			type: [Number, String],
			default: 998
		},
		// 导航栏的背景颜色
		bgColor: {
			type: String,
			default: '#ffffff'
		},
		
		// 下面是新增功能——2022.04.24
		// 底部滑块的自定义样式
		barStyle: {
			type: Object,
			default() {
				return {};
			}
		},
		// 移动下划线相对于底部的定位，可以是百分比，可以是px或rpx
		lineBottom: {
			type: [String, Number],
			default: '8rpx'
		},
		// 是否显示底部的下划线
		lineShow: {
			type: Boolean,
			default: true
		},
		lineScale: {
			// lineScale = 0.8 下划线占文字的宽度缩放比例
			type: [Number, String],
			default: 0.8
		},
		pills: {
			type: Boolean,
			deafult: false
		},
		pillsInactive: {
			type: Boolean,
			deafult: false
		},
		pillsScale: {
			// pillsScale = 1.1 胶囊占文字的宽度和高度缩放比例
			type: Number,
			default: 1.4
		},
		pillsBr: {
			type: String,
			default: '100rpx'
		},
		pillsPaddingX: {
			// 如果pillsScale满足不了现实要求时，用来微调增加 胶囊 的宽度,单位rpx
			type: [Number, String],
			default: 5
		},
		pillsPaddingY: {
			// 如果pillsScale满足不了现实要求时，用来微调增加 胶囊 的bottom定位,单位rpx
			type: [Number, String],
			default: 10
		},
		shadow: {
			type: Boolean,
			deafult: false
		},
	},
	data() {
		return {
			firstTime: true,
			scrollLeft: 0,
			scrollViewWidth: 0,
			lineOffsetLeft: 0,
			scrollPillsLeft: 0, // 移动bar需要通过translateX()移动的距离
			tabsRect: {
				left: 0
			},
			innerCurrent: 0,
			moving: false,
			scroll: false, //true：可滑动(这时是非flex布局)，这时元素靠左，false：不可滑动，这时元素居中(这时是flex布局)
			hasGetScroll:false,//进入该组件只判断一次scroll值是否为true，判断完后，每次点击tab都不再判断scroll值

			currentWidth: 0, // 当前选项的宽度
			currentHeight: 0, // 记录文字的高度
			lineWidth: 0 ,// 菜单底部移动的下划线的宽度，单位rpx
			windowWidth:375,
		};
	},
	watch: {
		current: {
			immediate: true,
			handler(newValue, oldValue) {
				// 内外部值不相等时，才尝试移动滑块
				if (newValue !== this.innerCurrent) {
					this.innerCurrent = newValue;
					this.$nextTick(() => {
						this.resize();
					});
				}
			}
		},
		// list变化时，重新渲染list各项信息
		list() {
			this.$nextTick(() => {
				this.resize();
			});
		}
	},
	computed: {
		listTemp(){
			let list = []
			if (this.list&&this.list.length) {
				// 如果list里的元素是有键名keyName的对象
				if (uni.$u.test.object(this.list[0])) {
					list = this.list
				// 如果list里的元素是无键名keyName的string
				}else{
					list = this.list.map(item=>{ return {'name':item} })
				}
			}
			return list
		},
		propsBadge() {
			return badgeJs;
		},
		// tab的样式
		tabItemStyle() {
			return index => {
				let style = {
					'line-height': this.itemStyle.lineHeight?this.itemStyle.lineHeight:this.itemStyle.height,
					'font-size': this.fontSize + 'rpx',
					'transition-duration': `${this.duration}s`,
					padding: this.$stringUtils.addUnit(this.paddingItem,'px'),
					flex: this.scroll ? 'auto' : '1',
					width: this.$stringUtils.addUnit(this.itemWidth,'px'),
					justifyContent: !this.scroll ? 'center' : ''
				};
				// 字体加粗
				if (index == this.innerCurrent && this.bold) style.fontWeight = 'bold';
				// itemStyle:tab item的样式(包含选中和非选中)
				style = uni.$u.deepMerge(style, this.$stringUtils.addStyle(this.itemStyle));
				return style;
			};
		},
		textStyle() {
			return index => {
				let style = {};
				// 给选中的tab item添加外部自定义的样式
				if (index == this.innerCurrent) {
					// 字体加粗
					if (this.bold) style.fontWeight = 'bold';
					style.color = this.themes.color;
					style = uni.$u.deepMerge(style, this.$stringUtils.addStyle(this.activeStyle));
					if (this.pills&&!this.firstTime) style.color = '#ffffff' //这个要放在style赋值后
				} else {
					style = uni.$u.deepMerge(style,this.$stringUtils.addStyle(this.inactiveStyle));
				}
				if (this.listTemp[index].disabled) {
					style.color = '#c8c9cc';
				}
				return style;
			};
		},
		
		// 移动下划线的样式(有过渡效果)
		tabLineStyle() {
			// #ifdef APP-NVUE
			const style = {
				width:  this.$stringUtils.addUnit(this.lineWidth,'px'),
				height: this.$stringUtils.addUnit(this.lineHeight,'px'),
				'background-color': this.lineColor ? this.lineColor : this.themes.color,
				// 设置一个很大的值，它会自动取能用的最大值，不用高度的一半，是因为高度可能是单数，会有小数出现
				bottom: this.$stringUtils.addUnit(this.lineBottom,'px')
			};
			// #endif
			// #ifndef APP-NVUE
			const style = {
				width:  this.$stringUtils.addUnit(this.lineWidth,'px'),
				height: this.$stringUtils.addUnit(this.lineHeight,'px'),
				transform: `translate(${this.lineOffsetLeft}px)`,
				// 滑块在页面渲染后第一次滑动时，无需动画效果
				transitionDuration: `${this.firstTime ? 0 : this.duration}ms`,
				'background-color': this.lineColor ? this.lineColor : this.themes.color,
				// 设置一个很大的值，它会自动取能用的最大值，不用高度的一半，是因为高度可能是单数，会有小数出现
				bottom: this.$stringUtils.addUnit(this.lineBottom,'px')
			};
			// #endif
			Object.assign(style, this.barStyle);
			return style;
		},
		// 移动胶囊的样式
		tabPillsStyle() {
			const style = {
				width: this.$stringUtils.addUnit((this.lineWidth/this.lineScale) * this.pillsScale + this.pillsPaddingX*2,'px'),
				height: Math.round((this.fontSize + this.pillsPaddingY) * this.pillsScale) + 'rpx',
				transform: `translate(${this.scrollPillsLeft - this.pillsPaddingX}px, 50%)`,
				// 滑块在页面渲染后第一次滑动时，无需动画效果
				transitionDuration: `${this.firstTime ? 0 : this.duration}ms`,
				'background-color': this.lineColor ? this.lineColor : this.themes.color,
				// 设置一个很大的值，它会自动取能用的最大值，不用高度的一半，是因为高度可能是单数，会有小数出现
				'border-radius': this.$stringUtils.addUnit(this.pillsBr,'px'),
				bottom: '50%' //这里的+2是微调让上下居中
			};
			Object.assign(style, this.barStyle);
			return style;
		},
	},
	created() {
	    // 组件当中，只有created声明周期，为了能在组件使用，故也在created中将方法挂载到$u
	    this.$u.getRect = this.$uGetRect
	},
	async mounted() {
		if (this.alwaysScroll) {
			this.scroll = true;//这句是后来新加的。这个是为了解决当开启alwaysScroll时，下面resize()由于加了sleep()，会导致页面先启用flex布局，在500毫秒后才变回非flex布局，这时底部滑块会位置错误(这时位置会停留在flex布局元素的位置)
		}
		// #ifdef APP-PLUS
		setTimeout(()=>{//加setTimeout是因为app端要加
			this.init();
		},10)
		// #endif
		// #ifndef APP-PLUS
		this.init();
		// #endif
		// 此处为屏幕宽度
		this.windowWidth = uni.$u.sys().windowWidth;
	},
	methods: {
		setLineLeft() {
			const tabItem = this.listTemp[this.innerCurrent];
			if (!tabItem) {
				return;
			}
			// 获取滑块该移动的位置
			let lineOffsetLeft = this.listTemp.slice(0, this.innerCurrent).reduce((total, curr) => total + curr.rect.width, 0);
			// 获取下划线的数值px表示法
			const lineWidth = this.$stringUtils.getPx(this.lineWidth);
			this.lineOffsetLeft = lineOffsetLeft + (tabItem.rect.width - lineWidth) / 2;
			let pillWidth = (this.lineWidth/this.lineScale) * this.pillsScale //胶囊的宽度
			this.scrollPillsLeft = lineOffsetLeft + (tabItem.rect.width - pillWidth) / 2;
			// #ifdef APP-NVUE
			// 第一次移动滑块，无需过渡时间
			this.animation(this.lineOffsetLeft, this.firstTime ? 0 : parseInt(this.duration));
			// #endif

			// 如果是第一次执行此方法，让滑块在初始化时，瞬间滑动到第一个tab item的中间
			// 这里需要一个定时器，因为在非nvue下，是直接通过style绑定过渡时间，需要等其过渡完成后，再设置为false(非第一次移动滑块)
			if (this.firstTime) {
				setTimeout(() => {
					this.firstTime = false;
				}, 10);
			}
		},
		// nvue下设置滑块的位置
		animation(x, duration = 0) {
			// #ifdef APP-NVUE
			const ref = this.$refs['u-tabs__wrapper__nav__line'];
			animation.transition(ref, {
				styles: {
					transform: `translateX(${x}px)`
				},
				duration
			});
			// #endif
		},
		// 点击某一个标签
		clickHandler(item, index) {
			// 因为标签可能为disabled状态，所以click是一定会发出的，但是change事件是需要可用的状态才发出
			this.$emit('click', {
				...item,
				index
			});
			// 如果disabled状态，返回
			if (item.disabled) return;
			this.innerCurrent = index;
			this.resize();
			this.$emit('change', {
				...item,
				index
			});
		},
		init() {
			this.$stringUtils.sleep().then(() => {
				this.resize();
			});
		},
		setScrollLeft() {
			// 当前活动tab的布局信息，有tab菜单的width和left(为元素左边界到父元素左边界的距离)等信息
			const tabRect = this.listTemp[this.innerCurrent];
			// 累加得到当前item到左边的距离
			const offsetLeft = this.listTemp.slice(0, this.innerCurrent).reduce((total, curr) => {
				return total + curr.rect.width;
			}, 0);
			// 将活动的tabs-item移动到屏幕正中间，实际上是对scroll-view的移动
			let scrollLeft = offsetLeft - (this.tabsRect.width - tabRect.rect.width) / 2 - (this.windowWidth - this.tabsRect.right) / 2 + this.tabsRect.left / 2;
			// 这里做一个限制，限制scrollLeft的最大值为整个scroll-view宽度减去tabs组件的宽度
			scrollLeft = Math.min(scrollLeft, this.scrollViewWidth - this.tabsRect.width);
			this.scrollLeft = Math.max(0, scrollLeft);
		},
		// 获取所有标签的尺寸
		resize() {
			// 如果不存在list，则不处理
			if (this.listTemp.length === 0) {
				return;
			}
			Promise.all([this.getTabsRect(), this.getAllItemRect(), this.getAllItemTextRect()]).then(([tabsRect, itemRect = [], itemCurTextRect = {}]) => {
				if (itemCurTextRect.width) {
					this.lineWidth = itemCurTextRect.width * this.lineScale;
				}

				// start 判断是否开启scroll
				if (!this.hasGetScroll) {
					const lastItemRect = itemRect[itemRect.length - 1];
					if (tabsRect && lastItemRect && lastItemRect.right - 1 > tabsRect.right) {
						// 如果最后一个元素的左边框超出容器框，则采用滚动模式
						if (this.closeScroll) {
							// 如果关闭了scroll，则scroll永远都是false
							this.scroll = false;
						} else {
							this.scroll = true;
						}
					} else if (this.alwaysScroll) {
						// 如果最后一个元素的左边框在容器框内,但又想所有元素居左显示
						this.scroll = true;
					} else {
						// 如果最后一个元素的左边框在容器框内，则关闭滚动，采用flex模式(元素居中)
						this.scroll = false;
					}
					this.$stringUtils.sleep(100).then(() => {
						this.hasGetScroll = true //下次点击tab时，不再判断scroll是否为true
					})
				}

				// end 判断是否开启scroll

				this.tabsRect = tabsRect;
				this.scrollViewWidth = 0;
				itemRect.map((item, index) => {
					// 计算scroll-view的宽度，这里
					this.scrollViewWidth += item.width;
					// 另外计算每一个item的中心点X轴坐标
					this.listTemp[index].rect = item;
				});
				// 获取了tabs的尺寸之后，设置滑块的位置
				this.setLineLeft();
				this.setScrollLeft();
			});
		},
		// 获取导航菜单的尺寸
		getTabsRect() {
			return new Promise(resolve => {
				this.queryRect('u-tabs__wrapper__scroll-view').then(size => resolve(size));
			});
		},

		// 获取所有标签的尺寸
		getAllItemRect() {
			return new Promise(resolve => {
				const promiseAllArr = this.listTemp.map((item, index) => this.queryRect(`u-tabs__wrapper__nav__item-${index}`, true));
				Promise.all(promiseAllArr).then(sizes => resolve(sizes));
			});
		},
		// 获取所有标签的文字尺寸(用来算划动条的长度)
		getAllItemTextRect() {
			return new Promise(resolve => {
				this.queryRect(`u-tabs__wrapper__nav__item__text-${this.innerCurrent}`).then(size => resolve(size));
			});
		},
		// 获取各个标签的尺寸
		queryRect(el, item) {
			// #ifndef APP-NVUE
			// $uGetRect为uView自带的节点查询简化方法，详见文档介绍：https://www.uviewui.com/js/getRect.html
			// 组件内部一般用this.$uGetRect，对外的为uni.$u.getRect，二者功能一致，名称不同
			return new Promise(resolve => {
				this.$uGetRect(`.${el}`).then(size => {
					resolve(size);
				});
			});
			// #endif

			// #ifdef APP-NVUE
			// nvue下，使用dom模块查询元素高度
			// 返回一个promise，让调用此方法的主体能使用then回调
			return new Promise(resolve => {
				dom.getComponentRect(item ? this.$refs[el][0] : this.$refs[el], res => {
					resolve(res.size);
				});
			});
			// #endif
		}
	}
};
</script>

<style lang="scss" scoped>
// 通过scss的mixin功能，把原来需要写4行的css，变成一行
// 目的是保持代码干净整洁，不至于在nvue下，到处都要写display:flex的条件编译
@mixin flex($direction: row) {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: $direction;
}

/* #ifndef APP-NVUE */
// 由于uView是基于nvue环境进行开发的，此环境中普通元素默认为flex-direction: column;
// 所以在非nvue中，需要对元素进行重置为flex-direction: column; 否则可能会表现异常
view,
scroll-view,
swiper-item {
	display: flex;
	flex-direction: column;
	flex-shrink: 0;
	flex-grow: 0;
	flex-basis: auto;
	align-items: stretch;
	align-content: flex-start;
}
/* #endif */
//::v-deep .uni-scroll-view-content {
//    width: 100vw;
//}

.u-tabs {
	&__wrapper {
		@include flex;
		align-items: center;

		&__scroll-view-wrapper {
			flex: 1;
			/* #ifndef APP-NVUE */
			overflow: auto hidden;
			/* #endif */
		}

		&__scroll-view {
			@include flex;
			flex: 1;
		}

		&__nav {
			@include flex;
			position: relative;

			&__item {
				@include flex;
				align-items: center;
				justify-content: center;
				color: $u-content-color;
				&--disabled {
					/* #ifndef APP-NVUE */
					cursor: not-allowed;
					/* #endif */
				}

				&__text {
					// font-size: 15px;
					&--disabled {
						color: #c8c9cc !important;
					}
				}
			}

			&__line {
				height: 3px;
				background-color: #3c9cff;
				// width: 30px;
				position: absolute;
				// bottom: 2px;
				border-radius: 100px;
				transition-property: transform;
				transition-duration: 300ms;
			}
		}
	}
}
</style>
