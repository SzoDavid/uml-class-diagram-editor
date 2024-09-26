<script lang="ts" src="./UmlEditor.ts" />

<template>
  <canvas ref="umlCanvas" width="800" height="600" />
  <div>
    <span>Tools: </span>
    <button v-on:click="onToolSelect" :class="{ active: tool === UmlEditorTool.SELECT}">Select</button>
    <button v-on:click="onToolMove" :class="{ active: tool === UmlEditorTool.MOVE}">Move</button>
  </div>
  <div v-if="data">
    <div v-if="data.type==='class'">
      <label for="className">Class Name: </label>
      <input id="className" type="text" v-model="data.name"/><br>

      <label for="width">Width: </label>
      <input id="width" type="number" min="50" v-model="data.width"><br>

      <button v-on:click="onSave">Save</button>
    </div>
  </div>
</template>

<style scoped>
  canvas {
    border: 1px solid black;
  }

  .active {
    background-color: gray;
  }
</style>
