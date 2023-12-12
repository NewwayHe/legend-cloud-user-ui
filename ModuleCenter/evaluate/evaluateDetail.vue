<template>
    <view :style="{ '--themescolor': themes.color }" class="overflow-h">
        <!-- 头部 -->
        <ls-header showHeadSelect title="评论详情"></ls-header>
        <!-- 内容 -->
        <view class="safearea-bb" v-if="!paging.emptylist">
            <!-- 商品信息 -->
            <view class="flex-center bg-fff p-2 position-relative overflow-h" v-if="!$u.test.isEmpty(list)">
                <ls-image className="flex-shrink" :options="{ w: '160', h: '160', br: '12' }" :osOptions="{ w: 500, h: 500 }" :src="list.prodPic"/>
				<view class="flex-1 font-28 ml-2">
					<text class="line-clamp2 text-000" style="line-height: 40rpx;">{{ list.productName || '' }}</text>
				</view>
            </view>
			
			<!-- 评论区域 -->
			<view class="pt-4 pb-3 px-2 bg-fff mt-2">
				<!-- 初评区域 -->
				<view class="pb-2 commArea">
					<view class="flex-between">
						<view>
							<ls-image
								:src="userInfo.portraitPic"
								:options="{ w: '70', h: '70', br: '50%',bg:'#cccccc' }"
								mode="aspectFill"
								:errorStyle="1"
							/>
						</view>
						<view class="ml-2 flex-1 flex-col-between">
							<view class="text-333 font-28 mb-1">
								<text v-if="!firstReply.anonymousFlag">{{ userInfo.nickName || '' }}</text>
								<text v-else>匿名</text>
							</view>
							<view class="flex-between w-100">
								<u-rate v-model="totalRate" active-color="#EE0A24" inactive-color="#C8C9CC" inactive-icon="star-fill" disabled size="20"></u-rate>
								<text class="text-999 font-24">{{ firstReply.createTime || '-' }}</text>
							</view>
						</view>
					</view>
					<view class="mt-2 font-24 text-333">{{ firstReply.content || '-' }}</view>
					<view class="mt-2" v-if="firstReply.picFile.length">
						<scroll-view style="white-space: nowrap;" scroll-x>
							<view class="d-flex position-relative">
								<ls-image
									:customStyle="{flex: '0 0 160rpx', marginRight: '12rpx'}"
									v-for="(pic,pIdx) in firstReply.picFile"
									:key='pic'
									:options="{ w: '160', h: '160', br: '12' }"
									:src="photoServer + pic"
									@click='previewImg(pIdx, firstReply.picFile)'
								/>
							</view>
						</scroll-view>
					</view>
					<view class="mt-2 text-999 font-24">{{ list.attribute || '' }}</view>
				</view>
				
				<!-- 商家回复了才进行展示 -->
				<template v-if="firstReply.shopReplyTime">
					<!-- 分割线 -->
					<u-line color="#F1F1F1" :hair-line='false' margin="40rpx 0"/>
					
					<!-- 商家回复 -->
					<view class="shopArea bg-f8 font-24 text-999 rounded-12" style="padding: 30rpx 24rpx;">
						<view class="flex-between">
							<text :style="{ 'color': themes.color }">商家回复：</text>
							<text>{{ firstReply.shopReplyTime || '-' }}</text>
						</view>
						<view class="mt-2">{{ firstReply.shopReplyContent || '-' }}</view>
					</view>
				</template>
				
				<!-- 查看追评时才放开此区域的显示 -->
				<template v-if="!!sndReply">
					<u-line color="#F1F1F1" :hair-line='false' margin="40rpx 0"/>
					
					<!-- 追评区域 -->
					<view class="addCommArea">
						<view class="flex-between">
							<text class="text-333 font-28" style="line-height: 40rpx;font-weight:500;">追评</text>
							<text class="text-999 font-24">{{ sndReply.createTime || '-' }}</text>
						</view>
						<view class="mt-2 text-333 font-24">{{ sndReply.content || '-' }}</view>
						<view class="mt-2" v-if="sndReply.picFile.length">
							<scroll-view style="white-space: nowrap;" scroll-x>
								<view class="d-flex position-relative">
									<ls-image
										:customStyle="{flex: '0 0 160rpx', marginRight: '12rpx'}"
										v-for="(pic,pIdx) in sndReply.picFile"
										:key='pic'
										:options="{ w: '160', h: '160', br: '12' }"
										:src="pic"
										@click='previewImg(pIdx, sndReply.picFile)'
									/>
								</view>
							</scroll-view>
						</view>
					</view>
					
					<template v-if="sndReply.shopReplyTime">
						<!-- 分割线 -->
						<u-line color="#F1F1F1" :hair-line='false' margin="40rpx 0"/>
						
						<!-- 商家回复 -->
						<view class="shopArea bg-f8 font-24 text-999 rounded-12" style="padding: 30rpx 24rpx;">
							<view class="flex-between">
								<text :style="{ 'color': themes.color }">商家回复：</text>
								<text>{{ sndReply.shopReplyTime || '-' }}</text>
							</view>
							<view class="mt-2">{{ sndReply.shopReplyContent || '-' }}</view>
						</view>
					</template>
				</template>
			</view>
			
			<u-toast ref="msgToast" />
			
            
        </view>
		<ls-empty className="center-xy" title="暂无数据" :paging="paging" @reLoad="refreshData" reLoad/>
    </view>
