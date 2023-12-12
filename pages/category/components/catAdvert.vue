<!--
    * Desc    : 分类广告
-->
<template>
	<view class="flex-center p-2" :style="{ '--themescolor': themes.color }" v-if="bannerList && bannerList.length">
		<swiper autoplay circular class="overflow-h rounded-24" style="width: 100%;" :style="{height:`${height}rpx`}" :disable-touch="bannerList.length <= 1" @change="changeBanner">
			<swiper-item v-for="(item, index) in bannerList" :key="index">
				<ls-image
					:className="['transition-all05', currentBanner == index ? 'scale-10' : 'scale-09']"
					:src="item.advPath"
					:options="{ w: '100%', h: '100%', br: '24' }"
					:lazyLoad="false"
					@click="clickBanner(item.advUrl)"
					:key="item.advPath+1"
				/>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import { goodCategory } from '@/api/ModuleGoods.js';
import floorMixin from '@/mixins/floor.js';

export default {
	name: '',

	mixins: [floorMixin],

	components: {},

	props: {
		categoryId: {
			//当buttonFixed为true时，控制靠右定位，单位rpx
			type: [Number, String],
			default: ''
		},
		height: {
			//当buttonFixed为true时，控制靠右定位，单位rpx
			type: [Number, String],
			default: 160
		}
	},

	data() {
		return {
			bannerList: [] ,//轮播图
			currentBanner:0,//当前banner图的index
		};
	},

	computed: { },

	watch: {
		categoryId: {
			handler(newVal, oldVal) {
				if (newVal) {
					this.getAdverSwiper(newVal)
				}else{
					this.bannerList = []
				}
			},
			immediate: true,
			deep: true
		}
	},

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
		getAdverSwiper(id) {
			// 【用户】根据分类id查询广告列表
			goodCategory.catAdvert({ categoryId: id }).then(res => {
				this.bannerList = res.data;
			});
		},
		changeBanner(e){
			this.currentBanner = e.detail.current
		},
		clickBanner(url) {
			let urlData = {};
			// 如果是新数据:url是Object类型
			if (url&&url.id) {
				urlData = url
			// 如果是旧数据:url是string类型
			}else{
				urlData = {
					type: '自定义',
					url: url
				};
			}
			this.jumpPage(urlData);
		},
	}
};
</script>

<style lang="scss" scoped></style>
