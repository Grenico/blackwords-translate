import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import Vant from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(Vant)
app.mount('#app')
