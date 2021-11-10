import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue(); //在vue共享方法上创建 $bus(事件组件) 赋值为vue实例 通过vue实例调用事件

new Vue({
  render: h => h(App),
  router
}).$mount('#app')

