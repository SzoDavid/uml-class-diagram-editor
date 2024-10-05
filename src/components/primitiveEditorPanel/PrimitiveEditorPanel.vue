<script lang="ts" src="./PrimitiveEditorPanel.ts"/>
<style scoped src="./PrimitiveEditorPanel.css" />

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
    <legend class="capitalized">{{ t("detail", 2) }}</legend>
    <div class="grid-form">
      <label for="className" class="capitalized">{{ t("name") }}</label>
      <input id="className" type="text" v-model="data.instance.name">
      <span v-if="getError({parameter: 'name'})" class="error capitalized" style="grid-column: span 2;">{{ t(getError({parameter: 'name'})) }}</span>
    </div>
  </fieldset>

  <button v-on:click="onSave" class="capitalized">{{ t("save") }}</button>
</template>

