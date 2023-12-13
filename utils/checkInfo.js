/* 
*   数据效验
*   data:{
*       type:String, 效验类型，可选值：下面代码里的 case number、phone、username...等
*       value:[String,Object,Array], 需要效验的值
*       msg:String, 效验结果为false时，toast提示的信息
*       options:[String,Object,Array], 下面某些特殊公式需要传进来的变量，例如：对code验证码的验证时，可以传值来决定效果多少位数
*   }
* 
*   变更：(2021.2.24)
*       一、在main.js里全局引入
*       二、原来的message变量改为msg
*       三、引入options变量，可动态改变效验规则
*		(2023.9.24)
* 		一、校验不通过时的msg改为可以不用在vue页面里传入来，可以在本页面里配置默认showToast的文本，用法：js里写入msg=true，如：!this.$checkInfo([{ type: 'loginPassword', value: this.pwd, msg: true }])
* 
*   用法:
        一、有toast message的
        sure(){
            if(!this.$checkInfo([
                {type:'username',value:userName,msg:'用户名需要为字母、数字和_，不能以数字和_开头'},
                {type:'hasValue',value:shopName,msg:'店铺名称不能为空'},
            ])) return;
        },
        
        二、用来判断是否有值
        computed: {
            goodDataHasValue() {
                return this.$checkInfo([{ type: 'hasValue', value: this.goodData }]);
            },
        }
*/
const checkinput = (data) => {
    let state = true
	let ruleMsg = ''
    for (const i in data) {
        switch (data[i].type) {
			case 'test':
			    state = data[i].options.test(data[i].value) // 自定义 正则
			    break
            case 'number':
                state = /^[0-9]*$/.test(data[i].value) // 或者用这个：/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(data[i].value)
                break
            case 'phone': // 手机号码 (  /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/:旧的,已验证不行  )
                state = /^1[0-9][0-9]{9}$/.test(data[i].value)
                break
			case 'phoneNum': // 电话号码正则表达式（支持手机号码，3-4位区号，7-8位直播号码，1－4位分机号
				state = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/.test(data[i].value)
				break
            case 'name': // 名字:2-20位中英文字符
                state = /^[\u4E00-\u9FA5A-Za-z0-9_]{2,20}$/.test(data[i].value)
                break
            case 'username': // 用户名:2~20位字母、数字和_，不能以数字和_开头
                state = /^[a-zA-Z]\w{1,19}$/.test(data[i].value)
                break
            case 'nickname': // 昵称:2-20位数字、中文、字母和特殊字符(仅限!@#$%^&*())
                state = /^([\u4E00-\u9FA5\uf900-\ufa2d\a-z0-9\.\@\!\#\$\%\^\&\*\(\)\！\￥\（\）]){2,20}$/i.test(data[i].value)
                break
            case 'int': // 整数
                state = /^-?\d+$/.test(data[i].value)
                break
            case 'amount': // 金额,只允许2位小数，原代码：/^[1-9]\d*(,\d{3})*(\.\d{1,2})?$|^0\.\d{1,2}$/
                state = /^\d+(\.\d{0,2})?$/.test(data[i].value)
                break
            case 'payPwd': // 支付密码(允许纯数字):支付密码由6数字
                state = /^\d{6}$/.test(data[i].value)
                break
            case 'password': // 密码应为6-20位字母、数字和标点符号的组合
                state = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[\(\)])+$)([^(0-9a-zA-Z)]|[\(\)]|[a-z]|[A-Z]|[0-9]){6,20}$/.test(data[i].value)
                break
			case 'loginPassword': // 5-16个字符长度，支持数字、英文字符，区分大小写;不支持标点符号和空格符号；
				state = /^[0-9a-zA-Z]{5,16}$/.test(data[i].value)
				ruleMsg = '密码应由5-16位字母、数字不含特殊符号组成'
				break
			 case 'payPassword': // 6位字符长度，支持数字、英文字符，区分大小写；不支持标点符号和空格符号；
				state = /^[0-9a-zA-Z]{6}$/.test(data[i].value)
				break
            case 'email': // 邮箱
                state = /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/.test(data[i].value)
                break
            case 'checkeFace': // 表情符号(如果带有表情符号则返回false)
                state = !/[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g.test(data[i].value)
                break
            case 'hasValue': // 是否有值，true：有值，false：无值
                if (
                    data[i].value == '' ||
                    data[i].value == [] ||
                    data[i].value == '[]' ||
                    data[i].value == {} ||
                    data[i].value == '{}' ||
                    data[i].value == null ||
                    data[i].value == 'null' ||
                    data[i].value == undefined ||
                    data[i].value == 'undefined' ||
                    data[i].value instanceof Error
                ) {
                    state = false
                } else if (typeof data[i].value === 'boolean' || typeof data[i].value === 'number') {
                    state = data[i].value
                } else {
                    switch (Object.prototype.toString.call(data[i].value)) {
                        // String or Array
                        case '[object String]':
                            state = data[i].value.length
                            break
                        case '[object Array]':
                            state = data[i].value.length
                            break
                        case '[object File]':
                            state = true
                            break
                        case '[object Map]':
                            state = true
                            break
                        case '[object Set]': {
                            state = data[i].value.size
                            break
                        }
                        // Plain Object
                        case '[object Object]': {
                            state = Object.keys(data[i].value).length
                            break
                        }
                    }
                }
                break
            case 'url': // 验证URL格式
                state = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=]*)?/.test(data[i].value)
                break
            case 'idCard': // 验证身份证号码
                state = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(data[i].value)
                break
            case 'date': // 验证日期格式
                state = !/Invalid|NaN/.test(new Date(data[i].value).toString())
                break
            case 'dateISO': // 验证ISO类型的日期格式
                state = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(data[i].value)
                break
            case 'chinese': // 只能输中文
                state = /^[\u4e00-\u9fa5]+$/gi.test(data[i].value)
                break
            case 'letter': // 只能输入字母
                state = /^[a-zA-Z]*$/.test(data[i].value)
                break
            case 'enOrNum': // 只能是字母或者数字
                state = /^[0-9a-zA-Z]*$/g.test(data[i].value)
                break
            case 'jsonString': // 是否json字符串
                if (typeof data[i].value === 'string') {
                    try {
                        var obj = JSON.parse(data[i].value)
                        if (typeof obj === 'object' && obj) {
                            state = true
                        } else {
                            state = false
                        }
                    } catch (e) {
                        state = false
                    }
                }
                break
            case 'array': // 是否数组
                if (typeof Array.isArray === 'function') {
                    state = Array.isArray(data[i].value)
                } else {
                    state = Object.prototype.toString.call(data[i].value) === '[object Array]'
                }
                break
            case 'object': // 是否对象
                state = Object.prototype.toString.call(data[i].value) === '[object Object]'
                break
            case 'code': // 是否短信验证码
                const len = data[i].options || 6
                state = new RegExp(`^\\d{${len}}$`).test(data[i].value)
                break
            case 'contains': // 验证是否包含某个值
                const param = data[i].options
                state = data[i].value.indexOf(param) >= 0
                break
            case 'carNo': // 是否车牌号
                // 新能源车牌
                const xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/
                // 旧车牌
                const creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/
                if (value.length === 7) {
                    state = creg.test(value)
                } else if (value.length === 8) {
                    state = xreg.test(value)
                } else {
                    state = false
                }
                break
			case 'bankAccount': // 验证银行卡号（ 10 到30位, 覆盖对公 / 私账户, 参考微信支付）
			    state = /^[1-9]\d{9,29}$/g.test(data[i].value)
			    break
			case 'tax': // 验证税号:15或者17或者18或者20位字母、数字组成
			    state = /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/.test(data[i].value)
			    break
            default:
                state = false
                break
        }
        if (!state) {
            if (data[i].msg) {
                uni.showToast({ title:data[i].msg === true ? ruleMsg : data[i].msg, duration: 2000, icon: 'none' })
            }
            return false
        }
    }
    return true
}
export default checkinput


