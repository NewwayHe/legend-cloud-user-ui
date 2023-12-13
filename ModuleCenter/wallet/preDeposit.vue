<template>
	<!-- 预存款主页 -->
	<view class="preDeposit safearea-bb" :style="{ '--themescolor': themes.color }">
		<ls-header showHeadSelect title="余额"></ls-header>
		
		<!-- 头部 -->
		<view class="mx-2 mt-2 p-2 rounded-12 head-bg text-fff flex-col-between" style="height: 260rpx;">
			<view class="font-28 d-flex" style="line-height: 40rpx; opacity: .5;" @click.stop="showPreTip = true">
				<text>可用余额</text>
				<text class="iconfont icon-wenhao1 text-white pl-1" style="font-size: 32rpx;"></text>
			</view>
			<view class="mt" style="margin-bottom: 24rpx;"><ls-price :price="walletData.availableAmount" noMoneyIcon :options="{ is: 64, ic: '#ffffff', iw: 600, ds: 64, dc: '#ffffff', dw: 600 }" /></view>
			<view class="flex-between font-28 w-100" style="line-height: 40rpx; opacity: .5;">
				<view>
					<text class="mr-1">我的余额</text>
					<ls-price :price="walletData.cumulativeAmount" noMoneyIcon :options="{ is: 28, ic: '#ffffff', iw: 600, ds: 28, dc: '#ffffff', dw: 600 }" />
				</view>
				<view>
					<text class="mr-1">冻结余额</text>
					<ls-price :price="walletData.frozenAmount" noMoneyIcon :options="{ is: 28, ic: '#ffffff', iw: 600, ds: 28, dc: '#ffffff', dw: 600 }" />
				</view>
			</view>
		</view>
		<view class="m-2 bg-fff rounded-12 py-2 px-4">
			<ls-cell-group :border='false'>
				<ls-cell-item className='text-333 font-28' :titleStyle="{ 'line-height': '40rpx' }" :border-bottom='false' padding='30rpx 0' @click="$navigateTo('/ModuleCenter/wallet/accountDet')" title="账户明细">
					<u-icon slot='icon' :name="require('@/static/images/iconImg/account.jpg')" size="36" style='margin-right: 20rpx;'></u-icon>
				</ls-cell-item>
			</ls-cell-group>
		</view>
		
		<u-modal v-model="showPreTip"
			title="余额说明"
			:title-style="{
				'color': '#333',
				'font-weight': '600',
				'font-size': '36rpx',
				'line-height': '50rpx',
				'padding-top': '60rpx'
			}"
			content="我的余额=可用余额+冻结余额"
			:content-style="{
				'color': '#999',
				'font-size': '32rpx',
				'line-height': '44rpx',
				'padding': '40rpx 48rpx 60rpx',
			}"
			:show-cancel-button="false"
			confirm-text="我知道了"
			:confirm-color="themes.color"
			class="preTipModal"
		/>
		
		<!-- /预存款 -->
	</view>
</template>

<script>
import waterWave from '@/static/cssImage/waterWave.vue';
import { depositApi } from '@/api/ModuleCenter.js';

export default {
	components: { waterWave },
	data() {
		return {
			walletData: {},
			predepositData: '',
			showPreTip: false,	// 点击[可用余额]问号时的弹窗
		};
	},
	computed: { },
	onShow() {},
	onLoad(options) {
		depositApi.wallet().then(res => {
			if (res.code) {
				this.walletData = res.data;
			}
		});
	},
	mounted() {},
	methods: {}
};
</script>

<style>
page {
    background-color: var(--backgroundcolor);
}
</style>
<style lang='scss' scoped>
.preDeposit {
	.head-bg {
		background-image: url('@/static/images/walletImg/mybg.png');
		background-repeat: no-repeat;
		background-position: center;
		background-size: 100%;
		background-color: var(--themescolor);
	}
	::v-deep .preTipModal {
		.u-model__footer {
			&::after {
				border-color: #e4e4e4;
			}
		}
	}
}
</style>
