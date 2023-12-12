<template>
    <view class="flex-center p-1" v-if="list&&list.length">
        <view class="flex-1 flex-center overflow-h shadow" :class="Number(type)==1?'w-80r h-80r rounded-circle':'rounded-10 w-70r h-70r m-1'" :style="[itemStyle(index)]" v-for="(item,index) in list" @click="jumpPage(item.url)">
			<ls-image :src="item.img" :options="{ w: Number(type)==1?80:70, h: Number(type)==1?80:70, br: 10 }"></ls-image>
		</view>
    </view>
</template>

<script>
import floorMixin from '@/mixins/floor.js';
export default {
	// #ifdef MP-WEIXIN
	// 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性。这时在<组件name> 里加style和class是不会生效的
	options: { virtualHost: true },
	// #endif
    components: {},
    data() {
        return {
            pic: ''
        }
    },
	mixins: [floorMixin],
    props: {
        list: {
            type: Array,
            default: () => {
                return []
            }
        },
		// 自定义样式，对象形式
		cssStyle: {
		    type: Object,
		    default() {
		        return {};
		    }
		},
		// content 弹框的border线颜色
		type: {
			type: [String,Number],
			default: ''
		},
    },
    computed: {
	},
    created() { },
    onLoad() {
    },

    mounted() {
    },

    methods: {
		itemStyle(index) {
			let style = '';
			if (Number(this.type)==1&&this.list) {
				if (this.list.length == 2) {
					if (index==0) {
						style =  { transform: `rotate(-30deg) translate(-30rpx, 0rpx)`};
					}
					if (index==1) {
						style =  { transform: `rotate(30deg) translate(30rpx, 0rpx)`};
					}
				}
				if (this.list.length == 3) {
					if (index==0) {
						style =  { transform: `rotate(-45deg) translate(-40rpx, 20rpx)`};
					}
					if (index==2) {
						style =  { transform: `rotate(45deg) translate(40rpx, 20rpx)`};
					}
				}
				if (this.list.length == 4) {
					if (index==0) {
						style =  { transform: `rotate(-60deg) translate(-60rpx, 30rpx)`};
					}
					if (index==1) {
						style =  { transform: `rotate(-20deg) translate(-10rpx, 0rpx)`};
					}
					if (index==2) {
						style =  { transform: `rotate(20deg) translate(10rpx, 0rpx)`};
					}
					if (index==3) {
						style =  { transform: `rotate(60deg) translate(60rpx, 30rpx)`};
					}
				}
				if (this.list.length == 5) {
					if (index==0) {
						style =  { transform: `rotate(-70deg) translate(-84rpx, 30rpx)`};
					}
					if (index==1) {
						style =  { transform: `rotate(-30deg) translate(-20rpx, 0rpx)`};
					}
					if (index==2) {
						style =  { transform: `rotate(0deg) translate(0rpx, -20rpx)`};
					}
					if (index==3) {
						style =  { transform: `rotate(30deg) translate(20rpx, 0rpx)`};
					}
					if (index==4) {
						style =  { transform: `rotate(70deg) translate(84rpx, 30rpx)`};
					}
					
				}
			}
			style = this.$u.deepMerge(style, this.cssStyle);
			return style;
		}
	}
}
</script>

<style lang="stylus" scoped>
</style>
