<script lang="ts" src="./UmlEditor.ts" />
<style scoped src="./UmlEditor.css" />

<template>
  <div class="editor-container">
    <div id="tools">
      <v-tooltip>
        {{ t("edit") }}
        <template v-slot:activator="{ props }">
          <v-btn @click="onToolSelected(UmlEditorTool.EDIT)"
                 :class="{ active: tool === UmlEditorTool.EDIT}"
                 v-bind="props"
                 icon="mdi-pencil" density="comfortable" rounded="0" />
        </template>
      </v-tooltip>

      <v-tooltip>
        {{ t("move") }}
        <template v-slot:activator="{ props }">
          <v-btn @click="onToolSelected(UmlEditorTool.MOVE)"
                 :class="{ active: tool === UmlEditorTool.MOVE}"
                 v-bind="props"
                 icon="mdi-cursor-move" density="comfortable" rounded="0" />
        </template>
      </v-tooltip>

      <v-tooltip>
        {{ t("add") }}
        <template v-slot:activator="{ props }">
          <v-btn @click="onToolSelected(UmlEditorTool.ADD)"
                 :class="{ active: tool === UmlEditorTool.ADD}"
                 v-bind="props"
                 icon="mdi-plus" density="comfortable" rounded="0" />
        </template>
      </v-tooltip>

      <v-tooltip>
        {{ t("remove") }}
        <template v-slot:activator="{ props }">
          <v-btn @click="onToolSelected(UmlEditorTool.REMOVE)"
                 :class="{ active: tool === UmlEditorTool.REMOVE}"
                 v-bind="props"
                 icon="mdi-delete" density="comfortable" rounded="0" />
        </template>
      </v-tooltip>
    </div>

    <div id="main-container">
      <div id="canvas" :style="{ flex: canvasWidth + 'px' }">
        <canvas ref="umlCanvas"
                :class="{ 'cursor-pointer': tool === UmlEditorTool.EDIT,
                          'cursor-move': tool === UmlEditorTool.MOVE,
                          'cursor-crosshair': tool === UmlEditorTool.ADD || tool === UmlEditorTool.REMOVE}" />
      </div>

      <div id="divider" @mousedown="startResize"></div>

      <div id="editor" :style="{ flex: editorWidth + 'px' }">
        <v-expansion-panels variant="accordion" multiple>
          <v-expansion-panel :title="t('navigation')">
            <v-expansion-panel-text>
              <v-text-field
                :label="t('scale')"
                v-model="scale"
                density="comfortable"
                type="number" />

              <div class="half-half-grid">
                <v-btn density="comfortable" @click="onScaleSet">{{ t('set') }}</v-btn>
                <v-btn density="comfortable" @click="onScaleReset">{{ t('reset') }}</v-btn>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>

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
            <template v-else-if="data.type==='connection'">
              <ConnectionEditorPanel :connectionData="data" @save="onSave" @render="requestRender" />
            </template>
            <template v-else-if="data.type==='editor'">
              <v-expansion-panel :title="t('option', 2)">
                <v-expansion-panel-text>
                  <v-select :label="t('grid_size')" v-model="data.instance.gridSize" density="comfortable" :items="[0, 25, 50]" />
                </v-expansion-panel-text>
              </v-expansion-panel>
            </template>
            <template v-else-if="data.type==='addOption'">
              <v-expansion-panel :title="t('option', 2)">
                <v-expansion-panel-text>
                  <v-select :label="t('type')" v-model="data.instance.type" density="comfortable" :items="[
                    { title: t('node_types.class'), value: NodeType.CLASS },
                    { title: t('node_types.interface'), value: NodeType.INTERFACE },
                    { title: t('node_types.datatype'), value: NodeType.DATATYPE },
                    { title: t('node_types.primitive'), value: NodeType.PRIMITIVE },
                    { title: t('node_types.enumeration'), value: NodeType.ENUMERATION },
                    { title: t('node_types.comment'), value: NodeType.COMMENT },
                    { title: t('node_types.connection.aggregation'), value: NodeType.AGGREGATION },
                    { title: t('node_types.connection.association'), value: NodeType.ASSOCIATION },
                    { title: t('node_types.connection.composition'), value: NodeType.COMPOSITION },
                    { title: t('node_types.connection.generalization'), value: NodeType.GENERALIZATION },
                  ]" />
                  <v-checkbox density="compact" :label="t('keep_adding')" v-model="data.instance.keepAdding" />
                </v-expansion-panel-text>
              </v-expansion-panel>
            </template>
          </template>
        </v-expansion-panels>
      </div>
    </div>
  </div>
</template>