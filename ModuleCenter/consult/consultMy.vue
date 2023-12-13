<!--
    * Desc    : 我的问答
-->
<template>
	<view class="w750" :style="{ '--themescolor': themes.color }">
		<!-- /头部 -->
		<ls-header theme title="商品问答" showHeadSelect :headSelectIcon="2"></ls-header>

		<view class="px-2 mt-2">
			<ls-load-more :status="paging.status" v-if="list && list.length">
				<view class="rounded-20 p-3 mb-2 bg-white position-relative overflow-h" v-for="(item, index) in list" :key="index">
					<view class="flex-start" :style="{ marginTop: item.delSts ? '30rpx' : '' }" @click.stop="goGoodsDetail(item)">
						<ls-image :src="item.pic" :options="{ w: 90, h: 90, br: 8 }">
							<view class="position-absolute bottom-0 font-20 text-white w-100 flex-center" style="background: rgba(0,0,0,.2);" v-if="item.productInvalid">
								已失效
							</view>
						</ls-image>
						<view class="line-clamp2 text-666 ml-2">{{ item.productName }}</view>
					</view>
					<view class="d-flex a-start mt-3">
						<view class="text-white flex-center line-h font-20 w-50r h-50r rounded-circle ask">问</view>
						<view class="flex-1 font-weight ml-2 mt overflow-h text-pre-wrap">{{ item.content }}</view>
					</view>
					<view class="d-flex a-start mt-3" v-if="item.answer">
						<view class="text-white flex-center line-h font-20 w-50r h-50r rounded-circle answer">答</view>
						<view class="flex-1 text-666 ml-2 mt overflow-h text-pre-wrap">{{ item.answer }}</view>
					</view>
					<view class="text-white bg-warning w-100 position-absolute top-0 left-0 px-2 py-1" v-if="item.delSts">
						问答涉嫌违规已被删除
					</view>
					<!-- 已删除--印章 -->
					<ls-signet size="150" space="30" rotate="-30" fontSize="32" color="#BABCC9" right="-1" scale=".8" borderWidth="4" v-if="item.delSts||!item.status">{{item.delSts?'已删除':'已下线'}}</ls-signet>
					
				</view>
			</ls-load-more>
			<ls-empty className="center-xy" title="暂无数据" :paging="paging" />
		</view>
	</view>
</template>

<script>
import { consult } from '@/api/ModuleCenter.js';
import pageUtil from '@/utils/pageUtils.js';
const listPage = new pageUtil(consult.consultUserCenter);
export default {
	name: '',

	mixins: [],

	components: {},

	props: {},

	data() {
		return {
			data: '',
			apiParmas: {
				content: '' // 咨询内容
			},
			list: [],
			paging: {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false // 是否显示列表为空时的样式
			}
		};
	},

	computed: { },

	watch: {
		// data: {handler(newVal, oldVal) {console.log(newVal);},immediate: true,deep: true}
	},

	created() {},

	onLoad(option) {
		listPage.loadListByPage(this, this.apiParmas);
	},

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
	onReachBottom() {
		listPage.loadListByPageMore();
	},

	destroyed() {},

	methods: {
		goGoodsDetail(item) {
			if (item.productInvalid) {
				uni.showToast({ title: '该商品已下架', icon: 'none' });
			} else {
				this.$navigateTo(`/ModuleGoods/goodsDetail/goodsDetail?id=${item.productId}`);
			}
		}
	}
};
</script>

<!-- body或page的背景色要这样写(不能加scoped)且var的css变量名字里不能有大写字母，不然小程序不会生效 -->
<style>
page {
	background-color: var(--backgroundcolor);
}
</style>
<style lang="scss" scoped>
.ask {
	background-image: linear-gradient(to right, rgba(47, 77, 254, 1), rgba(47, 77, 254, 1));
	filter: opacity(0.8);
	position: relative;
	&:before {
		content: '';
		position: absolute;
		width: 0;
		height: 0;
		right: 60%;
		bottom: 0;
		border-top: 12rpx solid transparent;
		border-right: 20rpx solid rgba(47, 77, 254, 1);
		border-bottom: 0rpx solid transparent;
	}
}
.answer {
	background-image: linear-gradient(to right, rgba(252, 79, 72, 1), rgba(252, 79, 72, 1));
	filter: opacity(0.8);
	position: relative;
	&:before {
		content: '';
		position: absolute;
		width: 0;
		height: 0;
		left: 60%;
		bottom: 0;
		border-top: 12rpx solid transparent;
		border-left: 20rpx solid rgba(252, 79, 72, 1);
		border-bottom: 0rpx solid transparent;
	}
}
</style>
