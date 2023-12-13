<template>
	<!-- /*
     * @Descripttion:商品详情：顶部导航栏
    */ -->
	<view class="goods-head">
		<!-- 头部 -->
		<view
			class="header-title"
			:style="{
				'--zindex': zIndex,
				'--themescolor': themes.color,
				'--tabopacity': tabCur == 0 ? tabOpacity : 1,
				'--leftwidth': leftWidth ? leftWidth : 0,
				'--rightwidth': rightWidth ? rightWidth : wxMenuBut.placeholder
			}"
		>
			<!-- 如果是不是微信端，头部菜单按钮放在右边 -->
			<!-- #ifndef MP-WEIXIN -->
			<view class="header-box" :style="{ height: `calc(88rpx + ${stausBarHeight}px)` }">
				<view class="header-left flex-center" :style="{ paddingTop: stausBarHeight + 'px' }">
					<view class="position-absolute" style="left: 10px" @click.stop="goback" v-if="showBack">
						<view class="rounded-circle flex-center" style="width: 60rpx;height: 60rpx;" :style="{ backgroundColor: circularRGBA }">
							<text class="iconfont icon-ArrowLeft" style="font-size: 32rpx;" :style="{ color: tabIconColor }"></text>
						</view>
					</view>
				</view>
				<view class="header-mid" :style="{ paddingTop: stausBarHeight + 'px' }">
					<view class="header-tab" v-if="tabArr && tabArr.length">
						<view class="ser-txt" :class="{ cur: tabIndex == index && tabArr.length != 1 }" v-for="(item, index) in tabArr" :key="index" @click.stop="clickTab(index)">
							<text class="class-text">{{ item }}</text>
						</view>
					</view>
					<view class="tabSelects bg-main" :style="tabSelectStyle"></view>
				</view>
				<view class="header-right flex-end" :style="{ paddingTop: stausBarHeight + 'px', color: tabIconColor }">
					<head-select
						class="mr-2"
						@showHeadSelect="changeHeadSelect"
						@clickHeadSelect="clickHeadSelect"
						:circular="tabIconColor"
						:circularBg="circularRGBA"
						:type="2"
						v-if="showHeadSelect"
					/>
				</view>
			</view>
			<!-- #endif -->

			<!-- 如果是是微信端，头部菜单按钮放在右边 -->
			<!-- #ifdef MP-WEIXIN -->
			<view class="header-box flex-center" :style="{ height: `calc(88rpx + ${stausBarHeight}px)` }">
				<!-- background: themesRGBA 暂时不需要主题颜色 -->
				<view class="flex-end h-100" :style="{ width: wxMenuBut.placeholder + 'px', paddingTop: stausBarHeight + 'px', background: whiteRGBA }">
					<view class="menu-but flex-center" :style="{ width: wxMenuBut.width + 'px', height: wxMenuBut.height + 'px' }">
						<view class="flex-center">
							<view class="flex-center flex-1" style="width: 60rpx;height: 60rpx;" @click.stop="goback" v-if="showBack">
								<text class="iconfont icon-ArrowLeft text-666" style="font-size: 32rpx;"></text>
							</view>
							<view class="flex-center flex-1">
								<head-select
									@showHeadSelect="changeHeadSelect"
									:circular="'#666'"
									:circularBg="'transparent'"
									@clickHeadSelect="clickHeadSelect"
									:type="2"
									v-if="showHeadSelect"
								/>
							</view>
						</view>
					</view>
				</view>
				<view class="header-mid flex-1" :style="{ paddingTop: stausBarHeight + 'px' }">
					<view class="flex-center">
						<view class="header-tab flex-1" v-if="tabArr && tabArr.length">
							<view
								class="ser-txt"
								:class="{ cur: tabIndex == index && tabArr.length != 1 }"
								v-for="(item, index) in tabArr"
								:key="index"
								@click.stop="clickTab(index)"
							>
								<text class="class-text">{{ item }}</text>
							</view>
						</view>
						<view class="tabSelects bg-main" :style="tabSelectStyle"></view>
					</view>
				</view>
			</view>
			<!-- #endif -->

			<slot></slot>
		</view>
		<!-- /头部 -->
	</view>
</template>

