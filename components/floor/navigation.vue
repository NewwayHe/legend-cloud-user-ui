<template>
    <!-- /*
     * @Descripttion:楼层(楼层组件：图文导航)：navigation
    */ -->
    <view
        class="py-2 font-24 position-relative"
		:class="[floors.cardType?'m-2 rounded-20 translate3d0':'']"
        :style="{
            backgroundColor: floors.themeColor ? parmas.themeColor : floors.backgroundColor,
            color: floors.fontThemeColor ? parmas.themeColor : floors.color
        }"
        v-if="floors.data.imgList && floors.data.imgList.length"
    >
        <swiper
            class="w-100"
            :class="'indicator-' + floors.indicatorDots"
            :style="{ height: `${floors.row === 1 ? 146 : 312}rpx` }"
            :autoplay="floors.autoplay"
            :interval="floors.interval * 1"
            :circular="floors.loop"
            :vertical="floors.vertical"
            :indicator-dots="false"
            :indicator-color="indicatorNavRGB03"
            :indicator-active-color="indicatorNavRGB09"
            :disable-touch="imgTwoDimList.length <= 1"
            @change="swiperChange"
            v-if="floors.row === 1 || floors.row === 2"
        >   
            <template v-if="imgTwoDimList && imgTwoDimList.length">
                <swiper-item class="w-100" v-for="(itemTwo, indexTwo) in imgTwoDimList" :key="indexTwo">
                    <view class="w-100 h-100" :class="[`grid-column${floors.col}`]" :style="{ 'grid-template-rows': `repeat(${floors.row}, 1fr)` }">
                        <view class="d-flex a-center j-start flex-column overflow-h" v-for="(item, index) in itemTwo" :key="index">
                            <ls-image :options="{ w: '90', h: '90' }" :src="item.img" @click="jumpPage(item.url,shopId)"/>
                            <view class="text-nowrap p-1" :style="{ color: item.themeColor ? parmas.themeColor : item.color }">
                                {{ item.title }}
                            </view>
                        </view>
                    </view>
                </swiper-item>
            </template>
        </swiper>

        <!-- 如果只有组导航，或者采用‘多次换行’模式，则不用swiper组件 -->
        <view class="w-100" :class="[`grid-column${floors.col}`]" v-else>
            <view class="flex-col-center overflow-h" v-for="(item, index) in floors.data.imgList" :key="index">
                <ls-image :options="{ w: '90', h: '90' }" :src="item.img" @click="jumpPage(item.url,shopId)"/>
                <view class="text-nowrap p-1" :style="{ color: item.themeColor ? parmas.themeColor : item.color }">
                    {{ item.title }}
                </view>
            </view>
        </view>
        <!-- 当swiper有两页以上时，才显示指示器 -->
        <template v-if="imgTwoDimList.length > 1">
            <view
                class="flex-center zindex-2 position-absolute bottom-0 left-0 w-100 overflow-h mb-1"
                v-if="(floors.row === 1 || floors.row === 2) && floors.indicatorDots == 'default'"
            >
                <view
                    class="rounded-circle translate3d0 mr-1 flex-center transition-all05"
                    style="height: 4rpx"
                    :style="{
                        backgroundColor: indexNum == current ? indicatorNavRGB09 : indicatorNavRGB03,
                        width: indexNum == current ? '30rpx' : '15rpx'
                    }"
                    v-for="(itemNum, indexNum) in imgTwoDimList"
                    :key="indexNum"
                ></view>
            </view>
            <view
                class="flex-center zindex-2 position-absolute bottom-0 left-0 w-100 overflow-h mb-1"
                v-if="(floors.row === 1 || floors.row === 2) && floors.indicatorDots == 'dot'"
            >
                <view
                    class="rounded-circle translate3d0 mr-1 flex-center transition-all05"
                    style="height: 14rpx; width: 14rpx; border-radius: 50%"
                    :style="{ backgroundColor: indexNum == current ? indicatorNavRGB09 : indicatorNavRGB03 }"
                    v-for="(itemNum, indexNum) in imgTwoDimList"
                    :key="indexNum"
                ></view>
            </view>
            <view
                class="flex-center zindex-2 position-absolute bottom-0 left-0 w-100 overflow-h mb-1"
                v-if="(floors.row === 1 || floors.row === 2) && floors.indicatorDots == 'round'"
            >
                <view
                    class="rounded-circle translate3d0 mr-1 flex-center transition-all05"
                    style="height: 14rpx; border-radius: 14rpx"
                    :style="{
                        backgroundColor: indexNum == current ? indicatorNavRGB09 : indicatorNavRGB03,
                        width: indexNum == current ? '28rpx' : '14rpx'
                    }"
                    v-for="(itemNum, indexNum) in imgTwoDimList"
                    :key="indexNum"
                ></view>
            </view>
        </template>
    </view>
</template>

<script>
import floorMixin from '@/mixins/floor.js'
export default {
    components: {},
    mixins: [floorMixin],
    filters: {},
    props: {
        floors: {
            type: Object,
            default: () => {
                return {}
            }
        },
        parmas: {
            type: Object,
            default: () => {
                return {}
            }
        },
        shopId: { // 如果有传shopId，则是店铺装修的组件
            type: [String,Number],
            default: ''
        },
    },
    data() {
        return {
            current: 0 // 当前的索引
        }
    },
    computed: {
        indicatorNavRGB03() {
            const rgb = this.$utils.color.colorRgb(this.floors.indicatorThemeColor ? this.parmas.themeColor : this.floors.indicatorColor)  
            return `rgba(${rgb.r}, ${rgb.g},${rgb.b},.3)`
        },
        indicatorNavRGB09() {
            const rgb = this.$utils.color.colorRgb(this.floors.indicatorThemeColor ? this.parmas.themeColor : this.floors.indicatorColor)
            return `rgba(${rgb.r}, ${rgb.g},${rgb.b},.9)`
        },
        imgTwoDimList() {
            // 接收floors.data.imgList转化后的二维数组
            const arr = this.floors.data && this.floors.data.imgList && this.floors.data.imgList.length ? this.floors.data.imgList : []
            const num = this.floors.col && this.floors.row ? this.floors.col * this.floors.row : 1
            return this.$arrayUtils.arrToTwoDim(arr, num)
        }
    },
    watch: {},
    mounted() {},
    destroyed() {},
    methods: {
        // 轮播图指示器改变
        swiperChange(e) {
            this.current = e.target.current
        }
    }
}
</script>

<style lang="scss" scoped></style>
