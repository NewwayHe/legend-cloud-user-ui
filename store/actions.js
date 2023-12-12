import { trim, popupAdvert } from '@/api/ModulesCommon.js'
import { cartApi } from '@/api/ModulesOrder.js'
import { userApi } from '@/api/ModulesUser.js'
import { goodCategory } from '@/api/ModuleGoods.js'
import { setting,contactInformation } from '@/api/ModuleBase.js';
import { color, debounce } from '@/utils/utils.js';// 备注：这里不能用uni.$utils.debounce，因为vuex是先于main.js挂载uni.$utils的
import { appToken } from '@/utils/Cache.js';
import amapFile from '@/libs/amap-wx'
import state from './state'
import Gps from '@/libs/json-gps/js_sdk/gps.js';
const gps = new Gps()
export default {
	/** 获取当前经纬度(自动定位) */
	getLocation({commit,state,dispatch},parmas){
		// gps.getLocation()：判断是否开启定位，如果已经开启了定位，会返回一个带经纬度的object值，如果未开启定位，会返回false值，并拉起弹框让用户去设置开启定位
		return new Promise((resolve, reject) => {
			if ((state.location.region == '定位中'&&!uni.getStorageSync('getLocationFail'))||parmas.reSet) {
				uni.getLocation({
					type: 'gcj02',
					geocode: true, //是否解析地址信息	仅App平台支持
					success: (res) => {
						// 如果是H5端，进页面时马上手动定位触发setLocation()方法，这时已经进入getLocation()方法，却uni.getLocation()由于长时间没有获取数据成功，这时加个state.location.region == '定位中'防止把手动定位的数据覆盖掉
						if (state.location.region == '定位中'||parmas.reSet) {
							// #ifdef APP-PLUS
							dispatch('__delLocationMsg',{ resolve:resolve, reject:reject, data:res, latitude:res.latitude, longitude:res.longitude })
							// #endif
							
							// #ifndef APP-PLUS
							commit('setLocation', {...state.location,lat:res.latitude,lng:res.longitude,});//这句话是新增，高德key不行的话，下面的myAmapFun.getRegeo会走fail，会加载很久，但这时自提下单要用到经纬度
							// APP上才有精确位置信息address，H5要用输入经纬度后用amapFile.AMapWX来获取详细地址信息
							var myAmapFun = new amapFile.AMapWX({ key: uni.$config.AmapKey })
							myAmapFun.getRegeo({
								location: '' + res.longitude + ',' + res.latitude + '',
								success: (data) => {
									dispatch('__delLocationMsg', { resolve:resolve, reject:reject, data:data[0].regeocodeData, latitude:res.latitude, longitude:res.longitude })
								},
								fail: (err) => {
									// 失败回调
									reject(err)
									console.log('AMapWX--err:',err);
								}
							});
							// #endif
						}
					},
					fail: (err) => {
						// 如果点击了拒绝
						if (err.errMsg&&err.errMsg.indexOf('获取定位权限失败') != -1) {
							uni.setStorageSync('getLocationFail', true)//如果点击了取消，则再次进来时，就不主动请求获取权限
						}
						reject(err)
						console.log('getLocation--err:',err);//{"errMsg":"getLocation:fail 获取定位权限失败","errCode":22,"code":22}
					}
				})
			}
		})
	},
	
	// 统一setLocation的参数，commit('setLocation', locationData)
	__delLocationMsg:debounce(({commit},parmas)=>{
		let locationData = {
			lat:parmas.latitude,
			lng:parmas.longitude,
			region:'定位中',
			addressDetail:'',
			city:'',
			district:'',
			province:''
		}
		let data = parmas?.data
		// H5端,如果map.vue进来
		if (parmas.isTxMapKey) {
			locationData.city = data?.cityname
			locationData.district = data?.poiname
			locationData.addressDetail = data?.poiaddress + data?.poiname
			locationData.region = data?.cityname || data?.poiname // 有地区显示地区，没地区就显示城市，再没城市就显示省份
		}else{
			// #ifndef APP-PLUS
			locationData.city = data?.addressComponent?.city
			locationData.district = data?.addressComponent?.district
			locationData.province = data?.addressComponent?.province
			locationData.addressDetail = data.formatted_address
			// #endif
			// #ifdef APP-PLUS
			if(data?.addressComponent){
				// 选择后的字段
				locationData.city = data?.addressComponent?.city
				locationData.district = data?.addressComponent?.district
				locationData.province = data?.addressComponent?.province
				locationData.addressDetail = data.formatted_address
			}else{
				//自动获取定位的字段
				locationData.city = data.address?.city
				locationData.district = data.address?.district
				locationData.province = data.address?.province
				locationData.addressDetail = data.address?.province + data.address?.city + data.address?.district + data.address?.street + data.address?.streetNum + data.address?.poiName
			}
			// #endif
			locationData.region = locationData?.city.length ? locationData.city : (locationData.province || locationData.district) // 有地区显示地区，没地区就显示城市，再没城市就显示省份
		}
		// Object.assign(locationData,res)//合并对象，或者：locationData = {...res,...locationData}
		// console.log('locationData:',locationData);
		if (parmas.resolve) {
			parmas.resolve(locationData)
		}
		// 如果是ModuleOrder/warrantyCard/warrantyCard或者ModulesUser/distributorPoints/pointActivate/pointActivate页面进来，则是用$on传值
		// if(uni.$utils.pages.getPageRoute().route.indexOf('warrantyCard') != -1||uni.$utils.pages.getPageRoute().route.indexOf('pointActivate') != -1){
		if(parmas.notSetLocation){
			uni.$emit('getLocationData', locationData);
		}else{
			commit('setLocation', locationData);
		}
	}),
	
	/** 手动定位，备注：如果config文件配置了腾讯地图的key值，H5端将不会resolve()值出来 */
	setLocation({ commit, state,dispatch },parmas) {
		return new Promise((resolve, reject) => {
			// #ifdef MP
			// 获取小程序的设置,判断是否已经开启了定位
			let locaAuth = '';
			uni.getSetting({
				success: res => {
					// console.log(res);
					locaAuth = res.authSetting['scope.userLocation'];
				},
				complete: () => {
					if (!locaAuth) {
						/* 如果地理位置没授权 */
						uni.showModal({
							title: '定位失败',
							content: '检测到您未打开地理位置权限，是否前往开启',
							confirmText: '前往开启',
							cancelText: '手动定位',
							success: res => {
								if (res.confirm) {
									// 地理位置权限
									uni.openSetting({
										success: res => {
											// console.log(res.authSetting)
										}
									});
								} else if (res.cancel) {
									// 手动定位(进入三级联动选择框，如果有做，请参考中医项目)
									uni.navigateTo({ url: `/ModuleCommon/address/changeAddr` })
								}
							}
						});
					} else {
						dispatch('__uniChooseLocation',{ resolve:resolve, reject:reject, notSetLocation:parmas?.notSetLocation||false })
					}
				}
			});
			// #endif
			
			// #ifndef MP
			dispatch('__uniChooseLocation',{ resolve:resolve, reject:reject, notSetLocation:parmas?.notSetLocation||false })
			// #endif
		})
	},
	
	async __uniChooseLocation({ commit, state,dispatch },parmas) {
		// H5端,如果config文件配置了腾讯地图的key值,则点击首页左上角的地图定位时,采用腾讯地图来定位,否则用高德地图定位
		if (uni.$config.txMapKey&&uni.$utils.getUa().isH5) {
			uni.navigateTo({ url: `/pages/index/map?notSetLocation=${parmas.notSetLocation}` });
		}else{
			// 如果是app端,则需要判断是否开启了定位
			// #ifdef APP-PLUS
			let location = await gps.getLocation()//gps.getLocation()：判断是否开启定位，如果已经开启了定位，会返回一个带经纬度的object值，如果未开启定位，会返回false值，并拉起弹框让用户去设置开启定位
			// console.log(222,location);//{ "type": "WGS84", "altitude": 0, "latitude": 23.100252, "longitude": 113.371991, "speed": 0, "accuracy": 29, "errMsg": "getLocation:ok" }
			if(location){
				dispatch('__goChooseLocation',{ resolve:parmas.resolve, reject:parmas.reject, notSetLocation:parmas.notSetLocation })
			}
			// #endif
			
			// 如果是程序端和H5,不需要判断是否开启了定位
			// #ifndef APP-PLUS
			dispatch('__goChooseLocation',{ resolve:parmas.resolve, reject:parmas.reject, notSetLocation:parmas.notSetLocation })
			// #endif
			}
	},
	
	__goChooseLocation({ commit, state,dispatch },parmas){
		uni.chooseLocation({
			success: res => {
				dispatch('__getRegeo',{resolve:parmas.resolve, reject:parmas.reject,longitude:res.longitude, latitude:res.latitude, notSetLocation:parmas.notSetLocation})
			},
			fail: err => {
				if (state.location.region == '定位中') {
					this.$navigateTo(`/ModuleCommon/address/changeAddr`); //如果这里解开的话，进入地图选点后，不选地图，点击‘取消’，会进入手动选地址页面
				}
				console.log(err);
			}
		});
	},
	
	// 根据经纬度获取当前经纬度下的地区名字
	__getRegeo({ commit, state,dispatch }, parmas){
		const myAmapFun = new amapFile.AMapWX({ key: uni.$config.AmapKey });
		myAmapFun.getRegeo({
			location: `${parmas.longitude},${parmas.latitude}`,
			success: res => {
				dispatch('__delLocationMsg', { resolve:parmas.resolve, reject:parmas.reject, data:res[0].regeocodeData, latitude:parmas.latitude, longitude:parmas.longitude, notSetLocation:parmas.notSetLocation })
			},
			fail: info => {
				// 失败回调
				uni.showToast({ title: '查找失败', duration: 2000, icon: 'none' });
				parmas.reject(false);
			}
		});
	},
	
	/* 	一、请求主题颜色。
		二、服务器上的当前时间与机器上的当前时间的时间差。
		三、获取ICP备案号以及商城名称、登录页面logo、侧边栏左上角图标等。
	 */
	getSetting({ commit,state,dispatch }){
		return new Promise((resolve, reject) => {
			const reject1 = reject// 不用一个变量来接收reject的话，下面的方法catch时会报 reject is not a function的错误
			// console.log('this:',this._vm);
			let systemConfig = {}// 【用户】获取ICP备案号以及商城名称、商城logo等
			let timeDiff = 0// 服务器上的当前时间与机器上的当前时间的时间差
			const getTime = new Date().getTime()// 记录请求接口前的时间
			let themes = state.themes// 商城主题颜色(如果接口有问题，则默认为灰色)
			setting().then((response) => {
				if (response.code && response.data) {
					if(response.data.systemConfig) systemConfig = response.data.systemConfig;
					if(response.data.serverNowDate) timeDiff = new Date().getTime() - (new Date().getTime() - getTime + response.data.serverNowDate) // 要加上服务器的请求时间
						
					const themesColor = response.data.themesColor || '#409EFF'
					const rgb = color.colorRgb(themesColor)
					themes = {
						color: themesColor,
						rgb: rgb,
						rgb01: uni.$utils.color.getHexColor(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`),
						rgb02: uni.$utils.color.getHexColor(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`),
						rgb03: uni.$utils.color.getHexColor(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`),
						rgb04: uni.$utils.color.getHexColor(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`),
						rgb05: uni.$utils.color.getHexColor(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`),
						rgb06: uni.$utils.color.getHexColor(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`),
						rgb07: uni.$utils.color.getHexColor(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7)`),
						rgb08: uni.$utils.color.getHexColor(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`),
						rgb09: uni.$utils.color.getHexColor(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9)`),
					}
					// console.log('setting:',response.data);
					resolve(response.data)
				}else{
					reject1(response)
				}
			})
			.catch((error) => {
				reject1(error)
			}).finally(() => {
				commit('setSystemConfig', systemConfig)
				commit('setTimeDiff', timeDiff)
				commit('setThemes', themes)
			})
		})
	},
	
	/* 	【商家】根据店铺id查询商家、平台微信联系方式存储表
	 */
	getContactInfo({ commit, state,dispatch },shopId){
		return new Promise((resolve, reject) => {
			const reject1 = reject// 不用一个变量来接收reject的话，下面的方法catch时会报 reject is not a function的错误
			let contactInfo = {}
			contactInformation({ shopId:shopId }).then((response) => {
				if (response.code && response.data) {
					contactInfo = response.data
					resolve(response.data)
				}else{
					reject1(response)
				}
			})
			.catch((error) => {
				reject1(error)
			}).finally(() => {
				// 有shopId是店铺，没shopId是平台
				if (!shopId) {
					commit('setContactInfo', contactInfo)
				}
			})
		})
	},
	
	/**
	 * 获取用户信息
	 * 用法:  this.$store.dispatch('getUserInfo');
	 */
	async getUserInfo({ commit }) {
		if (appToken.isLogin()) {
			let parmes = {}
			userApi.getUserInfo().then((res) => {
				if (res.code == 1) {
					parmes = res.data
				}
			}).finally((e) => {
				// 现在微信头像是后端获取，所以这段代码可以删掉
				// // 如果是第三方微信登录，缓存里才会有avatarUrl值
				// if (uni.getStorageSync('avatarUrl')) {
				// 	// 如果用户没有设置头像，并且它是第三方微信登录(此时缓存里有‘avatarUrl’值)，则取微信头像来做头像
				// 	if (!parmes.portraitPic) {
				// 		if (uni.getStorageSync('avatarUrl')) {
				// 			parmes['portraitPic'] = uni.getStorageSync('avatarUrl')
				// 			uni.removeStorageSync('avatarUrl') // 取出avatarUrl后马上清除，清除缓存里第三方微信登录时才储存的头像
				// 		}
				// 		commit('setUserInfo', parmes)
				// 	// 如果有头像，但头像是无效错误的图片，并且它是第三方微信登录(此时缓存里有‘avatarUrl’值)，则取微信头像来做头像
				// 	}else{
				// 		// console.log(444,uni.$config.photoServer + parmes.portraitPic);
				// 		uni.getImageInfo({
				// 		    src: uni.$config.photoServer + parmes.portraitPic,
				// 		    success: function (image) {
				// 		        // console.log('success',image);
				// 		        // console.log(image.height);
				// 		        // console.log(image.width);
				// 				commit('setUserInfo', parmes)
				// 		    },
				// 			// 如果头像是无效错误的图片，则取微信头像来做头像
				// 		    fail: function (err) {
				// 		        console.log('fail',err);
				// 				parmes.portraitPic = uni.getStorageSync('avatarUrl')
				// 				uni.removeStorageSync('avatarUrl') // 取出avatarUrl后马上清除，清除缓存里第三方微信登录时才储存的头像
				// 				commit('setUserInfo', parmes)
				// 		    },
				// 		});
				// 	}
				// 	// console.log(222,parmes);
				// // 否则就正常给用户资料赋值
				// }else{
					// console.log(222,parmes);
					commit('setUserInfo', parmes)
				// }
			})
		}
	},

	/**
	 * 【用户】获取移动端用户中心:[优惠券,历史足迹,消息,商品收藏,商家收藏,总收藏统计数]等的数量
	 * 用法:  this.$store.dispatch('getMyInfo');
	 */
	async getMyInfo({ commit }) {
		if (appToken.isLogin()) {
			let parmes = {}
			await userApi.userCenter().then((res) => {
				if (res.code == 1) {
					parmes = res.data
				}
			}).finally((e) => {
				// console.error(e);
			})
			commit('setMyInfo', parmes)
		}
	},
	/**
	 * 获取购物车商品数量
	 * 用法:  this.$store.dispatch('getCartNum');
	 */
	async getCartNum({ commit }) {
		if (appToken.isLogin()) {
			const res = await cartApi.cartCount();
			if (res.code == 1) {
				commit('setCartNum', res.data);
			}
		}
	},
	
	/** 分类设置
	 *  用法:  this.$store.dispatch('getCategorySet').then();
	 */
	getCategorySet({ commit, state,dispatch }){
		return new Promise((resolve, reject) => {
			dispatch('__getCategorySet',{ resolve:resolve, reject:reject })
		})
	},
	__getCategorySet:debounce(({ commit }, parmas) => {
		let data = {}
		goodCategory.getCateSetting().then(res => {
			if (res.data && res.code) {
				data = res.data
			}
			parmas.resolve(res)
		}).catch((err) => {
			parmas.reject(err) // 会报 reject is not a function的错误
		// 备注：如果这里不写finally，则外面调用的就没有finally方法
		}).finally((res) => {
			commit('setCategorySet', data)
		});
	}),
	
	// 返回上/多级页面时 刷新数据列表
	setBackRefresh({ commit }, bool) {
		commit('setBackRefresh', bool)
	},

	/** 【用户】获取随机一条app启动广告 */
	getAppStartAdv({ commit }) {
		// #ifdef APP-PLUS
		trim.appStartAdv().then(res => {
			if (res.code && res.data && res.data.imgUrl && res.data.status) {
				const parmes = {
					img:res.data.imgUrl,
					url:res.data.url,
				}
				setTimeout(() => { // 加入setTimeout是防止在index加载完后，重新刷新广告图而导致广告图闪一下
					uni.setStorageSync('appStartAdv', JSON.stringify(parmes)); // 将当前时间的时间戳放到缓存里，24时时内不会显示app登录广告
				},2000)
			}
		}).finally((res) => {
		});
		// #endif
	},

	/** 获取首页弹框广告(H5和小程序才用到) */
	getPopupAdvertRule({ commit }, parmas){
		// #ifndef APP-PLUS
		return new Promise((resolve, reject) => {
			let data = {}
			popupAdvert.queryAdvertise().then(res => {
				if (res.code) {
					data = res.data
					commit('setPopupAdvertRule', res.data || [])
					resolve(res)
				}
			}).catch((err) => {
				reject(err) // 会报 reject is not a function的错误
			// 备注：如果这里不写finally，则外面调用的就没有finally方法
			}).finally((res) => {
				
			});
		})
		// #endif
	}
}
