<template>
    <view class="w750" :style="{ '--themescolor': themes.color }">
        <ls-header showHeadSelect title="店铺资质"></ls-header>
        <view class="mt-2" v-if="certificateData.companyName">
            <text>
                公司名称:{{certificateData.companyName}}
            </text>
        </view>
        <view class="mt-2" v-if="certificateData.unifiedSocialCreditCode">
            <text>
                统一社会信用代码:{{certificateData.unifiedSocialCreditCode}}
            </text>
        </view>
        <view class="mt-2" v-if="certificateData.corporateName">
            <text>
                法人姓名：{{certificateData.corporateName}}
            </text>
        </view>
        <view class="mt-2" v-if="certificateData.shopCompleteAddress">
            <text>
                店铺完整地址：{{certificateData.shopCompleteAddress}}
            </text>
        </view>
        <view class="mt-2" v-if="certificateData.registeredCapital">
            <text>
                注册资金：{{certificateData.registeredCapital}}
            </text>
        </view>
        <view class="mt-2" v-if="certificateData.businessLicenseTime">
            <text>
                营业期限：{{certificateData.businessStartTime | dateformat('YYYY-MM-DD')}}
                <template v-if="certificateData.businessEndTime">{{" 至 "}}{{ certificateData.businessEndTime | dateformat('YYYY-MM-DD')}}</template>
                <template v-else>{{' 至 长期'}}</template>
            </text>
        </view>
        <view class="mt-2" v-if="certificateData.businessScope">
            <text>
                经营范围：{{certificateData.businessScope}}
            </text>
        </view>

        <div class="license_title">营业执照</div>
        <ls-image :options="{w:'100%',br:'20',bg:'#fff'}" :src="certificateData.businessLicense" :key="certificateData.businessLicense" isPreview></ls-image>
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
            certificateData:{}
		};
	},

	onLoad(option) {
        console.log(option)
		this.shopId = option.id || null;
        this.themesColor = option.themesColor
        shopDetail.getshopDetailDocuments({shopId:this.shopId}).then(res=>{
            if(res.code){
                this.certificateData = res.data
            }
        })
	},
	mounted() { },

	methods: { }
};
</script>
<style lang="scss" scoped>
.license_title{
    margin-top: 60rpx;
    background-color: #f5f4f4;
    height: 80rpx;
    line-height: 80rpx;
    margin-bottom: 30rpx;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    &::before, &::after {
    content: "";
    display: inline-block;
    width: 10px;
    height: 10px;
    background: no-repeat center / 10px url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAASCAYAAAC5DOVpAAABE0lEQVQ4jbXTv0oDQRDH8U+CiJ2KjaWgYKOFf/AV7K3stI6WIih5gGilRYyWlr6CD6GNryLY+IfBiRyX5HIJODDszsxvvru3t9vodrvGWAPXOMd3lbQ5joQDnOVYaeNgs+jk/CrjqXfWwlrOVzOeCraAdinXznxt2Aw2cYulUi3iG2ykbqBxD9vpWymcq9jxUfoH3vCKl/CA7eCuonmUxYK76WGt+MweLqaAFS36e/0z6xSuwKT219ss0ycEhf6yH5T/5gmea4JCd1p8YmVYFN5rwkL3VUwMu2crNWEDun+FzWOxlIuzOR5ylqEL/UhYf7VPPOWr2MdjjhFHPuoDuyvDlvGAdRzmUylaxJGP+n3qfw0/zywq0ODlbuQAAAAASUVORK5CYII=);
}
}
</style>
