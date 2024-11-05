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
    <template v-else-if="data.instance instanceof Association || data.instance instanceof Aggregation">
      <div v-if="data.instance instanceof Association" class="grid-form">
        <label for="assName" class="capitalized">{{ t("name") }}</label>
        <input id="assName" type="text" v-model="data.instance.associationName">

        <label for="showOwnership" class="capitalized">{{ t("show_ownership") }}</label>
        <input id="showOwnership" type="checkbox" v-model="data.instance.showOwnership">

        <label for="reversedOwnership" class="capitalized">{{ t("reversed") }}</label>
        <input id="reversedOwnership" type="checkbox" v-model="data.instance.reversedOwnership">
      </div>
      <fieldset>
        <legend class="capitalized">{{ t("start_point") }}</legend>

        <div class="grid-form">
          <label for="startName" class="capitalized">{{ t("name") }}</label>
          <input id="startName" type="text" v-model="data.instance['startName']">

          <template v-if="data.instance instanceof Aggregation">
            <label for="startShared" class="capitalized">{{ t("shared") }}</label>
            <input id="startShared" type="checkbox" v-model="data.instance.isStartShared">
          </template>

          <template v-if="data.instance instanceof Association">
            <label for="startNavigability" class="capitalized">{{ t("navigability.title") }}</label>
            <select id="startNavigability" v-model="data.instance.startNavigability">
              <option :value="AssociationNavigability.UNSPECIFIED">{{ t("navigability.unspecified") }}</option>
              <option :value="AssociationNavigability.NAVIGABLE">{{ t("navigability.navigable") }}</option>
              <option :value="AssociationNavigability.UNNAVIGABLE">{{ t("navigability.unnavigable") }}</option>
            </select>
          </template>
        </div>

        <fieldset>
          <legend class="capitalized">{{ t("multiplicity") }}</legend>
          <div class="grid-form">
            <label for="startMultiUpper" class="capitalized">{{ t("multiplicity_upper") }}</label>
            <input id="startMultiUpper" type="text" v-model="data.instance['startMultiplicity'].upper">

            <label for="startMultiLower" class="capitalized">{{ t("multiplicity_lower") }}</label>
            <input id="startMultiLower" type="number" v-model="data.instance['startMultiplicity'].lower">
          </div>
        </fieldset>
      </fieldset>
      <fieldset>
        <legend class="capitalized">{{ t("end_point") }}</legend>

        <div class="grid-form">
          <label for="endName" class="capitalized">{{ t("name") }}</label>
          <input id="endName" type="text" v-model="data.instance['endName']">

          <template v-if="data.instance instanceof Aggregation">
            <label for="endShared" class="capitalized">{{ t("shared") }}</label>
            <input id="endShared" type="checkbox" v-model="data.instance.isEndShared">
          </template>

          <template v-if="data.instance instanceof Association">
            <label for="endNavigability" class="capitalized">{{ t("navigability.title") }}</label>
            <select id="endNavigability" v-model="data.instance.endNavigability">
              <option :value="AssociationNavigability.UNSPECIFIED">{{ t("navigability.unspecified") }}</option>
              <option :value="AssociationNavigability.NAVIGABLE">{{ t("navigability.navigable") }}</option>
              <option :value="AssociationNavigability.UNNAVIGABLE">{{ t("navigability.unnavigable") }}</option>
            </select>
          </template>
        </div>

        <fieldset>
          <legend class="capitalized">{{ t("multiplicity") }}</legend>
          <div class="grid-form">
            <label for="endMultiUpper" class="capitalized">{{ t("multiplicity_upper") }}</label>
            <input id="endMultiUpper" type="text" v-model="data.instance['endMultiplicity'].upper">

            <label for="endMultiLower" class="capitalized">{{ t("multiplicity_lower") }}</label>
            <input id="endMultiLower" type="number" v-model="data.instance['endMultiplicity'].lower">
          </div>
        </fieldset>
      </fieldset>
    </template>
  </fieldset>
  <button @click="onSave" class="capitalized">{{ t("save") }}</button>
</template>