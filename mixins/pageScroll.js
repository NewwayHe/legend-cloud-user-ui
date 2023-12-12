module.exports = {
	// 用来统一处理要用到onPageScroll值的页面
	// 用法:import pageScroll from '@/mixins/pageScroll.js'
	// 		mixins: [pageScroll],
	data() {
		return {
			scrollTop: 0,
			scrollTopTemp:0,//scrollTop的缓冲数据。小程序端直接改的值的话，视图层会频繁的向逻辑层发送数据，造成卡顿，所以要用一个中间值来接收
		};
	},
    onLoad() {},
    created() {},
    computed: {},
	watch:{
		scrollTopTemp: {
			handler(val) {
				this.$nextTick(()=> {
					// uni.$u.debounce(() => {
						this.scrollTop = val;
					// },10)
				});
			}
		},
	},
	// 页面滚动执行方式
	onPageScroll(e) {
	    // console.log(e.scrollTop);
	    this.scrollTopTemp = e.scrollTop*1;
	},
    methods: {
		
	},
}
