<template>
    <view class="w750" :style="{ '--themescolor': themes.color, '--themesrgba02': themes.rgb02 }">
		<!-- 顶部栏 -->
		<goodsHead :tabArr="tabArr" :scrollTop="scrollTop" :fixPoint="bannerBottom" :tabCur="tabIndex" @tabSelect="tabSelect" v-if="!isActiveHeadFixed" />
		
		<!-- 商品详情 -->
        <view class="class-page pb-12" v-show="goodDataHasValue">
			<!-- banner图 -->
			<goodsBanner class="class-banner" :brandParmas='brandParmas' :bannerPics="skuData.picList" :videoUrl="goodData.video" :key="skuData.skuItem.skuId"/>

			<!-- 活动商品详情banner图下的活动价格及倒计时(注意：如果不加v-if="skuData.skuItem.price"，则不能计算出activeHead里的ls-sticky的top值) -->
			<activeHead
				:skuType="parmas.skuType"
				:skuData="skuData"
				:goodData="goodData"
				@downCallback="getDetaildata"
				@isFixed="getIsFixed"
				v-if="(skuData.skuItem.activitySkuDTO&&skuData.skuItem.activitySkuDTO.price && parmas.activityId && parmas.skuType)||goodData.preSellProductBO"
			/>
			
			<!-- sku弹框及banner图下的主规格图片 -->
			<skuPopup ref="skuPopup" v-model="skuData" :skuType="parmas.skuType" source="good" :rawData="goodData" @change="changeSku">
				<view class="flex-1 h-100r flex-center px-2">
					<view class="w-100 h-80r flex-center rounded-100 overflow-h">
						<template v-if="showStartDate">
							<!-- 普通商品没库存时显示【到货通知】 -->
							<template v-if="stocksTemp <= 0 && !parmas.skuType">
								<text class="flex-1 h-100 bg-ccc text-white flex-center" @click="goProductArrivalNotice">到货通知</text>
							</template>
							<!-- 普通商品 -->
							<template v-else>
								<!-- 如果是普通商品，或者是预售商品并且在支付时间内 -->
								<template v-if="!goodData.preSellProductBO||(goodData.preSellProductBO&&goodData.preSellProductBO.status==1)">
									<!-- 如果是点击页面底部goodsTabBar里的加入购物车或立即购买 -->
									<template v-if="sourceType == 'addCart'||sourceType == 'buyNow'">
										<text class="flex-1 h-100" :class="skuData.haveSku?'but-main':'but-pe-none'" @click="normalGoodSure">确&emsp;定</text>
									</template>
									<!-- 如果是点击了skuDet‘已选’组件弹出sku弹框 -->
									<template v-if="sourceType == 'skuDet'">
										<text class="flex-1 h-100" :class="skuData.haveSku?'but-main-rgb02':'but-pe-none'" @click="addCart">加购物车</text>
										<text class="flex-1 h-100" :class="skuData.haveSku?'but-main':'but-pe-none'" @click="buyNow">立即购买</text>
									</template>
								</template>
								<!-- 如果是预售商品，并且不在预售支付时间内 -->
								<template v-else>
									<!-- 如果是‘定金尾款’支付 -->
									<template v-if="goodData.preSellProductBO.payPctType == 1">
										<text class="w-100 h-100 but-pe-none" v-if="goodData.preSellProductBO.depositStarts>currentTime">未到支付时间</text>
										<text class="w-100 h-100 but-pe-none" v-else-if="goodData.preSellProductBO.depositEnds<currentTime">已过支付时间</text>
									</template>
									<!-- 如果是‘全额’支付 -->
									<template v-else>
										<text class="w-100 h-100 but-pe-none" v-if="goodData.preSellProductBO.saleStart>currentTime">未到支付时间</text>
										<text class="w-100 h-100 but-pe-none" v-else-if="goodData.preSellProductBO.saleEnd<currentTime">已过支付时间</text>
									</template>
								</template>
							</template>
						</template>
						<template v-else>
							<text class="flex-1 h-100 but-pe-none">即将上线</text>
						</template>
					</view>
				</view>
			</skuPopup>

			<!-- 名称,价格,分销,描述 -->
			<goodInfo :parmas="goodData" :skuData="skuData" :skuType="parmas.skuType"/>

			<!-- 预售规则 -->
			<presellFloor className="border-top-20bg" :goodData="goodData" v-if="goodData.preSellProductBO"/>

			<!-- 已选：选择优惠券(只有普通商品才显示，活动商品不显示) -->
			<goodCoupon className="border-top-20bg" :list="tempCouponList" v-if="tempCouponList && tempCouponList.length && !parmas.skuType" />

            <!-- 促销 -->
            <view v-if="(promoObj.optionalLimitDiscountsMarketing && promoObj.optionalLimitDiscountsMarketing.length) || (promoObj.optionalRewardMarketingList && promoObj.optionalRewardMarketingList.length)">
                <!-- 有优惠券就不加顶部border -->
                <goodPromotion :promoData="promoObj" className="h-100r" :className="tempCouponList && tempCouponList.length && !parmas.skuType ? '' : 'border-top-20bg'"/>
            </view>
			
			<!-- 已选：选择sku -->
			<skuDet className="border-top-20bg" :sku-item="skuData.skuItem" :num="skuData.skuBuyNum" @showLayer="showSkuPopup('skuDet')" />
			
			<!-- 自提服务、运费 -->
			<view class="border-top-20bg font-28 text-333">
				<view class="mx-2 py-2 d-flex a-center">
					<text class="font-weight">运费</text>
					<text v-if="skuData.skuItem.freeFlag" class="mx-2 flex-1">免运费</text>
					<ls-price v-else :price="skuData.skuItem.freightPrice" :options="{ is: 28, ic: '#333', ds: 28, dc: '#333', iw: 400, dw: 400 }" className="mx-2 flex-1"/>
				</view>
			</view>
			
			<!-- 店铺信息 -->
			<shopInfo className="border-top-20bg" :shopData="shopData" v-if="shopData" />
			
			<!-- 商品咨询 -->
			<goodConsult className="border-top-20bg" :data="consultData" :list="goodData.productConsultList" v-if="consultData"/>

			<!--评论列表(只显示一个)，备注：class-comment不能写在className里，不然小程序会拿不到该元素的top值-->
			<goodComment class="class-comment" className="border-top-20bg" :prodId="parmas.productId" :num="1" v-if="goodDataHasValue"/>
				
			<!-- 商品详情 -->
			<view class="class-detail">
				<view class="border-top-20bg" v-if="goodData.paramGroupBOList || goodData.content">
					<!-- 商品参数 -->
					<goodParams :prodList="goodData.paramGroupBOList" />
					<!-- 商品介绍 -->
					<view class="py-4 font-weight font-32 text-333 pl-2">商品介绍</view>
					<view class="overflow-h">
						<!-- <parser class="font-28 text-333 word-breakall" :html="goodData.content" v-if="goodData.content">加载中...</parser> -->
						<u-parse class="font-28 text-333 word-breakall u-parse" :html="goodData.content" v-if="goodData.content"></u-parse>
					</view>
				</view>
			</view>

			<!-- 底部TabBar -->
			<goodsTabBar ref="goodsTabBar" :parmas="{ consultId: skuData.skuItem.id, consultType: 'prod', shopId: goodData.shopId, prodId: parmas.productId }" v-if="skuData.skuItem.id">
			    <!-- 没参与活动的普通正常商品能正常购买，参与团购和拼团的商品也能正常购买 -->
			    <view class="flex-1 flex-center h-100r overflow-h">
			        <view class="w-100 flex-center h-80r rounded-100 overflow-h mr-2 overflow-h">
			            <template v-if="showStartDate">
			                <template v-if="stocksTemp <= 0 && (!goodData.prodPropDtoList || !goodData.prodPropDtoList.length)&&!parmas.skuType">
			                    <!-- 单规格并且没库存时才在这里显示【到货通知】(多规则的【到货通知】是在popup里显示) -->
			                    <text class="flex-1 h-100 bg-ccc text-white flex-center" @click="goProductArrivalNotice">到货通知</text>
			                </template>
			                <!-- 普通商品 -->
			                <template v-else>
								<!-- 如果是普通商品，或者是预售商品并且在支付时间内 -->
								<template v-if="!goodData.preSellProductBO||(goodData.preSellProductBO&&goodData.preSellProductBO.status==1)">
									<view class="flex-1 h-100 but-main-rgb02" @click="showSkuPopup('addCart')">加购物车</view>
									<view class="flex-1 h-100 but-main text-center " :class="{'font-24':Boolean(skuData.skuItem.selfPurchaseAmount)}" @click="showSkuPopup('buyNow')">
										<view>
											<view>{{Boolean(skuData.skuItem.selfPurchaseAmount)&&goodData.selfPurchasedSwitch!='CLOSE'?(goodData.selfPurchasedSwitch=='SELF_PURCHASE_REBATE'?'自购返':'自购省'):'立即购买'}}</view>
											<text v-if="skuData.skuItem.selfPurchaseAmount">(￥{{skuData.skuItem.selfPurchaseAmount}})</text>
										</view>
									</view>
								</template>
								<!-- 如果是预售商品，并且不在预售支付时间内 -->
								<template v-else>
									<!-- 如果是‘定金尾款’支付 -->
									<template v-if="goodData.preSellProductBO.payPctType == 1">
										<text class="w-100 h-100 but-pe-none" v-if="goodData.preSellProductBO.depositStarts>currentTime">未到支付时间</text>
										<text class="w-100 h-100 but-pe-none" v-else-if="goodData.preSellProductBO.depositEnds<currentTime">已过支付时间</text>
									</template>
									<!-- 如果是‘全额’支付 -->
									<template v-else>
										<text class="w-100 h-100 but-pe-none" v-if="goodData.preSellProductBO.saleStart>currentTime">未到支付时间</text>
										<text class="w-100 h-100 but-pe-none" v-else-if="goodData.preSellProductBO.saleEnd<currentTime">已过支付时间</text>
									</template>
								</template>
			                </template>
			            </template>
			            <template v-else>
			                <text class="flex-1 h-100 but-pe-none">即将上线</text>
			            </template>
			        </view>
			    </view>
			</goodsTabBar>
			
			<!-- 回到顶部按钮 -->
			<backTop :scrollTop="scrollTop" :showScroll="220" bgColor="rgba(0,0,0,.3)" buttonFixed />
			
			<!-- 分享按钮 -->
			<ls-shares
				ref="goodShares" 
				zIndex="100" 
				:mpShareCode="{scene:{...parmas,invitationCode:invitationCode},page:$utils.pages.getPageRoute().route,flag:true}" 
				:shareinfos="shareInfo" 
				bgColor="rgba(0,0,0,.3)" 
				buttonFixed
			/>
        </view>
		
		<!-- 骨架屏 -->
        <ls-empty className="center-xy" :title="paging.errMsg" :paging="paging" skeleton="商品详情"  @reLoad="getDetaildata" reLoad/>
		
		<!-- 如果是商家端或PC后台跳进来预览，则加个遮罩层不让点击 -->
		<u-mask :show="isPreview" :duration="0" :custom-style="{background: 'rgba(0, 0, 0, 0)'}"></u-mask>
    </view>
