<!-- /*
     * @Descripttion:海报页面
*/ -->
<template>
    <view :style="{ '--themescolor': indexData.color }">
        <view class="position-relative h-100 w-100" :style="{ backgroundColor: indexData.backgroundColor }" v-if="!$u.test.isEmpty(indexData)">
			<view class="w-100 position-absolute top-0 right-0 font-0">
				<image class="w-100" :src="photoServer + indexData.backgroundImg" mode="widthFix" v-if="indexData.backgroundImg"></image>
			</view>

			<!-- /头部 -->
			<view class="position-relative">
				<!-- 楼层装修 -->
				<block v-for="(item, index) in floorArr" :key="index">
					<banner :parmas="indexData" :floors="item" :shopId="shopId" :key="item.uuid" v-if="item.type == 'banner'" />
					<menuTab :parmas="indexData" :floors="item" :shopId="shopId" :key="item.uuid" v-if="item.type == 'menuTab'" />
					<cube :parmas="indexData" :floors="item" :shopId="shopId" :key="item.uuid" v-if="item.type == 'cube'" />
					<navigation :parmas="indexData" :floors="item" :shopId="shopId" :key="item.uuid" v-if="item.type == 'navigation'" />
					<navigationTab :parmas="indexData" :floors="item" :shopId="shopId" :key="item.uuid" v-if="item.type == 'navigationTab'" />
					<prodList :scrollTop="scrollTop" :parmas="indexData" :floors="item" :shopId="shopId" :key="item.uuid" v-if="item.type == 'prodList'" />
					<richText :parmas="indexData" :floors="item" :shopId="shopId" :key="item.uuid" v-if="item.type == 'richText'" />
					<assistLine :parmas="indexData" :floors="item" :shopId="shopId" :key="item.uuid" v-if="item.type == 'assistLine'" />
					<titleTab :parmas="indexData" :floors="item" :shopId="shopId" :key="item.uuid" v-if="item.type == 'titleTab'" />
					<noticeBar :parmas="indexData"  :floors="item" :key="item.uuid" :shopId="shopId" v-if="item.type == 'noticeBar'"/>
					<coupon :parmas="indexData" :floors="item" :shopId="shopId" :key="item.uuid" v-if="item.type == 'coupon'" />
				</block>
				<!-- 楼层装修 -->
				
				<!-- 功能组件：悬浮按钮 (备注：该组件如果放在跟image背景图同级的话，会不显示)-->
				<suspendBut :parmas="indexData" :floors="indexData.suspendBut" :shopId="shopId" v-if="indexData.suspendBut && indexData.suspendBut.show"/>
			</view>
        </view>
		<ls-empty className="center-xy" :title="'暂无相关楼层数据'" :paging="paging" @reLoad="getData" reLoad/>
    </view>
</template>

<script>
// API接口
import { trim } from '@/api/ModulesCommon'

// 装修功能组件
import suspendBut from '@/components/floor/setUp/suspendBut.vue'

// 楼层组件
import banner from '@/components/floor/banner.vue'
import cube from '@/components/floor/cube.vue'
import menuTab from '@/components/floor/menuTab.vue'
import navigation from '@/components/floor/navigation.vue'
import navigationTab from '@/components/floor/navigationTab.vue'
import prodList from '@/components/floor/prodList.vue'
import noticeBar from '@/components/floor/noticeBar.vue';

// 其它组件
import richText from '@/components/floor/richText.vue';
import assistLine from '@/components/floor/assistLine.vue';
import titleTab from '@/components/floor/titleTab.vue';

// 营销组件
import coupon from '@/components/floor/coupon.vue';

import { mapState } from 'vuex'
import pageScroll from '@/mixins/pageScroll.js'
export default {
    components: {
		// 装修功能组件
        suspendBut,
        
		// 楼层组件
        banner,
        cube,
        menuTab,
        navigation,
        navigationTab,
        prodList,
        noticeBar,
		
		// 其它组件
		richText,
		assistLine,
		titleTab,
		
		// 营销组件 
		coupon,
    },
	mixins: [pageScroll],
    data() {
        return {
            indexData: {}, // 接收mobile/index接口的res.data
            floorArr: [], // 接收mobile/index接口的res.data.floors

            pageId: '',
            shopId:'',// 如果该变量有值，该海报就是店铺海报
			paging: {
			    status: 'loading',
			    error: false, // 是否错误
			    emptylist: false // 是否显示列表为空时的样式
			},
			templateId:'',// 预览海报模板ID，如果有该id，则该页面是调用trim.sDecoratePageShow()接口
        }
    },

    computed: {
        ...mapState(['stausBarHeight','systemConfig'])
    },
    created() {},
    onLoad(option) {
        this.pageId = option.pageId || null
		this.templateId = option.templateId || null
        this.shopId = this.$checkInfo([{ type: 'hasValue', value: option.shopId }]) ? option.shopId : null // 不$checkInfo hasValue的话，链接上的undefined会认为是有值
		// console.log(this.shopId);
        this.getData()
    },
    onShow() {},
    mounted() {},
	onPullDownRefresh(e) {},
	// 页面上拉触底事件的处理函数
	onReachBottom() {},

    // 自定义好友分享。
    // #ifdef MP
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            // console.log(res.target);
        }
        return {
            title: this.systemConfig && this.systemConfig.domainName ? this.systemConfig.domainName : '',
            path: this.$utils.pages.getPageRoute().url
        }
    },
    // #endif

    methods: {
        // 获取楼层数据
        getData() {
            const that = this
			const api = this.templateId && this.shopId ? 'sDecoratePageShow' : this.templateId ? 'adminDecoratePageShow' : this.shopId ? 'posterPage' : 'showMobilePosterPage'// this.templateId 如果是后台显示的预览页面
			const parmas = this.templateId ? { id: this.templateId,shopId:this.shopId } : { pageId:this.pageId, shopId:this.shopId }
			this.paging = {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false // 是否显示列表为空时的样式
			}
			trim[api](parmas).then(res => {
				if (res.code && res.data) {
					this.indexData = this.templateId ? JSON.parse(res.data.data) : res.data
					this.floorArr = this.indexData.floors
					console.log('indexData:',this.indexData)
		
					if (this.indexData.name) {
						uni.setNavigationBarTitle({
							// 更改当前页面标题
							title: that.indexData.name
						})
					}
					// console.log(that.floorArr)
				}
            }).catch((err) => {
				this.paging.error = true
			}).finally((res) => {
				this.paging.status = 'noMore'
				// 如果没有数据
				if (!this.$checkInfo([{ type: 'hasValue', value: this.floorArr }])) {
					this.paging.emptylist = true
				}
				uni.stopPullDownRefresh();
			});
        }
    }
}
</script>

<style lang="scss" scoped>
uni-page-body {
    height: 100%;
}
</style>
