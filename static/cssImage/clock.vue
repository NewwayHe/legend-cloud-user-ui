<template>
    <!-- 波动效果
        注意：父组件的容器要加入position:relative;并且设定宽和高
     -->
    <view
        class="content"
        :style="{
            '--themescolor': cur ? themes.color : 'rgba(187,187,187,1)',
            '--themesrgba09': cur ? themesRGBA09 : 'rgba(187,187,187,0.9)',
            '--themesrgba08': cur ? themesRGBA08 : 'rgba(187,187,187,0.8)',
            '--themesrgba07': cur ? themesRGBA07 : 'rgba(187,187,187,0.7)',
            '--themesrgba06': cur ? themesRGBA06 : 'rgba(187,187,187,0.6)',
            '--themesrgba05': cur ? themesRGBA05 : 'rgba(187,187,187,0.5)',
            '--themesrgba04': cur ? themesRGBA04 : 'rgba(187,187,187,0.4)',
            '--themesrgba03': cur ? themesRGBA03 : 'rgba(187,187,187,0.3)',
            '--themesrgba02': cur ? themesRGBA02 : 'rgba(187,187,187,0.2)',
            '--themesrgba01': cur ? themesRGBA01 : 'rgba(187,187,187,0.1)'
        }"
    >
        <!-- 时钟 -->
        <view class="clock" :style="{ '--hour': cur ? '60s' : '0s', '--minute': cur ? '30s' : '0s', '--seconds': cur ? '15s' : '0s' }">
            <view class="top"></view>
            <view class="right"></view>
            <view class="bottom"></view>
            <view class="left"></view>
            <view class="center"></view>
            <view class="shadow"></view>
            <view class="hour"></view>
            <view class="minute"></view>
            <view class="second"></view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {}
    },
    props: {
        cur: {
            // 按钮里的文字，必传
            type: Boolean,
            default: true
        }
    },
    computed: {
        themesRGBA09() {
            return `rgba(${this.themes.rgb.r}, ${this.themes.rgb.g},${this.themes.rgb.b},.9)`
        },
        themesRGBA08() {
            return `rgba(${this.themes.rgb.r}, ${this.themes.rgb.g},${this.themes.rgb.b},.8)`
        },
        themesRGBA07() {
            return `rgba(${this.themes.rgb.r}, ${this.themes.rgb.g},${this.themes.rgb.b},.7)`
        },
        themesRGBA06() {
            return `rgba(${this.themes.rgb.r}, ${this.themes.rgb.g},${this.themes.rgb.b},.6)`
        },
        themesRGBA05() {
            return `rgba(${this.themes.rgb.r}, ${this.themes.rgb.g},${this.themes.rgb.b},.5)`
        },
        themesRGBA04() {
            return `rgba(${this.themes.rgb.r}, ${this.themes.rgb.g},${this.themes.rgb.b},.4)`
        },
        themesRGBA03() {
            return `rgba(${this.themes.rgb.r}, ${this.themes.rgb.g},${this.themes.rgb.b},.3)`
        },
        themesRGBA02() {
            return `rgba(${this.themes.rgb.r}, ${this.themes.rgb.g},${this.themes.rgb.b},.2)`
        },
        themesRGBA01() {
            return `rgba(${this.themes.rgb.r}, ${this.themes.rgb.g},${this.themes.rgb.b},.1)`
        }
    },
    methods: {}
}
</script>

<style lang="scss" scoped>
.content {
    position: relative;
    margin: 0px;
    // overflow: hidden;

    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

// 时钟
.clock {
    // position: relative;
    height: 100%;
    width: 100%;
    background: var(--themesrgba01);
    // background: white;
    box-sizing: border-box;
    border-radius: 100%;
    border: 5px solid var(--themescolor);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    .top {
        position: absolute;
        width: 2px;
        height: 4px;
        background: var(--themescolor);
        left: 0;
        right: 0;
        margin: 0 auto;
    }
    .right {
        position: absolute;
        width: 4px;
        height: 2px;
        background: var(--themescolor);
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto 0;
    }
    .bottom {
        position: absolute;
        width: 2px;
        height: 4px;
        background: var(--themescolor);
        left: 0;
        right: 0;
        bottom: 0;
        margin: 0 auto;
    }
    .left {
        position: absolute;
        width: 4px;
        height: 2px;
        background: var(--themescolor);
        top: 0;
        bottom: 0;
        left: 0;
        margin: auto 0;
    }
    .center {
        height: 3px;
        width: 3px;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        background: var(--themescolor);
        border-radius: 100%;
    }
    .shadow {
        height: 200px;
        width: 200px;
        position: absolute;
        left: 60px;
        top: 60px;
        transform: rotate(135deg);
        background: linear-gradient(transparent, rgba(#000, 0.1));
    }
    .hour {
        width: 3px;
        height: 100%;
        position: absolute;
        left: 0;
        right: 0;
        margin: 0 auto;
        //animation: time 86400s infinite linear;
        animation: time var(--hour) infinite linear;
        &:before {
            position: absolute;
            content: '';
            background: #262626;
            height: 18px;
            width: 2px;
            top: 20px;
            left: 0px;
        }
    }
    .minute {
        width: 1px;
        height: 100%;
        position: absolute;
        left: 0;
        right: 0;
        margin: 0 auto;
        //animation: time 3600s infinite linear;
        animation: time var(--minute) infinite linear;
        &:before {
            position: absolute;
            content: '';
            background: #262626;
            height: 20px;
            width: 1px;
            top: 20px;
            left: 0px;
        }
    }
    .second {
        width: 2px;
        height: 100%;
        position: absolute;
        left: 0;
        right: 0;
        margin: 0 auto;
        //animation: time 60s infinite linear;
        animation: time var(--seconds) infinite linear;
        &:before {
            position: absolute;
            content: '';
            background: #fd1111;
            height: 22px;
            width: 1px;
            top: 22px;
            left: 0px;
        }
    }
}

@keyframes time {
    to {
        transform: rotate(360deg);
    }
}
</style>
