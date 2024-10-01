import {
    ClassNode,
    InvalidNodeParameterCause,
    MultiplicityRange,
    Operation,
    Parameter,
    Property,
    Visibility
} from '../../utils/umlNodes.ts';
import {ClickContext, DataContext} from '../../utils/types.ts';
import {ref, watch, defineComponent} from 'vue';

interface ClassEditorPanelProperties {
    classData: DataContext<ClassNode>
}

interface ClassEditorPanelEmits {
    (e: 'save', data: DataContext<ClassNode>): void;
}

interface ErrorContext {
    parameter: string,
    index?: number|string,
    child?: ErrorContext
}

export default defineComponent({
    props: {
        classData: {
            type: Object as () => DataContext<ClassNode>,
            required: true,
        }
    },
    emits: ['save'],
    computed: {
        Visibility() {
            return Visibility;
        }
    },
    setup(props: ClassEditorPanelProperties, { emit }: { emit: ClassEditorPanelEmits}) {
        const data = ref<DataContext<ClassNode>>(null);
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
            if (data.value === null || data.value.type !== 'class') return null;

            return findError(errors, context);
        };

        const findError = (errors: InvalidNodeParameterCause[], context: ErrorContext): string|null => {
            let error;

            if (context.index !== undefined && typeof context.index === 'number') {
                error = errors.find(error =>
                    error.parameter === context.parameter
                    && error.index === context.index);
            } else {
                error = errors.find(error => error.parameter === context.parameter);
            }

            if (!error) return null;
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
            getError
        };
    }
});