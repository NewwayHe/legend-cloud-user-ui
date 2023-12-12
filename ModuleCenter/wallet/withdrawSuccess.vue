<template>
    <!-- 提现成功 -->
    <view class="w750" :style="{ '--themescolor': themes.color }">
        <!-- 提交成功 -->
        <view class="submit-success">
            <view class="pt-6 px-2 pb-2">
                <view class="d-flex a-center j-center my-2">
					 <view class="iconfont icon-success text-main" style="font-size: 60rpx;" v-if="bankName"></view>
					 <view class="iconfont icon-tanhao1 text-ccc" style="font-size: 60rpx;" v-else></view>
                    <text class="font-weight font-36 ml-2">{{ bankName ? '提交成功' : '提交失败' }}</text>
                </view>
                <text class="d-flex j-center text-999">{{ bankName ? '您的申请已经提交，预计2~3个工作日到账' : '提交失败，请联系客服' }}</text>
            </view>
            <view class="pt-1 px-2 pb-2" v-if="bankName">
                <view class="mt-2 pb-2" style="border-bottom: 2rpx dashed #ddd;">
                    <text class="text-999">提现方式：</text>
                    <text class="order-num">{{ bankName ? bankName : '&nbsp;' }}</text>
                </view>
                <view class="mt-2 pb-2" style="border-bottom: 2rpx dashed #ddd;">
                    <text class="text-999">提现金额：</text>
                    <text class="order-price text-main">￥{{ amount ? amount : '&nbsp;' }}</text>
                </view>
            </view>
            <view class="mx-2 mt-2" @click="$navigateTo(`/ModuleCenter/wallet/preDeposit`)"><view class="d-flex a-center j-center bg-main text-fff p-3 rounded-5">完成</view></view>
        </view>
        <!-- /提交成功 -->
    </view>
</template>

<script>
export default {
    data() {
        return {
            bankName: false, // 新增，用来代替option.bankName
            bankNo: '', // 新增，用来代替option.bankNo
            amount: '' // 新增，用来代替option.amount
        };
    },
    computed: { },
    onLoad(option) {
        // this.$applyStyle(this.themes.color);
        if (option) {
			console.log(option,'option');
            const formData = JSON.parse(decodeURIComponent(option.formData));
			console.log(formData,'formData');
            this.bankName = '微信'; 
            this.bankNo = formData.bankNo || null;
            this.amount = formData.amount || null;
        }
    },
    mounted() { },
    methods: { },
};
</script>

<style scoped>
</style>
