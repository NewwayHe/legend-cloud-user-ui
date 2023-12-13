<template>
	<view class="w750" :style="{ '--themescolor': themes.color, '--themesrgba02': themes.rgb02 }">
		<ls-header theme>
			<view class="flex-between flex-1 text-333 zindex-99">
				<view class="flex-1 flex-center py-2 pl-2 pr-1 rounded-50 h-60r line-h position-relative bg-fff">
					<text class="iconfont icon-sousuo text-ccc pr-1" style="font-size: 28rpx;"></text>
                    <input
						focus
                        class="w-100 font-28 text-333 px-1 line-h safari-input"
						style="outline: none; -webkit-appearance: none;"
                        type="text"
                        v-model="searchText"
                        confirm-type="search"
						placeholder="搜索内容"
						placeholder-style="color:#bbbbbb; font-size:28rpx; outline: none;"
						@confirm="enterSearch"
						maxlength="30"
					/>
					<view class="w-60r h-60r flex-center" @click.stop="clean('searchText')" v-show="searchText">
						<view class="iconfont icon-close text-ccc" style="font-size: 36rpx;"></view>
					</view>
				</view>
				<view class="font-28 text-fff flex-center px-2" @click="enterSearch"><text>搜索</text></view>
			</view>

			<template v-slot:bottom>
				<view class="bottom w-100vw h-20r bg-main"></view>
			</template>
			<!-- 左右弧度 -->
			<view class="position-absolute rounded-circle bg-transparent w-40r h-40r left-0" :style="'bottom: -40rpx; box-shadow: -20rpx -20rpx 0rpx 0rpx' + themes.color"></view>
			<view class="position-absolute rounded-circle bg-transparent w-40r h-40r right-0" :style="'bottom: -40rpx; box-shadow: 20rpx -20rpx 0rpx 0rpx' + themes.color"></view>
			<!-- /左右弧度 -->
		</ls-header>

		<view class="bg-fff">
			<view v-if="historySearch.length">
				<!-- 历史搜索 -->
				<view class="px-2">
					<view class="font-28 mt-3 mb-2 font-weight flex-between">
						最近搜索
						<text class="iconfont icon-delete text-666" style="font-size: 28rpx;" @click.stop="clearKey"></text>
					</view>
					<view class="clearfix font-24 text-666 history-con" >
						<block v-for="(item, index) in historySearch" :key="index">
							<view
								class="flex-center px-3 h-60r mr-2 mb-2 float-left bg-f7 rounded-50 overflow-h text-nowrap"
								:class="'history-item'+index"
								style="max-width: 46%;"
								@click="goSearch(item)"
								ref="historySearchItem"
								v-if="overKey&&!isShow?index<(historySearch.length-(overKey+1)):true"
							>
								<text class="line-clamp1">{{ item }}</text>
							</view>
						</block>

						<view class="float-left position-relative" @click="isShow=!isShow" v-if="overKey">
							<text class="iconfont icon-backtop2 position-absolute left-0 top-0 zindex-2 transition-all05" style="color: #F7F7F7;font-size: 60rpx;" :style="{transform: `rotate(${isShow?0:180}deg)`}"></text>
							<view class="flex-center position-absolute left-0 top-0" style="width: 60rpx;height: 60rpx;">
								<view class="bg-666 rounded-circle" style="width: 50rpx;height: 50rpx;"></view>
							</view>
						</view>
					</view>
				</view>
				<!-- /历史搜索 -->
			</view>

			<!-- 热搜 -->
			<view v-if="hotSearch">
				<view class="pl-2">
					<view class="font-28 my-2">热搜</view>
					<view class="clearfix">
						<view
							class="px-3 mr-1 mb-2 float-left bg-f7 rounded-50 text-999 flex-center"
							style="height: 60rpx"
							v-for="(item, index) in hotSearch"
							:key="index"
							@click="goSearch(item.msg)"
						>
							{{ item.msg }}
						</view>
					</view>
				</view>
			</view>
			<!-- 热搜 -->

			<!-- 搜索发现 -->
			<view class="pl-2" v-if="searchFind">
				<view class="font-28 my-2 font-weight-600">搜索发现</view>
				<view class="clearfix">
					<view
						v-for="(item, index) in searchFind"
						:key="index"
						class="px-3 mr-1 mb-2 float-left bg-f7 rounded-50 flex-center"
						style="height: 60rpx"
						:style="{ color: index === 0 ? themes.color : '' }"
					>
						<text class="iconfont icon-huo mr-1" v-if="index === 0"></text>
						{{ item }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { searchHistory } from '@/utils/Cache.js';
// import { hotSearch } from '@/api/search.js'
export default {
	components: {},
	data() {
		return {
			searchText: '', // 搜索内容 v-molde
			searchRecord: [], // 搜索历史
			hotSearch: null, // 热搜
			historySearch: '',
			searchFind: null ,// 搜索发现
			isShow:false,
			overKey:0,// 统计出有多少个元素是超过两行的
		};
	},
	computed: {
		...mapState(['stausBarHeight'])
	},
	mounted() { },
	onShow() {
		// 获取历史搜索
		this.historySearch = searchHistory.getSearchHistory();
		this.$nextTick(() => {
			this.gethistoryItem()
		})
	},
	methods: {
		// 进去搜索列表
		enterSearch() {
			const searchText = this.$stringUtils.trim(this.searchText, 2);
			searchHistory.addSearchHistory(searchText);
			uni.redirectTo({ url: `/ModuleGoods/search/searchList?searchText=${searchText}` });
		},
		goSearch(text) {
			searchHistory.addSearchHistory(text);
			uni.navigateTo({ url: `/ModuleGoods/search/searchList?searchText=${text}` });
		},
		// 清楚历史搜索
		clearKey() {
			uni.showModal({
				title: '清空历史搜索',
				content: '是否确认此操作',
				success: res => {
					if (res.confirm) {
						searchHistory.clearSearchHistory();
						this.historySearch = [];
					} else if (res.cancel) {
					}
				}
			});
		},
		// 清除输入框的内容
		clean(flag) {
			this[flag] = '';
		},
		async gethistoryItem(){
			if (this.historySearch && this.historySearch.length) {
				this.$utils.getRect(this,`.history-con`).then(resCon => {
					this.historySearch.forEach((item,index) => {
						this.$utils.getRect(this,`.history-item${index}`).then(res => {
							if ((res.top - resCon.top) > ((res.height + 10) * 2 - 10)) {
								this.overKey++
							}
						})
					})
				})
			}
		}
	}
};
</script>
<style lang="scss" scoped>
	.safari-input {
		::v-deep .uni-input-input {
			-webkit-appearance: none;	//Mac safari去除边框 [感觉是safari的版本过低问题。。]
		}
	}
</style>
