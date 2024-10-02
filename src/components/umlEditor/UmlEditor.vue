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
      <canvas ref="umlCanvas" width="800" height="800"
              :class="{ 'canvas-edit': tool === UmlEditorTool.EDIT,
                        'canvas-move': tool === UmlEditorTool.MOVE }" />
    </div>

    <div id="editor" v-if="data !== null">
      <template v-if="data['type']==='class'">
        <!-- Because of type check it shouldn't have an error -->
        <ClassEditorPanel :classData="data" @save="onSave" />
      </template>
      <template v-if="data['type']==='editor'">
        <fieldset>
          <legend>Options</legend>
          <label for="gridSize">Grid size: </label>
          <select id="gridSize" v-model="data['instance']['gridSize']">
            <option :value="0">0</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </fieldset>
      </template>
    </div>
  </div>
  <div class="editor-footer">
    <input id="scale" type="number" v-model="scale">
    <button @click="onScaleSet">Set</button>
    <button @click="onScaleReset">Reset</button>
  </div>
</template>