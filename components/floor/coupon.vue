<template>
	<!-- /*
     * @Descripttion:(营销组件：优惠券)：coupon
    */ -->
	<view
		class="overflow-h pb-2"
		:class="[{ 'mx-2 rounded-20 translate3d0': floors.borderRadius }]"
		:style="{ backgroundColor: backgroundColor, '--bgImageColor': backgroundColor }"
		v-if="list && list.length"
	>
		<view class="h-88r font-28 p-2" :class="[floors.titleType == 1 ? 'flex-start' : 'flex-center']">
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
			<ls-image className="mr-1" :src="floors.iconImg" :options="{w:'40',h:'40'}" v-if="floors.showIcon == 'diy' && floors.iconImg"/>
			<!-- <image class="mr" style="width: 20px; height: 20px" :src="photoServer + floors.iconImg" alt="" v-if="floors && floors.iconImg && floors.showIcon == 'diy'" /> -->
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
			<!-- 副标题 -->
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
				<text
					class="iconfont icon-ArrowRight"
					:style="{ fontSize: `${floors.data.more.fontSize * 2}rpx`, fontWeight: floors.data.more.fontWeight ? 'bold' : 'unset' }"
					v-if="floors.data.more.title"
				/>
			</view>
			<!--  -->
			<!-- 如果是是微信端，放一个胶囊的点位符 -->
			<!-- #ifdef MP -->
			<!-- <view :style="{width: wxMenuBut.placeholder+5 + 'px'}" v-if="isFirstFloor"></view> -->
			<!-- #endif -->
		</view>
		<scroll-view scroll-x style="white-space: nowrap;">
			<view 
				v-for="(item, index) in list" :key="index" 
				:class="['ml-2', 'position-relative', 'd-inline-block', 'v-middle', { 'mr-2': index == (list.length-1) && floors.listType != 1 } ]"
				@click="$navigateTo(`/ModuleCenter/coupon/couponDetail?id=${item.id}`)">
				<view class="flex-start overflow-h bg-white line-h" :class="[{ 'rounded-20 translate3d0': floors.listType != 1 }]" :style="{ color: parmas.themeColor }">
					<!-- 列表样式：简单 -->
					<template v-if="floors.listType == 1">
						<view class="flex-col-center px-3 py-2 overflow-h" style="width: 300rpx;height: 180rpx;" :style="{ backgroundColor: themesRGBA02 }">
							<view class="font-28 font-weight">
								<text class="v-super">￥</text>
								<text class="font-56">{{ item.amount }}</text>
							</view>
							<view
								class="mt-1 font-24"
								:class="[item.shopName ? 'h-36r px-2 rounded-100 translate3d0 flex-center' : '']"
								:style="{ backgroundColor: item.shopName ? parmas.themeColor : '', color: item.shopName ? '#ffffff' : parmas.themeColor }"
							>
								{{ item.minPoint ? `满${item.minPoint}可用` : '无门槛' }}
							</view>
							<view class="line-clamp1 mt-1 text-center font-24" v-if="item.shopName">{{ item.shopName }}</view>
						</view>
					</template>
					<!-- 列表样式：复杂 -->
					<template v-else>
						<view class="bg-white flex-col-start px-3 py-2 overflow-h" :style="[{ 'height': listType1Height+'rpx', 'min-width': '330rpx' }]">
							<!-- 平台优惠券 -->
							<template v-if="!item.shopName">
								<view class="d-flex a-end">
									<text class="font-28">￥</text>
									<text class="font-44 font-weight">{{ item.amount }}</text>
									<text class="rounded-8 translate3d0 py px-1 ml-2 v-super font-24" :style="{ backgroundColor: themesRGBA01, border: `2rpx solid ${themesRGBA03}` }">
										{{ item.minPoint ? '满减优惠券' : '无门槛' }}
									</text>
								</view>
								<view class="mt-1 font-24">满{{ item.minPoint }}可用</view>
							</template>
							<view class="text-333 font-24" :class="[{ 'mt-3': !item.shopName }]">
								{{ item.useType == 0 ? '全部商品可用' : item.useType == 1 ? '部分店铺参与' : item.useType == -1 ? '部分店铺不参与' : '' }}
							</view>
							<view class="text-999 mt-1 font-20 bg-f5 u-p-8" style="border-radius: 6rpx; transform: translate3d(0, 0, 0);">拼团及特殊商品除外</view>
							<!-- 店铺优惠券 -->
							<view v-if="item.shopName" class="line-clamp1 mt-3 text-999 font-24">
								<text class="iconfont icon-dianpu mr-1"></text>
								{{ item.shopName }}
							</view>
						</view>
						<view class="bg-white text-nowrap flex-shrink" style="width: 200rpx;" :style="{height:listType1Height+'rpx'}">
							<!-- 平台优惠券 -->
							<ls-image className="p-2" :src="item.pic" :options="{w:'100%',h:'100%'}" v-if="!item.shopName"/>
							<!-- 店铺优惠券 -->
							<view class="w-100 h-100 overflow-h flex-col-center p-2 text-center" :style="{ backgroundColor: themesRGBA02 }" v-else>
								<view class="font-28">
									￥
									<text class="font-44 font-weight">{{ item.amount }}</text>
								</view>
								<view class="mt-2 line-clamp1 font-24">{{ item.minPoint ? '满减优惠券' : '无门槛' }}</view>
								<view class="mt-1 line-clamp1 font-24">满{{ item.minPoint }}可用</view>
							</view>
						</view>
					</template>
				</view>
				<!-- 列表样式：简单 -->
				<template v-if="floors.listType == 1">
					<view class="dotted-line-y-20r position-absolute h-100" style="left: -10rpx;top: 0;"></view>
					<view class="dotted-line-y-20r position-absolute h-100" style="right: -10rpx;top: 0;"></view>
				</template>
				<!-- 列表样式：复杂 -->
				<template v-else>
					<!-- 分割线 -->
					<view class="position-absolute" style="width: 4rpx;top: 0;" :style="{ height:listType1Height+'rpx',right:listType1Height+'rpx', borderRight: `2rpx dashed ${backgroundColor}` }"></view>
					<!-- 圆球 -->
					<view class="position-absolute rounded-circle translate3d0" style="width: 24rpx;height: 24rpx; right:190rpx ;top: -12rpx;" :style="{ backgroundColor: backgroundColor }"></view>
					<view class="position-absolute rounded-circle translate3d0" style="width: 24rpx;height: 24rpx; right:190rpx ;bottom: -12rpx;" :style="{ backgroundColor: backgroundColor }"></view>
				</template>
			</view>
		</scroll-view>
		
	</view>
