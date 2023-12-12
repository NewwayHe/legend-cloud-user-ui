<template>
    <!-- 波动效果
        注意：父组件的容器要加入position:relative;并且设定宽和高
     -->
    <view
        class="content"
        :style="{
            '--themescolor': themes.color,
            '--themesrgba10': themesRGBA10,
            '--themesrgba09': themesRGBA09,
            '--themesrgba08': themesRGBA08,
            '--themesrgba07': themesRGBA07,
            '--themesrgba06': themesRGBA06,
            '--themesrgba05': themesRGBA05,
            '--themesrgba04': themesRGBA04,
            '--themesrgba03': themesRGBA03,
            '--themesrgba02': themesRGBA02,
            '--themesrgba01': themesRGBA01
        }"
    >
        <!-- 波动 -->
        <view class="waves"></view>

        <!-- 云朵 -->
        <view class="cloud"></view>

        <!-- 简单的3D立方体 -->
        <!-- <view class="cube__container" :style="{ '--cube-size': '150px', '--cube-split': '75px' }">
            <view class="cube__body">
                <view class="cube__item cube__item--front"></view>
                <view class="cube__item cube__item--back"></view>
                <view class="cube__item cube__item--right"></view>
                <view class="cube__item cube__item--left"></view>
                <view class="cube__item cube__item--top"></view>
                <view class="cube__item cube__item--bottom"></view>
            </view>
        </view> -->

        <!-- 流星雨 -->
        <!-- <view class="night">
            <view class="shooting_star"></view>
            <view class="shooting_star"></view>
            <view class="shooting_star"></view>
            <view class="shooting_star"></view>
            <view class="shooting_star"></view>
            <view class="shooting_star"></view>
            <view class="shooting_star"></view>
            <view class="shooting_star"></view>
            <view class="shooting_star"></view>
            <view class="shooting_star"></view>
            <view class="shooting_star"></view>
            <view class="shooting_star"></view>
            <view class="shooting_star"></view>
            <view class="shooting_star"></view>
            <view class="shooting_star"></view>
            <view class="shooting_star"></view>
            <view class="shooting_star"></view>
            <view class="shooting_star"></view>
            <view class="shooting_star"></view>
            <view class="shooting_star"></view>
        </view> -->
    </view>
</template>

