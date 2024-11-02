import {defineComponent, ref, watch} from 'vue';
import {ErrorContext, NodeData} from '../../../utils/types.ts';
import {useI18n} from 'vue-i18n';
import {InvalidNodeParameterCause} from '../../../utils/nodes/types.ts';
import {findError} from '../../../utils/functions.ts';
import {Connection} from '../../../utils/nodes/connection/Connection.ts';
import {ConnectionPart} from '../../../utils/nodes/connection/ConnectionPart.ts';
import {
    BasicConnectionPoint,
    ConnectionPoint
} from '../../../utils/nodes/connection/ConnectionPoint.ts';
import {Generalization} from '../../../utils/nodes/connection/Generalization.ts';

interface ConnectionEditorPanelProperties {
    connectionData: NodeData<Connection | ConnectionPart | ConnectionPoint>
}

interface ConnectionEditorPanelEmits {
    (e: 'save', data: NodeData<Connection | ConnectionPart | ConnectionPoint>): void;
    (e: 'render'): void;
}

export default defineComponent({
    computed: {
        Generalization() {
            return Generalization;
        },
        BasicConnectionPoint() {
            return BasicConnectionPoint;
        },
        ConnectionPart() {
            return ConnectionPart;
        }
    },
    props: {
        connectionData: {
            type: Object as () => NodeData<Connection | ConnectionPart | ConnectionPoint>,
            required: true
        }
    },
    emits: ['save', 'render'],
    setup(props: ConnectionEditorPanelProperties, { emit }: { emit: ConnectionEditorPanelEmits }) {
        const { t } = useI18n();

        const data = ref<NodeData<Connection | ConnectionPart | ConnectionPoint>>(props.connectionData);

        let errors: InvalidNodeParameterCause[] = [];

        watch(
            () => props.connectionData,
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

        const breakConnectionPart = () => {
            if (data.value === null || !(data.value.instance instanceof ConnectionPart)) {
                console.error('break connection part is called for invalid node', data.value);
                return;
            }

            try {
                data.value.instance.break();
            } catch (e) {
                console.error(e);
            }

            emit('render');
        };

        const getError = (context: ErrorContext) => {
            if (data.value === null || data.value.type !== 'connection') return '';

            return findError(errors, context);
        };
        const onSave = () => {
            emit('save', data.value as NodeData<Connection | ConnectionPart | ConnectionPoint>);
        };

        return {
            t, data, breakConnectionPart, onSave, getError
        };
    }
});