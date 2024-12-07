<script setup lang="ts">
import {useRoute, useRouter} from 'vue-router';
import { version } from '../package.json';
import {useI18n} from 'vue-i18n';
import { saveAs } from 'file-saver';
import RenameDialog from './components/dialogs/renameDialog.vue';

const { t } = useI18n();

// Get the current locale from the route
const route = useRoute();
const router = useRouter();

let fileName = localStorage.getItem('name') ?? 'untitled.ucde';

function switchLocale(locale: string) {
    if (route.params.locale) {
        router.push({ name: route.name as string, params: { ...route.params, locale } });
    }
}

function switchToEditor() {
    router.push({ name: 'editor', params: { locale: route.params.locale ?? 'en' }});
}

function saveFile() {
    const document = localStorage.getItem('file');

    if (!document) throw new Error('There is nothing to save');

    saveAs(new Blob([document], {type: 'text/json;charset=utf-8'}), fileName);
}

function saveName(name: string) {
    fileName = name;
    localStorage.setItem('name', fileName);
}
</script>

<template>
  <v-app>
    <nav id="nav-bar">
      <v-toolbar density="compact">
        <v-toolbar-title><strong>UCDE</strong> <span style="font-size: small">v{{ version }}</span></v-toolbar-title>

        <v-menu open-on-hover>
          <template v-slot:activator="{ props }">
            <v-btn @click="switchToEditor" v-bind="props" rounded="xl">{{ fileName }}</v-btn>
          </template>
          <v-list>
            <v-list-item :title="t('rename')">
              <v-dialog activator="parent" max-width="340">
                <template v-slot:default="{ isActive }">
                  <rename-dialog :name="fileName"
                                 @submit="(name) => { saveName(name); isActive.value = false; }"
                                 @cancel="() => { isActive.value = false; }" />
                </template>
              </v-dialog>
            </v-list-item>
            <v-list-item @click="saveFile" :title="t('save')" />
            <v-list-item :title="t('export_document')" />
          </v-list>
        </v-menu>

        <v-spacer />

        <v-btn icon="mdi-import" density="comfortable"></v-btn>

        <v-menu open-on-hover>
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-translate"
                   density="comfortable"
                   v-bind="props" />
          </template>
          <v-list>
            <v-list-item @click="switchLocale('en')" title="en" />
            <v-list-item @click="switchLocale('hu')" title="hu" />
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

.v-list-item:hover {
  background-color: #444;
  cursor: pointer;
}

</style>
