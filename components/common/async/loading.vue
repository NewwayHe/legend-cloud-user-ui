<!--
	*页面js加载时使用的组件（需注册为全局组件）-- 只有H5端有用
-->
<template>
	<view class="center-xy">
		<view class="h-100r w-100r">
			<!--  loading的样式,3dot：三个旋转的点，flower：旋转的花，atom：3D原子， -->
			<loadingCss type="3dot"/>
		</view>
	</view>
</template>

<script>
import loadingCss from '@/static/cssImage/loadingCss.vue';
export default {
    name: 'loading',
	components: {loadingCss},
    data() {
        return {
			
		};
    },
};
</script>

<style lang="scss" scoped>

</style>

