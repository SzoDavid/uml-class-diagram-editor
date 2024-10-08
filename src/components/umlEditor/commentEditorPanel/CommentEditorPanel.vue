<script lang="ts" src="./CommentEditorPanel.ts"/>
<style scoped src="./CommentEditorPanel.css"/>

<template>
  <fieldset>
    <legend class="capitalized">{{ t("appearance") }}</legend>
    <div class="grid-form">
      <label for="x">x</label>
      <input id="x" type="number" v-model="data.instance.x">

      <label for="y">y</label>
      <input id="y" type="number" v-model="data.instance.y">

      <label for="width" class="capitalized">{{ t("width") }}</label>
      <input id="width" type="number" v-model="data.instance.width">
    </div>
  </fieldset>
  <fieldset>
    <legend class="capitalized">{{ t("detail", 2) }}</legend>
    <label for="text" class="capitalized">{{ t("node_types.comment") }}</label>
    <textarea id="text" type="text" v-model="data.instance.text"></textarea>
    <span v-if="getError({parameter: 'text'})" class="error capitalized">{{ t(getError({parameter: 'text'})) }}</span>
  </fieldset>

  <button @click="onSave" class="capitalized">{{ t("save") }}</button>
</template>