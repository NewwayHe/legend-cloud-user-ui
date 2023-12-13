<template>
	<view class="bg-f8 px-2 py-2 w-100" >
		<ls-load-more :status="paging.status" :key="'shop'">
		<view class="shop_item bg-fff rounded-24 py-4 px-2 mb-2" v-for="(item, index) in list" :key="index">
			<view class="d-flex j-sb a-center">
				<view class="d-flex">
					<!-- 图片 -->
					<view class="w-80r h-80r">
						<ls-image :src="item.shopAvatar" :options="{ w: '100%', h: '100%', br: '50%',bg:'#eeeeee' }" :osOptions="{ w: '100', h: '100' }" :errorStyle="1" :key="index"/>
					</view>
					<view class="font-24 ml-2 flex-1 overflow-h" style="margin-top: -2px;">
						<!-- 店铺名称 -->
						<view>
							<text class="font-26 text-333 line-clamp1">{{item.shopName}}</text>
							<!-- 需要添加v-if 根据有旗舰店才显示 -->
							<text v-if="item.tag" class="l-gradient-lt my d-inline-block mx text-fff font-24 px py rounded" style="transform: scale(0.7);"
							 :style="{ 'background-color': themes.color }">
								{{item.tag && item.tag}}
							</text>
						</view>
						<!-- 好评 -->
						<view>
							<u-rate style="vertical-align: middle;" :count="count" v-model="item.credit" disabled size="20" :active-color="themes.color"
							 allowHalf inactive-icon="star-fill"></u-rate>
							<text style="vertical-align: middle;" class="ml-1 text-999">好评{{ item.favorableRate }}%</text>
						</view>
					</view>
				</view>
				<view>
					<view class="border border-main text-main w-100r h-50r flex-center rounded-100 font-24" @click.stop="$navigateTo(`/ModuleGoods/shopHome/shopIndex?shopId=${item.shopId}`)">进店</view>
				</view>
			</view>
			<!-- 内容 -->
			<view class="grid-column3 grid-gap20 mt-3" v-if="item.product.length!==0">
				<block v-for="(item1, index1) in item.product" :key="index1">
					<view :class="' '" class="position-relative pb-100pre w-100" v-if="index1<3">
						<view class="position-absolute left-0 top-0 w-100 h-100">
							<ls-image :src="item1.pic" :options="{ w: '100%', h: '100%', br:'12' }" :osOptions="{ w: '210', h: '210' }"/>
						</view>
					</view>
				</block>
			</view>
		</view>
		</ls-load-more>
		<empty className="pt-20" :paging="paging" :title="'暂无搜索结果'" :type="3" />
	</view>
</template>

<script>
	import { search } from '@/api/ModuleGoods.js';
	import pageUtils from '@/utils/pageUtils.js';
	import empty from '@/components/ls-app/ls-empty/ls-empty';
	const listPage = new pageUtils(search.searchShop);
	export default {
		components: {
			empty
		},
		props: {
			searchQuery: {
				type: Object
			}
		},
		watch: {},
		computed: { },
		data() {
			return {
				count: 5, // 总星星数量
				value: 3.5, // 当前星星数量
				scrollTop: '',
				list: [],
				paging: {
					status: 'loading',
					error: false, // 是否错误
					emptylist: false // 是否显示列表为空时的样式
				}
			}
		},
		methods: {
			getData() {
				listPage.loadListByPage(this, this.searchQuery);
			},
			loadMore(){
				// 加载下一页
				listPage.loadListByPageMore();
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
