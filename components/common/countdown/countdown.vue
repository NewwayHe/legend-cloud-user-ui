<template>
    <view style="display: inline" :class="[className]">
        <view class="rest-time" v-if="source == 'apply' && formatEndtime.min">
            <text class="num">{{ formatEndtime.day }}</text>
            天
            <text class="num">{{ formatEndtime.hour }}</text>
            时
            <text class="num">{{ formatEndtime.min }}</text>
            分
        </view>

        <view class="time-box" v-if="source == 'mergeSuccess' && formatEndtime.min" :style="{ color: themes.color }">
            <text class="time-item" :style="{ color: themes.color }">{{ formatEndtime.hour }}</text>
            :
            <text class="time-item" :style="{ color: themes.color }">{{ formatEndtime.min }}</text>
            :
            <text class="time-item" :style="{ color: themes.color }">{{ formatEndtime.sec }}</text>
        </view>

        <view class="des" v-if="source == 'orderDetail'" style="font-size: 12px">
            {{ formatEndtime.day }}天{{ formatEndtime.hour }}时{{ formatEndtime.min }}分{{ formatEndtime.sec }}秒{{ text }}
        </view>

        <view class="counting-clock" v-if="source == 'Detail' && formatEndtime.min">
            <text class="num" v-if="formatEndtime.day > 0">{{ formatEndtime.day }}天</text>
            <text class="wxIcon" v-if="formatEndtime.day > 0">:</text>
            <text class="num">{{ formatEndtime.hour }}</text>
            <text class="wxIcon">:</text>
            <text class="num">{{ formatEndtime.min }}</text>
            <text class="wxIcon">:</text>
            <text class="num">{{ formatEndtime.sec }}</text>
        </view>

        <view class="counting-clock" v-if="source == 'seckillList' && formatEndtime.min" style="font-size: 14px">
            {{ text }}
            <text class="num">{{ formatEndtime.hour }}</text>
            <text class="wxIcon">:</text>
            <text class="num">{{ formatEndtime.min }}</text>
            <text class="wxIcon">:</text>
            <text class="num">{{ formatEndtime.sec }}</text>
        </view>

        <view class="rest-time" v-if="source == 'detailList' && formatEndtime.min">
            剩
            <text class="time" :style="{ color: themes.color }">{{ formatEndtime.min }}:{{ formatEndtime.sec }}</text>
            结束
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
    components: {},
    props: {
		className:{
			type: [String, Array,Boolean],//这里加个Boolean，是因为如果传className=""，小程序端会报错
			default: ''
		},
        source: {
            type: String // 来源，  detail（普通，拼团） apply（售后）  detailList(开团的)  seckillList(秒杀)
        },
        text: {
            type: String
        },
        // 结束时间
        endTime: {
            // 结束时间
            type: [String, Number]
        },
        endcallback: {
            // 时间为0时的回调函数
            type: Function
        }
    },
    computed: {
        ...mapState(['timeDiff'])
    },
    data() {
        return {
            timer: null,
            formatEndtime: {}
        }
    },
    mounted() {
        this.countTime(this.endTime)
    },
    destroyed() {
        clearInterval(this.timer)
    },
    methods: {
        countTime(timestamp) {
            const that = this
            this.timer = setInterval(() => {
                that.restTime(timestamp)
            }, 1000)
        },

        // 时间为0时候触发的函数
        timeToEnd() {
            this.$emit('endcallback')
        },
        // 格式化时间
        restTime(timestamp) {
            // 当前时间
            const nowTime = new Date()
            // 时间戳
            const t = timestamp * 1 - (nowTime.getTime() - this.timeDiff)

            // console.log(t)

            if (t > 0) {
                const day = Math.floor(t / 86400000)
                let hour = Math.floor((t / 3600000) % 24)
                let min = Math.floor((t / 60000) % 60)
                let sec = Math.floor((t / 1000) % 60)

                hour = hour < 10 ? '0' + hour : hour
                min = min < 10 ? '0' + min : min
                sec = sec < 10 ? '0' + sec : sec

                if (day > 0) {
                    this.formatEndtime = {
                        day: day,
                        hour: hour,
                        min: min,
                        sec: sec
                    }
                }

                if (day < 0) {
                    this.formatEndtime = {
                        day: day,
                        hour: hour,
                        min: min,
                        sec: sec
                    }
                }

                if (day <= 0 && hour > 0) {
                    this.formatEndtime = {
                        day: day,
                        hour: hour,
                        min: min,
                        sec: sec
                    }
                }

                if (day <= 0 && hour <= 0) {
                    this.formatEndtime = {
                        day: day,
                        hour: hour,
                        min: min,
                        sec: sec
                    }
                }
            } else {
                this.formatEndtime = {
                    day: '00',
                    hour: '00',
                    min: '00',
                    sec: '00'
                }
                this.timeToEnd()
                clearInterval(this.timer)
            }
        }
    }
}
</script>

<style>
</style>
