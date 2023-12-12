<template>
	<!-- 注意，下面的zIndex:-1，是为了当传paging时并且className传pb-12时，会有一个pb-12的元素档在页面上的，这时要把它层级调到最低 -->
	<!-- zIndex:!paging.error&&!paging.emptylist?-1:'' -->
    <view class="w-100 flex-col-center" :style="[{'--themescolor': color||themes.color,'--elcolor':elColor,backgroundColor:bgColor}]">
		<!-- 与ls-load-more列表加载组件一起用时 -->
		<template v-if="!$u.test.isEmpty(paging)">
			<!-- loading时 -->
			<template v-if="paging.status=='loading'">
				<!-- 骨架屏 --商品详情 -->
				<template v-if="skeleton=='商品详情'">
					<view class="w-100vw h-100vh overflow-h flex-col-start skeleton-fade">
						<view class="w-100 bg-elColor flex-col-center" style="height: 750rpx;">
							<!-- <view class="w-200r h-200r position-relative">
								<loadingCss :type="loadingType" color="#ccc"/>
							</view> -->
						</view>
						<view class="p-2 w-100 flex-1 flex-col-start">
							<view class="flex-between w-100">
								<view class="span-8 h-88r bg-elColor"></view>
								<view class="w-88r h-88r bg-elColor rounded-circle"></view>
							</view>
							<view class="mt-2 w-100 h-200r bg-elColor"></view>
							<view class="mt-2 w-100 flex-between">
								<view class="span-10 h-20r bg-elColor"></view>
								<view class="span-8 h-20r bg-elColor"></view>
							</view>
							<view class="mt-2 span-17 h-100r bg-elColor"></view>
							<view class="mt-2 w-100 flex-1 bg-elColor"></view>
						</view>
					</view>
				</template>
				<!-- 骨架屏 --首页 -->
				<template v-else-if="skeleton=='首页'">
					<view class="w-100vw h-100vh overflow-h flex-col-start skeleton-fade">
						<view class="w-100 bg-elColor" :style="{height:stausBarHeight + 'px'}" style="opacity: 0.6;"></view>
						<view class="w-100 px-4 py-2 bg-elColor flex-center" style="opacity: 0.6;">
							<view class="h-56r rounded-100 bg-white flex-1"></view>
							<!-- 如果是是微信端，放一个胶囊的点位符 -->
							<!-- #ifdef MP -->
							<view :style="{ width: wxMenuBut.placeholder + 'px', display: 'block' }"></view>
							<!-- #endif -->
						</view>
						<view class="w-100 bg-elColor flex-col-center h-400r"></view>
						<view class="w-100 px-2 mt-2 grid-column5 grid-gap10p">
							<view class="w-100 pb-100pre position-relative" v-for="item in 10" :key="item">
								<view class="position-absolute left-0 top-0 w-100 h-100 bg-elColor rounded-10"></view>
							</view>
						</view>
						<view class="w-100 px-2 mt-2 grid-column2 grid-gap10p">
							<view class="w-100 pb-100pre position-relative" v-for="item in 2" :key="item">
								<view class="position-absolute left-0 top-0 w-100 h-100 bg-elColor rounded-10"></view>
							</view>
						</view>
						<view class="w-100 px-2 mt-2 grid-column2 grid-gap10p">
							<view class="w-100 h-30r bg-elColor rounded-5" v-for="item in 4" :key="item">
							</view>
						</view>
						<view class="w-100 px-2 mt-2 grid-column3 grid-gap10p">
							<view class="w-100 pb-100pre position-relative" v-for="item in 3" :key="item">
								<view class="position-absolute left-0 top-0 w-100 h-100 bg-elColor rounded-10"></view>
							</view>
						</view>
						<view class="w-100 mt-2 flex-1 bg-elColor"></view>
					</view>
				</template>
				<template v-else>
					<view class="flex-col-center" :class="[className]" :style="[cssStyle]">
						<view class="h-100r w-100r">
							<loadingCss :type="loadingType" :color="color||themes.color"/>
						</view>
					</view>
				</template>
			</template>
			<!-- 接口错误时 -->
			<template v-else-if="paging.error&&reLoad">
				<view class="flex-col-center w-100" :class="[className]" :style="[cssStyle]">
					<view class="pt-5 flex-center">
						<text class="iconfont icon-tanhao" style="color: #CCCCCC;font-size: 200rpx;"></text>
					</view>
					<view class="text-999">
						{{errorTxt}}
					</view>
					<slot name="but">
						<ls-button className="border border-main text-main mt-2 mx-3 py-15r rounded-100" @click="reLoading" v-if="reLoad">{{reLoadBut}}</ls-button>
					</slot>
				</view>
			</template>
			<!-- 没有数据时 -->
			<template v-else-if="paging.emptylist||paging.error">
				<view class="flex-col-center w-100" :class="[className]" :style="[cssStyle]">
					<view class="pt-5">
					    <image :style="{width: `${width}rpx`,height:`${height}rpx`}" :src="require(`@/static/images/empty/type${type}.png`)" mode=""></image>
					</view>
					<view class="font-28 text-999 pt-2 pb-5 text-center">{{title}}</view>
					<slot></slot>
				</view>
			</template>
		</template>
		<!-- 单纯只显示为空时 -->
		<template v-else>
			<view class="flex-col-center w-100" :class="[className]" :style="[cssStyle]">
				<view class="pt-5">
				    <image :style="{width: `${width}rpx`,height:`${height}rpx`}" :src="require(`@/static/images/empty/type${type}.png`)" mode=""></image>
				</view>
				<view class="font-28 text-999 pt-2 pb-5 text-center">{{title}}</view>
				<slot></slot>
			</view>
		</template>
    </view>
