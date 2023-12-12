<template>
	<!-- 提现方式 -->
	<view class="w750 font-28 " :style="{ '--themescolor': themes.color }">
		<view class="p-2">提现方式</view>
		<view class="bg-fff px-2 overflow-h py-2 ">
			<radio-group @change="payTypeChange">
				<label class="flex-between py-2 font-28">
					<view class="flex-center">
						<view class="w-60r h-100 mr-2"><text class="iconfont icon-weixinzhifu" style="color: #01CA02;font-size: 60rpx;"></text></view>
						<text class="flex-1">微信支付</text>
					</view>
					<radio class="scale-08" :checked="curPayType == 'WX_PAY'" :color="themes.color"></radio>
				</label>
			</radio-group>
		</view>
		<ls-button className="but-main h-88r m-4" loading :text="'提现'" @click="withdrawal" :options="{ fs: '30', br: '100' }" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			curPayType: 'WX_PAY', //当前支付方式
		};
	},
	computed: { },
	mounted() {
	},
	onLoad() {},
	watch: {},
	methods: {
		payTypeChange(e) {
			this.curPayType = e.detail.value;
		},
		nextClick(action) {
			if (this.action == '支付宝' || this.action == '微信' || this.action == '银行卡') {
				uni.navigateTo({ url: `/walletModules/preDeposit/withdraw?bankName=${this.action}` });
			} else {
				uni.showToast({ title: '请勾选提现方式', icon: 'none' });
			}
		},
		withdrawal() {
			this.$navigateTo('/ModuleCenter/wallet/withdraw?channel=' + this.curPayType);
		}
	}
};
</script>

<style>page{background-color: var(--backgroundcolor);}</style>
<style scoped></style>
