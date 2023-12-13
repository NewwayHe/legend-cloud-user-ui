<template>
	<view class="transition-all02" :class="horizontal?'horizontal':'vertical grid-column2 grid-c-10 grid-r-10 p-2 bg-f8'">
		<slot></slot>
	</view>
</template>
<script>
export default {
    components: {},
    props: {
        /**
         * 是否显示评论
         */
        comments: {
            type: Boolean,
            default: true
        },
		// 是否水平排列
		horizontal: {
            type: Boolean,
            default: true
        },
		// 列表数据
		goodlist: {
		    type: [Array]
		},
        /**
         * 1：一般页面上用(显示专营店与多少条评论)，2：shopIndex店铺主页专用(不显示专营店，显示评论与好评率)
         */
        type: {
            type: [Number, String],
            default: 1
        },
		color: String,
    },
    watch: {
        parmas(newValue, oldValue) {}
    },
    data() {
        return {
			list:[
				{},
				{},
				{},
				{},
			]
        }
    },
    computed: { },
    created() {},
    methods: {
       
    }
}
</script>
<style lang="scss" >
	.vertical{
		
		//组件名称当作标签使用
		product-item{
			background-color: fff;
			border-radius: 20rpx;
			overflow: hidden;
		}
	}
	.horizontal{
		product-item{
			display: flex;
			// padding: 20rpx;
		}
	}
</style>