</template>

<script>
import { couponApi } from '@/api/ModuleCenter.js';
import floorMixin from '@/mixins/floor.js';
import { mapState } from 'vuex';
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
			//如果有传shopId，则是店铺装修的组件
			type: [String, Number],
			default: ''
		}
	},
	data() {
		return {
			list: [],
			listType1Height:200,//floors.listType==1时，盒子的高度，单位：rpx
		};
	},
	computed: {
		...mapState(['wxMenuBut', 'timeDiff']),
		// isFirstFloor() {//如果菜单组件是第一层，在小程序时加入胶囊点占符
		//     return (this.parmas.floors && this.parmas.floors[0].uuid == this.floors.uuid)?true:false;
		// },
		backgroundColor() {
			return this.floors.themeColor ? this.parmas.themeColor : this.floors.backgroundColor;
		},
		themesRGBA03() {
			const color = this.$utils.color.colorRgb(this.parmas.themeColor);
			return `rgba(${color.r}, ${color.g},${color.b},.3)`;
		},
		themesRGBA02() {
			const color = this.$utils.color.colorRgb(this.parmas.themeColor);
			return `rgba(${color.r}, ${color.g},${color.b},.2)`;
		},
		themesRGBA01() {
			const color = this.$utils.color.colorRgb(this.parmas.themeColor);
			return `rgba(${color.r}, ${color.g},${color.b},.1)`;
		}
	},
	watch: {},
	mounted() {
		this.getData();
	},
	destroyed() {},
	methods: {
		getData() {
			let parmas = {}
			if (this.shopId) {
				parmas = {
					shopId:this.shopId,
					shopProviderFlag:true
				}
			}
			couponApi.couponReceivable(parmas).then(res => {
				if (res.code == 1) {
					this.list = res.data.resultList;
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
	/* 代替border:dotted的点状线(Y轴方向)*/
	.dotted-line-y-20r {
		width: 20rpx;
		background-image: radial-gradient(circle closest-side, var(--bgImageColor) 6rpx, transparent 6rpx);
		background-size: 100% 20rpx;
	}
	.h-36r {
		height: 36rpx;
	}
</style>
