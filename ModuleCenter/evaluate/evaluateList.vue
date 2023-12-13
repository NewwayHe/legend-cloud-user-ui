<!-- 这个是改好后的UI 缺后端改造 不要删 -->
<template>
    <view :style="{ '--themescolor': themes.color }">
        <!-- 头部 -->
        <ls-header showHeadSelect title="我的评价"></ls-header>
		
		<!-- 顶部tab栏 -->
		<ls-tabs :current="curTab" :list="tabList" fixed @change="changeTab"/>

        <!-- 内容 -->
        <view class="safearea-bb">
            <ls-load-more :status="paging.status" v-if="!paging.emptylist">
				<view class="py-2 bg-fff mt-2" v-for="(li,liIdx) in list" :key='li.orderItemId'>
					<!-- 店铺区域 -->
					<view class="shopArea p-2 position-relative">
						<view class="flex-start" style="line-height: 40rpx;" @click="$navigateTo(`/ModuleGoods/shopHome/shopIndex?shopId=${li.shopId}`)">
							<text class="iconfont icon-dianpu mr-1" style="font-size: 32rpx; color: #000;"></text>
							<text class="d-inline-block v-middle line-clamp1 font-28 text-333" style="width: auto; max-width: 5.3rem;">{{ li.shopName ? li.shopName : '&nbsp;' }}</text>
							<text class="iconfont icon-ArrowRight text-333 ml" style="font-size: 20rpx;"></text>
						</view>
						<view
							class="h-120r w-120r rounded-circle position-absolute right-0 flex-col-center"
							style="color: #BABCC9;border: 4rpx solid #BABCC9;transform:rotate(-30deg);opacity: 0.8;top:-20rpx; right: 20rpx;"
							v-if="li.deleteType"
						>
							<view class="h-100r w-100r rounded-circle flex-col-center overflow-h" style="border: 4rpx solid #BABCC9;">
								<view class="px-5 text-nowrap" style="border-top:4rpx solid #BABCC9;border-bottom: 4rpx solid #BABCC9;">
									已删除
								</view>
							</view>
						</view>
					</view>
					
					<!-- 商品区域 -->
					<view class="goodArea p-2 flex-between" style="align-items: stretch;" @click="$navigateTo(`/ModuleGoods/goodsDetail/goodsDetail?id=${li.productId}`)">
						<ls-image
						    className="flex-shrink"
						    :options="{ w: '160', h: '160', br: '12' }"
						    :osOptions="{ w: 500, h: 500 }"
						    :src="li.prodPic"
						/>
						<!-- 待评价显示  -->
						<view class="text-000 font-28 ml-2 flex-1 flex-col-between" v-if="params.condition == 1">
						    <text class="line-clamp2">{{ li.productName || '' }}</text>
							<view class="a-self-end" @click.stop="()=>{}">
								<ls-button className="w-160r h-60r flex-center m-0" :ripple="false" hoverClass="none"
									text="评价"
									@click.stop="goEvaluate(li.id, 1, li.orderItemId)"
									:options="{ cl: themes.color, br: '30', ls: '3', fs: '24', bd: themes.color, pl: '0', pr: '0' }"></ls-button>
							</view>
						</view>
						<!-- 已评价/追评显示 -->
						<view v-else class="flex-1 flex-col-start ml-2 overflow-x-h">
							<text class="line-clamp1 text-000 font-28 mb-1">{{ li.productName || '' }}</text>
							<view class="font-24 flex-between w-100">
								<view class="text-333">
									<text class="mr-1">评分</text>
									<u-rate :count="5" :current="li.score" disabled active-color="#EE0A24" inactive-color="#C8C9CC" inactive-icon='star-fill' size='20'></u-rate>
								</view>
								<text class="text-999" v-if="li.anonymousFlag">已匿名</text>
							</view>
						</view>
					</view>
					
					<!-- 初评评论过才显示该区域 -->
					<template v-if="params.condition != 1">
						<!-- 评论区域 -->
						<view class="commArea p-2">
							<text class="text-333 font-24">{{ li.content }}</text>
							<view v-if="li.photoList.length" class="mt-2">
								<scroll-view style="white-space: nowrap; width: 95%;" scroll-x @scroll="scrollTest($event, liIdx, 'first')">
									<view class="d-flex position-relative">
										<ls-image
											v-for="(pic,pIdx) in li.photoList"
											:key="pic"
											:src="pic"
											:options="{ w: '160', h: '160', br: '12' }"
											:customStyle="{flex: '0 0 160rpx', marginRight: '12rpx'}"
											@click='previewImg(pIdx, li.photoList)'
										/>
										<view v-show="li.photoList.length > 3"
											class="position-absolute picMask flex-center" 
											:style="{
												'visibility': listPicMask[liIdx]['first_sLeft'] > 40 ? 'hidden': 'visible',
												'opacity': listPicMask[liIdx]['first_sLeft'] > 40 ? '0': listPicMask[liIdx]['first_sLeft'] > 20 ? '0.6' : '1',
												'transition': 'all 0.4s linear 0.1s'
											}"
											@click.stop="previewImg(3, li.photoList)"
										 >
											<text>共5张<text class="iconfont icon-ArrowRight ml" style="color: #fff;font-size:20rpx;"></text></text>
										</view>
									</view>
								</scroll-view>
							</view>
						</view>
						
						<!-- 追评区域[li.status == 0 代表平台未审核初评 ==1 则代表平台已审核初评] -->
						<view v-if="li.commFlag && li.status == 1" :class="['addCommArea', 'p-2', { 'flex-between' : li.commFlag && !li.addCommFlag && li.status == 1 }]">
							
							<template v-if="li.commFlag && !li.addCommFlag && li.status == 1">
								<text class="text-999 font-24 flex-1">您还可以进行追评</text>
								<view>
									<ls-button className="w-160r h-60r flex-center m-0" :ripple="false" hoverClass="none"
										text="评价"
										:options="{ cl: themes.color, br: '30', ls: '3', fs: '24', bd: themes.color, pl: '0', pr: '0' }"
										@click.stop="goEvaluate(li.id, 3, li.orderItemId, li.addId)"
									>
									</ls-button>
								</view>
							</template>
							
							<template v-else-if="li.commFlag && li.addCommFlag">
								<text class="text-999 font-24">追评：{{ li.addContent }}</text>
								<view v-if="li.addPhotoList.length" class="mt-2">
									<scroll-view style="white-space: nowrap; width: 95%;" scroll-x @scroll="scrollTest($event, liIdx, 'add')">
										<view class="d-flex position-relative">
											<ls-image
												v-for="(pic,pIdx) in li.addPhotoList"
												:key="pic"
												:src="pic"
												:options="{ w: '160', h: '160', br: '12' }"
												:customStyle="{flex: '0 0 160rpx', marginRight: '12rpx'}"
												@click='previewImg(pIdx, li.addPhotoList)'
											/>
											<view v-show="li.addPhotoList.length > 3"
												class="position-absolute picMask flex-center" 
												:style="{ 
													'visibility': listPicMask[liIdx]['add_sLeft'] > 40 ? 'hidden': 'visible',
													'opacity': listPicMask[liIdx]['add_sLeft'] > 40 ? '0': listPicMask[liIdx]['add_sLeft']> 20 ? '0.6' : '1',
													'transition': 'all 0.4s linear 0.1s'
												}"
												@click.stop="previewImg(3, li.addPhotoList)"
											>
												<text>共5张<text class="iconfont icon-ArrowRight ml" style="color: #fff;font-size:20rpx;"></text></text>
											</view>
										</view>
									</scroll-view>
								</view>
							</template>
						</view>
						
					</template>
				</view>
				
            </ls-load-more>
            <ls-empty className="center-xy" :title="'暂无评论'" :paging="paging" @reLoad="getData" reLoad/>
        </view>
    </view>
