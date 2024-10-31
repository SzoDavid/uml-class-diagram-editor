<script lang="ts" src="./ConnectionEditorPanel.ts" />
<style scoped src="./ConnectionEditorPanel.css" />

<template>
  <template v-if="data.instance instanceof LooseConnectionPoint">
    <fieldset>
      <legend class="capitalized">{{ t("detail", 2) }}</legend>
      <div class="grid-form">
        <label for="type" class="capitalized">{{ t("type") }}</label>
        <select id="type" v-model="data.instance.type">
          <option :value="ConnectionType.NONE" selected>{{ t("connection_types.none") }}</option>
          <option :value="ConnectionType.ASSOCIATION">{{ t("connection_types.association") }}</option>
          <option :value="ConnectionType.GENERALIZATION">{{ t("connection_types.generalization") }}</option>
        </select>
      </div>
    </fieldset>
  </template>
  <template v-else-if="data.instance instanceof ConnectionPoint">
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

  <template v-if="!(data.instance instanceof ConnectionPart)">
    <button @click="onSave" class="capitalized">{{ t("save") }}</button>
  </template>
</template>