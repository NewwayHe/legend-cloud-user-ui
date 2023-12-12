<!--
    * Desc    : 商品筛选栏
-->
<template>
	<view class="w-100 h-80r flex-center font-28 bg-fff border-f8">
		<view
			class="flex-center flex-1"
			:class="[{ 'text-main': value.sortBy == 'multiple' }]"
			@click="sortGood('multiple')"
		>
			<text style="padding-bottom: 6rpx">综合</text>
		</view>
		<view
			class="flex-center flex-1"
			:class="[{ 'text-main': value.sortBy == 'buys' }]"
			@click="sortGood('buys')"
		>
			<text style="padding-bottom: 6rpx">销量</text>
			<view class="ml-1 scale-07 text-ccc">
				<view
					class="iconfont icon-caret-top"
					:class="{ 'text-main': value.sortBy == 'buys' && !value.descending }"
					style="font-size: 20rpx; margin-bottom: -12rpx"
				></view>
				<view class="iconfont icon-caret-bottom" :class="{ 'text-main': value.sortBy == 'buys' && value.descending }" style="font-size: 20rpx"></view>
			</view>
		</view>
		<view
			class="flex-center flex-1"
			:class="[{ 'text-main': value.sortBy == 'price' }]"
			@click="sortGood('price')"
		>
			<text style="padding-bottom: 6rpx">价格</text>
			<view class="ml-1 scale-07 text-ccc">
				<view
					class="iconfont icon-caret-top"
					:class="{ 'text-main': value.sortBy == 'price' && !value.descending }"
					style="font-size: 20rpx; margin-bottom: -12rpx"
				></view>
				<view class="iconfont icon-caret-bottom" :class="{ 'text-main': value.sortBy == 'price' && value.descending }" style="font-size: 20rpx"></view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: '',
	components: {},
	props: {
		value: {
			type: Object,
			default: () => {
				return {};
			}
		},
		categorySet:Object,
	},

	data() {
		return {
			bannerList: [], //轮播图
			currentBanner: 0 //当前banner图的index
		};
	},

	computed: { },

	watch: {},

	created() {},

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
		// 排序
		sortGood(type) {
			if (type == 'price') {
				// 价格
				if (this.value.sortBy != 'price') {
					this.value.descending = true;
				} else {
					this.value.descending = !this.value.descending;
				}
		 	this.value.sortBy = type;
			} else if (type == 'new') {
				// 最新
				this.value.sortBy = type;
				this.value.descending = !this.value.descending;
			} else if (type == 'buys') {
				// 销量
				this.value.sortBy = type;
				this.value.descending = !this.value.descending;
			} else if (type == 'multiple') {
				// 默认综合
				if (this.value.sortBy == type) return;
				else this.value.sortBy = type;
				this.value.descending = false;
			} else {
				if (this.value.sortBy != type) {
					this.value.descending = true;
				} else {
					this.value.descending = !this.value.descending;
				}
				this.value.sortBy = type;
			}
			this.$emit('input',this.value)//小程序要加这个，不然父组件的value不会变化
			this.$nextTick(()=>{
				this.$emit('getData')
			})
		}
	}
};
</script>

<style lang="scss" scoped></style>
