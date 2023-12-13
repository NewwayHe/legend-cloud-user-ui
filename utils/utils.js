import stringUtils from '@/utils/stringUtils.js'
import queryParams from '../components/uview-ui/libs/function/queryParams.js'
// #ifdef MP
const prefix = () => {
	// #ifdef MP-TOUTIAO
	return tt
	// #endif
	// #ifdef MP-WEIXIN
	return wx
	// #endif
	// #ifdef MP-BAIDU
	return swan
	// #endif
	// #ifdef MP-ALIPAY
	return my
	// #endif
	// #ifdef MP-QQ
	return qq
	// #endif
	// #ifdef MP-360
	return qh
	// #endif
}
// #endif

/**
 * 获取用户浏览器UA
 */
const getUa = function() {
	const _cache = {}
	if (_cache.ua) {
		return _cache.ua
	}

	let isMobile = false
	let isApple = false
	let isAndroid = false
	let isUc = false
	let isWeixin = false
	let isQQ = false
	let isQQBrowser = false
	let isWeibo = false

	let isH5 = false
	let isAPP = false
	let isMP = false

	// #ifdef H5
	// APP端可用，plus.navigator.getUserAgent
	var ua = window.navigator.userAgent.toLocaleLowerCase()
	// console.log(ua);
	isMobile = !!ua.match(/AppleWebKit.*Mobile.*/i)
	isApple = !!ua.match(/(ipad|iphone|ipod|mac)/i)
	isAndroid = !!ua.match(/android/i)
	isUc = !!ua.match(/ucbrowser/i)
	isWeixin = !!ua.match(/micromessenger/i) // 微信内置浏览器
	isQQ = !!ua.match(/pa qq/i) // QQ内置浏览器
	isQQBrowser = !!ua.match(/MQQBrowser/i) // QQ浏览器
	isWeibo = !!ua.match(/weiBo/i)
	isH5 = true
	// #endif
	// #ifdef APP-PLUS
	isAPP = true
	// #endif
	// #ifdef MP
	isMP = true
	// #endif

	_cache.ua = {
		isMobile: isMobile,
		isApple: isApple,
		isAndroid: isAndroid,
		isUc: isUc,
		isWeixin: isWeixin,
		isQQ: isQQ,
		isWeibo: isWeibo,
		isQQBrowser: isQQBrowser,
		isH5: isH5,
		isAPP: isAPP,
		isMP: isMP,
	}

	return _cache.ua
}

/* 防抖
 *@param fn {Function}   实际要执行的函数
 * @param delay {Number}  延迟时间，也就是阈值，单位是毫秒（ms）
 * @return {Function}     返回一个“去弹跳”了的函数
 * VUE里的用法：import { debounce } from '@/utils/utils.js';
	//备注，不能用箭头函数()=>，不然里面的this不对
	sure:debounce(function(){
		console.log('这个是方法');
	}),
 * JS里的用法(面里拿不到this)：
	sure:debounce(()=>{
		console.log('这个是方法');
	}),
 */
function debounce(fn, delay = 500) {
	let timer = null // 声明计时器
	return function() {
		const context = this
		const args = arguments
		clearTimeout(timer)
		timer = setTimeout(function() {
			fn.apply(context, args)
		}, delay)
	}
}


/* 节流
 *@param fn {Function}   实际要执行的函数
 * @param delay {Number}  延迟时间，也就是阈值，单位是毫秒（ms）
 * @return {Function}     返回一个“去弹跳”了的函数
 * 用法：import { throttle } from '@/utils/utils.js';
 *       sure:throttle(function(){}),//备注，不能用箭头函数()=>，不然里面的this不对
 */
// 这个方法在手机端会出现点击触发第一次后,再次点击时会失效的bug
// function throttle(fn, delay = 500) {
// 	let last = 0;
// 	return function() {
// 		let curr = +new Date();
// 		if (curr - last > delay) {
// 			fn.apply(this, arguments);
// 			last = curr;
// 		}
// 	}
// }
function throttle(fn, delay = 500) {
	let flag = true;
	return function() {
		if (!flag) return;
		flag = false;
		fn.apply(this, arguments);
		setTimeout(() => {
			flag = true;
		}, delay);
	}
}

