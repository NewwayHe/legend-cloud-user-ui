<template>
    <view class="w750" :class="true ? 'white-bg' : 'gray-body'" :style="{ '--themescolor': themes.color, '--themesrgba03': themes.rgb03 }">
        <ls-header showHeadSelect title="物流详情"></ls-header>
		<view v-if="!$u.test.isEmpty(logisticsData)">
            <view class="logistics-msg">
                <view class="msg-det">
                    <view class="det-txt">
                        承运来源：
                        <text class="det-span">{{ logisticsData.logisticsCompany }}</text>
                    </view>
                    <view class="det-txt">
                        运&nbsp;单&nbsp;号&nbsp;：
                        <text class="det-span">{{ logisticsData.shipmentNumber }}</text>
                    </view>
                </view>
            </view>
            <view class="logistics-follow">
                <text class="follow-tit ml-2">物流跟踪</text>
                <view class="follow-con">
                    <view class="logistis-det" :class="index == 0 ? 'cur' : ''" v-for="(item, index) in logisticsArr" :key="index">
                        <text class="det-p">{{ item.context }}</text>
                        <text class="det-span">{{ item.ftime }}</text>
                    </view>
                </view>
            </view>
        </view>
		<ls-empty className="center-xy" :title="title" :paging="paging"/>
    </view>
</template>

<script>
import { orderApi } from '@/api/ModulesOrder.js'
export default {
    components: {},
    data() {
        return {
            title: '',
            logisticsArr: [],
            logisticsData: {},
			paging: {
			    status: 'loading',
			    error: false, // 是否错误
			    emptylist: false // 是否显示列表为空时的样式
			},
        }
    },
    computed: { },
    onLoad(option) {
        // 当传过来的值是orderNumber时，查看普通商品物流
        if (option.orderNumber) {
            this.paging = {
            	status: 'loading',
            	error: false, // 是否错误
            	emptylist: false // 是否显示列表为空时的样式
            }
            orderApi.information({ orderNumber: option.orderNumber }).then((res) => {
                if (res.code == 1) {
                    if (res.data) {
                        this.logisticsArr = JSON.parse(res.data.trackingInformation) || []
                        this.logisticsData = res.data
                    }
                } else {
                    this.title = res.msg
                }
            }).catch((err) => {
				this.paging.error = true
				this.title = '业务异常，请稍后重试！'
			}).finally((res) => {
				this.paging.status = 'noMore'
				if (!this.$checkInfo([{ type: 'hasValue', value: this.logisticsData }])) {
					this.paging.emptylist = true
				}
			});
        }
		// 当传过来的值是refundReturnLogisticsDTO时(用户售后订单退货物流)
		if (!this.$u.test.isEmpty(option.refundReturnLogisticsDTO) && JSON.parse(decodeURIComponent(option.refundReturnLogisticsDTO))) {
			this.logisticsData = JSON.parse(decodeURIComponent(option.refundReturnLogisticsDTO)) || {}
			this.logisticsArr = JSON.parse(this.logisticsData.trackingInformation) || []
			this.paging.status = 'noMore'
			if (!this.$checkInfo([{ type: 'hasValue', value: this.logisticsData }])) {
				this.paging.emptylist = true
			}
		}
    },
    mounted() {},
    methods: {},
    onShow() {},
}
</script>
<style>
page {
    background-color: var(--backgroundcolor);
}
</style>
<style scoped>
/* 物流跟踪 */
.logistics-msg {
    background: #fff;
    padding: 13px 10px;
    position: relative;
    display: -webkit-flex;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
}
.logistics-msg .msg-img {
    width: 90px;
    height: 90px;
    font-size: 0;
}
.logistics-msg .msg-img img {
    width: 100%;
    height: 100%;
}
.logistics-msg .msg-det {
    margin: 0 10px;
    font-size: 14px;
    flex: 1;
}
.logistics-msg .msg-det .det-txt {
    display: block;
    line-height: 24px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-top: 5px;
    color: #999;
}
.logistics-msg .msg-det .det-txt .det-span {
    margin-left: 5px;
    color: #333;
    font-family: arial;
}
.logistics-msg .msg-det .det-txt .det-span.cur {
    color: var(--themescolor);
}

.logistics-follow {
    background-color: #fff;
    padding: 15px 10px 0 10px;
    margin-top: 10px;
    position: relative;
}
.logistics-follow .follow-tit {
    padding: 10px 0;
    line-height: 24px;
    font-size: 14px;
    color: #999;
}
.logistics-follow .follow-con {
    padding: 10px 0;
    margin-top: 5px;
}
.logistics-follow .follow-con .logistis-det {
    padding-left: 20px;
    position: relative;
    border-left: 1px solid #f1f1f1;
    margin: 0 10px;
    line-height: 24px;
}
.logistics-follow .follow-con .logistis-det:last-child {
    border-color: #fff;
}
.logistics-follow .follow-con .logistis-det:before {
    content: '';
    display: block;
    width: 17px;
    height: 17px;
    border-radius: 50%;
    background: #fff;
    position: absolute;
    left: -9px;
    top: 0;
    z-index: 2;
}
.logistics-follow .follow-con .logistis-det:after {
    content: '';
    display: block;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #ccc;
    position: absolute;
    left: -5px;
    top: 4px;
    z-index: 3;
}
.logistics-follow .follow-con .logistis-det .det-p {
    font-size: 14px;
    position: relative;
}
.logistics-follow .follow-con .logistis-det .det-p:before {
    content: '';
    display: block;
    width: 17px;
    height: 17px;
    border-radius: 50%;
    background: #fff;
    position: absolute;
    left: -29px;
    top: 0;
    z-index: 1;
}
.logistics-follow .follow-con .logistis-det .det-p .logistics-phone {
    color: var(--themescolor);
}
.logistics-follow .follow-con .logistis-det .det-span {
    color: #999;
    font-size: 12px;
    font-family: arial;
    padding-bottom: 10px;
    display: block;
    margin-top: 5px;
    line-height: 22px;
}
.logistics-follow .follow-con .logistis-det.cur .det-p {
    color: var(--themescolor);
}
.logistics-follow .follow-con .logistis-det.cur:before {
    background: var(--themesrgba08);
}
.logistics-follow .follow-con .logistis-det.cur:after {
    background: var(--themescolor);
}
/* end 物流跟踪 */
</style>
