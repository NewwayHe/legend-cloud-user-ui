// 访客记录(还未用上)

import { pages,getUa } from '@/utils/utils.js'
// import { visitHm } from '@/api/common/common.js'
import { appToken } from '@/utils/Cache.js'

const statistics = {
    data() {
        return {
            ip: '',
            id: '',
            shopId: ''
        }
    },
    onShow() {},
    onLoad(option) {
        this.id = option.id || null
        this.shopId = option.shopId || null
        const param = {
            userId: appToken.getToken(),
            cookieId: uni.getStorageSync('utmz'),
            ip: '',
            shopId: this.shopId,
            route: pages.getPageRoute().route,
            options: pages.getPageRoute().options,
            url: pages.getPageRoute().url,
            source: getUa().isWeixin ? 10 : 20
        }
    },
    mounted() {},
    methods: {
        /**
		
		* 获取CokieUtmz
		
		* @returns {string|*}  返回字符串 cokie
		
		*/
        getCokieUtmz() {
            return uni.getStorageSync('utmz')
        },
        /**
		
		* 字符串转base64
		
		* @returns {string|*} 返回字符串转base64
		
		*/
        encode(str) {
            // 对字符串进行编码
            var encode = encodeURI(str)
            // 对编码的字符串转化base64
            var base64 = btoa(encode)
            // var base64 = btoa(str);
            return base64
        },
        /**
		
		* 获取用户ip地址
		
		* @returns {function|*} 返回参数为ip地址的回调函数
		
		*/
        getUserIP(onNewIP) {
            const MyPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection

            const pc = new MyPeerConnection({
                iceServers: []
            })

            const noop = () => {}

            const localIPs = {}

            const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g

            const iterateIP = (ip) => {
                if (!localIPs[ip]) onNewIP(ip)

                localIPs[ip] = true
            }

            pc.createDataChannel('')

            pc.createOffer()
                .then((sdp) => {
                    sdp.sdp.split('\n').forEach(function(line) {
                        if (line.indexOf('candidate') < 0) return

                        line.match(ipRegex).forEach(iterateIP)
                    })

                    pc.setLocalDescription(sdp, noop, noop)
                })
                .catch((reason) => {})

            pc.onicecandidate = (ice) => {
                if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return

                ice.candidate.candidate.match(ipRegex).forEach(iterateIP)
            }
        }
    }
}
export default statistics
