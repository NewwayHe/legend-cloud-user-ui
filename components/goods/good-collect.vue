<template>
    <!-- /*
     * @Descripttion:商品详情楼层：收藏按钮(心形)
    */ -->
    <view class="flex-col-center text-999 font-20" @click="changeFavorite" v-if="hasRequest">
        <text class="iconfont" :class="[!favoriteStatus?'icon-guanzhu':'icon-aixin']" :style="{color:!favoriteStatus?'':themes.color,fontSize:`44rpx`}"></text>
        <text class="font-20" v-if="showFont">{{ favoriteStatus == false ? '收藏' : '取消' }}</text>
    </view>
</template>

<script>
import { goodsApi } from '@/api/ModuleGoods.js'
export default {
    name: 'GoodCollect',
    components: {},

    props: {
        spu: {
            type: Object,
            required: true
        },
        showFont: { // 是否显示'收藏' 和 '取消'文字
            type: Boolean,
            default: true
        },
    },

    data() {
        return {
            favoriteStatus: false,
            hasRequest: false // 记录是否已经请求isExistsFavorite接口(解决如果是已经关注了，一进页面，会先显示灰色心形然后瞬间显示有色心形的体验问题)
        }
    },

    computed: { },
    watch: {
        spu: {
            handler(val) {
                this.getFavoriteStatus()
            },
            immediate: true
        }
    },
    created() {},
    methods: {
        // 点击收藏
        changeFavorite() {
            console.log('add')
            goodsApi
                .saveFavorite({
                    productIds: [this.spu.id],
                    collectionFlag: !this.favoriteStatus
                })
                .then((res) => {
                    this.favoriteStatus = !this.favoriteStatus
                    uni.showToast({ title: `${this.favoriteStatus ? '收藏成功' : '取消收藏'}`, icon: 'none' })
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 商品是否收藏
        getFavoriteStatus() {
            this.hasRequest = true
            this.favoriteStatus = this.spu.collectionFlag
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
