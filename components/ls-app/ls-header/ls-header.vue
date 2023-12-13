<template>
    <view :class="[fixed?'w-100vw':'']" :style="{ height: `calc(88rpx + ${bottomHeight + stausBarHeight}px)` }" @click.stop>
        <view
            class="w-100 flex-col-center"
			:class="[fixed?'position-fixed left-0 top-0':'',className]"
            :style="{
                '--themescolor': themes.color,
                zIndex: inzIndex,
                background: theme ? themes.color : background?background:'#ffffff',
                transform: 'translate3d(0,0,0)'
            }"
        >
            <view class="w-100" :style="{ height: stausBarHeight + 'px' }"></view>
            <view class="h-88r flex-start w-100" :style="headerStyle">
                <slot name="left">
                    <!-- 返回键 -->
                    <view class="w-88r h-100 flex-center border-box" v-if="showBack" @click.stop="goback">
                        <text class="iconfont icon-ArrowLeft" :style="{ color: goBackColor }"></text>
                    </view>
                    <!-- 返回键 -->
                </slot>

                <!-- 如果是微信端，头部菜单按钮放在左边 -->
                <!-- #ifdef MP -->
                <slot name="right" >
                    <head-select :type="headSelectIcon" class="mr-2" @showHeadSelect="changeHeadSelect" :theme="theme||(background&&background!='#ffffff')" :circularBg="'transparent'" :circular="theme||(background&&background!='#ffffff') ? '#ffffff' : '#444'" @clickHeadSelect="clickHeadSelect" v-if="showHeadSelect" />
                </slot>
                <!-- #endif -->

                <view class="flex-1 h-100 flex-center">
                    <slot>
                        <!-- 备注：如果有slot，则传的title会失效，title就要写在slot里 -->
                        <view class="line-clamp1 h-100 font-30 text-position" :class="[{ 'text-white': theme||(background&&background!='#ffffff'),'pr-1': $slots.right||showHeadSelect}]" :style="titleStyle" v-if="title">
                            {{ title }}
                        </view>
                    </slot>
                </view>


                <!-- 如果是不是微信端，头部菜单按钮放在右边 -->
                <!-- #ifndef MP -->
                <slot name="right">
                    <head-select :type="headSelectIcon" class="mr-2" @showHeadSelect="changeHeadSelect" :theme="theme||(background&&background!='#ffffff')" :circularBg="'transparent'" :circular="theme||(background&&background!='#ffffff') ? '#ffffff' : '#444'" @clickHeadSelect="clickHeadSelect" v-if="showHeadSelect" />
                </slot>

                <!-- 如果有返回健，并且没有开启菜单按钮，且title有值，在非微信端要放一个占位让title标题居中，$slots.right：判断是否有slot="right" -->
                <view class="w-88r h-100" v-if="showBack && !showHeadSelect && title && !$slots.right"></view>
                <!-- #endif -->

                <!-- 如果是是微信端，放一个胶囊的点位符 -->
                <!-- #ifdef MP -->
                <view :style="{ width: wxMenuBut.placeholder + 'px', display: 'block' }"></view>
                <!-- #endif -->
            </view>

            <!--
                TOFIX => 使用这里的插槽时需要注意，插槽最外层的view必须加上'class="bottom"'样式
                不在这里加view加class="bottom"，是因为小程序会出现兼容问题，而且插槽外层尽量避免使用margin
                因为margin不算在高度中
                用法：
                    <template slot="bottom">
                        <view class="bottom w-100vw">123</view>
                    </template>
             -->
            <view class="w-100 bottom">
                <slot name="bottom" />
            </view>
        </view>
    </view>
</template>

