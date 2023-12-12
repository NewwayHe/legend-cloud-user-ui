<template>
	<view class="p-2">
		<u-parse class="font-28 overflow-h" :html="agreement.text" v-if="visible&&agreement.text"></u-parse>
		<ls-empty className="center-xy" :paging="paging" type="2" title="暂无内容"></ls-empty>
	</view>
</template>

<script>
import { protocolApi } from '@/api/ModuleBase.js';

export default {
	components: {},
	data() {
		return {
			agreement: {},
			visible: false,
			code: '',
			paging: {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false // 是否显示列表为空时的样式
			},
		};
	},
	computed: {},
	onLoad(option) {
		this.code = option && option.code ? option.code : 'USER_REGISTER';
		uni.setNavigationBarTitle({
		    // 更改当前页面标题
		    title: this.code=='USER_REGISTER'?'用户注册协议':this.code=='PRIVACY_POLICY'?'服务协议和隐私政策':'协议'
		})
		this.getAgreement();
	},
	onShow() {},
	mounted() {},
	methods: {
		// 获取协议内容
		getAgreement() {
			// console.log(111,this.code);
			this.paging = {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false // 是否显示列表为空时的样式
			};
			protocolApi.queryById({ code: this.code }).then(res => {
				if (res.code === 1) {
					if (res.data.type === 0) {
						// 协议类型 0 链接 1 富文本
						window.open(res.data.url, '_self');
					} else {
						this.agreement = res.data;
						this.visible = true;
					}
				}
			}).finally(res => {
				this.paging.status = 'noMore';
				if (!this.$checkInfo([{ type: 'hasValue', value: this.agreement.text }])) {
					this.paging.emptylist = true;
				}
			});
		}
	}
};
</script>

<style scoped></style>
