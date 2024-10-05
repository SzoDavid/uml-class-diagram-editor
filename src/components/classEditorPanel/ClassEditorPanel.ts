import {ClickContext, NodeData} from '../../utils/types.ts';
import {ref, watch, defineComponent} from 'vue';
import {ClassNode, ClassStereotype} from '../../utils/nodes/ClassNode.ts';
import {InvalidNodeParameterCause, Visibility} from '../../utils/nodes/types.ts';
import {Property} from '../../utils/nodes/features/Property.ts';
import {MultiplicityRange} from '../../utils/nodes/features/MultiplicityRange.ts';
import {Operation} from '../../utils/nodes/features/Operation.ts';
import {Parameter} from '../../utils/nodes/features/Parameter.ts';
import {useI18n} from 'vue-i18n';

interface ClassEditorPanelProperties {
    classData: NodeData<ClassNode>
}

interface ClassEditorPanelEmits {
    (e: 'save', data: NodeData<ClassNode>): void;
}

interface ErrorContext {
    parameter: string,
    index?: number|string,
    child?: ErrorContext
}

export default defineComponent({
    props: {
        classData: {
            type: Object as () => NodeData<ClassNode>,
            required: true,
        }
    },
    emits: ['save'],
    computed: {
        ClassStereotype() {
            return ClassStereotype;
        },
        Visibility() {
            return Visibility;
        }
    },
    setup(props: ClassEditorPanelProperties, { emit }: { emit: ClassEditorPanelEmits}) {
        const { t } = useI18n();

        const data = ref<NodeData<ClassNode>>(props.classData);
        const renderKey = ref<number>(0);

        let errors: InvalidNodeParameterCause[] = [];

        watch(
            () => props.classData,
            (newClassData) => {
                data.value = newClassData;
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

        const onSave = () => {
            emit('save', data.value);
        };

        const onAddClicked = (context: ClickContext, parentIndex: string | number = '') => {
            if (data.value === null || data.value.type !== 'class') return;

            switch (context) {
                case 'prop': {
                    const prop = new Property('');
                    prop.multiplicity = new MultiplicityRange(null);
                    data.value.instance.properties.push(prop);
                    break;
                }
                case 'operation': {
                    const operation = new Operation('');
                    operation.returnMultiplicity = new MultiplicityRange(null);
                    data.value.instance.operations.push(operation);
                    break;
                }
                case 'param': {
                    if (typeof parentIndex !== 'number') return;

                    const param = new Parameter('', '');
                    param.multiplicity = new MultiplicityRange(null);
                    data.value.instance.operations[parentIndex].params.push(param);
                    break;
                }
            }
        };

        const onRemoveClicked = (context: ClickContext, index: string | number, parentIndex: string | number = '') => {
            if (typeof index !== 'number') return;

            if (data.value === null || data.value.type !== 'class') return;

            switch (context) {
                case 'prop':
                    data.value.instance.properties.splice(index, 1);
                    break;
                case 'operation':
                    data.value.instance.operations.splice(index, 1);
                    break;
                case 'param':
                    if (typeof parentIndex !== 'number') return;
                    data.value.instance.operations[parentIndex].params.splice(index, 1);
                    break;
            }
        };

        const onCollapseClicked = (context: ClickContext, index: string|number, parentIndex: string|number = '') => {
            if (typeof index !== 'number') return null;

            if (data.value === null || data.value.type !== 'class') return null;

            let element = null;
            switch (context) {
                case 'prop':
                    element = document.getElementById(`property${index}`);
                    break;
                case 'operation':
                    element = document.getElementById(`operation${index}`);
                    break;
                case 'param':
                    if (typeof parentIndex !== 'number') return;
                    element = document.getElementById(`parameter${parentIndex}${index}`);
                    break;
            }

            if (element) {
                element.classList.toggle('collapsed');
            }
        };

        const getError = (context: ErrorContext) => {
            if (data.value === null || data.value.type !== 'class') return '';

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

        return {
            data,
            renderKey,
            onSave,
            onAddClicked,
            onRemoveClicked,
            onCollapseClicked,
            getError,
            t
        };
    }
});