</template>
<script>
// JS方法

// API接口
import { goodsApi } from '@/api/ModuleGoods.js';
import { orderApi } from '@/api/ModulesOrder.js';

// 楼层组件
import goodsHead from '@/components/goods/good-head.vue';
import goodsBanner from '@/components/goods/good-banner.vue';
import activeHead from '@/components/goods/active-head.vue';
import goodInfo from '@/components/goods/good-Info.vue';
import goodCoupon from '@/components/goods/good-coupon.vue';
import goodPromotion from '@/components/goods/good-promotion.vue'; // 促销
import goodComment from '@/components/goods/good-comment.vue';
import goodParams from '@/components/goods/good-params.vue';

// 活动专用楼层组件
import presellFloor from '@/components/goods/presell-floor.vue';

// 楼层功能组件
import skuDet from '@/components/goods/sku-det.vue';
import skuPopup from '@/components/goods/sku-popup.vue'; // sku促销
import shopInfo from '@/components/goods/shop-info.vue';
import goodConsult from '@/components/goods/good-consult.vue';
import goodsTabBar from '@/components/goods/good-tabBar.vue';
import backTop from '@/components/goods/back-top.vue';

import mpShare from '@/mixins/mpShare.js'
import { mapState } from 'vuex';

export default {
	name:'goodsDetail',
    components: { goodsHead, goodsBanner, activeHead, goodInfo, goodCoupon, goodPromotion, goodComment, goodParams, presellFloor, skuDet, skuPopup, shopInfo, goodConsult, goodsTabBar, backTop },
	mixins: [ mpShare ],
    data() {
        return {
            parmas: {
                productId: '', // SPU的商品id
                activityId: '', //活动id 拼团/团购/秒杀活动需传
                skuId: '', //秒杀skuId 秒杀活动需传
                skuType: '' ,//营销类型： 拼团/团购/秒杀活动需传 普通（''，普通商品的话值为空''，有值就是有活动） 团购（GROUP） 拼团（MERGE） 秒杀（SECKILL）
            },

            goodData: {}, // 获取商品详情(注意，这个要写成''，不能写成{}，不然判断该对象时内容为空但依然为true)

            scrollTop: '',

            bannerBottom: '', // 记录banner图部的位置，用来计算tabOpacity的值
            detailTop: '', // 用来记录商品介绍的位置
			commentTop: '', // 用来记录商品评论的位置

            tabIndex: 0, // goods-head插件专用，用来控制点击头部tab栏
            hasClickTab: false, // 记录是否已点击了goodsHead组件的tab栏

            skuData: {
                skuItem: {}, // SKU
                picList: [], // 图片列表
                skuBuyNum: 1
            },

            skuActivityDict: {}, // 优惠券和促销活动的一个大对象
            isActiveHeadFixed: false,

            showPopup: false,
			showPromoPopup: false, // 控制促销的弹出框的显示与隐藏
            sourceType: '', //点击事件的来源。'MERGEJoin'：拼团活动点击了mergeFloor组件里的'参团')
            ingOperatePage:'',//当活动已经结束，但又有待成团的订单还未成团时，该值为mergeFloor组件转过来的值(【用户】正在进行的拼团分页)
            marketId:'',//购物车选择的促销活动ID(普通订单立即购买以及其他订单类型不用传)
			// Nomsg: false, // 该商品是否下架
			paging: {
			    status: 'loading',
			    error: false, // 是否错误
				errMsg:'该商品已被删除或已被下线',
			    emptylist: false // 是否显示列表为空时的样式
			},
			materialUrl:'',//物料ID
			
			isPreview: false,//如果是shareUrlRedirect页面跳过来预览(商家端或PC后台跳进来)，就加个遮罩层防止点击
        };
    },

    computed: {
        ...mapState(['stausBarHeight', 'timeDiff','userInfo']),
        // 当前的时间戳
        currentTime() {
            return new Date().getTime() - this.timeDiff;
        },
        // 判断商品是否已经上线，商品上线时间小于等于当前时间(修正过的服务器时间)时，则为true
        showStartDate() {
			// this.goodData.appointTime后台返回的不是时间戳，需要new Date(this.goodData.appointTime)
            return this.goodData.appointTime ? new Date().getTime() - this.timeDiff >= new Date(this.goodData.appointTime) : true;
        },
        goodDataHasValue() {
            return this.$checkInfo([{ type: 'hasValue', value: this.goodData }]);
        },
        tabArr() {
            let arr = ['商品', '详情', '评价'];
            this.$nextTick(() => {
                //不加$nextTick的话如果是 ['商品', '详情', '评价']，会先变成 ['商品', '评价']再变回['商品', '详情', '评价']
                if (!this.goodData.content && !this.goodData.paramGroupBOList) {
                    arr = arr.filter(item => {
                        return item != '详情';
                    });
                }
            });
            return arr;
        },
        //传到优惠券组件的数组
        tempCouponList() {
            let arr = [];
            if (this.skuActivityDict && this.skuActivityDict[this.skuData.skuItem.id] && this.skuActivityDict[this.skuData.skuItem.id][0]) {
                arr = this.skuActivityDict[this.skuData.skuItem.id][0].couponDTOList;
            }
            return arr;
        },
		// 传到促销组件的对象
		promoObj() {
			let obj = {};
			if (this.skuActivityDict && this.skuActivityDict[this.skuData.skuItem.id] && this.skuActivityDict[this.skuData.skuItem.id][0]) {
			    obj = this.skuActivityDict[this.skuData.skuItem.id][0];
			}
			return obj;
		},
		// 传到banner图里的品牌参数
		brandParmas(){
			return {brandPic:this.goodData.brandPic,brandName:this.goodData.brandName,brandId:this.goodData.brandId}
		},
        stocksTemp() {//统一管理商品/活动商品库存
            let num = 0
            // 如果是活动商品就取activitySkuDTO.stocks值，如果是普通商品取stocks值
            num = (this.parmas.skuType&&this.skuData.skuItem.activitySkuDTO? this.skuData.skuItem.activitySkuDTO.stocks : this.skuData.skuItem.stocks) || 0
            return num
        },
        shareInfo() {// 给分享插件传的参数赋值
            let info = {}
            if(this.goodDataHasValue){
                info = {
                    skuType:this.goodData.preSellProductBO?'PRESELL':this.parmas.skuType,
                    shareTitle: this.goodData.name,
                    shareContent: this.goodData.shopDetailBO.shopName,
                    sharePictures: this.skuData.picList||this.goodData.pic,
                    id: this.goodData.id, // 商品分享 海报绘制专用
                    cash: (this.parmas.skuType&&this.skuData.skuItem.activitySkuDTO?this.skuData.skuItem.activitySkuDTO.price:this.price)||Number(this.goodData.price), // 现价，商品分享 海报绘制专用
                    price: (this.parmas.skuType&&this.skuData.skuItem.activitySkuDTO?this.skuData.skuItem.price:this.originalPrice)||Number(this.goodData.price), // 原价，商品分享 海报绘制专用
                    wxACode:this.goodData.wxACode,
					shareUrlParmas:{invitationCode:this.invitationCode||null},
					suggestion: this.goodData.distributionPosterSuggestions
                }
            }
            // console.log('shareInfo:',info);
            return info
        }, 
        shopData(){ // 传送到shopInfo组件的变量(注意请参考shopInfo组件的格式名字传里面的变量)
            let data = ''
            if(this.goodDataHasValue){
                data = {
                    type: 'common',
                    dvyTypeAvg: this.goodData.shopDetailBO.dvyTypeAvg,
                    productCommentAvg: this.goodData.shopDetailBO.productCommentAvg,
                    shopAvatar: this.goodData.shopDetailBO.shopAvatar,
                    shopCommAvg: this.goodData.shopDetailBO.shopCommAvg,
                    shopId: this.goodData.shopDetailBO.shopId,
                    shopName: this.goodData.shopDetailBO.shopName,
                    shopType: this.goodData.shopDetailBO.shopType,
					score: this.goodData.shopDetailBO.score
                }
            }
            return data
        },
        consultData(){ // 传送到consultData组件的变量(注意请参考consultData组件的格式名字传里面的变量)
            let data = ''
            if(this.goodDataHasValue){
                data = {
                    pic: this.goodData.pic,
					name:this.goodData.name,
					shopId:this.goodData.shopId,
					productId:this.parmas.productId,
                }
            }
            return data
        },
		
		// 邀请码(有parmas.skuType时会才用到该参数)
		invitationCode(){
			let str = ''
			if(this.userInfo){
				str = this.userInfo.distribution&&this.userInfo.distribution.invitationCode
			}
			return str
		},
		
		price(){
			// 如果有sku优惠折扣价格,则显示sku优惠折扣价格
			return this.skuData.skuItem.discountPrice||this.skuData.skuItem.discountPrice==0?this.skuData.skuItem.discountPrice:this.skuData.skuItem.price
		},
		originalPrice(){
			// 如果有sku优惠折扣价格,则划线价为现价
			return this.skuData.skuItem.discountPrice||this.skuData.skuItem.discountPrice==0?this.skuData.skuItem.price:this.skuData.skuItem.originalPrice
		}
    },

    watch: {
        // 监听切换SKU而触发的监听
        'skuData.skuItem': function() {},
    },

    async onLoad(option) {},
    mounted() {},
    onShow() {
		const options = this.$utils.pages.getPageRoute().options
		this.isPreview = options.isPreview ? true : false
		// #ifdef MP
		if (options.scene) return // 如果是扫小程序码进过来的,就在这里return掉。则用sceneCallBack()方法来执行getDetaildata()
		// #endif
		this.parmas = {
		   token: options.token||null, // 预览token
		   productId: options.id ||null, // SPU的商品id
		   activityId: options.activityId ||null, //活动id 拼团/团购/秒杀活动需传
		   skuId: options.skuId ||null, //秒杀skuId 秒杀活动需传
		   skuType: options.skuType||null, //营销类型： 拼团/团购/秒杀活动需传 普通（''，普通商品的话值为空''，有值就是有活动） 团购（GROUP） 拼团（MERGE） 秒杀（SECKILL）
		   viewDraft:options.viewDraft || null,//商家端查看草稿(未发布)
		};
		this.getDetaildata()//写在onShow里是为了防止进入分享链接重新登陆后无法显示参团
	},
    onHide() {},
    // #ifdef MP-WEIXIN
    // 自定义好友分享。
    onShareAppMessage(res) {
        return {
            title: `￥${this.parmas.skuType&&this.skuData.skuItem.activitySkuDTO?this.skuData.skuItem.activitySkuDTO.price:this.price} ${this.goodData.name}`,
            path: this.$utils.pages.getPageRoute().url+`&invitationCode=${this.invitationCode||null}`,
            imageUrl: this.photoServer + this.goodData.pic
        };
    },
    // #endif

    // 下拉加载
    onReachBottom() {},

    // 页面滚动执行方式
    onPageScroll(e) {
        // console.log(e.scrollTop);
        this.scrollTop = e.scrollTop;
        if (!this.hasClickTab) {
            this.changeTab(this.scrollTop); // 屏幕滚动到商品详情位置时，改变tab栏的下标
        }
    },
	
    /*  //监听页面返回(相当于vue原生的beforeRouteLeave)
    *   Android 实体返回键 (options.from = backbutton)
    *   顶部导航栏左边的返回按钮 (options.from = backbutton)
    *   返回 API，即 uni.navigateBack() (options.from = navigateBack) 
    *   注意：1、H5 平台，顶部导航栏返回按钮支持 onBackPress()，浏览器默认返回按键及Android手机实体返回键不支持 onBackPress()。2、暂不支持直接在自定义组件中配置该函数，目前只能是在页面中来处理。
    */
    onBackPress(options) {
        if (options.from === 'navigateBack' || options.from === 'backbutton') {
            //navigateBack：表示来源是 uni.navigateBack ；backbutton：表示来源是顶部导航栏左边的返回按钮 或 Android 实体返回键
            if (this.showPopup) {
                //如果有popup弹框，则点击物理返回键时，是关闭弹框而不是离开该页面
                this.$refs.skuPopup.changePopup();
                return true; //false：直接返回，true：阻止返回
            }
        }
    },
    
    methods: {
		// main.js里onLoad写的小程序解码后的回调(小程序分享扫码进来后，不走onLoad，是走这里)
		sceneCallBack(data){
			console.log('sceneCallBack：',data);
			this.parmas=data
			this.getDetaildata();
		},
		
		relationshipCallBack(materialUrl){
			this.materialUrl = materialUrl
		},

        // 获取页面初始数据
        getDetaildata(storeId = '') {
            // this.Nomsg = false;
            // console.log('正在调取接口')
            // console.log(this.parmas)
			this.paging = {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false ,// 是否显示列表为空时的样式
				errMsg:'该商品已被删除或已被下线',
			}
			this.goodData = {}//解决跳到店铺后，再跳回本页面时，原页面内容与骨架屏重叠显示的问题
            goodsApi.productViews(this.parmas).then(res => {
				// console.log('接口完成')
				if (res.code == 1) {
					this.goodData = res.data; // 原始数据

					// 获取所需楼层在屏幕中的位置
					this.getPosition();

					//获取优惠券详情(只有普通商品才显示优惠券，活动商品不显示优惠券)
					if (!this.parmas.skuType) {
						// 获取SKU的优惠券/促销
						goodsApi.marketingActivity({ productId: this.parmas.productId }).then(res => {
							if (res.code) {
								this.skuActivityDict = res.data;
							}
						});
					}
				}else{
					this.paging.errMsg = res.msg
				}
			}).catch((err) => {
				this.paging.error = true
				this.paging.errMsg = err.response&&err.response.data&&err.response.data.msg
			}).finally((res) => {
				this.paging.status = 'noMore'
				if (!this.$checkInfo([{ type: 'hasValue', value: this.goodData }])) {
					this.paging.emptylist = true
				}
			});
        },

        changeSku(flag) {
            this.showPopup = flag;
        },
        
        // 普通商品点击sku弹框里的"确定"
        normalGoodSure(){
            if (this.sourceType == 'addCart') {
                this.addCart()
            }
            if (this.sourceType == 'buyNow') {
                this.buyNow()
            }
        },
        
        // 购买
        buyNow() {
            this.$u.debounce(()=> {
                if (this.$refs.skuPopup.checkSKU()) {
                    let orderTypeObj = {'GROUP':'GROUP_SALE','MERGE':'MERGE_GROUP','SECKILL':'SECKILL'}
                    let orderType = this.parmas.skuType?orderTypeObj[this.parmas.skuType]:'ORDINARY'
					// 如果是预售
					if (!this.parmas.skuType&&this.goodData.preSellProductBO) {
						orderType = 'PRE_SALE'
					}
                    orderApi
                        .buyNow({
							deductionFlag: true,
                            orderType: orderType,//订单类型 ORDINARY:普通订单,PRE_SALE:预售订单,GROUP_SALE:团购订单,MERGE_GROUP:拼团订单,SECKILL:秒杀订单
                            buyNowFlag: true,//是否立即购买，普通下单传递
                            activityId:this.parmas.activityId,//营销活动ID[秒杀、团购、拼团、拍卖],普通下单不需要传递
                            confirmOrderItemDTOList: [//确认订单商品信息集合
                                {
                                    count: this.skuData.skuBuyNum,//商品数量
                                    skuId: this.skuData.skuItem.id,
                                    marketId:this.marketId,//购物车选择的促销活动ID(普通订单立即购买以及其他订单类型不用传)
                                }
                            ],
							materialUrl:this.materialUrl//物料ID
                        })
                        .then(res => {
                            console.log(res);
                            uni.navigateTo({ url: `/ModuleOrder/submitOrder/submitOrder?orderId=${res.data.id}` });
                        })
                        .catch(err => {
                            console.log(err);
                        });
                } else {
                    uni.showToast({ title: '请选择商品', icon: 'none' });
                }
            })
        },

        // 加入购物车
        addCart() {
            this.$u.debounce(()=> {
                if (this.$refs.skuPopup.checkSKU()) {
                    // console.log(this.skuData.skuItem.stocks);
                    if (this.stocksTemp == 0) {
                        //如果库存为0，弹出popup窗口让用户点‘到货通知’
                        this.$refs.skuPopup.changePopup();
                        return;
                    }
                    if (this.skuData.skuBuyNum <= this.stocksTemp) {
                        orderApi
                            .addCart({
                                count: this.skuData.skuBuyNum,
                                productId: this.parmas.productId,
                                shopId: this.shopData.shopId,
                                skuId: this.skuData.skuItem.id,
								materialUrl:this.materialUrl//物料ID
                            })
                            .then(res => {
                                uni.showToast({ title: '加入购物车成功', icon: 'success' });
                                this.$store.dispatch('getCartNum');
                                this.$refs.skuPopup.changePopup();
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    } else {
                        uni.showToast({ title: '商品库存不足', icon: 'none' });
                    }
                } else {
                    uni.showToast({ title: '请选择商品', icon: 'none' });
                }
            })
        },

        // 到货通知
        goProductArrivalNotice() {
            this.$u.debounce(()=> {
                uni.showModal({
                    content: '商品补充库存时通知我？',
                    confirmText: '确定',
                    cancelText: '取消',
                    success: (res)=> {
                        if (res.confirm) {
                            goodsApi.productArrivalNoticeSave({ skuId: this.skuData.skuItem.id }).then(res => {
                                if (res.code == 1) {
                                    uni.showToast({ title: '操作成功！', icon: 'none' });
                                }
                            });
                        } else if (res.cancel) {
                        }
                    }
                });
            })
        },

        // 点击组件里tab栏
        tabSelect(tabIndex) {
            /*
                parmas:hasClickTab
                hasClickTab值是记录是否已点击了ls-good-head组件的tab栏。当商品详情页的内容比较少(整个页面高度只大于手机屏幕高度+banner图高度一点点时)，但又触发了颜色渐变时，
                不设该值的话，会出现点击tab栏的‘评分’，再点击‘详情’，会强行触发changeTab方法导致tab栏上的‘商品’按钮马上高亮的bug
             */
            this.hasClickTab = true;
            setTimeout(() => {
                this.hasClickTab = false;
            }, 2000);
            this.tabIndex = tabIndex;
            if (tabIndex == 0) {
                this.$nextTick(()=> {
                    // 必需要用$nextTick，不然数据v-show切换后，pageScrollTo会失效
                    uni.pageScrollTo({ scrollTop: 0 });
                });
            }
            if (this.tabIndex == 1) {
                this.$nextTick(()=> {
                    // 必需要用$nextTick，不然数据v-show切换后，pageScrollTo会失效
                    uni.pageScrollTo({ scrollTop: this.detailTop });
                });
            }
            if (tabIndex == 2) {
                this.$nextTick(()=> {
                    // 必需要用$nextTick，不然数据v-show切换后，pageScrollTo会失效
                    uni.pageScrollTo({ scrollTop: this.commentTop });
                });
            }
        },
        // 获取所需楼层在屏幕中的位置
        async getPosition() {
            this.$nextTick(()=> {
                this.$utils.getRect(this, '.class-banner').then(resBanner => {
                    if (resBanner) {
                        this.$utils.getRect(this, '.class-page').then(resPage => {
                            if (resPage) {
								this.bannerBottom = resBanner.bottom - uni.upx2px(88);
                            }
                        });
                    }
                });
                this.$utils.getRect(this, '.class-detail').then(resDetail => {
                    if (resDetail) {
						// 这里加(this.parmas.skuType?uni.upx2px(120):0),是考虑了活动商品时,<activeHead>组件点的位置
                        this.detailTop = resDetail.top - this.stausBarHeight - (this.parmas.skuType||this.goodData.preSellProductBO?uni.upx2px(120+80):uni.upx2px(80));
                    }
                });
				this.$utils.getRect(this, '.class-comment').then(resDetail => {
				    if (resDetail) {
						// 这里加(this.parmas.skuType?uni.upx2px(120):0),是考虑了活动商品时,<activeHead>组件点的位置
				        this.commentTop = resDetail.top - this.stausBarHeight -(this.parmas.skuType||this.goodData.preSellProductBO?uni.upx2px(120+80):uni.upx2px(80));
				    }
				});
            });
        },

        changeTab(scrollTop) {
            this.$u.debounce(()=> {
                // 屏幕滚动到商品详情位置时，改变tab栏的下标
                // if (this.bannerBottom != 'none') {
                    // 当页面内容+banner图高度大于可使用窗口高度时，才触发屏幕滚动到商品详情位置时，改变tab栏的下标
                    if (scrollTop >= this.detailTop) {
                    	this.tabIndex = 1;
                    } else if (scrollTop >= this.commentTop) {
                        this.tabIndex = 2;
                    }  else {
						this.tabIndex = 0;
                    }
                // }
            },100)
        },

        // 展示选择sku
        showSkuPopup(sourceType,item) {
			this.sourceType = sourceType;
            this.$refs.skuPopup.changePopup(sourceType);
        },
        //当活动已经结束，但又有待成团的订单还未成团时，该值为mergeFloor组件转过来的值(【用户】正在进行的拼团分页)
        getIngOperatePage(list){
            this.ingOperatePage = list
        },

        getIsFixed(flag) {
			console.log(flag);
            this.isActiveHeadFixed = flag;
        },
    }
};
</script>

<style lang="scss" scoped></style>
