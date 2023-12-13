<template>
	<!-- 
		这个是根据u-input改过来的，u-input所有的参数和方法它都能用，这个是专门为了处理输入数字的问题的。
		修改内容：
			1、如果有传精度precision值，则input的type强制转为number
		用法：
			1、如果要输入金钱：<ls-input :precision="2" :min="0"/>
			2、如果要输入正整数：<ls-input :precision="0" :min="0"/>
			3、如果要输入[0.1~9.9]的折扣数：<ls-input :precision="1" :min="0.1" :max="9.9"/> 
			4、如果要输入体积(L)和重量(Kg)：<ls-input :precision="3" :min="0.001" :max="999999999"/>    
		注意：			
			1、不设置:min="0"的话，是能输入负数的，如果要不想输入负数的，就要设为<ls-input :min="0">，
			2、min的值是在@blur时才会触发
			3、shop端和admin端的本组件是完全一样的，更新一端，另一端请直接copy代码覆盖另一端
		它与u-input对比的优点：
			1、加入了u-number-box才有的precision、max、min三个参数；
			2、解决了用输入金钱时<input @input="input" />，this.value=$stringUtils.inputMoney(e)这种写法要在methods里用setTimeout来改变value值的问题
		它与u-number-box对比的优点：
			1、u-number-box只能输入数字，这里是可以输入text文字的
			2、删掉了u-number-box的步长step和控制按钮showMinus，showPlus
	-->
    <view class="u-input" :class="[inputClass,className]" :style="[wrapperStyle]">
        <view class="u-input__content">
            <view
                class="u-input__content__prefix-icon"
                v-if="prefixIcon || $slots.prefix"
            >
                <slot name="prefix">
                    <u-icon
                        :name="prefixIcon"
                        size="18"
                        :customStyle="prefixIconStyle"
                    ></u-icon>
                </slot>
            </view>
            <view class="u-input__content__field-wrapper" @tap="clickHandler">
				<!-- 根据uni-app的input组件文档，H5和APP中只要声明了password参数(无论true还是false)，type均失效，此时
					为了防止type=number时，又存在password属性，type无效，此时需要设置password为undefined
				 -->
            	<input
            	    class="u-input__content__field-wrapper__field"
            	    :style="[inputStyle]"
            	    :type="(precision||precision===0)?'number':type"
            	    :focus="focus"
            	    :cursor="cursor"
            	    :value="innerValue"
            	    :auto-blur="autoBlur"
            	    :disabled="disabled || readonly"
            	    :maxlength="maxlength"
            	    :placeholder="placeholder"
            	    :placeholder-style="placeholderStyle"
            	    :placeholder-class="placeholderClass"
            	    :confirm-type="confirmType"
            	    :confirm-hold="confirmHold"
            	    :hold-keyboard="holdKeyboard"
            	    :cursor-spacing="cursorSpacing"
            	    :adjust-position="adjustPosition"
            	    :selection-end="selectionEnd"
            	    :selection-start="selectionStart"
            	    :password="password || type === 'password' || undefined"
            	    @input="onInput"
            	    @blur="onBlur"
            	    @focus="onFocus"
            	    @confirm="onConfirm"
            	    @keyboardheightchange="onkeyboardheightchange"
            	/>
            </view>
            <view
                class="u-input__content__clear"
                v-if="isShowClear"
                @tap="onClear"
            >
                <u-icon
                    name="close"
                    size="11"
                    color="#ffffff"
                    customStyle="line-height: 12px"
                ></u-icon>
            </view>
            <view
                class="u-input__content__subfix-icon"
                v-if="suffixIcon || $slots.suffix"
            >
                <slot name="suffix">
                    <u-icon
                        :name="suffixIcon"
                        size="18"
                        :customStyle="suffixIconStyle"
                    ></u-icon>
                </slot>
            </view>
        </view>
    </view>
</template>

