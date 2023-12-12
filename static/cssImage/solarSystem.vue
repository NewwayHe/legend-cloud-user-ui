<template>
    <!-- 纯CSS太阳系 
        注意：父组件的容器要加入position:relative;并且设定宽和高
    -->
    <view
        class="stars"
        :style="{
            '--themescolor': themes.rgb06,
            '--themesrgba09': themesRGBA09,
            '--themesrgba08': themesRGBA08,
            '--themesrgba07': themesRGBA07,
            '--themesrgba04': themesRGBA04
        }"
    >
        <view class="hoop">
            <text class="center"></text>
            <view class="star"></view>
        </view>

        <view class="hoop">
            <view class="star"></view>
        </view>

        <view class="hoop">
            <view class="star">
                <view class="earth">
                    <view class="earth-star"></view>
                </view>
            </view>
        </view>

        <view class="hoop">
            <view class="star"></view>
        </view>

        <view class="hoop"></view>
        <view class="hoop"></view>
        <view class="hoop"></view>
        <view class="hoop"></view>
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
            return `rgba(${this.themes.rgb.r}, 255,${this.themes.rgb.b},.4)`
        }
    }
}
</script>

<style scoped>
.stars {
    position: absolute;
    color: var(--themescolor);
    /* color:var(--themesrgba07); */
    /* color:#0ef; */
    width: 100%;
    /* background-color:black; */
    background-color: var(--themescolor);
    /*        background-color: var(--themesrgba07); */
    height: 100%;
    overflow: hidden;
    transform-style: preserve-3d;
    perspective: 1000px;
    left: 0;
    top: 0;
}
.stars:hover .hoop,
.stars:hover .hoop:nth-of-type(2),
.stars:hover .hoop:nth-of-type(3),
.stars:hover .hoop:nth-of-type(4) {
    animation-play-state: paused;
}
.stars:hover .hoop .star,
.stars:hover .hoop .center,
.stars:hover .hoop:nth-of-type(2) .star,
.stars:hover .hoop:nth-of-type(2) .center,
.stars:hover .hoop:nth-of-type(3) .star,
.stars:hover .hoop:nth-of-type(3) .center,
.stars:hover .hoop:nth-of-type(4) .star,
.stars:hover .hoop:nth-of-type(4) .center {
    animation-play-state: paused;
}
.stars .center,
.stars .star,
.stars .earth-star {
    display: block;
    width: 40px;
    height: 40px;
    /* background-color:#0ef; */
    background-color: var(--themescolor);
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -20px;
    margin-left: -20px;
    border-radius: 50%;
    box-shadow: 0px 0px 2px var(--themesrgba07), 0px 0px 4px var(--themesrgba08), 0px 0px 6px var(--themesrgba09),
        0px 0px 12px rgba(255, 255, 255, 0.1), 0px 0 10px rgba(255, 255, 255, 0.1), 0px 0px 6px rgba(255, 255, 255, 0.1),
        0px 0px 10px rgba(255, 255, 255, 0.1), 0px 0px 40px rgba(255, 255, 255, 0.15);
    /* box-shadow:0px 0px 2px #00DDFF,0px 0px 4px #00CCFF,0px 0px 6px #00BBFF,0px 0px 12px rgba(255,255,255,0.1),0px 0 10px rgba(255,255,255,0.1),0px 0px 6px rgba(255,255,255,0.1),0px 0px 10px rgba(255,255,255,0.1),0px 0px 40px rgba(255,255,255,0.15); */
}
.stars .hoop {
    position: absolute;
    width: 100px;
    height: 100px;
    top: 50%;
    left: 50%;
    margin-top: -50px;
    margin-left: -50px;
    border: dashed 1px var(--themesrgba04);
    /* border:dashed 1px #099; */
    border-radius: 50%;
    box-sizing: border-box;
    transform-style: preserve-3d;
    backface-visibility: hidden;
    perspective: 1000px;
    animation: loop1 7s linear infinite;
}
.stars .hoop .star {
    width: 20px;
    height: 20px;
    top: 10px;
    left: 60px;
    animation: star1 7s linear infinite;
}
.stars .hoop .center {
    animation: center 7s linear infinite;
}
.stars .hoop:nth-of-type(2) {
    width: 200px;
    height: 200px;
    top: 50%;
    left: 50%;
    margin-top: -100px;
    margin-left: -100px;
    animation: loop1 8s linear infinite;
}
.stars .hoop:nth-of-type(2) .star {
    width: 18px;
    height: 18px;
    top: 11px;
    left: 109px;
    animation: star1 8s linear infinite;
}
.stars .hoop:nth-of-type(3) {
    width: 300px;
    height: 300px;
    top: 50%;
    left: 50%;
    margin-top: -150px;
    margin-left: -150px;
    animation: loop1 9s linear infinite;
}
.stars .hoop:nth-of-type(3) .star {
    width: 10px;
    height: 10px;
    top: 15px;
    left: 155px;
    animation: star1 9s linear infinite;
}
.stars .hoop:nth-of-type(4) {
    width: 400px;
    height: 400px;
    top: 50%;
    left: 50%;
    margin-top: -200px;
    margin-left: -200px;
    animation: loop1 10s linear infinite;
}
.stars .hoop:nth-of-type(4) .star {
    width: 10px;
    height: 10px;
    top: 15px;
    left: 205px;
    animation: star1 10s linear infinite;
}
.stars .hoop:nth-of-type(5) {
    width: 480px;
    height: 480px;
    margin-top: -240px;
    margin-left: -240px;
    border: dotted 3px var(--themesrgba04);
    /* border:dotted 3px #099; */
    animation: loop1 10s linear infinite;
}
.stars .hoop:nth-of-type(6) {
    width: 470px;
    height: 470px;
    margin-top: -235px;
    margin-left: -235px;
    border: dotted 3px var(--themesrgba04);
    /* border:dotted 3px #099; */
    animation: loop1 10s linear infinite;
}
.stars .hoop:nth-of-type(7) {
    width: 460px;
    height: 460px;
    margin-top: -230px;
    margin-left: -230px;
    border: dotted 3px var(--themesrgba04);
    /* border:dotted 3px #099; */
    animation: loop1 10s linear infinite;
}
.stars .hoop:nth-of-type(8) {
    width: 450px;
    height: 450px;
    margin-top: -225px;
    margin-left: -225px;
    border: dotted 3px var(--themesrgba04);
    /* border:dotted 3px #099; */
    animation: loop1 10s linear infinite;
}
.stars .earth {
    position: absolute;
    width: 40px;
    height: 40px;
    top: -15px;
    left: -15px;
    border: dashed 1px var(--themesrgba04);
    /* border:dashed 1px #099; */
    border-radius: 50%;
    box-sizing: border-box;
    transform-style: preserve-3d;
    perspective: 1000px;
    animation: loop2 6s linear infinite;
}
.stars .earth .earth-star {
    width: 6px;
    height: 6px;
    top: 20px;
    left: 25px;
    animation: star2 6s linear infinite;
}
@keyframes loop1 {
    0% {
        transform: rotateX(60deg) rotateY(30deg) rotateZ(0deg);
    }
    100% {
        transform: rotateX(60deg) rotateY(30deg) rotateZ(360deg);
    }
}
@keyframes star1 {
    0% {
        transform: rotateZ(360deg) rotateY(-30deg) rotateX(-60deg);
    }
    100% {
        transform: rotateZ(0deg) rotateY(-30deg) rotateX(-60deg);
    }
}
@keyframes center {
    0% {
        transform: rotateZ(360deg) rotateY(0deg) rotateX(120deg);
    }
    100% {
        transform: rotateZ(0deg) rotateY(0deg) rotateX(120deg);
    }
}
@keyframes loop2 {
    0% {
        transform: rotateX(-30deg) rotateY(30deg) rotateZ(0deg);
    }
    100% {
        transform: rotateX(-30deg) rotateY(30deg) rotateZ(360deg);
    }
}
@keyframes star2 {
    0% {
        transform: rotateZ(360deg) rotateY(-30deg) rotateX(30deg);
    }
    100% {
        transform: rotateZ(0deg) rotateY(-30deg) rotateX(30deg);
    }
}
</style>
