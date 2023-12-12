
export const defaultData = {
	//底部导航栏设置
	tabbar: {
		// backgroundColor: 'rgba(224,38,124,.2)', // 整条导航条背景颜色
		backgroundColor: '#ffffff', // 整条导航条背景颜色
		backgroundImg:'',//图景图
		borderTopColor: 'rgba(0,0,0,0.05)', //tabBar上边框的颜色(midButData.type=4时无效)
		color: '#333333', //字体图标颜色
		themeColor:true, //字体图标选中颜色采用主题色(这时selectedColor值无效)
		selectedColor: '', //字体图标选中颜色
		fontSize: 25, //字体图标字号
		hideText:false,//隐藏文字
		animate:'none',//动画效果，zoomIn(放大)，bounce(弹跳)，rubberBand(橡皮)，fadeIn(闪烁)
		showMidButton: false,//开启‘中间按钮’
		midButData: {//showMidButton=true时才生效
			type: 1, // 中间按钮样式，1，直条，2，凸圆，3，凸圆带边框，4、凹圆
			size:'medium',//big / small / medium
			img: '',
			iconfont: 'iconjiahao2', //字体图标，优先级高于 img
			isIconfont:true,//true(字体图标)：采用iconfont，false(图片路径)：采用iconPath
			color: '#333333', //字体图标颜色(isIconfont==true时有效)
			themeColor:true, //字体图标选中颜色采用主题色(这时color值无效)
			// 中间按钮
			showMidBtn: true, //启用popover弹窗,showMidBtn=true时下面的url失效
			url: {},
			list: [
				{ img: '', url: {} },
			]
		},
		list: [
			{
				text: '首页', //tab 上的按钮文字
				visible: true, //该项是否显示
				iconPath: '', //图片路径
				selectedIconPath: '', //选中时的图片路径
				url: { id: 'index', name: '首页', type: '常用功能' }, //页面路径
				iconfont: 'icon-shouye1', //字体图标
				selectedIconfont: 'icon-shouye' ,//选中时的字体图标
				isIconfont:true,//true(字体图标)：采用iconfont、selectedIconfont，false(图片路径)：采用iconPath，selectedIconPath
			},
			{
				text: '分类', //tab 上的按钮文字
				visible: true, //该项是否显示
				iconPath: '', //图片路径
				selectedIconPath: '', //选中时的图片路径
				url: { id: 'category', name: '商品类目', type: '常用功能' }, //页面路径
				iconfont: 'icon-fenlei3', //字体图标
				selectedIconfont: 'icon-fenlei' ,//选中时的字体图标
				isIconfont:true,//true(字体图标)：采用iconfont、selectedIconfont，false(图片路径)：采用iconPath，selectedIconPath
			},
			{
				text: '购物车', //tab 上的按钮文字
				visible: true, //该项是否显示
				iconPath: '', //图片路径
				selectedIconPath: '', //选中时的图片路径
				url: { id: 'cart', name: '购物车', type: '常用功能' }, //页面路径
				iconfont: 'icon-gouwuche', //字体图标
				selectedIconfont: 'icon-gouwuche2' ,//选中时的字体图标
				isIconfont:true,//true(字体图标)：采用iconfont、selectedIconfont，false(图片路径)：采用iconPath，selectedIconPath
			},
			{
				text: '个人中心', //tab 上的按钮文字
				visible: true, //该项是否显示
				iconPath: '', //图片路径
				selectedIconPath: '', //选中时的图片路径
				url: { id: 'my', name: '个人中心', type: '常用功能' }, //页面路径
				iconfont: 'icon-yonghu', //字体图标
				selectedIconfont: 'icon-usergr' ,//选中时的字体图标
				isIconfont:true,//true(字体图标)：采用iconfont、selectedIconfont，false(图片路径)：采用iconPath，selectedIconPath
			}
		]
	},
}
