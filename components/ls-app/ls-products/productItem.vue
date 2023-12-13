<template>
	<!-- 横向 -->
	<view
		class="bg-fff"
		:class="horizontal ? 'd-flex pt-2 pr-2 pb-3 pl-2 w-100' : 'rounded-24 overflow-h pb-3'"
		@click.stop="$navigateTo(`/ModuleGoods/goodsDetail/goodsDetail?id=${parmas.productId}`)"
		:style="{ '--themescolor': themesColor,'--gradientcolor':themesrgba07,'--themergb03':themesrgba03}"
	>
		<view :class="horizontal ? 'w-240r h-240r' : 'pb-100pre w-100'" class="position-relative overflow-h">
			<view class="position-absolute left-0 top-0 w-100 h-100">
				<ls-image :src="pic" mode="aspectFill" :options="{ w: '100%', h: '100%', br: horizontal ? '12' : '' }" :osOptions="{ w: 500, h: 500 }" />
			</view>
		</view>
		<view :class="horizontal ? 'pl-2' : 'px-2'" class="flex-1 overflow-h line-h">
			<!-- 标题和描述 定死高度 -->
			<view :class="horizontal ? 'h-120r' : ''">
				<view class="font-28 line-h-md text-333">
					<view :class="horizontal ? 'line-clamp2' : 'line-clamp1 pt-2'">{{ name }}</view>
				</view>
				<view v-if="parmas.brief && horizontal" class="font-24 text-999 line-clamp1 line-h-md" style="margin-top: 6rpx;">{{ parmas.brief }}</view>
			</view>
			<!-- 价格 -->
			<view class="position-relative">
				<view class="font-24 pt-2 w-100 border-box text-left">
					<ls-price :price="money" :options="{ is: '36', ds: '28', iw: '500', ic: themesColor, dc: themesColor }"></ls-price>
					<text class="line-through text-999" :class="horizontal ? 'ml-1' : 'd-block ml-0'" v-if="originalPrice">￥{{ originalPrice }}</text>
				</view>
			</view>
			<!-- 优惠券 -->
			<!-- 后台有接口时把注释拿掉 -->
			<view class="flex-start overflow-x-scroll text-nowrap mt" style="transform-origin: left center;line-height: 0.7;" v-if="parmas.tagList && parmas.tagList.length">
				<block v-for="(item, index) in parmas.tagList" :key="index">
					<!-- 秒杀1 拼团2 团购3 限时折扣4 满减满折5 积分6 -->
					<view
						v-if="item.type == 6 || item.type == 1 || item.type == 2 || item.type == 3"
						class="l-gradient-lt my d-inline-block mx text-fff font-24 py position-relative rounded border"
						v-show="horizontal"
						:style="{ 'border-color': themesrgba03 }"
					>
						<view class="scale-07">{{ item.type == 6 ? '积分' : item.type == 1 ? '秒杀' : item.type == 2 ? '拼团' : '团购' }}</view>
					</view>
					<view
						v-if="item.type == 4"
						class="my border flex-center mx font-24 overflow-h position-relative rounded-5 pr-1 zindex-2"
						:class="horizontal ? '' : 'ml-0'"
						:style="{ 'border-color': themesrgba03 }"
					>
						<view style="border-bottom-right-radius: 10rpx;" class="mr py h-100 l-gradient-l text-fff "><text class="d-inline-block scale-07 pl">限时</text></view>
						<view class="text-main"><text class="d-inline-block scale-07">折扣</text></view>
					</view>
					<view v-if="item.type == 5" class="couponClass my d-inline-block mx text-main font-24 py position-relative border" :style="{ 'border-color': themesrgba03 }">
						<text class="d-inline-block scale-07">{{ item.content }}</text>
					</view>
					<!-- 赚标签 -->
					<view
						v-if="item.type == 7"
						class="border my d-inline-block mx font-24 py position-relative rounded text-white"
						:style="{ background: themesColor }"
					>
						<text class="d-inline-block scale-07">{{item.content}}</text>
					</view>
					<!-- 券标签 -->
					<view
						v-if="item.type == 8"
						class="border my d-inline-block mx font-24 py position-relative rounded"
						:style="{ color: themesColor, 'border-color': themesrgba03 }"
					>
						<text class="d-inline-block scale-07">{{item.content}}</text>
					</view>
					<view
						v-if="item.type == '###'"
						class="border my d-inline-block mx font-24 py position-relative rounded"
						:style="{ color: themesColor, 'border-color': themesrgba03 }"
					>
						<text class="d-inline-block scale-07">免邮</text>
					</view>
				</block>
			</view>
			<view v-if="type == 1" class="text-999 font-24 pt-1 d-flex" @click.stop="$navigateTo(`/ModuleGoods/shopHome/shopIndex?shopId=${parmas.shopId}`)">
				<text class="line-clamp1" style="width:auto;">{{ parmas.shopName }}</text>
				<text class="ml-2 text-dark flex-1 text-nowrap">
					进店
					<text class="iconfont icon-ArrowRight d-inline-block" style="font-size: 24rpx; transform: scale(0.7);"></text>
				</text>
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

		parmas: Object,
		pic: String,
		name: String,
		money: [Number, String],
		originalPrice: [Number, String],
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
		item: {},
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
			list: []
		};
	},
	computed: {
		price() {
			// 统一管理商品价格
			return function(money) {
				let arr = [];
				if (money && money.toString().indexOf('~') != -1) {
					// 判断money是否为1.00~2.00的模式
					arr = [money, ''];
				} else {
					arr = this.$stringUtils.formatNumber(money || 999);
				}
				return arr;
			};
		},
		// 主题色，当color有传值时，用来替换themes.color
		themesColor(){
			return this.color || this.themes.color
		},
		themesrgba03(){
			const rgb = this.$utils.color.colorRgb(this.themesColor)
			return `rgba(${rgb.r},${rgb.g},${rgb.b},0.3)`
		},
		themesrgba07(){
			const rgb = this.$utils.color.colorRgb(this.themesColor)
			return `rgba(${rgb.r},${rgb.g},${rgb.b},0.7)`
		},
	},
	created() {},
	mounted() {},
	methods: {
		myEvent() {
			this.$emit('myEvent', this.parmas);
		}
	}
};
</script>

