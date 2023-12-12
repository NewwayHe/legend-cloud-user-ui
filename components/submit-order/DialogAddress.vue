<!-- 新增地址 -->
<template>
    <u-popup v-model="showPopup" zIndex="999" border-radius="24" safe-area-inset-bottom>
        <view class="position-relative py-1 px-3 my-2 flex-center">
            <text class="font-32 text-center" style="font-weight: 500; line-height: 44rpx;">配送至</text>
			<view class="position-absolute flex-center custom-close" @click.stop="showPopup = false">
				<text class="iconfont icon-guanbi" style="color: #666666; font-size: 24rpx;"></text>
			</view>
        </view>
        <view style="height: 700rpx; padding-bottom: 120rpx;">
            <scroll-view class="h-100" scroll-y @scrolltolower="scrollBottom">
                <ls-load-more :status="paging.status" v-if="!paging.emptylist">
                    <block v-for="(item, index) in list" :key="index">
                        <view class="d-flex a-center py-2 pl-2 pr-3 font-30 border-bottom" @click="curSel = item.id">
							<text class="iconfont mr-2" :class="[ item.id == curSel ? 'icon-gouxuan' : 'icon-location' ]" :style="[{ 'color': item.id == curSel ? themes.color : '#000' }]"></text>
                            <view class="address-con flex-1">
                                <view class="item-p">
                                    <text class="name">{{ item.receiver }}</text>
                                    <text class="phone mx-2">{{ item.mobile }}</text>
									<u-tag v-if="item.commonFlag" text="默认" size="mini" :bg-color="themes.color" color="#fff" border-color="transparent" style="border-radius: 4rpx; padding: 0 8rpx; font-size: 20rpx; line-height: 28rpx;"/>
                                </view>
                                <view class="det mt text-999 font-24">
                                    {{ item.provinceName }}{{ item.cityName }}{{ item.areaName }}{{ item.streetName }}
                                </view>
                            </view>
                        </view>
                    </block>
                </ls-load-more>
                <ls-empty title="暂无相关地址列表" :paging="paging"/>
            </scroll-view>
			<view class="w-100 safearea-bb-white position-fixed bottom-0 p-2 bg-fff">
				<ls-button
					v-if="list.length"
				    className="but-main w-100 h-80r"
				    text="确定"
					@click="chooseAddress"
				    :options="{ br: '40', ls: '3', fs: '26', lh: '36rpx' }"
				/>
				<ls-button
					v-else
				    className="but-main w-100 h-80r"
				    text="去新增"
					@click="toAddAddress"
				    :options="{ br: '40', ls: '3', fs: '26', lh: '36rpx' }"
				/>
			</view>
        </view>
    </u-popup>
</template>
<script>
import pageUtil from '@/utils/pageUtils.js'
import { addressManage } from '@/api/ModulesUser.js'
const listPage = new pageUtil(addressManage.getAddress)
export default {
    components: { },
    props: {
        addressId: {
            type: [String, Number]
        }
    },
    data() {
        return {
            list: [],
            paging: {
                status: 'loading',
                error: false, // 是否错误
                emptylist: false // 是否显示列表为空时的样式
            },
            showPopup:false,
			curSel: null,	//当前选择的地址
        }
    },
    computed: { },
	watch: {
		addressId: {		//将prop做data化存储
			handler(nAddr) {
				this.curSel = nAddr;
			},
			immediate: true
		},
		showPopup(nShow) {	//关闭后如果未点击确定 要重置勾选状态
			if(!nShow) {
				this.curSel = this.addressId
			}
		}
	},
    created() {},

    mounted() {},
    onShow() {},
    methods: {
        // 显示弹窗，并重置数据
        changePopup() {
            this.showPopup = !this.showPopup
            this.$nextTick(() => {
                listPage.loadListByPage(this)
            })
        },
        // 修改收获地址
        chooseAddress() {
            this.$emit('changeAddr', this.curSel)
            this.showPopup = !this.showPopup
        },
        scrollBottom() {
            listPage.loadListByPageMore()
        },
		// 去新增
		toAddAddress() {
			this.$u.route({
				url: '/ModuleCommon/address/addAddress',
			})
			this.$nextTick(() => {
				this.showPopup = false;
			})
		}
    }
}
</script>

<style scoped>
.custom-close {
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	background-color: #F5F5F5;
	top: 10rpx;
	right: 30rpx;
}

.address-con .item-p {
	font-size: 28rpx;
	font-weight: 500;
	line-height: 40rpx;
	color: #333;
}
</style>
