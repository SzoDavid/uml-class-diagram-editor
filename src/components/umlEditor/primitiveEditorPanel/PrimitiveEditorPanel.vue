<script lang="ts" src="./PrimitiveEditorPanel.ts"/>
<style scoped src="./PrimitiveEditorPanel.css" />

<template>
  <v-expansion-panel :title="t('appearance')">
    <v-expansion-panel-text>
      <v-text-field label="x" v-model="data.instance.x" type="number" density="comfortable" />
      <v-text-field label="y" v-model="data.instance.y" type="number" density="comfortable" />
    </v-expansion-panel-text>
  </v-expansion-panel>
  <v-expansion-panel :title="t('detail', 2)">
    <v-expansion-panel-text>
      <v-text-field :label="t('name')"
                    v-model="data.instance.name"
                    :rules="[() => t(getError({parameter: 'name'})) ?? true]"
                    density="comfortable"
                    type="text" />
    </v-expansion-panel-text>
  </v-expansion-panel>
  <v-btn block @click="onSave">{{ t("save") }}</v-btn>
</template>