<script>
import props from './props.js';
/**
 * Input 输入框
 * @description  此组件为一个输入框，默认没有边框和样式，是专门为配合表单组件u-form而设计的，利用它可以快速实现表单验证，输入内容，下拉选择等功能。
 * @tutorial https://uviewui.com/components/input.html
 * @property {String | Number}	value					输入的值
 * @property {String}			type					输入框类型，见上方说明 （ 默认 'text' ）
 * @property {Boolean}			fixed					如果 textarea 是在一个 position:fixed 的区域，需要显示指定属性 fixed 为 true，兼容性：微信小程序、百度小程序、字节跳动小程序、QQ小程序 （ 默认 false ）
 * @property {Boolean}			disabled				是否禁用输入框 （ 默认 false ）
 * @property {String}			disabledColor			禁用状态时的背景色（ 默认 '#f5f7fa' ）
 * @property {Boolean}			clearable				是否显示清除控件 （ 默认 false ）
 * @property {Boolean}			password				是否密码类型 （ 默认 false ）
 * @property {String | Number}	maxlength				最大输入长度，设置为 -1 的时候不限制最大长度 （ 默认 -1 ）
 * @property {String}			placeholder				输入框为空时的占位符
 * @property {String}			placeholderClass		指定placeholder的样式类，注意页面或组件的style中写了scoped时，需要在类名前写/deep/ （ 默认 'input-placeholder' ）
 * @property {String | Object}	placeholderStyle		指定placeholder的样式，字符串/对象形式，如"color: red;"
 * @property {Boolean}			showWordLimit			是否显示输入字数统计，只在 type ="text"或type ="textarea"时有效 （ 默认 false ）
 * @property {String}			confirmType				设置右下角按钮的文字，兼容性详见uni-app文档 （ 默认 'done' ）
 * @property {Boolean}			confirmHold				点击键盘右下角按钮时是否保持键盘不收起，H5无效 （ 默认 false ）
 * @property {Boolean}			holdKeyboard			focus时，点击页面的时候不收起键盘，微信小程序有效 （ 默认 false ）
 * @property {Boolean}			focus					自动获取焦点，在 H5 平台能否聚焦以及软键盘是否跟随弹出，取决于当前浏览器本身的实现。nvue 页面不支持，需使用组件的 focus()、blur() 方法控制焦点 （ 默认 false ）
 * @property {Boolean}			autoBlur				键盘收起时，是否自动失去焦点，目前仅App3.0.0+有效 （ 默认 false ）
 * @property {Boolean}			disableDefaultPadding	是否去掉 iOS 下的默认内边距，仅微信小程序，且type=textarea时有效 （ 默认 false ）
 * @property {String ｜ Number}	cursor					指定focus时光标的位置（ 默认 -1 ）
 * @property {String ｜ Number}	cursorSpacing			输入框聚焦时底部与键盘的距离 （ 默认 30 ）
 * @property {String ｜ Number}	selectionStart			光标起始位置，自动聚集时有效，需与selection-end搭配使用 （ 默认 -1 ）
 * @property {String ｜ Number}	selectionEnd			光标结束位置，自动聚集时有效，需与selection-start搭配使用 （ 默认 -1 ）
 * @property {Boolean}			adjustPosition			键盘弹起时，是否自动上推页面 （ 默认 true ）
 * @property {String}			inputAlign				输入框内容对齐方式（ 默认 'left' ）
 * @property {String | Number}	fontSize				输入框字体的大小 （ 默认 '15px' ）
 * @property {String}			color					输入框字体颜色	（ 默认 '#303133' ）
 * @property {Function}			formatter			    内容式化函数
 * @property {String}			prefixIcon				输入框前置图标
 * @property {String | Object}	prefixIconStyle			前置图标样式，对象或字符串
 * @property {String}			suffixIcon				输入框后置图标
 * @property {String | Object}	suffixIconStyle			后置图标样式，对象或字符串
 * @property {String}			border					边框类型，surround-四周边框，bottom-底部边框，none-无边框 （ 默认 'surround' ）
 * @property {Boolean}			readonly				是否只读，与disabled不同之处在于disabled会置灰组件，而readonly则不会 （ 默认 false ）
 * @property {String}			shape					输入框形状，circle-圆形，square-方形 （ 默认 'square' ）
 * @property {Object}			customStyle				定义需要用到的外部样式
 *
 * @example <u-input v-model="value" :password="true" suffix-icon="lock-fill" />
 */
