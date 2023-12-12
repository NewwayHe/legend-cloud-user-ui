<!-- 充值结果页面 -->
<template>
    <view class="w750 overflow-h" :style="{'--themescolor': themes.color}">
        <template v-if="!isEmpty">
            <!-- 充值成功 -->
            <view class="submit-success" v-if="!errorMsg">
                <view class="sub-suc-tit">
                    <view class="flex-center">
                        <text class="iconfont icon-success text-main" style="font-size: 50rpx;"></text>
                        <text class="pl-3 font-36 font-weight">充值成功</text>
                    </view>
                </view>
                <view class="sub-suc-item flex-col-start font-28 text-666">
                    <view class="flex-start w-100 border-bottom py-2">
                        <text class="col-3 pl-2">充值方式：</text>
                        <text class="flex-1">{{ recargeInfo.payTypeName||'暂无' }}</text>
                    </view>
                    <view class="flex-start w-100 border-bottom py-2">
                        <text class="col-3 pl-2">充值金额：</text>
                        <text class="flex-1" :class="{'text-main':recargeInfo.actualTotal}">{{ recargeInfo.actualTotal?'￥'+recargeInfo.actualTotal:'暂无' }}</text>
                    </view>
                </view>
                <view class="b-btn" @click="finshRecharge"><view class="btn-r span">完成</view></view>
            </view>
            <!-- 充值失败 -->
            <template v-else>
                <ls-empty className="center-xy" :type="4" :title="'支付失败!'"/>
                <view class="b-btn" @click="finshRecharge"><view class="btn-r span">返回</view></view>
            </template>
        </template>
    </view>
</template>

<script>
import { orderApi } from '@/api/ModulesOrder.js';
export default {
    components: {},
    data() {
        return {
            isEmpty: true,
            errorMsg: '',
            recargeInfo: ''
        };
    },
    computed: { },
    onLoad(option) {
        if (option) {
            this.errorMsg = option.message;
            if (!this.errorMsg) {
                const params = {
                    subSettlementSn: option.subSettlementSn,
                    subSettlementType: option.subSettlementType
                };

                orderApi.successOrderDetail(params).then(res => {
                    if (res.status == 1) {
                        this.recargeInfo = res.result;
                    }else{
                        this.errorMsg = true
                    }
                }).finally(res => {
                    this.isEmpty = false;
                });
            } else {
                this.isEmpty = false;
            }
        }
    },
    mounted() { },

    methods: { 
		finshRecharge(){
            // #ifdef H5
            // 由于微信H5端的支付后要经过微信重定向刷新页面，用不了navigateBack方法返回到前面的页面(彻底的解决方法请参考Cache.js文件里的toLogin方法)
            if (this.errorMsg) {
                uni.redirectTo({
                	url:'/walletModules/preDeposit/recharge'
                })
            }else{
                uni.redirectTo({
                	url:'/walletModules/preDeposit/preDeposit'
                })
            }
            // #endif
            
            // #ifndef H5
            uni.navigateBack({ delta:2 })
            // #endif
		}
	},
};
</script>

<style scoped>
body {
    background: #fff;
}
</style>
