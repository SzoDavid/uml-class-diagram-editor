<script lang="ts" src="./EnumerationEditorPanel.ts"/>
<style scoped src="./EnumerationEditorPanel.css" />

<template>
  <fieldset>
    <legend class="capitalized">{{ t("appearance") }}</legend>
    <div class="grid-form">
      <label for="x">x</label>
      <input id="x" type="number" v-model="data.instance.x">

      <label for="y">y</label>
      <input id="y" type="number" v-model="data.instance.y">
    </div>
  </fieldset>
  <fieldset>
    <legend class="capitalized">{{ t("value", 2) }}</legend>
    <div class="list-form">
      <template v-for="(_, index) in data.instance.values" :key="index">
        <input :id="`value${index}`" type="text" v-model="data.instance.values[index]">
        <button @click="removeValue(index)">-</button>
        <span v-if="getError({parameter: 'values', index: index})"
              class="error capitalized" style="grid-column: span 2;">
          {{ t(getError({parameter: 'values', index: index})) }}
        </span>
      </template>
    </div>
    <button @click="addValue" class="capitalized">{{ t("add") }}</button>
  </fieldset>

  <button @click="onSave" class="capitalized">{{ t("save") }}</button>
</template>