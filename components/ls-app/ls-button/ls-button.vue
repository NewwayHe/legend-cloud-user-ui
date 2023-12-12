<template>
    <!-- 
        按钮
        注意：一、现在不能写 @click.native(小程序不支持)，@click="clickButton"，之前是写成@click.stop="clickButton"的，但这样写的话，外面组件用@click.native的话小程序就点击事件不会生效：
                <ls-button className="but-main" @click="$refs.modal.change()">取 消</ls-button>
             二、不能写为成@click="sure()，应该要这样写：
                <ls-button className="but-main" @click="sure">取 消</ls-button>
     -->
    <button
        class="position-relative"
        :class="[className]"
        :style="[optionstyle, cssStyle]"
        :size="size"
        :type="type"
        :plain="plain"
        :disabled="disabledData"
        :loading="loadingData"
        :form-type="formType"
        :open-type="openType"
        :hover-class="hoverClass"
        :hover-start-time="hoverStartTime"
        :hover-stay-time="hoverStayTime"
        @click="clickButton"
    >
        <slot>
            <text :class="[`v-${mode}`]" v-if="text">{{ text }}</text>
        </slot>
        <!-- 点击按钮后的动画(现在只有水波纹，可以自行增加) -->
        <text
            class="position-absolute bottom-0 left-0 w-100 h-100 wave-ripple"
            :class="[{ 'animation-ripple': waveActive }]"
            :style="{
                'background-color': rippleBgColor || 'rgba(0, 0, 0, 0.15)',
                '--animationtime':`${animationTime/2000}s`,
            }"
            v-if="ripple && waveActive"
        ></text>
    </button>
</template>

