<template>
    <view class="w750"></view>
</template>

<script>
import { appToken, passport } from '@/utils/Cache.js'
export default {
    data() {
        return {}
    },
    computed: { },
    mounted() {
        this.login(null, null)
    },
    methods: {
        // 暂时没用这里的逻辑
        onGetUserInfo(event) {
            const userInfo = event.target.userInfo
            const encryptedData = event.target.encryptedData
            const iv = event.target.iv

            console.log('用户信息: %o', userInfo)
            console.log('加密的用户数据: %o', encryptedData)
            console.log('解密向量: %o', iv)

            if (!encryptedData) {
                // 说明拒绝了授权
                uni.showModal({
                    title: '登录提示',
                    content: '您拒绝了授权，我们将拿不到您的头像、昵称等信息，确认继续？',
                    success: (res)=> {
                        if (res.confirm) {
                            this.login(null, null)
                        } else if (res.cancel) {
                        }
                    }
                })
            } else {
                this.login(encryptedData, iv)
            }
        },

        login(encryptedData, iv) {
            uni.showLoading({
                mask: true,
                title: '正在登录...',
                success: (res) => {
                    setTimeout(() => {
                        uni.hideLoading() // 防止特殊情况下页面上一直显示loading
                    }, 5000)
                }
            })

            uni.login({
                success:(res)=> {
                    console.log('wx.login成功结果: %o', res)
                    uni.showLoading({ mask: true, title: '正在登录...' }) // 不加这个的话，在调用成功后，会有很长时间的显示空白页面

                    if (res.code) {
                        const params = {
                            code: res.code,
                            encryptedData: encryptedData,
                            iv: iv,
                            platform: 'MP'
                        }
                    } else {
                        console.log('自动登录失败！' + res.errMsg)
                        this.$switchTab(`/pages/index/index`)
                        uni.showToast({ title: '自动登录失败, 请联系客服!', icon: 'none', duration: 2000 })
                    }
                },

                fail:(error)=> {
                    console.log('wx.login失败: %o', error)
                    this.$switchTab(`/pages/index/index`)
                    uni.showToast({ title: '自动登录失败, 请联系客服!', icon: 'none', duration: 2000 })
                }
            })
        }
    }
}
</script>

<style scoped></style>
