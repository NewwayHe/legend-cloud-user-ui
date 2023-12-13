// handle 方法的处理成功码
const handleSuccessCode = {
	SUCCESS: '00', // 代表分页数据经过了处理并且成功了
	EMPTY_LIST: '01', // 空列表，根本没有处理
	OTHER: '99' // 其他错误
}

/**
 * 分页工具，用于处理分页列表。
 * 目的为了增强代码复用性，减少重复、冗余代码。
 * 后续这个工具可能还会增强为通用的接口工具类， 不单是为了列表查询接口服务。
 */

class pageUtil {
	_api = null

	_config = {
		// 字段名
		field: {
			resData:'resData',// res.data的字段名
			list: 'list', // 列表数组的字段名
			paging: 'paging', // 分页的字段名
			currPage: 'curPage',
			pageSize: 'pageSize'
		},
		notReset:false,// 应用场景：当有tab栏并且该tab栏不是fiexd在顶部而是在屏幕中间时，该值为false的话会先将list清空再请求数据，此时会出现页面先清空数据闪一下，再显示数据，并且滚动条会有变化，这样体验不好
				// 当该值为true时，请求参数前,不会把list清空,并且在第一次加载时是用了深拷贝
				// 1、删掉了 初始化列表数组vueThat[listKey] = [];
				// 2、vueThat[listKey] = res.data.resultList 改为：vueThat[listKey] = uni.$u.deepClone(res.data.resultList);并且在数据请求成功后赋值请、没数据时、接口错误时 加入：vueThat[listKey] = [];
	}

	// 用于记录调用loadListByPage的参数，然后在loadListByPageMore时使用
	_paging = {
		vueThat: null,
		params: null, // 用来记住初次发起的请求参数, loadMore复用同样的参数查询下一页的数据
		options: null // 用来记录初次发起请求的options，loadMore复用同样的参数查询下一页的数据
	}

	constructor(api, config = {}) {
		// console.log(this._config);

		config = uni.$u.deepMerge(this._config, config)

		// console.log(config)

		this._api = api
		this._config = config
	}

	// handle 方法的处理成功码
	handleSuccessCode = handleSuccessCode

	/**
	 * 加载列表，并进行分页处理（加载更多请调用 loadListByPageMore）
	 * 此方法在页面进来时， 切换tab时， 切换查询条件时调用， 然后加载更多就调用 loadListByPageMore
	 * @param {*} vueThat vue的this 对象
	 * @param {*} params 调用接口所需的参数（选填，一般情况下传业务参数即可，比如页码和每页数量这些可以不传）
	 * @param {*} options 一些选项配置（选填），如下
	 * {
			before: function(), // 调用接口前触发的 function
			listHandler: function(resultList), // 列表处理器，对接口返回的列表进行处理
			success: function(code, res), // 分页数据处理成功后触发的 function
			error: function(e), // 调用接口失败后触发的 function
			complete: function() // 调用接口完成后触发的 function，无论接口调用成功失败都会调用
		}
	*/
	loadListByPage(vueThat, params = {}, options = {}) {
		// 创建新的对象， 避免对象引用问题(这个不能删，删了会导致父组件的currPage不重置，例如：触发下拉加载让currPage=3时，再次触发loadListByPage方法时，这时传的是currPage=3而不是1)
		params = { ...params }
		options = { ...options }
		// console.log(params)
		// console.log(vueThat)
		// 默认选项
		const defaultOptions = {
			before: null,
			success: null,
			error: null,
			complete: null,
			listHandler: null
		}

		options = uni.$u.deepMerge(defaultOptions, options)

		// 执行前调用，如果调用者有传的话
		if (options.before) {
			options.before() // 空参数调用
		}

		console.debug('vueThat: %o, params: %o, options: %o', params, vueThat, options)

		const that = this

		// 获取vue页面data绑定的数据的字段名
		const resDataKey = that._config.field.resData
		const listKey = that._config.field.list
		const pagingKey = that._config.field.paging

		// 获取分页查询参数的参数名
		const currPageKey = that._config.field.currPage
		const pageSizeKey = that._config.field.pageSize

		// 初始化分页数据
		if (!vueThat[pagingKey]) {
			// 如果连paging都没定义
			vueThat[pagingKey] = {}
		}

		vueThat[pagingKey].currPage = 1
		vueThat[pagingKey].pageSize = 10
		vueThat[pagingKey].pageCount = 0
		vueThat[pagingKey].total = 0
		vueThat[pagingKey].status = 'loading'
		// 以下两句为新增-解决当有一个列表接口为error时，切换tab后空列表和数据同时存在的bug(2021-1-23)
		vueThat[pagingKey].error = false
		vueThat[pagingKey].emptylist = false

		// 初始化列表数组
		if(!that._config.notReset){
			vueThat[resDataKey] = {}
			vueThat[listKey] = []
		}

		// 处理请求参数 如果调用者没传
		if (!params[currPageKey]) {
			params[currPageKey] = vueThat[pagingKey].currPage
		} else {
			vueThat[pagingKey].currPage = params[currPageKey]
		}

		if (!params[pageSizeKey]) {
			params[pageSizeKey] = vueThat[pagingKey].pageSize
		} else {
			vueThat[pagingKey].pageSize = params[pageSizeKey]
		}

		// if (vueThat[pagingKey].status = 'loading') {//如果五秒后刷新不出数据，就显示上拉加载更多
		//     setTimeout(function() {vueThat[pagingKey].status = 'more'}, 5000);
		// }

		// 初始化
		that._paging.vueThat = vueThat
		that._paging.params = params
		that._paging.options = options

		// 处理分页数据
		_method.handlePage(this, vueThat, params, options)
	}