<script>
import headSelect from '@/components/ls-app/ls-header/head-select.vue';
import { mapState } from 'vuex';
const CIROPACITY = 0.3; // 设置默认的圆圈的rgba的透明值
export default {
	name: 'GoodHead',
	components: { 'head-select': headSelect },
	props: {
		/**
		 * 是否显示返回
		 */
		showBack: {
			type: Boolean,
			default: true
		},
		/**
		 * 是否头部菜单按钮
		 */
		showHeadSelect: {
			type: Boolean,
			default: true
		},
		scrollTop: {
			// 把滚屏事件的event值传进来,默认值一定是0，如果传值是''空的话，会认为是String报错
			type: [Number, String],
			default: 0
		},
		fixPoint: {
			// 当大于scrollTop值时，触发变量。当该页面内容太少不能触发下拉滚动时，则要传值fixPoint=='none'，下面的代码会判断当fixPoint=='none'时，顶栏不再透明，而是完全显示
			type: [Number, String],
			default: null
		},

		tabArr: Array, // 例如：:tabArr="['商品','详情','评价','推荐']"
		tabCur: {
			// 刷新页面时默认选择第几个tab栏，一般默认第一个时，可以不传该值
			type: [Number, String],
			default: 0
		},
		tabCurWidth: {
			// 选中的tab元素下的下标宽度占字体宽度的百分比，如：tabCurWidth=80，就是选中元素的下标的宽度占字体宽度的80%。(必须是数字且小于100)
			type: Number,
			default: 80
		},

		// #ifndef MP-WEIXIN
		leftWidth: {
			type: Number, // 距离左边多少px(注意：不能改为rpx，不然iphone5上显示不正确)
			default: 80
		},
		rightWidth: {
			type: Number, // 距离右边多少px(注意：不能改为rpx，不然iphone5上显示不正确)
			default: 80
		}
		// #endif
	},
	data() {
		return {
			zIndex: 100, // 解决点击右上角菜单时，由于层级不够，菜单显示在其它层级比100高的view之下的问题
			tabIndex: this.tabCur,
			tabOpacity: 0, // 控制头部背景透明度的变量，默认是0，最大是1
			circularOpacity: CIROPACITY, // 控制头部圆形按钮背景透明度的变量，最大是rgba(0,0,0,.3)，最小是rgba(0,0,0,0)
			tabCurArr: [],
			tabIconColor: '#fff' // 控制头部原型按钮字体颜色，默认为白色，滚动之后变为黑色
		};
	},

	computed: {
		...mapState(['stausBarHeight', 'wxMenuBut']),
		circularRGBA() {
			let flag = `rgba(0,0,0,${this.circularOpacity})`;
			if (this.tabArr && (this.tabArr[this.tabIndex] == '评价' || this.tabArr[this.tabIndex] == '详情')) {
				// 如果当前的tab为详情或评价，则头部圆形按钮背景为全透明
				flag = `rgba(0,0,0,0)`;
			}
			return flag; // 获取系统的主题颜色的grb值，a值自己在当前页面设置
		},
		themesRGBA() {
			return `rgba(${this.themes.rgb.r}, ${this.themes.rgb.g},${this.themes.rgb.b},${this.tabCur == 0 ? this.tabOpacity : 1})`;
		},
		whiteRGBA() {
			return `rgba(255,255,255,${this.tabCur == 0 ? this.tabOpacity : 1})`;
		},
		// 选中效果的样式
		tabSelectStyle() {
			return this.tabCurArr && this.tabCurArr.length
				? `transform:translateX(${this.tabCurArr[this.tabIndex].left + (this.tabCurArr[this.tabIndex].width * (100 - this.tabCurWidth)) / 200}px);width:${(this.tabCurArr[
						this.tabIndex
				  ].width *
						this.tabCurWidth) /
						100}px`
				: '';
		}
	},

	watch: {
		tabArr: {
			handler(newValue, oldValue) {
				if (newValue) {
					this.getTabArr();
				}
			},
			deep: true,
			immediate: true
		},
		scrollTop(newVal, oldVal) {
			const newValue = Number(newVal);
			const fixPoint = Number(this.fixPoint);
			if (this.fixPoint != 'none') {
				// 当该页面内容比较多且能触发下拉滚动时，才触发透明渐变效果
				if (newValue >= fixPoint || this.tabIndex == 1 || this.tabIndex == 2) {
					this.tabOpacity = 1;
					this.circularOpacity = 0;
					this.tabIconColor = '#000';
				} else if (newValue < fixPoint) {
					this.tabOpacity = (newValue / fixPoint).toFixed(2);
					this.circularOpacity = (CIROPACITY - (newValue / fixPoint) * CIROPACITY).toFixed(2);
					this.tabIconColor = '#fff';
				}
			}
		},

		//     fixPoint: {
		//         handler(newVal) {
		//             if (newVal == 'none') {
		//                 // 当该页面内容太少不能触发下拉滚动时，顶栏不再透明，而是完全显示
		//                 this.tabOpacity = 1
		//                 this.circularOpacity = 0
		// 	this.tabIconColor = "#000"
		//             }
		//         },
		//         immediate: true
		//     },

		tabCur: {
			handler(newVal) {
				if (this.tabArr && this.tabArr.length) {
					// 有tab栏时才执行
					if (newVal) {
						this.tabIndex = newVal;
					}
					if (newVal == 0) {
						this.tabIndex = 0;
						this.tabOpacity = 0;
						this.circularOpacity = CIROPACITY.toFixed(2);
						this.tabIconColor = '#fff';
					} else if (newVal == 1 || newVal == 2) {
						this.tabOpacity = 1;
						this.circularOpacity = 0;
						this.tabIconColor = '#000';
					}
				}
			},
			immediate: true
		}
	},

	created() {},

	// #ifdef MP-WEIXIN
	onReady() {
		// console.log('备注：只有‘小程序’才走onReady');
	},
	// #endif

	// #ifndef MP-WEIXIN
	mounted() {
		// console.log('备注：‘H5+app’只走mounted不走onReady');
	},
	// #endif

	destroyed() {},

	methods: {
		getTabArr() {
			this.tabIndex = this.tabCur;
			this.$nextTick(() => {
				setTimeout(() => {
					const query = uni
						.createSelectorQuery()
						.in(this)
						.selectAll('.class-text');
					query.boundingClientRect().exec(ret => {
						if (ret[0]) {
							this.tabCurArr = ret[0];
						}
					});
				}, 100);
			});
		},
		goback() {
			if (!this.$utils.pages.getPageRoute(1)) {
				this.$switchTab(`/pages/index/index`);
			} else {
				uni.navigateBack();
			}
		},
		changeHeadSelect(e) {
			this.zIndex = e ? 9999 : this.zIndex;
		},

		clickHeadSelect() {
			this.$emit('clickHeadBox'); // 告诉页面已经点击了头部下拉菜单里的选项(准备离开该页面),用到beforeRouteLeaver且记录了浏览历史的页面要拿到该参数进行判断将阻止离开页面的条件清空
		},

		clickTab(index) {
			this.tabIndex = index;
			if (this.tabIndex == 0) {
				// 防止点击‘规格参数’后再点击‘商品’后头部不变透明
				// if (this.fixPoint == 'none') {
				//     // 当该页面内容太少不能触发下拉滚动时，顶栏不再透明，而是完全显示
				//     this.tabOpacity = 1
				//     this.circularOpacity = 0
				// } else {
				this.tabOpacity = 0;
				this.circularOpacity = CIROPACITY;
				// }
			} else {
				this.tabOpacity = 1;
				this.circularOpacity = 0;
			}
			this.$emit('tabSelect', this.tabIndex);
		}
	}
};
</script>
<style lang="scss" scoped>
.goods-head {
	/* 解决点击右上角菜单时，由于层级不够，菜单显示在其它层级比100高的view之下的问题 */
	z-index: var(--zindex) !important;

	.header-title {
		width: 100%;
		max-width: 750px;
		position: fixed;
		background: transparent;
		border: 0;
		top: 0;
		width: 100%;
		z-index: var(--zindex) !important;

		.header-box {
			width: 100%;
			// height: 44px;
			position: relative;

			.header-left {
				width: calc(var(--leftwidth) * 1px);
				height: 100%;
				z-index: 2;
				position: absolute;
				left: 0;
				bottom: 0;
			}

			.header-mid {
				// width: 100%;
				height: 88rpx;
				overflow: hidden;
				font-size: 28rpx;
				line-height: 80rpx;
				text-align: center;
				padding: 0px calc(var(--rightwidth) * 1px) 0px calc(var(--leftwidth) * 1px);
				// background: var(--themescolor);
				background: #fff;
				opacity: var(--tabopacity);
				box-sizing: content-box; //解决小程序height与padding重叠的bug

				.header-tab {
					display: flex;
					position: relative;
					box-sizing: content-box;
					overflow-x: auto;
					white-space: nowrap;
					position: relative;

					&::-webkit-scrollbar {
						display: none;
					}

					.ser-txt {
						flex: 1;
						// color: #ffffff;
						color: #000000;
						height: 100%;
						display: inline-block;
						padding: 0 10rpx;

						&.cur {
							font-size: 32rpx;
							font-weight: 600;
							text-shadow: 0 0 2px #ffffff;
						}
					}
				}
				.tabSelects {
					transition: all 0.5s;
					position: absolute;
					bottom: 16rpx;
					z-index: 1000;
					left: 0;
					height: 4rpx;
					border-radius: 4rpx;
					// background-color: #f1f1f1;
				}
			}
			.header-right {
				width: calc(var(--rightwidth) * 2rpx);
				height: 100%;
				z-index: 2;
				position: absolute;
				right: 0rpx;
				bottom: 0;
			}
			.menu-but {
				box-sizing: border-box;
				// height :30px;
				border-radius: 54rpx;
				border: 1px solid rgba(0, 0, 0, 0.25);
				background: hsla(0, 0%, 100%, 0.6);
			}
		}
	}
}
</style>