/* 查询节点信息(目前此方法在支付宝小程序中无法获取组件跟接点的尺寸，为支付宝的bug(2020-07-21)，解决办法为在组件根部再套一个没有任何作用的view元素)
 * @param flag {Object} 这个就是页面上的this
 * @param selector {String} 页面元素的class名字或id名字，如：.rect-item,#id
 * @param all {Boolean} selector元素是否为一个数组(即是有多个相同class名字或id名字)元素
 * @return {Function}  返回元素的节点信息
 * 用法：注意：需要用async异步方法来接收
 *      async init() {
            let itemRect = await this.$utils.getRect(this,'.rect-item');//如果rect-item为数组，则这样写await getRect(this,'.rect-item',true)
        }
 */
function getRect(flag, selector, all) {
	return new Promise((resolve) => {
		uni.createSelectorQuery()
			.in(flag)[all ? 'selectAll' : 'select'](selector)
			.boundingClientRect((rect) => {
				if (all && Array.isArray(rect) && rect.length) {
					resolve(rect)
				}
				if (!all && rect) {
					resolve(rect)
				}
			})
			.exec()
	})
}

/* 判断子元素是否超出父级元素
 * @param flag {Object} 这个就是页面上的this
 * @param box {String} 父级元素的class名字或id名字，如：.goods,#id
 * @param item {String} 子级元素的class名字或id名字，如：.goods-item,#id-1
 * @return {Function}  返回Boolean，true：元素的左边框超出容器框，false：元素的左边框在容器框内
 * 用法：init() {
            this.$utils.getRectSurpass(this,'#scroll-box', `#tab-item-${this.secKillTime.length - 1}`).then(res=>{
            	this.scroll = res
            })
        }
 */
function getRectSurpass(flag, box, item) {
	return new Promise((resolve) => {
		// 获取父级组件的尺寸信息
		this.getRect(flag, box).then(res => {
			const boxRect = res
			// 获取子级元素组件的尺寸信息
			this.getRect(flag, item).then(itemRes => {
				const lastItemRect = itemRes
				if (boxRect && lastItemRect && lastItemRect.right > boxRect.right) {
					// 如果最后一个元素的左边框超出容器框，则采用滚动模式
					resolve(true)
				} else {
					// 如果最后一个元素的左边框在容器框内，则关闭滚动，采用flex模式(元素居中)
					resolve(false)
				}
				// end 判断是否开启scroll
			})
		})
	})
}

// 缓存处理
const storage = {
	// 存储
	set(key, value) {
		uni.setStorageSync(key, value)
	},
	// 取数据
	get(key) {
		return uni.getStorageSync(key)
	},
	//
	remove(key) {
		uni.removeStorageSync(key)
	}
}

/**
 * 处理时间戳的工具
 */
const time = {
	/**
	 * 传送一个以前或将来的时间戳，计算现在距离这个时间多久，小于小时的返回:X分钟前(后)，大小于1天的返回：X小时前(后).......
	 */
	timeAgo(time) {
		var nowTime = new Date().getTime()
		var f = nowTime - time
		var bs = f >= 0 ? '前' : '后' // 判断时间点是在当前时间的 之前 还是 之后
		f = Math.abs(f)
		if (f < 6e4) {
			return '刚刚'
		} // 小于60秒,刚刚
		if (f < 36e5) {
			return parseInt(f / 6e4) + '分钟' + bs
		} // 小于1小时,按分钟
		if (f < 864e5) {
			return parseInt(f / 36e5) + '小时' + bs
		} // 小于1天按小时
		if (f < 2592e6) {
			return parseInt(f / 864e5) + '天' + bs
		} // 小于1个月(30天),按天数
		if (f < 31536e6) {
			return parseInt(f / 2592e6) + '个月' + bs
		} // 小于1年(365天),按月数
		return parseInt(f / 31536e6) + '年' + bs // 大于365天,按年算
	},
	/**
	 * 传送一个时间戳，返回num天后这个时间段的时间戳
	 * now:时间戳(不存值就默认为当前时间的时间戳)
	 * num：在now的时间戳的基础上，加num天
	 * 例如：2021-05-13 21:02:56 (该时间的时间戳为：1620910976000)，要返回2天后 2021-05-15 21:02:56的时间戳，
	 * 		addDays(1620910976000,2) = 1621083776000  (2021-05-15 21:02:56)
	 */
	addDays(now = new Date().getTime(), num) {
		return now + num * 60 * 60 * 24 * 1000
	},
	/**
	 * 用JS将毫秒转化成天时分秒的时间格式
	 * mss：毫秒
	 * 例如：formatDuring(1) = 01秒，formatDuring(61) = 1分1秒，
	 */
	formatDuring(mss) {
		var days = parseInt(mss / (1000 * 60 * 60 * 24));
		var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = (mss % (1000 * 60)) / 1000;
		return (days ? (days + ' 天 ') : '') + (hours ? (hours + ' 小时 ') : '') + (minutes ? (minutes + ' 分钟 ') : '') + seconds + ' 秒 ';
	}
}

