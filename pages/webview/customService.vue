<!-- 客服 -->
<template>
	<view class="custom-service">
		<web-view v-if="isLoadInfo" :src="src" ref="csWebview" @message="receiveCsMsg"></web-view>
		<ls-empty className="center-xy" title="" :paging="paging"/>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		computed: {
			...mapState(['userInfo'])
		},
		watch: {
			'userInfo': {
				handler(nV) {
					// console.log('nV--', nV)
					// if(!this.$u.test.isEmpty(nV)) {
					// 	this.isLoadInfo = true
					// 	this.paging.status = 'noMore'
					// 	// 这里做信息拼接
					// }
				},
				immediate: true,
			}
		},
		data() {
			return {
				isLoadInfo: false,	// 是否请求到个人信息[已登录情况下]
				src: '',
				paging: {
					status: 'loading',
					error: false, // 是否错误
					emptylist: false // 是否显示列表为空时的样式
				},
				webviewIf: null,
				
				testEv: null,
			}
		},
		onLoad(options) {
			/* 
				isLogin: false,		//已登录[有个人信息] 未登录[游客咨询]
				userId: ,			//当前用户
				agentId: ,			//当前租户
			*/
		   console.log('进来了--', options, this.themes)
		   setTimeout(() => {
		   	this.isLoadInfo = true
		   	this.paging.status = 'noMore'
		   	// this.src = this.$config.csServer + this.$u.queryParams({ ...options, themes: this.themes.color });
		   	this.src = this.$config.csServer + '?opt=' + encodeURIComponent(JSON.stringify({ ...options, themes: this.themes.color }));// 不加setTime的话，按F5刷新的主题颜色会传#CCCCCC
		   },500)
		   
			// #ifdef H5
			// window.addEventListener('message', this.receiveCsMsg, false)
			// const customEvent = document.createEvent('Event');
			// customEvent.initEvent('testEvent', false, true);
			// customEvent.test = "pabc"
			// this.testEv = customEvent;
			// window.addEventListener('testEvent',(ev)=> {
			// 	console.log('pcustomEv--', ev)
			// }, false)
			// #endif
		},
		onReady() {
		},
		mounted() {
			// #ifdef H5
			window.addEventListener('popstate', this.onBackButtonPressed);
			// #endif
		},
		beforeDestroy() {
			// console.log('8080CSdestroy--', this.$refs.csWebview.iframe.contentWindow,window.frames)
			// #ifdef H5
			// this.$refs.csWebview.iframe.contentWindow.postMessage('Im 8080 destroy', '*')
			// #endif
		},
		destroyed() {
			// console.log('8080destroyed')
			// #ifdef H5
			window.removeEventListener('popstate', this.onBackButtonPressed);
			// #endif
			this.src = ''// 要把Socket关闭，不然后台监听不到用户已退出，isLoadInfo=false也能得到同样的效果，
		},
		onUnload() {
			// console.log('8080CS卸载XY',this)
			// #ifdef H5
			// this.$refs.csWebview.iframe.contentWindow.postMessage('Im 8080', '*')
			// this.webviewIf.contentWindow.postMessage('Im 8080 new')
			// console.log('this.web--', this.webviewIf.contentWindow)
			// this.webviewIf.contentWindow.close()
			// window.removeEventListener('message', this.receiveCsMsg, false)
			// #endif
		},
		methods: {
			onBackButtonPressed() {
				// console.log('onBackButtonPressed~~~')
				this.src = ''// 要把Socket关闭，不然后台监听不到用户已退出，isLoadInfo=false也能得到同样的效果，
			  // 处理物理返回按钮事件
			},
			receiveCsMsg(ev) {
				console.log('8080ev--', ev);
				if(ev.origin != 'http://192.168.0.96:8777') {
					return;
				}
			},
			test() {
				uni.webView.postMessage({
					data: {
						'name': '8080'
					}
				})
				// this.src += '#test=123'	//加锚点会刷新整个iframe
				// window.dispatchEvent(this.testEv)
				// #ifdef H5
				// this.$refs.csWebview.iframe.contentWindow.postMessage('Im 8080 test', '*')
				// window.frames[0].postMessage('Im 8080', '*')
				// #endif
				// setTimeout(() => {
				// 	console.log('关闭')
				// 	this.isLoadInfo = false;
				// }, 500)
			}
		}
	}
</script>

<style>
	page {
		background-color: var(--backgroundcolor);
	}
</style>
