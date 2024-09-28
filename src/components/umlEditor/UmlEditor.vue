<script lang="ts" src="./UmlEditor.ts" />
<style scoped src="./UmlEditor.css" />

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
      <button @click="onToolSelected(UmlEditorTool.REMOVE)"
              :class="{ active: tool === UmlEditorTool.REMOVE}">Remove</button>
    </div>

    <div>
      <canvas ref="umlCanvas" width="800" height="900"
              :class="{ 'canvas-edit': tool === UmlEditorTool.EDIT,
                        'canvas-move': tool === UmlEditorTool.MOVE }" />
    </div>

    <div id="editor" v-if="data !== null">
      <template v-if="data['type']==='class'">
        <ClassEditorPanel :classData="data" @save="onSave" />
      </template>
    </div>
  </div>
</template>