<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import { SerializationRegistryService } from '../../services/SerializationRegistryService.ts';
import { Node } from '../../utils/nodes/Node.ts';
import { PositionalNode } from '../../utils/nodes/PositionalNode.ts';
import { useSettingsService } from '../../services/SettingsService.ts';
import { UmlEditorService } from '../../services/UmlEditorService.ts';
import { Renderer } from '../../services/renderer/Renderer.ts';
import { Connection } from '../../utils/nodes/connection/Connection.ts';
import { BasicConnectionPoint } from '../../utils/nodes/connection/ConnectionPoint.ts';

const { t } = useI18n();
const emit = defineEmits(['cancel']);

const exportMethod = ref('png');
const imageMarginSize = ref(10);

function exportToImage() {
    const { settings } = useSettingsService();

    const save = localStorage.getItem('file');

    if (!save) throw Error('nothing to export');
    const nodes = SerializationRegistryService.batchDeserialize<Node>(
        JSON.parse(save),
    );

    let topEdge = Number.POSITIVE_INFINITY;
    let leftEdge = Number.POSITIVE_INFINITY;
    let bottomEdge = Number.NEGATIVE_INFINITY;
    let rightEdge = Number.NEGATIVE_INFINITY;

    for (const node of nodes) {
        if (node instanceof PositionalNode) {
            if (node.x < leftEdge) leftEdge = node.x;
            if (node.y < topEdge) topEdge = node.y;
            if (node.x + node.width > rightEdge)
                rightEdge = node.x + node.width;
            if (node.y + node.height > bottomEdge)
                bottomEdge = node.y + node.height;
        } else if (node instanceof Connection) {
            for (const point of node.points) {
                if (!(point instanceof BasicConnectionPoint)) continue;

                if (point.x < leftEdge) leftEdge = point.x;
                if (point.y < topEdge) topEdge = point.y;
                if (point.x > rightEdge) rightEdge = point.x;
                if (point.y > bottomEdge) bottomEdge = point.y;
            }
        }
    }

    for (const node of nodes) {
        if (node instanceof PositionalNode) {
            node.x -= leftEdge - imageMarginSize.value;
            node.y -= topEdge - imageMarginSize.value;
        } else if (node instanceof Connection) {
            for (const point of node.points) {
                if (!(point instanceof BasicConnectionPoint)) continue;

                point.x -= leftEdge - imageMarginSize.value;
                point.y -= topEdge - imageMarginSize.value;
            }
        }
    }

    const canvas = document.createElement('canvas');
    canvas.setAttribute(
        'width',
        String(rightEdge - leftEdge + 2 * imageMarginSize.value),
    );
    canvas.setAttribute(
        'height',
        String(bottomEdge - topEdge + 2 * imageMarginSize.value),
    );

    const editor = new UmlEditorService(
        canvas,
        new Renderer(canvas, settings.renderer),
        true,
    );
    editor.nodes = nodes;

    window.open(canvas.toDataURL('image/png'), '_blank');
    emit('cancel');
}

function exportDiagram() {
    switch (exportMethod.value) {
        case 'png':
            exportToImage();
    }
}
</script>

<template>
    <v-card :title="t('export_document')">
        <v-card-text>
            <v-select
                :label="t('export_method')"
                v-model="exportMethod"
                density="comfortable"
                :items="[{ title: 'PNG', value: 'png' }]"
            />

            <template v-if="exportMethod === 'png'">
                <v-text-field
                    :label="t('image_margin_size')"
                    v-model.number="imageMarginSize"
                    density="comfortable"
                    type="number"
                />
            </template>
        </v-card-text>
        <v-card-actions>
            <v-spacer />
            <v-btn
                @click="
                    () => {
                        emit('cancel');
                    }
                "
            >
                {{ t('cancel') }}
            </v-btn>
            <v-btn @click="exportDiagram" color="primary">
                {{ t('export_document') }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<style scoped>
.v-card {
    margin-bottom: 75%;
}
</style>