</template>

<script>
import { mapState } from 'vuex'
import pageUtil from '@/utils/pageUtils.js'
import { evaluate } from '@/api/ModulesUser'
const listPage = new pageUtil(evaluate.getEvaluateList)
export default {
	name: 'EvaluateList',
    components: { },
    data() {
        return {
            params: {
                condition: 1
            },
            list: [],
			listPicMask: [],	// 创建对应的列表图片属性{ sLeft: 0 } 用于控制展开第五张图片
            paging: {
                status: 'loading',
                error: false, // 是否错误
                emptylist: false ,// 是否显示列表为空时的样式
				total: 0
            },
			curTab: 0,	// 当前选中的Tab
            // tabList: ['全部', '待评论', '待追评', '已追评'],
			tabList: ['待评价', '已评价/追评'],
        }
    },

    computed: {
        ...mapState(['stausBarHeight', 'isBackRefresh'])
    },
	watch: {
		list(nL, oL) {
			console.log('nL--', nL)
			const nLen = nL.length; const oLen = oL.length;
			if(nLen) {
				const nArray = []; const nArr = nL.slice(oL.length);
				for(let i = 0, len = nLen - oLen; i < len; ++i) {
					nArray.push({
						id: nArr[i].orderItemId,	// 这个必须要加ID 否则scroll-view的scroll-left会全部一致
						// sLeft: [0,0],	//不能用数组 因为页面侦测不到变化
						first_sLeft: 0,	// [初评]滚动距离
						add_sLeft: 0		// [追评]滚动距离
					})
				}
				// this.listPicMask = [...this.listPicMask, ...new Array(nLen - oLen).fill({ isClick: false, sLeft: 0})]
				this.listPicMask = [...this.listPicMask, ...nArray];
				// console.log('listPicMask--', this.listPicMask)
				if(this.curTab == 0) {
					// 必须使用一个新变量来改变数组 否则页面上的tabList不会重新渲染
					// 使用key值会导致滑动动画有bug
					const newTabList = ['已评价/追评']
					this.$nextTick(() => {
						newTabList.unshift('待评价' + (this.paging.total > 0 ? `(${this.paging.total})` : ''))
						this.tabList = newTabList;
					})
				}
			}else {
				this.listPicMask = []
			}
		}
	},

    onLoad(options) {
        // 从待评论进来则选中对应tab
        if (options.condition) {
            this.params.condition = options.condition
        }
		this.getData()
    },
    onShow() {
		if(this.isBackRefresh) {
			console.log('重刷数据')
			// this.params.condition = this.$data.condition
			this.$nextTick(() => {
				this.getData()
			})
		}
    },
    // 下拉加载
    onReachBottom() {
        listPage.loadListByPageMore()
    },
    methods: {
		getData(){
			listPage.loadListByPage(this, this.params)
		},
        // 改变tab
        changeTab(item) {
            this.params.condition = item.index + 1;
			// this.params.condition = 3;
			this.curTab = item.index;
			this.listPicMask = [];
            this.getData()
        },
        // 去评论（查看评论）
        goEvaluate(id, type, orderItemId, addId) {
            // type：1=去评论，2=查看评论 3=去追评， 4=查看追评
            uni.navigateTo({ url: `/ModuleCenter/evaluate/addEvaluate?id=${id}&operation=${type}&orderItemId=${orderItemId}&addId=${addId}` })
        },
		// 预览图片
		previewImg(cur, pics) {
			console.log('preview--', cur, pics)
			uni.previewImage({
			    current: cur,
			    urls: pics.map(each => this.photoServer + each)
			})
		},
		// e: 滚动参数 liIdx: 当前是数据第几项 type: 'first'初评, 'add'追评
		scrollTest(e, liIdx, type = 'first') {
			// console.log('滚动到最后--', e, liIdx , type)
			if(type == 'first') {
				this.listPicMask[liIdx]['first_sLeft'] = e.detail.scrollLeft;
			}else {
				this.listPicMask[liIdx]['add_sLeft'] = e.detail.scrollLeft;
			}
			// console.log('this--', this.listPicMask[liIdx])
		},
    },
}
</script>

<style>
	page {
	    background-color: var(--backgroundcolor);
	}
</style>

<style lang="scss" scoped>
.commArea, .addCommArea {
	.picMask {
		top: 0;
		right: 0;
		width: 160rpx;
		height: 160rpx;
		border-radius: 12rpx;
		background: rgba(0,0,0,.5);
		color: #fff;
		font-size: 24rpx;
		font-weight: 500;
	}
}
</style>
