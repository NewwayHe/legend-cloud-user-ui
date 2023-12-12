<template>
    <view :style="{ '--themescolor': themes.color }">
		<!-- 头部下拉列表 -->
		<head-dropdown :list="listDropdown" :state="dropState" @change="changeList" :span='2'></head-dropdown>
		
		<invoice-list v-if='dropState == 1' ref='invoiceList'></invoice-list>
		
		<invoice-title v-else-if='dropState == 2' ref='invoiceTitle'></invoice-title>
		
    </view>
</template>

<script>
import { mapState } from 'vuex'
import { invoiceManage } from '@/api/ModulesUser'

import headDropdown from '@/components/ls-app/ls-header/head-dropdown.vue'
import invoiceList from './components/invoiceList.vue'
import invoiceTitle from './components/invoiceTitle.vue'
export default {
	components: {
		'head-dropdown': headDropdown,
		'invoice-list': invoiceList,
		'invoice-title': invoiceTitle,
	},
    computed: { 
		...mapState(['isBackRefresh'])
	},
	watch: { },
    data() {
        return {
            isEdit: false,
            form: {
                type: 'NORMAL',
                titleType: 'PERSONAL',
                commonInvoiceFlag: false
            },
			listDropdown: [		//头部下拉选择列表
				{
					name: '我的发票',
					value: 1,
				},
				{
					name: '发票抬头',
					value: 2,
				},
			],
			dropState: 1,	//默认为 [我的发票]
        }
    },
    onLoad(options) {
		let { state = 1 } = options;	//如果是从 个人设置跳转而来 则根据state做列表显示
		this.dropState = state;
    },
	onShow() {
		// 这里必须用setTimeout 
		// 因为在APP的环境下 编辑等操作后的utils.goBeforePage会晚于onShow的时机 小程序和H5则早于onShow
		setTimeout(()=>{
			if(this.isBackRefresh) {		//登录、新增、编辑、删除返回重刷数据
				let curDrop = this.dropState == 1 ? 'invoiceList' : 'invoiceTitle'
				this.$refs[curDrop].getData()
			}
		}, 200)
	},
	onReachBottom() {
		// console.log('reach--')
		let curDrop = this.dropState == 1 ? 'invoiceList' : 'invoiceTitle'
		this.$refs[curDrop].loadMore()
	},
    methods: {
        // 明细注释
        showRule() {
            uni.showModal({
                content: '依照国税总局开票法规，订单开具纸质普通发票、电子普通发票，开票内容为明细',
                showCancel: false,
                confirmText: '我知道了'
            })
        },

        // 税号
        showRule2() {
            uni.showModal({
                content:
                    '根据国税总局规定：购买方为企业的，索取增值税普通发票时，应向销售方提供纳税人识别号或统一社会信用代码；销售方为其开具增值税普通发票时，应在“购买方纳税人识别号”栏填写购买方的纳税人识别号或统一社会信用代码。不符合规定的发票，不得作为税收凭证。纳税人识别号有两种方式获取：1.联系公司财务咨询开票信息；2.登录全国组织代码管理中心查询',
                showCancel: false,
                confirmText: '我知道了'
            })
        },
		
		// 头部切换选择列表项
		changeList(index) {
			console.log('切换了--',index)
			this.dropState = this.listDropdown[index].value
		},
		
    }
}
</script>

<style>
page {
    background-color: var(--backgroundcolor);
}
</style>

<style lang="scss" scoped>
	
</style>
