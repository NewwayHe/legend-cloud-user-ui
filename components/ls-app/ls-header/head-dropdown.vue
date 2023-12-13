<!-- 头部下拉列表 -->
<template>
	<view class="">
		<ls-header showHeadSelect>
			<view class="flex-1 text-center font-32" @click="changeShowList">
				<text class="mr-2 text-333">{{ title ? title + '-' : '' }}{{ list[currentIndex].name }}</text>
				<text
					class="iconfont icon-caret-bottom d-inline-block transition-all05"
					style="font-size: 20rpx;"
					:style="{ transform: `rotate(${!showList ? 0 : 180}deg)` }"
				></text>
			</view>
		</ls-header>

		<!-- start头部下拉列表 -->
		<!-- 这个是遮罩层 -->
		<view
			class="position-fixed top-0 bottom-0 left-0 right-0 h-100vh w-100vw"
			style="background: rgba(0,0,0,0.5);z-index: 108;"
			@click.stop="changeShowList"
			v-if="showList"
		></view>
		<view
			class="position-fixed w-100 font-24 transition-all05 bg-white overflow-h zindex-109 text-666 pl-4 pr-2 py-3"
			style="border-bottom-right-radius: 24rpx;border-bottom-left-radius: 24rpx;"
			:style="{ top: `calc(88rpx + ${stausBarHeight}px)`, transform: `translateY(${showList ? 0 : '-100%'})`, 'transform-origin': '0% 0%' }"
		>
			<view
				class="d-inline-block pr-2 pb-2"
				:style="{ width: span == 2 ? '50%' : span == 3 ? '33.33333333%' : span == 4 ? '25%' : span == 5 ? '20%' : 'w-100' }"
				v-for="(item, index) in list"
				:key="index"
				@click="changeList(index)"
			>
				<view class="rounded-100 bg-f5 flex-center w-100 h-60r" :class="{ 'text-main border border-main': state == item.value }">
					<text>{{ item.name }}</text>
				</view>
			</view>
		</view>
		<!-- end头部下拉列表 -->
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	name: 'HeadSelect',
	components: {},
	props: {
		list: Array,
		title: String, // 标题的前缀
		state: [String, Number], // 用来记录是否已选
		/**
		 * 背景色
		 */
		bgColor: {
			type: String,
			default: ''
		},
		/**
		 * 每行有多少个元素，只接收：1，2，3，4，5
		 */
		span: {
			type: [String, Number],
			default: 3
		}
	},
	data() {
		return {
			showList: false,
			currentIndex: 0 // 默认选中tab的下标
		};
	},
	computed: {
		...mapState(['stausBarHeight'])
	},
	mounted() {
		if(this.state) {	// 表头名称要与state进行同步
			this.currentIndex = this.list.findIndex(item => item.value == this.state);
		}
	},
	methods: {
		// 选择下拉列表
		changeList(index) {
			this.currentIndex = index;
			this.changeShowList();
			this.$emit('change', index);
		},
		// 显示下拉框
		changeShowList() {
			this.showList = !this.showList;
		}
	}
};
</script>
<style lang="scss" scoped></style>
