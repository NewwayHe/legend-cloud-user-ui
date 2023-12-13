<template>
    <!-- 评价列表 -->
    <view
        class="font-28 text-333"
		:class="[showPopup ? 'mask-wrapper-s' : 'mask-wrapper-h',className]"
        :style="{ '--themescolor': themes.color }"
        @touchmove.stop.prevent
        @click.stop.native="clickModal"
    >
        <view
            :class="!showPopup ? '' : 'outer-box center-xy overflow-visible safearea-bb-white w-100'"
            :style="showPopup ? 'transform:translate3d(-50%, -50%, 0);' : 'transform:translate3d(-50%, 120%, 0)'"
        >
            <view class="p-2 position-relative w-100" @click.stop="changePopup">
                <view class="position-absolute center-x" style="bottom: -60rpx; z-index: 999">
                    <view class="close" @click.stop="changePopup"></view>
                </view>
                <slot></slot>
            </view>
        </view>
    </view>
</template>

<script>
export default {
	name: 'LsOverlay',
	// #ifdef MP-WEIXIN
	// 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性。这时在<组件name> 里加style和class是不会生效的
	options: { virtualHost: true },
	// #endif
    props:{
		className:{
			type: [String, Array,Boolean],// 这里加个Boolean，是因为如果传className=""，小程序端会报错
			default: ''
		},
        closeOnClickModal:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            showPopup: false // 显示和隐藏弹框
        }
    },
    computed: { },
    created() {},
    methods: {
        /**
         * 显示和隐藏弹框
         */
        changePopup() {
            this.showPopup = !this.showPopup
            this.$emit('change', this.showPopup)
        },
        clickModal(){
            if(this.closeOnClickModal) {
				this.changePopup()
			}else {
				return 
			}
        }
    }
}
</script>

<style lang="scss" scoped>
.outer-box {
    border-radius: 20rpx 20rpx 0rpx 0rpx;
    transition: transform 0.2s cubic-bezier(0, 0, 0.25, 1);
}
.close {
    width: 60rpx;
    height: 60rpx;
    // background: red;
    position: relative;
    &:before {
        content: '';
        position: absolute;
        top: 50%;
        right: 20%;
        width: 36rpx;
        height: 4rpx;
        background: #c8c9cc;
        transform: rotate(45deg);
        display: inline-block;
        // pointer-events: auto;
    }

    &:after {
        content: '';
        position: absolute;
        top: 50%;
        right: 20%;
        width: 36rpx;
        height: 4rpx;
        background: #c8c9cc;
        transform: rotate(315deg);
        display: inline-block;

        // pointer-events: auto;
    }
}
</style>
