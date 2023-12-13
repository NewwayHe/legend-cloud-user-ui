<template>
    <!-- /*
     * @Descripttion:商品详情楼层：规格属性
    */ -->
    <view class="bg-white px-2 pb-2"  :class="className" v-show="prodParams && prodParams.length">
		<view class="py-4 font-weight font-32 text-333">规格参数</view>
        <!-- SPU参数 -->
        <view
            class="overflow-h transition-all05 border border-eee"
            :style="{ height: showCollapse && isCollapse ? maxHeight*2 + 'rpx' : height + 'px' }"
        >	
			<!-- class-prodParams 放在子元素，不能放在设置高度的元素身上，否则切换页面的时候会导致获取高度是210的高度，展开和收起被隐藏了 -->
			<view class="class-prodParams overflow-h">
				<view class="font-28 overflow-h" v-for="prodParam in prodParams" :key="prodParam.id">
				    <view class="border-bottom border-eee p-2">
				        <text class="font-weight">{{ prodParam.groupName }}</text>
				    </view>
				    
				    <view class="border-bottom border-eee flex-start text-999 position-relative" v-for="param in prodParam.productPropertyBOList" :key="param.id">
				        <text class="span24-7 p-2">{{ param.propName }}</text>
				        <view class="flex-1 p-2">
				            <text v-for="(ele,index) in param.prodPropList" :key="ele.id">{{ ele.name }}{{ (index!=param.prodPropList.length-1)?'，':'' }}</text>
				        </view>
				        <text class="position-absolute h-100 bg-eee bottom-0" style="width: 2rpx;left: 29%;"></text>
				    </view>
				</view>
			</view>
        </view>

        <!-- /(SPU级别)规格属性 -->
        <view class="flex-center h-80r" @click="collapse" v-if="showCollapse" :class="{'is-no-open':isCollapse}">
            <text class="pr-2 font-28 text-999">{{ isCollapse ? '展开' : '收起' }}</text>
            <text class="iconfont icon-ArrowDown text-999 d-inline-block transition-all05" style="font-size: 20rpx;" :style="{transform: `rotate(${isCollapse?0:180}deg)`}"></text>
        </view>
    </view>
</template>
<script>
export default {
    name: 'GoodParams',
    components: {},

    props: {
        className: String,
        maxHeight: {
            // 最大显示高度
            type: [Number, String],
            default: 210
        },
        // 参数数组
        prodList: {
            type: Array,
            default() {
                return []
            }
        }
    },

    data() {
        return {
            prodParams: '',
            isCollapse: true,
            showCollapse: false,
            height: '' // 记录主体class的高度
        }
    },

    computed: { },

    watch: {
        prodList: {
            handler(newValue, oldValue) {
                if (newValue) {
                    this.prodParams = this.prodList
                    this.$nextTick(() => { this.getClassProdParams() })
                }
            },
            deep: true,
            immediate: true
        },
    },

    // #ifdef MP-WEIXIN
    onReady() {
        // console.log('备注：只有‘小程序’才走onReady');
    },
    // #endif

    // #ifndef MP-WEIXIN
    mounted() {
        // console.log('备注：‘H5+app’只走mounted不走onReady');
    },
    // #endif

    created() {},

    beforeDestroy() {},

    destroyed() {},

    methods: {
        async getClassProdParams() {
            const classRect = await this.$utils.getRect(this, '.class-prodParams')
            this.height = classRect.height
            if (classRect.height > this.maxHeight * 1) {
                this.showCollapse = true
            } else {
                this.showCollapse = false
            }
        },

        // 折叠(点击展开或收起)
        collapse() {
            this.isCollapse = !this.isCollapse
        }
    }
}
</script>

<style lang="scss" scoped>
	.is-no-open{
		position: relative;
		background-image: linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 80%);
		padding-top: 100px;
		margin-top: -100px;
	}
</style>