	/**
	 * 在 loadListByPage 基础上加载下一页的列表数据
	 */
	loadListByPageMore(options = {}) {
		const pagingKey = this._config.field.paging
		// 异步加载
		setTimeout(() => {
			const pagingKey = this._config.field.paging
			const paging = this._paging
			const vueThat = paging.vueThat

			options = uni.$u.deepMerge(paging.options, options)

			// 执行前调用，如果调用者有传的话
			if (options.before) {
				options.before() // 空参数调用
			}

			// total小于等于0说明是失败时的重试操作，调用刷新方法即可
			if (vueThat[pagingKey].total <= 0) {
				this.loadListByPageRefresh()
				return
			}

			// 如果有超过要使他恢复最大
			if (vueThat[pagingKey].currPage > vueThat[pagingKey].pageCount) {
				vueThat[pagingKey].currPage = vueThat[pagingKey].pageCount
			}
			const currTotal = vueThat[pagingKey].currPage * vueThat[pagingKey].pageSize

			// console.log(currTotal)

			if (currTotal >= vueThat[pagingKey].total) {
				// 代表没有更多
				vueThat[pagingKey].status = 'noMore'
				return
			}

			// 找到原来的参数的页面参数，进行加1， 查询下一页数据

			const currPageKey = this._config.field.currPage
			const params = paging.params
			params[currPageKey] = vueThat[pagingKey].currPage + 1 // 页码参数+1

			_method.handlePage(this, vueThat, params, options)
		}, 500)
	}

	/**
	 * 刷新当前数据,此方法只能在本页面上用,外部页面会有bug(当load到第3页,然后返回第1页修改数据后触发此方法时,其实页面并不会更改)
	 */
	loadListByPageRefresh() {
		const paging = this._paging
		const vueThat = paging.vueThat
		const params = paging.params
		const options = paging.options
		_method.handlePage(this, vueThat, params, options)
	}
}

