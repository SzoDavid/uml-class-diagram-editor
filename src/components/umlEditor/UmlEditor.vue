<script lang="ts" src="./UmlEditor.ts" />
<style scoped src="./UmlEditor.css" />

<template>
  <div class="editor-container">
    <div id="tools">
      <button @click="onToolSelected(UmlEditorTool.EDIT)" class="capitalized"
              :class="{ active: tool === UmlEditorTool.EDIT}">{{ t("edit") }}</button>
      <button @click="onToolSelected(UmlEditorTool.MOVE)" class="capitalized"
              :class="{ active: tool === UmlEditorTool.MOVE}">{{ t("move") }}</button>
      <button @click="onToolSelected(UmlEditorTool.ADD_CLASS)" class="capitalized"
              :class="{ active: tool === UmlEditorTool.ADD_CLASS}">{{ t("add_class") }}</button>
      <button @click="onToolSelected(UmlEditorTool.REMOVE)" class="capitalized"
              :class="{ active: tool === UmlEditorTool.REMOVE}">{{ t("remove") }}</button>
    </div>

    <div>
      <canvas ref="umlCanvas" width="800" height="800"
              :class="{ 'canvas-edit': tool === UmlEditorTool.EDIT,
                        'canvas-move': tool === UmlEditorTool.MOVE }" />
    </div>

    <div id="editor">
      <fieldset>
        <legend class="capitalized">{{ t("navigation") }}</legend>

        <div class="grid-form" style="margin-bottom: 5px">
          <label for="scale" class="capitalized">{{ t("scale") }}</label>
          <input id="scale" type="number" v-model="scale">
        </div>
        <div class="half-half-grid">
          <button @click="onScaleSet" class="capitalized">{{ t("set") }}</button>
          <button @click="onScaleReset" class="capitalized">{{ t("reset") }}</button>
        </div>
      </fieldset>

      <template v-if="data !== null">
        <template v-if="data['type'] ==='classifier'">
          <!-- Because of type check it shouldn't have an error -->
          <ClassEditorPanel :classData="data" @save="onSave" />
        </template>
        <template v-if="data['type']==='editor'">
          <fieldset>
            <legend class="capitalized">{{ t("option", 2) }}</legend>
            <div class="grid-form">
              <label for="gridSize" class="capitalized">{{ t("grid_size") }}</label>
              <select id="gridSize" v-model="data['instance']['gridSize']">
                <option :value="0">0</option>
                <option :value="25">25</option>
                <option :value="50">50</option>
              </select>
            </div>
          </fieldset>
        </template>
      </template>
    </div>
  </div>
</template>