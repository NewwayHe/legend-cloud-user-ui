/**
 * 支付相关的业务,比如充值,订单支付
 */
import { orderApi } from '@/api/ModulesOrder.js'; //APP支付中心-->调用支付
import { getUa } from "@/utils/utils.js";
import  * as encryption  from '@/utils/encryption';

//本js方法返回结果的data类型
const resultDataType = {
    FORM: "form",
    JSON: "json"
};

//定义本js支持的支付方式
const payType = {
    FREE_PAY:'FREE_PAY',//免费支付
    // ALI_PAY:'ALI_PAY',//支付宝支付
    // WX_PAY:'WX_PAY',//微信支付
    ALI_PAY:'alipay',//支付宝支付
    WX_PAY:'wxpay',//微信支付
    SIMULATE_PAY:'SIMULATE_PAY',//模拟支付
}

//定义后台支付接口支持的支付方式
const apiPayType = {
	FREE_PAY:'FREE_PAY',//免费支付
	ALI_PAY:'ALI_PAY',//支付宝支付
	WX_PAY:'WX_PAY',//微信支付
	SIMULATE_PAY:'SIMULATE_PAY',//模拟支付
}

//定义后台接口支付单据类型
const subSettlementType = {
    ORDER: "USER_ORDER", //普通商品订单支付
    PREPAID_RECHARGE: "USER_PRED_RECHARGE", //余额充值
    AUCTION_DEPOSIT: "AUCTION_DEPOSIT", //拍卖保证金支付
    PRESELL_ORDER: "PRESELL_ORDER_PAY" //预售订单支付
}

//定义后台接口支付来源
const apiPaySource = {
    WAP: "H5",
    WEIXIN: "MINI",
    APP: "APP"
};

//定义本js方法的错误对象
const myError = {
    //未知错误
    unknown: {
        code: "UNKNOWN",
        msg: "系统异常, 支付失败, 请重试或联系客服人员!"
    },
    //不支持
    noSupport: {
        code: "NO_SUPPORT",
        msg: "暂不支持您选择的支付, 请尝试选择其他支付!"
    },
    //重复支付
    repeition: {
        code: "REPETITION",
        msg: "您已经发起过支付了, 请勿重复支付!"
    },
    //取消支付
    cancel: {
        code: "CANCEL",
        msg: "您取消了支付!"
    },
    //网络异常
    network: {
        code: "NETWORK",
        msg: "网络异常, 请检查您的网络设置!"
    }
}





