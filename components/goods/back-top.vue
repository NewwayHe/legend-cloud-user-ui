<template>
	<!-- /*
     * @Descripttion:商品详情楼层：返回顶部按钮
    */ -->
	<view
		class="flex-center rounded-circle"
		:class="[{ 'button-fixed': buttonFixed }]"
		:style="{ '--fixedbottom': fixedBottom, '--fixedright': fixedRight, '--zindex': zIndex, background: bgColor, height: buttonSize + 'rpx', width: buttonSize + 'rpx' }"
		@click="backTop"
		v-show="scrollShow"
	>
		<view class="iconfont icon-backtop1" :style="{ color: '#fff', fontSize: (buttonSize - 40) + 'rpx' }"></view>
	</view>
</template>

<script>
export default {
	components: {},
	props: {
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
		},
		duration: {
			// scrollTop值大于多少时，才显示图标(如果为0则永久显示)
			type: [Number, String],
			default: 300
		},
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
		// 点击图片回到顶部方法，
		backTop() {
			this.$nextTick(() => {
				// 必需要用$nextTick，不然数据v-show切换后，pageScrollTo会失效
				uni.pageScrollTo({ scrollTop: 0,duration:this.duration });
				this.$emit('scrollViewBack')
			});
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