/**
 * 处理颜色的工具
 */
const color = {
	/**
	 * 十六进制颜色值转rgb值
	 * 例如：colorRgb(#ee9922) = {r:238,g:153,b:34}
	 */
	colorRgb(sColor) {
		if (sColor) {
			sColor = sColor.toLowerCase()
		}
		// 十六进制颜色值的正则表达式
		var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
		// 如果是16进制颜色
		if (sColor && reg.test(sColor)) {
			if (sColor.length === 4) {
				var sColorNew = '#'
				for (var i = 1; i < 4; i += 1) {
					sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
				}
				sColor = sColorNew
			}
			// 处理六位的颜色值
			var sColorChange = []
			for (var i = 1; i < sColor.length; i += 2) {
				sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
			}

			return {
				r: sColorChange[0],
				g: sColorChange[1],
				b: sColorChange[2]
			}
		}
		return {}
	},

	/**
	 * 将rgb或rgba表示方式转换为hex表示方式
	 * 例如： rgbToHex('rgb(255,255,0)') = '#FFFF00'，rgbToHex('rgba(255,255,0,0.5)') = '#FFFF007F'(PC调试可以见到颜色，但手机真机不显示颜色)
	 */
	rgbToHex(value) {
		if (/rgba?/.test(value)) {
			var array = value.split(',');
			// 不符合rgb或rgb规则直接return
			if (array.length < 3) { return ''; }
			value = '#';
			for (var i = 0, color; color = array[i++];) {
				if (i < 4) {
					// 前三位转换成16进制
					color = parseInt(color.replace(/[^\d]/gi, ''), 10).toString(16);
					value += color.length == 1 ? '0' + color : color;
				} else {
					// rgba的透明度转换成16进制
					color = color.replace(')', '')
					var colorA = parseInt(color * 255);
					var colorAHex = colorA.toString(16);
					value += colorAHex;
				}
			}
			value = value.toUpperCase();
		}
		return value;
	},

	// 转化颜色(rgba转16进制，主要目的是把透明度去掉)
	// 例子： 值为：rgba(166, 115, 115, 0.3) ，转化16进制为： #e4d5d5 (把透明度去掉，在背景色为白色的情况下看上去是一样的)
	// 	this.$utils.color.getHexColor(rgba(166, 115, 115, 0.3)) = '#e4d5d5'
	getHexColor(color) { // 传的color须为字符串
		if (/rgb?/.test(color)) {
			var values = String(color)
				.replace(/rgba?\(/, '') // 把 "rgba(" 去掉，变成  "194, 7, 15, 1)"
				.replace(/\)/, '') // 把 ")" 去掉，变成 "194, 7, 15, 1"
				.replace(/[\s+]/g, '') // 把空格去掉，变成 "194,7,15,1"
				.split(',') // 变成数组 [194,7,15,1]
			var a = parseFloat(values[3] || 1); // values[3]是rgba中的a值，没有的话设置a为1，a可能为小数，所以用parseFloat函数
				var r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255); // 转换为16进制
				var g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255);
				var b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255)
			color = '#' +
				('0' + r.toString(16)).slice(-2) + // 转换后的16进制可能为一位，比如 7 就转换为 7 ， 15 转换为 f
				('0' + g.toString(16)).slice(-2) + // 当为一位的时候就在前面加个 0，
				('0' + b.toString(16)).slice(-2) // 若是为两位，加 0 后就变成了三位，所以要用 slice(-2) 截取后两位
		}
		return color
	},
}

