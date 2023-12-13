<template>
	<text
		v-if="show && ((Number(value) === 0 ? showZero : true) || isDot)"
		:class="[isDot ? 'u-badge--dot' : 'u-badge--not-dot', inverted && 'u-badge--inverted', shape === 'horn' && 'u-badge--horn', `u-badge--${type}${inverted ? '--inverted' : ''}`]"
		:style="[$stringUtils.addStyle(customStyle), badgeStyle]"
		class="u-badge"
	>{{ isDot ? '' :showValue }}</text>
</template>

<script>
	import mixin from '../../uview-ui/libs/mixin/mixin.js'
	/**
	 * badge 徽标数
	 * @description 该组件一般用于图标右上角显示未读的消息数量，提示用户点击，有圆点和圆包含文字两种形式。
	 * @tutorial https://uviewui.com/components/badge.html
	 * 
	 * @property {Boolean} 			isDot 		是否显示圆点 （默认 false ）
	 * @property {String | Number} 	value 		显示的内容
	 * @property {Boolean} 			show 		是否显示 （默认 true ）
	 * @property {String | Number} 	max 		最大值，超过最大值会显示 '{max}+'  （默认999）
	 * @property {String} 			type 		主题类型，error|warning|success|primary （默认 'error' ）
	 * @property {Boolean} 			showZero	当数值为 0 时，是否展示 Badge （默认 false ）
	 * @property {String} 			bgColor 	背景颜色，优先级比type高，如设置，type参数会失效
	 * @property {String} 			color 		字体颜色 （默认 '#ffffff' ）
	 * @property {String} 			shape 		徽标形状，circle-四角均为圆角，horn-左下角为直角 （默认 'circle' ）
	 * @property {String} 			numberType	设置数字的显示方式，overflow|ellipsis|limit  （默认 'overflow' ）
	 * @property {Array}} 			offset		设置badge的位置偏移，格式为 [x, y]，也即设置的为top和right的值，absolute为true时有效
	 * @property {Boolean} 			inverted	是否反转背景和字体颜色（默认 false ）
	 * @property {Boolean} 			absolute	是否绝对定位（默认 false ）
	 * @property {Object}			customStyle	定义需要用到的外部样式
	 * @example <u-badge :type="type" :count="count"></u-badge>
	 */
	export default {
		name: 'UBadge',
		mixins: [mixin],
		// #ifdef MP-WEIXIN
		// 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性。这时在<组件name> 里加style和class是不会生效的
		options: { virtualHost: true },
		// #endif
		props: {
			// 每个组件都有的父组件传递的样式，可以为字符串或者对象形式
			customStyle: {
			    type: [Object, String],
			    default: () => ({})
			},
		    // 是否显示圆点
		    isDot: {
		        type: Boolean,
		        default: false
		    },
		    // 显示的内容
		    value: {
		        type: [Number, String],
		        default: ''
		    },
		    // 是否显示
		    show: {
		        type: Boolean,
		        default: true
		    },
		    // 最大值，超过最大值会显示 '{max}+'
		    max: {
		        type: [Number, String],
		        default: 999
		    },
		    // 主题类型，error|warning|success|primary
		    type: {
		        type: String,
		        default: 'error'
		    },
		    // 当数值为 0 时，是否展示 Badge
		    showZero: {
		        type: Boolean,
		        default: false
		    },
		    // 背景颜色，优先级比type高，如设置，type参数会失效
		    bgColor: {
		        type: [String, null],
		        default: null
		    },
		    // 字体颜色
		    color: {
		        type: [String, null],
		        default: null
		    },
		    // 徽标形状，circle-四角均为圆角，horn-左下角为直角
		    shape: {
		        type: String,
		        default: 'circle'
		    },
		    // 设置数字的显示方式，overflow|ellipsis|limit
		    // overflow会根据max字段判断，超出显示`${max}+`
		    // ellipsis会根据max判断，超出显示`${max}...`
		    // limit会依据1000作为判断条件，超出1000，显示`${value/1000}K`，比如2.2k、3.34w，最多保留2位小数
		    numberType: {
		        type: String,
		        default: 'overflow'
		    },
		    // 设置badge的位置偏移，格式为 [x, y]，也即设置的为top和right的值，absolute为true时有效
		    offset: {
		        type: Array,
		        default: () => []
		    },
		    // 是否反转背景和字体颜色
		    inverted: {
		        type: Boolean,
		        default: false
		    },
		    // 是否绝对定位
		    absolute: {
		        type: Boolean,
		        default: false
		    }
		},
		computed: {
			// 是否将badge中心与父组件右上角重合
			boxStyle() {
				const style = {};
				return style;
			},
			// 整个组件的样式
			badgeStyle() {
				const style = {}
				if(this.color) {
					style.color = this.color
				}
				if (this.bgColor && !this.inverted) {
					style.backgroundColor = this.bgColor
				}
				if (this.absolute) {
					style.position = 'absolute'
					// 如果有设置offset参数
					if(this.offset.length) {
						// top和right分为为offset的第一个和第二个值，如果没有第二个值，则right等于top
						const top = this.offset[0]
						const right = this.offset[1] || top
						style.top = uni.$u.addUnit(top,'px')
						style.right = uni.$u.addUnit(right,'px')
					}
				}
				return style
			},
			showValue() {
				switch (this.numberType) {
					case 'overflow':
						return Number(this.value) > Number(this.max) ? this.max + '+' : this.value
						break;
					case 'ellipsis':
						return Number(this.value) > Number(this.max) ? '...' : this.value
						break;
					case 'limit':
						return Number(this.value) > 999 ? Number(this.value) >= 9999
							? Math.floor(this.value / 1e4 * 100) / 100 + 'w' : Math.floor(this.value /
								1e3 * 100) / 100 + 'k' : this.value
						break;
					default:
						return Number(this.value)
				}
			},
		},
		
		created() {
		    // 组件当中，只有created声明周期，为了能在组件使用，故也在created中将方法挂载到$u
		    this.$u.getRect = this.$uGetRect
		},
	}
