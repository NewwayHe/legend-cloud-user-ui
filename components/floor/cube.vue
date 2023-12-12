<template>
    <!-- /*
     * @Descripttion:楼层(楼层组件：魔方)：cube
    */ -->
    <!-- 魔方：魔方类型(cubeType)：1-2:1左2右,1*2:1行2列,1*3:1行3列,1*4:1行4列,2*2:2行2列  -->
    <view
        class="overflow-h position-relative"
        :class="[
            `grid-column${floors.cubeType == '1*3' || floors.cubeType == '2*3' ? '3' : floors.cubeType == '1*4' ? '4' : '2'}`,
            { 'p-1': floors.cardType }
        ]"
        :style="{ height: `${floors.height}px`, backgroundColor: floors.backgroundColor, gridTemplateRows: floors.cubeType == '1-2' || floors.cubeType == '2*2' || floors.cubeType == '2*3'? 'repeat(2, 50%)':'repeat(1, 100%)' }"
    >
        <!-- 背景图片 -->
        <image
            class="w-100 h-100 position-absolute top-0 right-0 font-0"
            :src="photoServer + floors.backgroundImg"
            alt=""
            v-if="floors.backgroundImg"
        />
    	<block v-for="(item, index) in floors.data.imgList">
    		<view
    			:class="[index == 0 && floors.cubeType == '1-2' ? 'grid-r-span2' : '', floors.cardType?'p-1':'']"
    			:key="index"
    			v-if="
    				floors.cubeType == '1*2'
    					? index <= 1
    					: floors.cubeType == '1*3' || floors.cubeType == '1-2'
    					? index <= 2
    					: floors.cubeType == '2*3'
    					? index <= 5
    					: index <= 3
    			"
    		>
    			<ls-image
    				:options="{ w: '100.5%', h: floors.cubeType == '1-2' && index == 0 ? '100.25%' : '100.5%', br: floors.cardType ? '24' : '' }"
    				:osOptions="{ w: 500 }"
    				:src="item.img"
    				@click="jumpPage(item.url,shopId)"
    			/>
    		</view>
    	</block>
    </view>
</template>

<script>
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
    watch: {},
    mounted() {},
    destroyed() {},
    methods: {}
}
</script>

<style lang="scss" scoped></style>
