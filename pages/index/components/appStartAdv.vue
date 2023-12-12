<template>
	<!-- /*
     * @Descripttion:APP启动广告
    */ -->
	<view class="w-100vw h-100vh position-fixed bottom-0 zindex-9999" v-if="appStartAdv && appStartAdv.img && countdownTime">
		<view class="w-100 h-100 bg-white d-flex flex-column j-end">
			<image class="font-0 w-100" :src="photoServer + appStartAdv.img" mode="widthFix" @click="clickImg(appStartAdv.url)" @error="imageError"></image>
			<view
				class="position-absolute rounded-100 overflow-h text-white px-2 py-1"
				style="bottom: 240rpx;right: 60rpx;background: rgba(0,0,0,.4);"
				@click.stop="stop"
				v-if="type == 1"
			>
				跳过 {{ countdownTime }}
			</view>
			<view class="position-absolute" style="bottom: 240rpx;right: 60rpx;" @click.stop="stop" v-if="type == 2">
				<!-- 注意：下面的div如果换成view，画出来的圆会变形 -->
				<div id="info">跳过</div>
				<div class="circleProgress_wrapper" :style="{'--time':time}">
					<div class="wrapper right-0"><div class="circleProgress rightcircle"></div></div>
					<div class="wrapper left-0"><div class="circleProgress leftcircle"></div></div>
				</div>
			</view>
			<view class="w-100 bg-white h-200r flex-center">
				<view class="w-100r h-100r flex-center" :style="{'background-color':themes.color,'border-radius': '100rpx'}" v-if="systemConfig&&systemConfig.logo">
					<ls-image className="" :src="systemConfig.logo" :options="{ w: '80', h: '80', br: '50%' }" />
				</view>
				<text class="text-333 pl-2 font-44 font-weight font-Lantinghei">{{ systemConfig&&systemConfig.domainName }}</text>
			</view>
		</view>
	</view>
</template>

<script>
import floorMixin from '@/mixins/floor.js';
import { mapState } from 'vuex';
export default {
	components: {},
	mixins: [floorMixin],
	filters: {},
	props: {},
	data() {
		return {
			time: 5, //多少秒后自动关闭广告图，单位：秒
			countdownTime:this.time,//倒计时，一开始时是等于time，倒计时完毕后等于0
			timeOut: '',
			overdueHoure: 24, //单位：小时。已经显示过广告后，设置超过多少个小时后打开APP才显示广告，默认值：24
			type: 2, //计时器样式。1：数字，2：转圈圈
			appStartAdv: uni.getStorageSync('appStartAdv')&&JSON.parse(uni.getStorageSync('appStartAdv')),
		};
	},
	computed: {
		...mapState(['stausBarHeight','systemConfig'])
	},
	watch: {
		appStartAdv: {
			handler(newVal, oldVal) {
				this.countdownTime = this.time
				// console.log('curTime：', uni.getStorageSync('curTime'));
				const oldTime = uni.getStorageSync('curTime');
				const CurrentTime = new Date().getTime();
				// 如果没加载过app广告或者加载过app广告时间超过一天,则开启广告
				if (!oldTime || (oldTime && CurrentTime - oldTime > this.overdueHoure * 60 * 60 * 1000)) {
					if (newVal && newVal.img) {
						uni.setStorageSync('curTime', CurrentTime); //将当前时间的时间戳放到缓存里，24时时内不会显示app登录广告
						this.setTime();
					}
				} else {
					this.$emit('timeOut'); //如果倒计时完毕或者点击了跳过就关闭广告图
				}
			},
			immediate: true,
			deep: true
		},
		countdownTime: {
			handler(newVal, oldVal) {
				if (!newVal) {
					this.$emit('timeOut'); //如果倒计时完毕或者点击了跳过就关闭广告图
				}
			},
			immediate: true,
			deep: true
		}
	},
	beforeCreate() {},
	created() {},
	mounted() {},
	destroyed() {
		clearInterval(this.timeOut);
	},
	methods: {
		setTime() {
			this.timeOut = setInterval(() => {
				this.countdownTime--;
				if (this.countdownTime == 0) {
					this.$emit('timeOut'); //如果倒计时完毕或者点击了跳过就关闭广告图
					clearInterval(this.timeOut);
				}
			}, 1000);
		},
		stop() {
			clearInterval(this.timeOut);
			this.$emit('timeOut'); //如果倒计时完毕或者点击了跳过就关闭广告图
		},
		clickImg(url) {
			let urlData = {};
			// 如果是新数据:url是Object类型
			if (url && url.id) {
				urlData = url;
				// 如果是旧数据:url是string类型
			} else {
				urlData = {
					type: '自定义',
					url: url
				};
			}
			this.jumpPage(urlData);
		},

		// 图片错误的时候
		imageError(e) {
			if (e.type == 'error') {
				this.$set(this.appStartAdv, 'img', '');
			}
		}
	}
};
</script>

<style lang="scss" scoped>
/* 备注:下面的px不要改为rpx,不然画出来的圆会变形 */
#info {
	position: absolute;
	top: 0;
	left: 0;
	width: 36px;
	height: 36px;
	line-height: 36px;
	border-radius: 50%;
	background-color: rgba(0, 0, 0, 0.3);
	text-align: center;
	color: #FFFFFF;
	font-size: 12px;
}
.circleProgress_wrapper {
	width: 36px;
	height: 36px;
	position: relative;
	
	.wrapper {
		width: 18px;
		height: 36px;
		position: absolute;
		top: 0;
		overflow: hidden;
		.circleProgress {
			width: 32px;
			height: 32px;
			border: 2px solid #FFFFFF;
			border-radius: 50%;
			position: absolute;
			top: 0;
			transform: rotate(45deg);
		}
		
		.rightcircle {
			border-top: 2px solid #03A9F4;
			border-right: 2px solid #03A9F4;
			right: 0;
			animation:circleProgressLoad_right calc(var(--time) * 1s) linear;
			/*动画停留在最后一帧*/
			animation-fill-mode: forwards;
		}
		
		.leftcircle {
			border-bottom: 2px solid #03A9F4;
			border-left: 2px solid #03A9F4;
			left: 0;
			animation:circleProgressLoad_left calc(var(--time) * 1s) linear;
			/*动画停留在最后一帧*/
			animation-fill-mode: forwards;
		}
		
		@keyframes circleProgressLoad_right {
			0% {
				border-top: 2px solid #03A9F4;
				border-right: 2px solid #03A9F4;
				transform: rotate(45deg);
			}
		
			50% {
				border-top: 2px solid #03A9F4;
				border-right: 2px solid #03A9F4;
				border-left: 2px solid #FFFFFF;
				border-bottom: 2px solid #FFFFFF;
				transform: rotate(225deg);
			}
		
			100% {
				border-left: 2px solid #FFFFFF;
				border-bottom: 2px solid #FFFFFF;
				transform: rotate(225deg);
			}
		}
		
		@keyframes circleProgressLoad_left {
			0% {
				border-bottom: 2px solid #03A9F4;
				border-left: 2px solid #03A9F4;
				transform: rotate(45deg);
			}
		
			50% {
				border-bottom: 2px solid #03A9F4;
				border-left: 2px solid #03A9F4;
				border-top: 2px solid #FFFFFF;
				border-right: 2px solid #FFFFFF;
				transform: rotate(45deg);
			}
		
			100% {
				border-top: 2px solid #FFFFFF;
				border-right: 2px solid #FFFFFF;
				transform: rotate(225deg);
			}
		}
	}
}

</style>
