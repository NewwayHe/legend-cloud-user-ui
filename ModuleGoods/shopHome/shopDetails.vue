<template>
    <view class="w750" :style="{ '--themescolor': themes.color }">
        <ls-header showHeadSelect title="店铺信息"></ls-header>
        <view class="overflow-h position-relative font-32 mt-2">
            <view class="h-120r p-2 overflow-h flex-between font-24 bg-fff" v-if="shopDetailData" >
			    <ls-image :src="shopDetailData.shopAvatar" :options="{ w: '100', h: '100', br: '8' }" :key="shopDetailData.shopAvatar"/>
                <view class="flex-1 h-100 pl-2 flex-between overflow-h">
                    <view class="flex-1 overflow-h">
                        <view class="flex-col-between font-30 font-weight line-clamp1">{{ shopDetailData.shopName }}</view>
                        <view class="">
                            <u-rate
                                style="vertical-align: top;"
                                :count="5"
                                :current="shopDetailData.score || 0"
                                disabled
                                size="20"
                                :active-color="themes.color"
                                allowHalf
                                inactive-icon="star-fill"
                            ></u-rate>
                        </view>
                    </view>
                </view>
		    </view>
            <ls-cell-group class="mt-2 account-cell">
                <ls-cell-item title="服务评分"
                    :arrow="false"
                    padding="20rpx"
                    :title-style="{ 'color': '#333', 'line-height': '40rpx' }"
                >
                    {{shopDetailData.shopCommAvg || 0}}
                </ls-cell-item>
                <ls-cell-item title="描述评分"
                    :arrow="false"
                    padding="20rpx"
                    :title-style="{ 'color': '#333', 'line-height': '40rpx' }"
                >
                    {{shopDetailData.productCommentAvg || 0}}
                </ls-cell-item>
                <ls-cell-item title="物流评分"
                    :arrow="false"
                    padding="20rpx"
                    :title-style="{ 'color': '#333', 'line-height': '40rpx' }"
                >
                    {{shopDetailData.dvyTypeAvg || 0}}
                </ls-cell-item>
            </ls-cell-group>
            <ls-cell-group class=" mt-2 account-cell">
                <ls-cell-item title="开店时间"
                    :arrow="false"
                    padding="20rpx"
                    :title-style="{ 'color': '#333', 'line-height': '40rpx' }"
                >
                    {{shopDetailData.createTime | dateformat('YYYY-MM-DD')}}
                </ls-cell-item>
                <!-- 只有企业类型店铺(applyForType==1)才要上传营业执照 -->
                <ls-cell-item title="店铺资质"
                    v-if="shopDetailData.applyForType==1"
                    padding="20rpx"
                    :title-style="{ 'color': '#333', 'line-height': '40rpx' }"
                    @click="toCertificate"
                >
                </ls-cell-item>
            </ls-cell-group>
        </view>
        
    </view>
</template>
<script>
import { shopDetail } from '@/api/ModuleShop';

import { mapState } from 'vuex';
export default {
	components: {},
	data() {
		return {
			shopId:'',
            shopDetailData:{}
		};
	},

	onLoad(option) {
        console.log(option)
		this.shopId = option.id || null;
        shopDetail.shopDetail({ shopId:this.shopId }).then(res => {
            if(res.code){
                console.log(res.data)
                this.shopDetailData = res.data
            }
        })
	},
	mounted() {
	},

	methods: {
        toCertificate(){
            uni.navigateTo({
				url: `/ModuleGoods/shopHome/shopCertificate?id=${this.shopId}`
			});
        }
	}
};
</script>
<style scoped>
/* 加这个是为了防止格式化时把stylus代码里的{}和:都去掉 */
page {
	background-color: var(--backgroundcolor);
}
</style>
<style lang="scss" scoped>
</style>
