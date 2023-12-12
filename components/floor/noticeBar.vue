<template>
	<!-- /*
     * @Descripttion:(楼层组件：动态广播)：noticeBar
    */ -->
	<view class="p-2" :style="{ color: floors.fontThemeColor ? parmas.themeColor : floors.color,padding: `${floors.paddingY*2}rpx ${floors.paddingX*2}rpx` }">
		<view
			class="font-28 overflow-h flex-start px-3"
			:class="[{ 'rounded-20 translate3d0': floors.borderRadius }]"
			:style="{ backgroundColor: floors.themeColor ? parmas.themeColor : floors.backgroundColor, color: floors.contentColor }"
			style="height: 64rpx;"
		>
			<view class="font-weight" :style="{ color: floors.titleThemeColor ? parmas.themeColor : floors.titleColor }">{{ floors.title }}</view>
			<view class="pl-3 flex-1 flex-start" :style="{ color: floors.contentColor }">
				<text class="iconfont icon-laba1 mr-1"></text>
				<swiper class="flex-1" style="height: 64rpx;" vertical autoplay circular :disable-touch="list.length <= 1">
					<swiper-item class="flex-center" v-for="(item, index) in list" :key="index" @click="jumpPage(item.url, shopId)">
						<u-parse class="w-100 parser-rich" :style="{ color: item.color ? item.color : '' }" :html="item.title" v-if="item.title"></u-parse>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
import floorMixin from '@/mixins/floor.js';
export default {
	components: {},
	filters: {},
	mixins: [floorMixin],
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
		platform: {
			type: String,
			default: ''
		},
		shopId: {
			//如果有传shopId，则是店铺装修的组件
			type: [String, Number],
			default: ''
		}
	},
	data() {
		return {};
	},
	computed: {
		list() {
			let arr = [];
			arr = this.floors.data.contentList.filter(item => {
				return item.show;
			});
			return arr;
		}
	},
	watch: {},
	mounted() {},
	destroyed() {},
	methods: {}
};
</script>

<style lang="scss" scoped>
::v-deep .parser-rich {
	div {
		text-overflow: ellipsis;
		overflow: hidden;
		width: 100%;
		white-space: nowrap;
	}
	text {
		text-overflow: ellipsis;
		overflow: hidden;
		width: 100%;
		white-space: nowrap;
	}
	view {
		text-overflow: ellipsis;
		overflow: hidden;
		width: 100%;
		white-space: nowrap;
	}
}
</style>
