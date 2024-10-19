<script lang="ts" src="./UmlEditor.ts" />
<style scoped src="./UmlEditor.css" />

<template>
  <div class="editor-container">
    <div id="tools">
      <button @click="onToolSelected(UmlEditorTool.EDIT)" class="capitalized"
              :class="{ active: tool === UmlEditorTool.EDIT}">{{ t("edit") }}</button>
      <button @click="onToolSelected(UmlEditorTool.MOVE)" class="capitalized"
              :class="{ active: tool === UmlEditorTool.MOVE}">{{ t("move") }}</button>
      <button @click="onToolSelected(UmlEditorTool.ADD)" class="capitalized"
              :class="{ active: tool === UmlEditorTool.ADD}">{{ t("add") }}</button>
      <button @click="onToolSelected(UmlEditorTool.REMOVE)" class="capitalized"
              :class="{ active: tool === UmlEditorTool.REMOVE}">{{ t("remove") }}</button>
    </div>

    <div>
      <canvas ref="umlCanvas" width="800" height="800"
              :class="{ 'cursor-pointer': tool === UmlEditorTool.EDIT,
                        'cursor-move': tool === UmlEditorTool.MOVE,
                        'cursor-crosshair': tool === UmlEditorTool.ADD || tool === UmlEditorTool.REMOVE}" />
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

      <template v-if="data !== null && 'instance' in data && 'type' in data">
        <template v-if="data.type==='classifier'">
          <ClassifierEditorPanel :classifierData="data" @save="onSave" />
        </template>
        <template v-else-if="data.type==='primitive'">
          <PrimitiveEditorPanel :primitiveData="data" @save="onSave" />
        </template>
        <template v-else-if="data.type==='enumeration'">
          <EnumerationEditorPanel :enumerationData="data" @save="onSave" />
        </template>
        <template v-else-if="data.type==='comment'">
          <CommentEditorPanel :commentData="data" @save="onSave" />
        </template>
        <template v-else-if="data.type==='editor'">
          <fieldset>
            <legend class="capitalized">{{ t("option", 2) }}</legend>
            <div class="grid-form">
              <label for="gridSize" class="capitalized">{{ t("grid_size") }}</label>
              <select id="gridSize" v-model="data.instance.gridSize">
                <option :value="0">0</option>
                <option :value="25">25</option>
                <option :value="50">50</option>
              </select>
            </div>
          </fieldset>
        </template>
        <template v-else-if="data.type==='addOption'">
          <fieldset>
            <legend class="capitalized">{{ t("option", 2) }}</legend>
            <div class="grid-form">
              <label for="addOption" class="capitalized">{{ t("type") }}</label>
              <select id="addOption" v-model="data.instance.type">
                <option :value="NodeType.CLASS" selected>{{ t("node_types.class") }}</option>
                <option :value="NodeType.INTERFACE">{{ t("node_types.interface") }}</option>
                <option :value="NodeType.DATATYPE">{{ t("node_types.datatype") }}</option>
                <option :value="NodeType.PRIMITIVE">{{ t("node_types.primitive") }}</option>
                <option :value="NodeType.ENUMERATION">{{ t("node_types.enumeration") }}</option>
                <option :value="NodeType.COMMENT">{{ t("node_types.comment") }}</option>
                <option :value="NodeType.CONNECTION">{{ t("node_types.connection") }}</option>
              </select>

              <label for=keepAdding class="capitalized">{{ t("keep_adding") }}</label>
              <input id="keepAdding" type="checkbox" v-model="data.instance.keepAdding">
            </div>
          </fieldset>
        </template>
      </template>
    </div>
  </div>
</template>