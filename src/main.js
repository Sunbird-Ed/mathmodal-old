import Vue from 'vue'
import './app.css'
import 'bootstrap-vue/dist/bootstrap-vue.min.css'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
