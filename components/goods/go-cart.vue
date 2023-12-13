<!-- 点击购物车图标跳转到购物车页面 -->
<template>
	<view
		class="flex-center rounded-circle"
		:class="[{ 'button-fixed': buttonFixed }]"
		:style="{ '--fixedbottom': fixedBottom, '--fixedright': fixedRight, '--zindex': zIndex, background: bgColor, height: buttonSize + 'rpx', width: buttonSize + 'rpx' }"
		@click="goCart"
		v-show="forceShow || scrollShow"
	>
		<view :class="[type == 1 ? 'icon-gouwuche' : 'icon-gouwuche2']" class="iconfont text-fff" :style="{ fontSize: (buttonSize - 34) + 'rpx' }"></view>
	</view>
</template>

<script>
export default {
	components: {},
	props: {
		type: {
		    // 按钮的样式，1：空心购物车图标, 2：实心购物车图标
		    type: Number,
		    default: 1
		},
		forceShow: {
			// 是否强制显示，不需要滚动来影响显示
			type:Boolean,
			default: false
		},
		bgColor: {
			type: String,
			default: 'var(--themescolor)'
		},
		buttonSize: {
			// 当buttonFixed或shareButton为true时，按钮的大小，单位rpx
			type: [Number, String],
			default: 70
		},
		buttonFixed: {
			// 是否position-fixed
			type: Boolean,
			default: false
		},
		fixedRight: {
			// 当buttonFixed为true时，控制靠右定位，单位rpx
			type: [Number, String],
			default: 10
		},
		fixedBottom: {
			// 当buttonFixed为true时，控制靠下定位，单位rpx
			type: [Number, String],
			default: 60
		},
		zIndex: {
			// 当buttonFixed为true时，控制靠下定位，单位rpx
			type: [Number, String],
			default: 99
		},
		scrollTop: {
			// 把滚屏事件的event值传进来,默认值一定是0，如果传值是''空的话，会认为是String报错
			type: [Number, String],
			default: 0
		},
		showScroll: {
			// scrollTop值大于多少时，才显示图标(如果为0则永久显示)
			type: [Number, String],
			default: 0
		}
	},
	data() {
		return {
			scrollShow: false // 回到顶部图标显示隐藏
		};
	},
	watch: {
		scrollTop(newValue, oldValue) {
			this.scrollShow = newValue >= this.showScroll;
		}
	},
	computed: {},
	created() {},
	methods: {
		// 点击跳转到购物车页面，
		goCart() {
			uni.switchTab({
				url: '/pages/cart/cart'
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.button-fixed {
	position: fixed;
	z-index: var(--zindex);
	right: calc(var(--fixedright) * 1px);
	bottom: calc(var(--fixedbottom) * 1px + var(--safe-area-inset-bottom));
}
</style>
