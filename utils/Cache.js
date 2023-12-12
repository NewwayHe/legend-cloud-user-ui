/**
 * 一些缓存相关的操作方法
 */
import { pages, getUa, loginModal,throttle } from '@/utils/utils.js'
import config from '@/config/config.js'
import oauthService from '@/service/oauth.js'
import axios from 'uni-axios'

const TOKEN_KEY = 'APP_TOKEN'
const OPENID = 'OPENID'
const CONFIG_KEY = 'CONFIG_URL'
const PASSPORT_ID_KEY = 'passportIdKey'
import md5 from 'js-md5'

const SEARCH_KEY = 'searchHistory'
const maxLength = 20

// 地址搜索管理，这个只有ModuleCommon/address/changeAddr页面用到
const locationHistory = {
    History: 'History',
    location: 'location',

    // 历史搜索
    getLocationHistory(keyname) {
        // console.log(keyname)
        let words = ''
        if (uni.getStorageSync(keyname)) {
            // console.log(uni.getStorageSync(keyname))
            words = JSON.parse(uni.getStorageSync(keyname))
        }
        if (!words) {
            return []
        }
        for (let i = 0; i < words.length; i++) {
            if (words[i] == '' || typeof words[i] === 'undefined' || words[i] == '') {
                words.splice(i, 1)
                i = i - 1
            }
        }
        return words
    },
    // 添加历史搜索
    addLocationHistory(keyname, keyword) {
        // console.log(keyname)
        let words = this.getLocationHistory(keyname)
        // console.log(words)
        if (Object.prototype.toString.call(words) == '[object String]' || Object.prototype.toString.call(words) == '[object Object]') {
            words = [] // 如果words不是数组，则先清空
        }
        const has = words.includes(keyword)

        if (!has) {
            // 数组末尾 删除 ， keyword 数组第一位
            const length = words.length
            if (length >= maxLength) {
                words.pop()
            }
            if (Object.prototype.toString.call(words) == '[object String]') {
                // 如果words不是数组，则先清空
                words = []
            }
            words.unshift(keyword)
            // console.log(words)
            uni.setStorageSync(keyname, JSON.stringify(words))
        }
    },

    // 清除历史搜索缓存
    clearLocationHistory(keyname) {
        uni.removeStorageSync(keyname)
    }
}

// searchList页面上的搜索历史
const searchHistory = {
    getSearchHistory() {
        let words = []
        words = uni.getStorageSync(SEARCH_KEY)
        // console.log(words)
        if (!words && !words.length) {
            return []
        }
        for (let i = 0; i < words.length; i++) {
			if (words[i] == '' || typeof words[i] == 'undefined' || words[i] == ' ') {
				words.splice(i, 1);
				i = i - 1;
			}
        }
        return words
    },

    // 添加历史搜索
    addSearchHistory(keyword) {
        let words = this.getSearchHistory()
        if (Object.prototype.toString.call(words) == '[object String]' || Object.prototype.toString.call(words) == '[object Object]') {
            words = [] // 如果words不是数组，则先清空
        }
        const has = words.includes(keyword)

        if (!has) {
            // 数组末尾 删除 ， keyword 数组第一位
            const length = words.length
            if (length >= maxLength) {
                words.pop()
            }
            if (Object.prototype.toString.call(words) == '[object String]') {
                // 如果words不是数组，则先清空
                words = []
            }
            words.unshift(keyword)
            // console.log(words)
            uni.setStorageSync(SEARCH_KEY, words)
            // localStorage.setItem(KEY,JSON.stringify(words))
        }
    },

    // 清除历史搜索缓存
    clearSearchHistory() {
        uni.removeStorageSync(SEARCH_KEY)
    }
}

