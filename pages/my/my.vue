<template>
	<view class="w750" style="padding-bottom: calc(100rpx + var(--safe-area-inset-bottom))" :style="{ '--themescolor': themes.color }">
		<!-- 个人信息 -->
		<view class="overflow-h position-relative font-24 text-white bg-white">
			<!-- 背景图，注意：下面的v-if不能删掉，不然在iphone6上点击浏览器右上角的刷新时，会不显示主题颜色 -->
			<topBgMy v-if="themes && themes.color && themes.rgb" />
			<view class="w-100" :style="{ height: stausBarHeight + 'px' }"></view>
			<view class="position-relative d-flex a-center" style="padding: 60rpx 30rpx;">
				<ls-image
					:className="['mr-2',userInfo.id && userInfo.portraitPic?'zoom-in-out1210':'']"
					:src="userInfo.portraitPic"
					:options="{ w: '120', h: '120', br: '50%', bg: userInfo.portraitPic ? '' : '#fff' }"
					mode="aspectFill"
					@error="userInfo.portraitPic = ''"
					@click="goWriterInfo($event, userInfo.portraitPic)"
					:key="userInfo.portraitPic+'-1'"
				/>
				<view class="flex-1 overflow-h" style="margin-right: 150rpx;">
					<view class="line-clamp1 font-32" v-if="!userInfo.id" @click="goLogin">请点击登录</view>
					<view class="line-clamp1 font-32" v-else @click="goWriterInfo">{{ userInfo.nickName }}</view>
					<view
						class="mt-1 font-24 rounded-100 bg-white text-main d-inline-block py px-2 overflow-h"
						v-if="userInfo.id && userInfo.userGradeName"
						@click="goWriterInfo"
					>
						<u-icon class="v-text-bottom" name="level" size="28"></u-icon>
						<text class="pl">{{ userInfo.userGradeName || '' }}</text>
					</view>
				</view>
				<view
					class="position-absolute py-2 px-3 font-28"
					:style="{ right: wxMenuBut.placeholder + 'px', top: '0' }"
					@click.stop="$navigateTo(`/ModulesUser/account/account`)"
				>
					<text class="iconfont icon-setting1 text-white mr-1" style="font-size: 28rpx" />
					设置
				</view>
			</view>
		</view>
		<!-- /个人信息 -->
		<!-- 我的订单 -->
		<view class="bg-fff">
			<view class="px-2">
				<view class="py-2 d-flex a-center j-sb font-24 border-bottom h-80r" @click="goOrderList('')">
					<view class="flex-start">
						<view class="font-32 font-weight text-333">我的订单</view>
					</view>
					<view class="d-flex a-center">
						<u-icon name="arrow-right" color="#999" size="30" label="查看全部" label-size="24" label-color="#999" label-pos="left"></u-icon>
					</view>
				</view>
			</view>
		
			<view class="py-2 d-flex text-center font-28">
				<view class="flex-1 flex-col-center position-relative" @click="goOrderList(1)">
					<view class="w-70r h-70r"><text class="iconfont icon-daifukuan" style="font-size: 60rpx;"></text></view>
					<text class="item-txt mt-1">待付款</text>
					<text class="font-20 position-absolute top-0 right-0 bg-main text-white rounded-100 px-1 mr-1" :class="{ 'zoom-out0010': userInfo.id && myInfo.payment }" v-if="userInfo.id && myInfo.payment > 0">
						{{ myInfo.payment >= 100 ? '99+' : myInfo.payment }}
					</text>
				</view>
				<view class="flex-1 flex-col-center position-relative" @click="goOrderList(5)">
					<view class="w-70r h-70r"><text class="iconfont icon-daifahuo" style="font-size: 60rpx;"></text></view>
					<text class="item-txt mt-1">待发货</text>
					<text class="font-20 position-absolute top-0 right-0 bg-main text-white rounded-100 px-1 mr-1" :class="{ 'zoom-out0010': userInfo.id && myInfo.paid }" v-if="userInfo.id && myInfo.paid > 0">
						{{ myInfo.paid >= 100 ? '99+' : myInfo.paid }}
					</text>
				</view>
				<view class="flex-1 flex-col-center position-relative" @click="goOrderList(15)">
					<view class="w-70r h-70r"><text class="iconfont icon-shouhuo1" style="font-size: 60rpx;"></text></view>
					<text class="item-txt mt-1">待收货</text>
					<text class="font-20 position-absolute top-0 right-0 bg-main text-white rounded-100 px-1 mr-1" :class="{ 'zoom-out0010': userInfo.id && myInfo.shipped }" v-if="userInfo.id && myInfo.shipped > 0">
						{{ myInfo.shipped >= 100 ? '99+' : myInfo.shipped }}
					</text>
				</view>
				<view class="flex-1 flex-col-center position-relative" @click="goTo(`/ModuleCenter/evaluate/evaluateList?condition=1`)">
					<view class="w-70r h-70r"><view class="iconfont icon-daipingjia" style="font-size: 60rpx;transform: scale(0.7);"></view></view>
					<text class="item-txt mt-1">待评价</text>
					<text class="font-20 position-absolute top-0 right-0 bg-main text-white rounded-100 px-1 mr-1" :class="{ 'zoom-out0010': userInfo.id && myInfo.unCommCount }" v-if="userInfo.id && myInfo.unCommCount > 0">
						{{ myInfo.unCommCount >= 100 ? '99+' : myInfo.unCommCount }}
					</text>
				</view>
				<view class="flex-1 flex-col-center position-relative" @click="goTo(`/ModuleOrder/service/serviceList`)">
					<view class="w-70r h-70r"><view class="iconfont icon-shouhou" style="font-size: 60rpx;transform: scale(0.7);"></view></view>
					<text class="item-txt mt-1">退款/售后</text>
					<text class="font-20 position-absolute top-0 right-0 bg-main text-white rounded-100 px-1 mr-1" :class="{ 'zoom-out0010': userInfo.id && myInfo.refund }" v-if="userInfo.id && myInfo.refund > 0">
						{{ myInfo.refund >= 100 ? '99+' : myInfo.refund }}
					</text>
				</view>
			</view>
		</view>
		<!-- /我的订单 -->
		
		<!-- 收藏，消息，足迹 -->
		<view class="border-top-20bg">
			<view class="flex-center py-3 bg-white">
				<view class="flex-1 flex-col-center" @click="goTo(`/ModuleCenter/collection/collection`)">
					<text class="font-32 font-arial" :class="{ 'zoom-out0010': myInfo.totalFavorites }" style="height: 44rpx">
						{{ userInfo.id ? (myInfo.totalFavorites >= 100 ? '99+' : myInfo.totalFavorites || 0) : '0' }}
					</text>
					<text class="text-999 font-24">我的收藏</text>
				</view>
				<view class="flex-1 flex-col-center" @click="goTo(`/ModuleCenter/message/message`)">
					<text class="font-32 font-arial" :class="{ 'zoom-out0010': myInfo.message }" style="height: 44rpx">
						{{ userInfo.id ? (myInfo.message >= 100 ? '99+' : myInfo.message || 0) : '0' }}
					</text>
					<text class="text-999 font-24">我的消息</text>
				</view>
				<view class="flex-1 flex-col-center" @click="goTo(`/ModuleCenter/history/history`)">
					<text class="font-32 font-arial" :class="{ 'zoom-out0010': myInfo.footprint }" style="height: 44rpx">
						{{ userInfo.id ? (myInfo.footprint >= 100 ? '99+' : myInfo.footprint || 0) : '0' }}
					</text>
					<text class="text-999 font-24">我的足迹</text>
				</view>
			</view>
		</view>
		<!-- /收藏，消息，足迹 -->
		
		<!-- 我的钱包 -->
		<view class="border-top-20bg bg-fff">
			<view class="px-2">
				<view class="py-2 d-flex a-center j-sb font-24 border-bottom h-80r">
					<view class="flex-start">
						<view class="font-32 font-weight text-333">我的钱包</view>
					</view>
				</view>
			</view>
			<view class="d-flex py-2 font-24">
				<view class="flex-1 flex-col-center" @click="goTo(`/ModuleCenter/wallet/preDeposit`)">
					<view class="iconfont icon-yue mb-1" style="font-size: 50rpx;"></view>
					<text class="text-999">预存款</text>
				</view>
				<view class="flex-1 flex-col-center" @click="goTo(`/ModuleCenter/coupon/couponList`)">
					<view class="iconfont icon-coupons mb-1" style="font-size: 50rpx;"></view>
					<text class="text-999">优惠券</text>
				</view>
			</view>
		</view>
		<!-- /我的钱包 -->
		<view class="d-flex font-24 flex-wrap border-top-20bg border-bottom-20bg bg-fff pb-3">
			<!-- 领券中心 -->
			<view class="w-25 flex-col-center pt-3" @click="$navigateTo(`/ModuleCenter/coupon/couponCenter`)">
				<view class="w-70r h-70r mb-1"><image class="w-100 h-100" v-if="staticServer" :src="staticServer + 'static/images/my/领券中心.png'" alt="" /></view>
				<text class="">领券中心</text>
			</view>
			<!-- /领券中心 -->

			<!-- 我的评价 -->
			<view class="w-25 flex-col-center pt-3" @click="goTo(`/ModuleCenter/evaluate/evaluateList`)">
				<view class="w-70r h-70r mb-1"><image class="w-100 h-100" v-if="staticServer" :src="staticServer + 'static/images/my/我的评论.png'" alt="" /></view>
				<text class="">我的评论</text>
			</view>
			<!-- /我的评价 -->

			<!-- 我的账单 -->
			<view class="w-25 flex-col-center pt-3" @click="goTo(`/ModuleCenter/billDetail/billDetail`)">
				<view class="w-70r h-70r mb-1"><image class="w-100 h-100" v-if="staticServer" :src="staticServer + 'static/images/my/我的订单.png'" alt="" /></view>
				<text class="">我的账单</text>
			</view>
			<!-- /我的账单 -->
			<!-- 发票管理 -->
			<view class="w-25 flex-col-center pt-3" @click="goTo(`/ModuleCenter/invoice/invoice`)">
				<view class="w-70r h-70r mb-1"><image class="w-100 h-100" v-if="staticServer" :src="staticServer + 'static/images/my/我的发票.png'" alt="" /></view>
				<text class="">我的发票</text>
			</view>
			<!-- /发票管理 -->
			<!-- 我的问答 -->
			<view class="w-25 flex-col-center pt-3" @click="goTo(`/ModuleCenter/consult/consultMy`)">
				<view class="w-70r h-70r mb-1"><image class="w-100 h-100" v-if="staticServer" :src="staticServer + 'static/images/my/我的消息.png'" alt="" /></view>
				<text class="">我的问答</text>
			</view>
			<!-- /我的问答 -->
			<!-- 问题咨询 -->
			<view class="w-25 flex-col-center pt-3" @click="$navigateTo(`/ModuleCenter/question/help`)">
				<view class="w-70r h-70r mb-1"><image class="w-100 h-100" v-if="staticServer" :src="staticServer + 'static/images/my/常见问题.png'" alt="" /></view>
				<text class="">帮助中心</text>
			</view>
			<!-- /问题咨询 -->
			<!-- 意见反馈 -->
			<view class="w-25 flex-col-center pt-3" @click="$navigateTo(`/ModuleCenter/feedback/feedback`)">
				<view class="w-70r h-70r mb-1"><image class="w-100 h-100" v-if="staticServer" :src="staticServer + 'static/images/my/意见反馈.png'" alt="" /></view>
				<text class="">意见反馈</text>
			</view>
			<!-- /意见反馈 -->
			
			<!-- 联系客服 -->
			<view class="w-25 flex-col-center pt-3" @click="changeShowPic" v-if="showContact">
				<view class="w-70r h-70r mb-1 position-relative">
					<image :src="staticServer + 'static/images/my/我的售后.png'" class="w-100 h-100" alt="" />
					<!--  #ifdef MP -->
					<button openType="contact" class="opacity-0 l-gradient-l l-gradient-lt w-100 h-100 mb-1 position-absolute left-0 top-0"></button>
					<!--  #endif -->
				</view>
				<!--  #ifndef MP -->
				<view>联系客服</view>
				<!-- #endif -->
				<!-- #ifdef MP -->
				<view><ls-button className="l-gradient-l l-gradient-lt" openType="contact" :ripple="false">联系客服</ls-button></view>
				<!-- #endif -->
			</view>
		</view>
		<!-- 底部栏 -->
		<tabBar ref="commentTabbat" />
	</view>
