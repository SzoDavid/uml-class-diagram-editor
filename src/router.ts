import { createRouter, createWebHistory } from 'vue-router';
import i18n from './i18n.ts';

const routes = [
    { path: '/:locale', children: [
        { path: '', name: 'editor', component: () => import('./components/umlEditor/UmlEditor.vue') },
        { path: 'settings', name: 'settings', component: () => import('./components/settings/settingsPage.vue') },
    ]}
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, _, next) => {
    const chosenLocale = to.params.locale;
    const supportedLocales = ['en', 'hu'];

    if (typeof chosenLocale === 'string' && supportedLocales.includes(chosenLocale)) {
        i18n.global.locale.value = chosenLocale;
    } else {
        return next({ path: '/en' });
    }
    next();
});

export default router;