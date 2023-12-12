<template>
    <!-- /*
     * @Descripttion:服务协议和隐私政策
    */ -->
    <!-- 服务协议和隐私政策(应用宝APP上架必需) -->
    <view class="mask-wrapper-s" v-if="appAgree && platform != 'ios'">
        <view class="center-xy flex-col-center bg-white rounded-22" style="width: 80%">
            <view class="font-lg pt-3">服务协议和隐私政策</view>
            <view class="font-32 py-2 px-4">
                <view>
                    请你务必审慎阅读、充分理解“服务协议”和“隐私政策”各条款，包括但不限于：为你更好的向你提供服务，我们需要收集你的设备标识、操作日志等信息用于分析、优化应用性能。
                </view>
                <view>
                    你可阅读
                    <text class="text-primary" @click="$navigateTo(`/ModulesUser/register/agreement?code=PRIVACY_POLICY`)">《用户服务协议和隐私政策》</text>
                    了解详细信息。如果你同意，请点击下面按钮开始接受我们的服务。
                </view>
            </view>
            <view class="flex-center w-100 py-2 shadow">
                <view class="flex-1 flex-center border-right border-e4" @click="agreeApp(false)"><text>暂不使用</text></view>
                <view class="flex-1 flex-center text-main" @click="agreeApp(true)"><text>同意</text></view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    components: {},
    filters: {},
    props: { },
    data() {
        return {
            platform: uni.getSystemInfoSync().platform, // 如果IOS的APP端不显示《服务协议和隐私政策》
            appAgree: false, // 控制服务协议和隐私政策框
        }
    },
    computed: { },
    watch: { 
        
    },
    created() {
        
    },
    mounted() {
        if (!uni.getStorageSync('appAgree')) {
            this.platform = uni.getSystemInfoSync().platform
            this.appAgree = true
        }
    },
    destroyed() {},
    methods: {
        appAgreeFalse(){
            this.appAgree = false
        },
        agreeApp(flag) {
            this.appAgree = false
            if (!flag) {
                uni.showModal({
                    content: `十分抱歉，若您不同意《服务协议和隐私政策》我们将无法为你提供服务`,
                    cancelText: '关闭应用',
                    confirmText: '我再想想',
                    success: (res)=> {
                        if (res.confirm) {
                            this.appAgree = true
                        } else if (res.cancel) {
                            plus.runtime.quit() // 退出应用，只有安卓有效，苹果只能用home键退出
                        }
                    }
                })
            }
            if (flag) {
                uni.setStorageSync('appAgree', true)
                this.$emit('agree',this.appAgree)
            }
        }
    }
}
</script>

<style lang="scss" scoped></style>
