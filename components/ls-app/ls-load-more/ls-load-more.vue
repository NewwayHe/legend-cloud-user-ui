<template>
    <!-- 备注：如果是瀑布流，className要传入"row w-100" ，如： <ls-load-more :className="'row w-100 p-1'">，如果写成<ls-load-more class="row w-100 p-1">的话，小程序端会无效-->
    <view :class="[className]" id="content" refs="content">
        <slot></slot>
        <template v-if="!flag">
            <uni-load-more
                class="w-100"
                :status="status"
                :showIcon="showIcon"
                :iconType="iconType"
                :iconSize="iconSize"
                :color="color"
                :contentText="contentText"
            ></uni-load-more>
        </template>
    </view>
</template>

<script>
import uniLoadMore from '../../uni-app/uni-load-more/uni-load-more.vue'
export default {
    name: 'ls-load-more',
	// #ifdef MP-WEIXIN
	// 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性。这时在<组件name> 里加style和class是不会生效的
	options: { virtualHost: true },
	// #endif
    components: { uniLoadMore },
    props: {
		className:{
			type: [String, Array,Boolean],//这里加个Boolean，是因为如果传className=""，小程序端会报错
			default: ''
		},
        /**
         * LoadMore 加载更多
         * @description 用于列表中，做滚动加载使用，展示 loading 的各种状态
         * @tutorial https://ext.dcloud.net.cn/plugin?id=29
         * @property {String} status = [more|loading|noMore] loading 的状态
         * @value more loading前
         * @value loading loading中
         * @value noMore 没有更多了
         * @property {Number} iconSize 指定图标大小
         * @property {Boolean} iconSize = [true|false] 是否显示 loading 图标
         * @property {String} iconType = [snow|circle|auto] 指定图标样式
         * @value snow ios雪花加载样式
         * @value circle 安卓唤醒加载样式
         * @value auto 根据平台自动选择加载样式
         * @property {String} color 图标和文字颜色
         * @property {Object} contentText 各状态文字说明，值为：{contentdown: "上拉显示更多",contentrefresh: "正在加载...",contentnomore: "没有更多数据了"}
         * @event {Function} clickLoadMore 点击加载更多时触发
         */
        status: {
            // 上拉的状态：more:上拉加载更多；loading:正在加载；noMore:没有更多数据了
            type: String,
            default: 'more'
        },
        showIcon: {
            type: Boolean,
            default: true
        },
        iconType: {
            type: String,
            default: 'auto'
        },
        iconSize: {
            type: Number,
            default: 24
        },
        color: {
            type: String,
            default: '#777777'
        },
        contentText: {
            type: Object,
            default() {
                return {
                    contentdown: '上拉显示更多',
                    contentrefresh: '正在加载...',
                    contentnomore: '没有更多数据了'
                }
            }
        }
    },
    data() {
        return {
            flag: false, // 是否显示加载icon
            isScroll: false // 是否可以滚动
        }
    },
    computed: {},
    watch: {
        status: {
            handler(value) {
                this.getFlat()
            },
            immediate: true
        }
    },
    created() {},
    mounted() {},
    onReachBottom() {
        this.isScroll = true
    },
    methods: {
        getFlat() {
            let windowHeight = 0 // 可视区
            let offsetTop = 0 // 距离顶部
            let domHeight = 0
            this.flag = false
            uni.getSystemInfo({
                success: (res) => {
                    windowHeight = res.windowHeight
                    this.$nextTick(() => {
						// APP端要加setTimeout,不然获取不到元素
						// #ifdef APP-PLUS
						setTimeout(()=>{
						// #endif
						try{
							const query = uni.createSelectorQuery().in(this)
							query
								.select('#content')
								.boundingClientRect((data) => {
									offsetTop = data.top
									domHeight = data.height
									if ((domHeight + offsetTop - 20) < windowHeight) {
										this.flag = true
									}
								})
								.exec()
						}catch(fail){
							console.log('fail~~~',fail)
						}
						// #ifdef APP-PLUS
						},10)
						// #endif
                    })
                }
            })
        }
    }
}
</script>

<style lang="stylus" scoped></style>

<!-- 用法：
    HTML：
        注意：ls-load-more里可以用v-if="paging.emptylist" 或 v-if="list && list.length"来判断
        <ls-load-more :status="paging.status" v-if="!paging.emptylist">
            <block v-for="(item, index) in list" :key="index">
                <text class="time">{{ item.addTime | dateformat('YYYY-MM-DD HH:mm:ss') }}</text>
            </block>
        </ls-load-more>
        <view class="font-28 h-100r flex-center text-666" v-if="paging.error" @click="changeTab">请求失败，点击重新加载</view>
        <ls-empty :paging="paging" :title="'暂无搜索结果'"  @reLoad="getData" reLoad/>
        
    JS：
        data() {
            return {
                params: {
                    state: 'all'
                },
                list: [] ,// 列表数据
                paging: {
                    status: 'loading',
                    error: false, // 是否错误
                    emptylist: false,// 是否显示列表为空时的样式
                },
            };
        },
-->
