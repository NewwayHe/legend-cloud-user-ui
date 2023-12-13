<template>
	
</template>

<script>
	import { parent, children } from '../common/relation';
	export default {
		name: 'LimePainterImage',
		mixins:[children('painter')],
		props: {
			css: [String, Object],
			src: String
		},
		data() {
			return {
				type: 'image',
				el: {
					css: {},
					src: null
				},
			}
		}
	}
</script>

<style>
</style>
