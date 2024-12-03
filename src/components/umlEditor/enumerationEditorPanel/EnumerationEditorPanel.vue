<script lang="ts" src="./EnumerationEditorPanel.ts"/>
<style scoped src="./EnumerationEditorPanel.css" />

<template>
  <v-expansion-panel :title="t('appearance')">
    <v-expansion-panel-text>
      <v-text-field label="x" v-model="data.instance.x" type="number" />
      <v-text-field label="y" v-model="data.instance.y" type="number" />
    </v-expansion-panel-text>
  </v-expansion-panel>
  <v-expansion-panel :title="t('value', 2)">
    <v-expansion-panel-text>
      <div class="list-form">
        <template v-for="(_, index) in data.instance.values" :key="index">
          <v-text-field :label="`${t('value')} ${index + 1}`"
                        v-model="data.instance.values[index]"
                        :rules="[() => t(getError({parameter: 'values', index: index})) ?? true]"
                        type="text" />
          <v-btn @click="removeValue(index)"
                 icon="mdi-close" rounded="0" />
        </template>
      </div>
      <v-btn @click="addValue" icon="mdi-plus" rounded="0"></v-btn>
    </v-expansion-panel-text>
  </v-expansion-panel>
  <v-btn @click="onSave">{{ t("save") }}</v-btn>
</template>
