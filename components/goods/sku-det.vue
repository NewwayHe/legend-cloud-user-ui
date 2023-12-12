<template>
    <!-- /*
     * @Descripttion:商品详情楼层：SKU选项/已选
    */ -->
    <view class="p-2 flex-between font-28 overflow-h bg-white" :class="className" @click="clickDet" :style="{ '--themescolor': themes.color }">
        <view class="text-333 font-weight">已选</view>
        <view class="mx-2 overflow-x-scroll text-nowrap flex-1 text-left" v-if="selectedName">
            <text class="pr-1">{{ selectedName }}</text>
            <text class="pr-1">{{ num }}件</text>
        </view>
        <view class="mx-2 overflow-x-scroll text-nowrap flex-1 text-left" v-else>
            <text class="pr-1">默认规格</text>
            <text class="pr-1">{{ num }}件</text>
        </view>
        <text class="iconfont icon-caidan1 text-999"></text>
    </view>
</template>

<script>
export default {
    name: 'sku-det',

    components: {},

    props: {
        className: String,
        skuItem: {
            type: Object,
            default() {
                return {}
            }
        },
        num: {
            type: Number,
            default: 1
        }
    },

    data() {
        return {
            selectedName: ''
        }
    },

    computed: { },

    watch: {
        skuItem() {
            if (this.skuItem.cnProperties) {
                const preName = this.skuItem.cnProperties.split(';')
                this.selectedName = preName
                    .reduce((arr, item) => {
                        arr.push(item.split(':')[1])
                        return arr
                    }, [])
                    .join('，')
            }
        }
    },

    created() {},

    mounted() {},

    destroyed() {},

    methods: {
        // 关闭SKU
        clickDet() {
            this.$emit('showLayer')
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
