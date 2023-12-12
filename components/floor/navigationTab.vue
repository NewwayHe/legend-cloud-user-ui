<template>
	<!-- /*
     * @Descripttion:楼层(楼层组件：TAB导航)：navigationTab
    */ -->
	<view class="w-100 font-24" :style="{ backgroundColor: floors.themeColor ? parmas.themeColor : floors.backgroundColor }" v-if="tempList && tempList.length">
		<ls-tabs
			:list="tempList"
			:bgColor="floors.tabBgThemeColor ? parmas.themeColor : floors.tabBgColor ? floors.tabBgColor : floors.themeColor ? parmas.themeColor : floors.backgroundColor"
			:lineShow="floors.tabsType == 'line'"
			:pills="floors.tabsType == 'pills'"
			:pillsScale="1.3"
			pillsPaddingX="10"
			:current="current"
			:activeStyle="{color:floors.tabCurThemeColor ? parmas.themeColor : floors.tabCurColor}"
			:inactiveStyle="{color:floors.tabNoCurColor}"
			:lineColor="floors.tabCurThemeColor ? parmas.themeColor : floors.tabCurColor"
			lineBottom="15%"
			:keyName="'title'"
			@change="changeTab"
			v-if="floors.tabsShow"
		/>
		<swiper
			class="transition-all05"
			style="width: 100%;"
			:current="current"
			:style="{ height: `${currentHeight}px` }"
			:autoplay="floors.autoplay"
			:interval="floors.interval * 1"
			:circular="false"
			:vertical="floors.vertical"
			:indicator-dots="false"
			:indicator-color="indicatorNavRGB03"
			:indicator-active-color="indicatorNavRGB09"
			:disable-touch="tempList.length <= 1"
			@change="swiperChange"
		>
			<swiper-item class="w-100" v-for="(itemTwo, indexTwo) in tempList" :key="indexTwo">
				<view class="w-100 py-2" :class="[`grid-column${floors.col}`, `tabListItem${indexTwo}`]">
					<view class="flex-col-center overflow-h" v-for="(item, index) in itemTwo.imgList" :key="index">
						<ls-image :options="{ w: '90', h: '90' }" :src="item.img" @click="jumpPage(item.url, shopId)" />
						<view class="text-nowrap p-1" :style="{ color: item.themeColor ? parmas.themeColor : item.color }">{{ item.title }}</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
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
			//如果有传shopId，则是店铺装修的组件
			type: [String, Number],
			default: ''
		}
	},
	data() {
		return {
			current: 0, // 当前的索引
			currentHeight: 100 //当前容器的高度
		};
	},
	computed: {
		indicatorNavRGB03() {
			let rgb = this.$utils.color.colorRgb(this.floors.indicatorThemeColor ? this.parmas.themeColor : this.floors.indicatorColor);
			return `rgba(${rgb.r}, ${rgb.g},${rgb.b},.3)`;
		},
		indicatorNavRGB09() {
			let rgb = this.$utils.color.colorRgb(this.floors.indicatorThemeColor ? this.parmas.themeColor : this.floors.indicatorColor);
			return `rgba(${rgb.r}, ${rgb.g},${rgb.b},.9)`;
		},
		tempList() {
			let arr = this.floors.data && this.floors.data.tabList && this.floors.data.tabList.length ? this.floors.data.tabList : [];
			if (arr && arr.length) {
				for (var i = 0; i < arr.length; i++) {
					for (var j = 0; j < arr[i].imgList.length; j++) {
						//把不在有效时间的元素过滤掉
						arr[i].imgList = arr[i].imgList.filter(item => {
							return (
								!item.time ||
								!item.time.length ||
								(item.time && item.time.length && item.time[0] <= Date.parse(new Date()) && item.time[1] >= Date.parse(new Date()))
							);
						});
					}
					// 如果里面一个标题都没有,则把该菜单删掉
					if (!arr[i].imgList.length) {
						arr.splice(i, 1);
					}
					this.$nextTick(() => {
						let index = arr.findIndex(item => {
							return item.isSelect;
						}); //找出后台设置的正在选中的那一个元素的index
						this.current = index || 0;
					});
				}
			}
			return arr;
		}
	},
	watch: {
		current: {
			handler(newValue, oldValue) {
				this.$nextTick(() => {
					setTimeout(() => {
						//加setTimeout是因为app端要加
						this.init();
					}, 100);
				});
			},
			deep: true,
			immediate: true
		}
	},
	mounted() {},
	destroyed() {},
	methods: {
		// 设置一个init方法，方便多处调用
		async init() {
			// 获取组件的尺寸信息
			let tabRect = await this.$utils.getRect(this, '.tabListItem' + this.current);
			this.currentHeight = tabRect.height;
		},
		// 轮播图指示器改变
		swiperChange(e) {
			// 判断轮播图是由用户touch切换还是轮播图的自动切换引起，防止出现两个事件叠加在一起时同时触发change事件导致this.current不停被赋值
			if (e.detail.source == 'autoplay' || e.detail.source == 'touch') {
				this.current = e.target.current;
			}
		},
		// 切换tabs
		changeTab(item) {
			this.current = item.index;
		}
	}
};
</script>

<style lang="scss" scoped></style>
