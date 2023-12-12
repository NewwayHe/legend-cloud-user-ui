import Vue from 'vue'
export default new Vue()

/* 兄弟组件间传值
用法：
	A页面上有B组件和C组件(它们不一定是兄弟级，也可以是叔叔级、叔公级)，
	需求：B组件的参数传给C组件
	一、B组件上引入本文件，把要传的值用$emit()方法抛出：
		import eventBus from '@/store/eventBus.js'
		let obj = '999'
		eventBus.$emit('testEventBus',obj)
	二、C组件上引入本文件，把要传的值用$on()方法接收：
		import eventBus from '@/store/eventBus.js'
		mounted() {
			eventBus.$on('testEventBus',(val)=>{
				//一些操作，message就是从top组件传过来的值
				console.log('B组件要传的值：',val)//B组件要传的值：999
			})
		},
		注意： 如果在watch:{}里运行eventBus.$on是不行的
*/
