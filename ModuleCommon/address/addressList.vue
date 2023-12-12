<template>
	<view class="w750" :style="{ '--themescolor': themes.color }">
		<!-- 收货地址 -->
		<view class="delivery safearea-bb pb-12" v-if="!paging.emptylist">
			<view class="px-2">
				<ls-load-more :status="paging.status">
					<block v-for="(item, index) in list" :key="index">
						<view class="d-flex a-center py-2 font-30 border-bottom" @click="setDefault(item.id)" :class="item.commonAddr == 1 ? 'on' : ''">
							<text v-if="addressChange" class="overflow-h rounded-100 choose mr-2" :class="{'bg-main cur':item.id == addressId}"></text>
							<view class="address-con flex-1">
								<view class="item-p">
									<text class="name mr-2 font-32">{{ item.receiver }}</text>
									<text class="phone">{{ item.mobile }}</text>
									<text
										class="def text-fff py px-2 font-20 rounded-30 ml-1 line-h0 text-center"
										v-if="item.commonFlag"
										:style="{ 'background-color': themes.color }"
									>
										默认
									</text>
								</view>
								<view class="det mt-1 text-999">{{ item.provinceName }} {{ item.cityName }} {{ item.areaName }} {{ item.streetName }}</view>
							</view>
							<view class="iconfont icon-bianji3 text-ccc" style="font-size: 32rpx;" @click.stop="goAdd(item.id)"></view>
						</view>
					</block>
				</ls-load-more>
			</view>
		</view>
		<ls-empty className="center-xy" title="暂无相关地址列表" :paging="paging" @reLoad="getData" reLoad />
		<view class="w-100 safearea-bb-white position-fixed bottom-0 p-2 bg-fff">
			<ls-button className="but-main h-88r w-100" :text="'+ 新增地址'" @click="goAdd('')" :options="{ br: '50', fs: '30' }" />
		</view>
		<!-- /收货地址 -->
	</view>
</template>

<script>
import pageUtil from '@/utils/pageUtils.js';
import { addressManage } from '@/api/ModulesUser.js';
const listPage = new pageUtil(addressManage.getAddress);
export default {
	components: {},
	data() {
		return {
			list: [],
			paging: {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false // 是否显示列表为空时的样式
			},
			addressId: '',
			addressChange: false // 是否从订单页调过来
		};
	},
	computed: { },
	watch: {},
	onReady() {},
	created() {},
	onLoad(option) {
		this.addressId = option.addressId || null;
		if (option.addressChange) {
			this.addressChange = true;
		}
	},
	onShow() {
		this.getData();
	},
	// 下拉加载
	onReachBottom() {
		listPage.loadListByPageMore();
	},
	methods: {
		getData() {
			listPage.loadListByPage(this);
		},
		// 设为默认地址
		setDefault(id) {
			// 如果是提交订单页面进来
			if (this.addressChange) {
				uni.setStorageSync('addrId', JSON.stringify(id));
				uni.navigateBack();
			// 设默认地址
			} else {
				addressManage.editDefault({ id: id }).then(res => {
					if (res.code) {
						this.getData();
					}
				});
			}
		},
		// 去编辑地址
		goAdd(addrId) {
			uni.navigateTo({ url: '/ModuleCommon/address/addAddress?addrId=' + (addrId || '') });
		}
	}
};
</script>

<style scoped>
.choose {
	display: inline-block;
	width: 36rpx;
	height: 36rpx;
	background: url('~@/static/images/choose.png') no-repeat;
	background-size: 36rpx 36rpx;
}
.choose.cur {
	background: url('~@/static/images/choosed.png') no-repeat;
	background-size: 36rpx 36rpx;
}
</style>