</script>

<style lang="scss" scoped>
	// 通过scss的mixin功能，把原来需要写4行的css，变成一行
	// 目的是保持代码干净整洁，不至于在nvue下，到处都要写display:flex的条件编译
	@mixin flex($direction: row) {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: $direction;
	}
	
	/* #ifndef APP-NVUE */
	// 由于uView是基于nvue环境进行开发的，此环境中普通元素默认为flex-direction: column;
	// 所以在非nvue中，需要对元素进行重置为flex-direction: column; 否则可能会表现异常
	view, scroll-view, swiper-item {
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		flex-grow: 0;
		flex-basis: auto;
		align-items: stretch;
		align-content: flex-start;
	}
	/* #endif */

	$u-badge-primary: #3c9cff !default;
	$u-badge-error: #f56c6c !default;
	$u-badge-success: #5ac725 !default;
	$u-badge-info: #909399 !default;
	$u-badge-warning: #f9ae3d !default;
	$u-badge-dot-radius: 100px !default;
	$u-badge-dot-size: 8px !default;
	$u-badge-dot-right: 4px !default;
	$u-badge-dot-top: 0 !default;
	$u-badge-text-font-size: 11px !default;
	$u-badge-text-right: 10px !default;
	$u-badge-text-padding: 2px 5px !default;
	$u-badge-text-align: center !default;
	$u-badge-text-color: #FFFFFF !default;

	.u-badge {
		border-top-right-radius: $u-badge-dot-radius;
		border-top-left-radius: $u-badge-dot-radius;
		border-bottom-left-radius: $u-badge-dot-radius;
		border-bottom-right-radius: $u-badge-dot-radius;
		@include flex;
		line-height: $u-badge-text-font-size;
		text-align: $u-badge-text-align;
		font-size: $u-badge-text-font-size;
		color: $u-badge-text-color;

		&--dot {
			height: $u-badge-dot-size;
			width: $u-badge-dot-size;
		}
		
		&--inverted {
			font-size: 13px;
		}
		
		&--not-dot {
			padding: $u-badge-text-padding;
		}

		&--horn {
			border-bottom-left-radius: 0;
		}

		&--primary {
			background-color: $u-badge-primary;
		}
		
		&--primary--inverted {
			color: $u-badge-primary;
		}

		&--error {
			background-color: $u-badge-error;
		}
		
		&--error--inverted {
			color: $u-badge-error;
		}

		&--success {
			background-color: $u-badge-success;
		}
		
		&--success--inverted {
			color: $u-badge-success;
		}

		&--info {
			background-color: $u-badge-info;
		}
		
		&--info--inverted {
			color: $u-badge-info;
		}

		&--warning {
			background-color: $u-badge-warning;
		}
		
		&--warning--inverted {
			color: $u-badge-warning;
		}
	}
</style>
