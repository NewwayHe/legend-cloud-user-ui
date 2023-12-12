<template>
    <view :style="{ '--themescolor': themes.color,'--gradientcolor':themes.rgb07 }">
		<!-- showHeadSelect 放弃这个，否则会被下面的tab栏cover-view遮挡 -->
       <ls-header theme>
            <view class="flex-around flex-1">
                <view class="flex-1 flex-start pl-2 py mr-2 bg-white rounded-100">
                    <input class="w-100 pl-2" type="text" placeholder="搜索优惠券" placeholder-style="color:#bbbbbb; font-size:28rpx;" v-model="params.name" @keypress.native.enter="searchCoupon" />
					<text class="iconfont icon-sousuo text-ccc mr-2" style="font-size: 28rpx;" @click="searchCoupon"></text>
                </view>
            </view>
        </ls-header>
		
		<!-- 调试的话用view是没问题的，真机的话会出现cmd-circle组件穿透的问题-->
		<!-- #ifdef APP-PLUS -->
		<view v-if="!params.shopId" class="zindex-999 w-100 d-flex font-28 h-80r position-fixed left-0" style="background-color: #f2f2f2;" :style="{ top: `calc(88rpx + ${stausBarHeight}px)` }">
			<block v-for="(item,index) in [{name:'全部',type:''},{name:'店铺券',type:1},{name:'平台券',type:0}]" :key="index">
				<view class="flex-1 flex-center position-relative" :class="{ 'text-main': params.shopProviderFlag === item.type }" @click="checkType(item.type,index)">
					<view class="" :id="'tab-item-' + index">{{item.name}}</view>
				</view>
			</block>
			<view class="position-absolute left-0 bottom-0 bg-main transition-all02 rounded-100" :style="{height: `8rpx`,width: `${lineWidth}px`,transform: `translateX(${lineLeft}px)`}"></view>
		</view>
		<!-- #endif -->
		<!-- #ifndef APP-PLUS -->
		<cover-view v-if="!params.shopId" class="zindex-999 w-100 d-flex font-28 h-80r position-fixed left-0" style="background-color: #f2f2f2;" :style="{ top: `calc(88rpx + ${stausBarHeight}px)` }">
			<block v-for="(item,index) in [{name:'全部',type:''},{name:'店铺券',type:1},{name:'平台券',type:0}]" :key="index">
				<cover-view class="flex-1 flex-center position-relative" :class="{ 'text-main': params.shopProviderFlag === item.type }" @click="checkType(item.type,index)">
					<cover-view class="" :id="'tab-item-' + index">{{item.name}}</cover-view>
				</cover-view>
			</block>
			<cover-view class="position-absolute left-0 bottom-0 bg-main transition-all02 rounded-100" :style="{height: `8rpx`,width: `${lineWidth}px`,transform: `translateX(${lineLeft}px)`}"></cover-view>
		</cover-view>
		<!-- #endif -->
		<!-- 上面cover-view的点位符 店铺不需要 -->
		<view class="h-80r w-100" v-if="!params.shopId"></view>
		<!-- 如果是是微信端，放一个cover-view胶囊的点位符来接住cmd-circle组件穿透的问题 -->
		<!-- #ifdef MP -->
		<cover-view class="position-fixed right-0 top-0 zindex-999" :style="{ width: wxMenuBut.placeholder+8 + 'px',height: `calc(88rpx + ${stausBarHeight}px)`,background:themes.color }"></cover-view>
		<!-- #endif -->
		
        <view class="safearea-bb pb-12 pt-2">
			<ls-load-more :status="paging.status" v-if="!paging.emptylist">
				<couponItems className="mx-2 mb-2" v-model="list[index]" v-for="(item,index) in list" :key="item.id"></couponItems>
			</ls-load-more>
            <ls-empty className="center-xy" :title="'暂无相关优惠券'" :paging="paging" @reLoad="getData" reLoad/>
        </view>
		<!-- 我的优惠券按钮 -->
		<goCouponList/>
    </view>
</template>

<script>
// import couponItem from './components/couponItem.vue'
import couponItems from './components/couponItems.vue'
import goCouponList from './components/goCouponList.vue'
import { couponApi } from '@/api/ModuleCenter.js'
import pageUtil from '@/utils/pageUtils.js'
import { mapState } from 'vuex'

const listPage = new pageUtil( couponApi.couponReceivable )

export default {
    components: { goCouponList, couponItems },
    data() {
        return {
            params: {
                shopProviderFlag: '',
				name:'',
				shopId: '', //店铺Id
            },
            list: [],
            num: 0,
			paging: {
			    status: 'loading',
			    error: false, // 是否错误
			    emptylist: false // 是否显示列表为空时的样式
			},
			lineWidth:uni.upx2px(56),
			lineLeft:uni.upx2px(98),
        }
    },
    computed: {
        ...mapState(['stausBarHeight', 'wxMenuBut']),
    },
    watch: {},
    onLoad() {
        this.getData()
		this.$nextTick(()=>{
			this.init(0)
		})
    },
    mounted() {},
	
	 /**
	  * 页面上拉触底事件的处理函数
	  */
	onReachBottom() {
		listPage.loadListByPageMore()
	},
	
    methods: {
        // 优惠券列表
        getData() {
			this.params.shopId = this.$utils.pages.getPageRoute().options.shopId || ''
			if (this.params.shopId) {
				this.params.shopProviderFlag = true
			}
			listPage.loadListByPage(this, this.params)
        },

        // 搜索优惠券
        searchCoupon() {
            this.getData()
        },

        // 改变tab
        checkType(type,index) {
            this.params.shopProviderFlag = type
			this.init(index)
            this.$nextTick(()=>{
                this.getData()
            })
        },

		// 设置一个init方法，方便多处调用
		async init(index) {
			// 获取tabs组件的尺寸信息
			const lastItemRect = await this.$utils.getRect(this, `#tab-item-${index}`);
			this.lineWidth = lastItemRect.width//28
			this.lineLeft = lastItemRect.left//48.5
		},
     },
}
</script>

<style>page { background: #f2f2f2; }</style>
<style scoped>
</style>