<style lang="scss" scoped>
.vertical {
	&productItem {
		background-color: fff;
		border-radius: 20rpx;
		overflow: hidden;
		padding-bottom: 20px;
	}
}

.horizontal {
	&productItem {
		display: flex;
		padding: 20rpx;
	}
}
</style>

<style lang="scss" scoped>
.moneyBox {
	display: flex !important;
}

.couponClass {
	transform-origin: left center;
	flex-shrink: 0;

	&::before {
		content: '';
		position: absolute;
		left: -17rpx;
		top: 50%;
		width: 20rpx;
		height: 20rpx;
		background: #fff;
		transform: translate(0, -50%);
		border-right: 2rpx solid var(--themergb03);
		border-left: 1rpx solid #ffffff;
		border-bottom: 1rpx solid #ffffff;
		border-top: 1rpx solid #ffffff;
		border-radius: 50%;
		box-sizing: border-box;
	}

	&::after {
		content: '';
		position: absolute;
		right: -17rpx;
		top: 50%;
		width: 20rpx;
		height: 20rpx;
		background: #fff;
		transform: translate(0, -50%);
		border-left: 2rpx solid var(--themergb03);
		border-right: 1rpx solid #ffffff;
		border-bottom: 1rpx solid #ffffff;
		border-top: 1rpx solid #ffffff;
		border-radius: 50%;
		box-sizing: border-box;
	}
}
</style>

<!-- 用法：
    注意：其父组件要加入这个class：grid-column2
    <view class="grid-column2" v-if="!goodsType">
        <ProList @myEvent="enterGoods" :parmas="item" :src="item.pic" :name="item.name" :money="item.cash" v-for="(item, index) in searchArr" :key="index"></ProList>
    </view>
-->
