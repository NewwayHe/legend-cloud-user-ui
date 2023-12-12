<template>
	<!-- /*
     * @Descripttion:商品详情楼层：商品咨询
    */ -->
	<view class="px-2 py-3 bg-white font-28" :class="className" :style="{ '--themescolor': themes.color }">
		<view class="" v-if="list&&list.length">
			<view class="flex-start">
				<view class="flex-1 font-32 font-weight">问答</view>
				<view class="text-999" @click="$navigateTo(`/ModuleCenter/consult/consultList?data=${encodeURIComponent(JSON.stringify(data))}`)">查看全部问答</view>
				<text class="iconfont icon-ArrowRight text-999" style="font-size: 20rpx;"></text>
			</view>
			<view class="d-flex a-start mt-2" v-for="(item, index) in list" :key="index">
				<view class="w-40r h-40r text-white bg-warning rounded-5 line-h flex-center font-20 mr-2">问</view>
				<view class="flex-1 overflow-h text-pre-wrap">{{item.content}}</view>
			</view>
		</view>
		<view class="flex-start" v-else>
			<text class="font-32 font-weight mr-2">问答</text>
			<view class="flex-1 text-nowrap overflow-h text-999 mr-2 text-left font-24">暂无提问，快来发起提问吧</view>
			<ls-button
				className="mr-2 py-15r"
				text="我要提问"
				@click="$navigateTo(`/ModuleCenter/consult/consultSubmit?data=${encodeURIComponent(JSON.stringify(data))}`)"
				:options="{ bd: '#e5e5e5', bc: '#ffffff', br: '50',fs:'20', lh: 1, pl: '20', pr: '20' }"
			/>
			<!-- 旧样式，可以删掉 -->
			<!-- <view class="w-200r h-100 position-relative overflow-h" :style="{backgroundColor:themes.rgba01}">
				<text class="iconfont icon-zuji1 position-absolute" style="top: 0rpx;right: 20rpx;font-size: 70rpx;color: green;transform:rotate(36deg);opacity: 0.8;"></text>
				<text class="iconfont icon-zuji1 position-absolute" style="top: 90rpx;right: 70rpx;font-size: 80rpx;color: red;transform:rotate(62deg);opacity: 0.4;"></text>
				<text class="iconfont icon-zuji1 position-absolute" style="top: -10rpx;left: -60rpx;font-size: 160rpx;color: #FFD700;transform:rotate(34deg);opacity: 0.5;"></text>
				<text class="iconfont icon-zuji1 position-absolute" style="top: 50rpx;right: -40rpx;font-size: 110rpx;color: blue;transform:rotate(-130deg);opacity: 0.3;"></text>
			</view>
			<view class="flex-1 text-nowrap overflow-h text-666 mr-2 text-right font-24">暂无提问，快来发起提问吧</view>
			<ls-button
				className="mr-2 py-15r"
				text="我要提问"
				@click="$navigateTo(`/ModuleCenter/consult/consultSubmit?data=${encodeURIComponent(JSON.stringify(data))}`)"
				:options="{ cl: themes.color, bd: themes.color, bc: '#ffffff', br: '50', lh: 1, pl: '20', pr: '20' }"
			/> -->
		</view>

	</view>
</template>
<script>
export default {
	name: 'good-consult',

	components: {},

	props: {
		className: String,
		data: Object,
		list:Array,
	},
	data() {
		return {};
	},

	computed: { },

	watch: {},

	created() {},

	mounted() { },

	beforeDestroy() {},

	destroyed() {},

	methods: {}
};
</script>

<style lang="scss" scoped></style>
