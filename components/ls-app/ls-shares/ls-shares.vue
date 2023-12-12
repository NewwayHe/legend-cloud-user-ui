<template>
	<view :style="{ '--themescolor': themes.color, '--haibaowidth': haibaoWidth, '--haibaoheight': haibaoHeight }" :class="[className]">
		<!-- 分享按钮 -->
		<view
			:class="[{ 'button-fixed': buttonFixed }]"
			:style="{ '--fixedbottom': fixedBottom, '--fixedright': fixedRight, '--zindex': Number(zIndex - 1) }"
			style=""
			v-if="shareButton || buttonFixed"
			@click="changePopup"
		>
			<view class="flex-center rounded-circle overflow-h" :style="{ background: bgColor, height: buttonSize + 'rpx', width: buttonSize + 'rpx' }">
				<text class="iconfont icon-fenxiang-2" :style="{ color: '#fff', fontSize: buttonSize - 30 + 'rpx' }"></text>
			</view>
		</view>
		<!-- popup弹窗 -->
		<u-popup v-model="shareFlag" border-radius="28" safe-area-inset-bottom closeable>
			<view class="w-100 overflow-h">
				<view class="w-100 h-88r bg-white flex-center font-32 border-bottom letter-sp10"><text>分享</text></view>
				<scroll-view class="bg-white" scroll-y style="max-height: 1000rpx" @click.stop>
					<!-- #ifdef APP-PLUS -->
					<view class="flex-center pt-4 pb-6">
						<template v-if="appServices && appServices.length">
							<view class="flex-1 font-20 flex-col-center" @click="appShares(item.provider)" v-for="(item, index) in appServices" :key="index">
								<u-icon :name="item.name" :color="item.color" label-pos="bottom" size="110" label-size="24" :label="item.description"></u-icon>
							</view>
						</template>
						<view class="flex-1 font-20 flex-col-center" @click="appShares('systemShare')">
							<u-icon name="IE-circle-fill" color="#4d89d7" label-pos="bottom" size="110" label-size="24" label="更多分享"></u-icon>
						</view>
					</view>
					<!-- #endif -->

					<!-- #ifdef MP -->
					<view style="min-height: 280rpx">
						<view class="px-3 text-999 font-24 mt-3" v-if="type == 'goods'">你的朋友可以通过你分享的页面,查看此商品</view>
						<view class="px-3 text-999 font-24 mt-3" v-else>你的朋友可以通过此处分享的页面，查看你要分享的内容</view>
						<view class="flex-center">
							<view class="flex-1 py-3 flex-col-center">
								<button class="w-100 flex-col-center" open-type="share" plain="true" style="border: none">
									<u-icon name="weixin-circle-fill" color="#50b038" label-pos="bottom" size="110" label-size="24" margin-top="10" label="分享好友"></u-icon>
								</button>
							</view>
							<view class="flex-1 py-3 flex-col-center" v-if="type == 'goods'" @click="eventDraw">
								<u-icon name="moments-circel-fill" color="#f7c651" label-pos="bottom" size="110" label-size="24" margin-top="10" label="海报分享"></u-icon>
							</view>
						</view>
					</view>
					<!-- #endif -->
				</scroll-view>
			</view>
		</u-popup>

		<!-- #ifndef APP-PLUS -->
		<u-popup v-model="showHaibao" border-radius="28" mode="center" safe-area-inset-bottom closeable @open="painterOpen">
			<view :style="{ width: `${haibaoWidth}rpx` }" @click.stop="previewqrTapHaibao(shareImg)">
				<!-- #ifdef MP -->
				<image class="w-100" :src="shareImg" :style="{ height: `${haibaoHeight}rpx` }" @click.stop="previewqrTapHaibao(shareImg)" />
				<!-- 解决ios无法生成海报问题 不能隐藏canvas 暂时查到只能用left: -9999999999 -->
				<!-- <view class="w-0 h-0 overflow-h position-fixed" style="left: -9999px;"> -->
					<!-- <l-painter :width="`${haibaoWidth}rpx`" :height="`${haibaoHeight}rpx`" :board="haiBaoData" isRenderImage @success="shareImg = $event" /> -->
					<LimePainter v-if="isPainterOk" :board="haiBaoData" isCanvasToTempFilePath @success="shareImg = $event" customStyle="position: fixed; left: 200%;"></LimePainter>
				<!-- </view> -->
				<view class="h-80r bg-main text-white flex-center font-32 w-100" @click.stop="eventSave">保存图片</view>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<!-- <l-painter :width="`${haibaoWidth}rpx`" :height="`${haibaoHeight}rpx`" :board="haiBaoData" isRenderImage isH5PathToBase64 @success="shareImg = $event" /> -->
				<LimePainter :board="haiBaoData" isCanvasToTempFilePath @success="shareImg = $event"> </LimePainter>
				<view class="h-80r bg-main text-white flex-center font-32 w-100" @click.stop="doCopy">复制链接</view>
				<!-- #endif -->
			</view>
		</u-popup>
		<!-- #endif -->
	</view>