export default {
    name: 'LsInput',
    mixins: [props],
	// #ifdef MP-WEIXIN
	// 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性。这时在<组件name> 里加style和class是不会生效的
	options: { virtualHost: true },
	// #endif
    data() {
        return {
            // 输入框的值
            innerValue: '',
            // 是否处于获得焦点状态
            focused: false,
            // value是否第一次变化，在watch中，由于加入immediate属性，会在第一次触发，此时不应该认为value发生了变化
            firstChange: true,
            // value绑定值的变化是由内部还是外部引起的
            changeFromInner: false,
			// 过滤处理方法
			innerFormatter: value => value
        };
    },
    watch: {
        value: {
            immediate: true,
            handler(newVal, oldVal) {
                this.innerValue = newVal;
                /* #ifdef H5 */
                // 在H5中，外部value变化后，修改input中的值，不会触发@input事件，此时手动调用值变化方法
                if (
                    this.firstChange === false &&
                    this.changeFromInner === false
                ) {
                    this.valueChange();
                }
                /* #endif */
                this.firstChange = false;
                // 重置changeFromInner的值为false，标识下一次引起默认为外部引起的
                this.changeFromInner = false;
            },
        },
    },
    computed: {
        // 是否显示清除控件
        isShowClear() {
            const { clearable, readonly, focused, innerValue } = this;
            return !!clearable && !readonly && !!focused && innerValue !== '';
        },
        // 组件的类名
        inputClass() {
            let classes = [];
                const { border, disabled, shape } = this;
            border === 'surround' &&
                (classes = classes.concat(['u-border', 'u-input--radius']));
            classes.push(`u-input--${shape}`);
            border === 'bottom' &&
                (classes = classes.concat([
                    'u-border-bottom',
                    'u-input--no-radius',
                ]));
            return classes.join(' ');
        },
        // 组件的样式
        wrapperStyle() {
            const style = {};
            // 禁用状态下，被背景色加上对应的样式
            if (this.disabled) {
                style.backgroundColor = this.disabledColor;
            }
            // 无边框时，去除内边距
            if (this.border === 'none') {
                style.padding = '0';
            } else {
				style.padding = this.padding;
				// if (this.padding) {
				// 	style.padding = this.padding;
				// }else{
				// 	// 由于uni-app的iOS开发者能力有限，导致需要分开写才有效
				// 	style.paddingTop = "6px";
				// 	style.paddingBottom = "6px";
				// 	style.paddingLeft = "9px";
				// 	style.paddingRight = "9px";
				// }
            }
            return uni.$u.deepMerge(style, this.$stringUtils.addStyle(this.customStyle));
        },
        // 输入框的样式
        inputStyle() {
            const style = {
                color: this.color,
                fontSize: uni.$u.addUnit(this.fontSize,'px'),
				textAlign: this.inputAlign
            };
            return style;
        },
    },
    methods: {
		// 在微信小程序中，不支持将函数当做props参数，故只能通过ref形式调用
		setFormatter(e) {
			this.innerFormatter = e
		},
        // 当键盘输入时，触发input事件
        onInput(e) {
            const { value = '' } = e.detail || {};
            // 格式化过滤方法
            const formatter = this.formatter || this.innerFormatter
            const formatValue = formatter(value)
            // 为了避免props的单向数据流特性，需要先将innerValue值设置为当前值，再在$nextTick中重新赋予设置后的值才有效
            this.innerValue = value
            this.$nextTick(() => {
            	this.innerValue = formatValue;
            	this.valueChange();
            })
        },
        // 输入框失去焦点时触发
        onBlur(event) {
			// start 以下这段为新增
			if (this.type == 'number' || this.precision || this.precision === 0) {
				// 如果不传min值,由于type = 'number'，input是可以输入‘+-123’的，此时页面上能显示‘+-123’，但事实上innerValue的值为：''，此时要将innerValue设为undefined
				if (this.min === '' && !this.innerValue) {
					this.innerValue = 0 // 此之前innerValue的值为'',要先将innerValue设一个非空值(设为undefined不行，还是为空，页面渲染不会有变化)，让它有变化，页面上的渲染才会发生变化
					this.$nextTick(() => {
						this.innerValue = undefined
						this.$emit('input', this.innerValue);
					})
				} else {
					// 当type=number类型时,键盘是可以输入+-的,这时页面上看到+-4,但其实innerValue值是为''
					if (((this.min === 0 || this.min) && !this.innerValue && this.innerValue !== this.min) || this.min > Number(this.innerValue)) {
						// if ((this.min == 0 || this.min) && this.min > this.innerValue) {
						this.innerValue = this.min // 如果this.min === 0，就要加上这句话让它下面的innerValue = undefined有变化从而使页面更新渲染
						this.$nextTick(() => {
							// 以下三种情况,看用户体验来切换
							// this.innerValue = this.min === 0?undefined:this.min	//当this.min === 0时，如：输入'+-123'(这时value打印出来值为''),让value值置空而不是显示0，但这种会有一个缺点，当我输入+-123时，插件会强行变为min值直接给后台保存
							this.innerValue = undefined	// 只要value值少于min，则将输入框置空
							// this.innerValue = this.min	//只要value值少于min，则将输入框value值变为min值(但这种会有一个缺点，当我输入+-123时，插件会强行变为min值直接给后台保存)
							this.$emit('input', this.innerValue);
						})
					}
				}
			}
			// end 以下这段为新增
			
            this.$emit('blur', event.detail.value);
            // H5端的blur会先于点击清除控件的点击click事件触发，导致focused
            // 瞬间为false，从而隐藏了清除控件而无法被点击到
            this.$stringUtils.sleep(50).then(() => {
                this.focused = false;
            });
            // 尝试调用u-form的验证方法
            this.formValidate(this, 'blur');
        },
        // 输入框聚焦时触发
        onFocus(event) {
            this.focused = true;
            this.$emit('focus');
        },
        // 点击完成按钮时触发
        onConfirm(event) {
            this.$emit('confirm', this.innerValue);
        },
        // 键盘高度发生变化的时候触发此事件
        // 兼容性：微信小程序2.7.0+、App 3.1.0+
		onkeyboardheightchange() {
            this.$emit('keyboardheightchange');
        },
        // 内容发生变化，进行处理
        valueChange() {
			// start 以下这段为新增
			if (this.innerValue) {
				// :precision="2" :min="0"
				if (this.precision || this.precision === 0) {
					this.innerValue = this.$stringUtils.inputDigits(this.innerValue, this.precision,this.min)
				}
				if (this.max && this.max < Number(this.innerValue)) {
					this.innerValue = this.max
				}
			}
			// end 以下这段为新增
			
            const value = this.innerValue;
            this.$nextTick(() => {
                this.$emit('input', value);
                // 标识value值的变化是由内部引起的
                this.changeFromInner = true;
                this.$emit('change', value);
                // 尝试调用u-form的验证方法
                this.formValidate(this, 'change');
            });
        },
        // 点击清除控件
        onClear() {
            this.innerValue = '';
            this.$nextTick(() => {
                this.valueChange();
                this.$emit('clear');
            });
        },
        /**
         * 在安卓nvue上，事件无法冒泡
         * 在某些时间，我们希望监听u-from-item的点击事件，此时会导致点击u-form-item内的u-input后
         * 无法触发u-form-item的点击事件，这里通过手动调用u-form-item的方法进行触发
         */
        clickHandler() {
            // #ifdef APP-NVUE
            if (uni.$u.os() === 'android') {
                const formItem = uni.$u.$parent.call(this, 'u-form-item');
                if (formItem) {
                    formItem.clickHandler();
                }
            }
            // #endif
        },
		
		/**
		 * @description 在u-form的子组件内容发生变化，或者失去焦点时，尝试通知u-form执行校验方法
		 * @param {*} instance
		 * @param {*} event
		 */
		formValidate(instance, event) {
			const formItem = uni.$u.$parent.call(instance, 'u-form-item')
			const form = uni.$u.$parent.call(instance, 'u-form')
			// 如果发生变化的input或者textarea等，其父组件中有u-form-item或者u-form等，就执行form的validate方法
			// 同时将form-item的pros传递给form，让其进行精确对象验证
			if (formItem && form) {
				form.validateField(formItem.prop, () => {}, event)
			}
		},
    },
};
</script>

