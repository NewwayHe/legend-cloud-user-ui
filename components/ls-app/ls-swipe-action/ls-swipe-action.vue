<template>
    <view :class="[className]">
        <movable-area class="u-swipe-action" :style="{ backgroundColor: bgColor, '--themescolor': themes.color }">
            <movable-view
                class="u-swipe-view"
                @change="change"
                @touchend="touchend"
                @touchstart="touchstart"
                direction="horizontal"
                :disabled="disabled"
                :x="moveX"
                :style="{
                    width: movableViewWidth ? movableViewWidth : '100%'
                }"
            >
                <view class="u-swipe-content" @tap.stop="contentClick">
                    <slot></slot>
                </view>
                <view
                    class="u-swipe-del"
                    v-if="showBtn"
                    @tap.stop="btnClick(index)"
                    :style="[btnStyle(item.style)]"
                    v-for="(item, index) in options"
                    :key="index"
                >
                    <view class="u-btn-text">{{ item.text }}</view>
                </view>
            </movable-view>
        </movable-area>
    </view>
</template>

<script>
/**
 * swipeAction 左滑单元格
 * @description 该组件一般用于左滑唤出操作菜单的场景，用的最多的是左滑删除操作。
 * @tutorial https://www.uviewui.com/components/swipeAction.html
 * @property {String} bg-color 整个组件背景颜色（默认#ffffff）
 * @property {Array} options 数组形式，可以配置背景颜色和文字
 * @property {String Number} index 标识符，点击时候用于区分点击了哪一个，用v-for循环时的index即可
 * @property {String Number} btn-width 按钮宽度，单位rpx（默认180）
 * @property {Boolean} disabled 是否禁止某个swipeAction滑动（默认false）
 * @property {Boolean} show 打开或者关闭某个组件（默认false）
 * @event {Function} click 点击组件时触发
 * @event {Function} close 组件触发关闭状态时
 * @event {Function} content-click 点击内容时触发
 * @event {Function} open 组件触发打开状态时
 * @example <u-swipe-action btn-text="收藏">...</u-swipe-action>
 */