</template>

<script>
import { mapState } from 'vuex';
import shareService from '@/service/share.js';
// import lPainter from '@/components/l-painter';
// 官方文档说 画板不要隐藏 也不要把画板放弹窗里 但是真机H5调试没问题 小程序端已适配[6.15]
import LimePainter from '@/components/l-painter-new/l-painter/l-painter.vue';
import { miniWxApi } from '@/api/ModuleBase.js';
export default {
	name: 'ls-shares',
	// #ifdef MP-WEIXIN
	// 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性。这时在<组件name> 里加style和class是不会生效的
	options: { virtualHost: true },
	// #endif
	components: {
		// 'l-painter': lPainter,
		LimePainter,
	},
	props: {
		className:{
			type: [String, Array,Boolean],//这里加个Boolean，是因为如果传className=""，小程序端会报错
			default: ''
		},
		bgColor: {
			type: String,
			default: 'var(--themescolor)'
		},
		type: {
			type: String,
			default: 'goods' // 类型，默认是:goods:商品(含活动商品)分享
		},
		// #ifdef MP-WEIXIN
		mpShareCode: {
			type: Object,
			default:{}
		},
		// #endif

		// #ifdef H5
		shareinfos: {
			type: Object,
			default: () => {
				shareTitle = '';
				shareUrlParmas = {}; // this.shareUrl后面拼接的参数(个人中心才会传这个值)
				shareContent = '多用户商城系统，多种运营模式,邀请你一起体验！';
				sharePictures = ''; // 注意，如果不是接收数组，而是接收数组里的第一张图片的话，会报property '0' of undefind的错误(除非在渲染前遍历一次组得，不然会得不到sharePictures[0]这个)
				id = ''; // 商品分享 小程序海报请求接口专用
				cash = ''; // 商品分享 海报绘制专用
				price = ''; // 商品分享 海报绘制专用
			}
		},
		// #endif

		// #ifndef H5
		shareinfos: {
			type: Object,
			default: {
				shareTitle: '', //注意，这里不能用this.*****，小程序的props里没有this
				shareUrlParmas: {}, // this.shareUrl后面拼接的参数(个人中心才会传这个值)
				shareContent: '多用户商城系统，多种运营模式,邀请你一起体验！',
				sharePictures: '', // 注意，如果不是接收数组，而是接收数组里的第一张图片的话，会报property '0' of undefind的错误(除非在渲染前遍历一次组得，不然会得不到sharePictures[0]这个)
				id: '', // 商品分享 小程序海报请求接口专用
				cash: '', // 商品分享 海报绘制专用
				price: '', // 商品分享 海报绘制专用
			}
		},
		// #endif
		shareButton: {
			// 是否显示分享按钮,如果不显示分享按钮，则父组件要用 this.$refs.sharePopup.changePopup()来开关popup窗口
			type: Boolean,
			default: false
		},
		buttonSize: {
			//当buttonFixed或shareButton为true时，按钮的大小，单位rpx
			type: [Number, String],
			default: 70
		},
		buttonFixed: {
			// 是否position-fixed
			type: Boolean,
			default: false
		},
		fixedRight: {
			//当buttonFixed为true时，控制靠右定位，单位rpx
			type: [Number, String],
			default: 10
		},
		fixedBottom: {
			//当buttonFixed为true时，控制靠下定位，单位rpx
			type: [Number, String],
			default: 100
		},
		zIndex: {
			//当buttonFixed为true时，控制靠下定位，单位rpx
			type: [Number, String],
			default: 9999
		}
	},
	data() {
		return {
			shareFlag: false,
			haiBaoData: {}, // 图文海报数据
			haibaoWidth: 550, //海报的宽，单位rpx
			haibaoHeight: 900, //海报的高，单位rpx
			showHaibao: false,
			shareImg: '', // 海报图片
			miniCode:'',
			//app端获取manifest.json里的分享设置数组
			appServices:
				[
					{
						id:'qq',
						description:'QQ好友',
						color:'#5d9bdd',
						name:'qq-circle-fill',
						provider:'qq',
					},
					{
						id:'weixin',
						description:'微信好友',
						color:'#50b038',
						name:'weixin-circle-fill',
						provider:'weixin'
					},
					{
						id:'weixin',
						description:'朋友圈',
						color:'#92cc23',
						name:'moments-circel-fill',
						provider:'weixinPY'
					},
					{
						id:'sinaweibo',
						description:'微博',
						color:'#e75252',
						name:'weibo-circle-fill',
						provider:'sinaweibo'
					},
				],
			isPainterOk: false,
		};
	},
	watch: {
		// #ifdef MP-WEIXIN
		mpShareCode: {
			handler(newVal) {
				if(this.$checkInfo([{ type: 'hasValue', value: newVal }])&&newVal.scene&&newVal.scene.productId){
					console.log('mpShareCode',newVal);
					miniWxApi.getMiniQrCode(newVal).then(async res => {
						if(res.code){
							this.miniCode = await this.$utils.image.base64ToPath(res.data)
						}
					})
				}
			},
			immediate:true,
			deep: true
		}
		// #endif

	},
	computed: {
		...mapState(['userInfo','systemConfig']),
		sharePicturesTemp() { //统一处理分享的图片
			let pic = ''
			let sharePic = ''
			if (this.$u.test.array(this.shareinfos.sharePictures)) { //如果传进来的是数组，则取第一张图
				sharePic = this.shareinfos.sharePictures && this.shareinfos.sharePictures.length ? this.shareinfos.sharePictures[0] :
					''
			} else {
				sharePic = this.shareinfos.sharePictures
			}
			// #ifdef MP
			pic = sharePic ? ((sharePic.startsWith('http') ? '' : this.photoServer) + sharePic) : (this.staticServer +
				'static/images/default-img.png')
			// #endif
			// #ifdef H5||APP-PLUS
			pic = sharePic ? ((sharePic.startsWith('http') ? '' : this.photoServer) + sharePic) : require(
				'@/static/images/defalut-img/default-img.png')
			// #endif
			if (pic.indexOf('dev6.0//dev6.0') != -1) { //此判断是为了兼容旧数据
				pic = pic.replace('dev6.0//dev6.0', 'dev6.0')
			}
			return pic
		},
		shareUrl() { //分享的链接
			let url = ''
			let pageRoute = this.$utils.pages.getPageRoute()
			url = '/' + (this.type=='goods'?'ModuleGoods/goodsDetail/goodsDetail':pageRoute.route) + this.$u.queryParams({ ...pageRoute.options,...this.shareinfos.shareUrlParmas});
			return url
		},
		haiBaoPic(){
			console.log('shareinfos:', this.shareinfos);
			let headerPic = ''//分享头像
			// 如果有用户头像
			if (this.userInfo.portraitPic) {
				headerPic = (this.userInfo.portraitPic.startsWith('http') ? '' : this.photoServer)  + this.userInfo.portraitPic
			//如果没用户头像，就取平台设置的默认logo
			}else if(this.systemConfig&&this.systemConfig.logo){
				headerPic =  this.photoServer + this.systemConfig.logo
			//如果没用户头像，平台也没设置默认logo，就用静态资源服务器上的默认人头像
			}else{
				headerPic =  this.staticServer + 'static/images/certification-icon.png'
			}
			return {
				css: {
					width: `${this.haibaoWidth}rpx`,
					height: `${this.haibaoHeight}rpx`,
					borderRadius: '16rpx',
					background: '#fff',
				},
				views: [{
						type: 'image',
						mode:'aspectFill',//aspectFill：缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来；aspectFit：缩放模式，保持纵横比缩放图片，使图片的长边能完全显示出来
						src: headerPic,
						css: {
							position: 'absolute',
							left: '20rpx',
							top: '20rpx',
							width: '80rpx',
							height: '80rpx',
							radius: '40rpx',
							background: this.themes.color,
						}
					},
					{
						type: 'text',
						text: this.userInfo && this.userInfo.nickName ? this.userInfo.nickName : '匿名',
						css: {
							position: 'absolute',
							width: '410rpx',
							color: '#333',
							left: '120rpx',
							top: '20rpx',
							fontSize: '26rpx',
							// maxLines: 1,
							lineClamp: 1,
							textAlign: 'left'
						}
					},
					{
						type: 'text',
						text: `${this.shareinfos.suggestion || '为你挑选了一个好物'}`,
						css: {
							position: 'absolute',
							width: '200px',
							color: '#999',
							left: '120rpx',
							top: '60rpx',
							fontSize: '24rpx',
							// maxLines: 1,
							textAlign: 'left',
							// lineClamp: 1,
							lineClamp: 1,
						}
					},
					{
						type: 'image',
						mode:'aspectFill',//aspectFill：缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来；aspectFit：缩放模式，保持纵横比缩放图片，使图片的长边能完全显示出来
						src: this.sharePicturesTemp,
						css: {
							position: 'absolute',
							left: '60rpx',
							top: '140rpx',
							width: '430rpx',
							height: '430rpx',
							radius: '12rpx'
						}
					},
					{
						type: 'text',
						text: this.shareinfos.shareTitle,
						css: {
							position: 'absolute',
							width: '510rpx',
							color: '#333',
							left: '20rpx',
							top: '580rpx',
							fontSize: '24rpx',
							// maxLines: 2,
							lineClamp: 2,
							lineHeight: '37rpx',
							textAlign: 'left',
							fontWeight: 'bold'
						}
					},
					{
						type: 'text',
						text: `${
						this.shareinfos.skuType == 'MERGE' ? '拼团价：' : this.shareinfos.skuType == 'GROUP' ? '团购价' : this.shareinfos.skuType == 'SECKILL' ? '秒杀价' : this.shareinfos.skuType == 'PRESELL'?'预售价':'' }${this.shareinfos.cash ? '￥' + Number(this.shareinfos.cash).toFixed(2) : ''}`,
						css: {
							position: 'absolute',
							color: this.themes.color,
							left: '25rpx',
							top: '670rpx',
							fontSize: '36rpx',
							fontWeight: 'bold',
							textAlign: 'left'
						}
					},
					{
						type: 'text',
						text: `${this.shareinfos.price ? '原价：￥' + Number(this.shareinfos.price).toFixed(2) : ''}`,
						css: {
							position: 'absolute',
							color: '#999',
							left: '25rpx',
							top: '720rpx',
							fontSize: '24rpx',
							lineHeight: '24rpx',
							// maxLines: 2,
							lineClamp: 2,
							textDecoration: 'line-through',
							textAlign: 'left'
						}
					},
					{
						type: 'text',
						// #ifdef H5
						text: '单击放大后长按保存图片',
						// #endif
						// #ifdef MP
						text: '长按识别小程序码',
						// #endif
						css: {
							position: 'absolute',
							color: '#999',
							left: '25rpx',
							top: '780rpx',
							fontSize: '24rpx',
							// maxLines: 1,
							lineClamp: 2,
							textAlign: 'left'
						}
					},
					{
						// #ifdef H5
						type: 'qrcode',
						text: this.$config.shareUrl + this.shareUrl,
						css: {
							position: 'absolute',
							left: '380rpx',
							top: '680rpx',
							width: '150rpx',
							height: '150rpx',
							color: '#000',
						}
						// #endif
						// #ifdef MP
						type: 'image',
						src: this.miniCode,
						css: {
							position: 'absolute',
							left: '380rpx',
							top: '680rpx',
							width: '150rpx',
							height: '150rpx',
							color: '#000'
						}
						// #endif
					}
				]
			};
		},


	},
	created() {


	},
	mounted() {
		// #ifdef APP-PLUS
		// 获取manifest.json里的分享设置(备注：该getProvider方法只有打包后才显示正确的服务供应商，本地手机app基座调试时，是显示所有服务商的)
		uni.getProvider({
		    service: 'share',
		    success: (res)=> {
		        console.log('provider:',res.provider)//["sinaweibo","qq","weixin"] 
				let list = []
				if(res.provider&&res.provider.length){
					res.provider.forEach(item=>{
						let arr = this.appServices.filter(ele=>{return ele.id==item})
						if (arr&&arr.length) {
							list = list.concat(arr)
						}
					})
				}
				this.$set(this,'appServices',list)

		    }
		});
		// #endif
	},
	methods: {
		success(data) {
			// console.log('shareImg：',data)
			// this.shareImg = data;
		},
		/**
		 * 点击分享图标
		 */
		changePopup() {
			this.shareFlag = !this.shareFlag;
			this.$emit('change', this.shareFlag);
			// #ifdef H5
			this.eventDraw();
			// #endif
		},

		// #ifdef APP-PLUS
		async appShares(provider) {
			let sendPic = await this.setImage(this.sharePicturesTemp); // 压缩图片
			this.runShareService(provider, sendPic);//用H5+的api来实现的(须要引入@/service/share.js)
			// this.uniShares(provider, sendPic)//调用官方uni.share来实现的(不须要引入@/service/share.js)
		},
		// 第三方分享(只有app端才显示),这个是用H5+的api，须要引入@/service/share.js
		runShareService(provider, sendPic) {
			let msg = {};
			const shareHref = this.$config.shareUrl + this.shareUrl;
			if (provider == 'qq') {
				msg = {
					type: uni.getSystemInfoSync().platform === 'ios' ? 'text' : 'image', // 安卓text的话不会有缩略图，web的话会报参数错误,IOS当type: 'image'时只会发送一个图片(不能点击链接)，IOS该值为text才会显示图文缩略图
					title: this.shareinfos.shareTitle||(this.systemConfig&&this.systemConfig.domainName ? this.systemConfig.domainName : ''), // 分享消息的标题----微信必填，QQ必填(最长30个字符)
					href: shareHref, // 分享独立的链接----微信、微博必填，QQ安卓端(IOS端非必填)必填
					content: this.shareinfos.shareContent, // 分享消息的文字内容----微信必填
					pictures: [sendPic],
					thumbs: [sendPic] // 分享消息的缩略图----微信必填
				};
			}
			if (provider == 'weixin') {
				msg = {
					type: 'web',
					href: shareHref, // 分享独立的链接----微信、微博必填，QQ安卓端(IOS端非必填)必填
					title: this.shareinfos.shareTitle||(this.systemConfig&&this.systemConfig.domainName ? this.systemConfig.domainName : ''), // 分享消息的标题----微信必填，QQ必填(最长30个字符)
					content: this.shareinfos.shareContent, // 分享消息的文字内容----微信必填
					thumbs: [sendPic], // 分享消息的缩略图----微信必填
					extra: {
						scene: 'WXSceneSession'//分享到聊天界面
					}
				};
			}
			if (provider == 'weixinPY') {
				provider = 'weixin'; // 只能传weixin过去，传weixinPY的话会报错
				msg = {
					type: 'web',
					href: shareHref, // 分享独立的链接----微信、微博必填，QQ安卓端(IOS端非必填)必填
					title: this.shareinfos.shareTitle||(this.systemConfig&&this.systemConfig.domainName ? this.systemConfig.domainName : ''), // 分享消息的标题----微信必填，QQ必填(最长30个字符)
					content: this.shareinfos.shareContent, // 分享消息的文字内容----微信必填
					thumbs: [sendPic] ,// 分享消息的缩略图----微信必填
					extra: {
						scene: 'WXSceneTimeline'// 分享到朋友圈
					} 
				};
			}
			if (provider == 'sinaweibo') {
				// 微博只能接这几个参数，传错参数的话会报错。type：image的话会报错，暂不知为什么不能传image
				msg = {
					type: 'web',
					href: shareHref, // 分享独立的链接----微信、微博必填，QQ安卓端(IOS端非必填)必填
					content: this.shareinfos.shareContent // 分享消息的文字内容----微信必填
				};
			}
			if (provider == 'systemShare') {
				// 调用系统分享
				msg = {
					type: 'web',
					content: this.shareinfos.shareTitle||(this.systemConfig&&this.systemConfig.domainName ? this.systemConfig.domainName : ''), // 分享消息的文字内容
					href: shareHref // 分享独立的链接-
				};
			}

			shareService.shareWeb(provider, msg).then(res => {
				if (res.success) {
					// 如果分享成功
					this.changePopup();
					if (res.msg) {
						// 因为微信及系统分享不toast，所以要先判断
						uni.showToast({
							title: res.msg,
							duration: 2000
						});
					}
				} else {
					// 如果分享不成功
					console.log('false' + res.msg);
					uni.showToast({
						title: res.msg,
						duration: 2000,
						icon: 'none'
					});
				}
			});
		},
		
		// 以下这段是调用官方uni.share来实现的(不须要引入@/service/share.js)
		uniShares(provider,sendPic){
			const shareHref = this.$config.shareUrl + this.shareUrl;
		    if(provider == 'systemShare'){//系统分享
		        plus.share.sendWithSystem(
		            { content: this.shareinfos.shareTitle||(this.systemConfig&&this.systemConfig.domainName ? this.systemConfig.domainName : ''),type: "web", href: shareHref },
		            ()=> {
		                console.log('请求系统发送成功');
		            },
		            (e)=> {
		                uni.showToast({ title: '调用系统分享操作失败：' + JSON.stringify(e),duration: 2000,icon:'none',icon:'none' })
		                console.log('调用系统分享操作失败：' + JSON.stringify(e));
		            }
		        );
		    } else {
		        uni.share({
		            provider: provider=='weixinPY'?'weixin':provider,
		            scene: provider=="weixin"?'WXSceneSession':provider=="weixinPY" ? 'WXSceneTimeline':'',
		            type: provider == 'qq' ? 1 : 0,
		            title: this.shareinfos.shareTitle||(this.systemConfig&&this.systemConfig.domainName ? this.systemConfig.domainName : ''),
		            imageUrl: sendPic,
		            summary: this.shareinfos.shareContent,
		            href: shareHref,
		            success: (res)=> {
		                this.changePopup()
		                console.log('success:' + JSON.stringify(res));
		            },
		            fail: (err)=> {
		                uni.showToast({ title: '分享失败'+JSON.stringify(err),duration: 2000,icon:'none'})
		                console.log('fail:' + JSON.stringify(err));
		            }
		        });
		    }
		},
		
		setImage(pic) {
			return new Promise(resolve => {
				uni.getImageInfo({
					src: pic,
					success: res => {
						// console.log(res.path)//file:///private/var/mobile/Containers/Data/Application/3A64E7BD-D3D6-4D46-8853-2291C87F10C3/tmp/Pandora/_IMage_INFO/AC503FEC8547001831AC3CEC6B6B3CEC.jpg
						uni.compressImage({
							src: res.path,
							quality: 1,
							success: res => {
								// console.log(res.tempFilePath)//_doc/uniapp_temp_1585146768947/compressed/1585146787155.jpg
								resolve(res.tempFilePath);
							},
							fail: imgErr => {
								uni.showToast({ title: '分享失败：'+JSON.stringify(imgErr.errMsg),duration: 2000,icon: 'none'})
								console.log(imgErr);
							}
						});
					},
					fail: err => {
						uni.showToast({ title: '分享失败：'+JSON.stringify(err.errMsg),duration: 2000,icon: 'none'})
						console.log('err:' + err);
					},
					complete: com => {
						console.log('com: ' + JSON.stringify(com));
					}
				});
			});
		},

		// #endif

		eventDraw() {
			this.shareFlag = false;
			uni.showLoading({
				title: '绘制分享图片中',
				mask: true,
				success: res => {
					setTimeout(() => {
						uni.hideLoading(); // 防止特殊情况下页面上一直显示loading
					}, 5000);
				}
			});
			this.getQrcode();
		},

		// 获取二维码
		getQrcode() {
			console.log('shareinfos:', this.shareinfos);
			this.haiBaoData = this.haiBaoPic
			this.$nextTick(() => {
				this.showHaibao = true;
				uni.hideLoading();
			});
		},
		// 保存图片
		eventSave() {
			uni.saveImageToPhotosAlbum({
				filePath: this.shareImg,
				success:(res)=> {
					if (res.errMsg == 'saveImageToPhotosAlbum:ok') {
						uni.showToast({
							title: '保存图片成功',
							duration: 2000
						});
						this.showHaibao = false;
					}
				},
				fail:(err)=> {
					if (!err.errMsg.includes('cancel')) {
						// 如果微信没有授权，则要重新请求相册授权
						uni.showModal({
							title: '保存图片失败',
							content: '检测到您未打开“相册”权限，是否前往开启',
							confirmText: '前往开启',
							cancelText: '取消',
							success: (res) => {
								if (res.confirm) {
									uni.openSetting({
										success: res => {}
									});
								} else if (res.cancel) {
									this.closeHaibao();
								}
							}
						});
					}
				}
			});
		},
		closeHaibao() {
			this.showHaibao = false;
		},
		// 海报图预览
		previewqrTapHaibao(e) {
			// 预览图片
			uni.previewImage({ urls: [e] });
		},

		// #ifdef H5
		doCopy() {
			this.showHaibao = false;
			this.$stringUtils.lsCopy(this.$config.shareUrl + this.shareUrl);
		},
		// #endif
		
		// 用于小程序做画板渲染 否则小程序上会出现两张图片 一张其实是canvas引起的bug
		// 因此要确保popup渲染完后再v-if lime-painter
		painterOpen() {
			this.$nextTick(() => {
				this.isPainterOk = true;
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.button-fixed {
	position: fixed;
	z-index: var(--zindex);
	right: calc(var(--fixedright) * 1px);
	bottom: calc(var(--fixedbottom) * 1px + var(--safe-area-inset-bottom));
}
</style>
