import vuePayPops from './vue-test-pay.vue' // 导入组件

const PayPop = {
    install(Vue, options) {
        Vue.component(vuePayPops.name, vuePayPops)
    }
}
export default PayPop

