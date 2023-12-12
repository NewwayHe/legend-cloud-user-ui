<template>
    <!-- 竖向 -->
    <view
        :class="className"
        class="flex-around p-2 overflow-h"
        :style="{ '--themescolor': themes.color, '--themesrgba': themes.rgb06 }"
        @click="myEvent()"
    >
        <view class="position-relative" style="height: 180rpx">
            <ls-image :src="pic" :options="{ w: '180', h: '180' }"/>
            <view class="has-activity flex-center" v-if="parmas.prodType == 'G'"><text>团购商品</text></view>
            <view class="has-activity flex-center" v-if="parmas.prodType == 'S'"><text>二手商品</text></view>
            <view class="has-activity flex-center" v-if="parmas.prodType == 'D'"><text>打折商品</text></view>
        </view>

        <view class="right position-relative flex-1 flex-col-between w-100 pl-2" style="height: 180rpx">
            <view class="font-28 line-clamp2">{{ name }}</view>
            <view class="font-24 position-absolute w-100 pr-2 border-box text-left" style="bottom: 50rpx">
                <view class="line-clamp1 text-main" :style="{ fontFamily: 'arial' }">
                    <text class="font-weight">￥</text>
                    <text class="font-32">{{ price(money)[0] }}</text>
                    <text v-if="price(money)[1]">.{{price(money)[1]}}</text>
                </view>
            </view>

            <template v-if="comments == true && type == 1">
                <view class="flex-start" v-if="parmas.comments >= 0">
                    <text class="has-shopType flex-center" v-if="parmas.shopType == 0"><text>专营店</text></text>
                    <text class="has-shopType flex-center" v-if="parmas.shopType == 1"><text>旗舰店</text></text>
                    <text class="has-shopType flex-center" v-if="parmas.shopType == 2"><text>自营店</text></text>
                    <text class="font-24 text-999 pl-2">
                        {{ parmas.comments >= 9999 ? Math.floor(parmas.comments / 1000) / 10 + 'w' : parmas.comments }}条评论
                    </text>
                </view>
            </template>

            <!-- shopIndex店铺主页专用 -->
            <template v-if="comments == true && type == 2">
                <view class="flex-start font-24 text-999">
                    <text class="pr-2">{{ parmas.comments ? parmas.comments : '0' }}条评论</text>
                    <text v-if="false">{{ !parmas.goodCommentsPercent ? '0%' : parmas.goodCommentsPercent }}好评</text>
                </view>
            </template>
            <!-- /shopIndex店铺主页专用 -->
        </view>
    </view>
    <!-- 竖向 -->
</template>

<script>
export default {
    components: {},
    data() {
        return { }
    },
    props: {
        className: String,
        parmas: Object,
        pic: String,
        name: String,
        money: [Number, String],
        /**
         * 是否显示评论
         */
        comments: {
            type: Boolean,
            default: true
        },
        /**
         * 1：一般页面上用(显示专营店与多少条评论)，2：shopIndex店铺主页专用(不显示专营店，显示评论与好评率)
         */
        type: {
            type: [Number, String],
            default: 1
        }
    },
    computed: {
        price() {//统一管理商品价格
            return function(money) {
                let arr = []
                if (money&&money.toString().indexOf("~")!=-1) {//判断money是否为1.00~2.00的模式
                    arr = [money,'']
                }else{
                    arr = this.$stringUtils.formatNumber(money ? money : 999)
                }
                return  arr
            }
        },
    },
    created() { },
    methods: {
        myEvent() {
            this.$emit('myEvent', this.parmas)
        }
    }
}
</script>

<style lang="scss" scoped>
.has-activity {
    position: absolute;
    bottom: 0;
    right: 0;
    color: #ffffff;
    font-size: 24rpx;
    width: 100%;
    background-color: var(--themesrgba);
    height: 40rpx;
}
.right:after {
    content: ' ';
    display: block;
    width: auto;
    height: 1px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: -20rpx;
    background: #f1f1f1;
}
.has-shopType {
    font-size: 20rpx;
    color: var(--themescolor);
    border: 1px solid var(--themescolor);
    padding: 0 8rpx 0 8rpx;
    border-radius: 32rpx;
}
</style>
