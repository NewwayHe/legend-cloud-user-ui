<!-- 
        瀑布流 ，支持slot插槽，支持 h5 小程序 app。
        用法一(有tab栏，注意：点击tab栏时，让key++(必须在请求到list数据后执行), 且运行this.$refs.waterfalls.refresh())：
        HTML：
        <waterfall ref="waterfalls" :list="list" :key="key" imageSrcKey="image" @wapper-lick="toPage">
            若只适配微信小程序，利用小程序插槽：--  #ifdef  MP --
                <view v-for="(item, index) of list" :key="index" slot="slot{{index}}">
                   <view class="max-w-100 p-2 overflow-h font-24">
                       <text class="line-clamp2 font-28">{{ item.name }}</text>
                   </view>
                </view>
            若只适配 app、h5 端，利用作用域插槽：-- #ifndef  MP --
                <template v-slot:default="item">
                   <view class="max-w-100 p-2 overflow-h font-24">
                       <text class="line-clamp2 font-28">{{ item.name }}</text>
                   </view>
                </template>
        </waterfall>
        
        JS：
        import waterfall from "@/components/common/waterfall/waterfall.vue";
        components: { waterfall },
        data() {
            return {
                key:1,
            };
        },
        //点击tab的方法
        tabSelect(item,index){
            // this.list = []//如实在不行，可以打开这个
            this.$refs.waterfalls.refresh()
            listPage.loadListByPage( this,this.listParmas, { complete:()=> { this.key++;uni.stopPullDownRefresh(); } } );
        },
		变更(2021-7-1)：
			1、新增statusArr和maxHieght变量标记哪一个是超长的图片，超长的图片截取只显示500px高
    -->
<template>
    <view class="waterfalls-box" :style="{ height: height + 'px' }">
        <!--  #ifdef  MP-WEIXIN -->
        <view
            v-for="(item, index) of listTemp"
            class="waterfalls-list overflow-h"
            :key="item[idKey]"
            :id="'waterfalls-list-id-' + item[idKey]"
            :ref="'waterfalls-list-id-' + item[idKey]"
            :style="{
                '--offset': offset + 'px',
                '--cols': cols,
				height:statusArr[index]&&statusArr[index].superLong?maxHieght+'px':'',
                top: allPositionArr[index].top || 0,
                left: allPositionArr[index].left || 0
            }"
            @click="$emit('wapper-lick', item)"
        >
			<view v-if="!item.error"
				:class="[{'position-relative':statusArr[index]&&statusArr[index].superLong}]" 
				:style="{
					'height': statusArr[index] && statusArr[index].superLong ? (maxHieght-statusArr[index].textHeight)+'px' :'',
					'position': item.video ? 'relative': 'static',
				}" 
			>
				<image
					class="waterfalls-list-image"
					:class="[{ single },{'position-absolute bottom-0':statusArr[index]&&statusArr[index].superLong}]"
					mode="widthFix"
					:style="imageStyle"
					:src="photoServer+item[imageSrcKey] + `?x-oss-process=image/resize,s_${500},limit_0`"
					@load="imageLoadHandle(index)"
					@error="imageLoadHandle(index,$event)"
					@click="$emit('image-click', item)"
				/>
				<template v-if="item.video">
					<view class="videoMask" style="z-index: 1;"></view>
					<view class="video-mask-playBtn-mask" style="z-index: 1;"></view>
					<view class="video-mask-playBtn iconfont icon-bofang" style="font-size: 80rpx; color: #fff; z-index: 1; line-height: 1;"></view>
				</template>
			</view>
			<image class="w-100" style="height: 345rpx;" src="@/static/images/defalut-img/default-img.png" mode="" v-else></image>
			<view :id="'waterfalls-text-id-' + item[idKey]">
				<slot name="slot{{index}}" />
			</view>
        </view>
        <!--  #endif -->

        <!--  #ifndef  MP-WEIXIN -->
        <view
            v-for="(item, index) of listTemp"
            class="waterfalls-list overflow-h"
            :key="item[idKey]"
            :id="'waterfalls-list-id-' + item[idKey]"
            :ref="'waterfalls-list-id-' + item[idKey]"
            :style="{
                '--offset': offset + 'px',
                '--cols': cols,
				height:statusArr[index]&&statusArr[index].superLong?maxHieght+'px':'',
                ...listStyle,
                ...(allPositionArr[index] || {})
            }"
            @click="$emit('wapper-lick', item)"
        >
			<view v-if="!item.error"
				:class="[ {'position-relative':statusArr[index]&&statusArr[index].superLong}]" 
				:style="{ 
					'height': statusArr[index] && statusArr[index].superLong ? (maxHieght-statusArr[index].textHeight)+'px' : '',
					'position': item.video ? 'relative': 'static',
				}" 
			>
				<image
					class="waterfalls-list-image"
					:class="[{ single },{'position-absolute bottom-0':statusArr[index]&&statusArr[index].superLong}]"
					mode="widthFix"
					:style="imageStyle"
					:src="photoServer+item[imageSrcKey] + `?x-oss-process=image/resize,s_${500},limit_0`"
					@load="imageLoadHandle(index)"
					@error="imageLoadHandle(index,$event)"
					@click="$emit('image-click', item)"
				/>
				<template v-if="item.video">
					<view class="videoMask" style="z-index: 1;"></view>
					<view class="video-mask-playBtn-mask" style="z-index: 1;"></view>
					<view class="video-mask-playBtn iconfont icon-bofang" style="font-size: 80rpx; color: #fff; z-index: 1; line-height: 1;"></view>
				</template>
			</view>
			<image class="w-100 h-350r" src="@/static/images/defalut-img/default-img.png" mode="" v-else></image>
			<view :id="'waterfalls-text-id-' + item[idKey]">
				<slot v-bind="item" />
			</view>
        </view>
        <!--  #endif -->
    </view>
