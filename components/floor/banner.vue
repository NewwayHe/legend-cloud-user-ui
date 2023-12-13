<template>
    <!-- /*
     * @Descripttion:楼层(楼层组件：轮播图)：banner
     * 备注：当parmas.searchData.show && isFirstFloor这个判断成立时(即当后台设置了【启动搜索栏】并且该轮播图是第一楼层时)，则要将该轮播图的overflow:hidden去掉
     *      并且将图片改为相对定位(底部平齐banner的底部，图片宽度不变，高度自动变化，保持原图宽高比不变，这时如果该图片足够高，可以做出像京东那样的下拉出现广告图的效果)
     * 注意：下面的style="transform: translate3d(0, 0, 0)"不能删，是为了兼容IOS不兼容border-radius的bug
    */ -->
    <view
        class="position-relative"
        :class="[{ borderRadius: floors.borderRadius }]"
        style="transform: translate3d(0, 0, 0)"
        :style="{ height: floors.height * 2 + 'rpx', padding: floors.cardType == '2' ? `${padding * 2}rpx` : '' }"
        v-if="floors.data && floors.data.imgList && floors.data.imgList.length"
    >
        <!-- 如果不是堆叠式 -->
        <template v-if="floors.cardType != '2'">
            <!-- 如果有两张及以上图片时才用swiper组件 -->
            <swiper
                class="position-absolute left-0 bottom-0 w-100"
                :style="{ height: '100%' }"
                :autoplay="floors.autoplay"
                :interval="floors.interval"
                :circular="floors.loop"
                :vertical="floors.vertical"
                :indicator-dots="false"
                :indicator-color="indicatorNavRGB03"
                :indicator-active-color="indicatorNavRGB09"
                :current="current"
                :previous-margin="previousMargin"
                :next-margin="previousMargin"
                :disable-touch="floors.data.imgList.length <= 1"
                @change="swiperChange"
            >
                <swiper-item class="swiper-item position-relative" v-for="(item, index) in floors.data.imgList" :key="index">
                    <view
                        class="list-image-wrap"
                        :class="[{ 'list-scale': current != index }]"
                        :style="{
                            transform: floors.cardType == '1' && current != index ? 'scaleY(0.83)' : 'scaleY(1)',
                            margin: floors.cardType == '1' && current != index ? '0 20rpx' : 0,
                            borderRadius: floors.borderRadius ? '24rpx' : ''
                        }"
                    >
                        <ls-image
                            :options="{ w: '100%', h: '100%' }"
                            :osOptions="{ w: '750' }"
                            :src="item.img"
							:lazyLoad="false"
                            @click="jumpPage(item.url,shopId)"
                        />
                        <template v-if="floors.indicatorDots == 'nav'">
                            <view
                                class="flex-start zindex-2 position-absolute bottom-0 left-0 w-100 text-white"
                                style="height: 80rpx"
                                :style="{ backgroundColor: indicatorNavRGB02 }"
                                v-if="!floors.vertical"
                            >
                                <view class="pl-3 font-24">{{ index + 1 }}/{{ floors.data.imgList.length }}</view>
                                <view class="flex-1 line-clamp2 pl-3 font-20">{{ item.content }}</view>
                            </view>
                            <view
                                class="zindex-2 position-absolute bottom-0 right-0 h-100 text-white overflow-h text-wrap"
                                style="width: 80rpx"
                                :style="{ backgroundColor: indicatorNavRGB02 }"
                                v-if="floors.vertical"
                            >
                                <view class="pt-2 font-20 text-center">{{ index + 1 }}/{{ floors.data.imgList.length }}</view>
                                <view class="pt-2 font-20 m-0-auto" style="width: 24rpx">{{ item.content }}</view>
                            </view>
                        </template>
                    </view>
                </swiper-item>
            </swiper>
        </template>
        <!-- 如果是堆叠式轮播图 -->
        <template v-else>
            <view class="position-relative h-100 overflow-h" @touchmove="TowerMove" @touchstart="TowerStart" @touchend="TowerEnd">
                <view
                    class="position-absolute bottom-0 h-100"
                    v-for="(item, index) in swiperList"
                    :key="index"
                    :style="{ left: previousMarginLeft, width: `${floors.cardWidth}%` }"
                    :data-direction="direction"
                >
                    <view
                        class="position-relative h-100 w-100 transition-all05 overflow-h"
                        :style="{
                            borderRadius: floors.borderRadius ? '24rpx' : '',
                            transform: `translateX(${
                                item.mLeft > 0 ? previousMarginRight : item.mLeft < 0 ? '-' + previousMarginRight : '0'
                            }) scale(${item.mLeft == 0 ? '1' : '0.83'})`,
                            zIndex: item.zIndex
                        }"
                    >
                        <ls-image
                            :options="{ w: '100%', h: '100%' }"
                            :osOptions="{ w: '750' }"
                            :src="item.img"
							:lazyLoad="false"
                            @click="jumpPage(item.url,shopId)"
                        />

                        <template v-if="floors.indicatorDots == 'nav'">
                            <view
                                class="flex-start zindex-2 position-absolute bottom-0 left-0 w-100 text-white"
                                style="height: 80rpx"
                                :style="{ backgroundColor: indicatorNavRGB02 }"
                                v-if="!floors.vertical"
                            >
                                <view class="pl-3 font-24">{{ index + 1 }}/{{ floors.data.imgList.length }}</view>
                                <view class="flex-1 line-clamp2 pl-3 font-20">{{ item.content }}</view>
                            </view>
                            <view
                                class="zindex-2 position-absolute bottom-0 right-0 h-100 text-white overflow-h text-wrap"
                                style="width: 80rpx"
                                :style="{ backgroundColor: indicatorNavRGB02 }"
                                v-if="floors.vertical"
                            >
                                <view class="pt-2 font-20 text-center">{{ index + 1 }}/{{ floors.data.imgList.length }}</view>
                                <view class="pt-2 font-20 m-0-auto" style="width: 24rpx">{{ item.content }}</view>
                            </view>
                        </template>
                    </view>
                </view>
            </view>
        </template>

        <!-- 只有一张图片时不显示指示器 -->
        <template v-if="floors.data.imgList.length > 1">
            <template v-if="floors.indicatorDots == 'default'">
                <view
                    class="zindex-99 position-absolute left-0 w-100 overflow-h border-box"
                    :class="[topBottom, startMidEnd, paddingJudge]"
                    v-if="!floors.vertical"
                >
                    <view
                        class="rounded-20 translate3d0 mr-1 flex-center transition-all05"
                        style="height: 8rpx"
                        :style="{
                            backgroundColor: indexNum == current ? indicatorNavRGB09 : indicatorNavRGB03,
                            width: indexNum == current ? '30rpx' : '15rpx'
                        }"
                        v-for="(itemNum, indexNum) in floors.data.imgList.length"
                        :key="indexNum"
                    ></view>
                </view>
                <view
                    class="d-flex flex-column a-end zindex-2 position-absolute bottom-0 w-100 overflow-h border-box"
                    :class="[leftRight, startMidEndColumn, paddingJudge]"
                    :style="{ height: `${floors.height * 2}rpx`, width: '44rpx' }"
                    v-if="floors.vertical"
                >
                    <view
                        class="rounded-circle translate3d0 mb-1 flex-center transition-all05"
                        style="width: 4rpx"
                        :style="{
                            backgroundColor: indexNum == current ? indicatorNavRGB09 : indicatorNavRGB03,
                            height: indexNum == current ? '30rpx' : '15rpx'
                        }"
                        v-for="(itemNum, indexNum) in floors.data.imgList.length"
                        :key="indexNum"
                    ></view>
                </view>
            </template>

            <template v-if="floors.indicatorDots == 'dot'">
                <view
                    class="zindex-99 position-absolute left-0 w-100 overflow-h border-box"
                    :class="[topBottom, startMidEnd, paddingJudge]"
                    v-if="!floors.vertical"
                >
                    <view
                        class="rounded-circle translate3d0 mr-1 flex-center transition-all05"
                        style="width: 14rpx; height: 14rpx; border-radius: 14rpx"
                        :style="{ backgroundColor: indexNum == current ? indicatorNavRGB09 : indicatorNavRGB03 }"
                        v-for="(itemNum, indexNum) in floors.data.imgList.length"
                        :key="indexNum"
                    ></view>
                </view>
                <view
                    class="d-flex flex-column a-end zindex-2 position-absolute bottom-0 w-100 overflow-h border-box"
                    :class="[leftRight, startMidEndColumn, paddingJudge]"
                    :style="{ height: `${floors.height * 2}rpx`, width: '54rpx' }"
                    v-if="floors.vertical"
                >
                    <view
                        class="rounded-circle translate3d0 mb-1 flex-center transition-all05"
                        style="width: 14rpx; height: 14rpx; border-radius: 14rpx"
                        :style="{ backgroundColor: indexNum == current ? indicatorNavRGB09 : indicatorNavRGB03 }"
                        v-for="(itemNum, indexNum) in floors.data.imgList.length"
                        :key="indexNum"
                    ></view>
                </view>
            </template>

            <template v-if="floors.indicatorDots == 'round'">
                <view
                    class="zindex-99 position-absolute left-0 w-100 overflow-h border-box"
                    :class="[topBottom, startMidEnd, paddingJudge]"
                    v-if="!floors.vertical"
                >
                    <view
                        class="rounded-circle translate3d0 mr-1 flex-center transition-all05"
                        style="height: 14rpx; border-radius: 14rpx"
                        :style="{
                            backgroundColor: indexNum == current ? indicatorNavRGB09 : indicatorNavRGB03,
                            width: indexNum == current ? '28rpx' : '14rpx'
                        }"
                        v-for="(itemNum, indexNum) in floors.data.imgList.length"
                        :key="indexNum"
                    ></view>
                </view>
                <view
                    class="d-flex flex-column a-end zindex-2 position-absolute bottom-0 w-100 overflow-h border-box"
                    :class="[leftRight, startMidEndColumn, paddingJudge]"
                    :style="{ height: `${floors.height * 2}rpx`, width: '54rpx' }"
                    v-if="floors.vertical"
                >
                    <view
                        class="rounded-circle translate3d0 mb-1 flex-center transition-all05"
                        style="width: 14rpx; border-radius: 14rpx"
                        :style="{
                            backgroundColor: indexNum == current ? indicatorNavRGB09 : indicatorNavRGB03,
                            height: indexNum == current ? '28rpx' : '14rpx'
                        }"
                        v-for="(itemNum, indexNum) in floors.data.imgList.length"
                        :key="indexNum"
                    ></view>
                </view>
            </template>

            <template v-if="floors.indicatorDots == 'indexes'">
                <view
                    class="zindex-99 position-absolute left-0 w-100 text-white overflow-h font-20 border-box"
                    :class="[topBottom, startMidEnd, paddingJudge]"
                    v-if="!floors.vertical"
                >
                    <view
                        class="rounded-circle translate3d0 mr-1 flex-center"
                        style="width: 40rpx; height: 40rpx"
                        :style="{ backgroundColor: indexNum === current ? indicatorNavRGB09 : indicatorNavRGB03 }"
                        v-for="(itemNum, indexNum) in floors.data.imgList.length"
                        :key="indexNum"
                    >
                        <text>{{ indexNum + 1 }}</text>
                    </view>
                </view>
                <view
                    class="d-flex flex-column a-end zindex-2 position-absolute bottom-0 w-100 text-white overflow-h font-20 border-box"
                    :class="[leftRight, startMidEndColumn, paddingJudge]"
                    :style="{ height: `${floors.height * 2}rpx`, width: `80rpx` }"
                    v-if="floors.vertical"
                >
                    <view
                        class="rounded-circle translate3d0 mb-1 flex-center"
                        style="width: 40rpx; height: 40rpx"
                        :style="{ backgroundColor: indexNum === current ? indicatorNavRGB09 : indicatorNavRGB03 }"
                        v-for="(itemNum, indexNum) in floors.data.imgList.length"
                        :key="indexNum"
                    >
                        <text>{{ indexNum + 1 }}</text>
                    </view>
                </view>
            </template>
        </template>
    </view>
