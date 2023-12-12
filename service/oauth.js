import { appToken } from '@/utils/Cache.js'
import { userApi } from '@/api/ModulesUser.js'

// oath2.0认证
const oauth2ServiceImpl = {
    /**
     * 普通登录
     * @param {*} loginName 登录名
     * @param {*} password 密码
     * @param {*} type 登录类型 PASSWORD 密码登录 SMS验证码登录
     */
    login(param) {
        const result = {}
        const params = {
            grant_type: 'legendshop',
            scope: 'server',
            user_type: 'USER',
			user_key:uni.getStorageSync('utmz'),
            ...param
        }
        return new Promise((resolve, reject) => {
            userApi
                .login(params)
                .then((res) => {
                    if (res.code==201) {
                        result.success = true
                        result.msg = '用户认证失败!'
                        result.data = res
                        resolve(result)
                    } else {
                        appToken.setToken(res)
                        result.success = true
                        result.data = appToken.getToken()
                        resolve(result)
                    }
                })
                .catch((e) => {
					// console.log(JSON.stringify(e))
					// console.log(e.response)
                    result.success = false
                    result.msg = '网络异常!'
                    reject(result)
                })
        })
    },
	
	/**
	 * 用refreshToken换新的登录密钥(从上面的login(param)方法复制而来)
	 * @param {*} param 传入参数
	 */
	refreshToken(param) {
	    const result = {}
	    const params = {
	        grant_type: 'refresh_token',
	        refresh_token: appToken.getToken().refreshToken,
	        user_type: 'USER',
			client_id:_method.getPlatform().toLowerCase(),
			client_secret:_method.getPlatform().toLowerCase(),
	        ...param
	    }
	    return new Promise((resolve, reject) => {
			userApi
				.login(params)
				.then((res) => {
					// console.log(res)
					if (res.error) {
						result.success = true
						result.msg = '刷新token失败!'
						resolve(result)
					} else {
						// console.log('refreshToken:',res);

						appToken.setToken(res)
						result.success = true
						result.data = appToken.getToken()
						resolve(result)
					}
				})
				.catch((e) => {
					result.success = true
					result.msg = '网络异常!'
					reject(result)
				})
	    })
	},
	
    /**
     * 检查头肯是否有效请求
     * @param {*} token
     */
    checkToken(token) {
        const result = {}
        const params = {
            token: token
        }
        return new Promise((resolve, reject) => {
            userApi
                .checkToken(params)
                .then((res) => {
					// console.log('checkToken-res:',res);
                    if (res.error) {
                        result.data = res
                        result.success = false
                        result.msg = '检查请求头失败!'
                        resolve(result)
                    } else {
                        result.data = res
                        result.success = true
                        result.msg = '请求头验证通过!'
                        resolve(result)
                    }
                })
                .catch((e) => {
					// console.log('checkToken-catch-error:',e);
                    result.success = false
                    result.msg = '请求头验证不通过!'
                    reject(result)
                })
        })
    },

    /**
     * APP第三方登录
     * @param {*} provider 第三方登录的id，qq：QQ登录，weixin：微信登录，sinaweibo：新浪微博登录
     */
    oauthLogin(provider) {
        // 扩展API加载完毕，现在可以正常调用扩展API
        const result = {}
        let params = {}
        return new Promise((resolve, reject) => {
            plus.oauth.getServices(
                function(services) {
                    // console.log('services: ' + JSON.stringify(services))
                    let auth = ''
                    services.forEach((element) => {
                        if (element.id == provider) {
                            auth = element
                        }
                    })
                    auth.logout(
                        function(e) {},
                        function(e) {}
                    ) // 注销登录授权认证,这个可以删掉，但删掉后，要隔一段时间后才能让你选择另一个账号登录
                    auth.login(
                        function(res) {
                            console.log('authLogin:',res)
                            if (res.target) {
                                // console.log(provider);
                                // console.log(res.target.authResult.access_token);
                                // console.log(res.target.authResult.openid);
                                // console.log(_method.getPlatform());
								const authTypeStatus = {weixin:'WECHAT_APP',qq:'QQ_APP',sinaweibo:'WEIBO_APP'}//现在只能微信登录，QQ和微博是假的乱写的，到时再接
                                params = {
                                    type: provider,
                                    platform: _method.getPlatform(),
                                    credentials: res.target.authResult.access_token,
                                    principal: res.target.authResult.openid,
									grant_type:'legendshop',//认证方式。这个是新加的，这个作用是让后台走我们自定义的认证方式
									user_type: 'USER',
									auth_type: authTypeStatus[provider],
                                }
                                if (res.target.authResult) {
                                    if (res.target.authResult.refresh_token) {
                                        params.refreshToken = res.target.authResult.refresh_token
                                    }
                                }

                            }
                            // console.log('login-params:',params)
                            userApi.login(params).then((res) => {
                                    // console.log('login-res:',res)
									if (res.code==201) {
										result.passportIdKey = res.data
										result.platform = _method.getPlatform()
										result.success = true
										result.msg = '认证通过，需要绑定账号！'
										result.code = res.code
										resolve(result)
									}else{
										appToken.setToken(res)
										result.success = true
										result.data = appToken.getToken()
										result.msg = '登录成功！'
										resolve(result)
									}
                                })
                                .catch((e) => {
                                    console.error('第三方', e)
                                    result.success = false
                                    result.msg = '网络请求异常!'
                                    result.networkErr = true // 网络请求异常就跳至首页
                                    resolve(result)
                                })
                        },
                        function(error) {
                            // console.log(error)
                            result.success = false
                            result.msg = '登录失败:' + error.message.split('http')[0]
                            resolve(result)
                        }
                    )
                },
                function(error) {
                    result.success = false
                    // console.log(error)
                    result.msg = '获取授权失败:' + error.message.split('http')[0]
                    resolve(result)
                }
            )
        })
    },
    /**
     * 退出登录
     */
    logout() {
        const result = {}

        return new Promise((resolve, reject) => {
            userApi
                .logout()
                .then((res) => {
                    if (res.code == 1) {
                        appToken.clearToken()
                        result.success = true
                        resolve(result)
                    } else {
                        result.success = false
                        result.msg = res.msg
                        resolve(result)
                    }
                })
                .catch((error) => {
                    result.success = false
                    result.msg = '网络请求异常!'
                    reject(result)
                })
        })
    }
}

// 私有的方法
const _method = {
    // 获取登录平台来源
    getPlatform() {
        let platform = ''

        // #ifdef H5
        // platform = 'H5'
		platform = 'legendshop'
        // #endif

        // #ifdef MP-WEIXIN
        platform = 'MP'
        // #endif

        // #ifdef APP-PLUS
        if (uni.getSystemInfoSync().platform == 'ios') {
            platform = 'IOS'
        } else {
            platform = 'ANDROID'
        }
        // #endif
        return platform
    }
}

export default oauth2ServiceImpl
