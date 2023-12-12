<template>
    <!-- /*
     * @Descripttion:商品详情：评论列表
    */ -->
    <!--评论列表-->
	<!-- 因为没评论也要显示，暂时不需要v-if -->
	<!-- v-if="!num||(num&&!paging.emptylist)" -->
    <view class="bg-fff font-24" :class="className">
        <!-- 如果是整页模式 -->
		<!-- 目前已经有新的跳转页面的评论此处暂时不需要 -->
        <template v-if="!num">
            <!-- 小程序和APP状态栏点位符 -->
            <view :style="{ height: stausBarHeight + 'px'}"></view>
            <view class="flex-between p-2 text-999">
                <view class="flex-1">
                    <view class="text-333">
                    	<text class=" font-32 font-weight mr-2">评论</text>
                        <!-- <text class="iconfont icon-title text-ccc"></text> -->
                        综合评分
                        <text class="font-24">{{ goodScore.comScore }}</text>
                        <view class="position-absolute bottom-0 border-bottom"></view>
                    </view>
                </view>
                <view class="font-28 text-666">
                    <ls-popover ref="popover" opPosition="start" bgColor="rgba(0,0,0,0.8)" @change="changePopover">
                        <text class="mr-1">{{params.orderBy==='addtime'?'按时间排序':'按评分排序'}}</text>
                        <text class="iconfont icon-ArrowDown text-999 d-inline-block transition-all05" style="font-size: 20rpx;" :style="{transform: `rotate(${!showSelect?0:180}deg)`}"></text>
                        <view class="p-2" slot="content">
                            <view class="h-60r flex-center" :class="[{'text-main':params.orderBy==key}]" @click="changeOrderBy(key)" v-for="(val,key,index) in popoverOptions" :key="index"><text>{{val}}</text></view>
                        </view>
                    </ls-popover>
                </view>
            </view>
        </template>
        <template>
            <view class="flex-between pt-4 pb-2 px-2" :class="list.length > 0 ? '' : 'h-100r'"  @click="goGoodsComment">
                <view class="text-333">
					<text class="font-32 font-weight mr-2">评论</text>
                    <block v-if="list.length > 0">
						<text>综合评分</text>
						<text class="font-24">{{ goodScore.comScore }}</text>
					</block>
                    <view class="position-absolute bottom-0 border-bottom"></view>
                </view>
                <view class="text-999 flex-1">
                    <view class="text-right" v-if="list.length > 0">
						<text>查看更多</text>
						<text class="iconfont icon-ArrowRight" style="font-size: 20rpx;"></text>
					</view>
					<text class="mr-4" v-else>暂无评价，欢迎您购买之后留下宝贵的评价</text>
                </view>
            </view>
            <block v-for="(item, index) in list" :key="index" v-if="index<num">
                <view class="border-bottom border-bg">
                    <view class="px-2 bg-fff">
                        <view class="pt-2 pb-1 d-flex j-sb">
                            <view class="flex-1 flex-start overflow-h">
                                <ls-image :src="item.portrait" :options="{w:'70',h:'70', br: '50%',bg:'#cccccc'}" :errorStyle="1"/>
                                <view class="flex-1 pl-2 overflow-h ">
                                    <view class="line-clamp1 font-28 text-333">
                                        {{ item.anonymousFlag ? '匿名用户' : item.nickName }}
                                    </view>
									<u-rate style="vertical-align: top; margin-left: -5rpx" :count="5" :current="item.score || 0" disabled size="20" :active-color="themes.color" allowHalf inactive-icon="star-fill" :key="index"></u-rate>
                                </view>
                            </view>
                           <view class="d-flex a-end">
							   <text class="text-999">
							       {{ item.addTime | dateformat('YYYY-MM-DD HH:mm:ss') }}
							   </text>
						   </view>
                        </view>
                        
                        <view class="mt-2">
                        	<view>
                        		<text class="line-clamp2 text-333" style="line-height: 40rpx">{{ item.content }}</text>
                        		<view class="img mt-1 d-flex flex-wrap overflow-h" :class="item.photoList.length >= 4 ? 'h-220r' : ''">
                        			<view
                        				class="img-item d-block text-center bg-fff position-relative overflow-h mr-1 mb-2 rounded-12 w-220r h-220r"
                        				v-for="(pics, indexPic) in item.photoList"
                        				:key="indexPic"
                        			>
                        				<ls-image className="position-relative" :options="{ w: '220', h: '220', br: '24' }" :src="photoServer + pics" :preImgList="item.photoList" :current="indexPic">
                        					<!-- 遮罩层 -->
                        					<view v-if="item.photoList.length >= 4 && indexPic == 2" class="position-absolute top-0 right-0 w-220r h-220r rounded-24 shadow flex-center overflow-h" style="background-color: rgba(0, 0, 0, .5);">
                        						<text class="text-fff font-24 font-weight">共{{item.photoList.length}}张 > </text>
                        					</view>
                        				</ls-image>
                        			</view>
                        		</view>
                        		<view class="date-of-purchase pt-1 pb-4 d-flex" style="line-height: 40rpx">
                        			<view class="sku flex-1 text-999">{{ item.attribute ? item.attribute : '默认规格' }}</view>
                        		</view>
                        	</view>
                        	<view class="py-4 border-top border-f1" v-if="item.addReplyFlag">
                        		<view class="line-h-md">
                        			<text class="text-main">商家回复：</text>
                        			<text class="text-999">
                        				{{ item.shopReplyContent }}
                        			</text>
                        		</view>
                        	</view>
							<!-- 商品详情的追评暂时不用，在评论列表再展示 -->
                        	<!--
								<view class="pb-4" v-if="item.addStatus > 0">
									<view class="to-pursue mb-1 pt-2 border-top border-f1 font-weight font-28 text-333" v-if="item.appendDays > 0">
										用户{{ item.appendDays }}天后追评
									</view>
									<view class="to-pursue mb-1 pt-4 border-top border-f1 font-weight font-28 text-333" v-if="item.appendDays == 0">
										用户当天追加评论
									</view>
									<text class="overflow-h" style="line-height: 40rpx" v-if="item.addStatus > 0">{{ item.addContent }}</text>
									<view class="img mt-1 d-flex flex-wrap overflow-h" :class="item.photoList.length >= 4 ? 'h-220r' : ''">
										<view
											class="img-item d-block text-center bg-fff position-relative overflow-h mr-1 mb-2 w-220r h-220r"
											v-for="(pics, indexAddpic) in item.addPhotoList"
											:key="indexAddpic"
										>
											<ls-image className="position-relative" :options="{ w: '220', h: '220', br: '24' }" :src="photoServer + pics" :preImgList="item.addPhotoList" :current="indexAddpic">
											
												<view v-if="item.addPhotoList.length >= 4 && indexAddpic == 2" class="position-absolute top-0 right-0 w-220r h-220r rounded-24 shadow flex-center" style="background-color: rgba(0, 0, 0, .5);">
													<text class="text-fff font-24 font-weight">共{{item.addPhotoList.length}}张 > </text>
												</view>
											</ls-image>
										</view>
									</view>
								</view>
								<view class="py-4 border-top border-f1" v-if="item.addReplyFlag">
									<view class="line-h-md">
										<text class="text-main">商家回复：</text>
										<text class="text-999">
											{{ item.shopReplyContent }}
										</text>
									</view>
								</view>
							-->
                        </view>
                    </view>
                </view>
            </block>
        </template>

    </view>
