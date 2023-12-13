<template>
	<!-- 服务器上的图片，才用到此组件，本地图片直接用原生image就行 -->
	<!-- <image :class="className" :src="picture" @click="tap(picture)" :key="picture+1" :mode="mode" :style="optionstyle" @longpress="saveImage"></image> -->
	<!-- 注意：一、这里要用v-bottom或v-top，v-middler的话某些情况下图片间还是会出现白线，
			  二、最外层view不要加overflow-h，不然有些slot显示不完整 
			  三、如果页面上显示不出图片，很可能是key问题，例如：<ls-image :src="pic" :key="pic+1"/>，注意：不用用$u.guid()来当key值($u.guid()存在的bug)，+1是为了防止pic==null时没有key值
			  四、由于下面加了一个@click="previewImg"方法，所以以前的@click.native写法现在可以不用写native(2023-4-3)
	-->
	<view :style="[headStyle,customStyle]" :class="['position-relative', className]" @click="previewImg">
		<!-- 要显示的图片 -->
		<!-- #ifndef H5 -->
		<image
			class="font-0 v-middle"
			:src="picture"
			v-if="picture&&!isError"
			:mode="mode"
			:style="[optionstyle,{opacity: opacityMask,transition:`all ${transitionMask}s ease-in-out 0s`}]"
			:lazy-load="lazyLoad"
			webp
			@longpress="saveImage"
			@load="load"
			@error="imageError"
		></image>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<img
			class="font-0 v-middle"
			v-lazy="imgObj"
			v-if="picture&&!isError"
			:style="[optionstyle,{opacity: opacityMask,transition:`all ${transitionMask}s ease-in-out 0s`,objectFit:loading?'contain':objectFit}]"
			@longpress="saveImage"
			@load="load"
			@error="imageError"
		></img>
		<!-- #endif -->
		<!-- 错误图片 -->
		<image class="font-0 v-middle" :style="[optionstyle]" mode="aspectFit" :src="errImg" v-if="isError"></image>
		<!-- 懒加载图片 -->
		<!-- 下面加的position-absolute left-0 top-0，是为了让图片不要丢失位置 -->
		<!-- #ifndef H5 -->
		<image class="position-absolute left-0 top-0 font-0 v-middle" :style="[optionstyle]" mode="aspectFit" :src="errImg" v-if="loading&&lazyLoad&&!isError"></image>
		<!-- #endif -->
		
		<!-- 用来存放遮罩层 -->
		<slot></slot>
	</view>
</template>

