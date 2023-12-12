/**
 * 处理字符串工具类
 * 用法：import StringUtils from '@/utils/stringUtils.js';
 */
const StringUtils = {
	/* 只能输入整数(只处理input的type=number时的情况)
	用法：
		setTimeout(()=>{
			this.params.num  = this.$stringUtils.inputInteger(value)
		},10) 
	*/
	inputInteger(value) {
		if (value) {
			if (value == '00') {
				return '0';
			}else if(String(value).indexOf(".")>-1){//把小数点.去掉
				let valueTemp = String(value).replace('.','')
				if (value.length > 1 && value[0] == '0') {//把0.1里的0去掉
					valueTemp = valueTemp.slice(1)
				}
				return valueTemp
			} else if (value.length > 1 && value[0] == '0') {//把01里的0去掉
				return value.slice(1)
			} else{
				return String(value).replace('.', '').replace(/[^0-9]/g, '')
			}
		}
	},

	/* 只能输小数点后precision(默认是2)位，可以输入负数(只处理input的type=number时的情况)
	用法：
		setTimeout(()=>{
			this.params.moneyu  = this.$utils.string.inputDigits(value,2)
		},10) 
	*/
	inputDigits(value,digits = 2,min) {
		if (value) {
			if (value == '00') {
				return '0';
			} else {
				// 如果要求输入的是正整数
				if(digits===0||digits==="0"){
					if(String(value).indexOf(".")>-1){//把小数点.去掉
						let valueTemp = String(value).replace('.','')
						if (value.length > 1 && value[0] == '0') {//把0.1里的0去掉
							valueTemp = valueTemp.slice(1)
						}
						return valueTemp
					} else if (value.length > 1 && value[0] == '0') {//把01里的0去掉
						return value.slice(1)
					} else{
						return String(value).replace('.', '').replace(/[^0-9]/g, '')
					}
				//如果要求输入的是小数
				}else{
					if(Number(min)>=0&&(String(value).indexOf("-")>-1||String(value).indexOf("+")>-1)){//如果min>=0，则不准输入-，把负号+-去掉
						return String(value).replace('-','').replace('+','')
					} else if (value.length > 1 && value[0] == '0' && value[1] != '.') {//把01里的0去掉
						return value.slice(1)
					} else {
						var regs1 = new RegExp(/[\.]{3,}/)
						var regs2 = new RegExp(/[\.]([0-9]{2}).*$/)
						// return String(value).replace(/[^\0-9.]/g, '').replace(/[\.]{2,}/, ".").replace(/[\.]([0-9]{2}).*$/, '.$1').replace(/[A-Z|a-z|\（|\）|[ ]|\s*|\(|\)|\【|\】|\u4e00-\u9fa5]{0,20}/, '')
						return String(value).replace(/[^\0-9.]/g, '').replace(new RegExp(`[\.]{${digits},}`), ".").replace(new RegExp(`[\.]([0-9]{${digits}}).*$`), '.$1').replace(/[A-Z|a-z|\（|\）|[ ]|\s*|\(|\)|\【|\】|\u4e00-\u9fa5]{0,20}/, '')
					}
				}
			}

		}
	},
	
	/* 只能输小数点后两位
	用法：
		setTimeout(()=>{
			this.params.moneyu  = this.$stringUtils.inputMoney(value)
		},10) 
	*/
	inputMoney(value) {
		if (value) {
			if (value == '00') {
				return '0';
			} else if(String(value).indexOf("-")>-1){//把负号-去掉
				return String(value).replace('-','')
			} else if (value.length > 1 && value[0] == '0' && value[1] != '.') {//把01里的0去掉
				return value.slice(1)
			} else {
				return String(value).replace(/[^\0-9.]/g, '').replace(/[\.]{2,}/, ".").replace(/[\.]([0-9]{2}).*$/, '.$1').replace(/[A-Z|a-z|\（|\）|[ ]|\s*|\(|\)|\【|\】|\u4e00-\u9fa5]{0,20}/, '')
			}
		}
	},
	/* 只能输[0~9.9]的折扣数，如果要设置[0.1~9.9]的话，就要用到<ls-input :min="0.1">
	用法：
		setTimeout(()=>{
			this.params.discount  = this.$stringUtils.inputDiscount(value)
		},10) 
	*/
	inputDiscount(value) {
		if (value) {
			if (value == '00') {
				return '0';
			} else {
				let reg = /^((0.[1-9]{1})|(([1-9]{1})(.\d{1})?))$/
				if (value == 0) {//防止下面match报错
					return value //0.1
				} else if (value.length > 1 && value[0] == '0' && value[1] != '.') {
					return value.slice(1)
				} else if (String(value).match(reg)) {
					return String(value).match(reg)[0]
				} else if (value.length > 3) {
					return value.slice(0, 3)
				} else if (value > 9.9) {
					return 9.9
				} else {
					return null
				}
			}
		}
	},
	
    /**
     * 封装的复制文本的方法
     * 注意:uniCopy方法是三端通用的,但H5上只能用到click方法上,用在异步方法上会失败,可以用uni.showModal来获取点击方法来解决该问题
     * 例如：@click="$stringUtils.lsCopy('这是要复制的内容')"
     */
    lsCopy(text) {
        this.uniCopy({
            content: text,
            success: (res) => {
                uni.showToast({ title: res })
            },
            error: (e) => {
                uni.showToast({ title: e, icon: 'none', duration: 3000 })
            }
        })
    },
    /**
     * 复制文本的方法
     * 例如：@click="$stringUtils.lsCopy({content'这是要复制的内容'})"
     */
    uniCopy({ content, success, error }) {
        if (!content) return error('复制的内容不能为空 !')
        content = typeof content === 'string' ? content : content.toString() // 复制内容，必须字符串，数字需要转换为字符串
        /**
         * 小程序端 和 app端的复制逻辑
         */
        // #ifndef H5
        uni.setClipboardData({
            data: content,
            success: function() {
                success('复制成功~')
                console.log('success')
            },
            fail: function() {
                success('复制失败~')
            }
        })
        // #endif
    
        /**
         * H5端的复制逻辑
         */
        // #ifdef H5
        if (!document.queryCommandSupported('copy')) {
            // 为了兼容有些浏览器 queryCommandSupported 的判断
            // 不支持
            error('浏览器不支持')
        }
        const textarea = document.createElement('textarea')
        textarea.value = content
        textarea.readOnly = 'readOnly'
        document.body.appendChild(textarea)
        textarea.select() // 选择对象
        textarea.setSelectionRange(0, content.length) // 核心
        const result = document.execCommand('copy') // 执行浏览器复制命令
        if (result) {
            success('复制成功~')
        } else {
            error(
                '复制失败，请检查h5中调用该方法的方式，是不是用户点击的方式调用的，如果不是请改为用户点击的方式触发该方法，因为h5中安全性，不能js直接调用！'
            )
        }
        textarea.remove()
        // #endif
    },
    
    /**
     * 计算数字
     * @param numData {Number}   要处理的数字
     * @param defVal {String}   当numData值来0时，默认显示的值
     * @return {Array}   返回一个数组，Array[0]是整数部分，Array[1]是小数部分，
     * 例如：numData(9999) = 10万；{{item.thumbNum | numFormat('赞')}}(item.thumbNum值为0或不存在时，就显示'赞'字)
     */
    numData(numData,defVal=0) {
        var param = {};
        let num = Number(numData)
        var k = 10000,
            sizes = ['', '万', '亿', '万亿'],
            i;
        if (num < k) {
            param.value = num
            param.unit = ''
        } else {
            i = Math.floor(Math.log(num) / Math.log(k));
            param.value = ((num / Math.pow(k, i))).toFixed(0);
            param.unit = sizes[i];
        }
        let pushData = param.value + param.unit
        if (!param.value) {
            pushData = defVal
        }
        return pushData;
    },
    
    /**
     * 添加单位，如果有rpx，%，px等单位结尾或者值为auto，直接返回，否则加上rpx单位结尾
     * 例如：addUnit('100%') = '100%' , addUnit(100) = '100rpx' , addUnit('100px') = '100px' , addUnit('100','px') = '100px'
     */
    addUnit(value = 'auto', unit = 'rpx') {
        value = String(value)
        // 用/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/判断是否为数值
        return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value) ? `${value}${unit}` : value
    },

	/**
	 * @description 样式转换
	 * 对象转字符串，或者字符串转对象
	 * @param {object | string} customStyle 需要转换的目标
	 * @param {String} target 转换的目的，object-转为对象，string-转为字符串
	 * @returns {object|string}
	 */
	addStyle(customStyle, target = 'object') {
		// 字符串转字符串，对象转对象情形，直接返回
		if (this.isEmpty(customStyle) || typeof(customStyle) === 'object' && target === 'object' || target === 'string' &&
			typeof(customStyle) === 'string') {
			return customStyle
		}
		// 字符串转对象
		if (target === 'object') {
			// 去除字符串样式中的两端空格(中间的空格不能去掉，比如padding: 20px 0如果去掉了就错了)，空格是无用的
			customStyle = this.trim(customStyle,2)
			// 根据";"将字符串转为数组形式
			const styleArray = customStyle.split(';')
			const style = {}
			// 历遍数组，拼接成对象
			for (let i = 0; i < styleArray.length; i++) {
				// 'font-size:20px;color:red;'，如此最后字符串有";"的话，会导致styleArray最后一个元素为空字符串，这里需要过滤
				if (styleArray[i]) {
					const item = styleArray[i].split(':')
					style[this.trim(item[0],2)] = this.trim(item[1],2)
				}
			}
			return style
		}
		// 这里为对象转字符串形式
		let string = ''
		for (const i in customStyle) {
			// 驼峰转为中划线的形式，否则css内联样式，无法识别驼峰样式属性名
			const key = i.replace(/([A-Z])/g, '-$1').toLowerCase()
			string += `${key}:${customStyle[i]};`
		}
		// 去除两端空格
		return this.trim(string,2)
	},
	
	/**
	 * @description 用于获取用户传递值的px值  如果用户传递了"xxpx"或者"xxrpx"，取出其数值部分，如果是"xxxrpx"还需要用过uni.upx2px进行转换
	 * @param {number|string} value 用户传递值的px值
	 * @param {boolean} unit 
	 * @returns {number|string}
	 */
	getPx(value, unit = false) {
		if (this.number(value)) {
			return unit ? `${value}px` : Number(value)
		}
		// 如果带有rpx，先取出其数值部分，再转为px值
		if (/(rpx|upx)$/.test(value)) {
			return unit ? `${uni.upx2px(parseInt(value))}px` : Number(uni.upx2px(parseInt(value)))
		}
		return unit ? `${parseInt(value)}px` : parseInt(value)
	},

	/**
	 * @description 进行延时，以达到可以简写代码的目的 比如: await uni.$u.sleep(20)将会阻塞20ms
	 * @param {number} value 堵塞时间 单位ms 毫秒
	 * @returns {Promise} 返回promise
	 */
	
	sleep(value = 30) {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve()
			}, value)
		})
	},

    /**
     * 将带小数点的数字切割成整数和小数部分
     * @param text {String||Number}   要传文本
     * @param digits {Number}   默认是2位小数点
     * @return {Array}   返回一个数组，Array[0]是整数部分，Array[1]是小数部分，
     *          data: Money: StringUtils.formatNumber,
     *          {{ Money(cash)[0] }}.{{ Money(cash)[1] }}
     */
    formatNumber: function(text = 0, digits = 2) {
        let tempText = []
        if (!text) {
            text = 0
            tempText = ['0','00'] // 用来暂时缓存传进来的文本
        } else {
            tempText = [text] // 用来暂时缓存传进来的文本
        }
        if (!(text instanceof Number)) {
            text = Number(text)
        }
        if (text) {
            text = text.toFixed(digits).toString()
            if (text.indexOf('.') == -1) {
                text = text + '.00'
            }
        }
        return text ? (text.indexOf('.') != -1 ? text.split('.') : text.join('')) : tempText // 如果传的是像中文那样的字符串，则直接返回字符串tempText
    },

    /**
     *  将发表评论里的/n,/r等转换成<br/>(正在用，别删)
     * @param {Object} str:表示要转换的字符串
     */
    enterChangeBr: function(str) {
        return str.toString().replace(/\n|\r\n/g, '<br/>')
    },

    /**
     *  textarea或input框里最大字数倒计(正在用，别删)
     * @param {Object} input:传送进来的文本框里输入的字符串
     * @param 'Number' maxlength:文本的最大字数
     */
    wordInvertedCal: function(input, maxlength) {
        if (input) {
            // 将换行符不计算为单词数
            // input = input.replace(/\n|\r/gi,"");//(由于textarea里的maxlength属性里回车键也统计进一个字数，所以不转换回车键)
            // 更新计数
            return maxlength - input.toString().length
        }
    },

    /**
     *  检测是否全部都是空格或有没有输入内容(已包含下面的isEmpty功能)，此表达式可以允许input的输入内容以空格开头、以空格结尾、中间也可以有空格、但是不允许筛去空格后没有实质内容
     * @param {Object} input:传送进来的文本框里输入的字符串，如果全部都是空格的，则返回：true，如果内容为空，则返回：true
     */
    isAllSpace: function(input) {
        return /^[\s]*$/.test(input)
    },

    /**
     * 去除空格
     * @param  {str}
     * @param  {type}
     *       type:  1-所有空格  2-前后空格  3-前空格 4-后空格
     * @return {String}
     */
    trim(str, type=1) {
		if (!str) return ''
        switch (type) {
            case 1:
                return str.replace(/\s+/g, '')
            case 2:
                return str.replace(/(^\s*)|(\s*$)/g, '')
            case 3:
                return str.replace(/(^\s*)/g, '')
            case 4:
                return str.replace(/(\s*$)/g, '')
            default:
                return str
        }
    },
    /**
     * 获取文件后缀名(扩展名)
     * @param  {str} :文件路径
     * 例如：getSuffix("file:///storage/emulated/0/opmark/User/Pic/hangge.png")，输出png
     * @return {String}
     */
    getSuffix(str) {
        // 获取最后一个.的位置
        const index = str.lastIndexOf('.')
        // 获取后缀
        const ext = str.substr(index + 1)
        // 输出结果
        return ext
    },
    /**
     * 提取文本中的网址
     * @param  {text} :带http的文本
     * @return {Array}
     * 例如：this.urlMatch( "点击链接购买：https://u.jd.com/tN5YgNf" ) = ['https://u.jd.com/tN5YgNf']
     */
    urlMatch(text) {
        var re = /(http[s]?:\/\/([\w-]+.)+([:\d+])?(\/[\w-\.\/\?%&=]*)?)/gi
        var s = text.match(re)
        return s
    },
    /**
     * 给文本中的url带上a标签
     * @param  {text} :带http的文本
     * @return {String}
     * 例如：this.urlAddA( "点击链接购买：https://u.jd.com/tN5YgNf" ) = "点击链接购买：<a href='https://u.jd.com/tN5YgNf' target=_blank>https://u.jd.com/tN5YgNf</a>"
     */
    urlAddA(text) {
        var re = /(http[s]?:\/\/([\w-]+.)+([:\d+])?(\/[\w-\.\/\?%&=]*)?)/gi
        var s = text.replace(re, function(a) {
            return '<a href="' + a + '" target=_blank>' + a + '</a>'
        })
        return s
    },
    /**
     * 给文本中的url替换成另一个url
     * @param  {text} :带http的文本
     * @return {String}
     * 例如：this.urlAddA( "点击链接购买：https://u.jd.com/tN5YgNf"，"https://baidu.com" ) = "点击链接购买：https://baidu.com"
     */
    urlReplace(text, url) {
        var re = /(http[s]?:\/\/([\w-]+.)+([:\d+])?(\/[\w-\.\/\?%&=]*)?)/gi
        var s = text.replace(re, function(a) {
            return url
        })
        return s
    },

    /**
     *  检测输入的内容是否为空
     * @param {Object} input:传送进来的文本框里输入的字符串，如果没有输入内容，则返回：true
     */
    isEmpty: function(val) {
        if (val == '') return true
        if (val == []) return true
        if (val == '[]') return true
        if (val == {}) return true
        if (val == '{}') return true
        if (val == null) return true
        if (val == 'null') return true
        if (val == undefined) return true
        if (val == 'undefined') return true

        if (typeof val === 'boolean') return false
        if (typeof val === 'number') return !val
        if (val instanceof Error) return val.message === ''

        switch (Object.prototype.toString.call(val)) {
            // String or Array
            case '[object String]':
            case '[object Array]':
                return !val.length

            // Map or Set or File
            case '[object File]':
            case '[object Map]':
            case '[object Set]': {
                return !val.size
            }
            // Plain Object
            case '[object Object]': {
                return !Object.keys(val).length
            }
        }
        return false
    },

    isNotEmpty: function(input) {
        return !this.isEmpty(input)
    },
    isBlank: function(input) {
        return input == null || /^\s*$/.test(input)
    },
    isNotBlank: function(input) {
        return !this.isBlank(input)
    },
    trimToEmpty: function(input) {
        return input == null ? '' : this.trim(input)
    },
    startsWith: function(input, prefix) {
        return input.indexOf(prefix) === 0
    },
    endsWith: function(input, suffix) {
        return input.lastIndexOf(suffix) === 0
    },
    contains: function(input, searchSeq) {
        return input.indexOf(searchSeq) >= 0
    },
    equals: function(input1, input2) {
        return input1 == input2
    },
    equalsIgnoreCase: function(input1, input2) {
        return input1.toLocaleLowerCase() == input2.toLocaleLowerCase()
    },
    containsWhitespace: function(input) {
        return this.contains(input, ' ')
    },
    // 生成指定个数的字符
    repeat: function(ch, repeatTimes) {
        var result = ''
        for (var i = 0; i < repeatTimes; i++) {
            result += ch
        }
        return result
    },
    deleteWhitespace: function(input) {
        return input.replace(/\s+/g, '')
    },
    rightPad: function(input, size, padStr) {
        return input + this.repeat(padStr, size)
    },
    leftPad: function(input, size, padStr) {
        return this.repeat(padStr, size) + input
    },
    // 首小写字母转大写
    capitalize: function(input) {
        var strLen = 0
        if (input == null || (strLen = input.length) == 0) {
            return input
        }
        return input.replace(/^[a-z]/, function(matchStr) {
            return matchStr.toLocaleUpperCase()
        })
    },
    // 首大写字母转小写
    uncapitalize: function(input) {
        var strLen = 0
        if (input == null || (strLen = input.length) == 0) {
            return input
        }
        return input.replace(/^[A-Z]/, function(matchStr) {
            return matchStr.toLocaleLowerCase()
        })
    },
    // 大写转小写，小写转大写
    swapCase: function(input) {
        return input.replace(/[a-z]/gi, function(matchStr) {
            if (matchStr >= 'A' && matchStr <= 'Z') {
                return matchStr.toLocaleLowerCase()
            } else if (matchStr >= 'a' && matchStr <= 'z') {
                return matchStr.toLocaleUpperCase()
            }
        })
    },
    // 统计含有的子字符串的个数
    countMatches: function(input, sub) {
        if (this.isEmpty(input) || this.isEmpty(sub)) {
            return 0
        }
        var count = 0
        var index = 0
        while ((index = input.indexOf(sub, index)) != -1) {
            index += sub.length
            count++
        }
        return count
    },
    // 只包含字母
    isAlpha: function(input) {
        return /^[a-z]+$/i.test(input)
    },
    // 只包含字母、空格
    isAlphaSpace: function(input) {
        return /^[a-z\s]*$/i.test(input)
    },
    // 只包含字母、数字
    isAlphanumeric: function(input) {
        return /^[a-z0-9]+$/i.test(input)
    },
    // 只包含字母、数字和空格
    isAlphanumericSpace: function(input) {
        return /^[a-z0-9\s]*$/i.test(input)
    },
    // 数字
    isNumeric: function(input) {
        return /^(?:[1-9]\d*|0)(?:\.\d+)?$/.test(input)
    },
	/**
	 * 验证十进制数字
	 */
	number(value) {
	    return /^[\+-]?(\d+\.?\d*|\.\d+|\d\.\d+e\+\d+)$/.test(value)
	},
    // 小数
    isDecimal: function(input) {
        return /^[-+]?(?:0|[1-9]\d*)\.\d+$/.test(input)
    },
    // 负小数
    isNegativeDecimal: function(input) {
        return /^\-?(?:0|[1-9]\d*)\.\d+$/.test(input)
    },
    // 正小数
    isPositiveDecimal: function(input) {
        return /^\+?(?:0|[1-9]\d*)\.\d+$/.test(input)
    },
    // 整数
    isInteger: function(input) {
        return /^[-+]?(?:0|[1-9]\d*)$/.test(input)
    },
    // 正整数
    isPositiveInteger: function(input) {
        return /^\+?(?:0|[1-9]\d*)$/.test(input)
    },
    // 负整数
    isNegativeInteger: function(input) {
        return /^\-?(?:0|[1-9]\d*)$/.test(input)
    },
    // 只包含数字和空格
    isNumericSpace: function(input) {
        return /^[\d\s]*$/.test(input)
    },
    isWhitespace: function(input) {
        return /^\s*$/.test(input)
    },
    isAllLowerCase: function(input) {
        return /^[a-z]+$/.test(input)
    },
    isAllUpperCase: function(input) {
        return /^[A-Z]+$/.test(input)
    },
    defaultString: function(input, defaultStr) {
        return input == null ? defaultStr : input
    },
    defaultIfBlank: function(input, defaultStr) {
        return this.isBlank(input) ? defaultStr : input
    },
    defaultIfEmpty: function(input, defaultStr) {
        return this.isEmpty(input) ? defaultStr : input
    },
    // 字符串反转
    reverse: function(input) {
        if (this.isBlank(input)) {
            input
        }
        return input.split('').reverse().join('')
    },
    // 删掉特殊字符(英文状态下)
    removeSpecialCharacter: function(input) {
        return input.replace(/[!-/:-@\[-`{-~]/g, '')
    },
    // 只包含特殊字符、数字和字母（不包括空格，若想包括空格，改为[ -~]）
    isSpecialCharacterAlphanumeric: function(input) {
        return /^[!-~]+$/.test(input)
    },
    /**
     * 校验时排除某些字符串，即不能包含某些字符串
     * @param {Object} conditions:里面有多个属性，如下：
     *
     * @param {String} matcherFlag 匹配标识
     * 0:数字；1：字母；2：小写字母；3:大写字母；4：特殊字符,指英文状态下的标点符号及括号等；5:中文;
     * 6:数字和字母；7：数字和小写字母；8：数字和大写字母；9：数字、字母和特殊字符；10：数字和中文；
     * 11：小写字母和特殊字符；12：大写字母和特殊字符；13：字母和特殊字符；14：小写字母和中文；15：大写字母和中文；
     * 16：字母和中文；17：特殊字符、和中文；18：特殊字符、字母和中文；19：特殊字符、小写字母和中文；20：特殊字符、大写字母和中文；
     * 100：所有字符;
     * @param {Array} excludeStrArr 排除的字符串，数组格式
     * @param {String} length 长度，可为空。1,2表示长度1到2之间；10，表示10个以上字符；5表示长度为5
     * @param {Boolean} ignoreCase 是否忽略大小写
     * conditions={matcherFlag:"0",excludeStrArr:[],length:"",ignoreCase:true}
     */
    isPatternMustExcludeSomeStr: function(input, conditions) {
        // 参数
        var matcherFlag = conditions.matcherFlag
        var excludeStrArr = conditions.excludeStrArr
        var length = conditions.length
        var ignoreCase = conditions.ignoreCase
        // 拼正则
        var size = excludeStrArr.length
        var regex = size == 0 ? '^' : '^(?!.*(?:{0}))'
        var subPattern = ''
        for (var i = 0; i < size; i++) {
            excludeStrArr[i] = Bee.StringUtils.escapeMetacharacterOfStr(excludeStrArr[i])
            subPattern += excludeStrArr[i]
            if (i != size - 1) {
                subPattern += '|'
            }
        }
        regex = this.format(regex, [subPattern])
        switch (matcherFlag) {
            case '0':
                regex += '\\d'
                break
            case '1':
                regex += '[a-zA-Z]'
                break
            case '2':
                regex += '[a-z]'
                break
            case '3':
                regex += '[A-Z]'
                break
            case '4':
                regex += '[!-/:-@[-`{-~]'
                break
            case '5':
                regex += '[\u4E00-\u9FA5]'
                break
            case '6':
                regex += '[a-zA-Z0-9]'
                break
            case '7':
                regex += '[a-z0-9]'
                break
            case '8':
                regex += '[A-Z0-9]'
                break
            case '9':
                regex += '[!-~]'
                break
            case '10':
                regex += '[0-9\u4E00-\u9FA5]'
                break
            case '11':
                regex += '[a-z!-/:-@[-`{-~]'
                break
            case '12':
                regex += '[A-Z!-/:-@[-`{-~]'
                break
            case '13':
                regex += '[a-zA-Z!-/:-@[-`{-~]'
                break
            case '14':
                regex += '[a-z\u4E00-\u9FA5]'
                break
            case '15':
                regex += '[A-Z\u4E00-\u9FA5]'
                break
            case '16':
                regex += '[a-zA-Z\u4E00-\u9FA5]'
                break
            case '17':
                regex += '[\u4E00-\u9FA5!-/:-@[-`{-~]'
                break
            case '18':
                regex += '[\u4E00-\u9FA5!-~]'
                break
            case '19':
                regex += '[a-z\u4E00-\u9FA5!-/:-@[-`{-~]'
                break
            case '20':
                regex += '[A-Z\u4E00-\u9FA5!-/:-@[-`{-~]'
                break
            case '100':
                regex += '[sS]'
                break
            default:
            // alert(matcherFlag + ":This type is not supported!");
        }
        regex += this.isNotBlank(length) ? '{' + length + '}' : '+'
        regex += '$'
        var pattern = new RegExp(regex, ignoreCase ? 'i' : '')
        return pattern.test(input)
    },
    /**
     * @param {String} message
     * @param {Array} arr
     * 消息格式化
     */
    format: function(message, arr) {
        return message.replace(/{(\d+)}/g, function(matchStr, group1) {
            return arr[group1]
        })
    },
    /**
     * 把连续出现多次的字母字符串进行压缩。如输入:aaabbbbcccccd 输出:3a4b5cd
     * @param {String} input
     * @param {Boolean} ignoreCase : true or false
     */
    compressRepeatedStr: function(input, ignoreCase) {
        var pattern = new RegExp('([a-z])\\1+', ignoreCase ? 'ig' : 'g')
        return (result = input.replace(pattern, function(matchStr, group1) {
            return matchStr.length + group1
        }))
    },
    /**
     * 校验必须同时包含某些字符串
     * @param {String} input
     * @param {Object} conditions:里面有多个属性，如下：
     *
     * @param {String} matcherFlag 匹配标识
     * 0:数字；1：字母；2：小写字母；3:大写字母；4：特殊字符,指英文状态下的标点符号及括号等；5:中文;
     * 6:数字和字母；7：数字和小写字母；8：数字和大写字母；9：数字、字母和特殊字符；10：数字和中文；
     * 11：小写字母和特殊字符；12：大写字母和特殊字符；13：字母和特殊字符；14：小写字母和中文；15：大写字母和中文；
     * 16：字母和中文；17：特殊字符、和中文；18：特殊字符、字母和中文；19：特殊字符、小写字母和中文；20：特殊字符、大写字母和中文；
     * 100：所有字符;
     * @param {Array} excludeStrArr 排除的字符串，数组格式
     * @param {String} length 长度，可为空。1,2表示长度1到2之间；10，表示10个以上字符；5表示长度为5
     * @param {Boolean} ignoreCase 是否忽略大小写
     * conditions={matcherFlag:"0",containStrArr:[],length:"",ignoreCase:true}
     *
     */
    isPatternMustContainSomeStr: function(input, conditions) {
        // 参数
        var matcherFlag = conditions.matcherFlag
        var containStrArr = conditions.containStrArr
        var length = conditions.length
        var ignoreCase = conditions.ignoreCase
        // 创建正则
        var size = containStrArr.length
        var regex = '^'
        var subPattern = ''
        for (var i = 0; i < size; i++) {
            containStrArr[i] = Bee.StringUtils.escapeMetacharacterOfStr(containStrArr[i])
            subPattern += '(?=.*' + containStrArr[i] + ')'
        }
        regex += subPattern
        switch (matcherFlag) {
            case '0':
                regex += '\\d'
                break
            case '1':
                regex += '[a-zA-Z]'
                break
            case '2':
                regex += '[a-z]'
                break
            case '3':
                regex += '[A-Z]'
                break
            case '4':
                regex += '[!-/:-@[-`{-~]'
                break
            case '5':
                regex += '[\u4E00-\u9FA5]'
                break
            case '6':
                regex += '[a-zA-Z0-9]'
                break
            case '7':
                regex += '[a-z0-9]'
                break
            case '8':
                regex += '[A-Z0-9]'
                break
            case '9':
                regex += '[!-~]'
                break
            case '10':
                regex += '[0-9\u4E00-\u9FA5]'
                break
            case '11':
                regex += '[a-z!-/:-@[-`{-~]'
                break
            case '12':
                regex += '[A-Z!-/:-@[-`{-~]'
                break
            case '13':
                regex += '[a-zA-Z!-/:-@[-`{-~]'
                break
            case '14':
                regex += '[a-z\u4E00-\u9FA5]'
                break
            case '15':
                regex += '[A-Z\u4E00-\u9FA5]'
                break
            case '16':
                regex += '[a-zA-Z\u4E00-\u9FA5]'
                break
            case '17':
                regex += '[\u4E00-\u9FA5!-/:-@[-`{-~]'
                break
            case '18':
                regex += '[\u4E00-\u9FA5!-~]'
                break
            case '19':
                regex += '[a-z\u4E00-\u9FA5!-/:-@[-`{-~]'
                break
            case '20':
                regex += '[A-Z\u4E00-\u9FA5!-/:-@[-`{-~]'
                break
            case '100':
                regex += '[sS]'
                break
            default:
            // alert(matcherFlag + ":This type is not supported!");
        }
        regex += this.isNotBlank(length) ? '{' + length + '}' : '+'
        regex += '$'
        var pattern = new RegExp(regex, ignoreCase ? 'i' : '')
        return pattern.test(input)
    },
    // 中文校验
    isChinese: function(input) {
        return /^[\u4E00-\u9FA5]+$/.test(input)
    },
    // 去掉中文字符
    removeChinese: function(input) {
        return input.replace(/[\u4E00-\u9FA5]+/gm, '')
    },
    // 转义元字符
    escapeMetacharacter: function(input) {
        var metacharacter = '^$()*+.[]|\\-?{}|'
        if (metacharacter.indexOf(input) >= 0) {
            input = '\\' + input
        }
        return input
    },
    // 转义字符串中的元字符
    escapeMetacharacterOfStr: function(input) {
        return input.replace(/[\^\$\*\+\.\|\\\-\?\{ \ }\|]/gm, '\\$&')
    }
}

export default StringUtils
