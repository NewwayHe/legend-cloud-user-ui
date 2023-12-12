<template>
    <!-- 手机充电动画效果
        注意：父组件的容器要加入position:relative;并且设定宽和高
     -->
    <view
        class="g-container"
        :style="{
            '--themescolor': themes.color,
            '--themesrgba09': themesRGBA09,
            '--themesrgba08': themesRGBA08,
            '--themesrgba07': themesRGBA07,
            '--themesrgba04': themesRGBA04
        }"
    >
        <!-- <view class="g-number">98.7%</view> -->
        <view class="g-contrast">
            <view class="g-circle"></view>
            <ul class="g-bubbles">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {}
    },
    props: {},
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
        themesRGBA04() {
            return `rgba(${this.themes.rgb.r}, ${this.themes.rgb.g},${this.themes.rgb.b},.4)`
        }
    },
    methods: {}
}
</script>

<style scoped>
.g-container {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    display: flex;
    background: #000;
    overflow: hidden;
    margin: auto;
}
.g-number {
    position: absolute;
    width: 300px;
    top: 27%;
    text-align: center;
    font-size: 32px;
    z-index: 10;
    color: #fff;
}
.g-contrast {
    filter: contrast(15) hue-rotate(0);
    width: 100%;
    height: 100%;
    background-color: #000;
    overflow: hidden;
    animation: hueRotate 10s infinite linear;
}
.g-circle {
    position: relative;
    width: 300px;
    height: 300px;
    box-sizing: border-box;
    filter: blur(8px);
}
.g-circle::after {
    content: '';
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(0);
    width: 200px;
    height: 200px;
    /* background-color:#00ff6f; */
    background-color: var(--themesrgba09);
    border-radius: 42% 38% 62% 49% / 45%;
    animation: rotate 10s infinite linear;
}
.g-circle::before {
    content: '';
    position: absolute;
    width: 176px;
    height: 176px;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background-color: #000;
    z-index: 10;
}
.g-bubbles {
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 100px;
    height: 40px;
    transform: translate(-50%, 0);
    border-radius: 100px 100px 0 0;
    /* background-color:#00ff6f; */
    background-color: var(--themesrgba08);
    filter: blur(5px);
}
li {
    position: absolute;
    border-radius: 50%;
    background: var(--themesrgba07);
    /* background:#00ff6f; */
}
@keyframes rotate {
    50% {
        border-radius: 45% / 42% 38% 58% 49%;
    }
    100% {
        transform: translate(-50%, -50%) rotate(720deg);
    }
}
@keyframes moveToTop {
    90% {
        opacity: 1;
    }
    100% {
        opacity: 0.1;
        transform: translate(-50%, -180px);
    }
}
@keyframes hueRotate {
    100% {
        filter: contrast(15) hue-rotate(360deg);
    }
}
</style>
