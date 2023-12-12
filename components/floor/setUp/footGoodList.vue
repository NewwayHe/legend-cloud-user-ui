<template>
    <!-- /*
     * @Descripttion:(楼层组件：商品列表)
	 * parmas.foot.type == 'goodList'才显示该楼层
    */ -->
    <view class="scrollFlag" :style="{ '--themescolor': parmas.themeColor }" >
		<!-- 顶部tab栏（父元素及祖上盒子不能用overflow: visible之外的值 否则sticky会失效） -->
		<view class="flex-start font-28 text-nowrap overflow-h"
		    :style="{backgroundColor: tabBackgroundColor}"
			v-if="floors.tabsShow"
		>
		<!-- 以下top的逻辑只写到兼容parmas.head.type == 'searchAndTab'的情况，其它两种头部情况未写完。
			而且如果用到position-sticky，当在页面在未加载完时迅速向下滚动(页面元素未加载完成)再点击tabs元素时，会出现$pageScrollTo计算错误的问题(该bug由于性能问题，无法解决) -->
			<ls-tabs
			    className="w-100"
			    :current="current" 
			    :list="tempList" 
			    :bgColor="'transparent'"
			    :lineShow="floors.tabsType=='line'" 
			    :pills="floors.tabsType=='pills'" 
			    :pillsScale='1.3'
				:activeStyle="{color:floors.tabCurThemeColor?'':floors.tabCurColor}"
				:inactiveStyle="{color:floors.tabNoCurColor}"
				:lineColor="floors.tabCurThemeColor?'':floors.tabCurColor"
				lineBottom="15%"
			    @change="changeTab"
			    v-if="tempList&&tempList.length>1"
			 />
             <template v-else>
                <view class="w-100 h-80r d-flex a-center font-28 text-center" 
                    :style="{ color: floors.tabNoCurColor}"
                    v-if="floors.type == '商品分类'||floors.type == '分类'"
                >
                    <view class="flex-1 flex-center" @click="sortGood('multiple')">
                        <text :style="{color:apiCategoryParams.sortBy == 'multiple'?curTabColor:''}">默认</text>
                    </view>
                    <view class="flex-1 flex-center" @click="sortGood('buys')">
                        <text :style="{color:apiCategoryParams.sortBy == 'buys'?curTabColor:''}">销量</text>
                    </view>
                    <view class="flex-1 flex-center" @click="sortGood('price')">
                        <text style="padding-bottom: 6rpx;" :style="{color:apiCategoryParams.sortBy == 'price'?curTabColor:''}">价格</text>
                        <view class="ml-1 scale-07">
                            <view class="iconfont icon-caret-top" 
                                :style="{color:apiCategoryParams.sortBy == 'price' && !apiCategoryParams.descending?curTabColor:''}"
                                style="font-size: 20rpx;margin-bottom: -12rpx;"
                            ></view>
                            <view class="iconfont icon-caret-bottom" 
                                :style="{color:apiCategoryParams.sortBy == 'price' && apiCategoryParams.descending?curTabColor:''}"
                                style="font-size: 20rpx;"
                            ></view>
                        </view>
                    </view>
                </view>
				
				<view class="w-100 h-80r d-flex a-center font-28 text-center"
				    :style="{ color: floors.tabNoCurColor}"
				    v-if="floors.type == '商品分组'"
				>
				    <view class="flex-1 flex-center" @click="sortGroupGood('')">
				        <text :style="{color:apiGroupParams.sort == ''?curTabColor:''}">默认</text>
				    </view>
				    <view class="flex-1 flex-center" @click="sortGroupGood('buys')">
				        <text :style="{color:apiGroupParams.sort == 'buys'?curTabColor:''}">销量</text>
				    </view>
				    <view class="flex-1 flex-center" @click="sortGroupGood('min_price')">
				        <text style="padding-bottom: 6rpx;" :style="{color:apiGroupParams.sort == 'min_price'?curTabColor:''}">价格</text>
				        <view class="ml-1 scale-07">
				            <view class="iconfont icon-caret-top" 
				                :style="{color:apiGroupParams.sort == 'min_price' && !apiGroupParams.descending?curTabColor:''}"
				                style="font-size: 20rpx;margin-bottom: -12rpx;"
				            ></view>
				            <view class="iconfont icon-caret-bottom" 
				                :style="{color:apiGroupParams.sort == 'min_price' && apiGroupParams.descending?curTabColor:''}"
				                style="font-size: 20rpx;"
				            ></view>
				        </view>
				    </view>
				</view>
            </template>
        </view>
        <view class="pt-2 w-100" :class="[floors.mode == '2' ? 'd-flex flex-wrap pl-2' : 'px-2']"
            :style="{ backgroundColor: listBackgroundColor }" 
            @touchstart="touchstar" @touchend="touchend"
        >
            <ls-load-more className="w-100 mb-4" :status="paging.status" v-if="list && list.length">
                <view :class="[floors.mode == '2' ? 'd-flex flex-wrap' : '']">
                    <view
                        v-for="(item, index) in list"
                        :key="index"
                        class="bg-white rounded-24 translate3d0 mb-2 overflow-h"
                        :class="[floors.mode == '2' ? 'mr-2 flex-col-start' : 'flex-between p-2']"
                        :style="{ height: floors.mode == '2' ? '' : '220rpx', width: floors.mode == '2' ? 'calc(50% - 20rpx)' : '' }"
                         @click="goGoodsDetail(item)"
                    >
                        <view :class="[floors.mode == '2' ? 'w-100 h-0 pb-100pre position-relative' : 'mr-2']">
							<view :class="[floors.mode == '2' ? 'position-absolute left-0 w-100 h-100 overflow-h' : 'rounded-10 translate3d0 overflow-h',]">
								<ls-image
									:options="{ w: floors.mode == '2' ? '100.5%' : '180', h: floors.mode == '2' ? '100.5%' : '180' }"
									:osOptions="{ w: 500, h: 500 }"
									:src="pic(item)"
								 />
							</view>
                        </view>
                        <view class="h-100 flex-col-between overflow-h position-relative" :class="[floors.mode == '2' ? 'w-100 p-2' : 'flex-1']">
                            <view class="line-clamp2 font-28">{{ name(item) }}</view>
                            <view class="pt-1 flex-between font-20 overflow-h text-nowrap w-100">
                                <view class="flex-1 overflow-x-scroll d-flex a-end j-start">
                                    <view
                                        v-if="price(item)"
                                        :style="{ color: parmas.themeColor }"
                                    >
                                        ￥
                                        <text class="font-32">{{ price(item)[0] }}</text>
                                        <text v-if="price(item)[1]">.{{price(item)[1]}}</text>
                                    </view>
                                    <view v-if="item.originalPrice" class="line-through text-999 pl-1" style="margin-bottom: 2rpx;">
                                        {{ item.originalPrice }}
                                    </view>
                                </view>
                                <text class="iconfont icon-gouwuche bg-white" style="font-size: 36rpx" :style="{ color: parmas.themeColor }" />
                            </view>
                        </view>
                    </view>
                </view>
            </ls-load-more>
			<!-- 备注：这个ls-empty还是不要传:paging="paging"，因为在请求装修页面接口时已经加入了loading图 -->
            <ls-empty :title="'暂无列表信息'" v-if="paging.error||paging.emptylist"/>
        </view>
    </view>
