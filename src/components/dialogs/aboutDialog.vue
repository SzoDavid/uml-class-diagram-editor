<script setup lang="ts">
import {useI18n} from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <v-card :title="t('about.title')">
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="5">{{ t('about.created_by') }}:</v-col>
          <v-col>Szobonya Dávid</v-col>
        </v-row>
        <v-row>
          <v-col cols="5">{{ t('about.license') }}:</v-col>
          <v-col><a target="_blank" href="https://github.com/SzoDavid/uml-class-diagram-editor/blob/main/LICENSE">MIT</a></v-col>
        </v-row>
        <v-row>
          <v-col class="linkButton"><a target="_blank" href="https://github.com/SzoDavid/uml-class-diagram-editor"><v-icon icon="mdi-github" /><span>GitHub</span></a></v-col>
          <v-col class="linkButton"><a target="_blank" href="https://github.com/SzoDavid/uml-class-diagram-editor/wiki"><v-icon icon="mdi-book-open-blank-variant-outline" /><span>Wiki</span></a></v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.v-card {
  margin-bottom: 75%;
}

.v-container {
  width: 100%;
}

a {
  text-decoration: none;
}

.linkButton {
  margin: auto;
  text-align: center;
  width: 100%;
}

.linkButton span {
  margin-left: 10px;
  padding-top: 4px;
  vertical-align: middle;
}

</style>