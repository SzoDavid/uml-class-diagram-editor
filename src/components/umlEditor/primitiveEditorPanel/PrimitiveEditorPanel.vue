<script lang="ts" src="./PrimitiveEditorPanel.ts"/>
<style scoped src="./PrimitiveEditorPanel.css" />

<template>
  <v-expansion-panel :title="t('appearance')">
    <v-expansion-panel-text>
      <v-text-field label="x" v-model.number="data.instance.x" density="comfortable" type="number" />
      <v-text-field label="y" v-model.number="data.instance.y" density="comfortable" type="number" />
    </v-expansion-panel-text>
  </v-expansion-panel>
  <v-expansion-panel :title="t('detail', 2)">
    <v-expansion-panel-text>
      <v-text-field :label="t('name')"
                    v-model.trim="data.instance.name"
                    :rules="[() => getError({parameter: 'name'}) ?? true]"
                    density="comfortable"
                    type="text" />
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>
