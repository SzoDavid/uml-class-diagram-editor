<script lang="ts" src="./EnumerationEditorPanel.ts"/>
<style scoped src="./EnumerationEditorPanel.css" />

<template>
  <v-expansion-panel :title="t('appearance')">
    <v-expansion-panel-text>
      <v-text-field label="x" v-model="data.instance.x" type="number" density="comfortable" />
      <v-text-field label="y" v-model="data.instance.y" type="number" density="comfortable" />
    </v-expansion-panel-text>
  </v-expansion-panel>
  <v-expansion-panel :title="t('value', 2)">
    <v-expansion-panel-text>
      <div class="list-form">
        <template v-for="(_, index) in data.instance.values" :key="index">
          <v-text-field :label="`${t('value')} ${index + 1}`"
                        v-model="data.instance.values[index]"
                        :rules="[() => t(getError({parameter: 'values', index: index})) ?? true]"
                        density="comfortable"
                        type="text" />
          <v-btn class="rm-btn" density="comfortable" @click="removeValue(index)"
                 icon="mdi-close" rounded="0" />
        </template>
      </div>
      <v-btn density="compact" block @click="addValue" icon="mdi-plus" rounded="0"></v-btn>
    </v-expansion-panel-text>
  </v-expansion-panel>
  <v-btn block @click="onSave">{{ t("save") }}</v-btn>
</template>
