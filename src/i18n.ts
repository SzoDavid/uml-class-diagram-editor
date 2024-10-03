import { createI18n } from 'vue-i18n';


const modules = import.meta.glob('./locales/*.json', { eager: true });

console.log(modules);

const messages = Object.fromEntries(
    Object.entries(
        modules
    ).map(([key, value]) => {
        const locale = key.match(/\/([a-zA-Z]+)\.json$/i)?.[1];
        return [locale, value];
    })
);

console.log(messages);

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages
});

export default i18n;