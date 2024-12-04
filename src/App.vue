<script setup lang="ts">
import {useRoute, useRouter} from 'vue-router';
import { version } from '../package.json';

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
        <v-toolbar-title><strong>UCDE</strong> <span style="font-size: small">v{{ version }}</span></v-toolbar-title>

        <RouterLink :to="{ name: 'editor', params: { locale: route.params.locale ?? 'en' } }" custom>
          <template #default="{ navigate }">
            <v-btn @click="navigate" rounded="xl">*filename*</v-btn>
          </template>
        </RouterLink>

        <v-spacer />

        <v-btn icon="mdi-content-save" density="comfortable"></v-btn>
        <v-btn icon="mdi-import" density="comfortable"></v-btn>

        <v-menu open-on-hover>
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-translate"
                   density="comfortable"
                   v-bind="props" />
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title @click="switchLocale('en')">en</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>
                <v-list-item-title @click="switchLocale('hu')">hu</v-list-item-title>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <RouterLink :to="{ name: 'settings', params: { locale: route.params.locale ?? 'en' } }" custom>
          <template #default="{ navigate }">
            <v-btn icon="mdi-cog" @click="navigate" density="comfortable" />
          </template>
        </RouterLink>
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

</style>
