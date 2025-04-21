<script lang="ts" src="./CommentEditorPanel.ts" />
<style scoped src="../EditorPanel.css" />

<template>
    <v-expansion-panel :title="t('appearance')">
        <v-expansion-panel-text>
            <div class="half-half-grid">
                <v-text-field
                    label="x"
                    v-model.number="data.instance.x"
                    density="comfortable"
                    type="number"
                    :step="gridSize"
                />
                <v-text-field
                    label="y"
                    v-model.number="data.instance.y"
                    density="comfortable"
                    type="number"
                    :step="gridSize"
                />
            </div>

            <v-text-field
                :label="t('width')"
                v-model.number="data.instance.width"
                type="number"
                density="comfortable"
                :step="gridSize"
            />
        </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel :title="t('detail', 2)">
        <v-expansion-panel-text>
            <v-textarea
                :label="t('node_types.comment')"
                v-model="data.instance.text"
                :rules="[() => getError({ parameter: 'text' }) ?? true]"
            />
        </v-expansion-panel-text>
    </v-expansion-panel>
</template>
