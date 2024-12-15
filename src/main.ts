import {createApp} from 'vue';
import './style.css';
import App from './App.vue';
import i18n from './i18n';
import router from './router.ts';
import {createVuetify} from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import {createVueI18nAdapter} from 'vuetify/locale/adapters/vue-i18n';
import {useI18n} from 'vue-i18n';
import {TriggerService} from './services/TriggerService.ts';

const vuetify = createVuetify({
    components,
    directives,
    locale: {
        adapter: createVueI18nAdapter({ i18n, useI18n }),
    },
    theme: {
        defaultTheme: 'dark'
    },
    icons: {
        defaultSet: 'mdi'
    }
});

const app = createApp(App)
    .use(i18n)
    .use(router)
    .use(vuetify);

app.provide('triggerService', new TriggerService());
app.mount('#app');