</template>

<script>
import { mapState } from 'vuex'
import { evaluate } from '@/api/ModulesUser'
export default {
    components: {},
    data() {
        return {
            list: null, // 商品信息
            paging: {
                status: 'loading',
                error: false, // 是否错误
                emptylist: true // 是否显示列表为空时的样式[这个一开始为true 否则页面先读取了list会导致报错]
            },
            evaluateType: 1, // 评论状态
			firstReply: null,	//初评内容
			sndReply: null,		//追评内容
        }
    },
    computed: {
        ...mapState(['isBackRefresh', 'userInfo']),
        // 综合评分
        totalRate() {
			// 默认为1星
			const { score = 1, shopScore = 1, logisticsScore = 1 } = !!this.firstReply ? this.firstReply : {};
			return ((score*1 + shopScore*1 + logisticsScore*1) / 3).toExponential(2)
        },
    },
    onLoad(option) {
		this.$data['option'] = option
		this.refreshData()
	},
    mounted() {},
    onShow() {
		if(this.isBackRefresh) {
			console.log('重刷数据')
			this.$nextTick(()=>{
				this.refreshData()
			})
		}
		
    },
    methods: {
		refreshData() {
			this.evaluateType = this.$data.option.operation// operation：1=去评论，2=查看评论 3=去追评， 4=查看追评
			this.getEvaluateDetail() // 获取评论内容
		},
        // 获取评论内容
        getEvaluateDetail() {
			this.paging = {
			    status: 'loading',
			    error: false, // 是否错误
			    emptylist: true // 是否显示列表为空时的样式
			}
			
			// evaluateType:1=去评论，2=查看评论 3=去追评， 4=查看追评
			// console.log('detail获取信息', this.$data.option.id)
			// 商品信息
			const goodReply = evaluate.getEvaluateInfo.bind(null, { orderItemId: Number(this.$data.option.orderItemId) })
			// 初评
			const firstReply = evaluate.getEvaluateDetail.bind(null, { id: this.$data.option.id })
			// 追评
			const sndReply = evaluate.getTwoEvaluateInfo.bind(null, { addId: this.$data.option.addId })
			
			let detailQuest = [goodReply, firstReply, sndReply]
			
			if(this.evaluateType == 2) {	//初评
				detailQuest = detailQuest.slice(0, 2)
			}
			
			Promise.all(detailQuest.map(each => each())).then((res)=>{
				// console.log('res--',res)
				res.forEach((item,index) => {
					if(item.code) {
						index != 0 && (item.data.picFile = this.$u.test.isEmpty(item.data.photos) ? [] : JSON.parse(item.data.photos))
						index == 0 && (this.list = item.data);		//商品数据
						index == 1 && (this.firstReply = item.data);	//初评
						index == 2 && (this.sndReply = item.data);		//追评
					}
				})
				console.log('请求完--',this.list, this.firstReply, this.sndReply)
			}).catch(err => {
				console.log('err--',err)
				this.paging.error = true;
			}).finally(()=>{
				this.paging.status = 'noMore'
				if(this.$u.test.isEmpty(this.list)) {	//如果商品信息为空 则整个页面都为空
					return this.paging.emptylist = true;
				}
				// 如果查看初评 则初评数据获取失败时 展示为空
				if(this.evaluateType == 2 && this.$u.test.isEmpty(this.firstReply)) {
					return this.paging.emptylist = true;
				}
				// 如果查看追评时 初评或者追评获取失败时也要展示为空
				if(this.evaluateType == 4 && (this.$u.test.isEmpty(this.firstReply) || this.$u.test.isEmpty(this.sndReply))) {
					return this.paging.emptylist = true;
				}
				this.paging.emptylist = false
			})
			
        },

        // 图片预览
        previewImg(cur,pics) {
            uni.previewImage({
                current: cur,
                urls: pics.map(item => this.photoServer + item)
            })
        },
        
    }
}
</script>
<style>
page {
    background-color: var(--backgroundcolor);
}
</style>

