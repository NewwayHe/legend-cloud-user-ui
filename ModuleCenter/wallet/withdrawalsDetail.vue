<template>
    <!-- （提现记录详情） -->
    <view class="w750" :style="{ '--themescolor': themes.color }">
        <!-- 账单详情 -->
        <view class="bill" v-if="!$u.test.isEmpty(withdrawalsDetailData)">
            <view class="item">
                <view class="num">
                    <view class="symbol">
                        {{ withdrawalsDetailData.amount > 0 ? '+' : '' }}
                        <text>{{ amount[0] }}</text>
                        .{{ amount[1] }}
                    </view>
                </view>
                <view class="state">{{ withdrawalsDetailData.id ? '提现成功' : '提现失败' }}</view>
            </view>
            <view class="item border-top-20bg" v-if="withdrawalsDetailData">
                <view class="line">
                    <view class="left">提现方式：</view>
                    <view class="right">{{ withdrawalsDetailData.bankName }}</view>
                </view>
                <view class="line">
                    <view class="left">提现账号：</view>
                    <view class="right">{{ withdrawalsDetailData.bankNo }}</view>
                </view>
            </view>
            <view class="item border-top-20bg" v-if="withdrawalsDetailData">
                <view class="line">
                    <view class="left">真实姓名：</view>
                    <view class="right">{{ withdrawalsDetailData.bankUser }}</view>
                </view>
                <view class="line">
                    <view class="left">支付状态：</view>
                    <view class="right" v-if="withdrawalsDetailData.paymentState == 0">待审核</view>
                    <view class="right" v-if="withdrawalsDetailData.paymentState == 1">已完成</view>
                    <view class="right" v-if="withdrawalsDetailData.paymentState == -1">已拒绝</view>
                </view>
                <view class="line" v-if="withdrawalsDetailData.paymentTime">
                    <view class="left">付款时间：</view>
                    <view class="right">{{ withdrawalsDetailData.paymentTime | dateformat('YYYY-MM-DD HH:mm:ss') }}</view>
                </view>
                <view class="line" v-if="withdrawalsDetailData.addTime">
                    <view class="left">添加时间：</view>
                    <view class="right">{{ withdrawalsDetailData.addTime | dateformat('YYYY-MM-DD HH:mm:ss') }}</view>
                </view>
                <view class="line">
                    <view class="left">提现单号：</view>
                    <view class="right">{{ withdrawalsDetailData.pdcSn }}</view>
                </view>
                <view class="line" v-if="withdrawalsDetailData.userNote">
                    <view class="left">提现备注：</view>
                    <view class="right">{{ withdrawalsDetailData.userNote }}</view>
                </view>
            </view>
        </view>
        <!-- /账单详情 -->
        <ls-empty className="center-xy" :type="4" :title="'没有符合条件的数据'" :paging="paging" @reLoad="getData" reLoad />
    </view>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            withdrawalsDetailData: {},
            amount: [],
			paging: {
			    status: 'loading',
			    error: false, // 是否错误
			    emptylist: false // 是否显示列表为空时的样式
			},
        };
    },
    computed: { },
    onLoad(option) {
        if (option) {
			this.$data['option'] = option
			this.getData()
        }
    },
    mounted() {},
	methods:{
		getData(){
			this.paging = {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false // 是否显示列表为空时的样式
			}
		}
	}
};
</script>

<style scoped>
</style>