// 一些私有，仅供内部调用的方法
const _method = {
	/**
	 * 处理分页数据
	 * @param {*} vueThat vue的this对象， 用于改变调用此方法的页面数据
	 * @param {*} params 请求参数
	 * @param {*} options 一些选项配置，参见 loadListByPage 方法的options参数描述
	 */

	handlePage(pageUtil, vueThat, params, options) {
		const pagingKey = pageUtil._config.field.paging
		const resDataKey = pageUtil._config.field.resData
		const listKey = pageUtil._config.field.list
		vueThat[pagingKey].status = 'loading'
		pageUtil._api(params).then((res) => {
			console.debug('接口调用结果：%o', res)
			let code = handleSuccessCode.SUCCESS
			if (res.code == 1) {
				if (res.data) {
					// 如果不判断有没有res.data，直接用下面赋值的话，当接口的res.status=1且res.data=null时，由于没有res.data.currPage而报错，由于报错，往下的代码就不会走
					vueThat[resDataKey] = res.data
					vueThat[pagingKey].currPage = res.data.curPageNO
					vueThat[pagingKey].pageSize = res.data.pageSize
					vueThat[pagingKey].pageCount = res.data.pageCount
					vueThat[pagingKey].total = res.data.total
				} else {
					code = handleSuccessCode.EMPTY_LIST
				}
				if (res.data && res.data.resultList && res.data.resultList.length) {
					if (options.listHandler) {
						res.data.resultList = options.listHandler(res.data.resultList)
					}
					// 如果是关闭了【初始化列表数组】功能
					if(pageUtil._config.notReset){
						if (res.data.curPageNO == 1) {
							// 当页码是第一页时，直接赋值
							vueThat[listKey] = []
							vueThat[listKey] = uni.$u.deepClone(res.data.resultList)
						} else {
							// 否则追加
							vueThat[listKey].push(...res.data.resultList)
						}
					// 如果正常模式
					}else{
						vueThat[listKey] = vueThat[listKey].concat(res.data.resultList)
					}
				} else {
					code = handleSuccessCode.EMPTY_LIST
					// 如果是关闭了【初始化列表数组】功能
					if(pageUtil._config.notReset){
						vueThat[listKey] = []
					}
				}
			} else {
				// vueThat[pagingKey].error = true//有时候接口无错能正常访问，但resultList为空时，后台接口的code会返回为0而导致让error变为true，所以这里先屏蔽
				// 弹出消息提示是否合理？还是让调用者自己处理这种情况？
				// uni.showToast({title:res.msg,icon:'none'})
				code = handleSuccessCode.OTHER
				// 如果是关闭了【初始化列表数组】功能
				if(pageUtil._config.notReset){
					vueThat[listKey] = []
				}
			}
			if (options.success) {
				options.success(code, res)
			}
		}).catch((e) => {
			console.debug('接口调用异常：%o', e)
			// console.log("接口调用异常：%o", e);
			vueThat[pagingKey].error = true
			if (options.error) {
				options.error(e)
			}
		}).finally((res) => {
			// 这个if判断以前是写在listHandler()下面的，现在改在这里(2021-4-27)
			if (!vueThat[listKey] || !vueThat[listKey].length) {
				vueThat[pagingKey].emptylist = true
				vueThat[pagingKey].status = 'noMore'
			} else {
				vueThat[pagingKey].emptylist = false
			}
			if (vueThat[pagingKey].currPage == vueThat[pagingKey].pageCount) {
				// 如果已经加载完数据，则显示“没有更多数据了”
				vueThat[pagingKey].status = 'noMore'
			} else if (vueThat[pagingKey].pageCount > vueThat[pagingKey].currPage) {
				// 如果还有数据，则显示“上拉加载更多”
				vueThat[pagingKey].status = 'more'
			} else {
				if (vueThat[pagingKey].status == 'loading') {
					// 如果五秒后刷新不出数据，就显示没有更多
					setTimeout(function() {
						vueThat[pagingKey].status = 'noMore'
					}, 5000)
				}
			}
			if (options.complete) {
				options.complete(res)
			}
		})
	}
}

export default pageUtil

// /                   _ooOoo_
// /                  o8888888o
// /                  88" . "88
// /                  (| -_- |)
// /                  O\  =  /O
// /               ____/`---'\____
// /             .'  \\|     |//  `.
// /            /  \\|||  :  |||//  \
// /           /  _||||| -:- |||||-  \
// /           |   | \\\  -  /// |   |
// /           | \_|  ''\---/''  |   |
// /           \  .-\__  `-`  ___/-. /
// /         ___`. .'  /--.--\  `. . __
// /      ."" '<  `.___\_<|>_/___.'  >'"".
// /     | | :  `- \`.;`\ _ /`;.`/ - ` : | |
// /     \  \ `-.   \_ __\ /__ _/   .-` /  /
// /======`-.____`-.___\_____/___.-`____.-'======
// /                   `=---='
// /^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// /
// /         佛祖保佑       永无BUG
// /
// /  本模块已经经过开光处理，绝无可能再产生bug
// /
// /=============================================

