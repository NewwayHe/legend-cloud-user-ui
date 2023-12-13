<!--
    * Desc    : 提交问答
-->
<template>
	<view class="w750" style="padding-bottom: calc(100rpx + var(--safe-area-inset-bottom))" :style="{ '--themescolor': themes.color,'--themesrgba02': themes.rgb02 }">
		<!-- /头部 -->
		<ls-header theme title="商品问答" showHeadSelect :headSelectIcon="2"></ls-header>
		<view class="flex-start p-2" v-if="data&&data.name">
			<ls-image :src="data.pic" :options="{ w: 90, h: 90, br: 8 }"/>
			<view class="line-clamp2 text-666 ml-2">{{data.name}}</view>
		</view>
		<view class="p-2">
			<text class="text-danger font-32 font-weight v-sub mr-1">*</text>
			<text>请填写您的问题：</text>
		</view>

		<view class="px-2">
			<view class="rounded-20 p-3 mb-2 bg-white position-relative">
				<u-input :height="300" maxlength="50" v-model="apiParmas.content" type="textarea" placeholder="请输入内容" border />
				<text class="position-absolute" :class="[apiParmas.content.length == 50 ? 'text-danger' : 'text-999']" style="right: 40rpx;bottom: 40rpx;">
					{{ apiParmas.content.length }}/50
				</text>
			</view>
		</view>
		<view class="position-fixed bottom-0 w-100 safearea-bb">
			<ls-button
				:className="`${showBut ? 'but-main' : 'but-main-rgb02 text-white pointer-none'} h-80r my-2 mx-2`"
				text="我要提问"
				loading
				:asyncFunction="submit"
				:options="{ fs: 30, br: 100 }"
			/>
		</view>
	</view>
</template>

<script>
import { consult } from '@/api/ModuleCenter.js'

export default {
	name: 'ConsultSubmit',

	mixins: [],

	components: {},

	props: {},

	data() {
		return {
			apiParmas: {
				content: '',// 咨询内容
				productId:'',// 商品id
				shopId:''
			},
			data:{},
			hasClickBut:false,
		};
	},

	computed: {
		showBut(){
		    return this.apiParmas.content.length && !this.hasClickBut
		},
	},

	watch: {
		// data: {handler(newVal, oldVal) {console.log(newVal);},immediate: true,deep: true}
	},

	created() {},

	onLoad(option) {
		this.data = option.data && JSON.parse(decodeURIComponent(option.data))
		console.log('data:',this.data);
		this.apiParmas.productId = this.data && this.data.productId || null
		this.apiParmas.shopId = this.data && this.data.shopId || null
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
	// onReachBottom() {},

	destroyed() {},

	methods: {
		submit(){
			return new Promise((resolve) => {
				this.hasClickBut = true
				consult.addConsult(this.apiParmas).then(res => {
					if (res.code) {
						uni.showToast({ title:'提交成功', icon:'none',mask : true,
							complete:() => {
								setTimeout(() => {
									this.hasClickBut = false
									// 在这里写执行完showToast后的方法，下面的this是vue里的this，不需要用到that=this
									this.$navigateTo(`/ModuleCenter/consult/consultMy`)
								}, 1000);
							}
						})
					}else{
						this.hasClickBut = false
					}
				}).catch(() => {
					this.hasClickBut = false
				}).finally(() => { return resolve() })
			})
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
