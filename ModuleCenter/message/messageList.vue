<template>
	<view class="w750 font-24" :style="{ '--themescolor': themes.color }">
		<!-- /头部 -->
		<ls-header showHeadSelect>
			<view class="flex-center flex-1 text-333 font-28 position-relative h-100">
				<view class="flex-1 flex-center"><text>{{msgName}}</text></view>
				<view class="font-24 position-absolute right-0 bg-main rounded-8 text-white py px-1 scale-08" @click="cleanUnread" v-if="msgName == '系统通知'">
					清除</br>未读
				</view>
			</view>
		</ls-header>
		<view v-if="current == 0 || current == 1">
			<ls-load-more className="px-2" :status="paging.status" v-if="!paging.emptylist">
				<view class="mt-3" v-for="(item,index) in list" :key="index" @click="gotoinfodetaile(item)">
					<view class="flex-center">
						<view class="flex-center bg-ddd rounded-100 text-white px-2 py-1 line-h-md">
							<text class="">{{(new Date(((item.recDate ? item.recDate : item.createTime).replace(/\-/g, '/'))).getTime()) | dateformat('YYYY年MM月DD日') }}</text>
						</view>
					</view>
					<view class="bg-white mt-2 rounded-24 px-2 py-3 flex-col-start overflow-h" style="max-height: 270rpx;">
						<view class="font-32 font-weight-600 pb-2">
							<view v-if="item.status==='0'|| (item.status===1&&item.receiverStatus===0)" class="d-inline-block w-20r h-20r bg-danger rounded-circle mr-1" />
							{{ item.title }}
						</view>
						<view class="flex-1 overflow-h text-999 w-100">
							<u-parse class="font-24 word-breakall" :html="item.content"></u-parse>
						</view>
					</view>

				</view>
			</ls-load-more>
			<ls-empty className="center-xy" :type="3" :title="'暂时还没有信息呢！'" :paging="paging" @reLoad="getData" reLoad />
		</view>
	</view>
</template>

<script>
	import pageUtil from '@/utils/pageUtils.js'
	import { infoLise } from '@/api/ModulesCommon.js'

	import { mapState } from 'vuex'

	const listPage = new pageUtil(infoLise.getshopInfoList) // 我的公告
	const listPage1 = new pageUtil(infoLise.getsystemInfoList) // 系统公告

	export default {
		name: '',
		components: {},
		data() {
			return {
				current: 0, // 默认选中tab的下标
				// navArr: [{
				// 		id: 1,
				// 		name: '系统通知',
				// 		status: '0'
				// 	},
				// 	{
				// 		id: 2,
				// 		name: '我的公告',
				// 		status: '1'
				// 	},
				// 	{
				// 		id: 3,
				// 		name: '文章评论',
				// 		status: '2'
				// 	},
				// 	{
				// 		id: 4,
				// 		name: '点赞收藏',
				// 		status: '3'
				// 	}
				// ],
				paging: {
					status: 'loading',
					error: false, // 是否错误
					emptylist: false // 是否显示列表为空时的样式
				},
				list: [],
				msgName:'我的信息'
			}
		},
		computed: {
			...mapState(['timeDiff', 'stausBarHeight', 'wxMenuBut','userInfo'])
		},
		watch: {},
		onLoad(option) {
			this.current = option.index
		},
		onShow() {
			this.getData()
		},
		mounted() {},
		// 下拉加载
		onReachBottom() {
			if (this.current == 0) {
				listPage1.loadListByPageMore()
			}
			if (this.current == 1) {
				listPage.loadListByPageMore()
			}
		},
		methods: {
			// 切换tabs
			// changeTab(item) {
			// 	this.list = {}
			// 	this.current = item.index
			// 	this.getData()
			// 	// listPage.loadListByPage(this, this.params, {
			// 	//   complete:()=> {
			// 	//     this.$forceUpdate();
			// 	//   },
			// 	// });
			// },
			// 请求数据
			getData() {
				const index = this.current
				console.log(index)
				if (index == 0) {
					this.msgName = '系统通知'
					listPage1.loadListByPage(this)
				}
				if (index == 1) {
					this.msgName = '我的公告'
					listPage.loadListByPage(this)
				}
			},
			// 去公告详情
			gotoinfodetaile(item) {
				console.log(item)
				if (this.current == 0) {
					uni.navigateTo({
						url: `/ModuleCenter/message/messageDetail?msgId=${item.id}`
					})
				}
				if (this.current == 1) {
					uni.navigateTo({
						url: `/ModuleCenter/message/messageDetail?pubId=${item.id}`
					})
				}
			},
			
			cleanUnread(){
				uni.showModal({ title:'提示', content: '是否清除所有未读消息?',success: (res) => {
					if (res.confirm) {
						infoLise.cleanUnread()
							.then(res => {
								if (res.code) {
									this.getData()
									uni.showToast({ title: '操作成功!' });
									this.$nextTick(() => { // 刷新未读消息数
										uni.$store.commit('setMyInfo', {}) // 清空VUX里的用户信息
									})
								}
							})
					}
				} });
			}

		}
	}
</script>

<style>
	page {
		background-color: var(--backgroundcolor);
	}
</style>
<style lang="scss" scoped>
	::v-deep .richText{
		// div{
		// 	display: inline-block; width: 100%; white-space: nowrap;text-overflow:ellipsis; overflow: hidden;
		// }
		// 富文本中的图片不能超容器大小
		img {
			max-width: 100%!important;
		}
	}
</style>
