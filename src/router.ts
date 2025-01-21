import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router';
import i18n from './i18n.ts';

const routes: RouteRecordRaw[] = [
    { path: '/', redirect: '/uml-class-diagram-editor' },
    { path: '/uml-class-diagram-editor/:locale', children: [
        { path: '', name: 'editor', component: () => import('./components/umlEditor/UmlEditor.vue') },
        { path: 'settings', name: 'settings', component: () => import('./components/settings/settingsPage.vue') },
    ]},
    { path: '/:catchAll(.*)', redirect: '/' }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to, _, next) => {
    const chosenLocale = to.params.locale;
    const supportedLocales = ['en', 'hu'];

    if (typeof chosenLocale === 'string' && supportedLocales.includes(chosenLocale)) {
        i18n.global.locale.value = chosenLocale;
    } else {
        return next({ path: '/uml-class-diagram-editor/en' });
    }
    next();
});

export default router;