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
      <div class="sep" v-for="(prop, index) in data['properties']" :key="prop.name">
        <div class="grid-form">
          <label for="propName">Name: </label>
          <input id="propName" type="text" v-model="prop.name">

          <label for="propType">Type: </label>
          <input id="propType" type="text" v-model="prop.type">

          <label for="propVisibility">Visibility: </label>
          <select id="propVisibility" v-model="prop.visibility">
            <option :value="null">--</option>
            <option :value="Visibility.PUBLIC">Public (+)</option>
            <option :value="Visibility.PRIVATE">Private (-)</option>
            <option :value="Visibility.PROTECTED">Protected (#)</option>
            <option :value="Visibility.PACKAGE">Package (~)</option>
          </select>

          <label for="propDefault">Default value: </label>
          <input id="propDefault" type="text" v-model="prop.defaultValue">

          <label for="propDerived">Derived: </label>
          <input type="checkbox" id="propDerived" v-model="prop.isDerived">
        </div>

        <button class="rm" @click="onRemoveClicked('prop', index)">Remove</button>
      </div>
      <button @click="onAddClicked('prop')">Add</button>
    </fieldset>

    <fieldset>
      <legend>Operations</legend>
      <div class="sep" v-for="(operation, index) in data['operations']" :key="operation.name">
        <div class="grid-form">
          <label for="operationName">Name: </label>
          <input id="operationName" type="text" v-model="operation.name">

          <label for="operationReturnType">Return type: </label>
          <input id="operationReturnType" type="text" v-model="operation.returnType">

          <label for="operationVisibility">Visibility: </label>
          <select id="operationVisibility" v-model="operation.visibility">
            <option :value="null">--</option>
            <option :value="Visibility.PUBLIC">Public (+)</option>
            <option :value="Visibility.PRIVATE">Private (-)</option>
            <option :value="Visibility.PROTECTED">Protected (#)</option>
            <option :value="Visibility.PACKAGE">Package (~)</option>
          </select>
        </div>

        <fieldset>
          <legend>Parameters</legend>

          <div class="sep" v-for="(param, pIndex) in operation.params" :key="param.name">
            <div class="grid-form">
              <label for="paramName">Name: </label>
              <input id="paramName" type="text" v-model="param.name">

              <label for="paramType">Type: </label>
              <input id="paramType" type="text" v-model="param.type">

              <label for="paramDefault">Default value: </label>
              <input id="paramDefault" type="text" v-model="param.defaultValue">

              <label for="paramDirection">Direction: </label>
              <select id="paramDirection" v-model="param.direction">
                <option :value="null">--</option>
                <option value="in">in</option>
                <option value="out">out</option>
                <option value="inout">inout</option>
              </select>

              <label for="paramProps">Properties: </label>
              <select multiple id="paramProps" v-model="param.properties">
                <option value="ordered">ordered</option>
                <option value="unordered">unordered</option>
                <option value="unique">unique</option>
                <option value="nonunique">nonunique</option>
                <option value="sequence">sequence</option>
              </select>
            </div>

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