</template>
<script>
export default {
	// #ifdef MP-WEIXIN
	// 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性。这时在<组件name> 里加style和class是不会生效的
	options: { virtualHost: true },
	// #endif
    props: {
        list: { type: Array, required: true },
        // offset 间距，单位为 px
        offset: { type: Number, default: 10 },
        // 列表渲染的 key 的键名，值必须唯一，默认为 id
        idKey: { type: [String, Number], default: 'id' },
        // 图片 src 的键名
        imageSrcKey: { type: String, default: 'pic' },
        // 列数
        cols: { type: Number, default: 2, validator: (num) => num >= 2 },
        imageStyle: { type: Object },

        // 是否是单独的渲染图片的样子，只控制图片圆角而已
        single: { type: Boolean, default: false },

        // #ifndef MP-WEIXIN
        listStyle: { type: Object }
        // #endif
    },
    data() {
        return {
			listTemp:[],//this.list的缓存变量
            topArr: [], // left, right 多个时依次表示第几列的数据
            allPositionArr: [], // 保存所有的位置信息
            allHeightArr: [], // 保存所有的 height 信息
            height: 0, // 外层包裹高度
            oldNum: 0,
            num: 0,
			maxHieght:400,//每个盒子最大的高度(为防有人恶意上传很长的图片霸屏)，单位：px
			statusArr:[],//标记哪一个是超长的图片
        }
    },
	computed: {
		
	},
	watch:{
		list: {
			handler(newVal,oldVal) {
				if(newVal){
					this.listTemp = newVal
				}
			},
			immediate: true,
			deep: true
		}
	},
    created() {
        this.refresh()
    },
    methods: {
        imageLoadHandle(index,error) {
			console.log('err--', error)
			// 如果是错误的图片有error值,则显示默认图
			if(error&&error.type=="error"){
				this.$set(this.listTemp[index], 'error', true)
			}
			setTimeout(()=>{
				const id = 'waterfalls-list-id-' + this.list[index][this.idKey]
				const query = uni.createSelectorQuery().in(this)
				query.select('#' + id).fields({ size: true }, (data) => {
					this.num++
					let dataHeight = data.height<=this.maxHieght?data.height:this.maxHieght
					let status = {
						superLong:false,
						textHeight:0
					}
					if (data.height>this.maxHieght) {//为防有人恶意上传很长的图片霸屏，当盒子高度(图片+文字)大于maxHieght时，将盒子定死在maxHieght高
						status.superLong = true//图片是否超长
						const textId = 'waterfalls-text-id-' + this.list[index][this.idKey]
						const query = uni.createSelectorQuery().in(this)
						query.select('#' + textId).fields({ size: true }, (textData) => {
							status.textHeight = textData.height//超长的图片记住文字的高度
						}).exec()
					}
					this.$set(this.statusArr,index, status)
					this.$set(this.allHeightArr, index, dataHeight)
					if (this.num === this.list.length) {
						for (let i = this.oldNum; i < this.num; i++) {
							const getTopArrMsg = () => {
								const arrtmp = [...this.topArr].sort((a, b) => a - b)
								return {
									shorterIndex: this.topArr.indexOf(arrtmp[0]),
									shorterValue: arrtmp[0],
									longerIndex: this.topArr.indexOf(arrtmp[this.cols - 1]),
									longerValue: arrtmp[this.cols - 1]
								}
							}
			
							const { shorterIndex, shorterValue } = getTopArrMsg()
							const position = {
								top: shorterValue + 'px',
								left: (data.width + this.offset) * shorterIndex + 'px'
							}
							this.$set(this.allPositionArr, i, position)
							this.topArr[shorterIndex] = shorterValue + this.allHeightArr[i] + this.offset
							this.height = getTopArrMsg().longerValue - this.offset
						}
						this.oldNum = this.num
						// 完成渲染 emit `image-load` 事件
						this.$emit('image-load')
					}
				}).exec()
			},500)

        },
        refresh() {
            const arr = []
            for (let i = 0; i < this.cols; i++) {
                arr.push(0)
            }
            this.topArr = arr
            this.num = 0
            this.oldNum = 0
        },
		// 区分 视频Or图片 true为视频 false为图片
		diffPicOrVideo(item) {
			const ext = item.split('.').slice(-1)[0].toLowerCase()
			const videoExt = ['.wmv', '.asf', '.asx', '.rm', '.rmvb', '.MPEG', '.mp4', '.3gp', '.mov', '.m4v', '.avi', '.dat', '.mkv', '.flv', '.vob', '.webm', '.ogg'];
			// console.log('item--',item, ext, videoExt.includes(ext))
			return videoExt.includes(`.${ext}`)
		},
    }
}
</script>
<style lang="scss" scoped>
// 这里可以自行配置
$border-radius: 24rpx;

.waterfalls-box {
    position: relative;
    width: 100%;
    overflow: hidden;
    .waterfalls-list {
        width: calc((100% - var(--offset) * (var(--cols) - 1)) / var(--cols));
        position: absolute;
        background-color: #fff;
        border-radius: $border-radius;
        // 防止刚开始渲染时堆叠在第一幅图的地方
        left: calc(-50% - var(--offset));
        .waterfalls-list-image {
            width: 100%;
            will-change: transform;
            border-radius: $border-radius $border-radius 0 0;
            display: block;
            &.single {
                border-radius: $border-radius;
            }
        }
    }
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

</style>
