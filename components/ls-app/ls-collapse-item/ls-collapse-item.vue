<template>
	<view :class="['ls-collapse-cell', { 'ls-collapse-cell--disabled': disabled, 'ls-collapse-cell--open': isOpen }]" :style="{'--openBgColor':openBgColor}" :hover-class="disabled ? '' : 'ls-collapse-cell--hover'">
		<view class="ls-collapse-cell__title header" @click="onClick">
			<view v-if="thumb" class="ls-collapse-cell__title-extra">
				<image :src="thumb" class="ls-collapse-cell__title-img" />
			</view>
			<view class="ls-collapse-cell__title-inner">
				<view class="ls-collapse-cell__title-text">
					<text class="d-inline-block mr-2 v-middle" style="width: 10rpx;height: 30rpx;" :style="{backgroundColor:blockColorTemp}" v-if="showBlock"></text>
					{{ title }}
				</view>
			</view>
			<view :class="{ 'uni-active': isOpen, 'ls-collapse-cell--animation': showAnimation === true }" class="ls-collapse-cell__title-arrow" @click.stop="onClick('icon')" v-show="showIcon">
				<uni-icons color="#bbb" size="20" type="arrowdown" />
			</view>
		</view>
		<view :style="{ height: isOpen ? 'auto' : '0px' }" class="ls-collapse-cell__content">
			<view :class="{ 'ls-collapse-cell--animation': showAnimation === true }" :style="{ transform: isOpen ? 'translateY(0px)' : 'translateY(-50%)','-webkit-transform' : isOpen ? 'translateY(0px)' : 'translateY(-50%)' }">
				<slot />
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from '../../uni-app/uni-icons/uni-icons.vue'
	export default {
		name: 'LsCollapseItem',
		components: {
			uniIcons
		},
		props: {
			title: {
				// 列表标题
				type: String,
				default: ''
			},
			name: {
				// 唯一标识符
				type: [Number, String],
				default: 0
			},
			disabled: {
				// 是否禁用
				type: [Boolean, String],
				default: false
			},
			showAnimation: {
				// 是否显示动画
				type: Boolean,
				default: false
			},
			open: {
				// 是否展开
				type: [Boolean, String],
				default: false
			},
			thumb: {
				// 缩略图
				type: String,
				default: ''
			},
            showIcon: {
            	// 显示箭头icon
            	type: [Boolean, String],
            	default: true
            },
			showBlock:{
				// 显示色块
				type: [Boolean, String],
				default: false
			},
			blockColor:{
				// 色块的颜色，showBlock == true时才生效
				type: String,
				default: ''
			},
			openBgColor:{
				// 选中的选择的背景颜色
				type: String,
				default: '#f5f5f5'
			}
		},
		data() {
			return {
				isOpen: false
			}
		},
		computed: {
			blockColorTemp() {
				let colorTemp = this.themes.color
				if (this.blockColor) {
					colorTemp = this.blockColor
				}
				return colorTemp
			}
		},
		watch: {
			open(val) {
				this.isOpen = val
			}
		},
		inject: ['collapse'],
		created() {
			this.isOpen = this.open
			this.nameSync = this.name ? this.name : this.collapse.childrens.length
			this.collapse.childrens.push(this)
			if (String(this.collapse.accordion) === 'true') {
				if (this.isOpen) {
					const lastEl = this.collapse.childrens[this.collapse.childrens.length - 2]
					if (lastEl) {
						this.collapse.childrens[this.collapse.childrens.length - 2].isOpen = false
					}
				}
			}
		},
		methods: {
			onClick(type) {
				if (this.disabled) {
					return
				}

				if (String(this.collapse.accordion) === 'true') {
					this.collapse.childrens.forEach(vm => {
						if (vm === this) {
							return
						}
						vm.isOpen = false
					})
				}
				this.isOpen = !this.isOpen
                if (type != 'icon') {
                    this.$emit('change')
                    this.collapse.onChange && this.collapse.onChange()
                }
				this.$forceUpdate()
			}
		}
	}
</script>

<style scoped>
	@charset "UTF-8";

	.ls-collapse-cell {
		position: relative
	}

	.ls-collapse-cell--hover {
		background-color: var(--openBgColor);
	}

	.ls-collapse-cell--open {
		background-color: var(--openBgColor);
	}

	.ls-collapse-cell--disabled {
		opacity: .3
	}

	.ls-collapse-cell--animation {
		transition: all .3s
	}

	.ls-collapse-cell:after {
		position: absolute;
		z-index: 3;
		right: 0;
		bottom: 0;
		left: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #e5e5e5
	}

	.ls-collapse-cell__title {
		padding: 24rpx 30rpx;
		width: 100%;
		box-sizing: border-box;
		flex: 1;
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center
	}

	.ls-collapse-cell__title-extra {
		margin-right: 18rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center
	}

	.ls-collapse-cell__title-img {
		height: 52rpx;
		width: 52rpx
	}

	.ls-collapse-cell__title-arrow {
		width: 20px;
		height: 20px;
		transform: rotate(0);
		transform-origin: center center
	}

	.ls-collapse-cell__title-arrow.uni-active {
		transform: rotate(180deg)
	}

	.ls-collapse-cell__title-inner {
		flex: 1;
		overflow: hidden;
		display: flex;
		flex-direction: column
	}

	.ls-collapse-cell__title-text {
		font-size: 32rpx;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: inherit;
		line-height: 1.5;
		overflow: hidden
	}

	.ls-collapse-cell__content {
		position: relative;
		width: 100%;
		overflow: hidden
	}

	.ls-collapse-cell__content .view {
		font-size: 28rpx
	}
</style>
