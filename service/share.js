// 普通版本

const shareService = {
    /**
     * 使用系统组件发送分享
     * @param {*} msg:分享的信息，具体msg内必填内容，请参考网址：http://www.html5plus.org/doc/zh_cn/share.html
     */
    shareWeb(provider, msg) {
        // #ifdef APP-PLUS
        // 扩展API加载完毕，现在可以正常调用扩展API
        const result = {}
        return new Promise((resolve, reject) => {
            if (provider != 'systemShare') {
                // 使用Hbuilder的H5+发送分享
                plus.share.getServices(
                    function(services) {
						console.log('services~~~~~',services)//[{"id":"sinaweibo","description":"新浪微博","authenticated":false,"accessToken":"","nativeClient":false},{"id":"qq","description":"QQ","authenticated":false,"accessToken":"","nativeClient":true},{"id":"weixin","description":"微信","authenticated":true,"accessToken":"","nativeClient":true}]
                        let shares = ''
                        services.forEach((element) => {
                            if (element.id == provider) {
                                shares = element
                            }
                        })
                        if (provider != 'sinaweibo') {
                            // 新浪微博没装客户端时可以直接调用网页来分享，所以新浪微博不须要去判断有没有客户端
                            if (!shares.nativeClient) {
                                // 如果不存在对应的分享客户端，引导用户安装客户端
                                result.success = false
                                result.msg = '分享失败:您还未安装客户端！'
                                resolve(result)
                                return
                            }
                        }
                        if (!shares.authenticated) {
                            // 如果还未认证(QQ和微博)，先去认证
                            shares.authorize(
                                function() {
                                    shares.send(
                                        msg,
                                        function() {
                                            result.success = true
                                            result.msg = '分享成功！'
                                            resolve(result)
                                        },
                                        function(error) {
                                            result.success = false
                                            result.msg = '分享失败:' + error.message.split('http')[0]
                                            resolve(result)
                                        }
                                    )
                                },
                                function(error) {
                                    result.success = false
                                    result.msg = '获取授权失败:' + error.message.split('http')[0]
                                    resolve(result)
                                }
                            )
                        } else {
                            // 如果已经认证(微信)，可以直接调用分享，
                            shares.send(
                                msg,
                                function() {
                                    result.success = true
                                    result.msg = '' // 由于微信端点取消或成功分享后，都是返回success的信息，要不然就会出现点击取消也返回成功的toast，所在msg要为空，该问题京东也解决不了
                                    resolve(result)
                                },
                                function(error) {
                                    result.success = false
                                    result.msg = '分享失败:' + error.message.split('http')[0]
                                    resolve(result)
                                }
                            )
                        }
                    },
                    function(error) {
                        result.success = false
                        result.msg = '获取授权失败:' + error.message.split('http')[0]
                        resolve(result)
                    }
                )
            } else {
                plus.share.sendWithSystem(
                    msg,
                    function() {
                        result.success = true
                        result.msg = '' // 由于微信端点取消或成功分享后，都是返回success的信息，要不然就会出现点击取消也返回成功的toast，所在msg要为空，该问题京东也解决不了
                        resolve(result)
                    },
                    function(error) {
                        result.success = false
                        result.msg = '分享失败:' + error.message.split('http')[0]
                        resolve(result)
                    }
                )
            }
        })
        // #endif
    }
}

export default shareService
