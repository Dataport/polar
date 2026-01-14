import { register as registerPolar } from '@polar/polar'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'

registerPolar()
createApp(App).use(createPinia()).mount('#app')
