<script setup lang="ts">
import {useI18n} from 'vue-i18n';

const { t } = useI18n();

const emit = defineEmits(['submit', 'cancel']);

let file: File;

</script>

<template>
  <v-card :title="t('import_file')">
    <v-card-text>
      <v-file-input accept=".ucde,text/json"
                    v-model="file"
                    :label="t('file_input')" />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="()=>{ emit('cancel'); }">{{ t('cancel') }}</v-btn>
      <v-btn color="primary" @click="()=>{ emit('submit', file); }">{{ t('import_file')}}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.v-card {
  margin-bottom: 75%;
}
</style>