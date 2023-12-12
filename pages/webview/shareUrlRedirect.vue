<template>
	<view class="center-xy word-breakall w-100">
		<view class="p-2 w-100 flex-col-center">
			<!-- <view class="">正在跳转至:</view> -->
			<view class="h-100r w-100r my-4"><loadingCss/></view>
			<!-- <u-link :href="url">{{url}}</u-link> -->
		</view>
	</view>
</template>

<script>
	import loadingCss from '@/static/cssImage/loadingCss.vue';
	export default {
		components: {loadingCss},
	    data() {
	        return {
	            url: '',
				pc:{
					coupon:'/active/coupon/couponDetail',
					good:'/good/detail',								
					shop:'/good/shopHomePage',
					snapshot:'/good/snapshotDetail'
				},
				mobile:{
					coupon:'/ModuleCenter/coupon/couponDetail',
					good:'/ModuleGoods/goodsDetail/goodsDetail',
					shop:'/ModuleGoods/shopHome/shopIndex',
					snapshot:'/ModuleGoods/goodsDetail/snapshotDetail',
					index:''
				},
			}
	    },
		computed: {
	
		},
	    onLoad(option) {
			this.redirect(option)
	    },
	    onShow() {},
	    methods: {
			redirect(option){
				let modulePath
				let baseUrl
				//判断跳转PC端还是移动端页面
				modulePath = this.mobile
				baseUrl = location.origin
				if(!option.detailsType) {
					location.href = baseUrl
					return
				}
				this.url = baseUrl + modulePath[option.detailsType]+this.$u.queryParams({...{isPreview:true},...option})
				// console.log(location)
				location.href = this.url
			}
		}
	}
</script>

<style>
</style>
