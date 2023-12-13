<!-- 
*	弹出框（带三角形）
*	注意：它的父级不能有transform，不然下面的position-fixed定位会出问题
 -->
<template>
	<view :class="['position-relative d-inline-block', className]">
		<!-- 按钮(作用：点击该view层后会弹出弹框) -->
		<view @click.stop="change">
			<slot><text class="iconfont icon-caidan1 text-999" style="font-size: 46rpx;"></text></slot>
		</view>
		<!-- 弹框的内容 -->
		<template v-show="open">
			<template v-if="!disabled">
				<view class="position-absolute text-left" :class="[{ 'transition-all05': showTransition }]" style="z-index: 10000;width: max-content;" :style="[$slots.content?contentStyle:'']">
					<!-- 弹框内容 -->
					<view :style="{ color: bgColor && color == '#333333' ? '#fff' : bgColor == '#ffffff' ? '#333333' : color }" :class="{'bg-fff rounded-10':boxShadow}"><slot name="content"></slot></view>
					<!-- 空心三角形 -->
					<view class="position-absolute w-20r h-20r zindex-2 bg-white" :style="[triangleHollowStyle]" v-if="!bgColor&&$slots.content"></view>
					<!-- 实心三角形 -->
					<view class="position-absolute w-0 h-0" :style="[triangleStyle]" v-if="bgColor&&$slots.content"></view>
				</view>
				<!-- 遮罩层：这里的h-100vh w-100vw，是为了解决当该插件放在ls-header(这时父级元素只有88rpx高)时遮罩层只有父级元素这么大时的问题 -->
				<view
					class="position-fixed top-0 bottom-0 left-0 right-0 h-100vh w-100vw"
					:style="{ 'z-index': zIndex, backgroundColor: maskBg, opacity: opacityMask, transform: `scale(${scaleMask})`, transition: `all ${transitionMask}s ease-in-out 0s` }"
					@click.stop="change"
					v-if="$slots.content"
				></view>
			</template>
		</template>
	</view>
</template>

