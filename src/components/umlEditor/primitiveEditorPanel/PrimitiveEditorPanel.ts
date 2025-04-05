import { defineComponent, ref, watch } from 'vue';
import { PrimitiveTypeNode } from '../../../utils/nodes/PrimitiveTypeNode.ts';
import { ErrorContext, NodeData } from '../../../utils/types.ts';
import { useI18n } from 'vue-i18n';
import { InvalidNodeParameterCause } from '../../../utils/nodes/types.ts';
import { findError } from '../../../utils/functions.ts';

interface PrimitiveEditorPanelProperties {
    primitiveData: NodeData<PrimitiveTypeNode>;
}

type PrimitiveEditorPanelEmits = (
    e: 'save',
    data: NodeData<PrimitiveTypeNode>,
) => void;

export default defineComponent({
    props: {
        primitiveData: {
            type: Object as () => NodeData<PrimitiveTypeNode>,
            required: true,
        },
    },
    emits: ['save'],
    setup(
        props: PrimitiveEditorPanelProperties,
        { emit }: { emit: PrimitiveEditorPanelEmits },
    ) {
        const { t } = useI18n();

        const data = ref<NodeData<PrimitiveTypeNode>>(props.primitiveData);

        let errors: InvalidNodeParameterCause[] = [];

        watch(
            () => props.primitiveData,
            (newData) => {
                data.value = newData;
            },
            { immediate: true },
        );

        watch(
            data,
            (value) => {
                if (!value) return;
                errors = value.instance.validate();
            },
            { immediate: true, deep: true },
        );

        const getError = (context: ErrorContext) => {
            if (data.value === null || data.value.type !== 'primitive')
                return null;

            const error = findError(errors, context);

            if (!error) return null;
            return t(error);
        };

        const onSave = () => {
            emit('save', data.value as NodeData<PrimitiveTypeNode>);
        };

        return {
            t,
            data,
            onSave,
            getError,
        };
    },
});
