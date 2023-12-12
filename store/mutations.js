import Vue from 'vue';
import deepClone from "@/components/uview-ui/libs/function/deepClone.js";

export default {
	// 购物车角标
	setCartNum(state, data) {
		state.cartNum = data;
	},
	// 位置信息
	setLocation(state, data) {
		state.location = data;
	},
	setThemes(state, data) {
		state.themes = data;
	},
	setStausBarHeight(state, data) {
		state.stausBarHeight = data;
	},
	setSystemInfo(state, data) {
		state.systemInfo = data;
	},
	setWxMenuBut(state, data) {
		state.wxMenuBut = data;
	},
	setTimeDiff(state, data) {
		state.timeDiff = data;
	},
	setUserInfo(state, data) {
		state.userInfo = deepClone(data);
	},
	setContactInfo(state, data) {
		state.contactInfo = deepClone(data);
	},
	setSystemConfig(state, data) {
		state.systemConfig = deepClone(data);
	},
	setTabbar(state, data) {
		state.tabbar = deepClone(data);
	},
	setMyInfo(state, data) {
		state.myInfo = deepClone(data);
	},
	// 分类设置
	setCategorySet(state, data) {
		state.categorySet = data;
	},
	// 返回上/多级页面时 刷新数据列表
	setBackRefresh(state, bool) {
		state.isBackRefresh = bool;
	},

	setPopupAdvertRule(state, data) {
		state.popupAdvertRule = data;
	},
};

// 用法:this.$store.commit('setUserInfo', parmas);