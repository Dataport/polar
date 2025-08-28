import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { register as registerPolar } from '@polar/polar'
import App from './App.vue'

registerPolar()
createApp(App).use(createPinia()).mount('#app')