<script>
export default {
    data() {
        return {}
    },
    props: {},
    computed: {
        themesRGBA10() {
            return `rgba(${this.themes.rgb.r}, ${this.themes.rgb.g},${this.themes.rgb.b},1)`
        },
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
    // background: #0A212E;
    // background: var(--themescolor);
    position: absolute;
    margin: 0px;
    overflow: hidden;
    animation: animationcolorloop 6s infinite;

    width: 160%;
    height: 100%;
    top: 0;
    left: -30%;
    border-radius: 0 0 50% 50%;
}
@keyframes animationcolorloop {
    0% {
        background: var(--themesrgba10);
    }
    13% {
        background: var(--themesrgba09);
    }
    25% {
        background: var(--themesrgba08);
    }
    38% {
        background: var(--themesrgba07);
    }
    50% {
        background: var(--themesrgba06);
    }
    63% {
        background: var(--themesrgba07);
    }
    75% {
        background: var(--themesrgba08);
    }
    88% {
        background: var(--themesrgba09);
    }
    100% {
        background: var(--themescolor);
    }
}

/* <!-- 波动 --> */
.waves {
    position: absolute;
    bottom: 90px;
    /* top: 50%; */
    /* background: var(--themesrgba08); */
    background: rgba(255, 255, 255, 0.3);
    /* left: 50%; */
    /* #ifdef MP */
    right: 22%;
    /* #endif */
    /* #ifndef MP */
    right: 21%;
    /* #endif */
    width: 50rpx;
    height: 50rpx;
    margin-left: -12px;
    margin-top: -12px;
    border-radius: 50%;
    -webkit-backface-visibility: hidden;
}
.waves:before {
    position: absolute;
    background: var(--themesrgba06);
    /* background: white; */
    margin-left: -12px;
    margin-top: -12px;
    width: 50px;
    height: 50px;
    content: '';
    display: block;
    border-radius: 50%;
    -webkit-backface-visibility: hidden;
    animation: wave-animate 6s infinite ease-out;
}
.waves:after {
    position: absolute;
    background: var(--themesrgba06);
    /* background: white; */
    margin-left: -12px;
    margin-top: -12px;
    width: 50px;
    height: 50px;
    content: '';
    display: block;
    border-radius: 50%;
    -webkit-backface-visibility: hidden;
    opacity: 0;
    animation: wave-animate 6s 3s infinite ease-out;
}
@keyframes wave-animate {
    0% {
        transform: scale(0);
        opacity: 1;
        transform-origin: center;
    }
    100% {
        transform: scale(3);
        opacity: 0;
        transform-origin: center;
    }
}
/* <!-- /波动 --> */

/* <!-- 云朵 --> */
.cloud {
    position: absolute;
    left: 20%;
    bottom: 30%;
    transform: scale(0.5);
    opacity: 0.7;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: var(--themescolor);
    box-shadow: var(--themescolor) 65px -15px 0 -5px, var(--themescolor) 25px -25px, var(--themescolor) 30px 10px,
        var(--themescolor) 60px 15px 0 -10px, var(--themescolor) 85px 5px 0 -5px;
}
/* <!-- /云朵 --> */

// <!-- /简单的3D立方体 -->
.cube__container {
    position: absolute;
    left: 11%;
    bottom: -10%;
    transform: scale(0.3);
    width: var(--cube-size);
    height: var(--cube-size);
    perspective: 1000px;
}
.cube__container::before {
    content: '';
    width: var(--cube-size);
    height: var(--cube-size);
    position: absolute;
    top: calc(50% - (var(--cube-split) - 30px));
    left: calc(50% - var(--cube-split));
    background-color: var(--themesrgba05);
    // background-color: #3c6496;
    filter: blur(60px);
    opacity: 0.8;
}
.cube__body {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transform: translateZ(-75px);
    animation: cubeFrame 35s cubic-bezier(0.36, -0.03, 0.46, 0.95) infinite alternate;
    will-change: transform;
}
.cube__item {
    position: absolute;
    display: block;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--cube-size);
    height: var(--cube-size);
    font-size: 30px;
}
.cube__item--front {
    transform: rotateY(0deg) translateZ(var(--cube-split));
    background-color: var(--themesrgba06);
    // background-color: #74b8e2;
}
.cube__item--back {
    transform: rotateX(180deg) translateZ(var(--cube-split));
    background-color: var(--themesrgba04);
    // background-color: #87bee0;
}
.cube__item--right {
    transform: rotateY(90deg) translateZ(var(--cube-split));
    background-color: var(--themesrgba03);
    // background-color: #8fcaef;
}
.cube__item--left {
    transform: rotateY(-90deg) translateZ(var(--cube-split));
    background-color: var(--themesrgba03);
    // background-color: #8fcaef;
}
.cube__item--top {
    transform: rotateX(90deg) translateZ(var(--cube-split));
    background-color: var(--themesrgba01);
    // background-color: #73abce;
}
.cube__item--bottom {
    transform: rotateX(-90deg) translateZ(var(--cube-split));
    background-color: var(--themesrgba01);
    // background-color: #73abce;
}

@keyframes cubeFrame {
    10% {
        transform: translateZ(-75px) rotateX(40deg) rotateY(60deg);
    }
    15% {
        transform: translateZ(-75px) rotateX(80deg) rotateY(20deg);
    }
    20% {
        transform: translateZ(-75px) rotateX(-180deg) rotateY(-70deg);
    }
    30% {
        transform: translateZ(-75px) rotateX(90deg) rotateY(180deg);
    }
    40% {
        transform: translateZ(-75px) rotateX(-10deg) rotateY(-140deg);
    }
    45% {
        transform: translateZ(-75px) rotateX(-100deg) rotateY(20deg);
    }
    55% {
        transform: translateZ(-75px) rotateX(-10deg) rotateY(-35deg);
    }
    60% {
        transform: translateZ(-75px) rotateX(180deg) rotateY(360deg);
    }
    70% {
        transform: translateZ(-75px) rotateX(-180deg) rotateY(-360deg);
    }
    80% {
        transform: translateZ(-75px) rotateX(45deg) rotateY(-70deg);
    }
    90% {
        transform: translateZ(-75px) rotateX(-45deg) rotateY(70deg);
    }
    100% {
        transform: translateZ(-75px) rotateX(-360deg) rotateY(360deg);
    }
}
@keyframes bg {
    100% {
        background-position-x: 100%;
    }
}

