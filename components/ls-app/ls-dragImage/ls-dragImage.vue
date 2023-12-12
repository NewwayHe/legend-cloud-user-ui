<template>
    <view :class="[{'image-drag-sort' : maxImageNum != 1 }, className]" :style="{padding:padding}">
        <!-- 当上传并只显示多张图片时 -->
        <view class="inner w-100" v-if="maxImageNum != 1">
            <template v-if="lists.length == 0&&type==2">
                <view class="content-pic d-flex j-center flex-column text-center a-center" @click="imageUpload">
                    <u-icon name="camera" color="#666" label-color="#999" label-pos="bottom" size="100" :label="`长按拖拽排序，最多添加${maxImageNum}张图片`"></u-icon>
                </view>
            </template>
            <!-- <movable-area v-else class="movable-area grid-gap10p" :class="['grid-column'+column]"> -->
            <movable-area v-else class="movable-area d-grid grid-gap10p" :style="{ 'grid-template-columns': 'repeat(' + column + ', 1fr)' }">
                <!-- #ifdef H5 -->
                <!-- 没有长按拖拽，点击图片是预览，右上角有x删除按钮 -->
                <!-- <view class="item" v-for="(item, index) in lists" :key="index">
                    <image class="img" :src="photoServer+item" mode="widthFix" @click="previewImage(index)"></image>
                    <view class="del-img flex-center" @click.stop="delpic(index)"><text class="del-close">x</text></view>
                </view> -->
                <!-- #endif -->

                <!-- 长按拖拽排序，点击图片是弹出showActionSheet框选择预览或删除 -->
                <view
                    class="item border border-f1 rounded-10 position-relative"
                    v-for="(item, index) in lists"
                    :key="index"
                    draggable="true"
                    @longpress="longtap(index, $event)"
                    @touchend="touchend"
                    @touchmove.stop="touchm"
                    @touchmove.stop.prevent
                    @click.stop="imageTap(item,index)"
                >
                    <image v-if="fileType != 'video'" class="img" :src="photoServer + item" mode="aspectFit"></image>
					<!-- 在非APP端 会自动显示视频的第一帧作为封面 因此导致了APP端 video的封面是全黑的 -->
					<!-- #ifndef APP-PLUS -->
						<video v-else :controls="false" :src="photoServer + item.src" 
						:show-center-play-btn="false"
						:enable-progress-gesture="false"
						:show-progress="false"
						class="img">
							<!-- 遮罩层 点击事件为放大播放 -->
							<cover-view class="videoMask"></cover-view>
							<!-- 盒子的播放图标 遮住底下的可视内容 -->
							<cover-view class="video-mask-playBtn-mask"></cover-view>
							<!-- 取代video原生的播放按钮 -->
							<cover-view class="video-mask-playBtn iconfont icon-bofang" style="font-size: 80rpx; color: #fff; line-height: 80rpx;"></cover-view>
						</video>
					<!-- #endif -->
					<!-- 视频截帧 需要ALIYUN服务支持 [3.29无法实现] -->
					<!-- #ifdef APP-PLUS -->
						<view v-else class="img">
							<view class="videoMask">
								<!-- <image :src="photoServer + item.src + '?x-oss-process=video/snapshot,t_1000,f_jpg,m_fast'" class="w-100 h-100"></image> -->
								<image src="@/static/images/defalut-img/default-img.png" class="w-100 h-100"></image>
							</view>
							<view class="video-mask-playBtn-mask"></view>
							<view class="video-mask-playBtn iconfont icon-bofang" style="font-size: 80rpx; color: #fff; line-height: 80rpx;"></view>
						</view>
					<!-- #endif -->
                </view>

                <view class="item" @click="imageUpload" v-if="lists.length < maxImageNum && !active && fileType != 'video'">
                    <view class="bg-f8 w-100 h-100 position-absolute top-0 left-0 rounded-10">
						<view class="flex-col-center w-100 h-100" :style="{transform: `scale(${uploadScale})`}">
							<text class="iconfont icon-xiangji text-ddd" style="font-size: 50rpx;"></text>
							<text class="text-ccc mt-2 font-24">{{fillName||'添加图片'}}</text>
						</view>
                    </view>
                </view>
				<!-- 这里不能用v-show 因为小程序的css样式判定为item的样式。。。 -->
				<view class="item" @click="videoUpload"
					:style="{ 'display': fileType == 'video' && (lists.length < maxImageNum) && !active ? 'inline-block' : 'none' }"
				>
				    <view class="bg-f8 w-100 h-100 position-absolute top-0 left-0 rounded-10">
						<view class="flex-col-center w-100 h-100" :style="{transform: `scale(${uploadScale})`}">
							<text class="iconfont icon-bofang text-ddd" style="font-size: 50rpx; line-height: 50rpx;"></text>
							<text class="text-ccc mt-2 font-24">{{fillName||'添加视频'}}</text>
						</view>
				    </view>
				</view>
				
                <movable-view
                    class="movable-view"
                    :style="{ width: movableW + 'px', height: movableH + 'px' }"
                    style="top: 0px; left: 0px"
                    :x="x"
                    :y="y"
                    direction="all"
                    damping="5000"
                    friction="1"
                    v-show="active"
                >
                    <view class="zoom-out0002" :style="{ width: movableW + 'px', height: movableH + 'px' }" :class="{ 'item-move-active': active }">
                        <image v-if="fileType != 'video'" class="img" :src="photoServer + lists[beginIndex]" mode="aspectFit"></image>
						<!-- movable-view不支持嵌套原生组件 -->
						<!-- <video v-else :controls="false" :src="photoServer + lists[beginIndex].src" class="img">
							<cover-view class="videoMask"></cover-view>
						</video> -->
						<!-- <image v-else :src="photoServer + lists[beginIndex].src" mode="aspectFit" class="img"></image> -->
                    </view>
                </movable-view>
            </movable-area>
        </view>
        <!-- <view class="prompt">点击预览/删除图片，长按拖拽排序，共{{ lists.length }}张图片</view> -->

        <!-- 当只上传并只显示一张图片时 -->
        <view v-if="maxImageNum == 1 && lists.length == 0" :style="{ width: width + 'rpx', height: height + 'rpx' }" @click="handleUploadOne">
			<view class="bg-f8 w-100 h-100 rounded-10">
				<view class="flex-col-center w-100 h-100" :style="{transform: `scale(${uploadScale})`}">
					<text class="iconfont icon-xiangji text-ddd" style="font-size: 50rpx;"></text>
					<text class="text-ccc mt-2 font-24 text-center">{{ fillName ? fillName : fileType == 'video' ? '视频大小不超过30M': '图片大小不超过5M' }}</text>
				</view>
			</view>
        </view>
        <view v-if="maxImageNum == 1 && lists.length != 0" :style="{ width: width + 'rpx', height: height + 'rpx' }">
            <view class="w-100 h-100" v-for="(item, index) in lists" :key="index" @click.stop="imageTap(item,index)">
                <image v-if="fileType != 'video'" class="w-100 h-100 border border-f1 rounded-10 overflow-h zoom-out0005" :src="photoServer + item" mode="aspectFit"></image>
				<video v-else :controls="false" :src="photoServer + item.src"
				:show-center-play-btn="false"
				:enable-progress-gesture="false"
				:show-progress="false"
				class="w-100 h-100 border border-f1 rounded-10 overflow-h zoom-out0005">
					<!-- 遮罩层 点击事件为放大播放 -->
					<cover-view class="videoMask"></cover-view>
					<!-- 盒子的播放图标 遮住底下的可视内容 -->
					<cover-view class="video-mask-playBtn-mask"></cover-view>
					<!-- 取代video原生的播放按钮 -->
					<cover-view class="video-mask-playBtn iconfont icon-bofang" style="font-size: 80rpx; color: #fff; line-height: 80rpx;"></cover-view>
				</video>
            </view>
        </view>
		
		<!-- 视频放大预览 -->
		<view v-if="previewVideoSrc" class="vedio-preview-full">
			<!-- #ifdef APP-PLUS -->
			<view class="preview-full-header-app">
				<view class="preview-full-header-close" @click="previewVideoSrc = ''"> × </view>
			</view>
			<!-- #endif -->
			<video :autoplay="true" :src="previewVideoSrc" :show-fullscreen-btn="false" class="video-self"
				@click="previewFullVideoClick"
				@controlstoggle="controlstoggle"
			>
				<!-- #ifndef APP-PLUS -->
				<cover-view v-if="videoCloseShow" class="preview-full-header"></cover-view>
				<cover-view v-if="videoCloseShow" class="vedio-preview-full-close" @click="previewVideoSrc = ''"> × </cover-view>
				<!-- #endif -->
			</video>
		</view>
    </view>
