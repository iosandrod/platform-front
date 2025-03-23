import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router';
import elementPlus from 'element-plus'
import 'element-plus/dist/index.css'
const app = createApp(App);
import Vant, { Locale } from 'vant'
import enUS from 'vant/es/locale/lang/en-US'
// import '@vant/touch-emulator'
import 'element-plus/dist/index.css'
import 'vant/lib/index.css'
import './mainStyle.css'
Locale.use('en-US', enUS) 
app.use(Vant)
app.use(router);
app.use(elementPlus);
app.mount('#stepin-app');
