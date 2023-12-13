<template>
	<view class="w750">
		<!-- 帮助栏目 -->
		<ls-header title="帮助栏目"></ls-header>
		<ls-load-more v-if="articleList.length" className="mt-2 bg-fff" :status="paging.status">
			<view v-for="article in articleList" 
				:key="article.id"
				class="border-bottom h-88r text-333 overflow-h" 
				style="padding: 24rpx; line-height: 40rpx;" 
				@click="$navigateTo(`/ModuleCenter/question/questionDetail?newsId=${article.id}`)"
			>
				<text class="line-clamp1">{{ article.newsTitle }}</text>
			</view>
		</ls-load-more>
		<ls-empty v-else :paging="paging" className="pt-20"/>
		<!--/帮助栏目 -->
	</view>
</template>

<script>
	import { questionApi } from '@/api/ModulesUser.js'
	import pageUtil from '@/utils/pageUtils.js'
	const listPage = new pageUtil(questionApi.getQuestionArticle, { field: { list: 'articleList' }})
	export default {
		data() {
			return {
				artId: '',
				articleList: [],
				paging: {
					status: 'loading',
					error: false, // 是否错误
					emptylist: false // 是否显示列表为空时的样式
				}
			}
		},
		onLoad(options) {
			this.artId = options.id;		// 存储一份 为分页做预留
			listPage.loadListByPage(this, { id: options.id })
		},
		onReachBottom() {
			listPage.loadListByPageMore()
		},
		methods: {
		}
	}
</script>

<style>
	page {
		background-color: var(--backgroundcolor);
	}
</style>
<style lang='scss' scoped>
</style>
