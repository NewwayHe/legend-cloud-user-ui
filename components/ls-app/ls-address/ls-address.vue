<template>
	<u-popup v-model="show" mode="bottom" border-radius="14" safe-area-inset-bottom :style="{ '--themescolor': themes.color }">
		<view class="flex-between h-88r font-28">
			<view class="px-3" @click.stop="change" :style="{ color: cancelColor }">{{ cancelText }}</view>
			<view class="font-32 line-clamp1 text-center" style="max-width: 50%;">{{ title }}</view>
			<view class="px-3" @click.stop="onConfirm" :style="{ color: confirmColor ? confirmColor : themes.color }">{{ confirmText }}</view>
		</view>

		<view class="h-88r border-top border-bottom border-f1">
			<ls-tabs :current="selectIndex" :list="locationName" @change="switchType" alwaysScroll v-if="locationName && locationName.length" />
		</view>

		<view class="border-top text-center font-32 p-2" style="height: 60vh">
			<scroll-view style="height: 100%" scroll-y :scroll-into-view="scrollViewId">
				<view :style="{ display: selectIndex == 0 ? 'block' : 'none' }">
					<view v-if="provinceData">
						<view
							v-for="(item, index) in provinceData"
							:key="index"
							class="p-2"
							:class="item.id == location[selectIndex].key ? 'text-main' : ''"
							@click.stop="switchAddress(item[valueName], item[keyName], 'cityData')"
							:id="'uni-indexed-list-' + item.id"
						>
							<text class="iconfont icon-success text-main mr-1 v-middle" style="font-size: 36rpx;" v-if="item.id == location[selectIndex].key"></text>
							{{ item[valueName] }}
						</view>
					</view>
				</view>

				<view :style="{ display: selectIndex == 1 ? 'block' : 'none' }">
					<view v-if="cityData">
						<view
							v-for="(item, index) in cityData"
							:key="index"
							class="p-2"
							:class="item.id == location[selectIndex].key ? 'text-main' : ''"
							@click.stop="switchAddress(item[valueName], item[keyName], 'areaData')"
							:id="'uni-indexed-list-' + item.id"
						>
							<text class="iconfont icon-success text-main mr-1 v-middle" style="font-size: 36rpx;" v-if="item.id == location[selectIndex].key"></text>
							{{ item[valueName] }}
						</view>
					</view>
				</view>

				<view :style="{ display: selectIndex == 2 ? 'block' : 'none' }">
					<view v-if="areaData">
						<view
							v-for="(item, index) in areaData"
							:key="index"
							class="p-2"
							:class="item.id == location[selectIndex].key ? 'text-main' : ''"
							@click.stop="switchAddress(item[valueName], item[keyName], 'townsData')"
							:id="'uni-indexed-list-' + item.id"
						>
							<text class="iconfont icon-success text-main mr-1 v-middle" style="font-size: 36rpx;" v-if="item.id == location[selectIndex].key"></text>
							{{ item[valueName] }}
						</view>
					</view>
				</view>

				<view :style="{ display: selectIndex == 3 ? 'block' : 'none' }">
					<view v-if="townsData">
						<view
							v-for="(item, index) in townsData"
							:key="index"
							class="p-2"
							:class="item.id == location[selectIndex].key ? 'text-main' : ''"
							@click.stop="switchAddress(item[valueName], item[keyName], 'endData')"
							:id="'uni-indexed-list-' + item.id"
						>
							<text class="iconfont icon-success text-main mr-1 v-middle" style="font-size: 36rpx;" v-if="item.id == location[selectIndex].key"></text>
							{{ item[valueName] }}
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</u-popup>
</template>