const pages = {
	/* 从什么页面过来的就跳回什么页面去:
	    num: Number,跳转到前num个页面,默认值为0,传1就是跳转到前一个页面,传2就是跳转到前2个页面,0是当前页面。当没有前一个页面时,则默认跳到首页
	    excludePage:Array,排除某个页面(当检测到该页面包含该符时的页面时,直接跳到首页),如：pages.goBeforePage(1,['/login','thirdLoginResult']),
	    备注：如果传的excludePage数组第一个元素是传['login']，则会触发条件，排除uni.$excludeLoginURIs这些页面，如：pages.goBeforePage(1,['login'])
	*/
	goBeforePage(num, excludePage = []) {
		const pages = getCurrentPages() // 当前页面
		const pagesNumber = num ? Number(num) : 0
		const beforePage = pages[pages.length - pagesNumber - 1] // 前num个页面
		let isExclude = false
		if (excludePage[0] == 'login') {
			// 如果是登录后的从什么页面过来的就跳回什么页面去，则uni.$excludeLoginURIs这些页面是直接跳首页而不是返回
			excludePage = uni.$excludeLoginURIs
		}
		for (var i = 0; i < excludePage.length; i++) {
			if (beforePage && beforePage.route.indexOf(excludePage[i]) != -1) {
				// 如果不先判断beforePage，会报没有route的bug
				isExclude = true
			}
		}

		if (!beforePage || (excludePage && isExclude)) {
			// 跳转首页
			uni.switchTab({ url: '/pages/index/index' })
		} else {
			// 从什么页面过来的就跳回什么页面去
			if (pagesNumber == 1) {
				uni.navigateBack({
					success() {
						// 自动将返回刷新置false 免去页面手动调用
						setTimeout(() => {
							// #ifdef MP || APP
							beforePage.$vm.$store.dispatch('setBackRefresh', false)
							// #endif
							// #ifndef MP || APP
							beforePage.$store.dispatch('setBackRefresh', false)
							// #endif
						}, 2000)
					}
				})
			} else {
				uni.navigateBack({
					delta: pagesNumber,
					success() {
						// 自动将返回刷新置false
						setTimeout(() => {
							// #ifdef MP || APP
							beforePage.$vm.$store.dispatch('setBackRefresh', false)
							// #endif
							// #ifndef MP || APP
							beforePage.$store.dispatch('setBackRefresh', false)
							// #endif
						}, 2000)
					}
				})
				// 注意,如果返回带参数的页面,不能用该方法,因为该方法并不能带上参数的
				// uni.reLaunch({url: '/' + beforePage.route})
			}
			// 这里的this丢失了 所以用beforePage的原型链来触发Vue实例身上的方法
			// #ifdef MP || APP
			beforePage.$vm.$store.dispatch('setBackRefresh', true)
			// #endif
			// #ifndef MP || APP
			beforePage.$store.dispatch('setBackRefresh', true)
			// #endif
		}
	},
	/* 拿当前页面的路由地址
	 *   num: Number,拿前N个页面的路由地址,默认值为0,传1拿前一个页面的路由地址
	 *   返回结果：
	 *       {
	 *           route:'',   //路由，如：ModuleGoods/goodsDetail/goodsDetail
	 *           options:'', //路由，如：?id=4952
	 *           url:'', //路由 + 参数，如：ModuleGoods/goodsDetail/goodsDetail?id=4952
	 *       }
	 */
	getPageRoute(num) {
		const pagesNumber = num ? Number(num) : 0
		const pages = getCurrentPages() // 当前页面
		const beforePage = pages[pages.length - pagesNumber - 1] // 前num个页面,0是当前页面

		let resultOjb = {}
		if (beforePage) {
			resultOjb = {
				route: beforePage.route, // 路由
				options: beforePage.options, // 参数
				url: beforePage.route + queryParams(beforePage.options) // 路由 + 参数
			}
		}
		return beforePage ? resultOjb : false
	},

	/* ios微信打开网页键盘弹起后页面上滑，导致弹框里的按钮响应区域错位，只能用强制滚动来处理(如果以后微信升级后处理了这个问题，那就可以删除IosWxPageScrollTo这个方法)
	   <input type="text" @blur="$IosWxPageScrollTo()"  v-model="params.remark">
	*/
	IosWxPageScrollTo(num) {
		// #ifdef H5
		if (getUa().isWeixin && uni.getSystemInfoSync().platform == 'ios') {
			uni.pageScrollTo({ scrollTop: num || 0 })
		}
		// #endif
	},

	// url参数，转为对象 http://192.168.0.6:8082/?invitationCode=GK93J6 转为 {invitationCode: "GK93J6"}
	param2Obj(url) {
		const search = url.split('?')[1]
		if (!search) {
			return {}
		}
		return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"').replace(/\+/g, ' ') + '"}')
	}
}