export default {
    name: 'LsSwipeAction',
	// #ifdef MP-WEIXIN
	// 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性。这时在<组件name> 里加style和class是不会生效的
	options: { virtualHost: true },
	// #endif
    props: {
		className:{
			type: [String, Array,Boolean],// 这里加个Boolean，是因为如果传className=""，小程序端会报错
			default: ''
		},
        // index值，用于得知点击删除的是哪个按钮
        index: {
            type: [Number, String],
            default: ''
        },
        // 滑动按钮的宽度，单位为rpx
        btnWidth: {
            type: [String, Number],
            default: 136
        },
        // 是否禁止某个action滑动
        disabled: {
            type: Boolean,
            default: false
        },
        // 打开或者关闭组件
        show: {
            type: Boolean,
            default: false
        },
        // 组件背景颜色
        bgColor: {
            type: String,
            default: '#ffffff'
        },
        // 是否使手机发生短促震动，目前只在iOS的微信小程序有效(2020-05-06)
        vibrateShort: {
            type: Boolean,
            default: false
        },
        // 按钮操作参数
        options: {
            type: Array,
            default() {
                return []
            }
        }
    },
    watch: {
        show: {
            immediate: true,
            handler(nVal, oVal) {
                if (nVal) {
                    this.open()
                } else {
                    this.close()
                }
            }
        }
    },
    data() {
        return {
            moveX: 0, // movable-view元素在x轴上需要移动的目标移动距离，用于展开或收起滑动的按钮
            scrollX: 0, // movable-view移动过程中产生的change事件中的x轴移动值
            status: false, // 滑动的状态，表示当前是展开还是关闭按钮的状态
            movableAreaWidth: 0, // 滑动区域
            elId: this.guid(), // id，用于通知另外组件关闭时的识别
            showBtn: false // 刚开始渲染视图时不显示右边的按钮，避免视图闪动
        }
    },
    computed: {
        movableViewWidth() {
            return this.movableAreaWidth + this.allBtnWidth + 'px'
        },
        innerBtnWidth() {
            return uni.upx2px(this.btnWidth)
        },
        allBtnWidth() {
            return uni.upx2px(this.btnWidth) * this.options.length
        },
        btnStyle() {
            return (style) => {
                const css = {}
                style.width = this.btnWidth + 'rpx'
                return style
            }
        }
    },
    mounted() {
        this.getActionRect()
    },
    methods: {
        // 点击按钮
        btnClick(index) {
            this.status = false
            // this.index为点击的几个组件，index为点击某个组件的第几个按钮(options数组的索引)
            this.$emit('click', this.index, index)
        },
        // movable-view元素移动事件
        change(e) {
            this.scrollX = e.detail.x
        },
        // 关闭按钮状态
        close() {
            this.moveX = 0
            this.status = false
        },
        // 打开按钮的状态
        open() {
            if (this.disabled) return
            this.moveX = -this.allBtnWidth
            this.status = true
        },
        // 用户手指离开movable-view元素，停止触摸
        touchend() {
            this.moveX = this.scrollX
            // 停止触摸时候，判断当前是展开还是关闭状态
            // 关闭状态
            // 这一步很重要，需要先给this.moveX一个变化的随机值，否则因为前后设置的为同一个值
            // props单向数据流的原因，导致movable-view元素不会发生变化，切记，详见文档：
            // https://uniapp.dcloud.io/use?id=%e5%b8%b8%e8%a7%81%e9%97%ae%e9%a2%98
            this.$nextTick(function() {
                if (this.status == false) {
                    // 关闭状态左滑，产生的x轴位移为负值，也就是说滑动的距离大于按钮的四分之一宽度，自动展开按钮
                    if (this.scrollX <= -this.allBtnWidth / 4) {
                        this.moveX = -this.allBtnWidth // 按钮宽度的负值，即为展开状态movable-view元素左滑的距离
                        this.status = true // 标志当前为展开状态
                        this.emitOpenEvent()
                        // 产生震动效果
                        if (this.vibrateShort) uni.vibrateShort()
                    } else {
                        this.moveX = 0 // 如果距离没有按钮宽度的四分之一，自动收起
                        this.status = false
                        this.emitCloseEvent()
                    }
                } else {
                    // 如果在打开的状态下，右滑动的距离X轴偏移超过按钮的四分之一(负值反过来的四分之三)，自动收起按钮
                    if (this.scrollX > (-this.allBtnWidth * 3) / 4) {
                        this.moveX = 0
                        this.$nextTick(() => {
                            this.moveX = 101
                        })
                        this.status = false
                        this.emitCloseEvent()
                    } else {
                        this.moveX = -this.allBtnWidth
                        this.status = true
                        this.emitOpenEvent()
                    }
                }
            })
        },
        emitOpenEvent() {
            this.$emit('open', this.index)
        },
        emitCloseEvent() {
            this.$emit('close', this.index)
        },
        // 解决办法为在组件根部再套一个没有任何作用的view元素
        uGetRect(selector, all) {
            return new Promise((resolve) => {
                uni.createSelectorQuery()
                    .in(this)
                    [all ? 'selectAll' : 'select'](selector)
                    .boundingClientRect((rect) => {
                        if (all && Array.isArray(rect) && rect.length) {
                            resolve(rect)
                        }
                        if (!all && rect) {
                            resolve(rect)
                        }
                    })
                    .exec()
            })
        },
        guid(len = 32, firstU = true, radix = null) {
            const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
            const uuid = []
            radix = radix || chars.length

            if (len) {
                // 如果指定uuid长度,只是取随机的字符,0|x为位运算,能去掉x的小数位,返回整数位
                for (let i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
            } else {
                let r
                // rfc4122标准要求返回的uuid中,某些位为固定的字符
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
                uuid[14] = '4'

                for (let i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | (Math.random() * 16)
                        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
                    }
                }
            }
            // 移除第一个字符,并用u替代,因为第一个字符为数值时,该guuid不能用作id或者class
            if (firstU) {
                uuid.shift()
                return 'u' + uuid.join('')
            } else {
                return uuid.join('')
            }
        },
        // 开始触摸
        touchstart() {},
        getActionRect() {
            this.uGetRect('.u-swipe-action').then((res) => {
                this.movableAreaWidth = res.width
                // 等视图更新完后，再显示右边的可滑动按钮，防止这些按钮会"闪一下"
                this.$nextTick(() => {
                    this.showBtn = true
                })
            })
        },
        // 点击内容触发事件
        contentClick() {
            // 点击内容时，如果当前为打开状态，收起组件
            if (this.status == true) {
                this.status = 'close'
                this.moveX = 0
            }
            this.$emit('content-click', this.index)
        }
    }
}
</script>

<style scoped lang="scss">
.u-swipe-action {
    width: auto;
    height: initial;
    position: relative;
    overflow: hidden;
}

.u-swipe-view {
    display: flex;
    height: initial;
    position: relative;
    /* 这一句很关键，覆盖默认的绝对定位 */
}

.u-swipe-content {
    flex: 1;
}

.u-swipe-del {
    position: relative;
    font-size: 30rpx;
    color: #ffffff;
    background-color: var(--themescolor);
    margin-right: -2rpx;
}

.u-btn-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
