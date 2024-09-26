<script lang="ts" src="./UmlEditor.ts" />

<template>
  <canvas ref="umlCanvas" width="800" height="600" />
  <div v-if="data">
    <label for="className">Class Name:</label>
    <input id="className" type="text" v-model="data.name"/>
    <button v-on:click="onSave">Save</button>
  </div>
</template>

<style scoped>
  canvas {
    border: 1px solid black;
  }
</style>
