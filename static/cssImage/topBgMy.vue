<template>
    <!-- 波动效果
        注意：父组件的容器要加入position:relative;并且设定宽和高
     -->
    <view
        class="content translate3d0"
        :style="{
            '--themescolor': itemColor,
            '--themesrgba09': themesRGBA09,
            '--themesrgba08': themesRGBA08,
            '--themesrgba07': themesRGBA07,
            '--themesrgba06': themesRGBA06,
            '--themesrgba05': themesRGBA05,
            '--themesrgba04': themesRGBA04,
            '--themesrgba03': themesRGBA03,
            '--themesrgba02': themesRGBA02,
            '--themesrgba01': themesRGBA01,
			borderRadius:borderRadius?'0 0 50% 50%':'0 0 0 0'
        }"
		:key="key"
		v-if="themes&&themes.color&&colorRgb"
    >
        <!-- 波动 -->
        <view class="waves" :style="{left:`${type==2?'49%':'310rpx'}`,bottom:`${type==2?'215rpx':'100rpx'}`}" v-if="scale==1"></view>
  
        <!-- 云朵 -->
        <view class="cloud" :style="{right:`35%`,bottom:`30%`}"></view>
		<view class="cloud" :style="{left:`28%`,bottom:`30%`}" v-if="type==2"></view>

        <!-- 旋转的花 -->
        <!-- <view class="rotating-flower">
          <view class="s1"></view>
          <view class="s2"></view>
          <view class="s3"></view>
          <view class="s4"></view>
          <view class="s5"></view>
          <view class="s6"></view>
        </view> -->

        <!-- 3D地球仪 -->
        <!-- <view class="wrapper">
            <view class="container">
                <view class="sphere">
                    <view class="ring"></view>
                    <view class="ring"></view>
                    <view class="ring"></view>
                    <view class="ring"></view>
                    <view class="ring"></view>
                    <view class="ring"></view>
                    <view class="ring"></view>
                    <view class="ring"></view>
                    <view class="ring"></view>
                    <view class="ring"></view>
                </view>
                <view class="sphere">
                    <view class="ring"></view>
                    <view class="ring"></view>
                    <view class="ring"></view>
                    <view class="ring"></view>
                    <view class="ring"></view>
                    <view class="ring"></view>
                    <view class="ring"></view>
                    <view class="ring"></view>
                    <view class="ring"></view>
                    <view class="ring"></view>
                </view>
            </view>
        </view> -->

        <!-- 3D原子 -->
        <!-- <view class="atom">
            <view class="core"></view>
            <view class="core"></view>
        </view> -->

        <!-- 旋转的3D盒子框 -->
        <!-- <view class="box">
            <view class="box__layer">
                <view class="cube">
                    <view class="cube__side cube__side--top"></view>
                    <view class="cube__side cube__side--front"></view>
                    <view class="cube__side cube__side--right"></view>
                    <view class="cube__side cube__side--back"></view>
                    <view class="cube__side cube__side--left"></view>
                    <view class="cube__side cube__side--bottom"></view>
                </view>
                <view class="cube">
                    <view class="cube__side cube__side--top"></view>
                    <view class="cube__side cube__side--front"></view>
                    <view class="cube__side cube__side--right"></view>
                    <view class="cube__side cube__side--back"></view>
                    <view class="cube__side cube__side--left"></view>
                    <view class="cube__side cube__side--bottom"></view>
                </view>
                <view class="cube">
                    <view class="cube__side cube__side--top"></view>
                    <view class="cube__side cube__side--front"></view>
                    <view class="cube__side cube__side--right"></view>
                    <view class="cube__side cube__side--back"></view>
                    <view class="cube__side cube__side--left"></view>
                    <view class="cube__side cube__side--bottom"></view>
                </view>
                <view class="cube">
                    <view class="cube__side cube__side--top"></view>
                    <view class="cube__side cube__side--front"></view>
                    <view class="cube__side cube__side--right"></view>
                    <view class="cube__side cube__side--back"></view>
                    <view class="cube__side cube__side--left"></view>
                    <view class="cube__side cube__side--bottom"></view>
                </view>
            </view>
            <view class="box__layer">
                <view class="cube">
                    <view class="cube__side cube__side--top"></view>
                    <view class="cube__side cube__side--front"></view>
                    <view class="cube__side cube__side--right"></view>
                    <view class="cube__side cube__side--back"></view>
                    <view class="cube__side cube__side--left"></view>
                    <view class="cube__side cube__side--bottom"></view>
                </view>
                <view class="cube">
                    <view class="cube__side cube__side--top"></view>
                    <view class="cube__side cube__side--front"></view>
                    <view class="cube__side cube__side--right"></view>
                    <view class="cube__side cube__side--back"></view>
                    <view class="cube__side cube__side--left"></view>
                    <view class="cube__side cube__side--bottom"></view>
                </view>
                <view class="cube">
                    <view class="cube__side cube__side--top"></view>
                    <view class="cube__side cube__side--front"></view>
                    <view class="cube__side cube__side--right"></view>
                    <view class="cube__side cube__side--back"></view>
                    <view class="cube__side cube__side--left"></view>
                    <view class="cube__side cube__side--bottom"></view>
                </view>
                <view class="cube">
                    <view class="cube__side cube__side--top"></view>
                    <view class="cube__side cube__side--front"></view>
                    <view class="cube__side cube__side--right"></view>
                    <view class="cube__side cube__side--back"></view>
                    <view class="cube__side cube__side--left"></view>
                    <view class="cube__side cube__side--bottom"></view>
                </view>
            </view>
            <view class="box__shadow"></view>
        </view> -->

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
    </view>
