<script lang="ts" src="./ConnectionEditorPanel.ts" />
<style scoped src="./ConnectionEditorPanel.css" />

<template>
  <template v-if="data.instance instanceof BasicConnectionPoint">
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
  <fieldset>
    <legend class="capitalized">{{ t("detail", 2) }}</legend>
    <template v-if="data.instance instanceof ConnectionPart">
      <button @click="breakConnectionPart" class="capitalized">{{ t("add_breakpoint") }}</button>
    </template>
    <template v-else-if="data.instance instanceof Generalization">
      <div class="grid-form">
        <label for="reversed" class="capitalized">{{ t("reversed") }}</label>
        <input id="reversed" type="checkbox" v-model="data.instance.reversed">
      </div>
    </template>
    <template v-else-if="data.instance instanceof Association">
      <div class="grid-form">
        <label for="assName" class="capitalized">{{ t("name") }}</label>
        <input id="assName" type="text" v-model="data.instance.associationName">

        <label for="showOwnership" class="capitalized">{{ t("show_ownership") }}</label>
        <input id="showOwnership" type="checkbox" v-model="data.instance.showOwnership">

        <label for="reversedOwnership" class="capitalized">{{ t("reversed") }}</label>
        <input id="reversedOwnership" type="checkbox" v-model="data.instance.reversedOwnership">
      </div>
    </template>
  </fieldset>
  <button @click="onSave" class="capitalized">{{ t("save") }}</button>
</template>