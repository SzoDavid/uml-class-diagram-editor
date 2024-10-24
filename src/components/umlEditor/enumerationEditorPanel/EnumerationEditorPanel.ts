import {defineComponent, ref, watch} from 'vue';
import {ErrorContext, NodeData} from '../../../utils/types.ts';
import {useI18n} from 'vue-i18n';
import {InvalidNodeParameterCause} from '../../../utils/nodes/types.ts';
import {EnumerationNode} from '../../../utils/nodes/EnumerationNode.ts';
import {findError} from '../../../utils/functions.ts';

interface EnumerationEditorPanelProperties {
    enumerationData: NodeData<EnumerationNode>
}

interface EnumerationEditorPanelEmits {
    (e: 'save', data: NodeData<EnumerationNode>): void;
}

export default defineComponent({
    props: {
        enumerationData: {
            type: Object as () => NodeData<EnumerationNode>,
            required: true
        }
    },
    emits: ['save'],
    setup(props: EnumerationEditorPanelProperties, { emit }: { emit: EnumerationEditorPanelEmits }) {
        const { t } = useI18n();

        const data = ref<NodeData<EnumerationNode>>(props.enumerationData);

        let errors: InvalidNodeParameterCause[] = [];

        watch(
            () => props.enumerationData,
            (newData) => {
                data.value = newData;
            },
            { immediate: true }
        );

        watch(
            data,
            (value) => {
                if (!value) return;
                errors = value.instance.validate();
            },
            { immediate: true, deep: true }
        );

        const addValue = () => {
            data.value.instance.values.push('');
        };

        const removeValue = (index: number) => {
            data.value.instance.values.splice(index, 1);
        };

        const getError = (context: ErrorContext) => {
            if (data.value === null || data.value.type !== 'enumeration') return '';

            return findError(errors, context);
        };

        const onSave = () => {
            emit('save', data.value as NodeData<EnumerationNode>);
        };

        return {
            t, data,
            addValue,
            removeValue,
            onSave,
            getError
        };
    }
});