<script>
import headSelect from './head-select.vue'
import { mapState } from 'vuex'
export default {
    name: 'LsHeader',
    components: { 'head-select': headSelect },
	// #ifdef MP-WEIXIN
	// 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性。这时在<组件name> 里加style和class是不会生效的
	options: { virtualHost: true },
	// #endif
    props: {
		className:{
			type: [String, Array,Boolean],// 这里加个Boolean，是因为如果传className=""，小程序端会报错
			default: ''
		},
        /**
         * 导航文字
         */
        title: String,
        /**
         * 标题导航样式字符串
         */
        headerStyle: String,
        /**
         * 标题样式字符串
         */
        titleStyle: String,
        /**
         * 是否显示返回
         */
        showBack: {
            type: Boolean,
            default: true
        },
        /**
         * 是否头部菜单按钮
         */
        showHeadSelect: {
            type: Boolean,
            default: false
        },
        /**
         * 是否用主题颜色
         */
        theme: {
            type: Boolean,
            default: false
        },
        /**
         * 背景(如果theme为true，则此值失效)
         */
        background: {
            type: [String],
            default: ''
        },
        /**
         * 返回键钮的颜色(如果没传值，则如果theme为true或者有背景色，则为白色，否则默认为#444
         */
        backColor: {
            type: [String],
            default: ''
        },
        /**
         * fixed的层级,如果设为999的话，会比u-popup高导致u-popup覆盖不了它，但设为99的话，会比ls-tab低导致ls-tab会覆盖它
         */
        zIndex: {
            type: [Number, String],
            // default: 199
			default: 990
        },
		/**
		 * 导航栏右侧的字体图标类型，1: 非三个点图标  不等于1：三个点图标
		 */
		headSelectIcon: {
			type: [Number],
			default: 2
		},
		// 是否固定在顶部(当该页面内容少不会滚动时，由于IOS的H5会有个页面滚动回弹，这时可以设置fixed=false来增强体验)
		fixed: {
			type: Boolean,
			default: true
		},
    },
    data() {
        return {
            inzIndex: this.zIndex, // 解决点击右上角菜单时，由于层级不够，菜单显示在其它层级比100高的div之下的问题
            on: false,
            bottomHeight: 0
        }
    },
    computed: {
        ...mapState(['stausBarHeight', 'wxMenuBut']),
		// 返回健的颜色
		goBackColor(){
			let toBackColor = '#444'
			if (this.backColor) {
				toBackColor = this.backColor
			}else{
				toBackColor = this.theme || (this.background && this.background != '#ffffff' && this.background != 'transparent') ? '#ffffff' : '#444'
			}
			return toBackColor
		}
    },
    watch: {},
    created() {},

    mounted() {
        this.$nextTick(() => {
            this.getBottomHight()
        })
    },

    methods: {
        goback() {
            if (!this.$utils.pages.getPageRoute(1)) {
                this.$switchTab(`/pages/index/index`)
            } else {
                uni.navigateBack()
            }
        },
        clickHeadSelect(on) {
            this.$emit('clickHeadBox', on) // 告诉页面已经点击了头部下拉菜单里的选项(准备离开该页面),用到beforeRouteLeaver且记录了浏览历史的页面要拿到该参数进行判断将阻止离开页面的条件清空
        },
        changeHeadSelect(e) {
			if (e) {
				this.inzIndex = 9999 
			} else {
				// 等动画结束后才改变zIndex
				setTimeout(() => {
					this.inzIndex = this.zIndex
				},500)
			}
        },
        // 获取插槽bottom的高度
        getBottomHight() {
            this.$utils.getRect(this, '.bottom').then((res) => {
                this.bottomHeight = Number(res.height)
				// console.log(this.$slots);
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.text-position {
    line-height: 88rpx;
    font-weight: 400;
	font-size: 32rpx;
	color: #333;
    /* #ifndef MP */
    text-align: center;
    /* #endif */
    /* #ifdef MP */
    text-align: center;
    // 以前小程序是居左,现在改为居中
    // text-align: left;
    /* #endif */
}
</style>

<!-- 
页面标签中的写法:
<ls-header></ls-header>

这是最简版的标签,会自动占位到微信小程序的胶囊下方的位置
一般至少会设置几个参数:
<ls-header :title="title" :showBack="showBack" :titleStyle="titleStyle" @backTap="backClick" ref="backTap"></ls-header>

插件的所有参数如下:
导航文字:title,变量类型:String  
标题导航样式字符串:headerStyle,变量类型:String  
标题样式字符串:titleStyle,变量类型:String  
是否显示返回按钮:showBack,变量类型:Boolean  
点击返回事件调用的方法:showBack
具体的代码.已经上传到github:https://github.com/xieyushi/uniapp-custom-header

直接是现成的uniapp项目.下面说一下踩坑的问题:
1.--status-bar-height 这个CSS变量,不可取,特别是在全面屏,刘海屏(如IPHONE X)的时候,这个高度是完全不够的.所以状态栏的高度.还是要用如下代码来获取:
    const res = uni.getSystemInfoSync();
    return res.statusBarHeight + 'px';
2.导航的样式要用sticky.不要用fixed.
3.其它的小程序中没有测试过(因为这个状态栏下方的标题栏,在小程序中,不管什么设备,都是固定的44px不会变化,不知道其它的是多少,如果有区别,请大家在插件中加上CSS的条件编译来区分)

其它的注意事项:
1.顶部的容器我没有给底色,因为自定义很可能一般都不是白底了.所以这里的底色大家请自行设置吧,在containerStyle中直接加上background的自定义样式就行了.
2.自定义导航的页面,如果有分享.那么用户点了分享进来后,这个返回的按钮要不要显示的问题,以及如果显示,那么点了返回跳转到哪个页面的问题.大家一定要维护好,不然这个自定导航栏还不如不做...
3.左上角的返回目前是用的uni.css中的uni-icon-back,其实这并不是一个很好的选项,样式上,大家要自己调一下.让返回的图标与文字能够居中对齐是对好(我目前的项目.是用了button,然后用了图片,有局限性,
  在这里的我用的是view,用户可以自定义这个view的class,大家可以给这个view 背景图片等来丰富这个元素)
4.title和<slot>不能一起用，参考下面【例子二】
  
  例子一：
    店铺页面的头部搜索栏：

        <ls-header>
            <view class="flex-around flex-1">
                <view class="flex-1 flex-start pl-2">
                    <u-icon name="search" color="#ccc" size="36"></u-icon>
                    <input class="w-100 pl-2" type="text" placeholder="搜索店铺商品" v-model="searchText" @confirm="search" />
                </view>
                <view class="font-28 text-666 flex-center pr-2" @click="toSCategory"><text>分类</text></view>
            </view>
        </ls-header>
    
  例子二：
    商品分组的头部(特别之处：有title值，中间也有slot)：
        <ls-header title="商品分组">
            <view class="px-2" @click="changeType">
                <text class="iconfont" :class="goodsType?'icon-fenlei4':'icon-fenlei2'" style="font-size: 40rpx;"></text>
            </view>
        </ls-header>
  
-->
