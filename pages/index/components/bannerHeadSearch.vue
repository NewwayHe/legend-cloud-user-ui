<template>
    <!-- /*
     * @Descripttion:楼层(楼层组件：轮播图)
     * 备注：即当后台设置了【启动搜索栏】时，则要将该轮播图的overflow:hidden去掉
     *      并且将图片改为相对定位(底部平齐banner的底部，图片宽度不变，高度自动变化，保持原图宽高比不变，这时如果该图片足够高，可以做出像京东那样的下拉出现广告图的效果)
     * 注意：下面的style="transform: translate3d(0, 0, 0)"不能删，是为了兼容IOS不兼容border-radius的bug
    */ -->
    <view
        class="position-relative search-isFirstFloor"
        style="transform: translate3d(0, 0, 0)"
        :style="{ height: `calc(${floors.height * 2}rpx + ${stausBarHeight}px)`}"
        v-if="floors && floors.imgList && floors.imgList.length&&parmas.head&&parmas.head.type=='searchAndBanner'&&parmas.head.data.searchAndBannerData.showBanner"
    >
        <!-- 如果有两张及以上图片时才用swiper组件 -->
        <swiper
            class="position-absolute w-100 h-100 left-0 bottom-0"
            :class="'indicator-' + floors.indicatorDots"
            :autoplay="floors.autoplay"
            :interval="floors.interval"
            :circular="floors.loop"
            :indicator-dots="false"
            :indicator-color="indicatorNavRGB03"
            :indicator-active-color="indicatorNavRGB09"
            :current="current"
            :disable-touch="floors.imgList.length <= 1"
            @change="swiperChange"
        >
            <swiper-item class="position-relative" v-for="(item, index) in floors.imgList" :key="index">
				<view class="w-100 position-absolute left-0 bottom-0">
					<ls-image
						:options="{ w: '100%' }"
						:osOptions="{ w: '750' }"
						:mode="'aspectFill'"
						:src="item.img"
						:lazyLoad="false"
						@click="jumpPage(item.url)"
					/>
				</view>
                <view
                    class="flex-start zindex-2 position-absolute bottom-0 left-0 w-100 text-white"
                    style="height: 80rpx"
                    :style="{ backgroundColor: indicatorNavRGB02 }"
                    v-if="floors.indicatorDots == 'nav'"
                >
                    <view class="pl-3 font-24">{{ index + 1 }}/{{ floors.imgList.length }}</view>
                    <view class="flex-1 line-clamp2 pl-3 font-20">{{ item.content }}</view>
                </view>
            </swiper-item>
        </swiper>

        <!-- 如果只有一张图片，则不显示指示器 -->
        <template v-if="floors.imgList.length > 1">
            <view
                class="zindex-2 position-absolute bottom-0 left-0 w-100 overflow-h p-2 border-box"
                :class="[startMidEnd]"
                v-if="floors.indicatorDots == 'default'"
            >
                <view
                    class="rounded-circle mr-1 flex-center transition-all05"
                    style="height: 4rpx"
                    :style="{
                        backgroundColor: indexNum == current ? indicatorNavRGB09 : indicatorNavRGB03,
                        width: indexNum == current ? '30rpx' : '15rpx'
                    }"
                    v-for="(itemNum, indexNum) in floors.imgList.length"
                    :key="indexNum"
                ></view>
            </view>
            <view
                class="zindex-2 position-absolute bottom-0 left-0 w-100 overflow-h p-2 border-box"
                :class="[startMidEnd]"
                v-if="floors.indicatorDots == 'dot'"
            >
                <view
                    class="rounded-circle mr-1 flex-center transition-all05"
                    style="width: 14rpx; height: 14rpx; border-radius: 14rpx"
                    :style="{ backgroundColor: indexNum == current ? indicatorNavRGB09 : indicatorNavRGB03 }"
                    v-for="(itemNum, indexNum) in floors.imgList.length"
                    :key="indexNum"
                ></view>
            </view>
            <view
                class="zindex-2 position-absolute bottom-0 left-0 w-100 overflow-h p-2 border-box"
                :class="[startMidEnd]"
                v-if="floors.indicatorDots == 'round'"
            >
                <view
                    class="rounded-circle mr-1 flex-center transition-all05"
                    style="height: 14rpx; border-radius: 14rpx"
                    :style="{
                        backgroundColor: indexNum == current ? indicatorNavRGB09 : indicatorNavRGB03,
                        width: indexNum == current ? '28rpx' : '14rpx'
                    }"
                    v-for="(itemNum, indexNum) in floors.imgList.length"
                    :key="indexNum"
                ></view>
            </view>
            <view
                class="zindex-2 position-absolute bottom-0 left-0 w-100 text-white overflow-h p-2 font-20 border-box"
                :class="[startMidEnd]"
                v-if="floors.indicatorDots == 'indexes'"
            >
                <view
                    class="rounded-circle mr-1 flex-center"
                    style="width: 40rpx; height: 40rpx"
                    :style="{ backgroundColor: indexNum == current ? indicatorNavRGB09 : indicatorNavRGB03 }"
                    v-for="(itemNum, indexNum) in floors.imgList.length"
                    :key="indexNum"
                >
                    <text>{{ indexNum + 1 }}</text>
                </view>
            </view>
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
        }
    },
    data() {
        return {
            current: 0, // 当前的索引
        }
    },
    computed: {
        ...mapState(['stausBarHeight']),
        indicatorColor(){ // 指示器颜色
            return this.floors.indicatorThemeColor ? this.parmas.themeColor : this.floors.indicatorColor
        },
        indicatorNavRGB02() {
            const rgb = this.$utils.color.colorRgb(this.indicatorColor)    
            return `rgba(${rgb.r}, ${rgb.g},${rgb.b},.2)`
        },
        indicatorNavRGB03() {
            const rgb = this.$utils.color.colorRgb(this.indicatorColor)    
            return `rgba(${rgb.r}, ${rgb.g},${rgb.b},.3)`
        },
        indicatorNavRGB09() {
            const rgb = this.$utils.color.colorRgb(this.indicatorColor)    
            return `rgba(${rgb.r}, ${rgb.g},${rgb.b},.9)`
        },
        startMidEnd() {
            return this.floors.indicatorPosition == 'left' ? 'flex-start' : this.floors.indicatorPosition == 'right' ? 'flex-end' : 'flex-center'
        }
    },
    watch: {},
    created() {
    },
    mounted() {
        this.getOffsetBot()
    },
    destroyed() {},
    methods: {
        // 轮播图指示器改变
        swiperChange(e) {
            // 判断轮播图是由用户touch切换还是轮播图的自动切换引起，防止出现两个事件叠加在一起时同时触发change事件导致this.current不停被赋值
            if (e.detail.source == 'autoplay' || e.detail.source == 'touch') {
                this.current = e.target.current
            }
        },
        
        async getOffsetBot() {
            const tabRect = await this.$utils.getRect(this,'.search-isFirstFloor');
            if (tabRect.bottom) {
				this.$emit('offsetBottom', tabRect.bottom + 100)
            } else {
				this.$emit('offsetBottom', 320)
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.search-isFirstFloor {
    /deep/ .uni-swiper__warp {
        overflow: unset;
        .uni-swiper-item {
            overflow: unset;
        }
    }
}
</style>
