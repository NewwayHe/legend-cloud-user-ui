<template>
    <!-- 发票选择弹窗 -->
	<u-popup v-model="show" mode="bottom" border-radius="14" safe-area-inset-bottom closeable :style="{ '--themescolor': themes.color }">
        <view class="d-flex font-28 font-weight">
            <view
                class="flex-1 text-center p-2"
                v-for="(type, index) in InList"
                :key="index"
                :style="invoiceType == type ? `border-bottom: 4rpx solid ${themes.color}` : ''"
                @click="changeType(type)"
            >
                {{ type == 'NORMAL' ? '普通发票' : '增值税专票' }}
            </view>
        </view>
        <view class="mt-4" style="height: 700rpx">
            <scroll-view class="px-2 border-box" style="height: 100%" scroll-y @scrolltolower="onBottom" v-if="dataList&&dataList.length">
                <view
                    class="p-2 border mb-2 rounded-10 d-flex a-center"
                    :class="[{ 'bg-ddd': activeId == item.id},activeId == item.id?'border-main':'border-e4']"
                    v-for="(item,index) in dataList"
                    :key="index"
                    @click="chooseItem(item)"
                >
                    <text class="line-clamp1 m-1 flex-1">
						<text v-if="item.type=='NORMAL'">【{{ item.titleType == 'PERSONAL' ? '个人' : '公司' }}】</text>
						{{ item.company }}
					</text>
                    <text class="ml-4 p-1 bg-main text-fff rounded-10" v-if="item.commonInvoiceFlag">默认发票</text>
                </view>
            </scroll-view>
			<ls-empty title="暂无发票信息" v-else/>
        </view>
    </u-popup>
</template>

<script>
import { invoiceManage } from '@/api/ModulesUser'

export default {
    components: { },
    props: {
        // 商家支持开发票的类型
        invoiceList: {
            type: Array,
            default() {
                return []
            }
        },
        // 打开发票的商家店铺ID
        shopId: {},

        // 用户是否开发票
        invoiceFlag: {},
        activeId: {
            type: [Number, String],
            default: ''
        }
    },
    data() {
        return {
            invoiceType: 'NORMAL',
            dataList: [],
            pageForm: {
                curPage: 1,
                pageSize: 10
            },
			show:false,
            total: 0,
            totalPages: 0 // 多少页
        }
    },
    computed: {
        InList() {
            // 如果有2个选项且第一个是专票，那么反转数组
            if (this.invoiceList.length >= 2 && this.invoiceList[0] == 'DEDICATED') {
                this.invoiceList.reverse()
            }
            return this.invoiceList
        }
    },
    onShow() {
        uni.pageScrollTo({
            scrollTop: 0,
            duration: 0
        })
    },
    methods: {
        // 列表数据
        getData() {
            // 如果只有一个类型，则只请求这个类型，否则默认
            const type = this.invoiceList.length == 1 ? this.invoiceList[0] : this.invoiceType
            invoiceManage
                .getInvoice({
                    ...this.pageForm,
                    type
                })
                .then((res) => {
                    this.total = res.data.total
                    this.totalPages = Math.ceil(this.total / this.pageForm.pageSize) // 得到页数
                    this.dataList = this.dataList.concat(res.data.resultList) // 拼接
                })
                .catch((err) => {
                    console.log('invoice List error', err)
                })
        },

        // 选择发票
        chooseItem(invoice) {
            this.$emit('chooseInvoice', invoice)
        },
        // 切换
        changeType(type) {
            if (type == this.invoiceType) return
            if (this.invoiceList.indexOf(type) == -1) {
                uni.showToast({ title: '商家不支持该类型发票~', icon: 'none' })
                return
            }
            this.invoiceType = type
            this.pageForm.curPage = 1
            this.dataList = []
            this.getData()
        },

        // 触底加载
        onBottom() {
            if (this.pageForm.curPage >= this.totalPages) return
            this.pageForm.curPage++
            this.getData()
        },

        // 显示弹窗，并重置数据
        changePopup() {
            this.show = !this.show
            if (this.show) {
                this.pageForm.curPage = 1
                this.dataList = []
                this.getData()
                this.invoiceType = this.invoiceList.length == 1 ? this.invoiceList[0] : this.invoiceType
            }
        }
    }
}
</script>
