<template>
	<view class="w750 font-24" :style="{ '--themescolor': themes.color }">
		<!-- /头部 -->
		<ls-header title="我的信息" showHeadSelect></ls-header>
		<view class="mt-2">
			<view class="h-150r flex-start px-4" @click="$navigateTo(`/ModuleCenter/message/messageList?index=1`)">
				<view class="h-88r w-88r flex-center rounded-circle" style="background-image: linear-gradient(to right top, rgba(61,204,173,1), rgba(61,204,173,.6))">
					<text class="iconfont icon-laba text-white" style="font-size: 40rpx;"></text>
				</view>
				<text class="font-32 ml-2 flex-1">我的公告</text>
				<view class="w-40r h-40r rounded-circle text-white bg-main flex-center scale-08" v-if="data.noticeUnreadMsgCount">{{data.noticeUnreadMsgCount>99?99:data.noticeUnreadMsgCount}}</view>
			</view>
			<view class="h-150r flex-start px-4" @click="$navigateTo(`/ModuleCenter/message/messageList?index=0`)">
				<view class="h-88r w-88r flex-center rounded-circle" style="background-image: linear-gradient(to right top, rgba(242,54,60,1), rgba(242,54,60,.6))">
					<text class="iconfont icon-lingdang text-white" style="font-size: 50rpx;"></text>
				</view>
				<text class="font-32 ml-2 flex-1">系统通知</text>
				<view class="w-40r h-40r rounded-circle text-white bg-main flex-center scale-08" v-if="data.systemUnreadMsgCount">{{data.systemUnreadMsgCount>99?99:data.systemUnreadMsgCount}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { infoLise } from '@/api/ModulesCommon.js'
	import { mapState } from 'vuex'
	export default {
		name: '',
		components: {},
		data() {
			return {
				data:'',
			}
		},
		computed: {
			...mapState()
		},
		watch: {},
		onLoad() {

		},
		onShow() {
			infoLise.unReadCount().then((res) => {
				if (res.code) {
					this.data = res.data
				}
			})
		},
		mounted() {},
		// 下拉加载
		onReachBottom() {},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
</style>
