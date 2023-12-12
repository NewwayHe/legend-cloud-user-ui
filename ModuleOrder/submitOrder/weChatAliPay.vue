<template>
	<view class="p-4 font-24 w-100">
		<view class="flex-center font-32 font-weight mb-4">请使用其它浏览器(QQ浏览器除外)打开以下链接进行支付</view>
		<view id="pay" v-html="payForm"></view>
	</view>
</template>

<script>
	import platformPayto from '@/service/payTo.js'; // 调用支付
	export default{
		data(){
			return {
				payForm:''
			}
		},
		async onLoad(option){
			const aaa = decodeURIComponent(option.alipayForm)
			if(!this.$utils.getUa().isWeixin){
				// let res = await platformPayto.pay(option.curPayType, [option.orderNumber], option.settlementType)
				console.log(res);
				// this.payForm = aaa
				// this.$nextTick(()=>{
					// console.log(JSON.parse(decodeURIComponent(option.alipayForm)),'option.alipayForm2222');
					// console.log(document.forms[0],'document.forms[0]');
					// document.getElementById('pay').innerHTML=this.payForm
				// 	document.forms[0].acceptCharset='UTF-8'
				// 	console.log(document.forms[0],'final');
				// 	console.log(document.getElementById('pay').innerHTML,'div');
				// 	document.forms[0].submit();
				// })
				// uni.showModal({
				// 	title:'111'
				// })
			}
		}
	}
</script>

<style>
</style>
