import moment from 'utils/moment.js'; // 时间格式
import stringUtils from '@/utils/stringUtils.js';
// 全局过滤器
const importFilters = (Vue) => {
	// 金额（ 保留两位，向下取整，例如：{{12.5599 | priceFilter}} = ￥12.55，{{12 | priceFilter}} = ￥12.00，{{12.5 | priceFilter}} = ￥12.50 ）
	Vue.filter('priceFilter', (val) => {
		if (val && String(val).includes('.')) {
			let text = String(val)
			// 如果只有1位小数，则后面拼一个0
			if (String(val).split(".")[1].length == 1) {
				text = String(val) + '0'
			}
			return '￥' + text.substring(0, text.indexOf(".") + 3); // 只取小数点后两位，后面的全部切割掉(不进行四舍五入)
		} else {
			if (!val) val = 0;
			return '￥' + Number(val).toFixed(2);
		}
	});
	// 处理范围金额（只处理一个范围, 保留两位，向下取整）如：0.88~6.43243 => ￥0.88~￥6.43
	Vue.filter('priceRangeFilters', (val, split = '~') => {
		const filter = (price) => {
			if (price && String(price).includes('.')) {
				let text = String(price)
				// 如果只有1位小数，则后面拼一个0
				if (String(price).split(".")[1].length == 1) {
					text = String(price) + '0'
				}
				return '￥' + text.substring(0, text.indexOf(".") + 3); // 只取小数点后两位，后面的全部切割掉(不进行四舍五入)
			} else {
				if (!price) price = 0;
				return '￥' + Number(val).toFixed(2);
			}
		};
		if (val && val.includes(split)) {
			const arr = val.split(split);
			return `${filter(arr[0])}~${filter(arr[1])}`;
		} else {
			return filter(val);
		}
	});
	// 查找对应的状态
	Vue.filter('getLabelText', function(value, list, label = 'label') {
		const data = list.find((v) => v.value === value);
		if (data) {
			return data[label];
		} else {
			return '';
		}
	});
	// 日期过滤，用法：{{ item.addtime | dateformat('YYYY-MM-DD') }}
	Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss', label) {
		return dataStr ? moment(dataStr).format(pattern) : label || null;
	});
	// {{item.comments|numFormat}}条评价 ： {{ 99999 | numFormat }} = 10万
	Vue.filter('numFormat', function(numData, defVal = 0) {
		return stringUtils.numData(numData, defVal);
	});
};

export default importFilters;
