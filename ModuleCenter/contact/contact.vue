<template>
	<view class="" :style="{ '--themescolor': themes.color }">
		<view class="h-60vh bg-main flex-col-center">
			<view class="span-12">
				<view class="w-100 h-0 pb-100pre position-relative">
					<view class="position-absolute left-0 w-100 h-100">
						<ls-image :src="resData.wvCode" :options="{w:'100%', h:'100%'}" :key="resData.wvCode+1"></ls-image>
					</view>
				</view>
			</view>
			<text class="text-white mt-4 mb-2">长按二维码添加客服微信</text>
		</view>
		<view class="w-100 flex-center">
			<view class="bg-white rounded-20 p-3 w-90" style="margin-top: -120rpx;">
				<view class="w-100 flex-between py-3">
					<view class="w-25">联系电话</view>
					<view class="flex-1 overflow-h">{{ resData.contactPhone }}</view>
					<ls-button className="ml-2 py" text="拔打电话" loading @click="call" :options="{ fs: '24', br: '50', pl: '30', pr: '30', bd: '#ccc' }" />
				</view>
				<view class="w-100 flex-between py-3">
					<view class="w-25">微信号</view>
					<view class="flex-1 overflow-h">{{ resData.wxNumber }}</view>
					<ls-button
						className="ml-2 py"
						text="复制微信号"
						loading
						@click="$stringUtils.lsCopy(resData.wxNumber)"
						:options="{ fs: '24', br: '50', pl: '30', pr: '30', bd: '#ccc' }"
					/>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	name: '',

	mixins: [],

	components: {},

	props: {},

	data() {
		return {
			resData: {}
		};
	},

	computed: {
		...mapState(['contactInfo'])
	},

	watch: {
		'contactInfo': {
		    handler(newVal, oldVal) {
		        if (newVal) {
					// 平台客服
					if (!this.$utils.pages.getPageRoute().options.shopId) {
						this.resData = newVal
					}
		        }
		    },
		    deep: true,
		    immediate: true
		},
	},
	created() {},
	onLoad(option) {
		// 店铺客服
		if (option.shopId) {
			this.resData = JSON.parse(decodeURIComponent(option.shopContactDTO));
		}
	},
	onShow() {},
	mounted() {},
	destroyed() {},

	methods: {
		call() {
			uni.makePhoneCall({
			    phoneNumber: this.resData.contactPhone,
				success:()=> {
					// console.log(111);
				},
				fail:()=> {
					// console.log(222);
				},
				complete: ()=> {
					// console.log(333);
				},
			});
		},
	}
};
</script>

<style>
page {
	background-color: var(--backgroundcolor);
}
</style>
