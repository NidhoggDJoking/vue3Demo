import { createApp } from 'vue'


import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import './style.css'

import './components/calendars/index.css'
import i18n from './locale/index.ts'

import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.use(i18n)
app.mount('#app')