// <!-- /简单的3D立方体 -->

// <!-- 流星雨 -->
.night {
    position: relative;
    width: 100%;
    height: 100%;
    -webkit-transform: rotateZ(45deg);
    transform: rotateZ(45deg);
}

.shooting_star {
    position: absolute;
    left: 50%;
    top: 50%;
    height: 2px;
    background: linear-gradient(-45deg, var(--themesrgba09), rgba(0, 0, 255, 0));
    // background: linear-gradient(-45deg, #5f91ff, rgba(0, 0, 255, 0));
    border-radius: 999px;
    -webkit-filter: drop-shadow(0 0 6px var(--themesrgba06));
    filter: drop-shadow(0 0 6px var(--themesrgba06));
    // -webkit-filter: drop-shadow(0 0 6px #699bff);
    //         filter: drop-shadow(0 0 6px #699bff);
    -webkit-animation: tail 3000ms ease-in-out infinite, shooting 3000ms ease-in-out infinite;
    animation: tail 3000ms ease-in-out infinite, shooting 3000ms ease-in-out infinite;
}
.shooting_star::before,
.shooting_star::after {
    content: '';
    position: absolute;
    top: calc(50% - 1px);
    right: 0;
    height: 2px;
    background: linear-gradient(-45deg, rgba(0, 0, 255, 0), var(--themesrgba09), rgba(0, 0, 255, 0));
    // background: linear-gradient(-45deg, rgba(0, 0, 255, 0), #5f91ff, rgba(0, 0, 255, 0));
    -webkit-transform: translateX(50%) rotateZ(45deg);
    transform: translateX(50%) rotateZ(45deg);
    border-radius: 100%;
    -webkit-animation: shining 3000ms ease-in-out infinite;
    animation: shining 3000ms ease-in-out infinite;
}
.shooting_star::after {
    -webkit-transform: translateX(50%) rotateZ(-45deg);
    transform: translateX(50%) rotateZ(-45deg);
}
.shooting_star:nth-child(1) {
    top: calc(50% - 200px);
    left: calc(50% - 105px);
    -webkit-animation-delay: 9592ms;
    animation-delay: 9592ms;
}
.shooting_star:nth-child(1)::before,
.shooting_star:nth-child(1)::after,
.shooting_star:nth-child(1)::after {
    -webkit-animation-delay: 9592ms;
    animation-delay: 9592ms;
}
.shooting_star:nth-child(2) {
    top: calc(50% - -18px);
    left: calc(50% - 87px);
    -webkit-animation-delay: 5908ms;
    animation-delay: 5908ms;
}
.shooting_star:nth-child(2)::before,
.shooting_star:nth-child(2)::after,
.shooting_star:nth-child(2)::after {
    -webkit-animation-delay: 5908ms;
    animation-delay: 5908ms;
}
.shooting_star:nth-child(3) {
    top: calc(50% - 131px);
    left: calc(50% - 81px);
    -webkit-animation-delay: 1191ms;
    animation-delay: 1191ms;
}
.shooting_star:nth-child(3)::before,
.shooting_star:nth-child(3)::after,
.shooting_star:nth-child(3)::after {
    -webkit-animation-delay: 1191ms;
    animation-delay: 1191ms;
}
.shooting_star:nth-child(4) {
    top: calc(50% - 178px);
    left: calc(50% - 252px);
    -webkit-animation-delay: 9638ms;
    animation-delay: 9638ms;
}
.shooting_star:nth-child(4)::before,
.shooting_star:nth-child(4)::after,
.shooting_star:nth-child(4)::after {
    -webkit-animation-delay: 9638ms;
    animation-delay: 9638ms;
}
.shooting_star:nth-child(5) {
    top: calc(50% - 54px);
    left: calc(50% - 207px);
    -webkit-animation-delay: 2554ms;
    animation-delay: 2554ms;
}
.shooting_star:nth-child(5)::before,
.shooting_star:nth-child(5)::after,
.shooting_star:nth-child(5)::after {
    -webkit-animation-delay: 2554ms;
    animation-delay: 2554ms;
}
.shooting_star:nth-child(6) {
    top: calc(50% - 170px);
    left: calc(50% - 257px);
    -webkit-animation-delay: 2165ms;
    animation-delay: 2165ms;
}
.shooting_star:nth-child(6)::before,
.shooting_star:nth-child(6)::after,
.shooting_star:nth-child(6)::after {
    -webkit-animation-delay: 2165ms;
    animation-delay: 2165ms;
}
.shooting_star:nth-child(7) {
    top: calc(50% - -93px);
    left: calc(50% - 69px);
    -webkit-animation-delay: 9997ms;
    animation-delay: 9997ms;
}
.shooting_star:nth-child(7)::before,
.shooting_star:nth-child(7)::after,
.shooting_star:nth-child(7)::after {
    -webkit-animation-delay: 9997ms;
    animation-delay: 9997ms;
}
.shooting_star:nth-child(8) {
    top: calc(50% - 106px);
    left: calc(50% - 99px);
    -webkit-animation-delay: 422ms;
    animation-delay: 422ms;
}
.shooting_star:nth-child(8)::before,
.shooting_star:nth-child(8)::after,
.shooting_star:nth-child(8)::after {
    -webkit-animation-delay: 422ms;
    animation-delay: 422ms;
}
.shooting_star:nth-child(9) {
    top: calc(50% - -17px);
    left: calc(50% - 35px);
    -webkit-animation-delay: 2714ms;
    animation-delay: 2714ms;
}
.shooting_star:nth-child(9)::before,
.shooting_star:nth-child(9)::after,
.shooting_star:nth-child(9)::after {
    -webkit-animation-delay: 2714ms;
    animation-delay: 2714ms;
}
.shooting_star:nth-child(10) {
    top: calc(50% - -114px);
    left: calc(50% - 232px);
    -webkit-animation-delay: 6136ms;
    animation-delay: 6136ms;
}
.shooting_star:nth-child(10)::before,
.shooting_star:nth-child(10)::after,
.shooting_star:nth-child(10)::after {
    -webkit-animation-delay: 6136ms;
    animation-delay: 6136ms;
}
.shooting_star:nth-child(11) {
    top: calc(50% - 175px);
    left: calc(50% - 73px);
    -webkit-animation-delay: 9617ms;
    animation-delay: 9617ms;
}
.shooting_star:nth-child(11)::before,
.shooting_star:nth-child(11)::after,
.shooting_star:nth-child(11)::after {
    -webkit-animation-delay: 9617ms;
    animation-delay: 9617ms;
}
.shooting_star:nth-child(12) {
    top: calc(50% - -137px);
    left: calc(50% - 300px);
    -webkit-animation-delay: 8175ms;
    animation-delay: 8175ms;
}
.shooting_star:nth-child(12)::before,
.shooting_star:nth-child(12)::after,
.shooting_star:nth-child(12)::after {
    -webkit-animation-delay: 8175ms;
    animation-delay: 8175ms;
}
.shooting_star:nth-child(13) {
    top: calc(50% - 64px);
    left: calc(50% - 125px);
    -webkit-animation-delay: 2715ms;
    animation-delay: 2715ms;
}
.shooting_star:nth-child(13)::before,
.shooting_star:nth-child(13)::after,
.shooting_star:nth-child(13)::after {
    -webkit-animation-delay: 2715ms;
    animation-delay: 2715ms;
}
.shooting_star:nth-child(14) {
    top: calc(50% - 144px);
    left: calc(50% - 266px);
    -webkit-animation-delay: 9024ms;
    animation-delay: 9024ms;
}
.shooting_star:nth-child(14)::before,
.shooting_star:nth-child(14)::after,
.shooting_star:nth-child(14)::after {
    -webkit-animation-delay: 9024ms;
    animation-delay: 9024ms;
}
.shooting_star:nth-child(15) {
    top: calc(50% - -70px);
    left: calc(50% - 111px);
    -webkit-animation-delay: 4994ms;
    animation-delay: 4994ms;
}
.shooting_star:nth-child(15)::before,
.shooting_star:nth-child(15)::after,
.shooting_star:nth-child(15)::after {
    -webkit-animation-delay: 4994ms;
    animation-delay: 4994ms;
}
.shooting_star:nth-child(16) {
    top: calc(50% - -147px);
    left: calc(50% - 196px);
    -webkit-animation-delay: 6546ms;
    animation-delay: 6546ms;
}
.shooting_star:nth-child(16)::before,
.shooting_star:nth-child(16)::after,
.shooting_star:nth-child(16)::after {
    -webkit-animation-delay: 6546ms;
    animation-delay: 6546ms;
}
.shooting_star:nth-child(17) {
    top: calc(50% - -49px);
    left: calc(50% - 240px);
    -webkit-animation-delay: 895ms;
    animation-delay: 895ms;
}
.shooting_star:nth-child(17)::before,
.shooting_star:nth-child(17)::after,
.shooting_star:nth-child(17)::after {
    -webkit-animation-delay: 895ms;
    animation-delay: 895ms;
}
.shooting_star:nth-child(18) {
    top: calc(50% - 171px);
    left: calc(50% - 3px);
    -webkit-animation-delay: 4390ms;
    animation-delay: 4390ms;
}
.shooting_star:nth-child(18)::before,
.shooting_star:nth-child(18)::after,
.shooting_star:nth-child(18)::after {
    -webkit-animation-delay: 4390ms;
    animation-delay: 4390ms;
}
.shooting_star:nth-child(19) {
    top: calc(50% - -57px);
    left: calc(50% - 58px);
    -webkit-animation-delay: 5414ms;
    animation-delay: 5414ms;
}
.shooting_star:nth-child(19)::before,
.shooting_star:nth-child(19)::after,
.shooting_star:nth-child(19)::after {
    -webkit-animation-delay: 5414ms;
    animation-delay: 5414ms;
}
.shooting_star:nth-child(20) {
    top: calc(50% - 109px);
    left: calc(50% - 174px);
    -webkit-animation-delay: 9384ms;
    animation-delay: 9384ms;
}
.shooting_star:nth-child(20)::before,
.shooting_star:nth-child(20)::after,
.shooting_star:nth-child(20)::after {
    -webkit-animation-delay: 9384ms;
    animation-delay: 9384ms;
}

