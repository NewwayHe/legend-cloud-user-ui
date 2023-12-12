<template>
    <!-- /*
     * @Descripttion:店家发票
    */ -->
	<view :style="{ '--themescolor': themes.color }">
		<u-popup v-model="show" mode="bottom" border-radius="14" safe-area-inset-bottom closeable>
			<view class="d-flex flex-wrap p-2 w-100">
				<view class="w-100">
					<view class="font-weight font-32  text-center w-100">开具发票</view>
					<view class="">
						<radio-group @change="invoiceChange">
							<view class="my-2 h-60r"><radio value="0" :checked="!currentShop.userInvoiceFlag" :color="themes.color">不开具</radio></view>
							<view class="my-2 h-60r flex-between">
								<radio value="1" :checked="currentShop.userInvoiceFlag" :color="themes.color">开具</radio>
								<view class="flex-end d-flex a-center font-28 text-main" v-if="currentShop.userInvoiceFlag">
									<text class="mr-2"  @click="moreInvoice">选择发票</text>
									<text  @click="addInvoice">新增发票</text>
								</view>
							</view>
						</radio-group>
					</view>
					<view class="px-4 my-4 font-28">
						<text v-if="currentShop.userInvoiceBo && currentShop.userInvoiceFlag" class="line-clamp2 text-666 mr-15">
							<text class="text-danger px-1 mr-2 font-20 rounded-5" style="border:2rpx solid #dc3545">已选</text>
							<text v-if="currentShop.userInvoiceBo.type=='NORMAL'">【普通发票-{{currentShop.userInvoiceBo.titleType == 'PERSONAL' ? '个人' : '公司'}}】</text>
							<text v-if="currentShop.userInvoiceBo.type!='NORMAL'">【增值税专票】</text>
							{{ currentShop.userInvoiceBo.company }}
						</text>
					</view>
				</view>
				<ls-button className="w-100 but-main h-80r mt-4" loading text="确定" @click="invoiceClose" :options="{ br: '50', fs: '30' }" />
			</view>
		</u-popup>
		<!-- 新增发票 -->
		<dialog-invoice ref="invoiceDialog" :invoiceList="currentShop.invoiceTypeList" @addInvoice="finishAddInvoice" />
		
		<!-- 发票管理弹窗 -->
		<dialog-invoice-manage
			ref="invoiceManageDialog"
			:invoiceList="currentShop.invoiceTypeList"
			:shopId="currentShop.shopId"
			:activeId="activeId"
			@chooseInvoice="changeInvoice"
		/>
	</view>
	
</template>

<script>
import DialogInvoice from '@/components/submit-order/DialogInvoice'
import DialogInvoiceManage from '@/components/submit-order/DialogInvoiceManage'	
import { orderApi } from '@/api/ModulesOrder.js';
export default {
    components: {
		'dialog-invoice':DialogInvoice,
		'dialog-invoice-manage':DialogInvoiceManage,
	},
    filters: {},
    props: {
        orderInfo: {
            type: [Object,String],
            default: () => {
                return {}
            }
        },
		activeShop: {
		    type: [Object,String],
		    default: () => {
		        return {}
		    }
		}
    },
    data() {
        return {
			show:false,
			activeId:'',
			currentShop:{}
		}
    },
    computed: { },
    watch: {
		activeShop: {
		    handler(newName) {
			  if(!newName.invoiceTypeList){
				  newName.invoiceTypeList=[]
			  }
		      this.currentShop = newName 
		    },
		    // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
		    immediate: true
		  }
	},
    mounted() {},
    destroyed() {},
    methods: {
		// 显示弹窗，并重置数据
		changePopup() {
		   this.show=!this.show
		},
		// 新增发票
		addInvoice() {
			this.$refs.invoiceDialog.changePopup();
		},
		// 关闭发票弹窗
		invoiceClose() {
			if (!this.currentShop.userInvoiceFlag) {
				this.show = false
				return
			}
			//如果选择了开发票，判断是否选择发票
			if (this.currentShop.userInvoiceFlag&&!this.activeShop.userInvoiceBo) {
				uni.showToast({ title: '请选择发票！',icon: 'none'});
				return;
			}
			
			orderApi
				.invoiceChange({
					confirmOrderId: this.orderInfo.id,
					invoiceFlag: this.currentShop.userInvoiceFlag,
					invoiceId: this.currentShop.userInvoiceBo.id,
					shopId: this.currentShop.shopId
				})
				.then(res => {
					
					this.$set(this.currentShop, 'userInvoiceBo', res.data);
					this.$emit('invoiceHandle',this.currentShop)
					this.changePopup();
				});
		},
		// 切换发票
		invoiceChange(evt) {
			if (evt.target.value == 1) {
				this.$set(this.currentShop, 'userInvoiceFlag', true);
			} else {
				this.$set(this.currentShop, 'userInvoiceFlag', false);
			}
		},
		// 发票列表
		moreInvoice() {
			this.$refs.invoiceManageDialog.changePopup();
			this.activeId = this.currentShop.userInvoiceBo&&this.currentShop.userInvoiceBo.id;
		},
		// 更换发票刷新订单页面
		changeInvoice(invoiceInfo) {
			this.$set(this.currentShop, 'userInvoiceBo', invoiceInfo);
			this.$refs.invoiceManageDialog.changePopup();
		},
		
		// 新增发票(关闭)
		finishAddInvoice(invoiceInfo) {
			this.$set(this.currentShop, 'userInvoiceBo', invoiceInfo);
			this.$refs.invoiceDialog.changePopup();
		},
	}
}
</script>

<style lang="scss" scoped></style>
