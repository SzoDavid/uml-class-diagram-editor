<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { AddConfig } from '../../../services/UmlEditorService.ts';
import NodeTypeLabel from '../../common/NodeTypeLabel.vue';
import { NodeType } from '../../../utils/nodes/types.ts';
import classImg from '@/assets/images/nodes/class.png';
import interfaceImg from '@/assets/images/nodes/interface.png';
import dataTypeImg from '@/assets/images/nodes/dataType.png';
import primitiveImg from '@/assets/images/nodes/primitive.png';
import enumerationImg from '@/assets/images/nodes/enumeration.png';
import commentImg from '@/assets/images/nodes/comment.png';
import aggregationImg from '@/assets/images/nodes/aggregation.png';
import associationImg from '@/assets/images/nodes/association.png';
import compositionImg from '@/assets/images/nodes/composition.png';
import generalizationImg from '@/assets/images/nodes/generalization.png';
import realizationImg from '@/assets/images/nodes/realization.png';
import usageImg from '@/assets/images/nodes/usage.png';

const props = defineProps<{ addConfig: AddConfig }>();
const { t } = useI18n();
const data = ref<AddConfig>(props.addConfig);

const types = [
    {
        label: 'node_types.class',
        value: NodeType.CLASS,
        imgSrc: classImg,
    },
    {
        label: 'node_types.interface',
        value: NodeType.INTERFACE,
        imgSrc: interfaceImg,
    },
    {
        label: 'node_types.datatype',
        value: NodeType.DATATYPE,
        imgSrc: dataTypeImg,
    },
    {
        label: 'node_types.primitive',
        value: NodeType.PRIMITIVE,
        imgSrc: primitiveImg,
    },
    {
        label: 'node_types.enumeration',
        value: NodeType.ENUMERATION,
        imgSrc: enumerationImg,
    },
    {
        label: 'node_types.comment',
        value: NodeType.COMMENT,
        imgSrc: commentImg,
    },
    {
        label: 'node_types.connection.aggregation',
        value: NodeType.AGGREGATION,
        imgSrc: aggregationImg,
    },
    {
        label: 'node_types.connection.association',
        value: NodeType.ASSOCIATION,
        imgSrc: associationImg,
    },
    {
        label: 'node_types.connection.composition',
        value: NodeType.COMPOSITION,
        imgSrc: compositionImg,
    },
    {
        label: 'node_types.connection.generalization',
        value: NodeType.GENERALIZATION,
        imgSrc: generalizationImg,
    },
    {
        label: 'node_types.connection.realization',
        value: NodeType.REALIZATION,
        imgSrc: realizationImg,
    },
    {
        label: 'node_types.connection.usage',
        value: NodeType.USAGE,
        imgSrc: usageImg,
    },
];
</script>

<template>
    <v-expansion-panel :title="t('option', 2)">
        <v-expansion-panel-text>
            <v-checkbox
                density="compact"
                :label="t('keep_adding')"
                v-model="data.keepAdding"
            />
            <div class="card-grid">
                <NodeTypeLabel
                    v-for="type in types"
                    :key="type.value"
                    :name="t(type.label)"
                    :isSelected="data.type === type.value"
                    :onclick="
                        () => {
                            data.type = type.value;
                        }
                    "
                    :imgSrc="<string>type.imgSrc"
                    class="card"
                />
            </div>
        </v-expansion-panel-text>
    </v-expansion-panel>
</template>

<style scoped src="../EditorPanel.css" />
<style scoped>
.card-grid {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
    justify-content: center;
}

.card {
    width: 125px;
}
</style>