</template>

<script>
import { mapState } from 'vuex'
    
import pageUtils from '@/utils/pageUtils.js';
import floorMixin from '@/mixins/floor.js';
import { trim } from '@/api/ModulesCommon.js';
import { search } from '@/api/ModuleGoods.js'
const listPageGroup = new pageUtils(trim.trimGroupProductPage,{notReset:true});
const listPageCategory = new pageUtils(search.searchProduct,{notReset:true})
const scrollLoad = false//是否开启滚动到该楼层时才请求接口加载功能。当很多个楼层时，prodList组件在小程序端用jugeRefresh的话有可能会出现白屏，而且由于已经做了图片懒加载功能，其实一开始调用所有接口，并不会浪费太多流量
export default {
    components: {},
    mixins: [floorMixin],
    filters: {},
    props: {
        floors: {
            type: Object,
            default: () => {
                return {}
            }
        },
        parmas: {
            type: Object,
            default: () => {
                return {}
            }
        },
        scrollTop: {
            type: [String, Number],
            default: 0
        },
        shopId: {//如果有传shopId，则是店铺装修的组件
            type: [String,Number],
            default: ''
        },
		conHeight: {
			type: [String, Number,Boolean],
			default: 0 //setUpHead组件的占位符高度
		},
		isSwiper: {
			type: [Boolean,String, Number,],
			default: false
		},
    },
    data() {
        return {
            activeName: 'second',

            // feed楼层专用数据
            apiGroupParams: {
                //查询分组接口时需要传入的参数
                groupId: '', //商品分组ID
				descending: false,
				sort:''// '' 默认排序  // min_price 价格排序  //buys 销量排序
            },
            apiCategoryParams: {
                //查询分类接口时需要传入的参数
                categoryId: '', //分类Id
                key: '', // 搜索词
                descending: false,
                sortBy: 'multiple' // multiple 默认排序  // price 价格排序  //sale 销量排序
            },
            list: [],
            paging: {
                status: 'loading',
                error: false, // 是否错误
                emptylist: false // 是否显示列表为空时的样式
            },
            current:0,//默认选中tab的下标,这个要在getData()里赋值，不然刷新页面的时间不更新下划线
            windowHeight: 0, // 可视区的高
            // top:0,//tab栏的高度
            rangeTop: 0, // 距离顶部
            loadState: false, // 是否加载过(运行过getData()方法)
            topState: false,//是否已经拿了tab栏的top值
            touchstarE:{
                clientX:0,//记录划点击位置距离当前body可视区域的x坐标
                clientY:0,//记录划点击位置距离当前body可视区域的y坐标
            },
        }
    },
    computed: {
        ...mapState(['stausBarHeight']),
        themeRGB(){
            const colorTemp = this.$utils.color.colorRgb(this.parmas.themeColor)
            return colorTemp
        },
        tempList() {
            let list = []
            if (this.floors.type == '商品分组') {
                list = this.floors.idList.map((item) => {
                    return item.name
                })
            } else if (this.floors.type == '商品分类'||this.floors.type == '分类') {
                list = this.floors.categoryIdList.map((item) => {
                    return item.name[item.name.length - 1]
                })
            }
            // console.log(list);
            return list
        },
        tabBackgroundColor() {//组件tabs栏的背景色
           return this.floors.tabBgThemeColor?this.parmas.themeColor:this.floors.tabBgColor?this.floors.tabBgColor:this.listBackgroundColor
        },
        listBackgroundColor() {//组件tab栏下面的ls-load-more列表的背景色
           return this.parmas.foot && this.parmas.foot.backgroundColor ? this.parmas.foot.backgroundColor : ''
        },

        curTabColor() {//tab栏选中的按钮的颜色
            return this.floors.tabCurThemeColor ? this.parmas.themeColor : this.floors.tabCurColor
        },
        name() {//统一管理商品名字
            return function(item) {
                return (item.productName || item.name) ? (item.productName || item.name) : '商品示例名名称'
            }
        },
        pic() {//统一管理商品图片
            return function(item) {
                return  item.pic || item.image || item.productPic
            }
        },
        price() {//统一管理商品价格
            return function(item) {
                let arr = []
                if (item.price&&item.price.toString().indexOf("~")!=-1) {//判断money是否为1.00~2.00的模式
                    arr = [item.price,'']
                }else{
                    arr = this.$stringUtils.formatNumber(item.price ? item.price : 999)
                }
                return  arr
            }
        },
    },
    watch: {
        'floors.type': {
            handler(newValue, oldValue) {
                if (newValue == '商品分组') {
                    if (this.floors.idList && this.floors.idList.length) {
                        this.apiGroupParams['groupId'] = this.floors.idList[0].id
                    }
                }
                if (newValue == '商品分类') {//如果是商城分类
                    if (this.floors.categoryIdList && this.floors.categoryIdList.length) {
                        this.apiCategoryParams['categoryId'] = this.floors.categoryIdList[0].id[this.floors.categoryIdList[0].id.length - 1]
                    }
                }
                if (newValue == '分类') {//如果是店铺分类
                    if (this.floors.categoryIdList && this.floors.categoryIdList.length) {
                        this.apiCategoryParams['shopCategoryId'] = this.floors.categoryIdList[0].id[this.floors.categoryIdList[0].id.length - 1]
                        this.apiCategoryParams['shopIds'] = [this.shopId]
                    }
                }
                if (this.loadState&&scrollLoad) {
                    this.loadState = false
                    this.$nextTick(()=> {
                        this.jugeRefresh()
                    })
                }
            },
            deep: true,
            immediate: true
        },
        scrollTop(val) {
            // 备注:如果下面这个是-20的话，店铺装修如果刚好该组件在页面下一点，会有触发不到getData()的bug。
			if (scrollLoad) {
				if (!this.loadState && this.rangeTop <= (this.windowHeight + val + 500)) {
				    this.getData()
				}
			}
            
            // if (!this.topState&& this.rangeTop <= this.windowHeight + val - 20) {
            //     this.$nextTick(()=>{
            //         this.updateScrollChange();//获取tab栏的高度
            //     })
            // }
        },
    },
    mounted() {
        this.$nextTick(()=> {
			if (scrollLoad) {
				// 不加setTimeout的话,this.rangeTop有可能会算不准(因为其它例如热区/商品列表等楼层也要获取ref的,要等他们获取完后,该楼层的top值才能算准)
				setTimeout(()=>{
					this.jugeRefresh()
				},100)
			} else{
				this.getData()
			}
        })
    },
    
    destroyed() {},
    methods: {
        async jugeRefresh() {
            // 获取可视区的高
            const SystemInfo = uni.getSystemInfoSync()
            this.windowHeight = SystemInfo.windowHeight
        
            // 获取组件的尺寸信息
            const tabRect = await this.$utils.getRect(this, '.scrollFlag')
            this.rangeTop = tabRect.top + this.scrollTop||0
            // console.log('rangeTop~~~~~~~~',this.rangeTop);
            if (this.windowHeight >= this.rangeTop) {
                this.getData()
            }
        },
        getData() {
            this.loadState = true
            if (this.floors.type == '商品分组') {
                listPageGroup.loadListByPage(this, this.apiGroupParams,{complete:()=>{ uni.stopPullDownRefresh(); }})
            }
            if (this.floors.type == '商品分类'||this.floors.type == '分类') {
                listPageCategory.loadListByPage(this, this.apiCategoryParams,{complete:()=>{ uni.stopPullDownRefresh(); }})
            }
			//当在页面在未加载完时迅速向下滚动(页面元素未加载完成)再点击tabs元素时，会出现$pageScrollTo计算错误的问题(该bug由于性能问题，无法解决，所以先屏幕)
			//if(this.top&&this.scrollTop>this.top){
				// this.$emit('pageScrollTo',this.top)
			//}
        },
        
        // 切换tabs
        changeTab(item) {
            this.current = item.index
            if (this.floors.type == '商品分组') {
                this.apiGroupParams['groupId'] = this.floors.idList[item.index].id
            }
            if (this.floors.type == '商品分类') { //如果是商城分类
                this.apiCategoryParams['categoryId'] = this.floors.categoryIdList[item.index].id[this.floors.categoryIdList[item.index].id.length - 1]
            }
            if (this.floors.type == '分类') {//如果是店铺分类
                this.apiCategoryParams['shopCategoryId'] = this.floors.categoryIdList[item.index].id[this.floors.categoryIdList[item.index].id.length - 1]
            }
            this.getData()
        },
        // 排序(商品分类)
		sortGood(type) {
			if (type == 'price') {
				if (this.apiCategoryParams.sortBy != 'price') {
					this.apiCategoryParams.descending = true
				} else {
					this.apiCategoryParams.descending = !this.apiCategoryParams.descending
				}
				this.apiCategoryParams.sortBy = type
			} else {
				if (this.apiCategoryParams.sortBy == type) {
					return
				} else {
					this.apiCategoryParams.sortBy = type
				}
				this.$set(this.apiCategoryParams, 'sortBy', this.apiCategoryParams.sortBy)
				this.$set(this.apiCategoryParams, 'descending', true)
			}
			this.getData()
		},
		// 排序(商品分组)
		sortGroupGood(type){
			if (type == 'min_price') {
			    if (this.apiGroupParams.sort != 'min_price') {
			        this.apiGroupParams.descending = true
			    } else {
			        this.apiGroupParams.descending = !this.apiGroupParams.descending
			    }
			    this.apiGroupParams.sort = type
			} else {
			    if (this.apiGroupParams.sort == type) {
			        return
			    } else {
			        this.apiGroupParams.sort = type
			    }
			    this.$set(this.apiGroupParams, 'sort', this.apiGroupParams.sort)
			    this.$set(this.apiGroupParams, 'descending', true)
			}
			this.getData()
		},
        touchstar(e){
            if(e.changedTouches[0]){
                this.touchstarE.clientX = e.changedTouches[0].clientX
                this.touchstarE.clientY = e.changedTouches[0].clientY
            }
        },
        touchend(e){
            if(e.changedTouches[0]&&Math.abs(e.changedTouches[0].clientY - this.touchstarE.clientY)<50){
                if (e.changedTouches[0].clientX - this.touchstarE.clientX<-50) {//向左划
                    if(this.current==(this.tempList.length-1)) return
					this.changeTab({index:this.current+1})
                }
                if (e.changedTouches[0].clientX - this.touchstarE.clientX>50) {//向右划
                    if(this.current==0) return
					this.changeTab({index:this.current-1})
                }
            }
        },
		// updateScrollChange() {//获取tab栏的高度
		//     this.topState = true
		//     this.$nextTick(()=>{
		//         setTimeout(() => {
		//             uni.createSelectorQuery()
		//                 .in(this)
		//                 .select('.position-sticky')
		//                 .boundingClientRect((res) => {
		//                     if (res) {
		//                        this.top = res.top + (this.scrollTop || 0) - (this.parmas.category=='POSTER'&&this.isSwiper?0:this.conHeight)
		//                        // console.log('top~~~~~~~~',this.top);
		//                     }
		//                 })
		//                 .exec()
		//         }, 0)
		//     })
		// },
        //父组件的onReachBottom(上拉触底事件的处理函数)里触发该方法，该方法不能删，不然会报错
        pageMore(){
            if (this.list&&this.list.length) {
                if (this.floors.type == '商品分组') {
                    listPageGroup.loadListByPageMore();
                }
                if (this.floors.type == '商品分类'||this.floors.type == '分类') {
                    listPageCategory.loadListByPageMore();
                }
            }
        },
        // 商品详情
        goGoodsDetail(item) {
            uni.navigateTo({
                url: `/ModuleGoods/goodsDetail/goodsDetail?id=${item.productId}`
            })
        },
    }
}
</script>

<style lang="scss" scoped>
</style>
