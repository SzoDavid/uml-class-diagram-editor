<script lang="ts" src="./UmlEditor.ts" />
<style src="./UmlEditor.css" />

<template>
  <div class="editor-container">
    <div id="tools">
      <span>Tools: </span>
      <button @click="onToolSelected(UmlEditorTool.EDIT)"
              :class="{ active: tool === UmlEditorTool.EDIT}">Edit</button>
      <button @click="onToolSelected(UmlEditorTool.MOVE)"
              :class="{ active: tool === UmlEditorTool.MOVE}">Move</button>
      <button @click="onToolSelected(UmlEditorTool.ADD_CLASS)"
              :class="{ active: tool === UmlEditorTool.ADD_CLASS}">Add class</button>
    </div>

    <div>
      <canvas ref="umlCanvas" width="800" height="900"
              :class="{ 'canvas-edit': tool === UmlEditorTool.EDIT,
                        'canvas-move': tool === UmlEditorTool.MOVE }" />
    </div>

    <div id="editor" v-if="data !== null">
      <template v-if="data['type']==='class'">
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
            <div class="grid-form sep" v-for="(prop, index) in data['properties']" :key="prop.name">
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

              <button class="rm" @click="onRemoveClicked('prop', index)">Remove</button>
            </div>
            <button @click="onAddClicked('prop')">Add</button>
          </fieldset>

          <fieldset>
            <legend>Operations</legend>
            <div class="grid-form sep" v-for="(operation, index) in data['operations']" :key="operation.name">
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

              <button class="rm"  @click="onRemoveClicked('operation', index)">Remove</button>
            </div>
            <button @click="onAddClicked('operation')">Add</button>
          </fieldset>
        </fieldset>

        <button v-on:click="onSave">Save</button>
      </template>
    </div>
  </div>
</template>