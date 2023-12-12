<template>
    <!-- 横向 -->
    <view class="flex-col-start overflow-h" :style="{  '--themescolor': themes.color,'--themesrgba': themes.rgb06 }" @click="myEvent()">
        <view class="position-relative w-100" style="height: 375rpx" v-if="parmas">
            <ls-image :src="pic" :options="{ w: '100%', h: '100%' }" :osOptions="{ w: 500 }"/>
            <view class="has-activity flex-center" v-if="parmas.prodType == 'G'"><text>团购商品</text></view>
            <view class="has-activity flex-center" v-if="parmas.prodType == 'S'"><text>二手商品</text></view>
            <view class="has-activity flex-center" v-if="parmas.prodType == 'D'"><text>打折商品</text></view>
        </view>

        <view class="flex-col-start px-2 mt-1 pb-2 w-100">
            <view class="font-28" style="min-height: 80rpx">
				<text class="line-clamp2">{{name}}</text>
			</view>
            <view class="font-24 w-100 py-1 border-box">
                <view class="line-clamp1" :style="{ color: themes.color, fontFamily: 'arial' }">
                    <text class="font-weight">￥</text>
                    <text class="font-32">{{ price(money)[0] }}</text>
                    <text v-if="price(money)[1]">.{{price(money)[1]}}</text>
                </view>
            </view>

            <template v-if="comments == true && type == 1 && parmas">
                <view class="flex-start" v-if="parmas.comments >= 0">
                    <text class="has-shopType flex-center" v-if="parmas.shopType == 0"><text>专营店</text></text>
                    <text class="has-shopType flex-center" v-if="parmas.shopType == 1"><text>旗舰店</text></text>
                    <text class="has-shopType flex-center" v-if="parmas.shopType == 2"><text>自营店</text></text>
                    <text class="font-24 text-999">
                        {{ parmas.comments >= 9999 ? Math.floor(parmas.comments / 1000) / 10 + 'w' : parmas.comments }}条评论
                    </text>
                </view>
            </template>

            <!-- shopIndex店铺主页专用 -->
            <template v-if="comments == true && type == 2 && parmas">
                <view class="flex-start font-24 text-999">
                    <text class="pr-2">{{ parmas.comments }}条评论</text>
                    <text>{{ !parmas.goodCommentsPercent ? '0%' : parmas.goodCommentsPercent }}好评</text>
                </view>
            </template>
            <!-- /shopIndex店铺主页专用 -->
        </view>
    </view>
    <!-- 横向 -->
</template>

<script>
export default {
    components: {},
    props: {
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
    watch: {
        parmas(newValue, oldValue) {}
    },
    data() {
        return {
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
    created() {},
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
    font-size: 28rpx;
    width: 99%;
    background-color: var(--themesrgba);
    height: 50rpx;
}
.has-shopType {
    font-size: 20rpx;
    color: var(--themescolor);
    border: 1px solid var(--themescolor);
    padding: 0 8rpx 0 8rpx;
    border-radius: 32rpx;
}
</style>

<!-- 用法：
    注意：其父组件要加入这个class：grid-column2
    <view class="grid-column2" v-if="!goodsType">
        <ProList @myEvent="enterGoods" :parmas="item" :src="item.pic" :name="item.name" :money="item.cash" v-for="(item, index) in searchArr" :key="index"></ProList>
    </view>
-->
