import { createI18n } from 'vue-i18n';

const messages = Object.fromEntries(
    Object.entries(
        import.meta.glob('./locales/*.json', { eager: true })
    ).map(([key, value]) => {
        const locale = key.match(/\/([a-zA-Z]+)\.json$/i)?.[1];
        return [locale, value];
    })
);

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages
});

export default i18n;