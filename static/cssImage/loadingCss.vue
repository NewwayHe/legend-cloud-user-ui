<template>
    <!-- 写在ls-empty组件里的loading动态图片
        注意：父组件的容器要加入position:relative;并且设定宽和高
     -->
    <view
        class="content translate3d0"
        :style="[{
            '--themescolor': themesColor,
            '--themesrgba09': themesRGBA09,
            '--themesrgba08': themesRGBA08,
            '--themesrgba07': themesRGBA07,
            '--themesrgba06': themesRGBA06,
            '--themesrgba05': themesRGBA05,
            '--themesrgba04': themesRGBA04,
            '--themesrgba03': themesRGBA03,
            '--themesrgba02': themesRGBA02,
            '--themesrgba01': themesRGBA01
        }, ...customStyle]"
		:key="key"
		v-if="themes&&themes.color&&themesRgb"
    >
		<!-- 三个旋转的点 -->
		<view class="loader-3-dot" v-if="type=='3dot'">
		  <view class="inner one"></view>
		  <view class="inner two"></view>
		  <view class="inner three"></view>
		</view>

        <!-- 旋转的花 -->
        <view class="rotating-flower" v-if="type=='flower'">
          <view class="s1"></view>
          <view class="s2"></view>
          <view class="s3"></view>
          <view class="s4"></view>
        </view>

        <!-- 3D原子 -->
        <view class="atom" v-if="type=='atom'">
            <view class="core"></view>
            <view class="core"></view>
        </view>
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
		// loading的样式,3dot：三个旋转的点，flower：旋转的花，atom：3D原子，
		type:{
			type:String,
			default:'3dot'
		},
		// 动态图片主题颜色(必需是传16进制的颜色，传rgba值不行)
		color:{
			type:String,
			default:''
		},
		customStyle: {
			type: Object,
			default: () => ({})
		}
	},
    computed: {
		themesColor(){
			return this.color || this.themes.color
		},
		themesRgb(){
			return this.$utils.color.colorRgb(this.color || this.themes.color)
		},
        themesRGBA09() {
            return `rgba(${this.themesRgb.r}, ${this.themesRgb.g},${this.themesRgb.b},.9)`
        },
        themesRGBA08() {
            return `rgba(${this.themesRgb.r}, ${this.themesRgb.g},${this.themesRgb.b},.8)`
        },
        themesRGBA07() {
            return `rgba(${this.themesRgb.r}, ${this.themesRgb.g},${this.themesRgb.b},.7)`
        },
        themesRGBA06() {
            return `rgba(${this.themesRgb.r}, ${this.themesRgb.g},${this.themesRgb.b},.6)`
        },
        themesRGBA05() {
            return `rgba(${this.themesRgb.r}, ${this.themesRgb.g},${this.themesRgb.b},.5)`
        },
        themesRGBA04() {
            return `rgba(${this.themesRgb.r}, ${this.themesRgb.g},${this.themesRgb.b},.4)`
        },
        themesRGBA03() {
            return `rgba(${this.themesRgb.r}, ${this.themesRgb.g},${this.themesRgb.b},.3)`
        },
        themesRGBA02() {
            return `rgba(${this.themesRgb.r}, ${this.themesRgb.g},${this.themesRgb.b},.2)`
        },
        themesRGBA01() {
            return `rgba(${this.themesRgb.r}, ${this.themesRgb.g},${this.themesRgb.b},.1)`
        }
    },
	mounted() {
		this.key++
	},
    methods: {}
}
</script>

<style lang="scss" scoped>
.content {
    position: relative;
    margin: 0px;
    overflow: hidden;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}


/* <!-- 三个旋转的点 --> */
.loader-3-dot {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.inner {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-radius: 50%;  
}

.inner.one {
  left: 0%;
  top: 0%;
  animation: rotate-one 1s linear infinite;
  border-bottom: 6rpx solid var(--themesrgba06);
}

.inner.two {
  right: 0%;
  top: 0%;
  animation: rotate-two 1s linear infinite;
  border-right: 6rpx solid var(--themesrgba06);
}

.inner.three {
  right: 0%;
  bottom: 0%;
  animation: rotate-three 1s linear infinite;
  border-top: 6rpx solid var(--themesrgba06);
}

@keyframes rotate-one {
  0% {
    transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
  }
}

@keyframes rotate-two {
  0% {
    transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
  }
}

@keyframes rotate-three {
  0% {
    transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
  }
}

/* <!-- /三个旋转的点 --> */

/* <!-- 旋转的花 --> */
.rotating-flower {
    position: relative;
    right: 0;
    bottom: 0%;

    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transform: rotateX(70deg) rotateZ(10deg) rotateY(0deg);
    animation: rotate 6s infinite linear;
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
    transform: rotateY(90deg);
    background: var(--themesrgba08);
    box-shadow: 0 0 2px var(--themesrgba08);
}
.s4 {
    transform: rotateY(135deg);
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
    right: 0;
    bottom: 0;
    transform: scale(0.8);

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
    border: 3px solid var(--themesrgba06);
    /* border: 3px solid #005792; */
    box-shadow: 0 0 3px 3px var(--themesrgba04), 0 0 3px 3px var(--themesrgba05) inset;
    /* box-shadow: 0 0 3px 3px #d9faff, 0 0 3px 3px #d9faff inset; */
}
.core:first-child {
    background: radial-gradient(circle at 25% 25%, #d9faff -75%, var(--themesrgba04), var(--themesrgba09) 75%);
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