<script>
export default {
	name: 'LsImage',
	// #ifdef MP-WEIXIN
	// 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性。这时在<组件name> 里加style和class是不会生效的
	options: { virtualHost: true },
	// #endif
	props: {
		src: { // 图片路径
			type: [String,Object,Boolean],
			default: ''
		}, 
		className:{
			type: [String, Array,Boolean],// 这里加个Boolean，是因为如果传className=""，小程序端会报错
			default: ''
		},
		// 最外层自定义样式，对象形式
		customStyle: {
			type: Object,
			default() {
				return {};
			}
		},
		options: Object, // 设置图片的长宽和波打线弧度，例如：:options="{w:'45',h:'45',br:'20',bg:'#fff'}"，h:长，w：宽，br：弧度，bg：背景颜色
		// 例如：w:'100%'='100%',w:'100'= '100rpx' , w:'100px = '100px' ,  w:'100rpx'= '100rpx'
		osOptions: {
			// 设置阿里云的图片缩放(省流量)，当有这个时，options只负责调整图片大小，调整像索将是osOptions来负责
			// 当options的w是%比或auto时，就要用osOptions来限制最大像素以达到省流量的效果
			type: Object,
			default: () => {
				return {};
			}
		},
		// 自定义样式，对象形式
		cssStyle: {
			type: Object,
			default() {
				return {};
			}
		},
		mode: {
			type: String,
			default: 'scaleToFill' // 不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素
			// default:'aspectFit'//保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。
			// default:'aspectFill'//保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。
			// default:'widthFix'//宽度不变，高度自动变化，保持原图宽高比不变
			// default:'heightFix'//高度不变，宽度自动变化，保持原图宽高比不变
		},
		error: {
			type: String,
			default: '/static/images/defalut-img/default-img.png' // 组件里不能写../../绝对路径，不然小程序认不出来
		},
		errorStyle: {
			// 如果触发@error后，选择哪一种类型的图片。可选值：0(默认)：小羊头像，2：白色头像(此图背景为透明，要加背景className='bg-bg'才显示)
			type: Number,
			default: 0
		},
		lazyLoad: {
			// 懒加载
		    type: Boolean,
		    default: true
		},
		isPreview: {
			// 是否可以预览图片(这个优先级别比preImgList低,该值与preImgList的区别是，它只预览当前图片picture一张图片，不与current有关联)
			type: Boolean,
			default: false
		},
		preImgList: { // 预览的图片(这个优先级别比isPreview高，当该有值时，无论isPreview是否有值，都以本值为准)
			type: [String, Array],
			default: () => []
		},
		current: {
			// 预览图片显示索引
			type: Number,
			default: 0
		}
	},

	data() {
		return {
			// 初始化组件时，默认为加载中状态
			loading: true,
			isError:false,// 图片是否不存在或错误
			picture: '', // 不能写成picture:this.photoServer + this.src(这样会导致小程序无论图片是否存在也会走@error方法)
			error1: '/static/images/defalut-img/default-head.png' ,// 则正方形的白色头像(可加背景)
			
			transitionMask:0,// 用来控制遮罩层的动画时间(为了防止闪一下)，让未打开前，是0,打开后未读完setTimeout前是0，读完setTimeout后scale=0.25
			opacityMask:0,// 用来控制遮罩层的透明度，让未打开前，是0,打开后未开启动画前是0，开启动画后是1
		};
	},
	computed: {
		// 自定义样式，对象形式
		optionstyle() {
			const style = {
				height: this.options && this.options.h ? ((String(this.options.h).indexOf('%') > -1) ? '100%' : `${uni.$stringUtils.addUnit(this.options.h)}`) : '', // 处理高度
				width: this.options && this.options.w ? ((String(this.options.w).indexOf('%') > -1) ? '100%' : `${uni.$stringUtils.addUnit(this.options.w)}`) : '', // 处理宽度
				borderRadius: this.options && this.options.br ? `${uni.$stringUtils.addUnit(this.options.br)}` : '', // 处理border线弧度
				background: this.options && this.options.bg ? this.options.bg : '', // 处理图片背景
			};
			Object.assign(style, this.cssStyle);
			return style;
		},
		headStyle(){
			const style = {
				height: this.options && this.options.h ? `${uni.$stringUtils.addUnit(this.options.h)}` : '', // 处理高度
				width: this.options && this.options.w ? `${uni.$stringUtils.addUnit(this.options.w)}` : '', // 处理宽度
				borderRadius: this.options && this.options.br ? `${uni.$stringUtils.addUnit(this.options.br)}` : '', // 处理border线弧度
				// background: this.options && this.options.bg ? this.options.bg : '', // 处理图片背景
			};
			return style;
		},
		// fill	默认，不保证保持原有的比例，内容拉伸填充整个内容容器。
		// contain	保持原有尺寸比例。内容被缩放。
		// cover	保持原有尺寸比例。但部分内容可能被剪切。
		// none	保留原有元素内容的长度和宽度，也就是说内容不会被重置。
		// scale-down	(宽度不变，高度自动变化，保持原图宽高比不变)保持原有尺寸比例。内容的尺寸与 none 或 contain 中的一个相同，取决于它们两个之间谁得到的对象尺寸会更小一些。
		objectFit() {
			let modeTemp = 'fill'
			const status = { 'scaleToFill':'fill','aspectFit':'contain','aspectFill':'cover','widthFix':'scale-down','heightFix':'scale-down' }
			modeTemp = status[this.mode]
			return modeTemp
		},
		// 'loading'或'错误'图片
		errImg() {
			let loadingImage = ''
			if (!this.errorStyle) {
				loadingImage = this.error; // 选择小羊头像作为默认图片
			} else {
				loadingImage = this['error' + this.errorStyle.toString()]; // 选择errorX图片作为默认图片
			}
			return loadingImage
		},
		imgObj() { // H5上图片懒加载专用
		    const imgTemp = {
		        src: this.picture,
		        error:this.errImg,
				// loading: this.lazyLoad?this.errImg:'',//接口慢的话会导致闪一下，影响体验，先关闭
		    }
		    return imgTemp
		}
	},

	watch: {
		src: {
			handler(newValue, oldValue) {
				if (newValue) {
					let url = ''
					// #ifdef APP-NVUE
						url = (newValue.startsWith('http') ? '' : uni.$config.photoServer) + newValue;
					// #endif
					// #ifndef APP-NVUE
						url = (newValue.startsWith('http') ? '' : this.photoServer) + newValue;
					// #endif
					if (url.indexOf('dev6.0//dev6.0') != -1) {
						// 此判断是为了兼容旧数据
						url = url.replace('dev6.0//dev6.0', 'dev6.0');
					}
					if (Object.keys(this.osOptions) && Object.keys(this.osOptions).length != 0) {
						// 如果设置了阿里云处理图片的缩放
						this.picture = this._handleResize(url, this.osOptions);
					} else if (this.options && this.options.w && this.options.w != 'auto' && this.options.w.toString().indexOf('%') == -1) {
						// 如果设置了图片宽度，则用阿里云处理图片节省流量
						const osHandle = {};
						// osHandle.w = this.options.w
						// 阿里图片宽度：先将options.w里的px和rpx去掉，如果是options.w是纯数字或带有rpx或则*1,如果options.w带有px为单位则*2)
						osHandle.w =
							uni.$stringUtils.addUnit(this.options.w).replace(/(rpx)|(px)/g, '') *
							(this.options.w.toString().indexOf('rpx') == -1 && this.options.w.toString().indexOf('px') != -1 ? 2 : 1);
						if (this.options.h && this.options.h != 'auto' && this.options.h.toString().indexOf('%') == -1) {
							// osHandle.h = this.options.h
							// 阿里图片高度：先将options.h里的px和rpx去掉，如果是options.h是纯数字或带有rpx或则*1,如果options.h带有px为单位则*2)
							osHandle.h =
								uni.$stringUtils.addUnit(this.options.h).replace(/(rpx)|(px)/g, '') *
								(this.options.h.toString().indexOf('rpx') == -1 && this.options.h.toString().indexOf('px') != -1 ? 2 : 1);
						}
						this.picture = this._handleResize(url, osHandle);
					} else {
						this.picture = url;
					}
				} else {
					// 注意:下面这个小程序和APP不能用下面的代码,如果ls-image是放在页面的弹框组件里,小程序上是默认一进页面就打开弹框的,这时弹框的内容没有赋值的话,之后就算打开弹框赋值了,该图片还是走下面的isError = true(页面有值但不能渲染出来)
					// #ifdef H5
					// H5端如果没有写这段代码,图片为空时不会显示默认图片(小程序端和APP端不能要这个代码)
					this.isError = true
					// #endif
				}
			},
			immediate: true
		},
		loading: {
			handler(val) {
				if (val) {
					// 关闭的瞬间
					this.transitionMask = 0.5
					this.opacityMask = 0
					// 最后关闭动画过渡
					setTimeout(() => {
						this.transitionMask = 0
						this.opacityMask = 0
					},25)
				} else{
					// 打开瞬间
					this.transitionMask = 0
					this.opacityMask = 0
					// 然后开启动画过渡
					setTimeout(() => {
						this.transitionMask = 0.5
						this.opacityMask = 1
					},25)
				}
			},
			// immediate: true
		}
	},

	created() {},

	// #ifdef MP-WEIXIN
	onReady() {
		// console.log('备注：只有‘小程序’才走onReady');
	},
	// #endif

	// #ifndef MP-WEIXIN
	mounted() {
		// console.log('备注：‘H5+app’只走mounted不走onReady');
	},
	// #endif

	methods: {
		load(e) {
			// console.log('loading:',e.detail);
			this.$emit('load', e)
			this.loading = false;// H5上是用v-lazy上的"imgObj"，H5上该方法load(e)里的loading暂时无效，暂时还找不到解决办法
		},
		saveImage(e) {
			this.$emit('saveImage');
		},

		// 图片错误的时候
		imageError(e) {
			// console.log('imageError',e);
			if (e.type == 'error') {
				this.isError = true
				this.$emit('error')
			}
		},

		/**
		 * 阿里云图片缩放
		 * 缩放图限制：缩放图宽与高的乘积不能超过4096 px*4096 px，且单边长度不能超过4096 px。
		 * @param {*} imageUrl
		 * @param {*} options 处理阿里云图片的参数
		 */
		_handleResize(imageUrl, osOptions) {
			let params = `${imageUrl}?x-oss-process=image/resize,`;
			if (!osOptions.limit) {
				osOptions.limit = 0;
			}
			if (!osOptions.m) {
				osOptions.m = 'fixed';
			}
			for (const key in osOptions) {
				switch (key) {
					case 'm':
						// 指定缩放的模式。
						// lfit（默认值）：等比缩放，缩放图限制为指定w与h的矩形内的最大图片。
						// mfit：等比缩放，缩放图为延伸出指定w与h的矩形框外的最小图片。
						// fill：将原图等比缩放为延伸出指定w与h的矩形框外的最小图片，之后将超出的部分进行居中裁剪。
						// pad：将原图缩放为指定w与h的矩形内的最大图片，之后使用指定颜色居中填充空白部分。注意，当给出的指定w和h大于原图片尺寸时，只有这个pad生效，其它模式只有当limit=0时才会生效
						// fixed：固定宽高，强制缩放。
						params = `${params}m_${osOptions[key]},`;
						break;
					case 'w':
						// 指定目标缩放图的宽度。
						params = `${params}w_${osOptions[key]},`;
						break;
					case 'h':
						// 指定目标缩放图的高度
						params = `${params}h_${osOptions[key]},`;
						break;
					case 'l':
						// 指定目标缩放图的最长边
						// 说明 长边是指原尺寸与目标尺寸的比值大的那条边；短边是指原尺寸与目标尺寸的比值小的那条边。
						// 例如原图为400 px*200 px，缩放为800 px*100 px。由于（400/800）<（200/100），所以在这个缩放操作中，200那条是长边，400那条是短边。
						params = `${params}l_${osOptions[key]},`;
						break;
					case 's':
						// 指定目标缩放图的最短边。
						params = `${params}s_${osOptions[key]},`;
						break;
					case 'limit':
						// 指定当目标缩放图大于原图时是否进行缩放。
						// 1（默认值）：表示不按指定参数进行缩放，直接返回原图。
						// 0：按指定参数进行缩放。
						params = `${params}limit_${osOptions[key]},`;
						break;
					case 'color':
						// 当缩放模式选择为pad（缩放填充）时，可以设置填充的颜色
						params = `${params}color_${osOptions[key]},`;
						break;
					case 'p':
						// 按百分比缩放图片。
						// [1,1000] 小于100为缩小，大于100为放大。
						// 其中GIF格式的图片支持指定宽高缩放，不支持等比缩放（等比缩放情况下，动态图会变成静态图）。
						// 目标缩放图比原图尺寸大时，默认返回原图。您可以增加limit_0参数放大图片。
						params = `${params}p_${osOptions[key]},`;
						break;
					default:
						break;
				}
			}
			// /format,webp 这个是图片尺寸压缩
			params = params.substr(0, params.length - 1) + '/format,webp';
			return params;
		},
		// 图片预览功能 可传数组或者字符串
		// 用法1：<ls-image :src="item" :options="{ w: 750, h: 750 }" class="slide-image" :preImgList="picArr"/>
		// 用法2：<ls-image :src="item" :options="{ w: 750, h: 750 }" class="slide-image" isPreview/>
		previewImg() {
			if(!this.$u.test.isEmpty(this.preImgList)){
				uni.previewImage({
					current: this.current,
					urls: uni.$u.test.array(this.preImgList) ? this.preImgList.map(item => this.photoServer + item) : [this.photoServer + this.preImgList],
					complete: () => { 
						this.$emit('isPreviewImgIng') 
					}
				});
			}else if(this.isPreview && !this.isError){ // 如果是烂图则不预览
				uni.previewImage({
					urls:  [(this.src.startsWith('http') ? '' : this.photoServer) + this.src],
					complete: () => { 
						this.$emit('isPreviewImgIng') 
					}
				});
			}else{
				this.$emit('click')
			}
		}
	}
};
</script>