</template>

<script>
export default {
    data() {
        return {
			key:0
		}
    },
    props: {
		color: {//背景颜色
		    type: String,
		    default:''
		},
		borderRadius: {//是底部是否带弧度
		    type: Boolean,
		    default: true
		},
		type: {//类型，根据不同的类型，波动效果和云朵的定位不同
		    type: [String,Number],
		    default: 1
		},
		scale: {//根据屏幕滚动的缩放值
		    type: [String,Number],
		    default: 1
		}
	},
    computed: {
		itemColor(){
			return this.color||this.themes.color
		},
		colorRgb(){
			return this.$utils.color.colorRgb(this.itemColor)
		},
        themesRGBA09() {
            return `rgba(${this.colorRgb.r}, ${this.colorRgb.g},${this.colorRgb.b},.9)`
        },
        themesRGBA08() {
            return `rgba(${this.colorRgb.r}, ${this.colorRgb.g},${this.colorRgb.b},.8)`
        },
        themesRGBA07() {
            return `rgba(${this.colorRgb.r}, ${this.colorRgb.g},${this.colorRgb.b},.7)`
        },
        themesRGBA06() {
            return `rgba(${this.colorRgb.r}, ${this.colorRgb.g},${this.colorRgb.b},.6)`
        },
        themesRGBA05() {
            return `rgba(${this.colorRgb.r}, ${this.colorRgb.g},${this.colorRgb.b},.5)`
        },
        themesRGBA04() {
            return `rgba(${this.colorRgb.r}, ${this.colorRgb.g},${this.colorRgb.b},.4)`
        },
        themesRGBA03() {
            return `rgba(${this.colorRgb.r}, ${this.colorRgb.g},${this.colorRgb.b},.3)`
        },
        themesRGBA02() {
            return `rgba(${this.colorRgb.r}, ${this.colorRgb.g},${this.colorRgb.b},.2)`
        },
        themesRGBA01() {
            return `rgba(${this.colorRgb.r}, ${this.colorRgb.g},${this.colorRgb.b},.1)`
        }
    },
	mounted() {
		this.key ++
	},
    methods: {}
}
</script>

