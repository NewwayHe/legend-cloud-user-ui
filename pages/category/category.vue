<template>
    <view class="w750 flex-col-start h-100vh" style="padding-bottom: calc(100rpx + var(--safe-area-inset-bottom))" :style="{ '--themescolor': themes.color }">
		<!-- 头部 -->
		<ls-header :showBack="false">
			<view class="w-100 flex-between px-2 h-100 bg-white" >
				<view class="flex-1 flex-start bg-bg rounded-50 h-60r position-relative" @click="$navigateTo(`/ModuleGoods/search/search`)">
					<view class="pr-1 pl-2 position-absolute">
						<text class="iconfont icon-sousuo text-ccc" style="font-size: 28rpx;"></text>
					</view>
					<view class="font-24 text-bbb pl-6">搜索商品|类目|店铺</view>
				</view>
			</view>
		</ls-header>
		<!-- /头部 -->
		
		<!-- 一级分类：有图模式才用以下这段代码 -->
		<template v-if="categorySetTemp.category == 1&&categorySetTemp.schema">
			<!-- 一级分类：有图并有商品列表 -->
			<view style="height: 192rpx;" v-if="categorySetTemp.goods">
				<!-- 一级分类商品内容的3种情况 -->
				<view class="position-fixed w-100 zindex-9999" :style="{ top: `calc(${ 88 }rpx + ${ stausBarHeight}px)` }">
					<!-- 顶部分类列表 -->
					<view class="bg-fff" :class="isShowCates ? '' : 'd-flex'" :style="{ 'border-bottom-left-radius': isShowCates ? '24rpx' : '', 'border-bottom-right-radius': isShowCates ? '24rpx' : '' }" style="border-bottom: 10px solid #f8f8f8;">
						<view v-if="isShowCates" class="px-2 flex-between pb-3 pt-2">
							<view>全部分类</view>
							<view @click="isShowCates = false">
								<text class="font-24 mr-1">收起</text>
								<text class="iconfont icon-ArrowUp" style="font-size: 20rpx;"></text>
							</view>
						</view>
						<view class="" :class="isShowCates ? 'w-100' : 'my-2 w-90'">
							<scroll-view scroll-with-animation class="scroll-row" :scroll-x="!isShowCates" :scroll-y="isShowCates" :style="{ height: isShowCates ? '660rpx' : '' }" :scroll-left="scrollLeft">
								<view class="d-flex px-2" :class="isShowCates ? 'flex-wrap' : ''">
									<view :id="'cateItem' + index" @click="changeTopCates(index)" class="d-flex flex-shrink flex-column j-center a-center" :class="[index == categoryArr.length - 1 ? '' : '', isShowCates ? 'w-25 pb-4' : 'mx-2 w-110r']" v-for="(item, index) in categoryArr" :key="item.id">
										<ls-image :lazyLoad="false" :options="{ w: `${isShowCates ? '120' : '90'}`, h: `${isShowCates ? '120' : '90'}`, br: '10',bg:currentCate == index?themes.rgb02:'#e4e4e4' }" :src="item.icon" :key="index"/>
										<view class="mt-1 px-2 rounded-20 font-24" :class="currentCate == index ? 'bg-main text-fff' : ''">
											<text class="text-nowrap">{{ item.name.substr(0, 4) }}</text>
										</view>
									</view>
								</view>
							</scroll-view>
						</view>
						<view v-if="!isShowCates && categoryArr.length >= 5" class="flex-1 font-24 flex-col-center bg-fff" @click="showCates">
							<view>全</view>
							<view>部</view>
							<text class="iconfont icon-ArrowDown" style="font-size: 12rpx;"></text>
						</view>
					</view>
				</view>
				<!-- 这个是遮罩层，给遮罩层添加@touchmove.stop.prevent可以 -->
				<view @touchmove.stop.prevent class="position-fixed top-0 bottom-0 left-0 right-0 h-100vh w-100vw" style="z-index: 88; background-color: rgba(0, 0, 0, .4);" v-if="isShowCates" @click="isShowCates = false"></view>
			</view>
		</template>

		<view class="d-flex w-100 font-28 flex-1 overflow-h position-relative" :class="categorySetTemp.goods ? '' : 'border-top border-f8'" v-if="categoryArr&&categoryArr.length">
			<!-- 左边栏 -->
			<view v-if="(categorySetTemp.category == 1 && !categorySetTemp.schema) || categorySetTemp.category != 1" class="w-200r text-center text-333 h-100 overflow-y bg-f7">
				<view class="overflow-h h-100" ref="menuWrapper">
				    <scroll-view scroll-y :scroll-into-view="scrollToBrand" class="position-relative h-100" >
				        <view
				            :class="[' position-relative', { curActive: currentIndex == index, 'curActive-0': currentIndex === 0 }, { 'bg-fff': index == currentIndex - 1 || index == currentIndex + 1 }]"
				            @click="choseClassify(index, categoryArr[index].id)"
				            v-for="(item, index) in categoryArr"
				            :key="index"
				        >
							<!-- 第一个分类上面要加弧度，所以弄一个view盒子实现 -->
							<!-- v-show="currentIndex == 0 && index == 0" -->
							<view v-if="index == 0" :style="{ 'background-color': currentIndex == 0 ? '#fff' : '#f6f7f8' }" class="h-20r">
								<view class="h-100" :class="{ 'curActiveBefore': index == 0 }"></view>
							</view>
							<!-- 弧度实现：
								1、点击了某一个分类，让它上一个分类和下一个分类的盒子的背景颜色变成白色
								2、然后让里面包裹字体的view盒子添加背景颜色#f6f7f8
								3、上一个分类就加border-top-right-radius
								4、下一个分类就加border-bottom-right-radius
							 -->
							<!-- 每一项分类 -->
							<view class="py-3" :class="{'curActiveBefore': index == currentIndex - 1, 'curActiveAfter': index == currentIndex + 1}" >
								<text class="" :class="currentIndex == index ? 'font-28' : 'font-24'">{{ item.name }}</text>
							</view>
				        </view>
						<view v-if="categoryArr.length > 0" id="cateBrand" :class="{ 'bg-fff': currentIndex == categoryArr.length - 1 || currentIndex == categoryArr.length}">
							<view
							    :class="['py-3', ' position-relative', { 'curActive': currentIndex == categoryArr.length, 'curActiveAfter': currentIndex == categoryArr.length - 1, 'bg-fff': currentIndex == categoryArr.length}]" :style="{ 'background-color': currentIndex == categoryArr.length ? '#fff' : '#f6f7f8' }" 
							    @click="choseClassify(categoryArr.length)"
							>
								<text class="" :class="categoryArr.length == currentIndex ? 'font-28' : 'font-24'">品牌分类</text>
							</view>
						</view>
						<!-- 品牌分类下面的弧度盒子 -->
						<view v-if="currentIndex == categoryArr.length" :style="{ 'background-color': currentIndex == categoryArr.length ? '#fff' : '#f6f7f8' }" class="h-20r">
							<view class="h-100" :class="{ 'curActiveAfter': currentIndex == categoryArr.length }"></view>
						</view>
				    </scroll-view>
				</view>
				
            </view>
			<!-- 右边栏 -->
            <scroll-view class="flex-1 h-100 position-relative" @scrolltolower="scrollBottom" scroll-y>
				<!-- 下面这个view不能加overflow-h，不然下面的position-sticky会失效 -->
                <view class="bg-white" ref="foodsWrapper">
					<!-- 展示二、三级分类 -->
                    <template v-if="categorySetTemp.category != 1">
						<!-- 分类广告 -->
						<catAdvert :categoryId="params.categoryId" :key="currentIndex"  v-if="categorySetTemp.showCatAdvert&&categoryArr.length != currentIndex"/>
						<template v-if="showData.children&&showData.children.length">
							<view class="px-2">
								<view class="d-flex flex-wrap px-1 font-24" :class="categorySetTemp.category == 3 ? '' : 'mt-4'">
									<!-- 不能用view标签包裹循环，否则会独占一行，无法实现所有3级分类都在同一模块 -->
									<block v-for="(item, index) in showData.children" :key="index">
										<!-- 需要作为占位符，否则App情况下二级分类无法正常显示内容 -->
										<view class="w-0 h-0"></view>
										<view class="font-weight w-100 font-28 mt-4 mb-2" v-if="categorySetTemp.category === 3" @click="enterSearch(item.id)">{{ item.name }}</view>
										<!-- <view class="font-weight w-100" > 标题 </view> -->
										<view class="d-flex flex-column a-center px-1 w-100" :class="!categorySetTemp.schema? 'w-50' : 'w-33'" v-for="(item1, index1) in item.children" :key="index1" @click="enterSearch(item1.id)">
											<ls-image :src="item1.icon" :options="{w:120,h:120,br:20}" v-if="categorySetTemp.schema" :key="item1.id"/>
											<view class="my-2" :class="!categorySetTemp.schema? 'bg-fff w-100 py-1 text-center rounded-100 text-333 border border-e4 px-2' : ''">
												<text class="line-clamp1">{{ item1.name }}</text>
											</view>
										</view>
									</block>
								</view>
							</view>
						</template>
						<ls-empty className="w-100 center-y" :type="2" v-else-if="categoryArr.length != currentIndex"/>
                    </template>
					<!-- 展示一级分类 -->
					<template v-if="categorySetTemp.category == 1">
						<!-- 分类广告 -->
						<catAdvert :height="categorySetTemp.schema?223:160" :categoryId="params.categoryId" v-if="categorySetTemp.showCatAdvert&&categoryArr.length != currentIndex" :key="currentIndex"/>
						<!-- 一级分类的筛选栏 -->
						<!-- 下面筛选栏的点位符:position-fixed时才显示 -->
						<!-- <view v-if="!(categorySetTemp.schema&& categorySetTemp.goods == false)" :class="!categorySetTemp.showCatAdvert?'position-fixed':'position-sticky'" class="h-80r w-100  zindex-99" :style="{ top: `calc(${(categorySetTemp.schema && categorySetTemp.goods)?(88 + 192):88}rpx + ${stausBarHeight-3}px)` }"> -->
						<view class="position-sticky bg-white top-0 w-100 zindex-2" v-if="categorySetTemp.goods">
							<sortGood v-model="searchQuery" :categorySet="categorySetTemp" @getData="getData"></sortGood>
						</view>
						<!-- </view> -->
						
						<!-- 一级分类：有图+不显示列表 -->
						<view v-if="categorySetTemp.schema && !categorySetTemp.goods">
							<view>
								<view class="d-flex flex-wrap px-1 font-24" :class="categorySetTemp.category == 3 ? '' : 'mt-4'">
									<block v-for="(item, index) in categoryArr" :key="index">
										<view class="flex-col-center px-1 w-25" @click="choseClassify(index, categoryArr[index].id)">
											<ls-image :options="{ w: '120', h: '120', br: '20' }" :src="item.icon" :key="item.id"/>
											<view class="my-2" :class="!categorySetTemp.schema ? 'bg-fff w-100 py-1 text-center rounded-100 text-333 border border-e4' : ''">
												{{ item.name }}
											</view>
										</view>
									</block>
								</view>
							</view>
						</view>
						
						<!-- 一级分类商品列表 -->
						<!-- currentIndex != categoryArr.length - 1 && !(categorySetTemp.schema && categorySetTemp.goods == false) -->
						<view v-if="(!(categorySetTemp.schema && !categorySetTemp.goods)) && (currentIndex != categoryArr.length)">
							<!-- 商品列表循环项 -->
							<ls-load-more :status="paging.status" v-if="list && list.length">
								<view class="d-flex border-f1-bottom-x20r p-2" :class="categorySetTemp.schema ? 'h-220r' : 'h-200r'" v-for="(item, index) in list" :key="index" @click="goGoodsDetail(item)">
									<view>
										<ls-image :options="{ w: categorySetTemp.schema ? '180' : '160', h: categorySetTemp.schema ? '180' : '160', br: '12' }" :src="item.productPic" :key="index"/>
									</view>
									<view class=" w-100 text-333 font-28 ml-2 flex-col-between">
										<text class="line-clamp2">{{ item.productName }}</text>
										<view class="text flex-between w-100">
											<view>
												<!-- :price="saleItem.price" -->
												<ls-price :price="item.price" :options="{ is: 32 }" />
												<!-- <text class="line-through text-999" :class="horizontal ? 'ml-1' : 'd-block ml-0'" v-if="parmas.originalPrice">￥{{parmas.originalPrice}}</text> -->
												<text v-if="categorySetTemp.schema && categorySetTemp.goods" class="line-through text-999 font-24 ml-1">￥{{item.originalPrice}}</text>
											</view>
											<view class="w-50r h-50r bg-f5 rounded-circle flex-center"><text class="iconfont icon-gouwuche font-sm text-333 text-right mr" style="font-size: 28rpx"></text></view>
										</view>
									</view>
								</view>
							</ls-load-more>
							<ls-empty className="pt-20" :title="'暂无商品'" :type="1" :width="256" :height="191" :paging="paging" @reLoad="getData" reLoad/>
						</view>
					</template>
					
					<!-- 左侧分类滚动条最后一个品牌分类 -->
                    <view class="px-2 pt-2" v-if="categoryArr.length == currentIndex">
                        <view><text class="font-weight">品牌分类</text></view>
						<view class="d-flex flex-wrap px-1 font-24 mt-2" v-if="brandList&&brandList.length">
							<view
								class="d-flex flex-column w-33 px-1"
								v-for="(item, index2) in brandList"
								:key="index2"
								@click="enterSearch(item.id, 'brand')"
							>
								<view class="flex-center">
									<ls-image :src="item.brandPic" :options="{w:120,h:120,br:20}" :key="index2"/>
								</view>
								<view class="mb-1 mt-1 text-center w-100">{{ item.brandName }}</view>
							</view>
						</view>
						<ls-empty className="w-100 mt-15" title="暂无品牌分类" :type="2" v-else/>
                    </view>
                </view>
            </scroll-view>
        </view>
		<ls-empty className="center-xy" :title="'暂无商品分类'" :type="1" :paging="catPaging" @reLoad="getCategory" reLoad/>
        <!-- <tabBar class="position-fixed zindex-9999" ref="commentTabbat" :active="'category'"></tabBar> -->
		<!-- 底部栏 -->
		<tabBar ref="commentTabbat" />
    </view>
