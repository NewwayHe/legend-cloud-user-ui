<template>
    <!-- 如果是游客(没登录)，进入须要登录显示内容的页面时，在未登录前，用该页面代替 -->
    <view class="center-xy font-28" :style="{ '--themescolor': themes.color }">
        <view class="flex-center">
			<view class="w-200r h-200r bg-main rounded-circle flex-center overflow-h" v-if="systemConfig&&systemConfig.logo">
				<ls-image :src="systemConfig.logo" :options="{ w: '160', h: '160',br:'100%' }" />
			</view>
            <image :src="staticServer + 'static/images/certification-icon.png'" style="height: 200rpx; width: 200rpx" v-else></image>
        </view>
        <view class="text-666 mt-2 text-nowrap">{{ title }}</view>
        <view class="flex-center" @click="goLogin">
            <view class="bg-main text-white mt-3 px-5 py-1 rounded-100 flex-center">
                <text>立即登录</text>
            </view>
        </view>
    </view>
</template>

<script>
import { mapState } from 'vuex'
import { appToken } from '@/utils/Cache.js'
export default {
    components: {},
    props: {
        pic: {
            type: String,
            default: '/static/images/pages/isVisitor.png'
        },
        title: {
            type: String,
            default: '很抱歉，登录后才可查看此页面！'
        }
    },
    data() {
        return {
        }
    },
    computed: {
        ...mapState(['systemConfig'])
    },
    methods: {
        goLogin() {
            appToken.toLogin()
        }
    }
}
</script>

<style lang="stylus" scoped></style>