</template>
<script>
let wrapW = 0 // 拖拽范围的总宽度
let wrapH = 0 // 拖拽范围的总高度
let wrapW2 = 0 // 可拖拽区域宽度
let wrapH2 = 0 // 可拖拽区域高度
let wrapTop = 0 // 拖拽范围的上边界坐标
let wrapLeft = 0 // 拖拽范围的左边界坐标
let wrapDragTop = 0 // 可拖拽范围的上边界坐标
let wrapDragLeft = 0 // 可拖拽范围的左边界坐标
let itemW = 0 // 拖拽元素的宽
let itemH = 0 // 拖拽元素的高
let itemXNun = 0 // 拖拽元素的列数

export default {
    name: 'ls-dragImage',
	// #ifdef MP-WEIXIN
	// 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性。这时在<组件name> 里加style和class是不会生效的
	options: { virtualHost: true },
	// #endif
    props: {
		className:{
			type: [String, Array,Boolean],//这里加个Boolean，是因为如果传className=""，小程序端会报错
			default: ''
		},
        value: {
            type: [String, Array]
        },
        // list: {
        //     type: Array,
        //     default: function() {
        //         return []
        //     }
        // },
		type: {
            // 没有上传过图片时，上传框的类型：1：正方形，2：长方形
            type: Number,
            default: 1
        },
        maxUploadNum: {
            // 允许单次上传最大图片数量
            type: Number,
            default: 1
        },
        maxImageNum: {
            // 最多显示多少张图片
            type: Number,
            default: 9
        },
        column: {
            // 每行最多显示多少张图片(即是多少列)，默认值为4,有效值为1~N，备注：当column>5时，拖拽排序功能就会出现bug(除非修改计算逻辑)
            type: Number,
            default: 4
        },
        width: {
            // 当maxImageNum==1时，设定图片框的宽，默认为200rpx
            type: [Number, String],
            default: 200
        },
        height: {
            // 当maxImageNum==1时，设定图片框的高，默认为200rpx
            type: [Number, String],
            default: 200
        },
        fontScale: {
            // 当maxImageNum==1时，设定图片框里的字的大小，默认为0.7(跟160px配对的)
            type: [Number, String],
            default: 0.6
        },
        uploadScale: {
            // 当maxImageNum==5时，设定[添加图片]框里的字的大小，默认为1(跟160px配对的)
            type: [Number, String],
            default: 1
        },
		fillName: {
            // 上传图片框的文字说明
            type: [Number, String],
            default: ''
        },
		padding: {
            // padding，可以是:"20rpx","10rpx 20rpx 10rpx 20rpx"
            type: [Number, String],
            default: ''
        },
		// 是否需要 上传视频 仅支持type=1的情况
		// 开启之后 value 会变成一个object对象用以区分 图片或视频
		// 为视频时 value的项会变成 { type: 'video', src: '' }
		// 因此 在与后端做交互时 请按需过滤value
		fileType:{//pic:上传图片，video:上传视频(支持type=1)
			type:String,
			default:'pic'
		}
    },
	data() {
	    return {
	        lists: this.value,
	        active: false, // 是否拖拽状态
	        flag: false, // 是否可拖拽
	        x: 0,
	        y: 0,
	        beginIndex: null, // 当前拖拽元素的索引
	
	        movableW: '', // 拖拽元素的宽(传CCS变量到item-move里)
	        movableH: '' ,// 拖拽元素的高(传CCS变量到item-move里)
			
			previewVideoSrc: '',	//预览视频
			videoCloseShow: true,
	    }
	},
	computed: {
		
	},
    watch: {
        lists: {
            handler(newValue, oldValue) {
                // 监听数组变化
                if (newValue&&newValue.length) {
                    // 有图片或图片数量改变时重新初始化
                    if (this.maxImageNum != 1) {
                        // 只有上传多张图片时才执行拖拽
                        this.$nextTick(()=> {
                            this.init()
                        })
                    }
                }
            },
            immediate: true
        },
        value: {
            handler(newValue, oldValue) {
                // 监听数组变化
                if (newValue) {
                    this.lists = newValue
                }else{
                    this.lists = []
                }
            },
            immediate: true
        }
    },

    created() {},

    // #ifdef MP
    onReady() {
        // console.log('备注：只有‘小程序’才走onReady');
    },
    // #endif

    // #ifndef MP
    mounted() {
        // console.log('备注：‘H5+app’只走mounted不走onReady');
    },
    // #endif

    mounted() {
        const l = this.lists.length
        if (l) {
            // 有图片时初始化
            if (this.maxImageNum != 1) {
                // 只有上传多张图片时才执行拖拽
                this.$nextTick(()=> {
                    this.init()
                })
            }
        }
    },

    methods: {
        init() {
            // 初始化数据
            // 设置拖拽区域信息
            const wrap = uni.createSelectorQuery().in(this).select('.inner')
            wrap.boundingClientRect((data) => {
                wrapW = data.width // 设置拖拽范围的总宽度
                wrapH = data.height // 设置拖拽范围的总高度
                wrapTop = data.top // 设置拖拽范围的上边界坐标
                wrapLeft = data.left // 设置拖拽范围的左边界坐标
                this.setNodeWH()
            }).exec()
        },
        setNodeWH() {
            // 设置拖拽元素的宽高
            // 获取拽拖元素的信息
            const item = uni.createSelectorQuery().in(this).select('.item')
            item.boundingClientRect((data) => {
                // console.log(data)
                this.movableW = itemW = data.width // 拖拽元素的宽度
                this.movableH = itemH = data.height // 拖拽元素的高度
                this.setDragData()
            }).exec()
        },
        setDragData() {
            // 设置拖拽区域及元素配置
            wrapDragTop = wrapTop + itemH / 2 // 设置拖拽范围上边距   //96.38&
            wrapDragLeft = wrapLeft + itemW / 2 // 设置可拖拽范围左边距  //121.94
            wrapW2 = wrapW - itemW // 设置可拖拽区域宽度  //238.06
            wrapH2 = wrapH - itemH // 设置可拖拽区域高度 //11.7
            itemXNun = Math.round(wrapW / itemW) - 1 // 设置拖拽元素的列数  //2-1=1
        },
        longtap(index, e) {
            this.init() // 如果不加这个方法，就会出现当页面滚动一下后，然后再长按时，movable-view元素里的图片位置会不正确的bug
			// 视频组件[video]不能嵌套在movable-view内 导致了无法实现互相拖动的功能
			// 除非 后端能够支持 上传视频后返回视频的url之外 还能够返回视频的第一帧图片
			// 随后利用该第一帧图片来做拖动 [3.29 后端支持失败]
			if(this.fileType == 'video') {
				return uni.showToast({
					icon: 'none',
					title: '视频暂不支持拖动'
				})
			}
            // 长按
            const left = e.currentTarget.offsetLeft
            const top = e.currentTarget.offsetTop
            this.beginIndex = index // 获取所在位置索引
            this.$nextTick(()=> {
                this.x = left // 119
                this.y = top // 0
            })

            this.active = true
            this.flag = true
        },
        computationIndex(e) {
            // 计算元素索引
            const left = e.left
            const top = e.top
            let index = 0 // 计算拖拽元素所在的索引位置
            const x = Math.round(left / itemW) // 计算拖拽元素所在的横向索引位置
            const y = Math.round(top / itemH) // 计算拖拽元素所在的纵向索引位置
            const num = itemXNun * y
            if (x && !y) {
                // 第一行
                index = x
            }
            if (y) {
                // 第一行以下
                index = x + y + num
            }
            return index
        },
        touchm(e) {
            // 拖拽过程
            if (this.flag) {
                let x = e.touches[0].clientX - wrapDragLeft
                let y = e.touches[0].clientY - wrapDragTop
                if (x < 0) {
                    x = 0
                }
                if (x > wrapW2) {
                    x = wrapW2
                }
                if (y < 0) {
                    y = 0
                }
                if (y > wrapH2) {
                    y = wrapH2
                }
                this.x = x
                this.y = y
            }
        },
        touchend(e) {
            // 拖拽结束
            this.active = false
            const left = e.currentTarget.offsetLeft
            const top = e.currentTarget.offsetTop
            if (!this.flag || (this.x === left && this.y === top)) {
                return
            }
            const x = this.x // 计算拖拽横向距离
            const y = this.y // 计算拖拽纵向距离
            const itemNum = this.lists.length - 1 // 拖拽元素的总数量
            let endIndex = this.computationIndex({ left: x, top: y }) // 获取所在位置索引
            if (endIndex > itemNum) {
                endIndex = itemNum
            }
            // 交换位置
            const beginIndex = this.beginIndex // 当前拖拽元素索引
            const data = this.lists
            const tem = data[beginIndex]
            data[beginIndex] = data[endIndex]
            data[endIndex] = tem
            this.flag = false
            this.$emit('input', this.lists)
        },

        // 预览图片
        previewImage(url) {
            uni.previewImage({
                current: url,
                urls: this.lists.map(item => this.photoServer + item)
            })
        },

        // 图片上传
        async imageUpload() {
            const count = this.maxUploadNum - this.lists.length
            const uploader = new this.$Uploader()
            const path_arr = await uploader.choose_and_upload(count, false)

            // #ifdef H5
            // 由于在H5平台基于浏览器本身的规范只能限制单选/多选，并不能限制数量。所以要手动修改数组对数组进行截取
            if (path_arr && path_arr.length && path_arr[0]) {
                // 防止返回的是一个空的数组：[]
                this.lists = this.lists.concat(path_arr).slice(0, this.maxUploadNum)
            }
            // #endif
            // #ifndef H5
            if (path_arr && path_arr.length && path_arr[0]) {
                // 防止返回的是一个空的数组：[]
                this.lists = this.lists.concat(path_arr)
            }
            // #endif
            this.$emit('input', this.lists)
        },
        imageTap(item, index) {
			const _this = this;
			let itemList = this.fileType == 'video' ? ['全屏预览视频'] : ['全屏预览大图'];
			itemList.push('删除（不可撤销）')
            // 图片点击事件
            uni.showActionSheet({
                itemList,
                success: (res) => {
                    if (res.tapIndex) {
                        // 删除
                        this.imageDel(index)
                    } else {
						if (this.fileType == 'video') {
							if (item.src) {
								this.previewVideoSrc =  _this.photoServer + item.src
							}else{//这个是编辑回选专用
								this.previewVideoSrc =  _this.photoServer + item
							}
						}else{
							this.previewImage(_this.photoServer + item)// 预览
						}
                    }
                },
				fail(err) {
				},
            })
        },
        imageDel(i) {
            // 删除图片事件
            this.lists.splice(i, 1)
            this.$emit('input', this.lists)
        },
		// 视频上传
		async videoUpload() {
			const count = this.maxUploadNum - this.lists.length;	//剩余可以上传的数量
			const uploader = new this.$Uploader()
			const vedio_path = await uploader.chooseVideo()
			if(vedio_path) {
				this.lists.push({ type: 'video', src: vedio_path })
			}
			this.$emit('input', this.lists)
		},
		
		// 只有一张图片时
		handleUploadOne() {
			this.fileType == 'video' ? this.videoUpload() : this.imageUpload()
		},
		
		// 视频播放时 进度条过一会消失（小程序生效）
		controlstoggle(e) {
			this.videoCloseShow = e.detail.show
		},
		
		// 控制顶部遮罩与播放进度条显示与隐藏 APP无效 因此该函数只有在H5使用
		previewFullVideoClick(){
			// #ifndef MP
			this.videoCloseShow = !this.videoCloseShow
			// #endif
		},
    }
}
</script>

