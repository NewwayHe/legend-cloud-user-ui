### 企业级微服务架构电商系统
- 🦾 [Legend Cloud 是一款企业级微服务架构电商系统，全面拥抱Spring全家桶，基于Spring 6.0.13 、Spring Boot 3.1.5、Spring Cloud 2022.0.4、Spring Authorization Server 1.1.3、Spring Cloud Alibaba 2022.0.0.0、Nacos 2.2.1 等主流技术栈开发的B2B2C电商系统，遵循SpringBoot 编程思想，高度模块化和可配置化。具备服务发现、配置、熔断、限流、降级、监控、多级缓存、分布式事务、等功能。 ] 

## 演示地址
- 🗂 [商城后台管理](http://mall-admin.legendmall.cn/)
- 📦 [商城商家端](http://mall-shop.legendmall.cn/)
- ⚡️ [用户H5端](http://mall.legendmall.cn/)

## 相关项目地址
- 📑 [B2C单体版地址(暂未开源,敬请期待)](https://gitee.com/legendmall/legend)
- 🍍 [前端-平台端工程地址](https://gitee.com/legendmall/legend-cloud-admin-ui)
- 🎨️ [前端-商家端工程地址](https://gitee.com/legendmall/legend-cloud-shop-ui)
- 🔥️ [前端-用户端工程地址](https://gitee.com/legendmall/legend-cloud-user-ui)

## 功能介绍
- ✅ [详情见官方网站](https://code.legendshop.cn/)

# 授权协议
本项目基于 APGL 3.0 开源协议，商业项目请联系授权，并遵守以下补充条款：
不得将本软件应用于危害国家安全、荣誉和利益的行为，不能以任何形式用于非法为目的的行为。
在延伸的代码中（修改现有源代码衍生的代码中）需要带有原来代码中的协议、版权声明和其他原作者 规定需要包含的说明（请尊重原作者的著作权，不要删除或修改文件中的Copyright和@author信息） 更不要，全局替换源代码中的 Legendshop Cloud等字样，否则你将违反本协议条款承担责任。
您若套用本软件的一些代码或功能参考，请保留源文件中的版权和作者，需要在您的软件介绍明显位置 说明出处，举例：本软件基于 Legend Cloud 微服务架构，并附带链接：https://www.legendshop.cn
任何基于本软件而产生的一切法律纠纷和责任，均于作者无关。
如果你对本软件有改进，希望可以贡献给我们，双向奔赴互相成就才是王道。
本项目已申请软件著作权，请尊重开源。

# 系统介绍
> 这是一个基于 uni-app、uView UI 实现的手机端框架/移动端框架
> 兼容H5(Web)、APP(IOS和安卓)及微信小程序等多个平台

# 主要前端技术点
1.框架--uni-app,vuex
2.第三方请求库--axios
3.UI框架--uView
4.阿里图标库
5.外部化配置--copy-webpack-plugin
5.canvas绘图工具--l-painter

# 特性
1、支持 Android，iOS，H5，微信小程序，等其它小程序平台。
2、贴心的表单组件封装，完美与后端结合。
3、uView 提供 60+ 精选组件，功能丰富，多端兼容，让您快速集成，开箱即用。
4、众多贴心的 JS 利器，让您飞镖在手，召之即来，百步穿杨。
5、众多的常用页面和布局，让您专注逻辑，事半功倍。
6、合理使用 style 的 scoped 减少包体积大小。
7、按需引入，精简打包体积。
8、移动端完整开源。

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 快速运行
1、下载并安装：集成开发环境 HBuilderX （推荐，也可以使用 VSCode 或 WebStorm）
2、菜单：文件 -> 导入 -> 从本地目录导入
3、菜单：运行 -> 运行到内置浏览器（或运行到浏览器 -> Chrome 浏览器）。
4、等待 HBuliderX 控制台编译。

## 其它

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix

```

# 代码目录结构
┌── api  // api接口统一模块管理
│   ├── ModuleBase.js 		// 基础模块api
│   ├── ModuleCenter.js		// 个人中心模块api
│   ├── ModuleGoods.js		// 商品管理模块api
│   ├── ModulesCommon.js	// 通用模块api
│   ├── ModuleShop.js		// 店铺模块api
│   ├── ModulesOrder.js		// 订单模块api
│   └── ModulesUser.js		// 用户模块api
├── components              组件目录
│   ├── common 				// 业务组件
│   ├── floor				// 装修组件
│   ├── goods				// 商品详情页面组件
│   ├── l-painter			// canvas绘图工具
│   ├── ls-app				// 自写的通用组件
│   ├── submit-order		// 提交订单页面组件
│   ├── uni-app				// uni-app官方组件
│   └── uview-ui			// UI框架
├── config  // 配置文件
│   ├── index.js	 // 本地调试环境的服务器的配置
│   └── serviceConfig.js	 // 线上生产环境的服务器的配置
├── filters
│   └── filters.js	 // 统一封装的filters方法
├── libs
│   ├── json-gps	 // H5端腾讯定位专用
│   ├── amap-wx	 // H5端高德定位专用
│   └── jsencrypt.min.js	 // 加密js
├── mixins // 混入
│   ├── floor.js	 // 统一的首页或店铺装修楼层跳转方法
│   └── login.js	 // 统一的第三方登录的方法
├── ModuleCenter	 // 个人中心模块
├── ModuleCommon	 // 通用模块
├── ModuleGoods	 // 商品模块
├── ModulesUser	 // 用户模块
├── pages	 // tabBar页面文件存放的目录
│   ├── cart		 // 购物车
│   ├── category	 // 分类
│   ├── index	 	 // 首页
│   ├── my			// 个人中心
│   └── webview	 	// web-view外部链接
├── public  // 公共文件夹，此文件夹不会打包压缩
│   ├── favicon.ico	 // web端网站图标
│   └── index.html	// web端应用的入口 HTML 文件
├── libs
│   ├── oauth.js	 // 统一封装的登录相关的方法
│   ├── payTo.js	 // 统一封装的支付相关的方法
│   └── share.js	 // 统一封装的第三方分享的方法
├── static	// 静态资源文件，如图片、字体等
│   ├── css			 // 公共css
│   ├── cssImage	 // 纯CSS动画
│   ├── fonts		 // 阿里图标库
│   └── images		 // 本地图片
├── store // vuex的状态控制文件夹
│   ├── actions		// 定义方法
│   ├── state.js	// 定义变量
│   └── index.js	// 状态变量文件
├── utils // 工具类组件
│   ├── Cache.js		// 统一的登录相关的js
│   ├── checkInfo.js	// 统一封装的正则效验方法
│   ├── encryption.js	// 加密相关js
│   ├── moment.js		// 时间相关js
│   ├── encryption.js	// 加密
│   ├── mtj-wx-sdk.js	// 百度统计
│   ├── pageUtils.js	// 统一封装的分页js
│   ├── request.js		// 接口统一js
│   ├── stringUtils.js	// 处理string的js方法
│   ├── arrayUtils.js	// 处理array的js方法
│   ├── socket2.js		// 客服相关的方法
│   ├── uploader.js		// 统一封装的上传图片的方法
│   └── utils.js	 // 本项目大部分的工具类js写在这个文件里
├── .eslintignore 	 // eslint忽略文件
├── .eslintrc	 	 // eslint代码效验规则
├── .gitignore		 // Git 忽略文件配置
├── .prettierignore  // pretti忽略文件
├── .prettierrc	 	 // pretti代码效验规则
├── androidPrivacy	 // 服务协议和隐私政策(安卓APP专用)
├── App.vue          // 应用配置，用来配置App全局样式以及监听 应用生命周期
├── main.js          // Vue初始化入口文件
├── manifest.json    // 配置应用名称、appid、logo、版本等打包信息，详见
├── package.json	 // 项目配置和依赖
├── pages.json       // 配置页
├── README.md	 	 // 项目说明文件
├── uni.scss		 // uni-app内置的常用样式变量
└── vue.config.js	 // Vue CLI 配置文件(外部化配置专用)

```

