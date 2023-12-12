<!--
	*页面js加载失败时使用的组件（需注册为全局组件）-- 只有H5端有用
-->
<template>
	<view class="center-xy">
		<view class="flex-center">
			<text class="iconfont icon-tanhao" style="color: #CCCCCC;font-size: 200rpx;"></text>
		</view>
		<view class="font-28 text-999 pt-2 text-center">您访问的网页出错了</view>
		<view class="border border-999 text-main mt-2 rounded-100 h-70r w-300r flex-center" @click.native="goIndex">
			<text class="text-999">返回首页</text>
		</view>
	</view>
</template>

<script>
import lsButton from '@/components/ls-app/ls-button/ls-button.vue';
export default {
    name: 'asyncLoading',
	components: {
	    'ls-button': lsButton,
	},

    props: {
		
	},

    data() {
        return {
			
		};
    },

    computed: {
		curTime(){
			return new Date().getTime()
		}
	},

    watch: {
		
	},

    created() {},

    mounted() {
		
	},
    methods: {
		goIndex(){
			window.location.href = `/pages/index/index?time==${this.curTime}`
		}
	}
};
</script>

<style lang="scss" scoped>

</style>

