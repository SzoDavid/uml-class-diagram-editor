<script lang="ts" src="./ClassEditorPanel.ts" />

<template>
  <fieldset>
    <legend>Appearance</legend>
    <div class="grid-form">
      <label for="x">x: </label>
      <input id="x" type="number" v-model="data['x']">

      <label for="y">y: </label>
      <input id="y" type="number" v-model="data['y']">

      <label for="width">Width: </label>
      <input id="width" type="number" min="50" v-model="data['width']">
    </div>
  </fieldset>

  <fieldset>
    <legend>Details</legend>
    <div class="grid-form">
      <label for="className">Class Name: </label>
      <input id="className" type="text" v-model="data['name']">
    </div>

    <fieldset>
      <legend>Properties</legend>
      <div class="sep" v-for="(prop, index) in data['properties']" :key="index">
        <div class="grid-form">
          <label :for="`propVisibility${index}`">Visibility: </label>
          <select :id="`propVisibility${index}`" v-model="prop.visibility">
            <option :value="null">--</option>
            <option :value="Visibility.PUBLIC">Public (+)</option>
            <option :value="Visibility.PRIVATE">Private (-)</option>
            <option :value="Visibility.PROTECTED">Protected (#)</option>
            <option :value="Visibility.PACKAGE">Package (~)</option>
          </select>

          <label :for="`propName${index}`">Name: </label>
          <input :id="`propName${index}`" type="text" v-model="prop.name">

          <label :for="`propType${index}`">Type: </label>
          <input :id="`propType${index}`" type="text" v-model="prop.type">

          <label :for="`propDefault${index}`">Default value: </label>
          <input :id="`propDefault${index}`" type="text" v-model="prop.defaultValue">

          <label :for="`propDerived${index}`">Derived: </label>
          <input :type="`checkbox${index}`" id="propDerived" v-model="prop.isDerived">
        </div>

        <fieldset>
          <legend>Multiplicity</legend>
          <div class="grid-form">
            <label :for="`propMultiUpper${index}`">Upper: </label>
            <input :id="`propMultiUpper${index}`" type="text" v-model="prop.multiplicity.upper">

            <label :for="`propMultiLower${index}`">Lower: </label>
            <input :id="`propMultiLower${index}`" type="number" v-model="prop.multiplicity.lower">
          </div>
        </fieldset>

        <button class="rm" @click="onRemoveClicked('prop', index)">Remove</button>
      </div>
      <button @click="onAddClicked('prop')">Add</button>
    </fieldset>

    <fieldset>
      <legend>Operations</legend>
      <div class="sep" v-for="(operation, index) in data['operations']" :key="index">
        <div class="grid-form">
          <label :for="`operationVisibility${index}`">Visibility: </label>
          <select :id="`operationVisibility${index}`" v-model="operation.visibility">
            <option :value="null">--</option>
            <option :value="Visibility.PUBLIC">Public (+)</option>
            <option :value="Visibility.PRIVATE">Private (-)</option>
            <option :value="Visibility.PROTECTED">Protected (#)</option>
            <option :value="Visibility.PACKAGE">Package (~)</option>
          </select>

          <label :for="`operationName${index}`">Name: </label>
          <input :id="`operationName${index}`" type="text" v-model="operation.name">

          <label :for="`operationReturnType${index}`">Return type: </label>
          <input :id="`operationReturnType${index}`" type="text" v-model="operation.returnType">
        </div>

        <fieldset>
          <legend>Return multiplicity</legend>
          <div class="grid-form">
            <label :for="`returnMultiUpper${index}`">Upper: </label>
            <input :id="`returnMultiUpper${index}`" type="text" v-model="operation.returnMultiplicity.upper">

            <label :for="`returnMultiLower${index}`">Lower: </label>
            <input :id="`returnMultiLower${index}`" type="number" v-model="operation.returnMultiplicity.lower">
          </div>
        </fieldset>

        <fieldset>
          <legend>Parameters</legend>

          <div class="sep" v-for="(param, pIndex) in operation.params" :key="pIndex">
            <div class="grid-form">
              <label :for="`paramName${index}${pIndex}`">Name: </label>
              <input :id="`paramName${index}${pIndex}`" type="text" v-model="param.name">

              <label :for="`paramType${index}${pIndex}`">Type: </label>
              <input :id="`paramType${index}${pIndex}`" type="text" v-model="param.type">

              <label :for="`paramDefault${index}${pIndex}`">Default value: </label>
              <input :id="`paramDefault${index}${pIndex}`" type="text" v-model="param.defaultValue">

              <label :for="`paramDirection${index}${pIndex}`">Direction: </label>
              <select :id="`paramDirection${index}${pIndex}`" v-model="param.direction">
                <option :value="null">--</option>
                <option value="in">in</option>
                <option value="out">out</option>
                <option value="inout">inout</option>
              </select>

              <label :for="`paramProps${index}${pIndex}`">Properties: </label>
              <select multiple :id="`paramProps${index}${pIndex}`" v-model="param.properties">
                <option value="ordered">ordered</option>
                <option value="unordered">unordered</option>
                <option value="unique">unique</option>
                <option value="nonunique">nonunique</option>
                <option value="sequence">sequence</option>
              </select>
            </div>

            <fieldset>
              <legend>Multiplicity</legend>
              <div class="grid-form">
                <label :for="`paramMultiUpper${index}${pIndex}`">Upper: </label>
                <input :id="`paramMultiUpper${index}${pIndex}`" type="text" v-model="param.multiplicity.upper">

                <label :for="`paramMultiLower${index}${pIndex}`">Lower: </label>
                <input :id="`paramMultiLower${index}${pIndex}`" type="number" v-model="param.multiplicity.lower">
              </div>
            </fieldset>

            <button class="rm" @click="onRemoveClicked('param', pIndex, index)">Remove</button>
          </div>

          <button @click="onAddClicked('param', index)">Add</button>
        </fieldset>

        <button class="rm" @click="onRemoveClicked('operation', index)">Remove</button>
      </div>
      <button @click="onAddClicked('operation')">Add</button>
    </fieldset>
  </fieldset>

  <button v-on:click="onSave">Save</button>
</template>

<style scoped>

</style>