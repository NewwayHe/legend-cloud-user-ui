<!--
    * Desc    : 商品咨询列表
-->
<template>
	<view class="w750" style="padding-bottom: calc(100rpx + var(--safe-area-inset-bottom))" :style="{ '--themescolor': themes.color }">
		<!-- /头部 -->
		<ls-header theme title="商品问答">
			<view class="mr-2" slot="right">
				<ls-button
					className="py-1"
					text="我的问答"
					@click="$navigateTo(`/ModuleCenter/consult/consultMy`)"
					:options="{ cl: themes.color, bc: '#ffffff', bd: themes.color, fs: 20, br: 50, pl: 20, pr: 20 }"
				/>
			</view>
		</ls-header>
		<view class="flex-start p-2" v-if="data&&data.name">
			<ls-image :src="data.pic" :options="{w:90,h:90,br:8}"/>
			<view class="line-clamp2 text-666 ml-2">{{data.name}}</view>
		</view>
		<view class="p-2">
			<view class="h-70r rounded-100 border border-e4 bg-white flex-start pl-2 pr-1 position-relative">
				<text class="iconfont icon-sousuo" :style="{ color: '#ddd' }"></text>
				<input
				    class="w-100 font-28 text-bbb ml-2"
				    type="text"
				    v-model="apiParmas.content"
				    @confirm="enterSearch"
				    confirm-type="search"
				    maxlength="50"
				    placeholder="搜索已有提问"
				    placeholder-style="color:#bbbbbb; font-size:28rpx;"
				/>
				<view class="w-60r h-60r flex-center" @click.stop="clear" v-show="apiParmas.content">
				    <view class="iconfont icon-close text-ccc" style="font-size: 36rpx;"></view>
				</view>
			</view>
		</view>
		
		<view class="px-2">
			<ls-load-more :status="paging.status" v-if="list && list.length">
				<view class="rounded-20 p-3 mb-2 bg-white" v-for="(item,index) in list" :key="index">
					<view class="d-flex a-start">
						<view class="text-white flex-center line-h font-20 w-50r h-50r rounded-circle ask">
							问
						</view>
						<view class="flex-1 overflow-h text-pre-wrap font-weight ml-2 mt">
							{{item.content}}
						</view>
					</view>
					<view class="d-flex a-start mt-3">
						<view class="text-white flex-center line-h font-20 w-50r h-50r rounded-circle answer">
							答
						</view>
						<view class="flex-1 overflow-h text-pre-wrap text-666 ml-2 mt">
							{{item.answer}}
						</view>
					</view>
				</view>
			</ls-load-more>
			<ls-empty className="center-xy" title="暂无数据" :paging="paging"/>
		</view>
		<view class="position-fixed bottom-0 w-100 safearea-bb">
			<ls-button
				className="but-main h-80r my-2 mx-2"
				text="我要提问"
				@click="$navigateTo(`/ModuleCenter/consult/consultSubmit?data=${encodeURIComponent(JSON.stringify(data))}`)"
				:options="{ fs: 30, br: 100 }"
			/>
		</view>
	</view>
</template>

<script>
import { consult } from '@/api/ModuleCenter.js';
import pageUtil from '@/utils/pageUtils.js';
const listPage = new pageUtil(consult.consultPage)
export default {
	name: '',

	mixins: [],

	components: {},

	props: {},

	data() {
		return {
			data:{},
			apiParmas:{
				content:'',// 咨询内容
				productId:''
			},
			list:[],
			paging: {
			    status: 'loading',
			    error: false, // 是否错误
			    emptylist: false // 是否显示列表为空时的样式
			},
		};
	},

	computed: { },

	watch: {
		// data: {handler(newVal, oldVal) {console.log(newVal);},immediate: true,deep: true}
	},

	created() {},

	onLoad(option) {
		console.log();
		this.data = option.data && JSON.parse(decodeURIComponent(option.data))
		this.apiParmas.productId = this.data && this.data.productId || null
		listPage.loadListByPage(this,this.apiParmas)
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
		listPage.loadListByPageMore()
	},

	destroyed() {},

	methods: {
		enterSearch(){
			console.log(this.apiParmas.content);
			listPage.loadListByPage(this,this.apiParmas)
		},
		clear(){
			this.apiParmas.content = ''
			listPage.loadListByPage(this,this.apiParmas)
		}
	}
};
</script>

<!-- body或page的背景色要这样写(不能加scoped)且var的css变量名字里不能有大写字母，不然小程序不会生效 -->
<style>
page {background-color: var(--backgroundcolor);}
</style>
<style lang="scss" scoped>
	.ask {
		background-image: linear-gradient(to right, rgba(47,77,254,1), rgba(47,77,254,1));
		filter :opacity(0.8);
	    position: relative;
		&:before {
			content: "";
			position: absolute;
			width: 0;
			height: 0;
			right: 60%;
			bottom: 0;
			border-top: 12rpx solid transparent;
			border-right: 20rpx solid rgba(47,77,254,1);
			border-bottom: 0rpx solid transparent;
		}        
	}
	.answer {
		background-image: linear-gradient(to right, rgba(252,79,72,1), rgba(252,79,72,1));
		filter :opacity(0.8);
	    position: relative;
		&:before {
			content: "";
			position: absolute;
			width: 0;
			height: 0;
			left: 60%;
			bottom: 0;
			border-top: 12rpx solid transparent;
			border-left: 20rpx solid rgba(252,79,72,1);
			border-bottom: 0rpx solid transparent;
		}        
	}
</style>
