<template>
    <view class="w750 overflow-h" :style="{ '--themescolor': themes.color }">
        <!-- 意见反馈 -->
		<ls-header title="意见反馈"></ls-header>
		<view class="p-3 pt-4">
			<view class="position-relative">
				<!-- 这里不能用text标签 否则小程序会丢失间距20rpx -->
				<view class="font-28 text-333 mb-2" style="line-height: 40rpx;">请详细描述您的意见：</view>
				<u-input v-model="txt" type="textarea" placeholder='请输入内容' :custom-style="{ 'padding': '30rpx', 'background-color': '#f8f8f8', 'border-radius': '12rpx', 'transform': 'translate3d(0,0,0)'}"
				height="350" :auto-height='false' maxlength='500' :cursor-spacing="20" :clearable='false'
				/>
				<view class="position-absolute font-24 text-ccc bottom-0" style="right: 30rpx;">{{ txt.length }}/500</view>
			</view>
			<view class="mt-6" v-if="!userInfo.id">
				<view class="font-28 text-333 mb-2" style="line-height: 40rpx;">手机号码：</view>
				<u-input class='mt-2' v-model="phone" type="number" placeholder='请填写手机号，方便我们与您联系' :custom-style="{ 'padding': '20rpx 30rpx','background-color': '#f8f8f8', 'border-radius': '12rpx', 'transform': 'translate3d(0,0,0)'}"
				height='40' maxlength='11' :cursor-spacing="20" :clearable='false'
				/>
			</view>
		</view>
		<view class="w-100 safearea-bb-white position-fixed bottom-0 p-2">
			<ls-button
			    className="but-main w-100 h-80r"
			    loading
			    text="提交"
			    :asyncFunction="submit"
			    :options="{ br: '50', ls: '3', fs: '26' }"
			/>
		</view>
        <!-- /意见反馈 -->
    </view>
</template>
<script>
import { mapState } from 'vuex'
import { feedbackApi } from '@/api/ModuleShop.js'
import { appToken } from '@/utils/Cache.js'
export default {
    components: {},
    data() {
        return {
            // feedback: '', // 意见反馈
            txt: '', // 内容
            phone: '', // 电话
			isFocus: false
            // columns: ['商品相关', '物流状况', '客户服务', '优惠活动', '功能异常', '产品建议', '其他'],
        }
    },
    computed: {
        ...mapState(['userInfo']),
        // 检测手机号码是否正确
        phoneRight() {
            return /^1[0-9][0-9]{9}$/.test(this.phone)
        },
    },
    mounted() {
        // this.$applyStyle(this.themes.color);
    },
    methods: {
        // 提交反馈意见
        submit() {
			return new Promise((resolve) => {
				if (!this.txt) {
				    uni.showToast({ title: '请输入您的反馈意见', icon: 'none' })
				    return resolve()
				}
				// if (this.txt.length > 250) {
				//     uni.showToast({ title: '超过字数限制', icon: 'none' })
				//     return
				// }
				if (!appToken.isLogin()) {
				    if (!this.phone) {
				        uni.showToast({ title: '请输入您的手机号码', icon: 'none' })
				        return resolve()
				    } else {
				        if (this.phoneRight == false) {
				            uni.showToast({ title: '请输入正确的手机号码', icon: 'none' })
				            return resolve()
				        }
				    }
				}
				
				feedbackApi({ content: this.txt, mobile: this.phone, feedbackSource: 'mobile' }).then((res) => {
				    if (res.code) {
				        // this.feedback = res.result;
				        uni.showToast({
				            title: '提交成功',
				            mask: true,
				            complete:() => {
				                setTimeout(() => {
				                    this.$switchTab(`/pages/my/my`)
				                }, 1000)
				            }
				        })
				    }
				}).finally(() => { return resolve() })
			})
        },
    }
}
</script>

<style>
page {
	background-color: #fff;
}
</style>