/**
 * 处理图片的工具
 */
const image = {
	/** 图片转base64格式(现在只有小程序上有用)
	 *  @param  {img} :图片路径，必须是string，不然会报错
	 * 例子：image.base64Img('/static/images/defalut-img/default-img.png')，得出的是data:image/png;base64,*********的图片
	 */
	base64Img(img) {
		let suffix = ''
		// #ifdef MP
		// 由于小程序端不在海报里用本地图片(必须要先转base64),这里先转出图片为base64
		// let adfsdf = '/static/images/defalut-img/default-img.png'
		// 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="225"/>',
		// src: 'data:image/svg+xml;utf8,' + src.replace(/#/g, '%23'),
		// <image src="data:image/png;base64,iVBORw0KGgoARK5CYII=" mode="widthFix"></image>
		const imgData = uni.getFileSystemManager().readFileSync(img, 'base64')
		const base64 = '' + imgData
		suffix = stringUtils.getSuffix(img)
		let base64Img = ''
		if (suffix == 'svg') {
			base64Img = `data:image/${suffix}+xml;base64,${base64}`
		} else {
			base64Img = `data:image/${suffix};base64,${base64}`
		}
		return base64Img
		// #endif

		// #ifdef H5
		suffix = stringUtils.getSuffix(img)
		return img
		// #endif

		// #ifdef APP-PLUS
		// let canvas = document.getElementById('myCanvas');
		// let ImgBase64 = canvas.toDataURL('image/png');

		// let svg = document.getElementById(img);
		// let s = new XMLSerializer().serializeToString(svg);
		// let ImgBase64 = `data:image/svg+xml;base64,${window.btoa(s)}`;
		// #endif
	},

	/**
	 *  路径转base64
	 * @param {Object} input:传送进来的文本框里输入的字符串，如果没有输入内容，则返回：true
	 * 使用：
	 *  import { image } from '@/utils/utils.js';
	 *  image.pathToBase64(path).then(res => {
	        console.log(res)
	    }).catch(error => {
	        console.error(error)
	    })
	 */
	pathToBase64(path) {
		return new Promise((resolve, reject) => {
			// #ifdef H5
			const _canvas = () => {
				const image = new Image();
				image.onload = function() {
					const canvas = document.createElement('canvas');
					// 获取图片原始宽高
					canvas.width = this.naturalWidth;
					canvas.height = this.naturalHeight;
					// 将图片插入画布并开始绘制
					canvas.getContext('2d').drawImage(image, 0, 0);
					const result = canvas.toDataURL('image/png')
					resolve(result);
					canvas.height = canvas.width = 0
				}
				image.src = path
				image.setAttribute('crossOrigin', 'Anonymous');
				image.src = path;
				console.log('path:', path);
				image.onerror = (error) => {
					image.src = require('@/static/images/defalut-img/default-img.png');
					console.error(`urlToBase64 error: ${path}`, JSON.stringify(error))
					// reject(new Error('urlToBase64 error'));
				};
			}
			const _fileReader = (blob) => {
				const fileReader = new FileReader();
				fileReader.onload = (e) => {
					resolve(e.target.result);
				};
				fileReader.readAsDataURL(blob);
				fileReader.onerror = (error) => {
					console.error('blobToBase64 error:', JSON.stringify(error))
					reject(new Error('blobToBase64 error'));
				};
			}
			const isFileReader = typeof FileReader === 'function'
			if (/^(http|\/\/)/.test(path) && isFileReader) {
				window.URL = window.URL || window.webkitURL;
				const xhr = new XMLHttpRequest();
				xhr.open('get', path, true);
				xhr.timeout = 2000;
				xhr.responseType = 'blob';
				xhr.onload = function() {
					if (this.status == 200) {
						_fileReader(this.response)
					} else {
						_canvas()
					}
				}
				xhr.onreadystatechange = function() {
					if (this.status === 0) {
						console.error('图片跨域了，得后端处理咯')
					}
				}
				xhr.send();
			} else if (/^blob/.test(path) && isFileReader) {
				_fileReader(path)
			} else {
				_canvas()
			}
			// #endif

			// #ifdef MP
			if (uni.canIUse('getFileSystemManager')) {
				uni.getFileSystemManager().readFile({
					filePath: path,
					encoding: 'base64',
					success: (res) => {
						resolve('data:image/png;base64,' + res.data)
					},
					fail: (error) => {
						console.error('urlToBase64 error:', JSON.stringify(error))
						reject(error)
					}
				})
			}
			// #endif

			// #ifdef APP-PLUS
			plus.io.resolveLocalFileSystemURL(getLocalFilePath(path), (entry) => {
				entry.file((file) => {
					const fileReader = new plus.io.FileReader()
					fileReader.onload = (data) => {
						resolve(data.target.result)
					}
					fileReader.onerror = (error) => {
						console.error('pathToBase64 error:', JSON.stringify(error))
						reject(error)
					}
					fileReader.readAsDataURL(file)
				}, (error) => {
					console.error('pathToBase64 error:', JSON.stringify(error))
					reject(error)
				})
			}, (error) => {
				console.error('pathToBase64 error:', JSON.stringify(error))
				reject(error)
			})
			// #endif
		})
	},

	/**
	 * base64转路径
	 * @param {Object} base64
	 * 用法：this.miniCode = await this.$utils.image.base64ToPath(res.data)
	 */
	base64ToPath(base64) {
		const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64) || [];
		return new Promise((resolve, reject) => {
			// #ifdef MP
			const fs = uni.getFileSystemManager()

			// 自定义文件名
			if (!format) {
				console.error('ERROR_BASE64SRC_PARSE')
				reject(new Error('ERROR_BASE64SRC_PARSE'))
			}
			const time = new Date().getTime();
			const pre = prefix()
			const filePath = `${pre.env.USER_DATA_PATH}/${time}.${format}`
			const buffer = image.base64ToArrayBuffer(bodyData)
			fs.writeFile({
				filePath,
				data: buffer,
				encoding: 'binary',
				success() {
					resolve(filePath)
				},
				fail(err) {
					console.error('获取base64图片失败', JSON.stringify(err))
					reject(err)
				}
			})
			// #endif

			// #ifdef H5
			// mime类型
			const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
			// base64 解码
			const byteString = atob(base64.split(',')[1]);
			// 创建缓冲数组
			const arrayBuffer = new ArrayBuffer(byteString.length);
			// 创建视图
			const intArray = new Uint8Array(arrayBuffer);
			for (let i = 0; i < byteString.length; i++) {
				intArray[i] = byteString.charCodeAt(i);
			}
			resolve(URL.createObjectURL(new Blob([intArray], { type: mimeString })))
			// #endif

			// #ifdef APP-PLUS
			const bitmap = new plus.nativeObj.Bitmap('bitmap' + Date.now())
			bitmap.loadBase64Data(base64, () => {
				if (!format) {
					console.error('ERROR_BASE64SRC_PARSE')
					reject(new Error('ERROR_BASE64SRC_PARSE'))
				}
				const time = new Date().getTime();
				const filePath = `_doc/uniapp_temp/${time}.${format}`

				bitmap.save(filePath, {},
					() => {
						bitmap.clear()
						resolve(filePath)
					},
					(error) => {
						bitmap.clear()
						console.error(`${JSON.stringify(error)}`)
						reject(error)
					})
			}, (error) => {
				bitmap.clear()
				console.error(`${JSON.stringify(error)}`)
				reject(error)
			})
			// #endif
		})
	},
	// #ifdef MP
	base64ToArrayBuffer(data) {
		/**
		 * base64ToArrayBuffer
		 * Base64Binary.decode(base64_string);  
		 * Base64Binary.decodeArrayBuffer(base64_string); 
		 */
		const Base64Binary = {
			_keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

			/* will return a  Uint8Array type */
			decodeArrayBuffer(input) {
				const bytes = (input.length / 4) * 3;
				const ab = new ArrayBuffer(bytes);
				this.decode(input, ab);
				return ab;
			},

			removePaddingChars(input) {
				const lkey = this._keyStr.indexOf(input.charAt(input.length - 1));
				if (lkey == 64) {
					return input.substring(0, input.length - 1);
				}
				return input;
			},

			decode(input, arrayBuffer) {
				// get last chars to see if are valid
				input = this.removePaddingChars(input);
				input = this.removePaddingChars(input);

				const bytes = parseInt((input.length / 4) * 3, 10);

				let uarray;
				let chr1, chr2, chr3;
				let enc1, enc2, enc3, enc4;
				let i = 0;
				let j = 0;

				if (arrayBuffer) { uarray = new Uint8Array(arrayBuffer); } else { uarray = new Uint8Array(bytes); }

				input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

				for (i = 0; i < bytes; i += 3) {
					// get the 3 octects in 4 ascii chars
					enc1 = this._keyStr.indexOf(input.charAt(j++));
					enc2 = this._keyStr.indexOf(input.charAt(j++));
					enc3 = this._keyStr.indexOf(input.charAt(j++));
					enc4 = this._keyStr.indexOf(input.charAt(j++));

					chr1 = (enc1 << 2) | (enc2 >> 4);
					chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
					chr3 = ((enc3 & 3) << 6) | enc4;

					uarray[i] = chr1;
					if (enc3 != 64) uarray[i + 1] = chr2;
					if (enc4 != 64) uarray[i + 2] = chr3;
				}
				return uarray;
			}
		}
		return (uni.base64ToArrayBuffer && uni.base64ToArrayBuffer(data)) || Base64Binary.decodeArrayBuffer(data)
	}
	// #endif
}

