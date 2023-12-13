<template>
	<view :class="[className]">
		<view class="u-sticky-wrap" :class="[elClass]" :style="{
			height: fixed ? height + 'px' : 'auto',
			backgroundColor: bgColor
		}">
			<view class="u-sticky" :style="{
				position: fixed ? 'fixed' : 'static',
				top: stickyTop + 'px',
				left: left + 'px',
				width: width == 'auto' ? 'auto' : width + 'px',
				zIndex: uZIndex
			}">
				<slot></slot>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * sticky 吸顶
	 * @description 该组件与CSS中position: sticky属性实现的效果一致，当组件达到预设的到顶部距离时， 就会固定在指定位置，组件位置大于预设的顶部距离时，会重新按照正常的布局排列。
	 * @tutorial https://www.uviewui.com/components/sticky.html
	 * @property {String Number} offset-top 吸顶时与顶部的距离，单位rpx（默认0）
	 * @property {String Number} index 自定义标识，用于区分是哪一个组件
	 * @property {Boolean} enable 是否开启吸顶功能（默认true）
	 * @property {String} bg-color 组件背景颜色（默认#ffffff）
	 * @property {String Number} z-index 吸顶时的z-index值（默认970）
	 * @event {Function} fixed 组件吸顶时触发
	 * @event {Function} unfixed 组件取消吸顶时触发
	 * @example <u-sticky offset-top="200"><view>塞下秋来风景异，衡阳雁去无留意</view></u-sticky>
	 */
	import { mapState } from 'vuex';
	export default {
		name: 'USticky',
		// #ifdef MP-WEIXIN
		// 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性。这时在<组件name> 里加style和class是不会生效的
		options: { virtualHost: true },
		// #endif
		props: {
			className:{
				type: [String, Array,Boolean],// 这里加个Boolean，是因为如果传className=""，小程序端会报错
				default: ''
			},
			// 吸顶容器到顶部某个距离的时候，进行吸顶，在H5平台，NavigationBar为44px
			offsetTop: {
				type: [Number, String],
				default: 0
			},
			// 是否总是fixed(这时吸顶没用，因为如果是吸顶的话，会跳一下，影响体验)
			alwaysFixed: {
				type: Boolean,
				default: false
			},
			// 列表中的索引值
			index: {
				type: [Number, String],
				default: ''
			},
			// 是否开启吸顶功能
			enable: {
				type: Boolean,
				default: true
			},
			// 吸顶区域的背景颜色
			bgColor: {
				type: String,
				default: '#ffffff'
			},
			// z-index值
			zIndex: {
				type: [Number, String],
				default: ''
			}
		},
		data() {
			return {
				fixed: false,
				height: 'auto',
				stickyTop: 0,
				elClass: this.$u.guid(),
				left: 0,
				width: 'auto',
			};
		},
		watch: {
			offsetTop(val) {
				this.initObserver();
			},
			enable(val) {
				if (val == false) {
					this.fixed = false;
					this.disconnectObserver('contentObserver');
				} else {
					this.initObserver();
				}
			}
		},
		computed: {
			...mapState(['stausBarHeight']),
			uZIndex() {
				return this.zIndex ? this.zIndex : this.$u.zIndex.sticky;
			}
		},
		mounted() {
			this.initObserver();
		},
		methods: {
			initObserver() {
				if (!this.enable) return;
				// #ifdef H5
				this.stickyTop = this.offsetTop != 0 ? uni.upx2px(this.offsetTop) : 0;
				// #endif
				// #ifndef H5
				this.stickyTop = this.offsetTop != 0 ? uni.upx2px(this.offsetTop) + this.stausBarHeight : this.stausBarHeight;
				// #endif

				this.disconnectObserver('contentObserver');
				this.$uGetRect('.' + this.elClass).then((res) => {
					this.height = res.height;
					this.left = res.left;
					this.width = res.width;
					this.$nextTick(() => {
						this.observeContent();
					});
				});
			},
			observeContent() {
				this.disconnectObserver('contentObserver');
				const contentObserver = this.createIntersectionObserver({
					thresholds: [0.95, 0.98, 1]
				});
				contentObserver.relativeToViewport({
					top: -this.stickyTop
				});
				contentObserver.observe('.' + this.elClass, res => {
					if (!this.enable) return;
					this.setFixed(res.boundingClientRect.top);
				});
				this.contentObserver = contentObserver;
			},
			setFixed(top) {
				if (this.alwaysFixed) {
					this.fixed = true;
				}else{
					const fixed = top < this.stickyTop;
					if (fixed) this.$emit('fixed', this.index);
					else if(this.fixed) this.$emit('unfixed', this.index);
					this.fixed = fixed;
				}
				this.$emit('isFixed',this.fixed)
			},
			disconnectObserver(observerName) {
				const observer = this[observerName];
				observer && observer.disconnect();
			},
		},
		beforeDestroy() {
			this.disconnectObserver('contentObserver');
		}
	};
</script>

<style scoped lang="scss">
	// 定义混入指令，用于在非nvue环境下的flex定义，因为nvue没有display属性，会报错
	@mixin vue-flex($direction: row) {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: $direction;
		/* #endif */
	}
	
	.u-sticky {
		z-index: 9999999999;
	}
</style>