<style lang="scss" scoped>
.content {
    /* background: #0A212E; */
    background: var(--themescolor);
    position: absolute;
    margin: 0px;
    overflow: hidden;
    animation: colorloop 6s infinite;

    width: 160%;
    height: 100%;
    top: 0;
    left: -30%;
    // border-radius: 0 0 50% 50%;
}
@keyframes colorloop {
    0% {
        background: var(--themescolor);
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

/* <!-- 云朵 --> */
.cloud {
    position: absolute;
    // right: 35%;
    // bottom: 30%;
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

/* <!-- 波动 --> */
.waves {
    position: absolute;
    // bottom: 87.5rpx;
    /* top: 50%; */
    /* background: var(--themesrgba08); */
    background: rgba(255, 255, 255, 0.3);
    /* left: 50%; */
    // left: 310rpx;
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

/* <!-- 旋转的花 --> */
.rotating-flower {
    position: relative;
    right: -55%;
    bottom: 0%;

    width: 8em;
    height: 8em;
    transform-style: preserve-3d;
    transform: rotateX(70deg) rotateZ(10deg) rotateY(0deg);
    animation: rotate 3s infinite linear;
}
.rotating-flower view {
    position: absolute;
    width: 8em;
    height: 8em;
    opacity: 0.7;
    border-radius: 50%;
}
.s1 {
    transform: rotateY(0deg);
    background: var(--themescolor);
    box-shadow: 0 0 2px var(--themescolor);
}
.s2 {
    transform: rotateY(30deg);
    background: var(--themesrgba09);
    box-shadow: 0 0 2px var(--themesrgba09);
}
.s3 {
    transform: rotateY(-30deg);
    background: var(--themesrgba08);
    box-shadow: 0 0 2px var(--themesrgba08);
}
.s4 {
    transform: rotateY(60deg);
    background: var(--themesrgba07);
    box-shadow: 0 0 2px var(--themesrgba07);
}
.s5 {
    transform: rotateY(-60deg);
    background: var(--themesrgba06);
    box-shadow: 0 0 2px var(--themesrgba06);
}
.s6 {
    transform: rotateY(90deg);
    background: var(--themesrgba04);
    box-shadow: 0 0 2px var(--themesrgba04);
}
@keyframes rotate {
    from {
        transform: rotateX(70deg) rotateZ(10deg) rotateY(0deg);
    }
    to {
        transform: rotateX(70deg) rotateZ(10deg) rotateY(360deg);
    }
}
/* <!-- /旋转的花 --> */

/* <!-- 3D地球仪 --> */
.wrapper {
    position: absolute;
    right: 10%;
    bottom: -400rpx;
    transform: scale(0.2);
    perspective: 800px;
    display: flex;
    justify-content: center;
    filter: blur(1.5px);
}
.container {
    transform: rotateX(40deg) rotateY(40deg) rotateZ(90deg);
    transform-style: preserve-3d;
    position: relative;
    display: flex;
    height: 300px;
    width: 300px;
    margin: 100px 0;
}
.sphere,
.ring {
    position: absolute;
    height: 100%;
    width: 100%;
    transform-style: preserve-3d;
}
.sphere {
    animation: rotateSphere 10s linear infinite;
}
.sphere:nth-of-type(1) .ring:nth-of-type(1) {
    transform: rotateY(18deg);
}
.sphere:nth-of-type(1) .ring:nth-of-type(2) {
    transform: rotateY(36deg);
}
.sphere:nth-of-type(1) .ring:nth-of-type(3) {
    transform: rotateY(54deg);
}
.sphere:nth-of-type(1) .ring:nth-of-type(4) {
    transform: rotateY(72deg);
}
.sphere:nth-of-type(1) .ring:nth-of-type(5) {
    transform: rotateY(90deg);
}
.sphere:nth-of-type(1) .ring:nth-of-type(6) {
    transform: rotateY(108deg);
}
.sphere:nth-of-type(1) .ring:nth-of-type(7) {
    transform: rotateY(126deg);
}
.sphere:nth-of-type(1) .ring:nth-of-type(8) {
    transform: rotateY(144deg);
}
.sphere:nth-of-type(1) .ring:nth-of-type(9) {
    transform: rotateY(162deg);
}
.sphere:nth-of-type(1) .ring:nth-of-type(10) {
    transform: rotateY(180deg);
}
.sphere:nth-of-type(2) .ring:nth-of-type(1) {
    transform: rotateX(18deg);
}
.sphere:nth-of-type(2) .ring:nth-of-type(2) {
    transform: rotateX(36deg);
}
.sphere:nth-of-type(2) .ring:nth-of-type(3) {
    transform: rotateX(54deg);
}
.sphere:nth-of-type(2) .ring:nth-of-type(4) {
    transform: rotateX(72deg);
}
.sphere:nth-of-type(2) .ring:nth-of-type(5) {
    transform: rotateX(90deg);
}
.sphere:nth-of-type(2) .ring:nth-of-type(6) {
    transform: rotateX(108deg);
}
.sphere:nth-of-type(2) .ring:nth-of-type(7) {
    transform: rotateX(126deg);
}
.sphere:nth-of-type(2) .ring:nth-of-type(8) {
    transform: rotateX(144deg);
}
.sphere:nth-of-type(2) .ring:nth-of-type(9) {
    transform: rotateX(162deg);
}
.sphere:nth-of-type(2) .ring:nth-of-type(10) {
    transform: rotateX(180deg);
}
.ring {
    border: 1px solid;
    box-sizing: border-box;
    border-radius: 50%;
    opacity: 0;
    animation: fadeIn 2000ms ease infinite;
    box-shadow: 0 0 80px var(--themesrgba02), inset 0 0 80px var(--themesrgba02);
}
.ring:nth-of-type(1) {
    border-color: var(--themescolor);
    /* border-color: #40e0d0; */
    animation-delay: 200ms;
}
.ring:nth-of-type(2) {
    border-color: var(--themesrgba09);
    /* border-color: #4ae2d2; */
    animation-delay: 400ms;
}
.ring:nth-of-type(3) {
    border-color: var(--themesrgba08);
    /* border-color: #53e3d5; */
    animation-delay: 600ms;
}
.ring:nth-of-type(4) {
    border-color: var(--themesrgba07);
    /* border-color: #5de5d7; */
    animation-delay: 800ms;
}
.ring:nth-of-type(5) {
    border-color: var(--themesrgba06);
    /* border-color: #66e6d9; */
    animation-delay: 1000ms;
}
.ring:nth-of-type(6) {
    border-color: var(--themesrgba05);
    /* border-color: #70e8dc; */
    animation-delay: 1200ms;
}
.ring:nth-of-type(7) {
    border-color: var(--themesrgba04);
    /* border-color: #79e9de; */
    animation-delay: 1400ms;
}
.ring:nth-of-type(8) {
    border-color: var(--themesrgba03);
    /* border-color: #83ebe0; */
    animation-delay: 1600ms;
}
.ring:nth-of-type(9) {
    border-color: var(--themesrgba02);
    /* border-color: #8cece3; */
    animation-delay: 1800ms;
}
.ring:nth-of-type(10) {
    border-color: var(--themesrgba01);
    /* border-color: #96eee5; */
    animation-delay: 2000ms;
}
@keyframes rotateSphere {
    to {
        transform: rotateX(360deg) rotateY(360deg);
    }
}
@keyframes fadeIn {
    from,
    to {
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
}
/* <!-- /3D地球仪 --> */

/* <!-- 3D原子 --> */
.atom,
.core,
.core::before,
.core::after {
    display: flex;
    align-items: center;
    justify-content: center;
}
.atom {
    position: absolute;
    right: 13%;
    bottom: -200rpx;
    transform: scale(0.2);

    width: 300px;
    height: 300px;
    transform-style: preserve-3d;
}
.core,
.core::before,
.core::after {
    position: absolute;
    border-radius: 50%;
    transform-style: preserve-3d;
    animation: 4s linear infinite;
}
.core {
    width: 50%;
    height: 50%;
    animation-name: rotate3DZ;
}
.core::before,
.core::after {
    width: 200%;
    height: 200%;
    content: '';
    border: 3px solid var(--themesrgba08);
    /* border: 3px solid #005792; */
    box-shadow: 0 0 3px 3px var(--themesrgba04), 0 0 3px 3px var(--themesrgba05) inset;
    /* box-shadow: 0 0 3px 3px #d9faff, 0 0 3px 3px #d9faff inset; */
}
.core:first-child {
    background: radial-gradient(circle at 25% 25%, #d9faff -75%, var(--themesrgba04), #00204a 75%);
    /* background: radial-gradient(circle at 25% 25%, #d9faff -75%, #00bbf0, #00204a 75%); */
}
.core:first-child::before {
    animation-name: rotate3DX;
}
.core:first-child::after {
    animation-name: rotate3DY;
}
.core:last-child {
    box-shadow: 0 0 75px 3px #d9faff;
}
.core:last-child::before {
    animation-name: rotate3DXY;
}
.core:last-child::after {
    animation-name: rotate3DYX;
}
@keyframes rotate3DX {
    to {
        transform: rotate3d(-1, 0, 0, 360deg);
    }
}
@keyframes rotate3DY {
    to {
        transform: rotate3d(0, 1, 0, 360deg);
    }
}
@keyframes rotate3DZ {
    to {
        transform: rotate3d(0, 0, 1, 360deg);
    }
}
@keyframes rotate3DXY {
    to {
        transform: rotate3d(1, -1, 0, 360deg);
    }
}
@keyframes rotate3DYX {
    to {
        transform: rotate3d(1, 1, 0, 360deg);
    }
}
/* <!-- /3D原子 --> */

/* <!-- 旋转的3D盒子框 --> */
.cube {
    position: relative;
    width: 3em;
    height: 3em;
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
}
.cube__side {
    position: absolute;
    top: 0;
    left: 0;
    width: 3em;
    height: 3em;
    background: var(--themesrgba06);
    /* background: #111; */
    opacity: 0.2;
}
.cube__side--top {
    -webkit-transform: rotateX(-90deg) translate3d(0, 1.5em, -1.5em);
    transform: rotateX(-90deg) translate3d(0, 1.5em, -1.5em);
}
.cube__side--right {
    -webkit-transform: rotateY(90deg) translate3d(1.5em, 0, 1.5em);
    transform: rotateY(90deg) translate3d(1.5em, 0, 1.5em);
}
.cube__side--back {
    -webkit-transform: translate3d(0, 0, -3em);
    transform: translate3d(0, 0, -3em);
}
.cube__side--left {
    -webkit-transform: rotateY(-90deg) translate3d(-1.5em, 0, 1.5em);
    transform: rotateY(-90deg) translate3d(-1.5em, 0, 1.5em);
}
.cube__side--bottom {
    -webkit-transform: rotateX(90deg) translate3d(0, -1.5em, -1.5em);
    transform: rotateX(90deg) translate3d(0, -1.5em, -1.5em);
}
.box {
    position: absolute;
    right: 30%;
    bottom: 0rpx;
    /* transform: scale(0.3); */
    /* position: relative; */
    width: 6em;
    height: 6em;
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
    -webkit-animation-name: move;
    animation-name: move;
    -webkit-animation-duration: 3000ms;
    animation-duration: 3000ms;
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
    -webkit-animation-timing-function: linear;
    animation-timing-function: linear;
}
.box__layer {
    position: relative;
    width: 6em;
    height: 3em;
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
}
.box__layer .cube {
    position: absolute;
    top: 0;
}
.box__layer .cube:nth-of-type(1) {
    left: 0;
    -webkit-transform: translateZ(1.5em);
    transform: translateZ(1.5em);
}
.box__layer .cube:nth-of-type(2) {
    left: 3em;
    -webkit-transform: translateZ(1.5em);
    transform: translateZ(1.5em);
}
.box__layer .cube:nth-of-type(3) {
    left: 0;
    -webkit-transform: translateZ(-1.5em);
    transform: translateZ(-1.5em);
}
.box__layer .cube:nth-of-type(4) {
    left: 3em;
    -webkit-transform: translateZ(-1.5em);
    transform: translateZ(-1.5em);
}
.box__shadow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    -webkit-filter: blur(0.8em);
    filter: blur(0.8em);
    background: var(--themescolor);
    /* background: black; */
    -webkit-animation-name: shadow;
    animation-name: shadow;
    -webkit-animation-duration: 3000ms;
    animation-duration: 3000ms;
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
    -webkit-animation-timing-function: linear;
    animation-timing-function: linear;
}
@-webkit-keyframes move {
    0% {
        -webkit-transform: rotateX(60deg) rotateZ(0deg) translateZ(3em);
        transform: rotateX(60deg) rotateZ(0deg) translateZ(3em);
    }
    50% {
        -webkit-transform: rotateX(60deg) rotateZ(-180deg) translateZ(1.5em);
        transform: rotateX(60deg) rotateZ(-180deg) translateZ(1.5em);
    }
    100% {
        -webkit-transform: rotateX(60deg) rotateZ(-360deg) translateZ(3em);
        transform: rotateX(60deg) rotateZ(-360deg) translateZ(3em);
    }
}
@keyframes move {
    0% {
        -webkit-transform: rotateX(60deg) rotateZ(0deg) translateZ(3em);
        transform: rotateX(60deg) rotateZ(0deg) translateZ(3em);
    }
    50% {
        -webkit-transform: rotateX(60deg) rotateZ(-180deg) translateZ(1.5em);
        transform: rotateX(60deg) rotateZ(-180deg) translateZ(1.5em);
    }
    100% {
        -webkit-transform: rotateX(60deg) rotateZ(-360deg) translateZ(3em);
        transform: rotateX(60deg) rotateZ(-360deg) translateZ(3em);
    }
}
@-webkit-keyframes shadow {
    0% {
        opacity: 0.2;
        -webkit-transform: translateZ(-12em) scale(0.8, 0.8);
        transform: translateZ(-12em) scale(0.8, 0.8);
    }
    50% {
        opacity: 0.3;
        -webkit-transform: translateZ(-10.5em) scale(1, 1);
        transform: translateZ(-10.5em) scale(1, 1);
    }
    100% {
        opacity: 0.2;
        -webkit-transform: translateZ(-12em) scale(0.8, 0.8);
        transform: translateZ(-12em) scale(0.8, 0.8);
    }
}
@keyframes shadow {
    0% {
        opacity: 0.2;
        -webkit-transform: translateZ(-12em) scale(0.8, 0.8);
        transform: translateZ(-12em) scale(0.8, 0.8);
    }
    50% {
        opacity: 0.3;
        -webkit-transform: translateZ(-10.5em) scale(1, 1);
        transform: translateZ(-10.5em) scale(1, 1);
    }
    100% {
        opacity: 0.2;
        -webkit-transform: translateZ(-12em) scale(0.8, 0.8);
        transform: translateZ(-12em) scale(0.8, 0.8);
    }
}
/* <!-- /旋转的3D盒子框 --> */

// <!-- /简单的3D立方体 -->
.cube__container {
    position: absolute;
    right: 25%;
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
</style>
