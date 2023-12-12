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
        <!-- 3D原子 -->
        <view class="atom" :style="{ '--seconds': cur ? '20s' : '0s' }">
            <view class="core"></view>
            <view class="core"></view>
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
    // position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
}
.core,
.core::before,
.core::after {
    position: absolute;
    border-radius: 50%;
    transform-style: preserve-3d;
    animation: var(--seconds) linear infinite;
}
.core {
    width: 50%;
    height: 50%;
    animation-name: rotate3DZ;
}
.core::before,
.core::after {
    width: 160%;
    height: 160%;
    content: '';
    border: 1px solid var(--themesrgba08);
    /* border: 3px solid #005792; */
    box-shadow: 0 0 1px 1px var(--themesrgba04), 0 0 1px 1px var(--themesrgba05) inset;
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
</style>
