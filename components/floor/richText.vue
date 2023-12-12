<template>
    <!-- /*
     * @Descripttion:(其它组件：富文本)：richText
    */ -->
    <view
        :class="[!floors.fullScreen ? 'p-2' : '']"
        :style="{
            backgroundColor: floors.themeColor ? parmas.themeColor : floors.backgroundColor,
        }"
    >
		<u-parse class="font-28 overflow-h" v-if="floors.data.richTextData" :html="floors.data.richTextData"></u-parse>
	</view>
</template>

<script>
export default {
    components: {},
    filters: {},
    props: {
        floors: {
            type: Object,
            default: () => {
                return {}
            }
        },
        parmas: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {}
    },
    computed: {},
    watch: {},
    mounted() {},
    destroyed() {},
    methods: {}
}
</script>

<style lang="scss" scoped></style>
