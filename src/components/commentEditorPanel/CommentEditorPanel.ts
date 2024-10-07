import {defineComponent, ref, watch} from 'vue';
import {ErrorContext, NodeData} from '../../utils/types.ts';
import {useI18n} from 'vue-i18n';
import {InvalidNodeParameterCause} from '../../utils/nodes/types.ts';
import {CommentNode} from '../../utils/nodes/CommentNode.ts';

interface CommentEditorPanelProperties {
    commentData: NodeData<CommentNode>
}

interface CommentEditorPanelEmits {
    (e: 'save', data: NodeData<CommentNode>): void;
}

export default defineComponent({
    props: {
        commentData: {
            type: Object as () => NodeData<CommentNode>,
            required: true
        }
    },
    emits: ['save'],
    setup(props: CommentEditorPanelProperties, { emit }: { emit: CommentEditorPanelEmits }) {
        const { t } = useI18n();

        const data = ref<NodeData<CommentNode>>(props.commentData);

        let errors: InvalidNodeParameterCause[] = [];

        watch(
            () => props.commentData,
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

        // TODO: resolve duplication
        const getError = (context: ErrorContext) => {
            if (data.value === null || data.value.type !== 'comment') return '';

            return findError(errors, context);
        };

        const findError = (errors: InvalidNodeParameterCause[], context: ErrorContext): string => {
            let error;

            if (context.index !== undefined && typeof context.index === 'number') {
                error = errors.find(error =>
                    error.parameter === context.parameter
                    && error.index === context.index);
            } else {
                error = errors.find(error => error.parameter === context.parameter);
            }

            if (!error) return '';
            if (context.child && error.context) return findError(error.context, context.child);

            return error.message;
        };

        const onSave = () => {
            emit('save', data.value);
        };

        return {
            t, data, onSave, getError
        };
    }
});