<style lang="scss" scoped>
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

// 通过scss的mixin功能，把原来需要写4行的css，变成一行
// 目的是保持代码干净整洁，不至于在nvue下，到处都要写display:flex的条件编译
@mixin flex($direction: row) {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: $direction;
}

.u-input {
    @include flex(row);
    align-items: center;
    justify-content: space-between;
    flex: 1;

    &--radius,
    &--square {
        border-radius: 4px;
    }

    &--no-radius {
        border-radius: 0;
    }

    &--circle {
        border-radius: 100px;
    }

    &__content {
        flex: 1;
        @include flex(row);
        align-items: center;
        justify-content: space-between;

        &__field-wrapper {
            position: relative;
            @include flex(row);
            margin: 0;
            flex: 1;
			
			&__field {
				line-height: 26px;
				text-align: left;
				color: $u-main-color;
				height: 24px;
				font-size: 15px;
				flex: 1;
			}
        }

        &__clear {
            width: 20px;
            height: 20px;
            border-radius: 100px;
            background-color: #c6c7cb;
            @include flex(row);
            align-items: center;
            justify-content: center;
            transform: scale(0.82);
            margin-left: 4px;
        }

        &__subfix-icon {
            margin-left: 4px;
        }

        &__prefix-icon {
            margin-right: 4px;
        }
    }
}
</style>
