import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import i18n from './i18n.ts';

const routes: RouteRecordRaw[] = [
    { path: '/', redirect: '/en' },
    {
        path: '/:locale',
        children: [
            {
                path: '',
                name: 'editor',
                component: () => import('./components/umlEditor/UmlEditor.vue'),
            },
            {
                path: 'settings',
                name: 'settings',
                component: () =>
                    import('./components/settings/settingsPage.vue'),
            },
        ],
    },
    { path: '/:catchAll(.*)', redirect: '/en' },
];

const router = createRouter({
    history: createWebHashHistory('/uml-class-diagram-editor/'),
    routes,
});

router.beforeEach((to, _, next) => {
    const chosenLocale = to.params.locale;
    const supportedLocales = ['en', 'hu'];

    if (
        typeof chosenLocale === 'string' &&
        supportedLocales.includes(chosenLocale)
    ) {
        i18n.global.locale.value = chosenLocale;
    } else {
        return next({ path: '/en' });
    }
    next();
});

export default router;
