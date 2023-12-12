<template>
    <view class="w750">
        <view class="px-2 py-2 font-28 pageTitle font-weight">常见问题</view>
        <!-- 常见问题 -->
        <view class="question">
            <view
                class="item"
                v-for="(questionType, index) in questionTypeList"
                :key="index"
                :class="{ cur: questionObject.currIndex == index && questionObject.isActive }"
            >
                <view class="entry-con-tit px-2 font-28 py-2" @click="toggleSelect(questionType, index)">
                    <view class="entry-con">
                        <view class="con-box d-flex a-center">
                            <view class="flex-1">
                                <text class="entry-name">{{ questionType.newsCategoryName }}</text>
                            </view>
                            <view class="d-flex a-center arrow">
                                <text
                                    class="iconfont icon-ArrowRight"
									style="font-size: 28rpx;"
                                    :class="[questionObject.currIndex == index && questionObject.isActive ? 'icon-ArrowDown' : 'icon-ArrowRight']"
                                ></text>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="entry-con-select">
                    <template v-if="questionType.items && questionType.items.length">
                        <view
                            class="entry-con px-2"
                            v-for="(item1, index1) in questionType.items"
                            :key="index1"
                            @click="$navigateTo(`/ModuleCenter/question/questionDetail?newsId=${item1.id}`)"
                        >
                            <view class="con-box d-flex a-center py-2">
                                <view class="flex-1">
                                    <text class="entry-name">{{ item1.newsTitle }}</text>
                                </view>
                            </view>
                        </view>
                    </template>
                    <view class="entry-con px-2 py-2 font-28" v-else>该问题栏目下没有问题列表哦~</view>
                </view>
            </view>
        </view>
        <!-- /常见问题 -->
    </view>
</template>

<script>
import { questionApi } from '@/api/ModulesUser.js'
export default {
    data() {
        return {
            questionTypeList: [],
            currentIndex: '',
            questionObject: {
                isActive: false,
                currIndex: ''
            },
            currentArticleList: []
        }
    },
    mounted() {
        // 常见问题
        questionApi.getQuestionType().then((res) => {
            if (res.code == 1) {
                this.questionTypeList = res.data
            }
        })
    },
    methods: {
        getArticleList(data, index) {
            questionApi.getQuestionArticle(data).then((res) => {
                if (res.code == 1) {
                    this.questionTypeList[index].items = res.data.resultList
                }
            })
        },
        toggleSelect(questionType, index) {
            if (this.questionObject.currIndex == index && this.questionObject.isActive) {
                this.questionObject.isActive = false
            } else {
                this.questionObject.currIndex = index
                this.questionObject.isActive = true
                questionType.items || this.getArticleList({ id: questionType.id }, index)
            }
        }
    }
}
</script>

<style>
/* 常见问题 */

.pageTitle {
    border-bottom: 1px solid #f1f1f1;
}
.question .item {
    border-bottom: 1px solid #f1f1f1;
}
.question .item .entry-con-tit .entry-con .con-box {
    border-bottom: 0;
}
.question .item .entry-con-select {
    border-top: 1px solid #f1f1f1;
    display: none;
}
.question .item.cur .entry-con-select {
    display: block;
}
.question .item .entry-con-select .entry-con {
    font-size: 12px;
    background: #f9f9f9;
    word-break: break-all;
}
.question .item .entry-con-select .entry-con .con-box {
    border-bottom: 1px solid #eee;
}
.question .item .entry-con-select .entry-con:last-child .con-box {
    border-bottom: 0;
}
.question .item .entry-con-select .entry-con .con-box .entry-name {
    font-size: 12px;
    color: #999;
}

/* end 常见问题 */
</style>
