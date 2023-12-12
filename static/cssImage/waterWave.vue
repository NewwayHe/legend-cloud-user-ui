<template>
    <!-- 水波效果
        注意：父组件的容器要加入position:relative;并且设定宽和高
     -->
    <view
        class="sound-container"
        :style="{
            '--themescolor': themes.color,
            '--themesrgba09': themesRGBA09,
            '--themesrgba08': themesRGBA08,
            '--themesrgba07': themesRGBA07,
            '--themesrgba04': themesRGBA04
        }"
    >
        <ul class="sound">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
        </ul>
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
.sound-container {
    background-color: #252222;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.sound {
    position: relative;
    width: 140px;
    height: 140px;
    padding: 0;
    border-radius: 200px;
    list-style: none;
    overflow: hidden;
    z-index: 2;
}
.sound li {
    background: var(--themescolor);
    /* background: #f16880; */
    position: absolute;
    margin: auto;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    width: 0%;
    height: 0%;
    border-radius: 50%;
}
.sound li:nth-child(1) {
    opacity: 0.2;
    -webkit-animation: zoom1 6s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
    animation: zoom1 6s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
}
.sound li:nth-child(2) {
    opacity: 0.3;
    -webkit-animation: zoom2 6s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
    animation: zoom2 6s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
    -webkit-animation-delay: 0.3s;
    animation-delay: 0.3s;
}
.sound li:nth-child(3) {
    opacity: 0.5;
    -webkit-animation: zoom3 6s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
    animation: zoom3 6s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
    -webkit-animation-delay: 0.6s;
    animation-delay: 0.6s;
}
.sound li:nth-child(4) {
    opacity: 0.6;
    -webkit-animation: zoom4 6s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
    animation: zoom4 6s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
    -webkit-animation-delay: 0.9s;
    animation-delay: 0.9s;
}

@-webkit-keyframes zoom1 {
    0% {
        width: 0%;
        height: 0%;
    }
    35% {
        width: 100%;
        height: 100%;
    }
    50% {
        opacity: 0;
        width: 100%;
        height: 100%;
    }
    100% {
        opacity: 0;
        width: 100%;
        height: 100%;
    }
}

@keyframes zoom1 {
    0% {
        width: 0%;
        height: 0%;
    }
    35% {
        width: 100%;
        height: 100%;
    }
    50% {
        opacity: 0;
        width: 100%;
        height: 100%;
    }
    100% {
        opacity: 0;
        width: 100%;
        height: 100%;
    }
}
@-webkit-keyframes zoom2 {
    0% {
        width: 0%;
        height: 0%;
    }
    35% {
        width: 75%;
        height: 75%;
    }
    50% {
        opacity: 0;
        width: 75%;
        height: 75%;
    }
    100% {
        opacity: 0;
        width: 75%;
        height: 75%;
    }
}
@keyframes zoom2 {
    0% {
        width: 0%;
        height: 0%;
    }
    35% {
        width: 75%;
        height: 75%;
    }
    50% {
        opacity: 0;
        width: 75%;
        height: 75%;
    }
    100% {
        opacity: 0;
        width: 75%;
        height: 75%;
    }
}
@-webkit-keyframes zoom3 {
    0% {
        width: 0%;
        height: 0%;
    }
    35% {
        width: 50%;
        height: 50%;
    }
    50% {
        opacity: 0;
        width: 50%;
        height: 50%;
    }
    100% {
        opacity: 0;
        width: 50%;
        height: 50%;
    }
}
@keyframes zoom3 {
    0% {
        width: 0%;
        height: 0%;
    }
    35% {
        width: 50%;
        height: 50%;
    }
    50% {
        opacity: 0;
        width: 50%;
        height: 50%;
    }
    100% {
        opacity: 0;
        width: 50%;
        height: 50%;
    }
}
@-webkit-keyframes zoom4 {
    0% {
        width: 0%;
        height: 0%;
    }
    35% {
        width: 25%;
        height: 25%;
    }
    50% {
        opacity: 0;
        width: 25%;
        height: 25%;
    }
    100% {
        opacity: 0;
        width: 25%;
        height: 25%;
    }
}
@keyframes zoom4 {
    0% {
        width: 0%;
        height: 0%;
    }
    35% {
        width: 25%;
        height: 25%;
    }
    50% {
        opacity: 0;
        width: 25%;
        height: 25%;
    }
    100% {
        opacity: 0;
        width: 25%;
        height: 25%;
    }
}
</style>