</template>

<script>
// JS
import { appToken } from '@/utils/Cache.js';
// 装修功能组件
import topBgMy from '@/static/cssImage/topBgMy.vue';
import tabBar from '@/components/common/tabbar/tabbar.vue';
import { mapState } from 'vuex';
import pageScroll from '@/mixins/pageScroll.js'
export default {
	components: {
		tabBar,
		// 装修功能组件
		topBgMy, 
	},
	mixins: [pageScroll],
	data() {
		return {};
	},
	computed: {
		...mapState(['stausBarHeight', 'userInfo', 'wxMenuBut','myInfo','contactInfo']),
		showContact(){
			return this.contactInfo && this.contactInfo.openFlag
		},
		isLogin() {		// 是否登录
			return appToken.isLogin()
		}
	},
	watch:{},
	created() {},
	onLoad(option) {},
	mounted() {
		uni.pageScrollTo({ scrollTop: 0 }); // 当向上拉后，ios会记位置，让顶部少了一点，所以进来先置顶
	},
	onShow() {
		if (appToken.isLogin()) {
			if (this.$u.test.isEmpty(this.userInfo)) this.$store.dispatch('getUserInfo'); // 防止没有重新调接口,并更新数据
			this.$store.dispatch('getMyInfo'); // 防止没有重新调接口,并更新数据
		}
		this.$nextTick(() => {
			this.$refs.commentTabbat.setCurRoute()// 这个是为了解决小程序端animate_动画播放过后，再次点击时，动画不生效的bug。
		})
	},
	onUnload() {},
	onPullDownRefresh() {
		if (appToken.isLogin()) {
			this.$store.dispatch('getMyInfo'); // 防止没有重新调接口,并更新数据
		}
		setTimeout(() => {
			uni.stopPullDownRefresh();
		},1500)
	},
	methods: {
		scan() {
			// 允许从相机和相册扫码
			uni.scanCode({
				success: function(res) {
					uni.navigateTo({
						url: '/' + res.path,
						fail(err) {
							console.log(err);
						}
					});
					console.log('条码类型：' + res.scanType);
					console.log(JSON.parse(JSON.stringify(res)));
					console.log('条码内容：' + res);
				}
			});
		},

		// 前往个人中心
		goWriterInfo(e, pic) {
			if (pic) {
				uni.previewImage({
					urls: [this.photoServer + pic]
				});
			}
		},
		// 前往订单列表
		goOrderList(status) {
			if (!appToken.isLogin()) {
				appToken.goLogin()
				return
			}
			uni.navigateTo({ url: `/ModuleOrder/orderList/orderList?status=${status}` });
		},

		// 去登录
		goLogin() {
			appToken.toLogin();
		},
		// 显示联系客服图片
		changeShowPic() {
			// #ifndef MP
			this.$navigateTo(`/ModuleCenter/contact/contact`)
			// #endif
		},
		goTo(url){
			if (!appToken.isLogin()) {
				appToken.goLogin()
				return
			}
			this.$navigateTo(url);
		},
	}
};
</script>
<style>page {background-color: var(--backgroundcolor);}</style>
<style lang="scss" scoped>
</style>
