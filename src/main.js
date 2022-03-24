import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import axios from 'axios'

axios.defaults.baseURL = "https://api-urbanwild.herokuapp.com/"

createApp(App).use(router, axios).mount('#app')
