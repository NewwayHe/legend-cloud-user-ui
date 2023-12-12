const config = {
	shareUrl: 'http://192.168.0.15:8080',/* 分享专用链接(跳手机端) */
	server: 'http://192.168.0.15:9999',/* API请求服务器 */
	photoServer: 'http://192.168.0.147:9000/dev6.0-data/',/* 图片服务器 */
	staticServer: 'https://dev6-images.legendshop.cn/miniprogram/',/* 静态资源服务器(为了防少微信小程序打包，把本地图片放到网上服务器上) */
	imServer: '',/* 客服服务器地址，该功能没开放 */
	csServer: '',	/*客服运行的环境，该功能没开放 */
	AmapKey: '',/* 高德地图的key值(H5专用，如果txMapKey值，就会取此值，https://lbs.amap.com/上申请) */
	wxOriginalId:'',/* 微信开放平台原始ID(APP端跳转小程序专用)。位置：https://mp.weixin.qq.com/里【设置】-【帐号信息】->【原始ID】 */
	txMapKey:'',/* 腾讯地图的key值(H5专用，https://lbs.qq.com上申请) */
	baiDuHm:'',/* 百度统计的key值 */
	baiDuHmWx:'',/* 百度统计的key值(小程序专用) */
}