</template>

<script>
import floorMixin from '@/mixins/floor.js'
import { mapState } from 'vuex'
export default {
    components: { },
    filters: {},
    mixins: [floorMixin],
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
            current: 0, // 当前的索引
            cardCur: 0,
            swiperList: this.floors.data.imgList,
            dotStyle: false,
            towerStart: 0,
            direction: '',
            slideDistance: 0, // 滑动距离
            padding: 10, // floors.cardType=='2'堆叠式轮播时有用，单位：px
            timer: null
        }
    },
    computed: {
        ...mapState(['stausBarHeight']),
        indicatorNavRGB02() {
            const rgb = this.$utils.color.colorRgb(this.floors.indicatorThemeColor ? this.parmas.themeColor : this.floors.indicatorColor) 
            return `rgba(${rgb.r}, ${rgb.g},${rgb.b},.2)`
        },
        indicatorNavRGB03() {
            const rgb = this.$utils.color.colorRgb(this.floors.indicatorThemeColor ? this.parmas.themeColor : this.floors.indicatorColor) 
            return `rgba(${rgb.r}, ${rgb.g},${rgb.b},.3)`
        },
        indicatorNavRGB09() {
            const rgb = this.$utils.color.colorRgb(this.floors.indicatorThemeColor ? this.parmas.themeColor : this.floors.indicatorColor) 
            return `rgba(${rgb.r}, ${rgb.g},${rgb.b},.9)`
        },
        // isFirstFloor() { //如果banner图是第一层，则显示的效果会不同
        //     return (this.parmas.floors && this.parmas.floors[0].uuid == this.floors.uuid)?true:false;
        // },
        topBottom() {
            return this.floors.indicatorPosition == 'up-left' || this.floors.indicatorPosition == 'up-right' ? 'top-0' : 'bottom-0'
        },
        leftRight() {
            return this.floors.indicatorPosition == 'up-left' || this.floors.indicatorPosition == 'up-right' ? 'left-0' : 'right-0'
        },
        startMidEnd() {
            return this.floors.indicatorPosition == 'up-right' || this.floors.indicatorPosition == 'down-right'
                ? 'flex-end'
                : this.floors.indicatorPosition == 'up-left' || this.floors.indicatorPosition == 'down-left'
                ? 'flex-start'
                : 'flex-center'
        },
        startMidEndColumn() {
            return this.floors.indicatorPosition == 'up-left' || this.floors.indicatorPosition == 'down-left'
                ? 'j-end'
                : this.floors.indicatorPosition == 'up-right' || this.floors.indicatorPosition == 'down-right'
                ? 'j-start'
                : 'j-center'
        },
        paddingJudge() {
            return this.floors.cardType == '2' ? 'p-4' : 'p-2'
        },
        previousMargin() {
            let cardWidth = 0
            if (this.floors.cardType == '1') {
                const imgWidth = (375 * this.floors.cardWidth) / 100 // 计算出每张图片的宽度
                cardWidth = ((375 - imgWidth) / 2).toFixed(0) // 单位：px
            }
            return cardWidth * 2 + 'rpx'
        },
        previousMarginLeft() {
            let cardWidth = 0
            if (this.floors.cardType == '2') {
                const imgWidth = ((375 - this.padding * 2) * this.floors.cardWidth) / 100 // 计算出每张图片的宽度
                cardWidth = ((375 - this.padding * 2 - imgWidth) / 2).toFixed(0) // 单位：px
            }
            return cardWidth * 2 + 'rpx'
        },
        previousMarginRight() {
            // 当floors.cardType=='2'时，非当前index的右边图片元素的定位值
            let cardWidth = 0
            if (this.floors.cardType == '2') {
                const imgWidth = (((375 - this.padding * 2) * this.floors.cardWidth) / 100) * 0.83 // 计算出非当前图片的宽度(缩放后)
                cardWidth = ((375 - this.padding * 2 - imgWidth) / 2).toFixed(0) // 单位：px
            }
            return cardWidth * 2 + 'rpx'
        }
    },
    watch: {
        'floors.data.imgList': {
            handler(newValue, oldValue) {
                if (newValue) {
                    if (this.floors.cardType == '2') {
                        // 只有堆叠模式才执行以下逻辑
                        this.swiperList = this.floors.data.imgList
                        this.TowerSwiper('swiperList')
                        // 初始化towerSwiper 传已有的数组名即可
                    }
                }
            },
            deep: true,
            immediate: true
        }
    },
    onLoad() {},
    mounted() {
        if (this.floors.cardType == '2') {
            // 只有堆叠模式才用到自定义播放的计时器
            this.interval()
        }
    },
    methods: {
        // 轮播图指示器改变
        swiperChange(e) {
            // 判断轮播图是由用户touch切换还是轮播图的自动切换引起，防止出现两个事件叠加在一起时同时触发change事件导致this.current不停被赋值
            if (e.detail.source == 'autoplay' || e.detail.source == 'touch') {
                this.current = e.target.current
            }
        },
        // towerSwiper
        // 初始化towerSwiper
        TowerSwiper(name) {
            const list = this[name]
            if (list.length == 2) {
                // 如果只有两张图片，就让默认第一张为当前图片
                list[0].zIndex = 3
                list[0].mLeft = 0
                list[1].zIndex = 1
                list[1].mLeft = 1
                this.current = 0
            } else {
                for (let i = 0; i < list.length; i++) {
                    list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
                    list[i].mLeft = i - parseInt(list.length / 2)
                    if (list[i].mLeft === 0) {
                        this.current = i
                    }
                }
            }
            this.swiperList = list
        },
        // towerSwiper触摸开始
        TowerStart(e) {
            clearInterval(this.timer)
            this.towerStart = e.touches[0].pageX
            this.slideDistance = 0
        },
        // towerSwiper计算方向
        TowerMove(e) {
            this.direction = e.touches[0].pageX - this.towerStart > 0 ? 'right' : 'left'
            this.slideDistance = Math.abs(e.touches[0].pageX - this.towerStart)
        },

        // towerSwiper计算滚动
        TowerEnd(e) {
            if (this.slideDistance > 50) {
                // 如果滑动距离超过50px，则切换轮播图
                const direction = this.direction
                const list = this.swiperList
                if (direction == 'right') {
                    const mLeft = list[0].mLeft
                    const zIndex = list[0].zIndex
                    for (let i = 1; i < this.swiperList.length; i++) {
                        this.swiperList[i - 1].mLeft = this.swiperList[i].mLeft
                        this.swiperList[i - 1].zIndex = this.swiperList[i].zIndex
                    }
                    this.swiperList[list.length - 1].mLeft = mLeft
                    this.swiperList[list.length - 1].zIndex = zIndex
                } else {
                    const mLeft = list[list.length - 1].mLeft
                    const zIndex = list[list.length - 1].zIndex
                    for (let i = this.swiperList.length - 1; i > 0; i--) {
                        this.swiperList[i].mLeft = this.swiperList[i - 1].mLeft
                        this.swiperList[i].zIndex = this.swiperList[i - 1].zIndex
                    }
                    this.swiperList[0].mLeft = mLeft
                    this.swiperList[0].zIndex = zIndex
                }
                this.direction = ''
                this.swiperList = this.swiperList
                this.current = this.swiperList.findIndex((item) => item.mLeft === 0)
            }
            this.interval()
        },
        // 计时器
        interval() {
            const that = this
            if (this.floors.autoplay) {
                this.timer = setInterval(() => {
                    const list = this.swiperList
                    const mLeft = list[list.length - 1].mLeft
                    const zIndex = list[list.length - 1].zIndex
                    for (let i = this.swiperList.length - 1; i > 0; i--) {
                        this.swiperList[i].mLeft = this.swiperList[i - 1].mLeft
                        this.swiperList[i].zIndex = this.swiperList[i - 1].zIndex
                    }
                    this.swiperList[0].mLeft = mLeft
                    this.swiperList[0].zIndex = zIndex
                    this.direction = ''
                    this.swiperList = this.swiperList
                    this.current = this.swiperList.findIndex((item) => item.mLeft === 0)
                    this.$forceUpdate()
                }, that.floors.interval)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.borderRadius {
    /* #ifdef MP */
    /deep/ swiper {
        border-radius: 24rpx;
        overflow: hidden;
    }
    /* #endif */
    /* #ifndef MP */
    /deep/ .uni-swiper-wrapper {
        border-radius: 24rpx;
        overflow: hidden;
    }
    /* #endif */
}
.swiper-item {
    display: flex;
    overflow: hidden;
    align-items: center;
}
.list-image-wrap {
    width: 100%;
    height: 100%;
    flex: 1;
    transition: all 0.5s;
    overflow: hidden;
    box-sizing: content-box;
    position: relative;
}
.list-scale {
    transform-origin: center center;
}
</style>