/* 
    统一写法(传的参数统一名字为：params，列表数据统一名字为：list，paging统一为paging，new的构造器统一名字为：listPage):
        HTML：
            注意：ls-load-more里可以用v-if="paging.emptylist" 或 v-if="list && list.length"来判断
            <ls-load-more :status="paging.status" v-if="!paging.emptylist">
                <block v-for="(item, index) in list" :key="index">
                    <text class="time">{{ item.addTime | dateformat('YYYY-MM-DD HH:mm:ss') }}</text>
                </block>
            </ls-load-more>
            <view class="font-28 h-100r flex-center text-666" v-if="paging.error" @click="changeTab">请求失败，点击重新加载</view>
            <ls-empty :title="'您没有相关信息'" v-if="paging.emptylist && !paging.error" />
            
        JS：
            import pageUtil from '@/utils/pageUtils.js';
            import { withdrawalsList } from '@/api/preDeposit.js';
            一般写法：
            const listPage = new pageUtil(withdrawalsList);
            改变变量名字的写法：
            const listPage = new pageUtil(withdrawalsList,{field: {
                list: "collectList",
                paging: "collectPaging",
                currPage: "curPageNO",
                pageSize: "pageSize"
            }});
            
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
            onLoad(option) {
                
                简单用法：
                listPage.loadListByPage(this, this.params);
                
                要对list结果处理的用法(注意：listHandler后要return resultList，不然父组件得到的list为空的)
                listPage.loadListByPage(this,{},{
                    listHandler:(res)=>{
                        res.forEach(element => {
                            element['commisTypeText'] = '';
                            switch (element.commisType) {
                                case 'FIRST_COMMIS':
                                    element.commisTypeText = '直接下级奖励';
                                    break;
                                default:
                                    element.commisTypeText = '获取数据失败';
                            }
                        });
                        return res
                    }
                });
                
            },
            //下拉加载
            onReachBottom() {
                listPage.loadListByPageMore();
            },
            
        
        
        
        
        (以下是旧版本说明，与有赞插件一起用的，现在这个项目是用ls-load-more这个插件，所以finished和loading这些参数都会有变化,而且此版本已经不须要传paging.tab=true也能处理tab切换时的问题)
        PageUtil使用说明
        
        前言：PageUtil是基于vant-ui的list组件封装的一个分页工具，用于处理分页列表接口。目的为了增强代码复用性，减少重复、冗余代码。
             后续这个工具可能还会增强为通用的接口工具类， 不单是为了列表查询接口服务， 也不依赖vant-ui。
        
        一.代码存放位置
        
        工程目录下的utils目录下有个PageUtil.js
        
        二.用法说明
        
        html结构
        
        <van-list
            v-if="paging.tab"
            v-model="paging.loading"
            :finished="paging.finished"
            :finished-text="!paging.emptylist?'没有更多了':''"
            @load="onLoad"
            :immediate-check="false"
            :error.sync="paging.error"
            error-text="请求失败，点击重新加载"
        >
          注： v-if="paging.tab" 仅有tab切换的列表页面， 才需要定义这个， 非tab页应该写为v-if="paging.emptylist"， 因为当paging.emptylist = true时， 也不应该显示<van-list>
        
        如果要写空列表样式的话请使用： v-if="paging.emptylist && !paging.error" 来判断， 其中!paging.erro代表有错误时不显示空列表样式， 因为当请求发生错误是， 也有可能paging.emptylist=true，但显示的样式应该要为加载错误的信息
        <ls-empty :src="require('../../../static/images/collect-empty.png')" title="您还没有收藏过商品" v-if="paging.emptylist && !paging.error" />
        
        引入依赖
        
        import { List } from 'vant'; // 引入vant-ui的列表组件
        import PageUtil from 'utils/PageUtil'; // 引入分页工具
        import { favoriteProductPage} from '@/api/collection'; // 引入API
        
        实例化PageUtil对象
        
        const pageUtil = new PageUtil(favoriteProductPage);
        
        在vue实例的data里增加以下字段：
        
        data() {
            return {
                // 用于结合vant-ui绑定的数据
            	paging: {
                        tab: false, // 如果是有tab切换的列表页面， 需要定义这个
                        loading: false,
                        finished: false,
                        error: false, // 是否错误
                        emptylist: false,//是否显示列表为空时的样式
            	},
            	list: [] // 列表数据
            }
        }
        
        
        在vue实例的mounted调用loadListByPage方法
        
        mounted() {
             // 第一个参数是vue的this对象, 第二个参数是调用接口的参数（只传业务参数即可，如curPageNO、pageSize可不传）
        	pageUtil.loadListByPage(this);
        },
        
        在vue实例的methods下增加一下方法：
        
        methods: {
        	//用于结合vantUI下拉加载
        	onLoad() {
               // 调用pageUtil的加载更多方法
               pageUtil.loadListByPageMore();
        	}
        }
        
        完整代码可以参考Saas vue项目的collection.vue页面或recCenter.vue
        
        三.API说明
        
        构造 PageUtil 
        
        PageUtil工具是采用class关键字封装的一个js工具.使用前需要使用new 关键字 构造PageUtil对象。构造函数接收两个参数。
        
        constructor(api, config);
        
        api : 必填，调用接口的function对象
        config： 选填，可配置的选项，具体如下：
            {	
                // 配置data的字段名和api请求参数的参数名
                field: {
                	 list: "list", // 配置vue data列表数组的字段名， 不传时默认是”list“
                        paging: "paging", // 配置vue data分页相关数据的字段名， 不传时默认是”paging“
                        currPage: "curPageNO", // 配置请求参数的当前页码参数名， 不传时默认是”curPageNO“
                        pageSize: "pageSize" // 配置请求参数的每页数量参数名， 不传时默认是”pageSize“
            	}
            }
        
        示例：
        
        import { favoriteProductPage} from '@/api/collection'; // 引入API
        
        const pageUtil = new PageUtil(favoriteProductPage, {field: {
            list: "collectList",
            paging: "collectPaging",
            currPage: "curPageNO",
            pageSize: "pageSize"
        }});
        
        注：一般没有特殊的需求情况下都可以不传config，PageUtil会自动采用默认值实现。
        
        PageUtil 的常量
        
        handleSuccessCode
        
        描述： 分页处理成功的公共码，在success回调中以第一个参数传入。有如下成功码：
        
        SUCCESS: "00", // 代表分页数据经过了处理并且成功了
        EMPTY_LIST: "01", // 空列表，根本没有处理
        OTHER: "99" //其他错误
        
        示例：
        
        import PageUtil from 'utils/PageUtil'; // 引入分页工具
        const pageUtil = new PageUtil(favoriteProductPage);
        pageUtil.loadListByPage(this, {}, {
        	success(code){
                console.log("调用分页处理成功");
                if(PageUtil.handleSuccessCode.SUCCESS == code){
                    // todo somthing
                }
        	}
        });
        
        PageUtil 的方法
        
        loadListByPage(vueThat, params, options)
        
        方法描述：加载列表，并进行分页处理（加载更多请调用 loadListByPageMore）
        
        参数描述：
        
        vueThat: vue的this 对象
        
        params: 调用接口所需的参数（选填，一般情况下传业务参数即可，比如页码和每页数量这些可以不传）
        
        options: 选填，一些选项配置，供特殊页面的扩展使用。具体配置项如下：
        
        {
        	before: function(), // 调用接口前触发的 function，默认为null
        	success: function(code, res), // 分页数据处理成功后触发的 function，默认为null
        	error: function(error), // 调用接口失败后触发的 function，默认为null
        	complete: function(), // 调用接口完成后触发的 function，无论接口调用成功失败都会调用，默认为null
         	listHandler: function(res) //列表处理器，对接口返回的列表进行处理
        }
        
        示例：
        
        pageUtil.loadListByPage(this, {}, {
            before:()=>{
                console.log("调用分页处理之前");
            },
            success:(code, res)=>{
                console.log("调用分页处理成功");
            },
            error:(e)=>{
                console.log("调用分页处理成功");
            },
            complete:()=>{
                console.log("调用分页处理完成（无论成功或失败）");
            },
            listHandler:(res)=>{
               // 对 resultList 进行处理
               return res;
            }
        });
        
        注意： 如果要传options 参数， 并且接口请求参数为空的情况，那么依旧要loadListByPage(this, {}, {...});
        
        loadListByPageMore()
        
        方法描述： 在 loadListByPage 基础上加载下一页的列表数据
        
        参数描述： 无参数
        
        loadListByPageRefresh()
        
        方法描述：刷新当前列表，一般用于修改列表数据成功后刷新列表，或者请求列表失败后的重试操作等。
        
        参数描述：无
        
        四.其他说明
        
        vue页面data定义说明
        
        最完整的data应该定义如下：
        
        // 用于分页处理的相关数据
        paging: {
                tab: false, // 如果是有tab切换的列表页面， 需要定义这个
             currPage: 1 // 可不定义， 不传时默认为1
             pageSize: 10,  // 可不定义， 不传时默认为10
             pageCount: 0, // 可不定义， 默认为0
             total: 0, // 可不定义， 默认为0
             loading: false, // 必须定义，并且初始值是false， 因为van-ui需要， 否则会有问题
             finished: true, // 必须定义，并且初始值是false， 因为van-ui需要， 否则会有问题
             error: false, // 是否错误
             emptylist: false // 是否显示列表为空时的样式
        },
        
        // 必须定义，列表数据
        list: []
        
        温馨提示：是否需要在data上定义，取决于这些数据是否要在页面绑定
        
        
        
        
     
   */
