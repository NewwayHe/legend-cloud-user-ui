import config from '@/config/config.js'

class Socket {
    /* '_'为私有属性，外部不可调用 */

    /* 状态 */

    lockReconnect = false

    // 重连定时
    reconnectTimeout = null

    // 心跳时长

    timeout = 10000

    // 心跳变量
    timeoutObj = null

    // 关闭变量
    timeoutClose = null

    userid = null

    /* 参数 */

    socketTask = null
    constructor(userid) {
        this.userid = userid // 通过new实例的属性，叫做实例属性：dog.name
        // 静态属性，通过构造函数点出来的，直接访问到的属性叫做静态属性。构造函数名.属性
    }

    createWebSocket() {
        this.init()
    }
    /* 初始化 */
    init() {
        const self = this
        this.socketTask = uni.connectSocket({
            url: config.imServer,
            success(data) {
                console.log(data)
                console.log('链接成功')
            },
            fail(err) {
                console.log('出错了')
            }
        })
        return new Promise((res, req) => {
            const self = this
            this.socketTask.onOpen(function() {
                console.log('WebSocket连接已打开！')
                self.heartReset().heartStart()
                return res(true)
            })
            this.socketTask.onClose(function() {
                self.reconnect()
                console.log('WebSocket关闭重连')
                return res(false)
            })

            this.socketTask.onError(function() {
                self.reconnect()
                console.log('WebSocket错误重连')
                return res(false)
            })
        })
    }

    heartReset() {
        console.log('心跳重置')
        clearTimeout(this.timeoutObj)
        clearTimeout(this.timeoutClose)
        return this
    }

    heartStart() {
        // 开启定时
        // 这里发送一个心跳，后端收到后，返回一个心跳消息，
        // onmessage拿到返回的心跳就说明连接正常
        console.log('心跳开始')
        this.timeoutObj = setTimeout(() => {
            // 心跳时间内收不到消息，主动触发连接关闭，开始重连
            this.sendHeart()
            this.timeoutClose = setTimeout(() => {
                // this.socketTask.close();
            }, 5000)
        }, 10000)
    }
    /*
     *
     * 对原生方法和事件进行封装
     *
     */

    // 发送消息
    send(msg) {
        this.socketTask.send({
            data: msg
        })
    }

    sendHeart() {
        const self = this
        var options = {
            type: 'h5',
            cmd: 9,
            userId: self.userid
        }
        this.send(JSON.stringify(options))
    }

    reconnect() {
        console.log('准备重连')
        const self = this
        if (this.lockReconnect) {
            return
        }
        this.lockReconnect = true
        // 没连接上会一直重连，设置延迟避免请求过多
        this.reconnectTimeout && clearTimeout(this.reconnectTimeout)
        this.reconnectTimeout = setTimeout(function() {
            self.createWebSocket()
            self.lockReconnect = false
        }, 4000)
    }
    // 断开连接
    close() {
        this.socketTask.close()
    }
    // 接受消息
    onmessage(func, all = false) {
        const self = this
        this.socketTask.onMessage(function(data) {
            console.log('收到消息了')
            // self.heartReset().heartStart()
            func(!all ? data.data : data)
        })
    }
}

export default Socket
