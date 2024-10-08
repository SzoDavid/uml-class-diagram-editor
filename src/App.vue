<script setup lang="ts">
import {useRoute, useRouter} from 'vue-router';
import {useI18n} from 'vue-i18n';

const { t } = useI18n();

// Get the current locale from the route
const route = useRoute();
const router = useRouter();

function switchLocale(locale: string) {
    if (route.params.locale) {
        router.push({ name: route.name as string, params: { ...route.params, locale } });
    }
}
</script>

<template>
  <nav>
    <button @click="switchLocale('en')">en</button>
    <button @click="switchLocale('hu')">hu</button>

    <RouterLink :to="{ name: 'editor', params: { locale: route.params.locale ?? 'en' } }">{{ t('editor') }}</RouterLink>
    <RouterLink :to="{ name: 'settings', params: { locale: route.params.locale ?? 'en' } }">{{ t('settings.title') }}</RouterLink>
  </nav>
  <RouterView />
</template>

<style scoped>
nav {
  margin-bottom: 15px;
}

nav * {
  margin-right: 10px;
}
</style>
