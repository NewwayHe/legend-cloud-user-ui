<template>
	<!-- /*
     * @Descripttion:(其它组件：标题)：titleTab
    */ -->
	<view
		class="h-88r font-28 p-2"
		:class="[floors.titleType == 1 ? 'flex-start' : 'flex-center']"
		:style="{
			backgroundColor: floors.themeColor ? parmas.themeColor : floors.backgroundColor,
			borderRadius: borderRadius||0,
			margin: `0 ${floors.paddingX?floors.paddingX*2 + 'rpx':'0'}`
		}"
	>
		<view class="flex-1 px-2" v-if="floors.titleType == 3"><view class="h-0 w-100 border-top" :style="{ borderColor: floors.data.title.borderColor }"></view></view>
		<text
			class="d-inline-block mr-1"
			style="width: 8rpx"
			:style="{
				backgroundColor: floors.data.title.themeColor ? parmas.themeColor : floors.data.title.color,
				height: `${floors.data.title.fontSize * 2 + 4}rpx`
			}"
			v-if="floors.showIcon == 'block'"
		></text>
		<image class="mr" style="width: 20px; height: 20px" :src="photoServer + floors.iconImg" alt="" v-if="floors && floors.iconImg && floors.showIcon == 'diy'" />
		<view
			class="letter-sp4"
			:style="{
				fontSize: `${floors.data.title.fontSize * 2}rpx`,
				fontWeight: floors.data.title.fontWeight ? 'bold' : 'unset',
				color: floors.data.title.themeColor ? parmas.themeColor : floors.data.title.color
			}"
		>
			<text>{{ floors.data.title.title }}</text>
		</view>
		<view class="flex-1 px-2" v-if="floors.titleType == 3"><view class="h-0 w-100 border-top" :style="{ borderColor: floors.data.title.borderColor }"></view></view>
		<view
			class="flex-1 px-2 line-clamp1"
			:style="{
				fontSize: `${floors.data.seTitle.fontSize * 2}rpx`,
				fontWeight: floors.data.seTitle.fontWeight ? 'bold' : 'unset',
				color: floors.data.seTitle.themeColor ? parmas.themeColor : floors.data.seTitle.color
			}"
			v-if="floors.titleType == 1"
		>
			<text>{{ floors.data.seTitle.title }}</text>
		</view>
		<view
			:style="{
				fontSize: `${floors.data.more.fontSize * 2}rpx`,
				fontWeight: floors.data.more.fontWeight ? 'bold' : 'unset',
				color: floors.data.more.themeColor ? parmas.themeColor : floors.data.more.color
			}"
			v-if="floors.titleType == 1"
			@click="jumpPage(floors.data.more.url, shopId)"
		>
			<text>{{ floors.data.more.title }}</text>
			<span
				class="iconfont icon-ArrowRight"
				:style="{ fontSize: `${floors.data.more.fontSize * 2}rpx`, fontWeight: floors.data.more.fontWeight ? 'bold' : 'unset' }"
				v-if="floors.data.more.title"
			/>
		</view>

		<!-- 如果是是微信端，放一个胶囊的点位符 -->
		<!-- #ifdef MP -->
		<!-- <view :style="{width: wxMenuBut.placeholder+5 + 'px'}" v-if="isFirstFloor"></view> -->
		<!-- #endif -->
	</view>
</template>

<script>
import { mapState } from 'vuex';
import floorMixin from '@/mixins/floor.js';
export default {
	components: {},
	mixins: [floorMixin],
	filters: {},
	props: {
		floors: {
			type: Object,
			default: () => {
				return {};
			}
		},
		parmas: {
			type: Object,
			default: () => {
				return {};
			}
		},
		shopId: {
			// 如果有传shopId，则是店铺装修的组件
			type: [String, Number],
			default: ''
		}
	},
	data() {
		return {};
	},
	computed: {
		...mapState(['wxMenuBut']),
		// isFirstFloor() {//如果菜单组件是第一层，在小程序时加入胶囊点占符
		//     return (this.parmas.floors && this.parmas.floors[0].uuid == this.floors.uuid)?true:false;
		// }
		borderRadius() {
			const br = this.floors.borderRadius * 2 || 0
			switch (this.floors.radius) {
				case 'top':
					return `${br}rpx ${br}rpx 0 0`
				case 'bottom':
					return `0 0 ${br}rpx ${br}rpx`
				case 'topAndBottom':
					return `${br}rpx`
				default:
					return '0'
			}
		}
	},
	watch: {},
	mounted() {},
	destroyed() {},
	methods: {}
};
</script>

<style lang="scss" scoped></style>
