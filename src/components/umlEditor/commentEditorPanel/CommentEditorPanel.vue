<script lang="ts" src="./CommentEditorPanel.ts"/>
<style scoped src="./CommentEditorPanel.css"/>

<template>
  <v-expansion-panel :title="t('appearance')">
    <v-expansion-panel-text>
      <v-text-field label="x" v-model="data.instance.x" readonly density="comfortable" />
      <v-text-field label="y" v-model="data.instance.y" readonly density="comfortable" />
      <v-text-field :label="t('width')" v-model="data.instance.width" type="number" density="comfortable" />
    </v-expansion-panel-text>
  </v-expansion-panel>
  <v-expansion-panel :title="t('detail', 2)">
    <v-expansion-panel-text>
      <v-textarea :label="t('node_types.comment')"
                  v-model="data.instance.text"
                  :rules="[() => getError({parameter: 'text'}) ?? true]"/>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>
