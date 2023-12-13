<template>
    <!-- /*
     * @Descripttion:验证码倒计时 
    */ -->
    <view :class="[className]">
        <u-verification-code :keep-running="true" :seconds="codeTime"  ref="uCode" @change="codeChange" :unique-key="uniqueKey"></u-verification-code>
        <text @click.prevent="getVerifyCode">{{tips}}</text>
    </view>
</template>

<script>
// 接口
import { userApi } from '@/api/ModulesUser.js'
export default {
    name: 'LsVerifyCode',
	// #ifdef MP-WEIXIN
	// 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性。这时在<组件name> 里加style和class是不会生效的
	options: { virtualHost: true },
	// #endif
    props: {
        // 倒计时的时间
        codeTime: {
            type: [Number, String],
            default: 60
        },
        // 短信验证码的接口参数
        params: {
            type: Object
        },
        /*
        *params:{
        *   "codeType": "",发送验证码类型：注册：REGISTER、登录：LOGIN、忘记密码：FORGET_PASSWORD、修改登录密码：MODIFY_LOGIN_PASSWORD、修改支付密码：MODIFY_PAY_PASSWORD、换绑手机，旧号码：MODIFY_BINDING_MOBILE、换绑手机，新号码：CONFIRM_MOBILE_BIND,
        *               // 可用值:TEMP_CERTIFICATE,LOGIN,REGISTER,BIND_MOBILE_PHONE,FORGET_PASSWORD,MODIFY_LOGIN_PASSWORD,MODIFY_PAY_PASSWORD,MODIFY_BINDING_MOBILE,CONFIRM_MOBILE_BIND
        *   "ip": "",//请求ip地址(不用传)
        *   "mobile": "", //发送手机号 ： 不需要登录请求/userSend/smsVerifyCode；普通用户登录请求/p/userSend/smsVerifyCode；商家用户登录/s/userSend/smsVerifyCode；
        *   "userType": 'USER' //用户类型(该参数已经在接口里写死，不用传)
        * }
        */
        className:{
        	type: [String, Array,Boolean],// 这里加个Boolean，是因为如果传className=""，小程序端会报错
        	default: ''
        },
        // 是否需要登录，false：不需要登录请求(用smsVerifyCode接口)，true：普通用户登录请求(用pSmsVerifyCode接口)
        needLogin: {
            type: [Boolean],
            default: false
        },
    },
    data() {
        return {
            tips: '',// u-verification-code验证码倒计时专用
            uniqueKey:this.$utils.pages.getPageRoute().url,// 多个组件之间继续倒计时的区分key(用页面地址来区分)
        }
    },
    computed: { },
    mounted() {
        this.uniqueKey = this.$utils.pages.getPageRoute().url
    },

    methods: {
        // u-verification-code验证码倒计时专用
        codeChange(text) {
        	this.tips = text;
        },
        
        // 发送验证码
        getVerifyCode() {
            this.$u.debounce(() => {
                // 禁止点击
                if (!this.needLogin && !this.$checkInfo([{ type: 'phone', value: this.params.mobile,msg:'请输入正确的手机号码' }])) return;
                if(this.$refs.uCode.canGetCode) {
                    const api = !this.needLogin ? 'smsVerifyCode' : 'pSmsVerifyCode'
                    userApi[api](this.params).then((res) => {
                        if (res.code == 1) {
                            // 这里此提示会被this.start()方法中的提示覆盖
                            this.$u.toast('验证码已发送');
                            // 通知验证码组件内部开始倒计时
                            this.$refs.uCode.start();
                            this.$emit('change', true)// 告诉父组件已经成功点击了发送按钮
                        }
                    })
                } else {
                    this.$u.toast('倒计时结束后再发送');
                }
            })
        },
    }
}
</script>

<style></style>
