<template>
    <!-- 绑定手机号  -->
    <view class="w-100 overflow-h position-relative h-100vh" :style="{ '--themescolor': themes.color, '--themesrgba02': themes.rgb02 }">
        <view style="padding-top: 240rpx"></view>
        <!-- 返回键 -->
        <view class="position-absolute left-0 px-6 h-88r w-88r flex-center" style="top: 100rpx" @click.stop="goback">
            <text class="iconfont icon-ArrowLeft text-666" style="font-size: 40rpx;"  ></text>
        </view>
        <!-- 返回键 -->

        <!-- 顶部的拱斗图案 -->
        <view class="right-top-sign"></view>
        <!-- 顶部的拱斗图案 -->

        <!-- 底部的拱斗图案 -->
        <view class="left-bottom-sign" v-if="!isWeixin"></view>
        <!-- 底部的拱斗图案 -->
        <view class="position-relative h-100r">
            <view class="position-absolute left-0 bottom-0" style="font-size: 120rpx; color: #f8f8f8">PHONE</view>
            <text class="position-absolute left-0 bottom-0 font-big font-weight pl-6 text-555">绑定手机号码！</text>
        </view>
        <view class="px-6 pt-6">
            <view class="p-3 flex-around text-666 rounded-10 mb-5" style="background: #f8f6fc">
                <view class="flex-1 flex-col-start">
                    <text class="font-28">手机号码</text>
                    <input class="pt-1" type="number" placeholder="请输入手机号" :maxlength="11" v-model="phone" />
                </view>
                <view class="pl-2 h-40r h-100 border-left border-666 text-666 flex-end">
                    <ls-verify-code :params="{ codeType: 'LOGIN',mobile: phone }" @change="change" />
                </view>
            </view>
            <view class="p-3 flex-around text-666 rounded-10" style="background: #f8f6fc">
                <view class="flex-1 flex-col-start">
                    <text class="font-28">验证码</text>
                    <input class="pt-1" type="text" placeholder="请填写短信验证码" v-model="code" :maxlength="6" />
                </view>
            </view>
        </view>
        <view class="w-100 border-box my-6 px-6">
            <view class="w-100 h-88r rounded-100 font-32" :class="[showBut ? 'but-main' : 'but-main-rgb02 text-white pointer-none']" @click="next"><text>确定</text></view>
        </view>
    </view>
</template>

<script>
import { passport } from '@/utils/Cache.js'
import oauthService from '@/service/oauth.js'
export default {
    components: { },
    data() {
        return {
            phone: '', // 手机号
            code: '', // 验证码
            thirdloginHref: '', // 当是点击分享的链接(例如拼团)，在Cache.js里将链接放到缓存里后，用该变量来接收该链接地址(登录成功后跳到该链接)，该变量只用于微信端的H5
            isWeixin: this.$utils.getUa().isWeixin || false,
            hasClickCode:false,// 是否已经点击了【获取验证码】
        }
    },
    computed: {
        showBut() {
            return (this.phone && this.code);
        },
    },
    onLoad() {
        if (uni.getStorageSync('thirdloginHref') && this.isWeixin) {
            this.thirdloginHref = uni.getStorageSync('thirdloginHref')
            uni.removeStorage('thirdloginHref') // 获取完跳转前的页面后，马上从缓存里删除
        }
    },
    mounted() {
    },
    onUnload() {},
    methods: {
        // 获取是否已经点击了【获取验证码】
        change(val){
            this.hasClickCode = val
        },
        
        // 修改手机号第一步
        next() {
            this.$u.debounce(() => {
                if (!this.$checkInfo([
                    { type: 'phone',value: this.phone,msg: '请输入正确的手机号码' },
                    { type: 'hasValue',value: this.hasClickCode,msg: '请先点击‘获取验证码’' },
                    { type: 'code',value: this.code,msg: '请输入正确的验证码' },
                ])) return;
                uni.showLoading({
                    mask: true,
                    title: '正在绑定...',
                    success: (res) => {
                        setTimeout(() => {
                            uni.hideLoading() // 防止特殊情况下页面上一直显示loading
                        }, 5000)
                    }
                })

                const params = {
                    principal: this.phone,
                    credentials: this.code,
                    third_party_identifier: passport.getPassportIdKey(),
                    auth_type: 'WECHAT_MP'
                }

                oauthService.login(params).then((res) => {
                    if (res.success) {
                        passport.clearPassportIdKey() // 登录成功后不清除掉passportId的话，退出登录后，下次登录时，就会取上一个账号的passportId，这样就会导致passportId对不上而登录失败
                        uni.hideLoading()
                        uni.showToast({
                            title: '登录成功',
                            mask: true,
                            complete:() => {
                                setTimeout(() => {
                                    this.$utils.pages.goBeforePage(1, ['login']) // 从什么页面过来的就跳回什么页面去
                                }, 1500)
                            }
                        })
                    } else {
                        uni.showToast({ title: res.msg, icon: 'none', duration: 2000 })
                    }
                })
            })
        },
        goback() {
            if (!this.$utils.pages.getPageRoute(1)) {
                uni.switchTab({ url: '/pages/index/index' })
            } else {
                uni.navigateBack({ delta: 1 }) // 第三方登录页面中转页面：thirdLoginResult是redirectTo跳的，所以是delta:1
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.right-top-sign {
    // 这里面不能用rpx
    position: absolute;
    top: 40px;
    right: -15px;
    z-index: 95;
    box-sizing: border-box;
    &:before {
        display: block;
        content: '';
        width: 200px;
        height: 40px;
        background: #b4f3e2;
        border-radius: 0 50px 0 0;
        transform: rotate(50deg);
    }
    &:after {
        display: block;
        content: '';
        width: 200px;
        height: 40px;
        background: #b4f3e2;
        border-radius: 50px 0 0 0;
        transform: rotate(-50deg);
        position: absolute;
        right: -99px;
        top: 0;
    }
}
.left-bottom-sign {
    position: absolute;
    left: -270rpx;
    bottom: -320rpx;
    border: 100rpx solid #d0d1fd;
    border-radius: 50%;
    padding: 180rpx;
}
</style>