<style lang="scss" scoped>
page {
    user-select: none; //H5端禁止长按弹出浏览器自带的选择选项
}
image {
    pointer-events: none;
} //这个是禁止H5浏览器里长按图片弹出选项框
.img {
    width: 100%;
    height: 100% !important;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    border-radius: 10rpx;
	pointer-events: none;
}

.image-drag-sort {
    width: 100%;
    box-sizing: border-box;
    user-select: none;
}

.movable-area {
    width: 100%;
    height: auto;
    position: relative;
}

.item {
    display: inline-block;
    width: 100%;
    height: max-content;
    vertical-align: top;
    text-align: center;
    background: #fff;
    position: relative;
    &:before {
        content: ' ';
        padding-top: 100%;
        display: block;
        vertical-align: top;
    }
    .del-img {
        position: absolute;
        top: -30rpx;
        right: -30rpx;
        padding: 20rpx;
        .del-close {
            width: 30rpx;
            height: 30rpx;
            background: rgba(0, 0, 0, 0.4);
            border-radius: 50%;
            color: #fff;
            // font-weight: 600;
            font-size: 24rpx;
            line-height: 24rpx;
        }
    }
}

.content-pic {
    width: 100%;
    height: 190rpx;
    margin: auto;
    background: rgba(255, 255, 255, 1);
    border-radius: 20rpx;
    box-shadow: 0px 1px 19px 3px rgba(0, 0, 0, 0.08);
}