<script>
import { addressApi } from '@/api/ModulesCommon.js';
export default {
	name: 'LsAddress',
	props: {
		mode: {
			type: String,
			default: 'id'
		},
		defaultValue: {
			// [1,21,45,45]
			type: Array,
			default: () => {
				return [];
			}
		},
		// 通过双向绑定控制组件的弹出与收起
		value: {
			type: Boolean,
			default: false
		},
		closeOnClickOverlay: {
			type: Boolean,
			default: true
		},
		// "取消"按钮的颜色
		cancelColor: {
			type: String,
			default: '#606266'
		},
		// "确定"按钮的颜色
		confirmColor: {
			type: String,
			default: ''
		},
		// 是否允许通过点击遮罩关闭Picker
		maskCloseAble: {
			type: Boolean,
			default: true
		},
		// 自定义value属性名
		valueName: {
			type: String,
			default: 'value'
		},
		// 自定义key属性名
		keyName: {
			type: String,
			default: 'key'
		},
		// 顶部标题
		title: {
			type: String,
			default: ''
		},
		// 取消按钮的文字
		cancelText: {
			type: String,
			default: '取消'
		},
		// 确认按钮的文字
		confirmText: {
			type: String,
			default: '确认'
		}
	},
	data() {
		return {
			show: this.value,
			selectIndex: 0,
			location: [
				{ name: '请选择', selectName: '', key: '' }
				// { name: '城市', selectName: '', key: ''},
				// { name: '区县', selectName: '', key: ''},
				// { name: '街道/乡镇', selectName: '', key: ''}
			],
			setSelectValue: [],

			provinceData: '', // 省
			cityData: '', // 市
			areaData: '', // 区
			townsData: '', // 街道
			defaultlocation: [],
			isinit: false,
			scrollViewId: ''
		};
	},
	computed: {
		locationName() {
			const nameList = this.location.map(item => {
				return item.selectName ? item.selectName : item.name;
			});
			return nameList;
		}
	},
	watch: {
		value(val) {
			this.show = val;
			if (val) {
				// console.log('xxxxxx');
				!this.isinit && this.init();
				// 回选用，让ls-tabs的下划线重新计算
				if (this.isinit && this.location && this.location.length) {
					this.selectIndex = this.location.length - 1;
				}
				this.isinit = true;
			}
		},
		show(val) {
			this.$emit('input', val);
		},
		defaultValue(val) {
			console.log('defaultValue:',val);
			this.defaultlocation = val;
		}
	},

	mounted() {},
	created() {},

	methods: {
		init() {
			if (this.defaultValue.length > 0 && this.defaultValue[0].key) {
				const newDefaultValue = this.defaultValue.filter(item => item.key);
				const newLocation = [];

				newDefaultValue.forEach((item, index, newDefaultValue) => {
					newLocation.push({ name: '请选择', selectName: item.name, key: item.key });
				});

				this.location = newLocation;
				this.selectIndex = newLocation.length - 1;
				console.log(this.location);
				for (let index = 0; index < this.location.length; index++) {
					const map = {
						0: 'provinceData',
						1: 'cityData',
						2: 'areaData',
						3: 'townsData'
					};

					if (index == 0) {
						this.getloadProvinces(0, 'provinceData');
					} else {
						const element = this.location[index - 1];

						this.getloadProvinces(element.key, map[index]);
					}
				}

				return;
			}

			this.getloadProvinces(0, 'provinceData');
		},

		// 加载地址
		getloadProvinces(prames, addressType) {
			const parameterValue = {};

			// 渲染数据
			const dogSwitch = addressType =>
				({
					provinceData: 'provinceData',
					cityData: 'cityData',
					areaData: 'areaData',
					townsData: 'townsData'
				}[addressType] || 'provinceData');

			// prames && (parameterValue[dataObj(addressType)] = prames)

			// parameterValue.mode = this.mode
			return new Promise((resolve, reject) => {
				// id
				addressApi
					.location(prames)
					.then(res => {
						if (res.code == 1) {
							this[`${dogSwitch(addressType)}`] = res.data;
							resolve(res.data);
						} else {
							reject(null);
						}
					})
					.catch(error => {
						reject(null);
					});
			}).catch(error => {
				console.log('error', error);
			});
		},

		async switchAddress(value, key, type) {
			// 防连续点击(当接口加载速度很慢时，用debounce，throttle都无法解决问题，只能用遮罩层)
			uni.showLoading({ mask: true, title: '加载地址中...' });
			let data = null;
			if (key == this.location[this.selectIndex].key) {
				return;
			}
			const tabIndex = 0;
			type != 'endData' && (data = await this.getloadProvinces(key, type));
			if (key !== this.location[this.selectIndex].key) {
				this.location.forEach((item, index) => {
					if (index > this.selectIndex) {
						this.location.splice(index, this.location.length - 1);
					}
				});
			}
			this.location[this.selectIndex].selectName = value;
			this.location[this.selectIndex].key = key;
			data && data.length > 0 && type && (this.selectIndex += 1);
			data && data.length > 0 && (this.location = [...this.location, { name: '请选择', selectName: '', key: '' }]);
			if (type == 'endData' || !data.length) {
				this.onConfirm();
			}
			setTimeout(() => { uni.hideLoading() },100)
		},

		change() {
			this.show = !this.show;
		},

		// 确认
		onConfirm() {
			let isSelect = false; // 默认有选择
			const values = [];
			const keys = [];
			this.location.forEach((item, index) => {
				if (item.selectName == '') {
					isSelect = true;
				} else {
					values.push(item.selectName);
				}
				keys.push(item.key);
			});
			if (isSelect) {
				this.$u.toast('尚有未选中项');
				return;
			}
			this.selectIndex = 0;
			this.$emit('confirm', { keys, values });
			this.change();
		},

		// 切换tabs`
		switchType(item) {
			this.selectIndex = item.index;
			this.$nextTick(() => {
				this.scrollViewId = 'uni-indexed-list-' + this.location[this.selectIndex].key;
			});
		}
	}
};
</script>
<style lang="scss" scoped></style>