<script>
import { throttle  } from '@/utils/utils.js';
export default {
    name: 'ls-button',
	// #ifdef MP-WEIXIN
	// 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性。这时在<组件name> 里加style和class是不会生效的
	options: { virtualHost: true },
	// #endif
    props: {
		className:{
			type: [String, Array,Boolean],//这里加个Boolean，是因为如果传className=""，小程序端会报错
			default: ''
		},

        options: Object, // 设置按钮的文字颜色、背景颜色、文字大小、弧度
        /*  例如：
            :options="{cl:'#666',bc:'#fff',fs:'28',lh:'2.2',bd:'var(--mainColor)',br:'10',pl:'10',pr:'10'}"，
            cl:color 文字颜色(默认值#333333),
            bc:background-color 背景颜色(默认值#ffffff),
            fs:font-size 文字大小(单位rpx,默认值28),
            ls:letter-spacing 文距(单位rpx,默认值0),
            lh:line-height:X倍行距，例如lh:'2.2'就是2.2倍行距(默认值normal),可以传px，如:lh:'44px',lh:'44rpx'
            bd:border线颜色，例如：bd:'var(--mainColor)'(border颜色为主题色),当不传bd值时，默认值border=0。当传bd值时，border默认是1px，
            bdSet:自定义border线(当有bdSet值时，bd值会失效)，例如：bdSet:2px solid var(--mainColor)
            br:border-radius 弧度(默认值0),
            pl:padding-left,默认值0，单位：rpx
            pr:padding-right,默认值0，单位：rpx
        */
        // 自定义样式，对象形式
        cssStyle: {
            type: Object,
            default() {
                return {};
            }
        },
        text: {
            // 按钮里的文字
            type: String,
            default: ''
        },
        time: {
            // 防二次点击的默认时间，默认单位是毫秒。传:time="0"则没有防二次点击功能
            type: Number,
            default: 1500
        },
		name: {		//在ls-header中使用asyncFunction时会导致name指向为ls-header 所以要增加prop来保证this的指向正确
			type: String,
			default: ''
		},
		asyncFunction: {
		    /*  接收外面的方法，方法需返回异步函数。执行完传入的异步函数后才可再次点击按钮
				例子：
					return new Promise((resolve) => {
						接口.then(()=>{}).finally(()=>{ return resolve() })
					})
				注意:一、方法里有检测参数不存在return的话，要return resolve()结束该方法，
					二、传入该值时将不会运行@click绑定的函数,
					三、如果不是Promise方法的话，就直接用原生的@click
					四、如果小程序端页面的this指向不正确，很有可能是因为页面没有设置：name
			*/
		    type:Function,
		},
        mode: {
            // button里text文字的vertical-align(垂直对齐方式)形式，具体参数请在ls-main.css里搜索v-middle
			// 可接收值：baseline，sub，top，middle，baseline-middle，bottom，text-bottom等。注意：如果默认是写middle的话，小程序上有些文字不会垂直居中
            type: String,
            default: ''
        },

        // 以下为原生button自带的参数
        size: {
            // 按钮的大小:default:默认大小; mini:小尺寸
            type: String,
            default: 'default'
        },
        type: {
            // 按钮的样式类型:default:白色; warn:红色; primary:微信小程序为绿色，App、H5、百度小程序、支付宝小程序为蓝色，头条小程序为红色，QQ小程序为浅蓝色
            type: String,
            default: 'default'
        },
        plain: {
            // 按钮是否镂空，背景色透明。
            type: Boolean,
            default: false
        },
        disabled: {
            // 是否禁用
            type: Boolean,
            default: false
        },
        loading: {
            // 点击按钮后，名称前是否带 loading 图标
            type: Boolean,
            default: false
        },
        formType: {
            // 用于 <form> 组件，点击分别会触发 <form> 组件的 submit/reset 事件
            type: String,
            default: ''
        },
        openType: {
            // 开放能力。contact:打开客服会话,share:触发用户转发,getUserInfo:获取用户信息(手机号、头像、昵称等),getPhoneNumber:获取用户手机号,launchApp:打开APP,openSetting:打开授权设置页
            type: String,
            default: ''
        },
        hoverClass: {
            // 指定按钮按下去的样式类。当 hover-class="none" 时，没有点击态效果
            type: String,
            default: 'button-hover'
        },
        hoverStartTime: {
            // 按住后多久出现点击态，单位毫秒
            type: Number,
            default: 20
        },
        hoverStayTime: {
            // 手指松开后点击态保留时间，单位毫秒
            type: Number,
            default: 70
        },

        // 水波纹的背景颜色
        rippleBgColor: {
            type: String,
            default: ''
        },
        // 是否开启水波纹效果
        ripple: {
            type: Boolean,
            default: true
        }
    },

    data() {
        return {
            disabledData: this.disabled, // 点击后,异步请求完后，才允许点击
            loadingData: false, //
            waveActive: false ,// 激活水波纹
            animationTime:500,// 水波纹动画时间
			dbClickBtnFn:null
        };
    },

    computed: {
        // 自定义样式，对象形式
        optionstyle() {
            const style = {
                color: `${(this.options && this.options.cl) || '#333333'}`, // 处理按钮里的文字颜色
                backgroundColor: !this.plain ? `${(this.options && this.options.bc) || '#ffffff'}` : '', // 处理按钮背景颜色, 如果没有设置透明，才显示背景
                fontSize: this.$stringUtils.addUnit((this.options && this.options.fs) || 28), // 处理按钮文字大小
                letterSpacing: this.$stringUtils.addUnit((this.options && this.options.ls) || ''), // 处理字距
                lineHeight: `${(this.options && this.options.lh) || 'normal'}`, // 处理行距
                border: this.options && this.options.bdSet ? `${this.options.bdSet}` : this.options && this.options.bd ? `1px solid ${this.options.bd}` : '', // 处理border线
                borderRadius: this.$stringUtils.addUnit((this.options && this.options.br) || ''), // 处理border线弧度，最后的''不能改为0，这样className="rounded-100"里改变borderRadius就不会生效
                paddingLeft: this.$stringUtils.addUnit((this.options && this.options.pl) || ''), // 处理padding-left
                paddingRight: this.$stringUtils.addUnit((this.options && this.options.pr) || '') // 处理padding-right
            };
            Object.assign(style, this.cssStyle);
            return style;
        }
    },

    watch: {
        disabled: {
            handler(newValue, oldValue) {
                setTimeout(() => {
                    this.disabledData = this.disabled;
                }, 0);
            },
            deep: true // 数组须要深度监听
        }
    },

    created() {},

    mounted() {
        // this.$nextTick(()=> {});
		this.dbClickBtnFn= throttle(this.clickBtnFn,this.time)
    },

    methods: {
        async clickButton(e) {
            this.waveActive = true;
            setTimeout(() => {
                this.waveActive = false;
            }, this.animationTime);

            this.disabledData = true;
            if (this.loading) {
                this.loadingData = true;
            }
            if (this.time) {
                if (this.asyncFunction) {
					//微信小程序该函数内的this指向本组件，H5、安卓App指向父组件,所以必须统一this，指向
					//uni.$u.$parent.call(this) from https://www.uviewui.com/js/fastUse.html
					
					// #ifdef MP
					let name = this.name || this.$parent.$options.name || ''
					if (name) {//小程序，如果是在组件里(非页面)引用ls-button，则要输入父组件的name属性值
						await this.asyncFunction.apply(uni.$u.$parent.call(this,name))//name，可选，页面或者父组件的name属性值，不传则默认查找页面(最顶层)的实例
					}else{//小程序，如果是页面里引入ls-button，则不能传name值，如果传一个''空值，该this值指向会错误
						await this.asyncFunction.apply(uni.$u.$parent.call(this))
					}
					// #endif
					
					// #ifndef MP
					await this.asyncFunction.apply(uni.$u.$parent.call(this))
					// #endif
                } else {
                    this.dbClickBtnFn(e);
                }
				setTimeout(() => {
				    this.disabledData = false;
				    this.loadingData = false;
				}, this.time);
            } else {
                if (this.asyncFunction) {
					// #ifdef MP
					let name = this.name || this.$parent.$options.name || ''
					if (name) {//小程序，如果是在组件里(非页面)引用ls-button，则要输入父组件的name属性值
						await this.asyncFunction.apply(uni.$u.$parent.call(this,name))//name，可选，页面或者父组件的name属性值，不传则默认查找页面(最顶层)的实例
					}else{//小程序，如果是页面里引入ls-button，则不能传name值，如果传一个''空值，该this值指向会错误
						await this.asyncFunction.apply(uni.$u.$parent.call(this))
					}
					// #endif
					
					// #ifndef MP
					await this.asyncFunction.apply(uni.$u.$parent.call(this))
					// #endif
                } else {
                    this.dbClickBtnFn(e);
                }
				this.disabledData = false;
				this.loadingData = false;
            }
        },
		clickBtnFn(e){
			this.$emit('click', e);
		},
	
    }
};
</script>

