<script>
import config from '@/config/config.js';

export default {
	globalData: {
		onLaunch: true,
	},
	onLaunch: function() {
		setTimeout(() => {
			//app启动广告专用，该变量是告诉index这是刚启动app，1秒后，进入index的页面会读取到该值为false，就不会启用启动广告了
			this.globalData.onLaunch = false;
		}, 1000);
		uni.hideTabBar(); //关闭系统的tabBar，采用自定的tabBar(注意，这个放在main.js里无效，放在tabar页面里却不在这里放的话，会先闪一下)

		if (uni.getStorageSync('dealCheckToken')) {
			//request.js里拦截401状态时用到的
			uni.removeStorageSync('dealCheckToken');
		}
		//初始版本更新管理
		this.checkVersion();
		//把手机状态栏度高放进VUEX仓库里
		this.$store.commit('setStausBarHeight', this.systemInfo.statusBarHeight);
		//把系统信息(包含了 手机状态栏高度、设备版本、安全距离safeAreaBottom(要计算)等)放进VUEX仓库里
		this.$store.commit('setSystemInfo', this.systemInfo);
		//把微信端胶囊的(位置及长宽)信息放进VUEX仓库里
		this.$store.commit('setWxMenuBut', this.getWxMenuBut);

		// #ifdef APP-PLUS
		uni.preloadPage({
			//预加载，只有APP才会执行
			url: '/pages/index/index',
			success() {
				// uni.showToast({ title:'页面预载成功' })
			},
			fail() {
				// uni.showToast({ title:'页面预载失败' })
			}
		});
		// #endif

		// #ifdef H5
		// 百度统计，只有H5和微信H5用，APP和小程序是用另一种方法
		if (process.env.NODE_ENV == 'production') {
			var hm = document.createElement('script');
			hm.src = `https://hm.baidu.com/hm.js?${config.baiDuHm}`;
			var s = document.getElementsByTagName('script')[0];
			s.parentNode.insertBefore(hm, s);
		}
		// #endif
	},
	onShow: function() {},
	onHide: function() {
		console.log('App Hide');
	},
	onPageNotFound(){
		// #ifdef H5
		uni.switchTab({ url: '/pages/index/index' })
		// #endif
	},
	// 捕获 app error
	onError(err) {
		console.log(err);
		//当登录微服务版本后，再切换到正规版本，由于local storage里的token格式与正规版本的格式不一样，会导致切换到正规版本后接口都请求不到，必要要把local storage清空才正常
		if (err == 'input is invalid type') {
			uni.showModal({
				title: '温馨提示',
				content: '缓存格式不一致，必要要清空缓存才能正常访问，确定要清空缓存吗？',
				success: res => {
					if (res.confirm) {
						uni.clearStorageSync();
						uni.navigateBack({ delta: 0 }); //注意，必需要先清缓存再跳回本页
					} else if (res.cancel) {
					}
				}
			});
		}
	},
	computed: {
		getWxMenuBut() {
			try {
				// #ifndef MP
				let menuButton = {
					bottom: 0,
					left: 0,
					right: 0,
					top: 0,
					width: 0,
					height: 0,
					placeholder: 0
				};
				// #endif

				// #ifdef MP
				let menuButton = {
					bottom: 58,
					left: 278,
					right: 365,
					top: 26,
					width: 87,
					height: 30,
					placeholder: 97
				};
				let menuButtonBounding = uni.getMenuButtonBoundingClientRect();
				menuButton = this.systemInfo.windowWidth - menuButtonBounding.left;
				menuButton = {
					bottom: menuButtonBounding.bottom,
					left: menuButtonBounding.left,
					right: menuButtonBounding.right,
					top: menuButtonBounding.top,
					width: menuButtonBounding.width,
					height: menuButtonBounding.height,
					placeholder: this.systemInfo.windowWidth - menuButtonBounding.left //点位符
				};
				// #endif
				return menuButton;
			} catch (e) {}
		},
		// 获取 获取系统信息
		systemInfo() {
			try {
				let res = uni.getSystemInfoSync();
				console.log('systemInfoSync:', res);
				return { safeAreaBottom: res.screenHeight - res.safeArea.bottom, ...res };
			} catch (e) {}
		}
	},
	methods: {
		checkVersion() {
			let Version = `${this.systemInfo.appVersion}(${this.systemInfo.appVersionCode})`
			// console.log(15,Version);
			if (uni.getStorageSync('version')) {
				if (Version != uni.getStorageSync('version')) {
					//如果版本有更新
					uni.clearStorageSync(); //清空缓存
				}
			} else {
				uni.setStorageSync('version', Version);
			}
			this.initUpdateManager();
		},
		initUpdateManager() {
			//#ifdef APP-PLUS
			// let appurl = ''
			// if (plus.os.name=="Android") {
			//     appurl = "market://details?id=io.dcloud.hellouniapp"; //这个是通用应用市场，如果想指定某个应用商店，需要单独查这个应用商店的包名或scheme及参数
			// }
			// else{
			//     appurl = "itms-apps://itunes.apple.com/cn/app/hello-uni-app/id1417078253";
			// }
			// // var appurl = "https://www.example.com/update"; //检查更新地址
			// let req = { //升级检测数据
			//     "appid": plus.runtime.appid,
			//     "version": plus.runtime.version
			// };
			// uni.request({
			//     url: appurl,
			//     data: req,
			//     success: (res) => {
			//         if (res.statusCode == 200 && res.data.status === 1) {
			//             uni.showModal({ //提醒用户更新
			//                 title: "更新提示",
			//                 content: res.data.note,
			//                 success: (res) => {
			//                     if (res.confirm) {
			//                         plus.runtime.openURL(res.data.url);
			//                     }
			//                 }
			//             })
			//         }
			//     }
			// })
			//#endif

			// #ifdef MP
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(res => {
				// 请求完新版本信息的回调
				// console.log(res.hasUpdate);
				if (res.hasUpdate) {
					updateManager.onUpdateReady(res => {
						uni.showModal({
							title: '更新提示',
							content: '新版本已经准备好，是否重启应用？',
							success: res => {
								if (res.confirm) {
									uni.clearStorageSync(); //清空缓存
									// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
									updateManager.applyUpdate();
								}
							}
						});
					});

					updateManager.onUpdateFailed(res => {
						// 新的版本下载失败
					});
				}
			});
			// #endif
		}
	}
};
</script>

<style lang="scss">
@import '~@/components/uview-ui/index.scss';
/* UI基础库 */
@import './static/css/ls-main.css';
/*每个页面公共css */
@import './static/css/common.css';
/*阿里图标库 ---- https://ask.dcloud.net.cn/article/35443 重新引入需要生成  iconfont.ttf base64 */
@import '~@/static/fonts/iconfont.css'; //
</style>
