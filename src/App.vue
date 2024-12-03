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
  <v-app>
    <nav id="nav-bar">
      <v-toolbar density="compact">
        <button @click="switchLocale('en')">en</button>
        <button @click="switchLocale('hu')">hu</button>

        <RouterLink :to="{ name: 'editor', params: { locale: route.params.locale ?? 'en' } }">{{ t('editor') }}</RouterLink>
        <RouterLink :to="{ name: 'settings', params: { locale: route.params.locale ?? 'en' } }">{{ t('settings.title') }}</RouterLink>
      </v-toolbar>
    </nav>
    <RouterView />
  </v-app>
</template>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
}

#nav-bar {
  position: fixed; /* Make it stay on top of the content */
  top: 0;
  left: 0;
  width: 100%; /* Full width */
  z-index: 1000;
  background-color: black; /* TODO */
}

#nav-bar * {
  padding-left: 10px;
}
</style>
