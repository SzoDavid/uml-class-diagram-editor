<script lang="ts" src="./UmlEditor.ts" />
<style src="./UmlEditor.css" />

<template>
  <canvas ref="umlCanvas" width="800" height="600"  :class="{ 'canvas-edit': tool === UmlEditorTool.EDIT,
                                                              'canvas-move': tool === UmlEditorTool.MOVE }" />
  <div>
    <span>Tools: </span>
    <button v-on:click="onToolEditSelected" :class="{ active: tool === UmlEditorTool.EDIT}">Edit</button>
    <button v-on:click="onToolMoveSelected" :class="{ active: tool === UmlEditorTool.MOVE}">Move</button>
  </div>
  <div v-if="data !== null">
    <div v-if="data['type']==='class'">
      <p>Position</p>
      <label for="x">x: </label>
      <input id="x" type="number" v-model="data['x']"><br>

      <label for="y">y: </label>
      <input id="y" type="number" v-model="data['y']"><br>

      <label for="width">Width: </label>
      <input id="width" type="number" min="50" v-model="data['width']"><br>

      <p>Details</p>
      <label for="className">Class Name: </label>
      <input id="className" type="text" v-model="data['name']"/><br>

      <button v-on:click="onSave">Save</button>
    </div>
  </div>
</template>


