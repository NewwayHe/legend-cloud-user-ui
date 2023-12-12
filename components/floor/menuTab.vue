<template>
    <!-- /*
     * @Descripttion:(楼层组件：菜单)：menuTab
    */ -->
    <view
        class="h-88r flex-start"
        :style="{
            backgroundColor: floors.themeColor ? parmas.themeColor : floors.backgroundColor,
            color: floors.fontThemeColor ? parmas.themeColor : floors.color
        }"
    >
        <view class="flex-1 h-100 font-24 text-nowrap overflow-x" :class="[`flex-${floors.position || 'start'}`]">
            <view
                class="px-2 flex-center"
                :class="[floors.style == 'border' ? 'h-100' : '']"
                :style="{
                    color: item.themeColor ? parmas.themeColor : item.color,
                    borderRight: `${
                        floors.assistLine && index != floors.data.titleList.length - 1 && floors.position != 'around' && floors.position != 'between'
                            ? '1px'
                            : '0px'
                    } solid ${floors.bdThemeColor ? parmas.themeColor : floors.borderColor}`,
                    height: `${floors.assistLine && index != floors.data.titleList.length - 1 ? '15px' : ''}`
                }"
                v-for="(item, index) in floors.data.titleList"
                :key="index"
                @click="jumpPage(item.url,shopId)"
            >
                <image style="width: 40rpx; height: 40rpx" :src="photoServer + item.img" alt="" v-if="floors && item.img" />
                <text class="pl-1">{{ item.title }}</text>
            </view>
        </view>

        <!-- 如果是是微信端，放一个胶囊的点位符 -->
        <!-- #ifdef MP -->
        <!-- <view :style="{width: wxMenuBut.placeholder+5 + 'px',}"  v-if="isFirstFloor"></view> -->
        <!-- #endif -->
    </view>
</template>

<script>
import { mapState } from 'vuex'
import floorMixin from '@/mixins/floor.js'
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
        shopId: {//如果有传shopId，则是店铺装修的组件
            type: [String,Number],
            default: ''
        },
    },
    data() {
        return {
        }
    },
    computed: {
        ...mapState(['wxMenuBut'])
        // isFirstFloor() {//如果菜单组件是第一层，在小程序时加入胶囊点占符
        //     return (this.parmas.floors && this.parmas.floors[0].uuid == this.floors.uuid)?true:false;
        // }
    },
    watch: {},
    mounted() {},
    destroyed() {},
    methods: {}
}
</script>

<style lang="scss" scoped></style>
