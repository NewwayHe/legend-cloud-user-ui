<template>
    <view :style="{ '--themescolor': themes.color }">
        <!-- 头部 -->
        <ls-header showHeadSelect title="评论"></ls-header>
        <!-- 内容 -->
        <view class="safearea-bb mt-2" style="">
            <ls-load-more :status="paging.status" v-if="!paging.emptylist">
                <block>
                    <view class="mb-2 bg-fff" v-for="(item, index) in list" :key="index">
                        <view class="d-flex j-sb p-2 font-28 border-bottom">
                            <view class="d-flex a-center" @click="$navigateTo(`/ModuleGoods/shopHome/shopIndex?shopId=${item.shopId}`)">
								<text class="iconfont icon-dianpu mr-1" style="font-size: 30rpx;"></text>
                                <view class="">{{ item.shopName }}</view>
                                <text class="iconfont icon-ArrowRight text-bbb" style="font-size: 30rpx;"></text>
                            </view>
                            <view class="text-999 font-28">{{ evaluateStatus(item.commFlag, item.addCommFlag) }}</view>
                        </view>

                        <view class="d-flex p-2 border-bottom">
                            <ls-image
                                className="flex-shrink"
                                :options="{ w: '200', h: '200', br: '10' }"
                                :osOptions="{ w: 500, h: 500 }"
                                :src="item.prodPic"
                            />
                            <view class="text-333 font-24 ml-2">
                                <view class="line-clamp3">{{ item.productName||'' }}</view>
                                <view class="text-999 font-20 mt-2">{{ item.attribute||'' }}</view>
                            </view>
                        </view>
                        <view class="text-right font-28 p-2">
                            <text
                                class="evaluate-btn"
                                style="border: 2rpx solid #ddd; color: #333"
                                v-if="item.commFlag"
                                @click="goEvaluate(item.id, 2, item.orderItemId)"
                            >
                                查看评论
                            </text>
                            <text
                                class="evaluate-btn"
                                style="border: 2rpx solid #007aff; color: #007aff"
                                v-if="!item.commFlag"
                                @click="$u.route('/ModuleCenter/evaluate/addEvaluate', { operation: 1, orderItemId: item.orderItemId })"
                            >
                                去评论
                            </text>
                            <text
                                class="evaluate-btn"
                                style="border: 2rpx solid #007aff; color: #007aff"
                                v-if="item.commFlag && !item.addCommFlag && item.status == 1"
								@click="$u.route('/ModuleCenter/evaluate/addEvaluate', { id: item.id, operation: 3, orderItemId: item.orderItemId })"
                            >
                                去追评
                            </text>
                            <text
                                class="evaluate-btn"
                                style="border: 2rpx solid #007aff; color: #007aff"
                                v-if="item.addCommFlag && item.status == 1"
                                @click="goEvaluate(item.id, 4, item.orderItemId, item.addId)"
                            >
                                查看追评
                            </text>
                        </view>
                    </view>
                </block>
            </ls-load-more>
            <ls-empty className="center-xy" :title="'暂无评论'" :paging="paging" @reLoad="getData" reLoad/>
        </view>
    </view>
</template>

<script>
import pageUtil from '@/utils/pageUtils.js'
import { evaluate } from '@/api/ModulesUser'
const listPage = new pageUtil(evaluate.openEvaluateInfo)

export default {
    components: {},
    data() {
        return {
            params: {
                orderNumber:null
            },
            list: [],
            paging: {
                status: 'loading',
                error: false, // 是否错误
                emptylist: false // 是否显示列表为空时的样式
            },

            tabList: ['全部', '待评论', '待追评', '已追评']
        }
    },

    computed: { },
	
	onLoad(option) {
		this.params.orderNumber = option.orderNumber || null
	},

    onShow() {
		this.$nextTick(() => {
			this.getData()
		})
    },
    // 下拉加载
    onReachBottom() {
        listPage.loadListByPageMore()
    },
    methods: {
		getData(){
			listPage.loadListByPage(this, this.params)
		},
        // 状态
        evaluateStatus(state, addState) {
            if (state) {
                if (addState) {
                    return '已追评'
                }
                return '待追评'
            } else {
                return '待评论'
            }
        },
        // 去评论（查看评论）
        goEvaluate(id, type, orderItemId, addId) {
            // type：1=去评论，2=查看评论 3=去追评， 4=查看追评
            uni.navigateTo({ url: `/ModuleCenter/evaluate/evaluateDetail?id=${id}&operation=${type}&orderItemId=${orderItemId}&addId=${addId}` })
        }
    },
    filters: {
        getLabelText: function(value, list, label = 'name') {
            const data = list.find((v) => v.status == value)
            if (data) {
                return data[label]
            } else {
                return ''
            }
        }
    }
}
</script>

<style lang="scss" scoped>
page {
    background-color: #f6f7f8;
}
.evaluate-btn {
    margin-left: 20rpx;
    display: inline-block;
    border-radius: 100rpx;
    width: 160rpx;
    height: 64rpx;
    line-height: 64rpx;
    text-align: center;
}
</style>
