<template>
	<!-- 调试的话用view是没问题的，真机的话会出现cmd-circle组件穿透的问题，cover-view不支持阿里图标，所以只能用view放在左边(放在右边会出现cmd-circle穿透的问题)-->
	<!-- #ifndef APP-PLUS -->
	<!-- 延迟显示可解决被canvas遮挡问题 暂时针对H5、小程序，APP的cover-view有很多css写法的限制 -->
	<cover-view class="position-fixed rounded-circle bg-dark font-24 text-center d-flex flex-column j-center zindex-999 a-center" @click="$navigateTo(`/ModuleCenter/coupon/couponList`)" style="bottom: calc(40px + var(--safe-area-inset-bottom)); right: 15px; width: 100rpx; height: 100rpx">
		<cover-image src="../../../static/images/coupon.png" style="width: 32rpx; height: 32rpx;"></cover-image>
	    <cover-view style="color: #fff">我的</cover-view>
	</cover-view>
	<!-- #endif -->
	<!-- #ifdef APP-PLUS -->
	<view class="position-fixed rounded-circle bg-dark font-24 text-center d-flex flex-column j-center zindex-999" @click="$navigateTo(`/ModuleCenter/coupon/couponList`)" style="bottom: calc(40px + var(--safe-area-inset-bottom)); right: 15px; width: 100rpx; height: 100rpx">
		<view class="iconfont icon-coupon text-fff" style="font-size: 28rpx"></view>
		<view style="color: #fff">我的</view>
	</view>
	<!-- #endif -->
</template>

<script>
export default {
	components: { },
	props: {
		
	},
	data() {
		return {};
	},
	computed: {},
	watch: {},
	onLoad() {},
	mounted() {},
	onReachBottom() {},
	methods: {
		
	}
};
</script>
<style scoped>
</style>
