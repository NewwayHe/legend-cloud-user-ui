<template>
    <!-- /*
     * @Descripttion:商品详情楼层：SKU弹框
    */ -->
    <!-- 选择sku -->
    <view class="">
        <scroll-view class="px-4 border-box" scroll-x scroll-with-animation :scroll-left="scrollLeft" v-if="rawData.mainSpecificationId && source == 'good'&&rawData.specificationStyle != 'TXT'">
            <view class="text-nowrap text-center">
                <block v-for="item in prodPropList" :key="item.id">
                    <block v-for="(ele, index) in item.prodPropList" :key="ele.id">
                        <!-- 下面这个view层不能去掉  -->
                        <view
                            v-if="ele.imgList && ele.imgList.length >= 1 && rawData.mainSpecificationId == item.id && !ele.isDisable"
                            @click="chooseItem(item.id, ele.id, ele.isDisable, index)"
                            :class="[ 'py-2', 'transition-all05', 'd-inline-block', { 'ml-3': index != 0 } ]"
                        >
                            <ls-image :className="ele.isSelected?'content-box border border-main scale-13':''" :src="ele.imgList[0]" :options="{ w: '60', h: '60', br: '50%' }"/>
                        </view>
                    </block>
                </block>
            </view>
        </scroll-view>

        <u-popup v-model="showPopup" mode="bottom" border-radius="28" z-index="9999" safe-area-inset-bottom closeable closeIconSize="24" :style="{ '--themescolor': themes.color }" @touchmove.stop.prevent>
            <view class="px-4 pt-4 pb-2 flex-start " style="height: 260rpx;">
				<!-- 注意，下面这个ls-image要加v-if="showPopup"，不然小程序端会显示为空图片(因为小程序一进商品详情页面时，是直接把该popup弹框挂载上去了，而H5是在showPopup为true时才挂载该弹框) -->
                <ls-image :src="skuPicList[0]" :options="{ w: '200', h: '200', br: '8' }" :preImgList="skuPicList" v-if="showPopup"/>
                <!-- <image class="d-block img" :src="photoServer + value.picList[0]" alt="" /> -->
                <view class="flex-1 flex-col-between h-100 pl-2 overflow-h">
                    <view class="w-100 flex-between pr-4">
                        <text class="flex-1 line-clamp2">{{ value.skuItem.cnProperties ? value.skuItem.cnProperties : value.skuItem.name || rawData.name }}</text>
                    </view>
                    <view class="w-100 text-main">
                        <!-- 普通商品 -->
						<!-- 如果是预售商品 -->
						<template v-if="rawData.preSellProductBO">
							<!-- 如果是定金预售商品 -->
							<template v-if="rawData.preSellProductBO.payPctType==1">
								<text class="text-main font-weight">定金：</text>
								<ls-price :price="depositMoney" :options="{ is: 32, ds: 32 }" />
								<text class="text-main ml-2">(尾款:</text>
								<ls-price :price="finalMoney" :options="{ is: 28, ds: 28 }" />
								<text class="text-main">)</text>
							</template>
							<!-- 如果是全款预售商品-->
							<template v-else>
								<text class="text-main font-weight">预售价：</text>
								<ls-price :price="price" :options="{ is: 40, iw: 600 }"/>
							</template>
						</template>
						<!-- 如果是普通商品(如果有sku优惠折扣价格,则显示sku优惠折扣价格) -->
						<ls-price :price="price" :options="{ is: 40, iw: 600 }" v-else/>
                    </view>
				</view>
            </view>

            <!-- 规格 -->
            <scroll-view scroll-y scroll-with-animation style="max-height: 750rpx;">
				<view class="px-4" v-if="!isSingle">
					<view class="py-2 border-top border-f8 " v-for="item in prodPropList" :key="item.id">
						<view class="text-333 line-clamp1 pb-2 font-weight">{{ item.propName }}</view>
						<view class="d-flex flex-wrap">
							<view class="flex-start flex-wrap overflow-h" v-for="ele in item.prodPropList" :key="ele.id">
								<!-- 图片模式 -->
								<ls-image
									:className="[ele.isSelected?'content-box border border-main':'',ele.isDisable?'filter-grayscale-10 opacity-6':'','mr-15r' ]"
									:src="ele.imgList[0]"
									:options="{ w: '120', h: '120', br: '12' }"
									@click="chooseItem(item.id, ele.id, ele.isDisable)"
									v-if="ele.imgList && ele.imgList.length != 0 && rawData.mainSpecificationId == item.id&&rawData.specificationStyle == 'PIC'"
								/>
								<!-- 无图样式和图文样式 -->
								<view
									class="flex-center text-center border-box border rounded-100 font-24 mr-2 mb-2 px-2 py-1 overflow-h text-nowrap"
									style="min-width: 140rpx;max-width: 98%; border-color: #999"
									:class="{ 'border-main text-main': ele.isSelected, 'bg-f7 text-ccc border-e4': ele.isDisable }"
									@click="chooseItem(item.id, ele.id, ele.isDisable)"
									v-else
								>
								<ls-image
									className="mr-1"
									:src="ele.imgList[0]"
									:options="{ w: '47', h: '47', br: '50%' }"
									 v-if="ele.imgList && ele.imgList.length != 0 && rawData.mainSpecificationId == item.id&&rawData.specificationStyle != 'TXT'"
								/>
								<text class="text-center flex-1" style="width: 100%">{{ ele.name }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="px-4" v-if="source == 'good'">
					<view class="font-24 py-2 border-top border-f8 transition-all05">
					<!-- <view class="font-24 py-2 border-top border-f8 transition-all05" :class="haveSku?'filter-opacity-10':'filter-opacity-0 pointer-none'" v-if="source == 'good'"> -->
					    <view class="flex-between">
					    	<view class="flex-1 font-28 font-weight">
					    		<text class="text-333 flex-1 overflow-h">
					    		    数量
					    		    <text class="pl-1">(库存：{{ stocksTemp||0 }})</text>
					    		</text>
					    	</view>
							<!-- 商品限购 -->
							<view class="" v-if="isQuota">
								<text class="text-main font-weight font-30 mr-1">{{getQuotaType(rawData.productQuotaDTO.quotaType)||''}}</text>
								<text :style="{color:themes.rgb08}">限购:{{rawData.productQuotaDTO.quotaCount}}</text>
							</view>
							<!-- 如果设置了商品限购，则最大购买数量为限购数量 -->
					    	<u-number-box v-model="skuBuyNumTemp" :min="1" :max="isQuota?rawData.productQuotaDTO.quotaCount:stocksTemp" :step="1" :input-width="80" :disabled="!stocksTemp" @change="change"></u-number-box>
					    </view>
					
						<!-- 拼团活动显示限购字段 -->
						<view class="flex-end mt-2" v-if="value&&value.skuItem&&value.skuItem.activitySkuDTO&&skuType">
							<view class="px-2 py border-box rounded-5 text-main mr-2" :style="{background:themes.rgb02}" v-if="value.skuItem.activitySkuDTO.limitType">
								<!-- limitType == 4是秒杀传用，limitType == 1||limitType == 2 是拼团和团购专用 -->
								<text v-if="value.skuItem.activitySkuDTO.limitType == 1">每人每天每个商品限购</text>
								<text v-else-if="value.skuItem.activitySkuDTO.limitType == 2">每人每天限购</text>
								<text v-else-if="value.skuItem.activitySkuDTO.limitType == 3">每人每个商品限购</text>
								<text v-else-if="value.skuItem.activitySkuDTO.limitType == 4">每人限购</text>
								{{ value.skuItem.activitySkuDTO.activityLimitNumber }}份
							</view>
							<view class="px-2 py border-box rounded-5 text-main mr-2" :style="{background:themes.rgb02}" v-if="value.skuItem.activitySkuDTO.orderLimitType && value.skuItem.activitySkuDTO.orderLimitNumber">每单限购{{ value.skuItem.activitySkuDTO.orderLimitNumber }}份</view>
						</view>
					</view>
				</view>
            </scroll-view>
            <view class="d-flex w-100 font-28"><slot></slot></view>
        </u-popup>
        <!-- /选择sku -->
    </view>
</template>

<script>
import { mapState } from 'vuex';
import { getSkuKey, checkSpeItem, checkSkuKey } from '@/utils/skuUtils.js';

export default {
    name: 'sku-popup',
    components: {},
    props: {
        // 选中的skuItem
        value: {
            type: Object,
            default() {
                return {};
            }
        },

        // 原始数据
        rawData: {
            type: Object,
            default() {
                return {};
            }
        },
        skuType: String, //营销类型： 拼团/团购/秒杀活动需传 普通（''，普通商品的话值为空''，有值就是有活动） 团购（GROUP） 拼团（MERGE） 秒杀（SECKILL）
        source: String,//来源：good或者不填：商品详情页面，cart：购物车页面
    },

    data() {
        return {
            showPopup: false, // 显示和隐藏弹框

            curSpe: {}, // SKU的规格Id
            prodPropList: [], // 规格集合
            skuDict: {}, // sku查找字典
            haveSku: false, // 判断已经选择SKU，能够进行购买
            skuPicList: [], // 左上角显示的图片列表(主规格图片)，(多规格时，是指SKU对应的图片，单规格或多规格但是无图模式时，是指SPU对应的图片)

            scrollLeft: 0,
            sourceType: '' ,//点击事件的来源。'MERGEJoin'：拼团活动点击了merge-floor组件里的'参团')
			skuBuyNumTemp:1,//skuBuyNum的缓存变量
        };
    },

    computed: {
        ...mapState(['timeDiff']),
        stocksTemp() {//统一管理商品/活动商品库存
            let num = 0
            // 备注：一、如果下面写成（库存：{{ stocks }}，当stocks == 0时，小程序下面这个却不会显示：（库存：0），而是显示了：（库存：）
            //      二、如果是活动商品就取activitySkuDTO.stocks值，如果是普通商品取stocks值
            num = (this.skuType&&this.value.skuItem.activitySkuDTO? this.value.skuItem.activitySkuDTO.stocks : this.value.skuItem.stocks) || 0
            return num
        },
        // 是否是单规格，6.0是用prodPropDtoList是否有值来判断是否为单规格的，但当商家后台设置多规格保存后再修改为单规格，则此时prodPropDtoList有值，但此时要用单规格的数据
        isSingle(){
            return !this.$checkInfo([{ type: 'hasValue', value: this.skuDict }]); 
        },
		// 获取当前服务器上的时间戳
		curTime(){
			return new Date().getTime() - this.timeDiff//当前时间戳
		},
		// 是否限购，几个条件：一、quotaType有值('':无限购，O:每单限购，D:每日限购，W:每周限购，M:每月限购，Y:每年限购，A:终身限购)，二、现在的时间大于quotaTime限购时间、三、quotaCount限购数量有值
		isQuota(){
			let isTime = true
			if (this.rawData.productQuotaDTO) {
				const quotaTime = new Date((this.rawData.productQuotaDTO.quotaTime+' '+'00:00:00').replace(/\-/g, '/')).getTime() //获取限购时间当天凌晨的时间戳
				// 如果还未到限购时间
				if (this.curTime<quotaTime) {
					isTime = false
				}
			}
			return this.rawData.productQuotaDTO&&this.rawData.productQuotaDTO.quotaType&&this.rawData.productQuotaDTO.quotaCount&&isTime
		},
		price(){
			// 如果有sku优惠折扣价格,则显示sku优惠折扣价格
			return this.value.skuItem.discountPrice||this.value.skuItem.discountPrice==0?this.value.skuItem.discountPrice:this.value.skuItem.price
		},
		
		/*
			定金：
				定金和尾款的算法：
					定金：value.skuItem.price*rawData.preSellProductBO.payPct/100,
					尾款：value.skuItem.price*(100-rawData.preSellProductBO.payPct)/100 - 总优惠金额
					总优惠金额：value.skuItem.price-value.skuItem.discountPrice (优惠金额在尾款里扣除，如果尾款少于优惠金额，则剩下的优惠金额在定金里扣)
		*/
		depositMoney(){
		   let money = 0
		   // 如果支付方式是定金尾款支付
		   if (this.value.skuItem&&this.rawData.preSellProductBO&&this.rawData.preSellProductBO.payPctType==1) {
			   // 如果有sku优惠折扣价格
			   if (this.value.skuItem.discountPrice||this.value.skuItem.discountPrice==0) {
				    // sku优惠折扣会在尾款里扣减,如果尾款不够扣减,则在定金里扣减
					if ((this.value.skuItem.price*(100-this.rawData.preSellProductBO.payPct)/100)<(this.value.skuItem.price-this.value.skuItem.discountPrice)) {
						money = this.value.skuItem.discountPrice
					}else{
						money = this.value.skuItem.price*this.rawData.preSellProductBO.payPct/100
					}
			   }else{
				   money = this.value.skuItem.price*this.rawData.preSellProductBO.payPct/100
			   }
		   }
		   return money
		},
			   
		// 尾款
		finalMoney(){
		   let money = 0
		   // 如果支付方式是定金尾款支付
		   if (this.value.skuItem&&this.rawData.preSellProductBO&&this.rawData.preSellProductBO.payPctType==1) {
			   // 如果有sku优惠折扣价格
			   if (this.value.skuItem.discountPrice||this.value.skuItem.discountPrice==0) {
				    // sku优惠折扣会在尾款里扣减,如果尾款不够扣减,则在定金里扣减
					if ((this.value.skuItem.price*(100-this.rawData.preSellProductBO.payPct)/100)<(this.value.skuItem.price-this.value.skuItem.discountPrice)) {
						money = 0
					}else{
						money = this.value.skuItem.price*(100-this.rawData.preSellProductBO.payPct)/100
					}
			   }else{
				   money = this.value.skuItem.price*(100-this.rawData.preSellProductBO.payPct)/100
			   }
		   }
		   return money
		},
   },

    watch: {
        rawData: {
            handler(newVal) {
				if (!this.$u.test.isEmpty(newVal)) {
					this.processRawData();
				}
            }
        },
        value: {
            handler(newVal, oldVal) {
                console.log('skuData:', newVal);
				this.skuBuyNumTemp = newVal.skuBuyNum
            },
            deep: true,
            immediate: true
        },
        showPopup(newVal, oldVal) {
            this.$emit('change', newVal);
        }
    },

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

    destroyed() {},

    methods: {
        // 第一次进来进行初始化数据
        processRawData() {
            // 判断v-mode是否存在一个SKU
            let initSku = null;

            this.initData(); // 重置数据，不重置数据的话，在购物车页面里不同商品弹出sku的时候，则会出现数据错乱的bug
            this.skuPicList = [];
            this.skuDict = {};
            this.prodPropList = [];
            this.curSpe = {};
            let skuItem = {};

            if (this.value.skuItem.properties) {
                initSku = this.value.skuItem.properties.split(';');
            }

            // sku查找字典
            this.skuDict = this.rawData.skuBOList.reduce((dict, item) => {
                if (item.properties != null || item.properties) {
                    // 有properties时才赋值
                    dict[item.properties] = item;
                }
                return dict;
            }, {});

            // 规格集合
            this.prodPropList = this.rawData.prodPropDtoList;

            let prePicList = [];

            // 单/多规格
            if (this.rawData.prodPropDtoList.length == 0 || !this.$checkInfo([{ type: 'hasValue', value: this.skuDict }])) {
            //如果有prodPropDtoList.length，但后台设置的是单规格(这时this.skuDict=={})
            //如果下面多格式不判断item.prodPropList.length==1时的情况，则要用这段来替换上面来避免报错
            // if (this.rawData.prodPropDtoList.length == 0||!this.$checkInfo([{ type: 'hasValue', value: this.skuDict }])||!this.$checkInfo([{type:'hasValue',value:this.curSpe}]) {
                skuItem = this.rawData.skuBOList[0];
                prePicList = this.skuPicList = this.rawData.productPics;
            } else {
                // 多规格
                // 回显
                if (initSku) {
                    for (const prod of initSku) {
                        const [key, value] = prod.split(':');
						// 拼个‘id_’，解决对象键值为数字型时输出的对象自动排序的问题
                        this.curSpe['id_'+key] = value;
                    }
                } else {
                    // 获取当前已经选择的规格，并找出相应的SKU
                    if (this.rawData.prodPropDtoList && this.rawData.prodPropDtoList.length) {
                        this.rawData.prodPropDtoList.forEach(item => {
                            item.prodPropList.forEach(ele => {
                                if (item.prodPropList.length == 1) {
                                    // 如果SKU里只有一个，并且该SKU没库存，并且后台返回的selectFlag值是false，则要在JS改为选中该规格属性，否则下面会报没有curSpe的错
                                    this.curSpe['id_'+item.id] = ele.id;
                                } else {
                                    if (ele.selectFlag) {
                                        this.curSpe['id_'+item.id] = ele.id;
                                    }
                                }
                            });
                            if (!this.$checkInfo([{ type: 'hasValue', value: this.curSpe }])) {
                                // 如果规格属性prodPropList下的所有的selectFlag都为false，则默认选中第一个规格属性
                                this.curSpe['id_'+item.id] = item.prodPropList[0].id;
                            }
                        });
                    }
                }
                // 控制变量，替换其中一个规格id以确定一个SKU，判断其stocks是否大于0来是否禁用
                let skuKey;
                if (this.prodPropList.length) {
                    this.prodPropList.forEach(item => {
                        item.prodPropList.forEach(ele => {
                            skuKey = getSkuKey(this.curSpe, 'id_'+item.id, ele.id).replace(/id_/g,'');//将前面拼上去的‘id_’删掉
                            skuItem = this.skuDict[skuKey];
                            if (skuItem) {
                                // this.$set(ele, 'isDisable', !((this.skuType?skuItem.activitySkuDTO.stocks:skuItem.stocks) > 0));
                                this.$set(ele, 'isSelected', this.curSpe['id_'+item.id] == ele.id);
                            } else {
                                this.$set(ele, 'isDisable', true); //新增，如果不存在这个skuItem，则让该按钮变为不可选
                                this.$set(ele, 'isSelected', false); //新增，如果有bug，这个可以删掉，
                            }
                            if (ele.isSelected) {
                                // console.log(this.rawData.mainSpecificationId);//主规格的ID，单选，只有一个
                                if (ele.imgList && ele.propId == this.rawData.mainSpecificationId) {
                                    // 只读取主规格的图片，如果想读取所有规格的图片，可以把ele.propId==this.rawData.mainSpecificationId删掉
                                    prePicList.push(...ele.imgList);
                                    this.skuPicList.push(...ele.imgList);
                                }
                            }
                        });
                    });
                }
                // 找出相应的SKU并赋值
                const key = Object.keys(this.curSpe).reduce((arr, item) => {
					let itemkey = item.replace('id_','');//将前面拼上去的‘id_’删掉
					arr.push(`${itemkey}:${this.curSpe[item]}`);
					return arr;
				}, []).join(';');
                skuItem = this.skuDict[key];
            }
            // 判断当前SKU的库存>0则可以购买
            if (skuItem && (this.skuType?skuItem.activitySkuDTO.stocks:skuItem.stocks) > 0) {
                this.haveSku = true;
            }

            if (!this.$checkInfo([{ type: 'hasValue', value: prePicList }])) {
                // 如果最终没有图片，则给它一个默认图片
                prePicList = this.skuPicList = this.rawData.productPics&&this.rawData.productPics.length ? this.rawData.productPics : [this.rawData.pic];
            }else{
                // 如果prePicList有值但商品设置为无图样式，则取最外层的单规格图片为spu图片，specificationStyle--"TXT":无图样式;"PIC":图片样式;"GRAPHIC":图文样式
                if (this.rawData.specificationStyle == 'TXT') {
                    prePicList = this.rawData.productPics || [this.rawData.pic];
                }
            }
            const skuValue = {
                skuItem: skuItem,
                picList: prePicList,
                skuBuyNum: this.value.skuBuyNum || 1,
				haveSku:this.haveSku,
            };
            this.$emit('input', skuValue); // 如果不用input传值(用$set也不行)，小程序上父组件的值不会变更(H5正常)
        },

        // 选择规格值
        chooseItem(speId, speItemId, speItemStatus, index) {
            if (index) {
                //只有点击banner下的图片选择sku才会有index值
                this.scrollLeft = (index - 1) * 60;
            }
            let status = speItemStatus;

            this.curSpe['id_'+speId] = speItemId;

            // 判断当前curSpe是否能确定一个SKU >1则不能确定SKU
            if (checkSpeItem(this.curSpe) > 1) {
                status = true;
            }

            // 如果点击的时一个禁用的选项, 其他规格选项都变成可选
            if (status) {
                // console.log('disable')
                this.haveSku = false;
                this.prodPropList.forEach(item => {
                    if (item.id != speId) {
                        this.curSpe['id_'+item.id] = false;
                    }
                    item.prodPropList.forEach(ele => {
                        this.$set(ele, 'isSelected', ele.id == speItemId);
                        this.$set(ele, 'isDisable', false);
                    });
                });

                // 最后判断，this.curSpe是否只包含一个false，如果已包含一个，则进行SKU判断
                if (checkSpeItem(this.curSpe) == 1) {
                    status = false;
                }
            }
						
            // 选择规格值
            if (!checkSkuKey(this.curSpe) && !status) {
                // console.log('check')
                let skuKey;
                let skuItem;
                for (const item of this.prodPropList) {
                    for (const ele of item.prodPropList) {
                        ele.isSelected = this.curSpe['id_'+item.id] === ele.id;
						skuKey = getSkuKey(this.curSpe, 'id_'+item.id, ele.id).replace(/id_/g,'');//将前面拼上去的‘id_’删掉
                        skuItem = this.skuDict[skuKey];
                        if (!skuItem) {
                            ele.isDisable = true;
                        } else {
                            // ele.isDisable = !((this.skuType?skuItem.activitySkuDTO.stocks:skuItem.stocks) > 0);
                        }
                        if (this.curSpe['id_'+item.id]) {
                            ele.isDisable = false;
                        }
                    }
                }
            } else if (checkSkuKey(this.curSpe)) {
                this.haveSku = true;
            }
            // console.log(this.curSpe,'curSpe~~~~~~~');//当前选中的规格属性，如：{1201: 2302, 1502: 2953, 1503: 4151}
            // console.log(this.skuDict,'skuDict~~~~~~~');//列出所有可选择的sku的key:value值，如：1201:2302;1502:2953;1503:4151: (...),1201:2302;1502:5151;1503:4152: (...)
            // console.log(this.haveSku,'haveSku~~~~~~~');//列出所有可选择的sku的key:value值，如：1201:2302;1502:2953;1503:4151: (...),1201:2302;1502:5151;1503:4152: (...)

            // 正常切换SKU
            if (this.haveSku) {
	            // console.log('change')
                // 控制变量，替换其中一个规格id以确定一个SKU，判断其stocks是否大于0来是否禁用
                let skuKey;
                let skuItem;
                const spePicList = []; //banner图片及弹框左上角的图片数组
                this.prodPropList.forEach(item => {
                    item.prodPropList.forEach(ele => {
						skuKey = getSkuKey(this.curSpe, 'id_'+item.id, ele.id).replace(/id_/g,'');//将前面拼上去的‘id_’删掉
                        skuItem = this.skuDict[skuKey];
                        if (!skuItem) {
                            ele.isDisable = true;
                        } else {
                            // ele.isDisable = !((this.skuType?skuItem.activitySkuDTO.stocks:skuItem.stocks) > 0);
                        }
                        ele.isSelected = this.curSpe['id_'+item.id] == ele.id;
                        if (ele.isSelected) {
                            if (ele.imgList && ele.propId == this.rawData.mainSpecificationId) {
                                spePicList.push(...ele.imgList);
                            }
                        }
                    });
                });


						
                // 找出相应的SKU并赋值
                const key = Object.keys(this.curSpe).reduce((arr, item) => {
					let itemkey = item.replace('id_','');//将前面拼上去的‘id_’删掉
					arr.push(`${itemkey}:${this.curSpe[item]}`);
					return arr;
				}, []).join(';');

                // console.log(key,'key~~~~~~~');

                const SKU = this.skuDict[key];
                this.value.skuItem = SKU;

                if (!this.$checkInfo([{ type: 'hasValue', value: spePicList }])) {
                    // 如果spePicList没值或者为无图样式，则取最外层的单规格图片为图片
                    this.value.picList = this.skuPicList = this.rawData.productPics || [this.rawData.pic];
                } else {
                    // 多规格使用SKU的图片
                    this.value.picList = this.skuPicList = spePicList; 
                    // 如果spePicList有值但商品设置为无图样式，则取最外层的单规格图片为spu图片，specificationStyle--"TXT":无图样式;"PIC":图片样式;"GRAPHIC":图文样式
                    if (this.rawData.specificationStyle == 'TXT') {
                        this.value.picList = this.rawData.productPics || [this.rawData.pic];
                    } 
                }
                this.value.skuBuyNum = 1; // 切换SKU，购买数量变回1
            }
			this.value.haveSku = this.haveSku
            this.$emit('input', this.value); // 如果不用input传值(用$set也不行)，小程序上父组件的值不会更新(H5正常)
        },

        // 重置数据，不重置数据的话，在购物车页面里不同商品弹出sku的时候，则会出现数据错乱的bug
        initData() {
            this.curSpe = {};
            this.prodPropList = [];
            this.skuDict = {};
            this.haveSku = false;
            this.skuPicList = [];
        },

        // 判断已经选择SKU，能够进行购买(该方法是父页面用$refs运用的，并不是本vue文件里应用的)
        checkSKU() {
            return this.haveSku;
        },

        /*
         * 显示隐藏popup弹框(该方法是父页面用$refs运用的，并不是本vue文件里应用的)
         * sourceType：点击事件的来源。'MERGEJoin'：拼团活动点击了merge-floor组件里的'参团'
         */
        changePopup(sourceType) {
            this.sourceType = sourceType;
            this.showPopup = !this.showPopup;
        },

		change(e){
			let skuValue = this.value
			skuValue.skuBuyNum = e.value
			this.$emit('input', skuValue); // 如果不用input传值(用$set也不行)，小程序上父组件的值不会更新(H5正常)
		},
		
		
		// quotaType :'' ,//限购类型('':无限购，O:每单限购，D:每日限购，W:每周限购，M:每月限购，Y:每年限购，A:终身限购)
		// quotaCount:'',//限购数量
		// quotaTime:'',//限购时间
		getQuotaType(type){
			const status = {'O':'每单','D':'每日','W':'每周','M':'每月','Y':'每年','A':'终身'}
			return status[type]
		}
    }
};
</script>

<style lang="scss" scoped>
</style>
