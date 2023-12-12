<template>
    <view class="time" :style="{ color: theme ? themes.color : '' }" :class="[className]">
        <view v-if="custom == false">
            <slot>{{ formattedTime }}</slot>
        </view>

        <view v-if="custom == true">
            <slot :times="timeData"></slot>
        </view>
    </view>
</template>

<script>
import { mapState } from 'vuex'
export default {
	// #ifdef MP-WEIXIN
	// 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性。这时在<组件name> 里加style和class是不会生效的
	options: { virtualHost: true },
	// #endif
    props: {
		className:{
			type: [String, Array,Boolean],//这里加个Boolean，是因为如果传className=""，小程序端会报错
			default: ''
		},
        // 是否显示自定义倒计时
        custom: {
            type: Boolean,
            default: false
        },
        theme: {
            // 文字的颜色是否为主题颜色
            type: Boolean,
            default: false
        },
        text: {
            type: String
        },
        // 倒计时时长，单位毫秒
        time: {
            type: [Number, String],
            default: 0
        },
        // 时间格式，DD-日，HH-时，mm-分，ss-秒，SSS-毫秒
        format: {
            type: String,
            default: 'HH:mm:ss'
        },
        // 是否自动开始倒计时  默認是 自動
        autoStart: {
            type: Boolean,
            default: true
        },
        // 是否开启毫秒级渲染  默認是 不開啓
        millisecond: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            remain: 0,
            rafId: null,
            currentTime: 0
        }
    },
    computed: {
        ...mapState(['timeDiff']),
        timeData() {
            return this.parseTimeData(this.remain)
        },
        formattedTime() {
            return !this.custom && this.parseFormat(this.format, this.timeData)
        }
    },
    watch: {
        time: {
            handler() {
                this.reset()
            },
            immediate: true
        }
    },
    created() {
        this.currentTime = Date.now() - this.timeDiff
    },

    // #ifdef MP-WEIXIN
    onReady() {
        // console.log('备注：只有‘小程序’才走onReady');
    },
    // #endif

    // #ifndef MP-WEIXIN
    mounted() {
        // console.log('备注：‘H5+app’只走mounted不走onReady');
    },
    // #endif
    destroyed() {
        if (this.rafId) {
            this.pause()
        }
    },
    methods: {
        // 开始
        start() {
            this.tick()
        },

        // 暂停
        pause() {
            clearTimeout(this.rafId)
        },

        // 重置
        reset() {
            if (this.timeDiff) {
                this.remain = this.time * 1 - (Date.now() - this.timeDiff)
            }
            if (this.remain < 0) {
                this.remain = 0
            }
            if (this.autoStart) {
                this.start()
            }
        },

        tick() {
            if (this.millisecond) {
                this.microTick()
            } else {
                this.macroTick()
            }
        },

        microTick() {
            this.rafId = setTimeout(() => {
                this.setRemain(this.getRemain())
                if (this.remain !== 0) {
                    this.microTick()
                }
            }, 1000)
        },

        macroTick() {
            this.rafId = setTimeout(() => {
                const remain = this.getRemain()

                if (!this.isSameSecond(remain, this.remain) || remain === 0) {
                    this.setRemain(remain)
                }

                if (this.remain !== 0) {
                    this.macroTick()
                }
            }, 1000)
        },

        setRemain(remain) {
            this.remain = remain
            if (remain === 0) {
                this.pause()
                if (this.currentTime > this.time * 1) {
                    return
                }
                this.$emit('finish')
            }
        },

        getRemain() {
            return this.timeDiff && Math.max(this.time * 1 - (Date.now() - this.timeDiff), 0)
        },

        isSameSecond(time1, time2) {
            return Math.floor(time1 / 1000) === Math.floor(time2 / 1000)
        },

        parseFormat(format, timeData) {
            const { days } = timeData
            let { hours, minutes, seconds, milliseconds } = timeData
            if (format.indexOf('DD') === -1) {
                hours = hours * 1
                hours += days * 24
            } else {
                format = format.replace('DD', days)
            }

            if (format.indexOf('HH') === -1) {
                minutes += hours * 60
            } else {
                format = format.replace('HH', this.padZero(hours))
            }

            if (format.indexOf('mm') === -1) {
                seconds += minutes * 60
            } else {
                format = format.replace('mm', minutes)
            }

            if (format.indexOf('ss') === -1) {
                milliseconds += seconds * 1000
            } else {
                format = format.replace('ss', seconds)
            }
            return format.replace('SSS', milliseconds)
        },

        parseTimeData(time) {
            const SECOND = 1000
            const MINUTE = 60 * SECOND
            const HOUR = 60 * MINUTE
            const DAY = 24 * HOUR
            const days = Math.floor(time / DAY)
            const hours = this.padZero(Math.floor((time % DAY) / HOUR))
            const minutes = this.padZero(Math.floor((time % HOUR) / MINUTE))
            const seconds = this.padZero(Math.floor((time % MINUTE) / SECOND))
            const milliseconds = this.padZero(Math.floor(time % SECOND))
            return {
                days,
                hours,
                minutes,
                seconds,
                milliseconds
            }
        },

        padZero(num, targetLength = 2) {
            if (targetLength === void 0) {
                targetLength = 2
            }
            var str = num + ''
            while (str.length < targetLength) {
                str = '0' + str
            }
            return str
        }
    }
}
</script>

<style lang="scss">
.counting-clock {
    display: flex;
    justify-content: center;
    position: relative;
    margin-left: 0;
    margin-right: 0;
    margin-top: 3px;
}
.counting-clock .nums {
    line-height: 18px;
    min-width: 20px;
    padding: 0 2px;
    color: #fff;
    text-align: center;
    border-radius: 5px;
    background-color: var(--themescolor);
    font-family: arial;
    display: inline-block;
    font-size: 12px;
    vertical-align: top;
}
.counting-clock .wxIcon {
    font-size: 14px;
    color: var(--themescolor);
    display: inline-block;
    vertical-align: top;
    line-height: 15px;
    margin: 0 3px;
}

.countTime {
    display: flex;
    justify-content: center;
    position: relative;
    margin-left: 0;
    margin-right: 0;
    margin-top: 3px;
}
.countTime .countNum {
    line-height: 18px;
    min-width: 20px;
    padding: 0 2px;
    color: #fff;
    text-align: center;
    -webkit-border-radius: 2px;
    border-radius: 2px;
    background-color: var(--themescolor);
    font-family: arial;
    display: inline-block;
    font-size: 12px;
    vertical-align: top;
}
.countTime .wxIcon {
    font-size: 14px;
    color: var(--themescolor);
    display: inline-block;
    vertical-align: top;
    line-height: 15px;
    margin: 0 3px;
}
</style>