</template>

<script>
import { mapState } from 'vuex'
import { goodCategory, search } from '@/api/ModuleGoods.js'
import pageUtil from '@/utils/pageUtils.js'
import catAdvert from './components/catAdvert.vue'
import sortGood from './components/sortGood.vue'
import tabBar from '@/components/common/tabbar/tabbar.vue'
const listPage = new pageUtil(search.searchProduct)
export default {
    components: { tabBar,catAdvert,sortGood },
    data() {
        return {
            categoryArr: [], // 分类
            brandList: [], // 品牌
            params: {
                categoryId: '',
                curPageNO: 1
            },
            paging: {
                status: 'loading',
                error: false, // 是否错误
                emptylist: false // 是否显示列表为空时的样式
            },
			list: [], // 商品数据
            currentIndex: 0, // 左侧分类选中的索引值
			current: 0, // 默认选中tab的下标
			searchQuery: {
			    key: '', // 搜索词
			    descending: false,
				// priceInterval: [], // 价格区间
			    sortBy: 'multiple' ,// multiple 默认排序(综合)  // price 价格排序  // sale 销量排序  // new 最新 // praise 好评
			},
			isShowCates: false, // 是否显示顶部分类，并且是否显示遮罩层
			currentCate: 0, // 当前顶部分类列表选中的索引值
			cateIndex: '', // 顶部分类scroll-view所用到的scroll-into-view，是每个循环项所绑定的id值，不能以数字开头
			scrollLeft: 0, // 顶部分类的滚动条位置
			categorySetTemp:{
				// category: 3,//展示分类，可接收的值：1(一级分类)，2(二级分类)，3(三级分类)
				// schema: 1,//展示模式，可接收的值：1(有图模式)，0(无图模式)
				// showCatAdvert: 1,//展示分类广告，可接收的值：1(展示)，0(关闭)
				// goods: 0,//展示商品列表(category==1时才用到该值)，可接收的值：1(展示)，0(关闭)。
			},
			catPaging: {
			    status: 'loading',
			    error: false, // 是否错误
			    emptylist: false // 是否显示列表为空时的样式
			},
			isBrand: false,	//是否进入品牌分类
        }
    },
    computed: {
        ...mapState(['stausBarHeight', 'wxMenuBut','systemConfig','categorySet']),
        showData() {
            return this.categoryArr[this.currentIndex] || []
		},
		// 如果是 [isBrand=true商品品牌] 则滚动到商品品牌
		scrollToBrand() {
			return this.isBrand ? 'cateBrand' : ''
		}
	},
	watch: {
		"currentIndex"(newIndex) {
			if (!newIndex == this.categoryArr.length) {
				this.params.categoryId = this.categoryArr[newIndex].id
			}
		}
	},
    created() {},

    onLoad(option) {
		// tabbar的页面跳转不能传参 所以要将参数通过storage来存储
		// this.isBrand = option.isBrand ? true : false; 	// 如果是进入品牌分类
		try {
		    const switchOpt = uni.getStorageSync('floors-switch-option');
		    if (switchOpt && switchOpt.isBrand) {
				this.isBrand = switchOpt.isBrand
		    }
			uni.removeStorage({ key: 'floors-switch-option'}) //用完即删
		} catch (e) {
			console.error('商品品牌获取storageOption失败')
		}
		this.getBrands()
		// (this.brandList.length > 0 && this.category == 'one') ? this.getBrands() : ''
		
		// 获取分类设置
		if (!this.$u.test.isEmpty(this.categorySet)) {
			this.categorySetTemp = this.categorySet
			this.getCategory()
		}else{
			this.$store.dispatch('getCategorySet').then(res=>{
				if (res.code&&res.data) {
					this.categorySetTemp = res.data
					this.getCategory()
				}
			});
		}
    },

    mounted() {},

    onShow() {
		this.$nextTick(()=>{
			this.$refs.commentTabbat.setCurRoute()//这个是为了解决小程序端animate_动画播放过后，再次点击时，动画不生效的bug。
		})
    },

    onPullDownRefresh(e) {},

    // 自定义好友分享。
    // #ifdef MP
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            // console.log(res.target);
        }
        return {
            title: this.systemConfig&&this.systemConfig.domainName  ? this.systemConfig.domainName  : '',
            path: this.$utils.pages.getPageRoute().url
        }
    },
    // #endif

    methods: {
        // 父组件的onLoad(页面加载)里触发该方法，该方法不能删，不然会报错
        getData() {
			listPage.loadListByPage(this, {...this.searchQuery, ...this.params })
			//搜索商品
        },
		// 获取商品分类
        getCategory() {
			this.catPaging = {
			    status: 'loading',
			    error: false, // 是否错误
			    emptylist: false // 是否显示列表为空时的样式
			},
            goodCategory.getCategory({ parentId: -1 }).then((res) => {
                if (res.code) {
					this.categoryArr = res.data
					this.params.categoryId = res.data[0].id
					this.getData()
                    this.$nextTick(()=> {
                        if (this.isBrand) {
                            // 进页面时直接显示品牌分类
                            this.currentIndex = this.categoryArr.length
                        }
                    })
                }else{
					this.catPaging.errMsg = res.msg
				}
            }).catch((err) => {
				this.catPaging.error = true
				this.catPaging.errMsg = err.response&&err.response.data&&err.response.data.msg
			}).finally((res) => {
				this.catPaging.status = 'noMore'
				if (!this.$checkInfo([{ type: 'hasValue', value: this.categoryArr }])) {
					this.catPaging.emptylist = true
				}
			});
        },

		// 获取品牌
        getBrands() {
            goodCategory
                .allOnline()
                .then((res) => {
                    if (res.code == 1) {
                        this.brandList = res.data
                    }
                })
                .finally(() => {
                    uni.stopPullDownRefresh()
                })
        },
		// 左侧分类点击事件
        choseClassify(index, id) {
			this.$pageScrollTo()
			// 如果是一级分类无商品列表且是有图模式，则此时页面只显示有图片的一级分类，这时点击一分类，跳转到商品搜索列表
			if (this.categorySetTemp.category==1&&!this.categorySetTemp.goods&&this.categorySetTemp.schema) {
				this.enterSearch(id)
			}else{
				this.params.categoryId = id
				this.initialize() // 重置
				if (this.currentIndex != index) { // 避免重复点击调用多次接口
					this.currentIndex = index
					if (this.categorySetTemp.category == 1 && this.currentIndex != this.categoryArr.length) {
						this.getData()
					}
				}
			}
        },

        // 搜索列表
        enterSearch(id, type) {
            if (type == 'brand') {
				uni.navigateTo({ url: `/ModuleGoods/search/searchList?brandId=${id}` })
            } else {
				uni.navigateTo({ url: `/ModuleGoods/search/searchList?categoryId=${id}` })
            }
        },

        initialize() {
            this.params.curPageNO = 1
        },
		scrollBottom(){
			listPage.loadListByPageMore()
		},
		// 点击不同的顶部分类
		changeTopCates(index) {
			// 收起
			this.isShowCates = false;
			// 异步修改scroll-view的滚动条的位置
			setTimeout(() => {
				this.scrollLeft = (index - 1) * 60;
			}, 0)
			// 改变索引值
			this.currentCate = index;
			this.params.categoryId = this.categoryArr[index].id
			this.getData()
		},
		// 展开分类或者收起
		showCates() {
			this.isShowCates = !this.isShowCates;
		},
		// 一级分类时，点击展示列表的商品跳转到商品详情
		goGoodsDetail(event) {
			const id = event.productId
			uni.navigateTo({ url: `/ModuleGoods/goodsDetail/goodsDetail?id=${id}` })
		},
		// 滚动到底部
		onReachBottom() {
			listPage.loadListByPageMore();
		}
    }
}
</script>

<style lang="stylus" scoped>
.curActive{
	background: #fff;
	font-weight 600;
	&:before {
	    content: " ";
	    display: block;
	    width: 8rpx;
	    height: 28rpx;
	    background: var(--themescolor);
	    position: absolute;
	    left: 0;
		top: 50%;
		transform translateY(-50%)
	    background: var(--themescolor);
	}
}
.curActive-0{
	&:before {
		top: 60%;
	}
}
.curActiveBefore {
	border-bottom-right-radius: 20px;
	background-color: #f6f7f8;
}
.curActiveAfter {
	border-top-right-radius: 20px;
	background-color: #f6f7f8;
}
</style>
