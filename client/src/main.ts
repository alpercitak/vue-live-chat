import app from './app.vue';
import { createApp } from 'vue';
import { createPinia } from 'pinia';

const vueApp = createApp(app);
const pinia = createPinia();

vueApp.use(pinia);
vueApp.mount('#app');
