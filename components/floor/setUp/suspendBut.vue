<template>
    <!-- /*
     * @Descripttion:(功能组件：悬浮按钮)
    */ -->
    <view
        class="position-fixed zindex-109 h-120r w-120r shadow-sm flex-center"
        :style="{
            left: `${floors.position == 'left' ? 0 : ''}`,
            right: `${floors.position == 'right' ? 0 : ''}`,
            bottom: `calc(${floors.offsetBottom * 2 + (parmas.category=='INDEX'&&!shopId?100:0) }rpx + var(--safe-area-inset-bottom))`,
            borderRadius: `${floors.position == 'left' ? '0rpx 60rpx 60rpx 0rpx' : '60rpx 0rpx 0rpx 60rpx'}`,
            background: floors.themeColor ? parmas.themeColor : floors.backgroundColor
        }"
        @click.stop="jumpPage(floors.url,shopId)"
    >   
        <ls-image :src="floors.img" :options="{ w: '80', h: '80', br: '50%' }" v-if="floors.img"/>
    </view>
</template>

<script>
import floorMixin from '@/mixins/floor.js';
export default {
    components: {},
    mixins: [floorMixin],
    filters: {},
    props: {
        floors: {
            type: Object,
            default: () => {
                return {}
            }
        },
        parmas: {
            type: Object,
            default: () => {
                return {}
            }
        },
        shopId: { // 如果有传shopId，则是店铺装修的组件
            type: [String,Number],
            default: ''
        },
    },
    data() {
        return {}
    },
    computed: {},
    watch: {},
    mounted() {},
    destroyed() {},
    methods: { }
}
</script>

<style lang="scss" scoped></style>