<script>
export default {
	name: 'LsPopover',
	// #ifdef MP-WEIXIN
	// 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性。这时在<组件name> 里加style和class是不会生效的
	options: { virtualHost: true },
	// #endif
	props: {
		className:{
			type: [String, Array,Boolean],// 这里加个Boolean，是因为如果传className=""，小程序端会报错
			default: ''
		},
		// 位置，默认值bottom，可选值：上：top，下：bottom， 左：left，右：right
		position: {
			type: [String],
			default: 'bottom'
		},
		// content弹框相对位置，默认值center，可选值：弹框中间：center，弹框靠左：start(此时三角形在content弹框右边)， 弹框靠右：end(此时三角形在content弹框左边)
		opPosition: {
			type: [String],
			default: 'center'
		},
		// 背景色,不传值默认为白色,切记不能传白色的值
		bgColor: {
			type: [String],
			default: ''
		},
		// 阴影,目前阴影不跟边框共存,二选一
		boxShadow: {
			type: [String],
			default: ''
		},
		// 文字颜色
		color: {
			type: [String],
			default: '#333333'
		},
		// 调节content的内联css样式，注意：它是一个对象，且会覆盖下面的contentStyle
		conStyle: {
			type: Object,
			default: () => {
				return {};
			}
		},
		// 权重
		zIndex: {
			type: [String, Number],
			default: '999'
		},
		// content 弹框的border线颜色
		conBorderColor: {
			type: [String],
			default: '#ccc'
		},
		// 调节三角形(实心或空心)的内联css样式，注意：它是一个对象，且会覆盖下面的contentStyle
		triStyle: {
			type: Object,
			default: () => {
				return {};
			}
		},
		// 调节content的左右(上下)位移，例子：transform="-93"
		transform: {
			type: [String],
			default: ''
		},
		// 调节content的transform动画时的起点位置，例子：transformOrigin="93"
		transformOrigin: {
			type: [String],
			default: ''
		},
		// 调节三角形的左右(上下)位置，例子：triPosition="93"
		triPosition: {
			type: [String],
			default: ''
		},
		// 遮罩层背景颜色(默认为透明)，例子：maskBg="rgba(0, 0, 0, 0.6)"
		maskBg: {
			type: [String],
			default: 'transparent'
		},
		// 整个弹框距离【按钮 16 rpx (16是默认值)
		remove: {
			type: [String, Number],
			default: -16
		},
		disabled: {
			type: [Boolean],
			default: false
		}
	},

	data() {
		return {
			open: false,
			showTransition: false, // 由于小程序上刚进页面时，会自动有一个缩小的动画，为了解决这bug，所以要等点击change后才实现transition-all05

			scaleMask: 0, // 用来控制遮罩层，让未打开前，是scale=0,打开后scale=1，开启动画后scale=1.2
			transitionMask: 0, // 用来控制遮罩层的动画时间(为了防止闪一下)，让未打开前，是0,打开后未读完setTimeout前是0，读完setTimeout后scale=0.25
			opacityMask: 0 // 用来控制遮罩层的透明度，让未打开前，是0,打开后未开启动画前是0，开启动画后是1
		};
	},
	computed: {
		// 弹框内容的样式
		contentStyle() {
			let style = '';
			let transform = 0;
			let transformOrigin = 50;
			const backgroundColor = this.bgColor || '#ffffff';
			const borderWidth = this.bgColor ? 0 : 2;
			// 如果是上下模式
			if (this.position == 'top' || this.position == 'bottom') {
				transform = this.transform || (this.opPosition == 'start' ? -80 : this.opPosition == 'end' ? -20 : -50);
				transformOrigin = this.transformOrigin || (this.opPosition == 'start' ? 80 : this.opPosition == 'end' ? 20 : 50);
				// 如果是左右模式
			} else {
				transform = this.transform || (this.opPosition == 'start' ? 80 : this.opPosition == 'end' ? 20 : 50);
				transformOrigin = this.transformOrigin || (this.opPosition == 'start' ? 20 : this.opPosition == 'end' ? 80 : 50);
			}
			if (this.position == 'top') {
				style = {
					top: `${this.remove}rpx`,
					left: `50%`,
					transform: `translate(${transform}%, -100%) scale(${!this.open ? 0 : 1})`,
					transformOrigin: `${transformOrigin}% 110% 0`,
					backgroundColor: `${backgroundColor}`,
					border: `${borderWidth}rpx solid ${this.conBorderColor}`
				};
			}
			if (this.position == 'bottom') {
				style = {
					bottom: `${this.remove}rpx`,
					left: `50%`,
					transform: `translate(${transform}%, 100%) scale(${!this.open ? 0 : 1})`,
					transformOrigin: `${transformOrigin}% -10% 0`,
					backgroundColor: `${backgroundColor}`,
					border: `${borderWidth}rpx solid ${this.conBorderColor}`
				};
			}
			if (this.position == 'left') {
				style = {
					left: `${this.remove}rpx`,
					bottom: `50%`,
					transform: `translate(-100%, ${transform}%) scale(${!this.open ? 0 : 1})`,
					transformOrigin: `110% ${transformOrigin}% 0`,
					backgroundColor: `${backgroundColor}`,
					border: `${borderWidth}rpx solid ${this.conBorderColor}`
				};
			}
			if (this.position == 'right') {
				style = {
					right: `${this.remove}rpx`,
					bottom: `50%`,
					transform: `translate(100%, ${transform}%) scale(${!this.open ? 0 : 1})`,
					transformOrigin: `-10% ${transformOrigin}% 0`,
					backgroundColor: `${backgroundColor}`,
					border: `${borderWidth}rpx solid ${this.conBorderColor}`
				};
			}
			style['borderRadius'] = `10rpx`; // 统一加圆角
			if(this.boxShadow){
				style['border'] = 'none';
				style['boxShadow'] = this.boxShadow;
			}
			style = this.$u.deepMerge(style, this.conStyle);
			return style;
		},
		// 空心三角形的样式
		triangleHollowStyle() {
			let style = '';
			const leftOrBottom = this.triPosition || (this.opPosition == 'start' ? 80 : this.opPosition == 'end' ? 20 : 50);
			if (this.position == 'top') {
				style = {
					bottom: `-12rpx`,
					left: `${leftOrBottom}%`,
					borderTop: `2rpx solid ${this.conBorderColor}`,
					borderRight: `2rpx solid ${this.conBorderColor}`,
					transform: `translateX(-50%) rotate(135deg)`
				};
			}
			if (this.position == 'bottom') {
				style = {
					top: `-12rpx`,
					left: `${leftOrBottom}%`,
					borderBottom: `2rpx solid ${this.conBorderColor}`,
					borderLeft: `2rpx solid ${this.conBorderColor}`,
					transform: `translateX(-50%) rotate(135deg)`
				};
			}
			if (this.position == 'left') {
				style = {
					right: `-12rpx`,
					bottom: `${leftOrBottom}%`,
					borderTop: `2rpx solid ${this.conBorderColor}`,
					borderLeft: `2rpx solid ${this.conBorderColor}`,
					transform: `translateY(50%) rotate(135deg)`
				};
			}
			if (this.position == 'right') {
				style = {
					left: `-12rpx`,
					bottom: `${leftOrBottom}%`,
					borderBottom: `2rpx solid ${this.conBorderColor}`,
					borderRight: `2rpx solid ${this.conBorderColor}`,
					transform: `translateY(50%) rotate(135deg)`
				};
			}
			if(this.boxShadow){
				style['border'] = 'none';
				style['zIndex'] = '-1 !important'
				style['boxShadow'] = this.boxShadow;
			}
			style = this.$u.deepMerge(style, this.triStyle);
			return style;
		},
		// 实心三角形的样式
		triangleStyle() {
			let style = '';
			const size = 15; // 实心三角的边长(单位rpx)
			const borderColor = this.bgColor || '#ffffff';
			const transform = -50;
			let leftOrTop = 50;
			// 如果是上下模式
			if (this.position == 'top' || this.position == 'bottom') {
				leftOrTop = this.triPosition || (this.opPosition == 'start' ? 80 : this.opPosition == 'end' ? 20 : 50);
				// 如果是左右模式
			} else {
				leftOrTop = this.triPosition || (this.opPosition == 'start' ? 20 : this.opPosition == 'end' ? 80 : 50);
			}
			if (this.position == 'top') {
				style = {
					bottom: `-${size}rpx`,
					left: `${leftOrTop}%`,
					borderRight: `${size}rpx solid transparent`,
					borderLeft: `${size}rpx solid transparent`,
					borderTop: `${size}rpx solid ${borderColor}`,
					transform: `translateX(${transform}%)`
				};
			}
			if (this.position == 'bottom') {
				style = {
					top: `-${size}rpx`,
					left: `${leftOrTop}%`,
					borderRight: `${size}rpx solid transparent`,
					borderLeft: `${size}rpx solid transparent`,
					borderBottom: `${size}rpx solid ${borderColor}`,
					transform: `translateX(${transform}%)`
				};
			}
			if (this.position == 'left') {
				style = {
					top: `${leftOrTop}%`,
					right: `-${size}rpx`,
					borderTop: `${size}rpx solid transparent`,
					borderBottom: `${size}rpx solid transparent`,
					borderLeft: `${size}rpx solid ${borderColor}`,
					transform: `translateY(${transform}%)`
				};
			}
			if (this.position == 'right') {
				style = {
					top: `${leftOrTop}%`,
					left: `-${size}rpx`,
					borderTop: `${size}rpx solid transparent`,
					borderBottom: `${size}rpx solid transparent`,
					borderRight: `${size}rpx solid ${borderColor}`,
					transform: `translateY(${transform}%)`
				};
			}
			style = this.$u.deepMerge(style, this.triStyle);
			return style;
		}
	},

	watch: {
		open(val) {
			let timer = null;
			if (val) {
				// 打开瞬间
				this.scaleMask = 1;
				this.transitionMask = 0;
				this.opacityMask = 0;
				if(timer) {
					clearTimeout(timer);
				}
				// 然后开启动画过渡
				timer = setTimeout(() => {
					this.scaleMask = 1.2;
					this.transitionMask = 0.25;
					this.opacityMask = 1;
					clearTimeout(timer);
				}, 25);
			} else {
				// 关闭的瞬间
				this.scaleMask = 1;
				this.transitionMask = 0.25;
				this.opacityMask = 0;
				if(timer) {
					clearTimeout(timer)
				}
				// 最后关闭动画过渡
				timer = setTimeout(() => {
					this.scaleMask = 0;
					this.transitionMask = 0;
					this.opacityMask = 0;
					clearTimeout(timer);
				}, 25);
			}
		}
	},

	created() {},

	onReady() {
		// console.log('备注：只有‘小程序’才走onReady');
	},

	mounted() {},
	
	methods: {
		change() {
			this.open = !this.open;
			this.showTransition = true;
			this.$emit('change', this.open);
		},
		changeFalse() {
			this.open = false;
			this.$emit('change', this.open);
		}

		// open() {
		// 	this.change('visibleSync', 'showDrawer', true);
		// },
		// close() {
		// 	// 标记关闭是内部发生的，否则修改了value值，导致watch中对value检测，导致再执行一遍close
		// 	// 造成@close事件触发两次
		// 	this.closeFromInner = true;
		// 	this.change('showDrawer', 'visibleSync', false);
		// },
		// // 此处的原理是，关闭时先通过动画隐藏弹窗和遮罩，再移除整个组件
		// // 打开时，先渲染组件，延时一定时间再让遮罩和弹窗的动画起作用
		// change(param1, param2, status) {
		// 	// 如果this.popup为false，意味着为picker，actionsheet等组件调用了popup组件
		// 	if (this.popup == true) {
		// 		this.$emit('input', status);
		// 	}
		// 	this[param1] = status;
		// 	if(status) {
		// 		// #ifdef H5 || MP
		// 		this.timer = setTimeout(() => {
		// 			this[param2] = status;
		// 			this.$emit(status ? 'open' : 'close');
		// 		}, 50);
		// 		// #endif
		// 		// #ifndef H5 || MP
		// 		this.$nextTick(() => {
		// 			this[param2] = status;
		// 			this.$emit(status ? 'open' : 'close');
		// 		})
		// 		// #endif
		// 	} else {
		// 		this.timer = setTimeout(() => {
		// 			this[param2] = status;
		// 			this.$emit(status ? 'open' : 'close');
		// 		}, this.duration);
		// 	}
		// }
	}
};
</script>

<style lang="scss" scoped></style>
