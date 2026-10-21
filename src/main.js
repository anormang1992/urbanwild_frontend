import { createApp } from 'vue'
import '@fontsource-variable/bricolage-grotesque/opsz.css'
import '@fontsource-variable/figtree'
import './styles/main.css'
import App from './App.vue'
import { createAppRouter } from './router.js'

createApp(App).use(createAppRouter()).mount('#app')
