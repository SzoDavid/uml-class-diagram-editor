<script lang="ts" src="./EnumerationEditorPanel.ts"/>
<style scoped src="./EnumerationEditorPanel.css" />

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
  <v-expansion-panel :title="t('value', 2)">
    <v-expansion-panel-text>
      <div class="list-form">
        <template v-for="(_, index) in data.instance.values" :key="index">
          <v-text-field :label="`${t('value')} ${index + 1}`"
                        v-model.trim="data.instance.values[index]"
                        :rules="[() => getError({parameter: 'values', index: index}) ?? true]"
                        density="comfortable"
                        type="text" />
          <v-btn class="rm-btn" density="comfortable" @click="removeValue(index)"
                 icon="mdi-close" rounded="0" />
        </template>
      </div>
      <v-btn density="compact" block @click="addValue" icon="mdi-plus" rounded="0"></v-btn>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>