@-webkit-keyframes tail {
    0% {
        width: 0;
    }
    30% {
        width: 100px;
    }
    100% {
        width: 0;
    }
}

@keyframes tail {
    0% {
        width: 0;
    }
    30% {
        width: 100px;
    }
    100% {
        width: 0;
    }
}
@-webkit-keyframes shining {
    0% {
        width: 0;
    }
    50% {
        width: 30px;
    }
    100% {
        width: 0;
    }
}
@keyframes shining {
    0% {
        width: 0;
    }
    50% {
        width: 30px;
    }
    100% {
        width: 0;
    }
}
@-webkit-keyframes shooting {
    0% {
        -webkit-transform: translateX(0);
        transform: translateX(0);
    }
    100% {
        -webkit-transform: translateX(300px);
        transform: translateX(300px);
    }
}
@keyframes shooting {
    0% {
        -webkit-transform: translateX(0);
        transform: translateX(0);
    }
    100% {
        -webkit-transform: translateX(300px);
        transform: translateX(300px);
    }
}
@-webkit-keyframes sky {
    0% {
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
    }
    100% {
        -webkit-transform: rotate(405deg);
        transform: rotate(405deg);
    }
}
@keyframes sky {
    0% {
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
    }
    100% {
        -webkit-transform: rotate(405deg);
        transform: rotate(405deg);
    }
}
// <!-- /流星雨 -->
</style>
