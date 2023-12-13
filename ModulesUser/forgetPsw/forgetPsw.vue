<template>
    <view class="w750" :style="{ '--themescolor': themes.color, '--themesrgba02': themes.rgb02 }">
        <view class="p-2">
            <view class="px-2">
                <template v-if="!nextType">
                    <view class="h-100r d-flex border-bottom border-f1">
                        <input type="number" class="font-28 font-arial flex-1 h-100" v-model="phone" maxlength="11" placeholder="请输入注册时使用的手机号" />
                    </view>
                    <view class="h-100r border-bottom border-f1 code flex-start">
                        <input type="text" class="font-28 font-arial flex-1 h-100" v-model="code" placeholder="请输入短信验证码" :maxlength="6" />
                        <view class="p-2 h-60r h-100 border-left border-f1 text-666 flex-end">
                            <ls-verify-code :params="{ codeType: 'FORGET_PASSWORD', mobile: phone }" @change="change"/>
                        </view>
                    </view>
                </template>
                <template v-else>
                    <view class="h-100r border-bottom border-f1">
                        <input type="text" password class="font-28 font-arial flex-1 h-100" v-model="pasw" placeholder="请输入新密码" maxlength="20" />
                    </view>
                    <view class="h-100r border-bottom border-f1">
                        <input type="text" password class="font-28 font-arial flex-1 h-100" v-model="surePwd" placeholder="确认新密码" maxlength="20" />
                    </view>
                </template>
            </view>
            <ls-button
                :className="(showBut ? 'but-main' : 'but-main-rgb02 text-white pointer-none') +'  h-88r my-4 mx-2'"
                v-if="!nextType"
                loading
                :text="'下一步'"
                @click="nextStep"
                :options="{ br: '50', fs: '30' }"
            />
            <ls-button
                :className="(showBut ? 'but-main' : 'but-main-rgb02 text-white pointer-none') +'  h-88r my-4 mx-2'"
                v-else
                loading
                :text="'确认'"
                @click="forgetConfirm"
                :options="{ br: '50', ls: '20', fs: '30' }"
            />
        </view>
    </view>
</template>

<script>
import { userApi } from '@/api/ModulesUser.js'
export default {
    components: {},
    data() {
        return {
            pasw: '', // 密码
            surePwd: '', // 再次输入密码
            phone: '', // 手机号码
            code: '', // 验证码
            nextType: false, // 下一步
            secretKey: '' ,// 核销秘钥
            hasClickCode:false,// 是否已经点击了【获取验证码】
        }
    },

    computed: {
        // 检测手机号码是否正确
        showBut() {
           // !this.nextType:(如果是第一步--获取验证码);this.nextType:(如果是第二步--输入密码)
            return !this.nextType ? (this.phone && this.code) : (this.pasw && this.surePwd);
        },
    },
    watch: {},

    mounted() {},
    methods: {
        // 获取是否已经点击了【获取验证码】
        change(val){
            this.hasClickCode = val
        },
        
        // 修改手机号第一步
        nextStep() {
            this.$u.debounce(() => {
                if (!this.$checkInfo([
                    { type: 'phone', value: this.phone,msg:'请输入正确的手机号码' },
                    { type: 'hasValue', value: this.hasClickCode,msg:'请先点击“获取验证码”' },
                    { type: 'code', value: this.code,options:6,msg:'请输入正确的验证码' },
                ])) return;
                const params = {
                    mobile: this.phone,
                    code: this.code,
                    password: '',
                    codeType: 'FORGET_PASSWORD'
                }
                userApi.verifyCode(params).then((res) => {
                    if (res.code == 1) {
                        this.secretKey = res.data
                        this.nextType = !this.nextType
                    }
                })
            })
        },

        // 找回密码
        forgetConfirm() {
            this.$u.debounce(() => {
                if (!this.$checkInfo([
                    { type: 'loginPassword', value: this.pasw, msg: true },
                 ])) return;
                if (this.pasw != this.surePwd) {
                    uni.showToast({ title: '两次密码不一致', icon: 'none' })
                    return
                }
                userApi.forgetPwd({ mobile: this.phone, code: this.secretKey, password: this.pasw, codeType: 'FORGET_PASSWORD' }).then((res) => {
                    if (res.code == 1) {
                        uni.showToast({
                            title: '修改成功',
                            icon: 'none',
                            mask: true,
                            complete:() => {
                                setTimeout(() => {
                                    uni.navigateTo({ url: '/ModulesUser/login/login' }) // 如果验证没通过，跳转至登录页面
                                }, 1500)
                            }
                        })
                    }
                })
            })
        },
    }
}
</script>

<style scoped>
</style>
