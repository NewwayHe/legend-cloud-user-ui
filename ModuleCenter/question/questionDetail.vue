<template>
    <view class="w750 white-bg">
        <!-- 问题详情 -->
        <view class="p-2">
            <template v-if="!$u.test.isEmpty(QuestionDetail)">
                <view class="font-weight font-40 my-2">{{ QuestionDetail.newsTitle }}</view>
                <view class="det-txt overflow-h">
					 <u-parse :html="QuestionDetail.newsContent"></u-parse>
				</view>
                <view class="text-999 font-24 mt-2">发表于 {{ QuestionDetail.createTime  }}</view>
            </template>
            <ls-empty className="center-xy" :type='4' :title="'对不起, 该文章找不到或已被删除!'" :paging="paging"/>
        </view>
        <!-- /问题详情 -->
    </view>
</template>

<script>
import { questionApi } from '@/api/ModulesUser.js';
export default {
    components: {},

    data() {
        return {
            QuestionDetail: {}, //问题详情
			paging: {
			    status: 'loading',
			    error: false, // 是否错误
			    emptylist: false // 是否显示列表为空时的样式
			},
            newsContenthtml: ''
        };
    },
    computed: { },
    onLoad(option) {
        if (option.newsId) {
			this.paging = {
			    status: 'loading',
			    error: false, // 是否错误
			    emptylist: false // 是否显示列表为空时的样式
			},
            questionApi.questionDetail({ id: option.newsId }).then(res => {
                if (res.code == 1) {
                    this.QuestionDetail = res.data;
                }
            }).catch((err) => {
				this.paging.error = true
            }).finally((res) => {
				this.paging.status = 'noMore'
                //如果没有商品数据
                if (!this.$checkInfo([{ type: 'hasValue', value: this.QuestionDetail }])) {
					this.paging.emptylist = true
                }
            });
        }
    },
	onShow() {},
    mounted() {
    },
};
</script>

<style scoped>
.det-txt >>> img {
    max-width: 100%;
}
</style>
