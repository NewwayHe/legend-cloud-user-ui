<!-- 
注意：如果type==2(带星星)时，建议用以下两种例子(size建议120或140，size和space是配合一起用的，建议不要改，直接用例子里的，控制旋转角度的rotate和控制左右的top、rigth可以随便改动)：
	<ls-signet top="-30" right="-15" type="2" size="140" space="25" rotate="-25" borderWidth="5">{{refundStatusFilter(order)}}</ls-signet>
	<ls-signet top="-30" right="-15" type="2" size="120" space="20" rotate="-25" borderWidth="5">{{refundStatusFilter(order)}}</ls-signet>
 -->
<template>
	<view
		:class="[className]"
		class="rounded-circle position-absolute flex-col-center"
		:style="{
			'--borderwidth':borderWidth/2+'px',
			'--color': color,
			width: `${size}rpx`,
			height: `${size}rpx`,
			color: color,
			border: `${type==2?borderWidth*1.5:borderWidth}rpx solid ${color}`,
			transform: `rotate(${rotate}deg) scale(${scale})`,
			opacity: opacity,
			bottom: String(bottom)&&!top?`${bottom}rpx`:'',
			top: top?`${top}rpx`:'',
			left: String(left)&&!right ? `${left}rpx` : '',
			right: right ? `${right}rpx` : '',
		}"
	>
		<view
			class="rounded-circle flex-col-center overflow-h position-relative"
			:style="{
				width: `${size - space}rpx`,
				height: `${size - space}rpx`,
				border: `${borderWidth}rpx solid ${color}`
			}"
		>
			<template v-if="type==2">
				<view class="position-absolute" style="top: 0;" :style="{transform: `scale(${size/140*0.5})`}">
					<text class="iconfont icon-shixin position-absolute" style="font-size: 20rpx;transform: rotate(35deg);left: -70rpx;top: 30rpx;"></text>
					<text class="iconfont icon-shixin position-absolute" style="font-size: 20rpx;transform: rotate(56deg);left: -30rpx;top: 10rpx;"></text>
					<text class="iconfont icon-shixin position-absolute" style="font-size: 20rpx;transform: rotate(100deg);left: 10rpx;top: 10rpx;"></text>
					<text class="iconfont icon-shixin position-absolute" style="font-size: 20rpx;transform: rotate(-35deg);left: 44rpx;top: 30rpx;"></text>
				</view>
				<view class="position-absolute" :style="{transform: `scale(${size/140*0.5})`,bottom:`${size/140*44}rpx`}">
					<text class="iconfont icon-shixin position-absolute" style="font-size: 20rpx;transform: rotate(35deg);left: -70rpx;top: 30rpx;"></text>
					<text class="iconfont icon-shixin position-absolute" style="font-size: 20rpx;transform: rotate(56deg);left: -30rpx;top: 50rpx;"></text>
					<text class="iconfont icon-shixin position-absolute" style="font-size: 20rpx;transform: rotate(90deg);left: 10rpx;top: 50rpx;"></text>
					<text class="iconfont icon-shixin position-absolute" style="font-size: 20rpx;transform: rotate(-35deg);left: 44rpx;top: 30rpx;"></text>
				</view>
			</template>
			<view
				class="text-nowrap flex-center "
				:class="[type==2?'font-weight rounded-circle type2':'type1']"
				:style="{ 'font-size': `${fontSize}rpx`,width: type==2?`${size - space*3}rpx`:'',height: type==2?`${size - space*3}rpx`:'' }"
			>
				<view class="bg-white">
					<slot></slot>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * 印章
 * @description 该组件是两个圆里加入文字，用来代替@/static/images/receive.png的，其父组件必需要用position-relative来定位
 * @event {Function}
 * @example:
 		<view class="position-absolute right-0 top-0 w-120r h-100r overflow-h" v-if="item.receivedFlag">
			<ls-signet size="150" space="30" fontSize="32" scale=".8" borderWidth="4">已领取</ls-signet>
		</view>
 */
export default {
	name: 'ls-signet',
	// #ifdef MP-WEIXIN
	// 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性。这时在<组件name> 里加style和class是不会生效的
	options: { virtualHost: true },
	// #endif
	props: {
		className:{
			type: [String, Array,Boolean],//这里加个Boolean，是因为如果传className=""，小程序端会报错
			default: ''
		},
		// 印章类型：1：不带星星的，2：带星星的
		type: {
			type: [Number, String],
			default: 1
		},
		// 整个印章的颜色
		color: {
			type: [String],
			default: '#dddddd'
		},
		// 图形大小(单位：rpx),必需要大于30rpx
		size: {
			type: [Number, String],
			default: 120
		},
		// 小圆的大小=(size-space)rpx
		space: {
			type: [Number, String],
			default: 20
		},
		// 旋转角度(单位：deg)
		rotate: {
			type: [Number, String],
			default: 30
		},
		// 缩放
		scale: {
			type: [Number, String],
			default: '1'
		},
		// 透明度
		opacity: {
			type: [Number, String],
			default: 0.8
		},
		// 定位，默认是靠左下方
		bottom: {
			type: [Number, String],
			default: 0
		},
		// 定位
		top: {
			type: [Number, String],
			default: ''
		},
		// 定位
		left: {
			type: [Number, String],
			default: 0
		},
		// 定位
		right: {
			type: [Number, String],
			default: ''
		},
		// 字体大小
		fontSize: {
			type: [Number, String],
			default: 26
		},
		// 线条大小(单位：rpx)
		borderWidth: {
			type: [Number, String],
			default: 2
		}
	},
	data() {
		return {};
	},
	watch: {},
	computed: { },
	mounted() {},
	methods: {},
	beforeDestroy() {}
};
</script>

<style scoped lang="scss">
	.type1{
		border-top: var(--borderwidth) solid var(--color);
		border-bottom: var(--borderwidth) solid var(--color);
		padding: 2rpx 40rpx 2rpx 40rpx;
	}
	.type2{
		border: var(--borderwidth) solid var(--color);
	}
</style>