//H5浏览器支付
const h5Pay = {
    //支付类型常量, 调用者可以通过他作为支付类型参数传入调用支付方法
    payType: payType,

    /**
     * 充值支付
     * @param {*} payTypeValue 支付方式
     * @param {*} subNumbers 充值单号数组
     */
    recharge(payTypeValue, subNumbers) {
        console.log('chongzhi h5')
        return this.pay(
            subSettlementType.PREPAID_RECHARGE,
            payTypeValue,
            '',
            0,
            subNumbers,
            false,
            ''
        );
    },
	
	wxBrowserPay(result){
		 let prepayResult = JSON.parse(encryption.decrypt(result.paymentResult)) 
		 let paySettlementSn = result.paySettlementSn
		 console.log("come in payto")
		 console.log(result)
		 console.log(paySettlementSn)
		 console.log(prepayResult)
		 if (getUa().isWeixin) {
			if (typeof WeixinJSBridge == "undefined") {
				if (document.addEventListener) {
					document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(prepayResult,paySettlementSn), false);
				} else if (document.attachEvent) {
					document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady(prepayResult,paySettlementSn));
					document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady(prepayResult,paySettlementSn));
				}
			} else {
				this.onBridgeReady(prepayResult,paySettlementSn);
			}
		} 
	},
	
	onBridgeReady(prepayResult, paySettlementSn) {
	        WeixinJSBridge.invoke(
	            'getBrandWCPayRequest', {
	                "appId": prepayResult.appId, //公众号名称，由商户传入
	                "timeStamp": prepayResult.timeStamp, //时间戳，自1970年以来的秒数
	                "nonceStr": prepayResult.nonceStr, //随机串
	                "package": prepayResult.package,
	                "signType": prepayResult.signType, //微信签名方式：
	                "paySign": prepayResult.paySign //微信签名
	            },
	            res => {
	                if (res.err_msg == "get_brand_wcpay_request:ok") {
						uni.hideLoading()
						uni.redirectTo({
						    url: `/ModuleOrder/submitOrder/orderPayResult?subSettlementSn=`+paySettlementSn
						});
	                } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
	                    // alert('取消支付')
						uni.hideLoading()
	                   
	                } else {
	                   
	                }
					uni.hideLoading()
	            });
	  },
	
    /**
     * 通用支付
     * @param {*} payTypeId 支付类型
     * @param {*} businessOrderNumberList 支付的业务单号集合
     * @param {*} settlementType // 支付单据类型 [ 订单支付:USER_ORDER,预付款充值:USER_RECHARGE ] 
     */
    pay(payTypeId,businessOrderNumberList,settlementType='USER_ORDER') {
        return new Promise((resolve, reject) => {
			let apiPaySource =  _method.getApiPaySource(payTypeId)
			
			let payParams = {
				businessOrderNumberList, // 支付的业务单号集合
				payTypeId, //支付类型
				settlementType, // 支付单据类型 [ 订单支付:USER_ORDER,预付款充值:USER_RECHARGE ] 
				"visitSource": apiPaySource
			}

            let result = {};
			orderApi.payTo(payParams).then(res=>{
				const paymentResult = encryption.decrypt(res.data.paymentResult)
				console.log('payTo:',res)
				if(res.code==1){
					if(getUa().isWeixin&&(payTypeId=='WX_PAY'||payTypeId=='YEEPAY_WX_PAY')){
						this.wxBrowserPay(res.data)
						return
					}
					else if (payTypeId == 'WX_PAY'||payTypeId=='YEEPAY_WX_PAY') {
						let location = JSON.parse(paymentResult).mwebUrl || ''
						if (location) {
							result.success = true;
							result.data = res.data;
							result.dataType = resultDataType.JSON;
							let	redirect_url  = encodeURIComponent(window.location.origin+"/ModuleOrder/submitOrder/orderPayResult?h5Weixin=true&subSettlementSn="+res.data.paySettlementSn) 
							window.location.href = location+'&redirect_url='+redirect_url
							return
						}
						result.success = false;
						result.errorCode = myError.unknown.code;
						result.msg = res.msg;
					}else if(payTypeId=='SIMULATE_PAY'||payTypeId=="FREE_PAY"){
						if( paymentResult=='success'){
							result.success = true;
							result.data = res.data;
							result.dataType = resultDataType.JSON;
						}else{
							result.success = false;
							result.errorCode = myError.unknown.code;
							result.msg = res.msg;
						}
					}else{
						result.success = true;
						result.data = res.data;
						result.dataType = resultDataType.FORM;
						//  res.data.data默认是我们拿到的form代码
						result.form = paymentResult
					}
					result.isApp = false;
					resolve(result);
				}else{
					result.success = false;
					result.errorCode = myError.unknown.code;
					result.msg = res.msg;
					
				}
				resolve(result);
			}).catch(error=>{
				console.log(error)
				result.success = false;
				result.errorCode = error.network?.code;
				result.msg = error.network?.code;
				result.code = error.response.data?.code
				reject(result);
			})
           
        });
    }
};