/**
 * 处理api请求的工具
 */
const api = {
	/**
	 * api：传入的接口
	 * params：接口请求的参数
	 * options：请求接口前、中、后对数据的处理
	 * 用法：在main.js里引入：import { api } from '@/utils/utils.js'; Vue.prototype.$apiRequest = api.request;//封装统一api请求的方法
	 *      this.$apiRequest(bindPhone,params,
	            {
	                before(){
	                    console.log('调用接口前');
	                },
	                success(res){
	                    console.log('调用接口成功res.status == 1');
	                },
	                statusError(res){
	                    console.log('调用接口成功，但res.status != 1');
	                },
	                error(e){
	                    console.log('调用接口失败，有语法上的错误');
	                },
	                complete(res){
	                    console.log('调用api处理完成（无论成功或失败）');
	                },
	                showErrorMsg:false,//res.status != 1时，不显示showToast
	            }
	        )
	 */
	request(api, params = {}, options = {}) {
		params = { ...params }
		const defaultOptions = {
			before: null, // 调用api处理之前
			success: null, // 调用api成功且 res.status == 1 后
			statusError: null, // 调用api成功且 res.status != 1 后, 要对res.status != 1的情况进行处理时，就把res再暴露出来，在页面上另外处理
			error: null, // 调用api处理失败
			complete: null, // 调用api处理完成（无论成功或失败）
			showErrorMsg: true // res.status != 1时，是否显示showToast
		}
		options = uni.$u.deepMerge(defaultOptions, options)
		if (options.before) {
			options.before() // 空参数调用
		}

		api(params)
			.then((res) => {
				if (res.status == 1) {
					if (options.success) {
						options.success(res)
					}
				} else {
					options.statusError(res)
					if (options.showErrorMsg) {
						uni.showToast({ title: res.msg, duration: 2000, icon: 'none' })
					}
				}
			})
			.catch((e) => {
				if (options.error) {
					options.error(e)
				}
			})
			.finally((res) => {
				if (options.complete) {
					options.complete(res)
				}
			})
	}
}


class LoginModal {
	constructor() {
		this.show = false
	}
	showModal(param) {
		if (this.show) {
			return
		}
		this.show = true
		uni.showModal({
			...param,
			complete: () => {
				this.show = false
				if (param.complete) {
					param.complete()
				}
			}
		})
	}
}

// 单例模式抽象，分离创建对象的函数和判断对象是否已经创建(第二版单例)
const createSingle = function(fn) {
	let result
	return function() {
		return result || (result = new fn(...arguments))
	}
}
const singleLoginModal = createSingle(LoginModal)
const loginModal = singleLoginModal()

export { getUa, debounce, throttle, getRect, time, color, pages, image, api, singleLoginModal, loginModal, storage, getRectSurpass }
export default { getUa, debounce, throttle, getRect, time, color, pages, image, api, singleLoginModal, loginModal, storage, getRectSurpass }
