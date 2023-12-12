import uniAxios from 'uni-axios'
import config from '@/config/config.js'
import { debounce,throttle } from '@/utils/utils.js'// 备注：这里不能用uni.$utils.debounce，因为它是先于main.js挂载uni.$utils的
import { appToken, passport } from '@/utils/Cache.js'
import oauthService from '@/service/oauth.js'


// 导出变量axios,最自由的封装
export const axios = uniAxios.create({
    baseURL: config.server, // url = base url + request url
    timeout: 10000, // request timeout
	withCredentials:true
})


// 请求拦截器
axios.interceptors.request.use(
    (options) => {
		const authHeaders = appToken.generateAuthHeaders()
		options.headers = Object.assign(authHeaders,options.headers)
		if (options.url) {
			// 后端需要有个服务名称
		    options.headers['serviceName'] = options.url.split('/')[1]
		}
		options.url = config.server + options.url
        return options
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
axios.interceptors.response.use(
    (response) => {
        if (response.status === 200 || response.status === 201) {
            return Promise.resolve(response)
        } else {
            uni.showToast({
                title: '网络请求异常, 请检查您的网络设置后刷新重试!',
                duration: 1500,
                mask: true,
                icon: 'none'
            })
            return Promise.reject(response)
        }
    },
    // 服务器状态码不是200的情况
    (error) => {
        if (error && error.response && error.response.status) {
            switch (error.response.status) {
				// checkToken验证失败
				// case 400:
				// 	//checkToken验证失败后，会报400，这时什么都不干(因为在报400之前，已经报401，已经走了checkToken()方法了)，也不能toast信息出来
				// 	// _method.checkToken()
				//     break
				// 未登录
                case 401:
                    // _method.goLogin()
					// _method.checkToken()//因为checkToken接口错误时会报400，会跟其它状态混在一起，所以报401时，可以放弃不checkToken，直接用refreshToken(如果refreshToken不通过时，会直接跳登录页面)
					_method.refreshToken()
                    break
                case 403:
                    uni.showToast({ title: '您没有访问权限', duration: 1000, mask: true, icon: 'none' })
                    break
				case 426:
				    uni.showToast({ title: '用户名或密码错误！', duration: 1000, mask: true, icon: 'none' });
					break;
				case 428:
				    uni.showToast({ title: '验证码错误', duration: 1000, mask: true, icon: 'none' });
					break;
				// refreshToken过期(失败)后，这时什么都不干()，不然下面default里会toast错误信息出来
				case 429:
					break;
				// 如果没有该接口,就不要弹错误信息出来
				case 404:
					break;
                default:
                    uni.showToast({
                        title:(error?.response?.data?.msg) || '网络请求异常, 请检查您的网络设置后刷新重试!',
                        icon: 'none',
                        duration: 1500,
                        icon: 'none'
                    })
                    break
            }
        } else {
            uni.showToast({
                title: (error?.response?.data?.msg) || '网络请求异常, 请检查您的网络设置后刷新重试!',
                icon: 'none',
                duration: 1500,
                icon: 'none'
            })
        }
        return Promise.reject(error)
    }
)

const request = {
    /**
     * get方法
     * @param url 请求url, 相对url
     * @param params 请求参数
     * @param opt 扩展配置
     */
    get(url, params, opt) {
		const requestParmams = {
		    url: url,
		    method: 'GET',	
		    params: params
		}
		return this.sendRequest(requestParmams, opt)
    },

    post(url, params, opt) {
		const requestParmams = {
		    url: url,
		    method: 'POST',
		    data:params
		}
		return this.sendRequest(requestParmams, opt)
    },

    put(url, params, opt) {
		const requestParmams = {
		    url: url,
		    method: 'PUT',
		    data: params
		}
		return this.sendRequest(requestParmams, opt)
    },
	
	postForm(url, params, opt) {
		const requestParmams = {
		    url: url,
		    method: 'POST',
		    data:params,
			headers:{ 'Content-Type':'application/x-www-form-urlencoded' }
		}
		return this.sendRequest(requestParmams, opt)
	},

    delete(url, params, opt) {
		const requestParmams = {
		    url: url,
		    method: 'DELETE',
		    data: params
		}
		return this.sendRequest(requestParmams, opt)
    },

    // 自由度最高的请求方法
    request(method, url, params, data, opt) {
		const requestParmams = {
		    url: url,
		    method:method,
		    data: data,
		    params: params,
		}
        return this.sendRequest(requestParmams,opt)
    },

    /**
     * 通用的请求方法
     * @param params  请求参数
     * @param options 其他选项
     */
    sendRequest(params, options) {
        const defaultOptions = {
            isShowLoading: false, // 是否显示loadding,默认否
            isLoaddingMask: true, // 当isShowLoading==true时，是否显示遮罩层(这时候不能点击页面，防止重复点击或接口未请求完就点击按钮走下一步)
            isShowToast: true, // 是否显示当res.status != 1时的showToast，默认：显示
            loaddingMsg: '加载中...', // 默认loadding提示语
        }
		options = { ...defaultOptions, ...options }
        if (options.isShowLoading) {
            uni.showLoading({
                title: options.loaddingMsg,
                mask: options.isLoaddingMask
            })
        }
        return new Promise((resolve, reject) => {
            axios
                .request(params)
                .then((res) => {
                    if (res.data.code != 1 && options.isShowToast) {
                        uni.showToast({ title: (res.data && res.data.msg) || '', duration: 2000, icon: 'none' })
                    }
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                })
                .finally((res) => {
                    if (options.isShowLoading) {
                        uni.hideLoading()
                    }
                    // cancel = null
                })
        })
    }
}

// 私有的方法
const _method = {
    /**
     * 清除本地token和清空vuex中token对象
     * 去往登录页面
     */
    goLogin: throttle(function() {
		// 清除token
		appToken.clearToken()
		uni.hideToast()
		const existPages = getCurrentPages();
		const curPage = existPages[existPages.length - 1].route; // 当前页
		// 如果当前页已经是登录页了 则不需要弹出 登录窗口
		let isExclude = false;
		for (const exclude of uni.$excludeLoginURIs) {
		  if (curPage.indexOf(exclude) > -1) {
			isExclude = true;
			break;
		  }
		}
		if (!isExclude) {
		  appToken.goLogin();
		}
    }, 1000),
    /**
     * 验证请求头，
     * 去往登录页面
     */
	checkToken: throttle(function() {
	    if (appToken.getToken() && !uni.getStorageSync('dealCheckToken')) {
	        // 微服务版本才有checkToken接口,dealCheckToken是为了防止每个接口都请求一次checkToken
	        oauthService
	            .checkToken(appToken.getToken().accessToken)
	            .then((res) => {
	                if (res.success) {
	                    if (appToken.getToken().refreshToken) {
	                        // 如果Token已过期，并且缓存里有refreshToken,则重新刷新token登录。只有微服务才有refreshToken
	                        this.refreshToken()
	                    } else {
	                        this.refreshToken()
	                    }
	                } else {
	                    this.refreshToken()
	                    // uni.showToast({ title: res.msg,icon:'none',duration: 2000 });
	                }
	            })
	            .catch((e) => {
	                // '请求头验证不通过!';
					console.log('请求头验证不通过',e);
	                this.refreshToken()
	                // uni.showModal({ title: '温馨提示',content: '请求头验证不通过，可以尝试请空缓存，确定要清空缓存吗？',success: (res)=> {
	                //     if (res.confirm) {
	                //         uni.setStorageSync('dealCheckToken', true);
	                //         uni.clearStorageSync();
	                //         uni.navigateBack({ delta:0 })//注意，必需要先清缓存再跳回本页
	                //     } else if (res.cancel) {
	
	                //     }
	                // } });
	            })
	            .finally((res) => {
	                uni.setStorageSync('dealCheckToken', true)
	            })
	    } else {
	        this.goLogin()
	    }
	}, 1000),
    /**
     * 用refreshToken换新的登录密钥
     */
	refreshToken: throttle(function() {
	    if (appToken.getToken() && appToken.getToken().refreshToken) {
	        // 微服务版本才有checkToken接口,dealCheckToken是为了防止每个接口都请求一次checkToken
			oauthService.refreshToken().then(res => {
			    if (res.success) {
			        passport.clearPassportIdKey(); // 登录成功后不清除掉passportId的话，退出登录后，下次登录时，就会取上一个账号的passportId，这样就会导致passportId对不上而登录失败
					// uni.showToast({
					//     title: '登录成功',
					//     mask: true,
					//     complete:()=> {
					//         setTimeout(() => {
					//             uni.navigateBack({ delta: 0 })
					//         }, 1500)
					//     }
					// })
			    } else {
			        this.goLogin()
			    }
			}).catch((e) => {
				// '请求头验证不通过!';
				this.goLogin()
			}).finally((res) => {
				
			})
	    } else {
	        this.goLogin()
	    }
	}, 1000)
}

export default request