<style lang="scss" scoped>
// 备注:rpx传值的话要写在HTML内联里,不然会出现先换算,再拿值,就会rpx值永远也不会根据屏幕大小来换算
// button{
// &[loading]:before {width: 25px;height: 25px;};
// }
button {
    &::after {
        content: none !important;
    }
}
.wave-ripple {
    z-index: 0;
    transform-origin: center;
    background-clip: padding-box;
    pointer-events: none;
    user-select: none;
}
.animation-ripple {
    // 由中到两边：
    // start 加载时的动画效果
    animation: release-btn var(--animationtime) linear;
    @keyframes release-btn {
        0% {
            transform: scale(0, 1);
            opacity: 0;
        }
        100% {
            transform: scale(1, 1);
            opacity: 1;
        }
    }
    // end 加载时的动画效果
}
</style>

<!-- 使用方法：
    一、非异步方法：
            HTML里：
            withdraw等页面的提现按钮：
                非flex布局里：
                    <ls-button className="but-main h-100r mt-4 mx-2" text="确认提现" loading @click="submitApply" :options="{fs:'30',br:'8'}"/>
                flex布局里w-100要写在class里，写在className里小程序会不是100%：
                    <ls-button class="w-100" className="but-main h-100r mt-4" text="确认提现" loading @click="toWithdraw" :options="{fs:'30',br:'8'}"/>
            显示灰色字、白色背景、28rpx字体、2.2倍行距、绿色边框、10rpx圆角 的“搜索”按钮:
                <ls-button className="w-100" text="搜索" loading @click="searchSeller" :options="{cl:'#666',bc:'#fff',fs:'28',lh:'2.2',bd:themes.color,br:'10'}"/>
            立即领取按钮(有父级div限制，用:mode来定位里的文字)：
                <view class="get-btn flex-center" style="display: flex;align-items: center;" v-if="item.bindCouponNumber < item.couponNumber">
                    <ls-button className="w-100" text="立即领取" loading plain @click="getCoupon(item.couponId)" :mode="'baseline'" :options="{cl:'#fff',fs:'22'}"/>
                </view>
            商品评论里的发送按钮(有父级div限制，用到plain和mode):
                <ls-button className="w-100" text="发送" loading @click="replyComment" plain :mode="'sub'" :options="{cl:'#fff',fs:'28'}"/>
            种草评论里的发送按钮(没有父级div限制):
                <ls-button className="ml-2 py-1" text="发送" loading @click="saveComme" :mode="'baseline'" :options="{cl:'#fff',bc:themes.color,br:'50',pl:'30',pr:'30'}"/>
            登录页面上的登录按钮：
                <ls-button className="but-main h-100r my-4 mx-2" loading text="登录" @click="login" :options="{br:'8',ls:'20',fs:'30'}"/>
                <ls-button className="flex-center h-100r bg-white text-666 my-4 mx-2" text="注册" :time="500" @click="goRegister" :options="{br:'8',ls:'20',fs:'30',bd:'#eee'}"/>
            @click里方法正常的用
    
    二、异步方法：
        HTML里：
		定时器：:time="1000"异步方法完成后再等1秒才能点击按钮，loading时间为:1秒+异步方法的运行时间
        <ls-button :text="'搜索'" loading :asyncFunction="asyncFunction" :time="1000"/>
        
        JS里(注意：要用Promise异步处理，来防止重复点击问题--就算是设置了time，也要用Promise异步处理)：
        asyncFunction(){
            return new Promise((resolve) => {
				写法一(注意：该写法如果接口报错走catch时，可能会resolve不出东西出来从而导致按钮一直在loading)：
				return resolve(
					userApi.login(this.params).then((res) => {
						if(res.code) this.resData = res.data 
					})
				)
				写法二：
				if(!this.params) return resolve()
				userApi.login(this.params).then((res) => 
					{ if(res.code) this.resData = res.data }
				).finally(()=>{
					return resolve()
				})
            })
         },

 -->
