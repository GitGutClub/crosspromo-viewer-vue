import { createApp } from 'vue';
import App from './App.vue';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Создаем экземпляр Vuetify с компонентами и директивами
const vuetify = createVuetify({
  components,
  directives,
});

createApp(App).use(vuetify).mount('#app');
