<template>
    <text
        :class="[className]"
        :style="[{ 'font-size': optionstyle.ds + 'rpx', color: optionstyle.dc, 'font-weight': optionstyle.dw, 'font-family': 'Arial Bold' },cssStyle]"
    >
        <text :class="{ 'font-weight': moneyIconWeight }" v-if="!noMoneyIcon">￥</text>
        <text :style="{ 'font-size': optionstyle.is + 'rpx', color: optionstyle.ic, 'font-weight': optionstyle.iw }">{{ priceTemp(price)[0] }}</text>
        <text :style="{ 'font-weight': optionstyle.dw }" v-if="priceTemp(price)[1]">.{{ priceTemp(price)[1] }}</text>
    </text>
</template>

<script>
export default {
    name: 'LsPrice',
	// #ifdef MP-WEIXIN
	// 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性。这时在<组件name> 里加style和class是不会生效的
	options: { virtualHost: true },
	// #endif
    props: {
        // 价格
        price: {
            type: [Number, String],
            default: 0
        },
		className:{
			type: [String, Array,Boolean],// 这里加个Boolean，是因为如果传className=""，小程序端会报错
			default: ''
		},
		// 自定义样式，对象形式
		cssStyle: {
			type: Object,
			default() {
				return {};
			}
		},
        /*
        options：Object
        用法：:options="{ic:'green',is:60}"
        备注：如果只有微信端和APP端，可以用以下方法给对象设默认值(如下)，但H5会报错(只是报错，功能还是正常的)，
             H5如果不在HTML上接收这个参数的话，可以用default:()=>{}来解决，如果要把这个参数写在HTML上，则只能在computed里设置默认值
        options : {
            type: Object,
            default:{
                is : 28,//integer-size,整数字体大小
                ic : '',//integer-color,整数字体颜色，默认是主题颜色
                iw : 500,//integer-weight,整数字体字重
                ds : 24,//decimal-size,小数、整数及￥字体大小
                dc : '',//decimal-color,小数、整数及￥字体颜色，默认是主题颜色
                dw : 500,//decimal-weight,小数、整数及￥字体字重
            }
        }, 
        */
        options: Object,

        // 是否显示￥符号，true:不显示，false:显示，默认值为:false
        noMoneyIcon: {
            type: [Boolean, String],
            default: false
        },
        // 是否加强￥符号的字重，默认值为:false(不加强￥字重)
        moneyIconWeight: {
            type: [Boolean, String],
            default: false
        },
        // 是否“不”显示主题颜色，默认不是不显示主题颜色(即是默认显示主题颜色)
        notThemes: {
            type: [Boolean, String],
            default: false
        }
    },
    data() {
        return {
        }
    },
    computed: {
        optionstyle() {
            let options2 = {}
            if (this.options) {
                options2 = {
                    is: this.options.is || 28, // integer-size,整数字体大小
                    ic: this.options.ic ? this.options.ic : !this.notThemes ? this.themes.color : '', // integer-color,整数字体颜色，默认notThemes为false时是主题颜色，notThemes为true时不设颜色(承继父级元素的颜色)
                    iw: this.options.iw || 500, // integer-weight,整数字体字重
                    ds: this.options.ds || 24, // decimal-size,小数字体大小
					dc: (this.options.dc || this.options.ic) ? (this.options.dc || this.options.ic) : !this.notThemes ? this.themes.color : '', // decimal-color,小数字体颜色，默认notThemes为false时是主题颜色，notThemes为true时不设颜色(承继父级元素的颜色)
                    dw: this.options.dw || 500 // decimal-weight,小数字体字重
                }
            } else {
                options2 = {
                    is: 28, // integer-size,整数字体大小
                    ic: !this.notThemes ? this.themes.color : '', // integer-color,整数字体颜色，默认notThemes为false时是主题颜色，notThemes为true时不设颜色(承继父级元素的颜色)
                    iw: 500, // integer-weight,整数字体字重
                    ds: 24, // decimal-size,小数字体大小
                    dc: !this.notThemes ? this.themes.color : '', // decimal-color,小数字体颜色，默认notThemes为false时是主题颜色，notThemes为true时不设颜色(承继父级元素的颜色)
                    dw: 500 // decimal-weight,小数字体字重
                }
            }
            return options2
        },
        
        priceTemp() { // 统一管理商品价格
            return function(price) {
                let arr = []
                if (price && price.toString().indexOf('~') != -1) { // 判断money是否为1.00~2.00的模式
                    arr = [price,'']
                }else{
                    arr = this.$stringUtils.formatNumber(price || 0)
                }
                return arr
            }
        },
    },
    created() {},

    methods: {}
}
</script>

<style lang="scss" scoped></style>

<!-- 用法：
    HTML：
        不用主题色：<ls-price notThemes :price="item.cash"/>
        用主题色：<ls-price :price="shop.shopTotalCash"/>
        或(备注：如果父级是<text></text>包住ls-price的话，微信端会不显示)：
            <view class="price">
                <ls-price :price="allpay" :options="{is:32}"/>
            </view>
 -->
