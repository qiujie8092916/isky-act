import Vue from "vue";
import MintUI from 'mint-ui'
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";

import './App.css'
import 'mint-ui/lib/style.css'
import { SDK } from '@iskytrip/sdk'

SDK.init()

Vue.config.productionTip = false;

Vue.use(MintUI)

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