movable-view {
    position: absolute !important;
    overflow: hidden;
    border-radius: 10rpx;
    .item-move-active {
        box-shadow: 0 0 30px #000;
    }
}

.prompt {
    font-size: 28rpx;
    text-align: center;
    color: #999;
    margin-top: 20rpx;
}

// 视频小图时的遮罩层
.videoMask {
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	border-radius: 10rpx;
	transform: translate3d(0,0,0);
	z-index: 996;
	pointer-events: none;
	background-color: rgba(0,0,0,.5);
}
.video-mask-playBtn-mask {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 997;
	width: 50rpx;
	height: 50rpx;
	background-color: #000;
}
.video-mask-playBtn {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 997;
}

// 视频预览
.vedio-preview-full {
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	z-index: 1002;
	background-color: #000;
	display: flex;
	justify-content: center;
	align-items: center;
	.video-self {
		position: absolute;
		/* #ifdef APP-PLUS */
		top: 5%;
		height: 95%;
		/* #endif */
		/* #ifndef APP-PLUS */
		top: 0;
		height: 100%;
		/* #endif */
		left: 0;
		width: 100%;
		z-index: 1002;
	}
}

.preview-full-header-app{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 5%;
	background-color:rgba(0,0,0,.5) ;
}

.preview-full-header-close{
	position: absolute;
	top: 50%;
	right: 52rpx;
	margin-top: -20rpx;
	font-size: 60rpx;
	color: #FFFFFF;
	text-align: right;
	z-index: 1005;
}

