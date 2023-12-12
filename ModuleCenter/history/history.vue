<template>
    <view class="w750 font-32" :style="{ '--themescolor': themes.color }">
        <ls-header>
            <view class="flex-around flex-1">
                <view class="flex-center flex-1 text-333 font-28 px-8">
                    <view class="flex-1 flex-center"><text>我的足迹</text></view>
                </view>
            </view>
            <view class="w-88r h-100 flex-center font-30 text-nowrap" slot="right" @click="clearHistory">清空</view>
        </ls-header>
        <!-- /头部 -->
        <!-- 我的足迹 -->
        <view>
            <ls-load-more>
                <view
                    v-for="(item, index) in list"
                    :key="index"
                    @click.stop="$navigateTo(`/ModuleGoods/goodsDetail/goodsDetail?id=${item.productId}`)"
                    @longpress="delHistory(item.productId, index)"
                >
                    <view v-if="index == 0||(index != 0 && item.dateTime != list[index - 1].dateTime)">
                        <view class="font-36 font-weight pl-2">{{ item.dateTime.substring(0, 10) == todayDate ? '今天' : item.dateTime.substring(5, 10) }}</view>
                    </view>
                    <view class="flex-center p-2 border-bottom">
                        <ls-image :src="item.pic" :options="{ w: '180', h: '180' }"/>
                        <view class="flex-1 flex-col-between pl-2" style="height: 180rpx">
                            <view>
                                <view class="line-clamp2">{{ item.productName }}</view>
                            </view>
							<view class="flex-between w-100 text-nowrap overflow-x-scroll">
							    <ls-price :price="item.price" :options="{ is: '32' }"></ls-price>
							    <text class="px-3 font-24 text-999">{{ item.createTime }}</text>
							</view>
                        </view>
                    </view>
                </view>
            </ls-load-more>
            <!-- 回到顶部按钮 -->
			<back-top :scrollTop="scrollTop" :showScroll="220" bgColor="rgba(0,0,0,.3)" buttonFixed/>
            <ls-empty className="center-xy" :type="4" title="您还没有浏览过商品" :paging="paging" @reLoad="getData" reLoad/>
        </view>
    </view>
</template>

<script>
import backTop from '@/components/goods/back-top.vue';
import pageUtil from '@/utils/pageUtils.js'
import { history } from '@/api/ModuleCenter.js'
// import { history, clearHistory, delHistory } from '@/api/ModuleCenter.js'
const listPage = new pageUtil(history.queryUserVitList)
import pageScroll from '@/mixins/pageScroll.js'
export default {
    name: '',
    components: { 'back-top': backTop, },
	mixins: [pageScroll],
    data() {
        return {
            paging: {
                status: 'loading',
                error: false, // 是否错误
                emptylist: false // 是否显示列表为空时的样式
            },
            list: [],
            todayDate: '',
        }
    },
  
    computed: { },
    watch: {},
    onLoad() {
        this.getToday()
    },
    onShow() {
        this.getData()
    },
    mounted() {},
    // 下拉加载
    onReachBottom() {
        listPage.loadListByPageMore()
    },
    methods: {
        getData() {
            listPage.loadListByPage(this)
        },
        // 获取今天时间
        getToday() {
            let todayDate = new Date()
            todayDate.setTime(todayDate.getTime())
            todayDate =
                todayDate.getFullYear() +
                '-' +
                (todayDate.getMonth() + 1 < 10 ? '0' + (todayDate.getMonth() + 1) : todayDate.getMonth() + 1) +
                '-' +
                (todayDate.getDate() < 10 ? '0' + todayDate.getDate() : todayDate.getDate())
            this.todayDate = todayDate
            console.log(this.todayDate, 'asd')
        },
        // 删除账单
        delHistory(id, index) {
            uni.showModal({
                title: '删除',
                content: '请问要删除本条足迹记录吗？',
                success: async (res) => {
                    if (res.confirm) {
                        history.deleteUserVisitLog(id).then((res) => {
                            uni.showToast({
                                title: '删除成功',
                                success: () => {
                                    this.getData()
                                }
                            })
                        })
                    }
                }
            })
        },
        //清空历史足迹
        clearHistory() {
            uni.showModal({
                content: '确定清空浏览记录？',
                success: async (res) => {
                    if (res.confirm) {
                        history.deleteUserAllVisitLog().then((res) => {
                            this.getData()
                        })
                    }
                }
            })
        }
    }
}
</script>

<style scoped>
page {
    background-color: #ffffff;
}

</style>
