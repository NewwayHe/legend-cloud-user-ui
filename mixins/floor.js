const floorMixin = {
	data() {
		return {}
	},
	methods: {
		// 楼层装修的页面跳转
		jumpPage(params, shopId) {
			uni.$u.throttle(() => {
				console.log('jumpPage-params:', params)
				if (!params) return
				if (params.type == '商品') {
					if (params.skuType) {
						// 去活动商品详情
						uni.navigateTo({
							url: `/ModuleGoods/goodsDetail/goodsDetail?id=${params.productId}&activityId=${params.id}&skuType=${params.skuType}&skuId=${params.skuId}`
						});
					}else{
						// 去商品详情
						uni.navigateTo({
							url: `/ModuleGoods/goodsDetail/goodsDetail?id=${params.id}`
						})
					}
				}
				if (params.type == '商品分组') {
					// 商品分组
					uni.navigateTo({
						url: `/ModuleGoods/search/prodGroupList?id=${params.id}`,
						fail(e) {
							uni.showToast({
								title: '此页面正在开发中！',
								duration: 2000,
								icon: 'none'
							})
						}
					})
				}
				if (params.type == '商品分类') {
					// 去商品分类
					const id = params.id && params.id.length ? params.id[params.id.length - 1] : ''
					uni.navigateTo({
						url: `/ModuleGoods/search/searchList?categoryId=${id}`
					})
				}
				if (params.type == '分类') {
					// 店铺装修专用(商城首页装修是叫“商品分类”)
					// 去搜索页面
					const shopCategoryId = params.id && params.id.length && params.id[params.id.length - 1] // 店铺分类ID
					uni.navigateTo({
						url: `/ModuleGoods/search/searchList?shopId=${shopId}&shopCategoryId=${shopCategoryId || ''}`,
						fail(e) {
							uni.showToast({
								title: '此页面正在开发中！',
								duration: 2000,
								icon: 'none'
							})
						}
					})
				}

				if (params.type == '海报页') {
					// 去海报页
					uni.navigateTo({
						url: `/ModuleCommon/poster/poster?pageId=${params.id}&shopId=${shopId}`,
						fail(e) {
							uni.showToast({
								title: '此页面正在开发中！',
								duration: 2000,
								icon: 'none'
							})
						}
					})
				}
				if (params.type == '常用功能') {
					if (
						params.name == '首页' ||
						params.name == '商品类目' ||
						params.name == '商品品牌' ||
						params.name == '购物车' ||
						params.name == '个人中心'
					) {
						const status = {
							首页: '/pages/index/index',
							商品类目: '/pages/category/category',
							商品品牌: '/pages/category/category',
							购物车: '/pages/cart/cart',
							个人中心: '/pages/my/my',
						}
						// 使用switchTab不支持传参 所以要使用storage来存取
						const options = {
							商品品牌: { isBrand: true },
						}
						try {
						    uni.setStorageSync('floors-switch-option', options[params.name]);
						} catch (e) {
							console.error('floors存储tabbar参数失败')
						}
						uni.switchTab({
							url: status[params.name],
							fail(e) {
								uni.showToast({
									title: '此页面正在开发中！',
									duration: 2000,
									icon: 'none'
								})
							}
						})
					} else {
						const status = {
							'我的收藏': '/ModuleCenter/collection/collection',
							我的消息: '/ModuleCenter/message/message',
							'我的足迹': '/ModuleCenter/history/history',
							'预存款':'/ModuleCenter/wallet/preDeposit',		// UI改造后的页面[本质就是钱包页面]
							// '红包':'/ModuleCenter/myRed/myRed',
							优惠券: '/ModuleCenter/coupon/couponList',
							我的评论: '/ModuleCenter/evaluate/evaluateList',
							常见问题: '/ModuleCenter/question/help',
							意见反馈: '/ModuleCenter/feedback/feedback',
							我的问答: '/ModuleCenter/consult/consultMy',
							联系客服: '/ModuleCenter/contact/contact',
							我的发票: '/ModuleCenter/invoice/invoice',
							我的账单: '/ModuleCenter/billDetail/billDetail',
						}
						// 积分签到打开才能进
						if (params.name == '联系客服') {
							if (!this.$store.state.contactInfo || !this.$store.state.contactInfo.openFlag) {
								uni.showToast({
									title: '平台已关闭了客服设置！',
									duration: 2000,
									icon: 'none'
								})
								return
							}
						}
						uni.navigateTo({
							url: status[params.name],
							fail(e) {
								uni.showToast({
									title: '此页面正在开发中！',
									duration: 2000,
									icon: 'none'
								})
							}
						})
					}
				}
				if (params.type == '自定义') {
					// 自定义url
					const url = params.url
					if (url.startsWith('http')) {
						// #ifdef H5
						window.location.href = url
						// #endif
						// #ifndef H5
						uni.navigateTo({ url: `/pages/webview/webview?url=${encodeURIComponent(url)}` })
						// #endif
					} else if (url == '#') {
						// uni.showToast({ title: '该功能暂未上线, 敬请期待~', icon: 'none' })
					// 如果是跳内链
					} else {
						let realUrl = url
						// 如果没有‘/’，则加上/
						if (!url.startsWith('/')) {
							realUrl = '/' + url
						}
						// 要用startsWith，用indexOf('/pages/') != -1，直翻间的链接中间也会带有/pages/字眼的
						if (realUrl.startsWith('/pages/')) {
							uni.switchTab({ url:realUrl })
						}else{
							uni.navigateTo({
								url: realUrl,
								fail(e) {
									// uni.showToast({ title: '该链接无效！', duration: 2000, icon: 'none' })
								}
							})
						}
					}
				}
			});
		}
	}
}

export default floorMixin