const appToken = {
    /**
    	设置token
    */
    setToken(result) {
        let token = {}
	    token = {
		   accessToken: result.access_token,
		   refreshToken: result.refresh_token,
		   tokenType: result.token_type,
		   expiresIn: result.expirs_in,
		   scope: result.scope,
		   userId: result.user_id,
		   userName: result.user_name
	   }
	   uni.setStorageSync(TOKEN_KEY, JSON.stringify(token))
	   // 注意：下面这些请求接口的，要setToken后再执行，不然ios端在未setToken时直接getToken会拿不到token值而报401
	   setTimeout(() => {
		   uni.$store.dispatch('getCartNum')// 登录成功后，重新获取购物车角标
		   uni.$store.dispatch('getUserInfo') // 登录成功后，刷新个人设置初始化数据
		   uni.$store.dispatch('getMyInfo'); // 登录成功后，刷新获取移动端用户中心
	   },500)
    },

    // 获取token
    getToken() {
        const tokenStr = uni.getStorageSync(TOKEN_KEY)
        if (!tokenStr) {
            return ''
        }
        const token = JSON.parse(tokenStr)
        return token
    },

    setOpenId(openid) {
        uni.setStorageSync(OPENID, JSON.stringify(openid))
    },
    getOpenID() {
        const openidStr = uni.getStorageSync(OPENID)
        if (!openidStr) {
            return null
        }

        const openid = JSON.parse(openidStr)
        return openid
    },

    // 清除token
    clearToken() {
        uni.removeStorageSync(PASSPORT_ID_KEY) // 清除缓存里登录时才储存的passportIdKey(这个只有微信浏览器登录时才用到)
        uni.removeStorageSync(TOKEN_KEY)
        uni.removeStorageSync('thirdloginHref') // 清除缓存储存的登录页面前一个页面地址(这个只有微信浏览器登录时才用到)
        uni.$store.commit('setUserInfo', {}) // 清空VUX里的用户信息
        uni.$store.commit('setMyInfo', {}) // 清空VUX里的用户信息
        uni.$store.commit('setCartNum', '') // 清空VUX里的购物车数量
    },
    // 是否登录
    isLogin() {
        const token = appToken.getToken()
        if (!token) {
            return false
        }
        return true
    },
    // 封装的登录方法
	goLogin:throttle(function(){
		// 为了防止小程序端同时弹出多个showModal框
		loginModal.showModal({
			title: '登录后才能正常使用噢~',
			content: '请点击"确定"进行登录！',
			success: (res) => {
				if (res.confirm) {
					this.toLogin()
				} else if (res.cancel) {
					// 当当前页面的路由出现以下字符时,点击"取消"不作任何反应,而不是返回前一页
					// 所有详情页面(商品详情，活动详情，文章详情)和个人中心，点击'取消'不作任何反应
				   const stopBackArr = ['Det', 'my/my','index']
				   let allowBack = true
				   for (var i = 0; i < stopBackArr.length; i++) {
					   if (pages.getPageRoute().route.indexOf(stopBackArr[i]) != -1) {
						   allowBack = false
					   }
				   }
				   if (allowBack) {
					   pages.goBeforePage(1)
				   }
				}
			}
		})
	},2000),
    toLogin() {
		// #ifdef APP-PLUS
		uni.navigateTo({ url: '/ModulesUser/login/login' })
		// #endif
        // #ifdef MP-WEIXIN
		uni.navigateTo({ url: '/ModulesUser/authorization/authorization' })
        // #endif
		// #ifdef H5
		if (getUa().isWeixin) {
			const thirdloginHref = window.location.href
			uni.setStorageSync('thirdloginHref', thirdloginHref) // 将当前页面放到缓存里，由于微信H5端的第三方登录要经过微信刷新页面，用不了pages.goBeforePage(2)方法返回到当前页面，只能放到缓存里，在thirdLoginResult页面里再取出来用(刻要删掉)
			// 如果是微信浏览器进H5,则调用微信第三方登录(请求这个接口后，后台将会回调到这个页面：ModulesUser/thirdLogin/thirdLoginResult)
			window.location.href = config.server + '/oauth2/auth/WECHAT_MP'
		} else {
			uni.navigateTo({ url: '/ModulesUser/login/login' })
		}
		// #endif
    },
    // 是否需要授权认证
    isNeedAuth(url) {
        if (url.indexOf('/s/') === -1) {
            return false
        }
        return true
    },

    // 生成认证头
    generateAuthHeaders() {
        let headers = {}
        const token = appToken.getToken()
        if (token) {
            headers = { Authorization: 'Bearer ' + token.accessToken }
        } else {
			// #ifdef MP
			headers['Authorization'] = 'Basic bGVnZW5kc2hvcDpsZWdlbmRzaG9w'
			// #endif
			// #ifdef APP-PLUS
			headers['Authorization'] = 'Basic bGVnZW5kc2hvcDpsZWdlbmRzaG9w'
			// #endif
			// #ifdef H5
			headers['Authorization'] = 'Basic bGVnZW5kc2hvcDpsZWdlbmRzaG9w'
			// #endif
        }
        headers.source = this.getSource()
		// 这个要写在外面,因为没登录时,请求登录接口时,也要把user_key传到登录接口里
        headers['user_key'] = cookieId.getCookieId()
        return headers
    },
    /**
     * 获取平台来源
     */
    getSource() {
        let value = ''
        // #ifdef APP-PLUS
        value = 'APP'
        // #endif
        // #ifdef MP-WEIXIN
        value = 'MINI'
        // #endif
        // #ifdef H5
        // 是否则为微信公众号
        if (getUa().isWeixin) {
            value = 'MP'
        } else {
            value = 'H5'
        }
        // #endif
        return value
    }
}

/**
 * 通行证 storage 管理
 */
const passport = {
    /**
     * 获取 第三方登录成功后 生成的通行证密钥
     */
    getPassportIdKey() {
        return uni.getStorageSync(PASSPORT_ID_KEY)
    },

    /**
     * 设置 第三方登录成功后 生成的通行证密钥, 设置到sessionStorage
     * @param {*} passportIdKey
     */
    setPassportIdKey(passportIdKey) {
        uni.setStorageSync(PASSPORT_ID_KEY, passportIdKey)
    },

    /**
     * 清空第三方登录成功后 生成的通行证密钥
     */
    clearPassportIdKey() {
        uni.removeStorageSync(PASSPORT_ID_KEY)
    }
}


/**
 * 通行证 storage 管理
 */
const cookieId = {
	setCookieId(key = 'utmz', seconds){
		var timestamp = Date.parse(new Date()) / 1000
		let value = this.createUniqueId()
		// 获取缓存
		var val = uni.getStorageSync(key);
		if (val) {
			// var tmp = val.split("|")
			// //删除缓存
			// if (!tmp[1] || timestamp >= tmp[1]) {
			// 	console.log("key已失效")
			// 	uni.removeStorageSync(key)
			// 	setId()
			// }
		} else {
			setId()
		}
		
		function setId() {
			// 设置缓存
			if (!seconds) {
				var expire = timestamp + (3600 * 24 * 1)
				// var expire = timestamp + (10)
			} else {
				var expire = timestamp + seconds
			}
			value = value + '|' + expire
			uni.setStorageSync(key, value);
		}
	},
	getCookieId(key = 'utmz'){
		var val = uni.getStorageSync(key);
		return val || null
	},
	
	// 生成10-12位不等的字符串
	createUniqueId() {
		return Number(Math.random().toString().substr(2)).toString(36); // 转换成十六进制
	}
}


export { appToken, locationHistory, searchHistory, passport , cookieId }
