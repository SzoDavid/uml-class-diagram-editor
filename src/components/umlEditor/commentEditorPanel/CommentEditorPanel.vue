<script lang="ts" src="./CommentEditorPanel.ts"/>
<style scoped src="./CommentEditorPanel.css"/>

<template>
  <v-expansion-panel :title="t('appearance')">
    <v-expansion-panel-text>
      <v-text-field label="x" v-model="data.instance.x" type="number"></v-text-field>
      <v-text-field label="y" v-model="data.instance.y" type="number"></v-text-field>
      <v-text-field :label="t('width')" v-model="data.instance.width" type="number"></v-text-field>
    </v-expansion-panel-text>
  </v-expansion-panel>
  <v-expansion-panel :title="t('detail', 2)">
    <v-expansion-panel-text>
      <v-textarea :label="t('node_types.comment')" v-model="data.instance.text"></v-textarea>
      <span v-if="getError({parameter: 'text'})" class="error capitalized">{{ t(getError({parameter: 'text'})) }}</span>
    </v-expansion-panel-text>
  </v-expansion-panel>
  <v-btn @click="onSave">{{ t("save") }}</v-btn>
</template>