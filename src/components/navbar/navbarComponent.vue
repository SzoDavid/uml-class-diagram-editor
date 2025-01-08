<script setup lang="ts">
import {useRoute, useRouter} from 'vue-router';
import { version } from '../../../package.json';
import {useI18n} from 'vue-i18n';
import RenameDialog from '../dialogs/renameDialog.vue';
import ImportDialog from '../dialogs/importDialog.vue';
import {inject, ref} from 'vue';
import {TriggerService} from '../../services/TriggerService.ts';
import ExportDialog from '../dialogs/exportDialog.vue';
import {saveFile, importFile} from '../../utils/IOUtils.ts';

const { t } = useI18n();
const triggerService: TriggerService | undefined = inject('triggerService');

// Get the current locale from the route
const route = useRoute();
const router = useRouter();

let fileName = ref(localStorage.getItem('name') ?? 'untitled.ucde');
let snackbar = ref(false);
let snackbarText = ref('');

function showSnackbar(message: string) {
    snackbarText.value = message;
    snackbar.value = true;
}

function switchLocale(locale: string) {
    if (route.params.locale) {
        router.push({ name: route.name as string, params: { ...route.params, locale } });
    }
}

function switchToEditor() {
    router.push({ name: 'editor', params: { locale: route.params.locale ?? 'en' }});
}

function onFileSave() {
    if (saveFile('file', 'render', fileName.value)) {
        showSnackbar(t('file_saved', {file: fileName}));
    } else {
        showSnackbar(t('nothing_to_save'));
    }
}

function saveName(name: string) {
    fileName.value = name;
    localStorage.setItem('name', fileName.value);
}

function onFileImport(file: File) {
    if (!file) {
        showSnackbar('No file has been uploaded!');
        return;
    }

    importFile(file, triggerService)
        .then(() => {
            fileName.value = file.name;
            showSnackbar('Successfully loaded file');
        })
        .catch((error) => {
            showSnackbar(error.toString());
        });
}

function newDiagram() {
    localStorage.setItem('file', '[]');
    localStorage.setItem('name', 'untitled.ucde');
    fileName.value = 'untitled.ucde';
    triggerService?.trigger('refreshEditor', []);
}

</script>

<template>
  <v-snackbar v-model="snackbar" :timeout="2000">
    {{ snackbarText }}

    <template v-slot:actions>
      <v-btn
        color="primary"
        variant="text"
        @click="snackbar = false">
        OK
      </v-btn>
    </template>
  </v-snackbar>

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
          <v-list-item @click="onFileSave" :title="t('save')" />
          <v-list-item :title="t('export_document')">
            <v-dialog activator="parent" max-width="340">
              <template v-slot:default="{ isActive }">
                <export-dialog @cancel="() => { isActive.value = false; }" />
              </template>
            </v-dialog>
          </v-list-item>
          <v-list-item @click="newDiagram" :title="t('new_diagram')" />
        </v-list>
      </v-menu>

      <v-spacer />

      <v-dialog max-width="340">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn icon="mdi-import" density="comfortable" v-bind="activatorProps" />
        </template>
        <template v-slot:default="{ isActive }">
          <import-dialog @submit="(file: File) => { onFileImport(file); isActive.value = false; }"
                         @cancel="() => { isActive.value = false; }" />
        </template>
      </v-dialog>


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
</template>

<style scoped>
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