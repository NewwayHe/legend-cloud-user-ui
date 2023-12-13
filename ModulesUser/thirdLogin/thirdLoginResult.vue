<template>
    <!-- 微信浏览器上(getUa().isWeixin==true)登录才用到这个页面，这个页面是后台控制跳过来的，在这个页面上获取到passportIdKey后，再跳到bindingPhone进行登录 -->
    <view class="w750"></view>
</template>

<script>
import { passport } from '@/utils/Cache.js'
import oauthService from '@/service/oauth.js'
export default {
    data() {
        return {
            passportIdKey: '',
            thirdloginHref: '', // 当是点击分享的链接(例如拼团)，在Cache.js里将链接放到缓存里后，用该变量来接收该链接地址(登录成功后跳到该链接)，该变量只用于微信端的H5
            code: '',
            state: ''
        }
    },
    computed: { },
    onLoad(option) {
        if (uni.getStorageSync('thirdloginHref')) {
            this.thirdloginHref = uni.getStorageSync('thirdloginHref')
            uni.removeStorageSync('thirdloginHref') // 获取完跳转前的页面后，马上从缓存里删除
        }
        this.code = option.code || null
        this.state = option.state || null
        this.login()
    },
    mounted() {
    },
    methods: {
		toNavigate(){
			if (this.thirdloginHref) {
			    let isExclude = false
			    const excludePage = uni.$excludeLoginURIs // 如果是登录后的从什么页面过来的就跳回什么页面去，则config.excludeLoginURIs这些页面是直接跳首页而不是返回
			    for (var i = 0; i < excludePage.length; i++) {
			        if (this.thirdloginHref.indexOf(excludePage[i]) != -1) {
			            isExclude = true
			        }
			    }
			    if (isExclude) {
			        // 跳转首页
			        this.$switchTab(`/pages/index/index`)
			    } else {
			        window.location.href = this.thirdloginHref
			    }
			} else {
			    this.$switchTab(`/pages/index/index`)
			}
		},
        login() {
            oauthService.login({ principal: 'WECHAT_MP', credentials: this.code, extended: this.state, auth_type: 'WECHAT_MP' }).then((res) => {
				if (res.success) {
                    passport.clearPassportIdKey() // 登录成功后不清除掉passportId的话，退出登录后，下次登录时，就会取上一个账号的passportId，这样就会导致passportId对不上而登录失败
					uni.hideLoading()
					if (res.data.code == 201) {
					    uni.setStorageSync('thirdloginHref', this.thirdloginHref) // 如果要跳到bindingPhone页面，又再把thirdloginHref放回到缓存里
					    passport.setPassportIdKey(res.data.data)
					    uni.redirectTo({ url: '/ModulesUser/bindingPhone/bindingPhone' })
					} else {
					    // 如果验证没通过，跳转至首页
						uni.showToast({
						    title: '登录成功',
						    mask: true,
						    complete:() => {
						       this.toNavigate()
						    }
						})
					}
                } else {
                     uni.redirectTo({ url: '/ModulesUser/login/login' })
                }
            })
        }
    }
}
</script>

<style scoped></style>