</template>

<script>
import loadingCss from '@/static/cssImage/loadingCss.vue';
import { mapState } from 'vuex'
export default {
    name: 'ls-empty',
    components: {loadingCss},
	// #ifdef MP-WEIXIN
	// 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性。这时在<组件name> 里加style和class是不会生效的
	options: { virtualHost: true },
	// #endif
    data() {
        return {
            pic: ''
        }
    },
    props: {
        title:{
			type:String,
			default: '暂无数据'
		},

		//与ls-load-more同用
		paging: {
			type: Object,
			default: () => {}
		},
		reLoad: {//当paging.error时，是否显示“重新加载”按钮(特别注意：写@reLoad时，一定要加上reLoad=true)
			type: Boolean,
			default: false
		},
		//自定义‘重新加载’按钮的文字
		reLoadBut:{
			type:String,
			default: '重新加载'
		},
		//自定义paging.error时显示的文字
		errorTxt:{
			type:String,
			default: '请求失败'
		},
		className:{
			type: [String, Array,Boolean],//这里加个Boolean，是因为如果传className=""，小程序端会报错
			default: ''
		},
        bgColor: { // 背景颜色，默认为灰色
            type: String,
            default: 'transparent'
        },
        width: { // 图片的宽度(单位rpx)
            type: [String,Number],
            default: 310
        },
        height: { // 图片的宽度(单位rpx)
            type: [String,Number],
            default: 232
        },
        type: { // 选择哪种类型作为默认空图片，1:空的盒子，2：空的订单，3：搜索为空，4：无活动，5：无网络，6：无消息，7：无优惠券
            type: [String,Number],
            default: 1
        },
		// 自定义样式，对象形式
		cssStyle: {
		    type: Object,
		    default() {
		        return {};
		    }
		},
		// loading的样式,3dot：三个旋转的点，flower：旋转的花，atom：3D原子
		loadingType:{
			type: String,
			default: '3dot'
		},
		// 指定骨架屏的样式(如果不传值则采用loadingCss的loading图)--可用值：'商品详情'
		skeleton:{
			type: String,
			default: ''
		},
		// 骨架屏 需要渲染的元素背景颜色，十六进制或者rgb等都可以
		elColor: {
			type: String,
			default: '#e5e5e5'
		},
		color:String,
    },
	computed: {
	    ...mapState(['stausBarHeight','wxMenuBut'])
	},
    created() { },
    onReady() {
        // console.log('备注：只有‘小程序’才走onReady');
        // this.setPic()
    },

    mounted() {
        // console.log('备注：‘H5+app’只走mounted不走onReady');
        // this.setPic()
    },

    methods: {
		reLoading(){
			this.$emit('reLoad')//(特别注意：写@reLoad时，一定要加上reLoad=true)
		}
	}
}
</script>

<style lang="scss" scoped>
	.bg-elColor{
		background-color: var(--elcolor);
	}
	.skeleton-fade {
		// width: 100%;
		// height: 100%;
		// background: rgb(194, 207, 214);
		animation-duration: 1.5s;
		animation-name: blink;
		animation-timing-function: ease-in-out;
		animation-iteration-count: infinite;
	}
	
	@keyframes blink {
		0% {
			opacity: 1;
		}
	
		50% {
			opacity: 0.4;
		}
	
		100% {
			opacity: 1;
		}
	}
</style>

<!-- 
用法：
	
    <ls-empty :title="'暂无列表信息'" v-if="Nomsg"/>
    
    <ls-empty :type='3' :bgColor="'var(--backgroundcolor)'" :title="'快来回复抢沙发'" v-if="Nomsg"/>
	
	有重新加载按钮：
	<ls-empty className="pt-20" :paging="paging" :title="'暂无搜索结果'" :type="3" :width="256" :height="191" @reLoad="getData" reLoad/>
-->