</template>

<script>
// JS方法
import pageUtil from '@/utils/pageUtils.js'

// API接口
import { goodsApi } from '@/api/ModuleGoods.js'

import { mapState } from 'vuex'

const listPage = new pageUtil(goodsApi.commentPage,{notReset:true})
export default {
    name: 'good-comment',

    components: {},

    props: {
        className: String,
        prodId: [String,Number],
        
        // 只显示多少条评论(当有值时，整个页面的评论会不显示)
        num: {
            type: [Number,String],
            default: ''
        }
    },
    data() {
        return {
            params: {
                condition: 'all',
                orderBy:'addtime',//排序方式 按评论时间排序： addtime 按评论平均分数排：averageScore
                productId: ''
            },
            list: [],
            paging: {
                status: 'loading',
                error: false, // 是否错误
                emptylist: false // 是否显示列表为空时的样式
            },
            
            goodScore: 0, // 商品评论总分
            commentNumber: '', // 评论的数量
            // 导航的评论选择按钮参数
            comNumOptions:{
                'all':`全部`,
                'good':`好评`,
                'medium':`中评`,
                'poor':`差评`,
                'photo':`有图`,
                'append':`追评`,
            },
            current: 0, // 默认选中tab的下标
            showSelect:false,//点击右上角的‘按**排序’
            //点击右上角的‘按**排序’弹出的列表
            popoverOptions:{
                'addtime':'按时间排序',
                'averageScore':'按评分排序',
            },
        }
    },

    computed: {
        ...mapState(['stausBarHeight']),
        //备注：如果直接在HTML上用Object.values(comNumOptions)的话(该过程会导致list连续变化，ls-tabs会连续执行多次init()方法，导致ls-tabs会定位不准确)
        comNumValues(){
            if (this.commentNumber) {
                this.comNumOptions = {
                    'all':`全部(${this.commentNumber.all||0})`,
                    'good':`好评(${this.commentNumber.good||0})`,
                    'medium':`中评(${this.commentNumber.medium||0})`,
                    'poor':`差评(${this.commentNumber.poor||0})`,
                    'photo':`有图(${this.commentNumber.photo||0})`,
                    'append':`追评(${this.commentNumber.append||0})`,
                }
            }
            return Object.values(this.comNumOptions)
        },
        comNumKeys(){
            return Object.keys(this.comNumOptions)
        },
        // 评论百分比
        // commentNumberHighRate() {
        //     return (this.commentNumber.highRate * 100).toFixed(2)
        // },
    },

    watch: {},

    created() {},

    mounted() {
        this.params.productId = this.prodId
        this.getCommentScore()
        listPage.loadListByPage(this, {
            orderBy: 'addtime',
            productId: this.prodId
        })
        
        // 详情页-评论-统计
        goodsApi.commentAalysis({productId:this.prodId}).then(res => {
            if (res.code==1) {
                this.commentNumber = res.data;
            }
        });
		// console.log("zczxczx", this.list)
    },

    destroyed() {},

    methods: {
		// 跳转到评论页面，并且携带综合评分
		goGoodsComment() {
			// 没有评论数据就不跳转
			if (this.list.length < 1) return;
			uni.navigateTo({
			    url: `/ModuleGoods/goodComments/goodComments?productId=${this.prodId}&comScore=${this.goodScore.comScore}`
			})
		},
        pageMore(){//父组件的onReachBottom方法
            listPage.loadListByPageMore()
        },
        // 改变请求评论的类型
        changeType(item) {
            this.current = item.index
            this.params.condition = this.comNumKeys[item.index]
            listPage.loadListByPage(this, this.params)
        },
        // 获取商品评论总分
        getCommentScore() {
            goodsApi.getComScore({ productId: this.prodId }).then((res) => {
                this.goodScore = res.data
            })
        },
        
        changeOrderBy(flag){
            console.log(flag);
            this.params.orderBy = flag
            this.$refs.popover.change()
            this.$nextTick(()=>{
                listPage.loadListByPage(this, this.params)
            })
        },
        changePopover(flag){
            this.showSelect = flag
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
