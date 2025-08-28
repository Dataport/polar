import { createApp } from 'vue'
import { register as registerPolar } from '@polar/polar'
import App from './App.vue'

registerPolar()
createApp(App).mount('#app')
