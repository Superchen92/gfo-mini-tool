import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Loading } from 'quasar'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(Quasar, {
  plugins: {
    Loading,
  }, // import Quasar plugins and add here
})
app.use(router)

app.mount('#app')
