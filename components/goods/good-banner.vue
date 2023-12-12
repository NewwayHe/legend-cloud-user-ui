<template>
	<!-- /*
     * @Descripttion:商品详情楼层：banner轮播图
    */ -->
	<view class="position-relative w-100" :style="{ height: height + 'rpx', '--themescolor': themes.color }">
		<swiper class="h-100 w-100" circular="true" :disable-touch="bannerPics.length <= 1" @change="change">
			<swiper-item v-for="(item, index) in bannerPics ? bannerPics : '[]'" :key="index">
				<ls-image :src="item" :options="{ w: '100%', h: '100%' }" mode="aspectFit" :preImgList="bannerPics" :current="index" :lazyLoad="false"/>
			</swiper-item>
		</swiper>

		<!-- 指示器 -->
		<view class="position-absolute w-100 flex-center font-20" style="bottom: 20rpx;" v-if="!showVideo">
			<view class="text-white rounded-100 px-2 py font-arial" style="background: rgba(0, 0, 0, .3);">
				<text class="mr-1 font-24">{{ current + 1 }}</text>
				/ {{ bannerPics.length }}
			</view>
		</view>

		<!-- start 视频组件(备注：除微信基础库 2.4.0+ 和 字节跳动小程序 和 app-nvue 2.1.5+，其他情况下非H5的video不能放入scroll-view和swiper。) -->
		<!-- 打开视频图标(圆圈里带个三角形) -->
		<view class="center-xy" v-if="videoUrl && !showVideo && current === 0" @click.stop="clickVideo">
			<view class="rounded-circle flex-col-center" style="background-color: rgba(0,0,0,.6);width: 96rpx;height: 96rpx;">
				<text class="iconfont icon-play text-white line-h" style="font-size: 100rpx;margin-bottom: -4rpx;"></text>
			</view>
		</view>
		<view class="flex-col-center bg-dark w-100 h-100 zindex-109 position-absolute bottom-0 left-0" style="max-height: 100%;" v-if="showVideo" @click.stop="">
			<video
				id="myVideo"
				class="w-100 flex-1"
				@fullscreenchange="fullscreenchange"
				:muted="muted"
				:src="photoServer + videoUrl"
				autoplay
				@error="videoErrorCallback"
				bindended="closeVideo"
			></video>
			<view class="text-white flex-center h-80r" @click.stop="closeVideo">
				<view class="iconfont icon-guanbi text-white mr-1" style="font-size: 40rpx;"></view>
				<view class="line-h" style="letter-spacing: 20rpx;">关闭</view>
			</view>
			<view class="position-absolute right-0 bottom-0 text-white zindex-109 mb-2 mr-2" @click.stop="muted = !muted">
				<u-icon :name="muted ? 'volume-off-fill' : 'volume-fill'" color="#ffffff" size="40"></u-icon>
			</view>
		</view>
		<!-- end 视频组件 -->

		<!-- 浮动在图片的商家信息 -->
		<view
			v-if="brandParmas && brandParmas.brandPic && brandParmas.brandName && !showVideo && current==0"
			class="position-absolute h-70r rounded-34 bottom-160r right-20r"
			style="background: rgba(0, 0, 0, .5);"
		>
			<view class="h-100 p pr-3 flex-start" @click.stop="$navigateTo(`/ModuleGoods/search/searchList?brandId=${brandParmas.brandId}`)">
				<!-- 图片 -->
				<image class="rounded-100 w-60r h-60r" :src="photoServer + brandParmas.brandPic"></image>
				<text class="pl-2 font-24 text-fff">{{ brandParmas.brandName }}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: '',

	components: {},

	props: {
		brandParmas: Object, //品牌的参数

		videoUrl: String, // 视频地址(有视频时才需要传)
		bannerPics: Array, // banner图地址(数组)
		height: {
			// 图片的宽度(单位750rpx)
			type: [String, Number],
			default: 750
		}
	},

	data() {
		return {
			showVideo: false, // 显示视频组件
			player: {}, // 用来接收视频对象，并用该对象调用video.js的方法
			current: 0, //当前所在滑块的 index
			muted: false, //video是否静音
			fullScreen: false //video是否已全屏
		};
	},

	computed: { },

	watch: {
		current(newVal) {
			if (newVal != 0) {
				this.showVideo = false;
			}
		}
		// videoUrl(newVal){
		// 	if (newVal) {
		// 		uni.getVideoInfo({
		// 			src:this.photoServer + newVal,
		// 			success:(res)=>{
		// 				// console.log('videoInfo',res);
		// 				// console.log('videoInfo',res.duration.toFixed(0));//获取视频长度
		// 			}
		// 		})
		// 	}
		// },
	},

	onShow() {
		this.closeVideo();
	},

	created() {
		console.log(this.staticServer);
	},

	mounted() {},

	beforeDestroy() {},

	destroyed() {
		this.closeVideo();
	},

	methods: {
		videoErrorCallback(e) {
			uni.showModal({
				content: e.target.errMsg,
				showCancel: false
			});
		},
		closeVideo() {
			this.showVideo = false;
		},
		// 点击视频按钮打开视频
		clickVideo() {
			this.showVideo = true;

			this.$nextTick(() => {
				this.player = uni.createVideoContext('myVideo');
				// // 所有方法请参考:https://uniapp.dcloud.io/api/media/video-context?id=createvideocontext
				// this.player.requestFullScreen()//进入全屏
				// this.player.exitFullScreen()//退出全屏

				// const myVideo = uni.createVideoContext('myVideo') // 这里对应的视频id
				// console.log(myVideo)
				// myVideo.play()//如果加这句话，就会出现点击关闭后，视频还在加载的bug

				// setTimeout(()=> {
				//   myVideo.onTimeUpdate(function() {
				//     console.log(myVideo.duration)   //总时长
				//     console.log(myVideo.currentTime)   //当前播放进度
				//   })
				// },500)

				// myVideo.sendDanmu({
				//   text: this.inputValue,
				//   color:this.closeVideo()
				// })

				// myVideo.play = function () {
				//     console.log('播放中：' + myVideo.currentTime);
				// }
				// myVideo.onpause = function () {
				//     console.log('暂停播放：' + myVideo.currentTime);
				// }
				// myVideo.onended = ()=> {
				//     this.closeVideo()//播放结束后自动关闭视频
				// }
			});
		},
		change(e) {
			this.current = e.detail.current;
		},
		fullscreenchange(e) {
			this.fullScreen = e.detail.fullScreen;
		}
	}
};
</script>

<style lang="stylus" scoped>
</style>
