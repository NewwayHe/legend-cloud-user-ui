<template>
    <!-- #ifdef MP -->
    <ls-popover ref="popover" opPosition="end" bgColor="rgba(0, 0, 0, 0.85)" @change="changePopover">
    <!-- #endif -->
    <!-- #ifndef MP -->
   <ls-popover ref="popover" opPosition="start" transform="-85" transformOrigin="85" triPosition="85" bgColor="rgba(0, 0, 0, 0.85)" @change="changePopover">
    <!-- #endif -->
        <!-- 图标 -->
        <view class="flex-center w-60r h-60r rounded-circle text-nowrap position-relative" :style="{backgroundColor:circularBg, '--themescolor': themes.color}">
            <text class="iconfont" :class="[type == 1?'icon-caidan':'icon-caidan1']" :style="{color:circular,fontSize:`40rpx`}"></text>
			<text
				class="position-absolute rounded-50 py px-1 font-20 flex-center but-main"
				style="top: -10rpx; right: -10rpx; height: 40rpx; transform: scale(0.8)"
				:class="theme?'bg-white text-main':'but-main'"
				v-if="myInfo.message&&!on"
			>
				{{ myInfo.message > 99 ? '99+' : myInfo.message||0 }}
			</text>
        </view>
        <!-- 图标 -->
        <!-- 头部下拉菜单 -->
        <view slot="content" :style="{ '--themescolor': themes.color }">
			<view @click.stop="go('message')">
			    <view class="flex-start">
					<view class="position-relative w-80r p-12">
						<text class="iconfont icon-evaluation"></text>
						<text
							class="position-absolute rounded-50 py px-1 font-20 flex-center but-main"
							style="top: 0rpx; left: 24rpx; height: 40rpx; transform: scale(0.8)"
							v-if="myInfo.message"
						>
							{{ myInfo.message > 99 ? '99+' : myInfo.message||0 }}
						</text>
					</view>
			        <text class="w-170r line-h-4">消息</text>
			    </view>
			</view>
            <view @click.stop="go('index')">
                <view class="flex-start">
					<text class="iconfont icon-shouye2 w-80r p-12"></text>
                    <text class="w-170r line-h-4">首页</text>
                </view>
            </view>
            <view @click.stop="go('category')">
                <view class="flex-start">
					<text class="iconfont icon-fenlei5 w-80r p-12"></text>
                    <text class="w-170r line-h-4">分类搜索</text>
                </view>
            </view>
            <view @click.stop="go('cart')">
                <view class="flex-start">
					<text class="iconfont icon-gouwuche w-80r p-12"></text>
                    <text class="w-170r line-h-4">购物车</text>
                </view>
            </view>
            <view @click.stop="go('my')">
                <view class="flex-start">
					<text class="iconfont icon-touxiang1 w-80r p-12"></text>
                    <text class="w-170r line-h-4">个人中心</text>
                </view>
            </view>
            <!-- <view @click.stop="go('serviceChat')">
                <view class="flex-start">
					<text class="iconfont icon-a-kefu1 w-80r p-12"></text>
                    <text class="w-170r line-h-4">联系客服</text>
                </view>
            </view> -->
            <view @click.stop="go('history')">
                <view class="flex-start">
					<text class="iconfont icon-zuji2 w-80r p-12"></text>
                    <text class="w-170r line-h-4">浏览记录</text>
                </view>
            </view>
        </view>
        <!-- /头部下拉菜单 -->
    </ls-popover>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'head-select',
    components: {},
    props: {
        /**
         * 是否用主题颜色
         */
        theme: {
            type: Boolean,
            default: false
        },
        type: {
            // 按钮的样式，1：显示由上到下的三个横条，2：显示由左到右的三个圆点
            type: Number,
            default: 1
        },
        circularBg: {
            // 圆圈背景颜色
            type: String,
            default: '#ffffff'
        },
        circular: {
            // 圆圈内的三横的颜色
            type: String,
            default: '#000'
        }
    },
    data() {
        return {
            on: false,
        }
    },
    computed: {
        ...mapState(['myInfo'])
    },
    methods: {
        go(flag) {
			this.$emit('clickHeadSelect', this.on) // 告诉页面已经点击了头部下拉菜单里的选项(准备离开该页面),用到beforeRouteLeaver且记录了浏览历史的页面要拿到该参数进行判断将阻止离开页面的条件清空
			const pages = getCurrentPages();
			const curPage = pages.slice(-1)[0].route;
			let isStill = false;	//是否原地跳转
			switch(flag) {
				case 'serviceChat':
					isStill = curPage == 'ModuleGoods/serviceChat/serviceChat';
					break;
				case 'history':
					isStill = curPage == 'ModuleCenter/history/history';
					break;
				case 'message':
					isStill = curPage == 'ModuleCenter/message/message';
					break;
				default:
					isStill = curPage == `pages/${flag}/${flag}`;
					break;
			}
			if(isStill) {
				this.$refs.popover.changeFalse()
				return;
			};
            this.$nextTick(() => {
                if (flag == 'serviceChat') {
                    // 去客服
                    const params = {
                        consultId: 0,
                        consultType: 'other',
                        shopId: 0
                    }
                    uni.navigateTo({
                        url: `/ModuleGoods/serviceChat/serviceChat?parmas=${encodeURIComponent(JSON.stringify(params))}`
                    })
                } else if (flag == 'history') {
                    uni.navigateTo({ url: '/ModuleCenter/history/history' })
                } else if (flag == 'message') {
					uni.navigateTo({ url: '/ModuleCenter/message/message' })
				} else {
                    this.$switchTab(`/pages/${flag}/${flag}`)
                }
            })
        },
        // 点击页面后头部下拉菜单
        changePopover(flag) {
            this.on = flag
            this.$emit('showHeadSelect', this.on)
        }
    }
}
</script>
<style lang="scss" scoped>
	.w-170r {
		width: 170rpx;
	}
	.p-12 {
		padding: 24rpx;
	}
	.line-h-4 {
		line-height: 40rpx;
	}
</style>
