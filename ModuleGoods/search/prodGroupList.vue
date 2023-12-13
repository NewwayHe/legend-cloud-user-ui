<template>
    <view class="w750" :style="{ '--themescolor': themes.color }">
        <ls-header title="商品分组">
            <view slot="right" class="px-2" @click="changeType">
                <text class="iconfont" :class="goodsType?'icon-fenlei4':'icon-fenlei2'" style="font-size: 40rpx;"></text>
            </view>
        </ls-header>
        
        <view class="search-list" v-if="!paging.emptylist">
            <ls-load-more :status="paging.status">
                <!-- 纵向列表 -->
                <view class="ser-list" v-if="goodsType">
                    <SearchCon @myEvent="enterGoods" :parmas="item" :pic="item.pic" :name="item.productName||item.prodName" :money="item.price" v-for="(item, index) in list" :key="index"></SearchCon>
                </view>
                <!-- 纵向列表 -->
                
                <!-- 横向列表 -->
                <view class="grid-column2" v-if="!goodsType">
                    <ProList @myEvent="enterGoods" :parmas="item" :pic="item.pic" :name="item.productName||item.prodName" :money="item.price" v-for="(item, index) in list" :key="index"></ProList>
                </view>
                <!-- 横向列表 -->
            </ls-load-more>
        </view>
        <ls-empty className="center-xy" :title="'暂无列表信息'" :paging="paging" @reLoad="getData" reLoad/>
    </view>
</template>

<script>
import { mapState } from 'vuex';
import pageUtil from '@/utils/pageUtils.js';
import ProList from '@/components/ls-app/ls-products/proList';
import SearchCon from '@/components/ls-app/ls-products/searchCon';
import { trim } from '@/api/ModulesCommon.js';
const listPage = new pageUtil(trim.groupProductPage);

export default {
    components: { ProList, SearchCon },
    data() {
        return {
            goodsType: true, // 默認-纵向列表
            
            params: {
                groupId: ''
            },
            list: [],
            paging: {
                status: 'loading',
                error: false, // 是否错误
                emptylist: false,// 是否显示列表为空时的样式
            },
        };
    },
    computed: {
        ...mapState(['systemConfig'])
    },
    onLoad(option) {
        // uni.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: this.themes.color })//页面导航条变成主题颜色
        this.params.groupId = option.id || null
        this.getData()
    },
    mounted() {
    },
    // 下拉加载
    onReachBottom() {
        listPage.loadListByPageMore();
    },
    
    // #ifdef MP-WEIXIN
    // 自定义好友分享。
    onShareAppMessage(res) {
        return { 
            title: this.systemConfig && this.systemConfig.domainName ? this.systemConfig.domainName : '',
            path: '/ModuleGoods/search/prodGroupList?id=' + this.params.groupId,
        };
    },
    // #endif
    
    methods: {
		getData(){
			listPage.loadListByPage(this, this.params)
		},
        // 商品列表切换模式
        changeType() {
            this.goodsType = !this.goodsType;
        },
        enterGoods(event) {
            const id = event.productId;
            uni.navigateTo({ url: `/ModuleGoods/goodsDetail/goodsDetail?id=${id}` })
        },
     },
};
</script>
