<template>
	<view class="w750 position-relative">
		<!-- 帮助中心 -->
		<ls-header title="帮助中心"></ls-header>
		<ls-load-more className="helpWrap text-333 font-28" :status="paging.status">
			<view class="helpItem bg-fff mt-2 flex-between" v-for="questionType in questionTypeList" :key="questionType.id">
				<view class="text-center flex-shrink px-3 overflow-h" style="flex-basis: 200rpx">
					<text class="line-clamp1" style="line-height: 40rpx">{{ questionType.newsCategoryName }}</text>
					<ls-button
						v-if="questionType.status == 2"
						className="w-100 h-56r mt-1 flex-center"
						text="查看更多"
						@click="navigateToList(questionType.id)"
						:options="{ br: '28', ls: '3', fs: '24', pr: '0', pl: '0', bd: '#DCDFE6' }"
						hoverClass="none"
						:ripple="false"
					/>
				</view>
				<view class="flex-1 overflow-h">
					<view
						class="border-left border-top h-88r"
						style="padding: 24rpx"
						v-for="article in questionType.items.slice(0, 3)"
						:key="article.id"
						@click="$navigateTo(`/ModuleCenter/question/questionDetail?newsId=${article.id}`)"
					>
						<text class="line-clamp1">{{ article.newsTitle }}</text>
					</view>
				</view>
			</view>
		</ls-load-more>
		<ls-empty :paging="paging" className="pt-20" />
		<!-- /帮助中心 -->
	</view>
</template>

<script>
import { questionApi } from "@/api/ModulesUser.js";
import pageUtil from "@/utils/pageUtils.js";
const questionPage = new pageUtil(questionApi.getQuestionType, { field: { list: "questionTypeList" } });
export default {
	data() {
		return {
			questionTypeList: [],
			paging: {
				status: "loading",
				error: false, // 是否错误
				emptylist: false, // 是否显示列表为空时的样式
			},
			questionParams: {
				//栏目列表参数
				// curPage: 2,	//调试用
				pageSize: 10,
			},
			articleList: [],
		};
	},
	computed: {},
	watch: {},
	onLoad() {
		questionPage.loadListByPage(this, this.questionParams);
	},
	onReachBottom() {
		questionPage.loadListByPageMore();
	},
	methods: {
		// 跳转 对应栏目 页面
		navigateToList(liId) {
			this.$u.route("/ModuleCenter/question/helpList", { id: liId });
		},
	},
};
</script>

<style>
page {
	background-color: var(--backgroundcolor);
}
</style>
<style lang="scss" scoped>
.questionList {
	::v-deep .u-cell {
		padding: 24rpx;
	}
}
</style>