<style lang="scss" scoped>
// 备注:rpx传值的话要写在HTML内联里,不然会出现先换算,再拿值,就会rpx值永远也不会根据屏幕大小来换算
// height :calc(var(--height)*1rpx);
// width :calc(var(--width)*1rpx);
</style>

<!-- 使用方法：
    注意：为了兼容APP端，必须要有view层包住ls-image(不然会占用整行的100%),如下：
        <view class="mr-2">
            <ls-image :src="myInfo.portraitPic" :options="{w:'120',h:'120',br:'50%'}" @click.native="goWriterInfo"/>
        </view>

    一、页面上的小图标(限定宽和高)(备注：由于下面这个图片是数组里的图片，所以不用先v-if加载)：
        <ls-image :src="item.pic" :options="{w:'90',h:'90'}" />
    
    二、文章详情顶部大图(宽度是100%，widthFix:宽度不变，高度自动变化，保持原图宽高比不变,errorr时的默认图片为长方形的)。
        (注意：如果不是数组里的图片-因为数组会先读数据，所以不存在加载不到的问题，一定要先v-if加载完数据后再能用，不然会先认为没有图片才加载)：
        <ls-image :src="details.articleCover" :mode="'widthFix'" :options="{w:'100%'}" :errorStyle='1' v-if="details.articleCover"/>
    
    
    三、新闻中心列表大图(宽是100%，widthFix:宽度不变，高度自动变化，保持原图宽高比不变,有border-radius弧度,errorr时的默认图片为长方形的)(数组里的图片不用v-if):
        <ls-image :src="item.newCover" :mode="'widthFix'" :options="{w:'100%', br:'22'}" :errorStyle='2'/>
    
    四、个人中心头像(点击头像可预览)
        <ls-image :src="userInfo.path" :options="{w:'120',h:'120',br:'50%'}" v-if="userInfo.path" isPreview/>
 -->
