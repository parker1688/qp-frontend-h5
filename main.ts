import App from './App'
import pinia from "@/stores/index";
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3

import uvNoData from '@/components/uv-nodata/index.vue'; // 引入你的组件
import tabBar from '@/components/tabBar/index'; // 引入你的组件

import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  app.component('uvNoData', uvNoData); // 全局注册组件
  app.component('tabBar', tabBar); // 全局注册组件
  app.use(pinia);
  return {
    app
  }
}
// #endif