<template>
    <!-- 横向 -->
    <view class="transition-all02" :class="horizontal?'':'grid-column2 grid-c-20 grid-r-20 px-1 bg-f5'" :style="{ '--themescolor': themesColor,'--themesrgba': themesrgba,'--gradientcolor':gradientcolor  }" @click="myEvent()">
     <view
		:class="horizontal?'d-flex p-2 ':' bg-fff rounded-20 overflow-h  pb-2'"
     	v-for="(item,index) in goodlist"
        :key="index"
		 @click.stop="$navigateTo(`/ModuleGoods/goodsDetail/goodsDetail?id=${item.productId}`)"
     >
		<view :class="horizontal?'w-200r h-200r':'pb-100pre w-100 '" class="position-relative  overflow-h" >
			<view class="position-absolute left-0 top-0 w-100 h-100">
				<ls-image :src="item.productPic" mode="aspectFill" :options="{ w:'100%', h:'100%', br:horizontal?'10':''}"/>
			</view>
		</view>
         <view :class="horizontal?'pl-2':'px-1'" class="flex-1 flex-col-between overflow-h line-h">
            <view class="font-28 line-clamp2 line-h-md">{{ item.productName }}</view>
			
			<view class="font-24 text-999 mt-1 line-clamp2 line-h-sm">
				{{ item.brief }}
			</view>
            <view class="font-24 mt-1 w-100 border-box text-left d-flex a-center line-clamp1">
				<ls-price
					:price="item.price"
					:options="{ is: '34', ds: '28', iw: '500', ic:  themesColor, dc: themesColor }"
				></ls-price>
				<text class="ml-2 line-through text-999" v-if="item.originalPrice">{{item.originalPrice}}</text>
             </view>
			 <view v-if="type==1" class="text-999 pt-2 font-24 d-flex" @click.stop="$navigateTo(`/ModuleGoods/shopHome/shopIndex?shopId=${item.shopId}`)">
				 <text class="line-clamp1 " style="width:auto;">{{item.shopName}}</text>
				 <text class="ml-2 text-dark flex-1 text-nowrap">进店 <text class="iconfont icon-ArrowRight" style="font-size: 24rpx;"></text></text>
			 </view>
         </view>
     </view>
    </view>
    <!-- 横向 -->
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
        /**
         * 主题色，当有传值时，用来替换themes.color
         */
        color: {
            type: [String],
            default: ''
        }
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
    computed: {
        price() { // 统一管理商品价格
            return function(money) {
                let arr = []
                if (money && money.toString().indexOf('~') != -1) { // 判断money是否为1.00~2.00的模式
                    arr = [money,'']
                }else{
                    arr = this.$stringUtils.formatNumber(money || 999)
                }
                return arr
            }
        },
		
		// 主题色，当color有传值时，用来替换themes.color
		themesColor(){
			return this.color || this.themes.color
		},
		
		themesrgba(){
			const rgb = this.$utils.color.colorRgb(this.themesColor)
			return `rgba(${rgb.r},${rgb.g},${rgb.b},0.6)`
		},
		
		gradientcolor(){
			const rgb = this.$utils.color.colorRgb(this.themesColor)
			return `rgba(${rgb.r},${rgb.g},${rgb.b},0.7)`
		}
    },
    created() {},
    methods: {
        myEvent() {
            this.$emit('myEvent', this.parmas)
        }
    }
}
</script>

<style lang="scss" scoped>
	.couponWarp{
		// overflow-x: scroll;
	}
	.couponWarp .couponClass:first-child{
		// transform: translateX(0) scale(0.8) !important;
		// transform-origin: left center !important;
	}
	.couponClass{
		
		transform-origin: left center;
		flex-shrink: 0;
		&::before{
			content: '';
			position: absolute;
			left: -17rpx;
			top: 50%;
			width: 20rpx;
			height: 20rpx;
			background: #fff;
			transform: translate(0,-50%);
			border-right: 2rpx solid var( --themescolor );
			border-radius: 50%;
		}
		&::after{
			content: '';
			position: absolute;
			right: -17rpx;
			top: 50%;
			width: 20rpx;
			height: 20rpx;
			background: #fff;
			transform: translate(0,-50%);
			border-left: 2rpx solid var( --themescolor );
			border-radius: 50%;
		}
	}


</style>

<!-- 用法：
    注意：其父组件要加入这个class：grid-column2
    <view class="grid-column2" v-if="!goodsType">
        <ProList @myEvent="enterGoods" :parmas="item" :src="item.pic" :name="item.name" :money="item.cash" v-for="(item, index) in searchArr" :key="index"></ProList>
    </view>
-->
