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
        <!-- 旋转的花 -->
        <view class="rotating-flower" :style="{ '--seconds': cur ? '20s' : '0s' }">
            <view class="s1"></view>
            <view class="s2"></view>
            <view class="s3"></view>
            <view class="s4"></view>
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
    position: absolute;
    margin: 0px;
    // overflow: hidden;

    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

/* <!-- 旋转的花 --> */
.rotating-flower {
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transform: rotateX(70deg) rotateZ(10deg) rotateY(0deg);
    animation: rotate var(--seconds) infinite linear;
}
.rotating-flower view {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.7;
    border-radius: 50%;
}
.s1 {
    transform: rotateY(0deg);
    background: var(--themescolor);
    box-shadow: 0 0 2px var(--themescolor);
}
.s2 {
    transform: rotateY(45deg);
    background: var(--themesrgba09);
    box-shadow: 0 0 2px var(--themesrgba09);
}
.s3 {
    transform: rotateY(-45deg);
    background: var(--themesrgba08);
    box-shadow: 0 0 2px var(--themesrgba08);
}
.s4 {
    transform: rotateY(90deg);
    background: var(--themesrgba07);
    box-shadow: 0 0 2px var(--themesrgba07);
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
</style>
