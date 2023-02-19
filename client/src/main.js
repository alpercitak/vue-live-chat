import Vue from 'vue';
import App from './App.vue';
import { createPinia, PiniaVuePlugin } from 'pinia';

const pinia = createPinia();
Vue.use(PiniaVuePlugin);
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  pinia,
}).$mount('#app');
