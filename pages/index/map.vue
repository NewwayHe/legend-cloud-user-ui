<!-- 
	* 地图选点组件 | 腾讯位置服务
	* H5端才用到(小程序和APP上用uni.chooseLocation方法)，需要有腾讯地图的key。申请地址：https://lbs.qq.com/webApi/component/componentGuide/componentPicker
	* 引用：一、public/index.html里引入：<script type="text/javascript" src="https://3gimg.qq.com/lightmap/components/geolocation/geolocation.min.js"></script>
	* 	   二、manifest.json里【H5配置】->[定位和地图]，勾选【腾讯地图】
	* 
 -->
<template>
	<view>
		<web-view :src="txSrc"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				txSrc: `https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=${this.$config.txMapKey}&referer=ls`
			}
		},
		onLoad(options) {
			window.addEventListener('message', e => {
				this.$u.debounce(() => {
				    // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
				    var loc = e.data;
				    if (loc && loc.module == 'locationPicker') {
				        // 防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
						this.$store.dispatch('__delLocationMsg',{ data:loc, latitude:loc.latlng.lat, longitude:loc.latlng.lng,isTxMapKey:true, notSetLocation:options.notSetLocation == 'true' })
				        this.$navigateBack()// 如果用$switchTab跳index的话，会出现点击穿透的问题
				    }
				});
			}, false);
		},
        mounted() {
        },
		onHide() {
			window.removeEventListener();
		},
		methods: {}
	}
</script>
