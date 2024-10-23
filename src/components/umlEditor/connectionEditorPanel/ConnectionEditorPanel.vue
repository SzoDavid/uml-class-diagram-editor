<script lang="ts" src="./ConnectionEditorPanel.ts" />
<style scoped src="./ConnectionEditorPanel.css" />

<template>
  <template v-if="data.instance instanceof ConnectionPoint">
    <fieldset>
      <legend class="capitalized">{{ t("appearance") }}</legend>
      <div class="grid-form">
        <label for="x">x</label>
        <input id="x" type="number" v-model="data.instance.x">

        <label for="y">y</label>
        <input id="y" type="number" v-model="data.instance.y">
      </div>
    </fieldset>
  </template>
  <template v-else-if="data.instance instanceof ConnectionPart">
    <fieldset>
      <legend class="capitalized">{{ t("detail", 2) }}</legend>
      <button @click="breakConnectionPart" class="capitalized">{{ t("add_breakpoint") }}</button>
    </fieldset>
  </template>
</template>