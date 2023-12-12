<template>
    <!-- /*
     * @Descripttion:商品详情：底部tab栏
    */ -->
    <view
        class="w-100 bg-white shadow safearea-bb-white flex-start position-fixed bottom-0 right-0 content-box"
        style="z-index: 10; border-bottom: var(--safe-area-inset-bottom) solid #FFFFFF;"
        :class="className"
        :style="{ '--themescolor': themes.color }"
    >
        <view class="h-100r flex-center font-20 text-666 text-nowrap">
            <view class="flex-col-center ml-4 w-40r" :class="[{'mr-4':!isShowCS }]" @click="$navigateTo(`/ModuleGoods/shopHome/shopIndex?shopId=${parmas.shopId}`)">
                <text class="iconfont icon-a-dianpu3" style="font-size: 40rpx"></text>
                <text class="u-p-t-8">店铺</text>
            </view>
			<view class="flex-col-center mx-4 w-40r" @click="serviceChat" v-if="isShowCS">
                <text class="iconfont icon-kefu2" style="font-size: 40rpx"/>
                <text class="u-p-t-8">客服</text>
            </view>
            <view class="flex-col-center mr-4 w-40r" @click="$switchTab(`/pages/cart/cart`)">
                <view class="position-relative">
                    <view class="iconfont icon-icon-gouwuche position-relative" style="font-size: 40rpx">
                        <text class="car-num" v-if="cartNum">{{ cartNum > 99 ? '99+' : cartNum }}</text>
                    </view>
                </view>
                <text class="u-p-t-8">购物车</text>
            </view>
        </view>
        <view class="h-100r flex-1 font-28 overflow-h"><slot></slot></view>
    </view>
</template>
<script>
import { mapState } from 'vuex'

import { getMobileUrl } from '@/api/ModulesCommon.js'
	
export default {
    name: 'good-tabBar',

    components: {},

    props: {
        className: String,
        parmas: Object
    },

    data() {
        return {
			resData: {}
        }
    },

    computed: {
        ...mapState(['cartNum', 'systemConfig']),
		isShowCS() {	//是否显示客服
			return this.systemConfig && this.systemConfig.customEnabled
		}
    },

    watch: {},

    created() {},
    mounted() {
		if (this.parmas.shopId) {
			this.$store.dispatch('getContactInfo',this.parmas.shopId).then(res => {
				if (res) {
					this.resData = res
				}
			}).catch((err)=>{
				console.log('获取商家信息err--',err)
			})
		}
    },

    beforeDestroy() {},

    destroyed() {},

    methods: {
        // 去客服
        serviceChat() {
			getMobileUrl({ orgi : this.parmas.shopId, productId: this.parmas.prodId, source: 'H5' }).then(res => {
				if(res) {
					if(res.agents == 0 || res.isInWorkingHours) {
						this.$navigateTo(`/ModuleCenter/contact/contact?shopId=${this.parmas.shopId}&shopContactDTO=${encodeURIComponent(JSON.stringify(this.resData))}`)
					}else {
						this.$u.route({
							url: '/pages/webview/customService',
							params: {
								userid: res.userid,
								orgi: res.orgi,
								session: res.sessionid,
								appid: res.appid,
								skill: res.skill,
								nickname: res.name,
								productId: this.parmas?.prodId||'',
								headimg:result.headimg?(this.$photoServer+result.headimg):'',//用户头像
							}
						})
					}
				}
			})
        },
    }
}
</script>

<style lang="scss" scoped>
.car-num {
    position: absolute;
    top: -8rpx;
    right: -20rpx;
    z-index: 2;
    background-color: var(--themescolor);
    border-radius: 20rpx;
    padding: 0rpx 8rpx;
    font-size: 20rpx;
    color: #fff;
    font-family: PingFangSC-Regular, Helvetica, 'Droid Sans', Arial, sans-serif;
}
</style>