//小程序支付
const mpPay = {

    //支付类型常量, 调用者可以通过他作为支付类型参数传入调用支付方法
    payType: payType,

    /**
     * 充值支付
     * @param {*} payTypeValue 支付方式
     * @param {*} subNumbers 充值单号数组
     */
    recharge(payTypeValue, subNumbers) {
        return this.pay(subSettlementType.PREPAID_RECHARGE, payTypeValue, '', 0, subNumbers, false, '');
    },
	
    /**
     * 通用支付
     * @param {*} payTypeId 支付类型
     * @param {*} businessOrderNumberList 支付的业务单号集合
     * @param {*} settlementType // 支付单据类型 [ 订单支付:USER_ORDER,预付款充值:USER_RECHARGE ] 
     */
    pay(payTypeId,businessOrderNumberList,settlementType='USER_ORDER') {
        return new Promise((resolve, reject) => {
			let apiPaySource =  _method.getApiPaySource(payTypeId)
			let payParams = {
				businessOrderNumberList, // 支付的业务单号集合
				payTypeId, //支付类型
				settlementType, // 支付单据类型 [ 订单支付:USER_ORDER,预付款充值:USER_RECHARGE ] 
				"visitSource": apiPaySource
			}
            let result = {};
			orderApi.payTo(payParams).then(res=>{
				const paymentResult = encryption.decrypt(res.data.paymentResult)
				if(res.code==1){
					if(payTypeId=='SIMULATE_PAY'||payTypeId=="FREE_PAY"){
						if( paymentResult=='success'){
							result.success = true;
							result.data = res.data;
							result.dataType = resultDataType.JSON;
						}else{
							result.success = false;
							result.errorCode = myError.unknown.code;
							result.msg = res.msg;
						}
						resolve(result);
					}else{
						console.log('res.data:',res.data)// {"paySettlementSn":"2021072714231148086716","paymentResult":"https://cash.yeepay.com/qr/r52o5m3W"}
						// #ifdef MP
						let prepayResult = JSON.parse(paymentResult)
						uni.requestPayment({
							  'timeStamp': prepayResult.timeStamp,
							  'nonceStr': prepayResult.nonceStr,
							  'package': prepayResult.package,
							  'signType': prepayResult.signType,
							  'paySign': prepayResult.paySign,
							  success(payRes) {
								  console.log("调用小程序支付成功: %o", payRes);
								  result.success = true;
								  result.data = res.data;//这个是我们接口的res，不是uni.requestPayment的res
								  result.dataType = resultDataType.JSON;
								  resolve(result);
							  },
							  fail(payRes) {
								  console.log("调用小程序支付失败: %o", payRes);
								  result.success = false;
								  if (payRes.errMsg == 'requestPayment:fail cancel') {
									  result.errorCode = myError.cancel.code;
									  result.msg = myError.cancel.msg;
								  } else {
									  result.errorCode = myError.unknown.code;
									  result.msg = myError.unknown.msg;
								  }
								  resolve(result);
							  }
						});
						// #endif
						
						// #ifdef APP-PLUS
						// 如果是易宝支付
						if (payTypeId == 'YEEPAY_ALI_PAY'||payTypeId == 'YEEPAY_WX_PAY') {
							result.success = true;
							result.data = res.data;
							result.isApp = true;
							resolve(result);
						// 如果是APP端非易宝支付
						}else{
							console.log(payTypeId, payType[payTypeId], paymentResult, '11111111111')
							// 备注：APP微信支付，要打包后才能调起微信，用数据线调试的话call不起微信，而且会报-100错误
							uni.requestPayment({
							    'provider': payType[payTypeId], // 类型
							    'orderInfo': paymentResult, // 后端返回的sdk
							    success(uniRes) {
							        console.log("调用App支付成功: %o", uniRes);
							        result.success = true;
							        result.data = res.data;//这个是我们接口的res，不是uni.requestPayment的res
							        result.dataType = resultDataType.JSON;
							        resolve(result);
							    },
							    fail(uniRes) {
							        console.log("调用App支付失败: %o", uniRes);
							        result.success = false;
							        if (uniRes.errMsg.indexOf('requestPayment:fail cancel')!= -1 || uniRes.errMsg.indexOf('62001') != -1) { // 貌似只有取消微信支付了之后才会是返回这段'requestPayment:fail cancel'
							            result.errorCode = myError.cancel.code;
							            result.msg = myError.cancel.msg;
							        } else {
							            result.errorCode = myError.unknown.code;
							            result.msg = myError.unknown.msg;
							        }
							        resolve(result);
							    }
							});
						}
						// #endif
					}
				}else{
					result.success = false;
					result.errorCode = myError.unknown.code;
					result.msg = res.msg;
					resolve(result);
				}
				
			}).catch(error=>{
				    result.success = false;
				    result.errorCode = error?.network?.code;
				    result.msg = error?.network?.code;
				    reject(result);
			})
        });
    }
}


/* 一些私有方法 */
const _method = {

    /**
     * 通过本js定义的支付方式获取后台接口对应的支付方式
     * @param {*} payTypeValue 本js定义的支付方式
     */
    getApiPaytype(payTypeValue) {
        var value = null;
        switch (payTypeValue) {

            //支付宝支付
            case payType.ALIPAY:
                value = apiPayType.ALP;
                break;

                //微信支付
            case payType.WXPAY:
                // #ifdef MP-WEIXIN
                value = apiPayType.WX_MP_PAY;
                // #endif
                // #ifdef H5
                //否则为浏览器
                if (getUa().isWeixin && payTypeValue=='wxpay') {
                    // 如果是微信登录H5,并选择了微信支付
                    value = apiPayType.WX_PAY;
                } else {
                    value = apiPayType.WX_H5_PAY
                }
                // #endif
                // #ifdef APP-PLUS
                value = apiPayType.WX_APP_PAY;
                // #endif
                break;

                //apple支付, 后台暂不支持applepay
            case payType.APPLEIAP:

                break;

                //模拟支付
            case payType.SIMULATE:
                value = apiPayType.SIMULATE;
                break;
        }

        return value;
    },

    /**
     * 获取后台接口的支付来源
     */
    getApiPaySource(payTypeId) {
        let value
        // #ifdef APP-PLUS
        value = apiPaySource.APP;
        // #endif
        // #ifdef MP-WEIXIN
        value = apiPaySource.WEIXIN;
        // #endif
        // #ifdef H5
            //否则为浏览器
            if ( getUa().isWeixin && (payTypeId=='WX_PAY'||payTypeId=='YEEPAY_WX_PAY') ) {
                // 如果是微信登录H5,并选择了微信支付
                value = "MP";
            } else {
                value = apiPaySource.WAP;
            };
        // #endif

        return value;
    }
};

// #ifdef H5
let platformPayto = h5Pay;
// #endif
// #ifndef H5
let platformPayto = mpPay;
// #endif


export default platformPayto;
