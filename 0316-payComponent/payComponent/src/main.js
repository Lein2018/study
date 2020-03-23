import Vue from 'vue'
import App from './App.vue'
// import VuePay from "vue-pay-pops"
import Mint from 'mint-ui';
Vue.use(Mint);
// Vue.use(VuePay)
import 'mint-ui/lib/style.css'
new Vue({
  el: '#app',
  render: h => h(App)
})
