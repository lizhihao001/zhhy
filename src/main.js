import Vue from 'vue'
import App from './App'

import UViewUI from 'uview-ui'
Vue.use(UViewUI)

import VueCompositionApi from '@vue/composition-api'
Vue.use(VueCompositionApi)

import store from '@/models'

Vue.prototype.$store = store

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  store,
  ...App,
})
app.$mount()