.preview-full-header {
	position: fixed;
	/* #ifdef MP-WEIXIN */
		top: 34rpx;
	/* #endif */
	/* #ifndef MP-WEIXIN */
		top: 0;
	/* #endif */
	left: 0;
	width: 100%;
	height: 80rpx;
	z-index: 1003;
	background-color:rgba(0,0,0,0.5) ;
}

.vedio-preview-full-close {
	position: fixed;
	/* #ifdef MP-WEIXIN  */
		top: 40rpx;
		right: 175rpx;
	/* #endif */
	/* #ifndef MP-WEIXIN */
		right: 32rpx;
		top: 0;
	/* #endif */
	width: 80rpx;
	height: 80rpx;
	line-height: 60rpx;
	text-align: center;
	z-index: 1003;
	/* 	background-color: #808080; */
	color: #fff;
	font-size: 65rpx;
	font-weight: bold;
	text-shadow: 1px 2px 5px rgb(0, 0, 0);
}
</style>

<!-- 
用法：
    当只上传并显示一张图片时：
        HTML：
            <ls-dragImage :maxImageNum="1" :height='200' :width='200' :fontScale='0.8' />
            或者：
            <ls-dragImage :maxImageNum="1" />
        JS：
            getImage(imgList){
                this.dynamicPics = imgList
            },
    
    当上传并只显示多张图片时：
        HTML：
            <ls-dragImage :maxImageNum="3" :maxUploadNum="3" :column="4" ></ls-dragImage>
        JS：
            getImage(imgList){
                this.dynamicPics = imgList
            },
        
 -->
