import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import axios from 'axios'


axios.defaults.baseURL = "https://urbanwild-api.herokuapp.com/"
// axios.defaults.baseURL = "http://127.0.0.1:8004/"

createApp(App).use(router, axios).mount('#app')
