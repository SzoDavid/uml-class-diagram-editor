import {defineComponent, ref, watch} from 'vue';
import {ErrorContext, NodeData} from '../../../utils/types.ts';
import {useI18n} from 'vue-i18n';
import {InvalidNodeParameterCause} from '../../../utils/nodes/types.ts';
import {CommentNode} from '../../../utils/nodes/CommentNode.ts';
import {findError} from '../../../utils/functions.ts';

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

        const getError = (context: ErrorContext) => {
            if (data.value === null || data.value.type !== 'comment') return '';

            return findError(errors, context);
        };

        const onSave = () => {
            emit('save', data.value);
        };

        return {
            t, data, onSave, getError
        };
    }
});