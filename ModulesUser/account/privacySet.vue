<!-- 账号设置 -->
<template>
	<view class="w750" :style="{ '--themescolor': themes.color }">
		<ls-header showHeadSelect title="私隐设置"></ls-header>
		<!-- #ifdef APP-PLUS -->
		<view class="px-2 py-4 flex-between bg-white">
			<text>开启地理位置定位</text>
			<view class="text-666" @click.stop="openSetting">
				{{getStatus('locationAuthorized')}}
				<u-icon name="arrow-right" color="#666666" size="20"></u-icon>
			</view>
		</view>
		<view class="p-2 text-999 font-20">
			本app需要根据获取你的定位位置，来决定离你最近的门店，算出哪个门店离你最近从而提示你去哪个门店提货。
			<!-- 关于<text class="text-primary">《位置信息》</text> -->
		</view>
		<view class="px-2 py-4 flex-between bg-white">
			<text>允许访问相机</text>
			<view class="text-666" @click.stop="openSetting">
				{{getStatus('cameraAuthorized')}}
				<u-icon name="arrow-right" color="#666666" size="20"></u-icon>
			</view>
		</view>
		<view class="p-2 text-999 font-20">
			本app上传图片来发表商品的评论或文章时，须要调用摄像头来拍摄图片。另外个人中心设置用户头像时也用到拍摄的图片
			<!-- 关于<text class="text-primary">《访问相机》</text> -->
		</view>
		<view class="px-2 py-4 flex-between bg-white">
			<text>允许访问相册</text>
			<view class="text-666" @click.stop="openSetting">
				{{getStatus('albumAuthorized')}}
				<u-icon name="arrow-right" color="#666666" size="20"></u-icon>
			</view>
		</view>
		<view class="p-2 text-999 font-20">
			发表商品评论或文章或个人中心设置用户头像时，需要用到相册里的图片
			<!-- 关于<text class="text-primary">《访问相册》</text> -->
		</view>
		<!-- #endif -->

		<!-- #ifdef MP -->
		<view class="px-2 py-4 flex-between bg-white">
			<text>开启地理位置定位</text>
			<view class="text-666" @click.stop="openSetting">
				{{userLocation===true?'已授权':'未授权'}}
				<u-icon name="arrow-right" color="#666666" size="20"></u-icon>
			</view>
		</view>
		<view class="p-2 text-999 font-20">
			本app需要根据获取你的定位位置，来决定离你最近的门店，算出哪个门店离你最近从而提示你去哪个门店提货。
			<!-- 关于<text class="text-primary">《位置信息》</text> -->
		</view>
		<!-- #endif -->

		<view class="px-2 py-4 flex-between bg-white">
			<text>个性化推荐</text>
			<view class="text-666">
				<switch class="scale-08" :color="themes.color" :checked="closeRecommend" @change="changeRecommend" />
			</view>
		</view>
		<view class="p-2 text-999 font-20">
			开启后将展示个性化推荐内容，提升您浏览或购物体验
		</view>
		<view class="px-2 py-4 flex-between bg-white" @click.stop="goAgreement('USER_REGISTER')">
			<text>《用户注册协议》</text>
			<view class="text-666">
				查看
				<u-icon name="arrow-right" color="#666666" size="20"></u-icon>
			</view>
		</view>
		<view class="px-2 py-4 flex-between bg-white border-bg-top-x20r" @click.stop="goAgreement('PRIVACY_POLICY')">
			<text>《用户服务协议和隐私政策》</text>
			<view class="text-666">
				查看
				<u-icon name="arrow-right" color="#666666" size="20"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	import { protocolApi } from '@/api/ModuleBase.js';
	export default {
		components: {},
		data() {
			return {
				closeRecommend: true,
				// #ifdef APP-PLUS
				appSetting: {
					locationAuthorized: '', //允许使用定位的开关
					cameraAuthorized: '', //允许使用摄像头的开关
					albumAuthorized: '' //允许使用相册的开关
				},
				// #endif
				// #ifdef MP
				userLocation: false, //允许使用定位的开关
				// #endif
			}
		},
		computed: {
			// #ifdef APP-PLUS
			getStatus() {
				return function(type) {
					return this.appSetting[type] == 'authorized' ? '已开启' : this.appSetting[type] == 'denied' ? '已拒绝' : '未开启'
				}
			},
			// #endif
		},
		watch: {},
		onLoad() {
			this.closeRecommend = !uni.getStorageSync('closeRecommend')
		},
		onShow() {
			// #ifdef APP-PLUS
			this.appSetting = uni.getAppAuthorizeSetting()
			// console.log(111, this.appSetting );
			// #endif
			// #ifdef MP
			uni.getSetting({
				success: res => {
					if (res?.authSetting) {
						// console.log(12,res.authSetting);
						this.userLocation = res.authSetting['scope.userLocation']
					}
				},
				complete: () => {}
			});

			// #endif
		},

		activated() {},
		methods: {
			// 去阅读注册协议
			goAgreement(code) {
				protocolApi.queryById({ code: code }).then(res => {
					if (res.code) {
						console.log('res：', res);
						if (res.data.type === 0) {
							// 协议类型 0 链接 1 富文本
							// #ifdef H5
							window.open(res.data.url, '_self');
							// window.location.href = res.data.url
							// #endif
							// #ifndef H5
							uni.navigateTo({ url: `/pages/webview/webview?url=${encodeURIComponent(res.data.url)}` })
							// #endif
						} else {
							uni.navigateTo({ url: `/ModulesUser/register/agreement?code=${code}` });
						}
					}
				});
			},
			changeRecommend(e) {
				// console.log(111, e.detail.value);
				uni.setStorageSync('closeRecommend', !e.detail.value);
				uni.showToast({ title: '修改成功', mask: true });
			},
			openSetting() {
				// #ifdef APP-PLUS
				uni.openAppAuthorizeSetting()
				// #endif
				// #ifdef MP
				uni.openSetting();
				// #endif
			},
		}
	}
</script>
<style>
	page {
		background-color: var(--backgroundcolor);
	}
</style>
<style scoped lang="scss">
</style>
