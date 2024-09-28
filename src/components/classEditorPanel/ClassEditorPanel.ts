import {MultiplicityRange, Operation, Parameter, Property, Visibility} from '../../utils/umlNodes.ts';
import {ClickContext, DataContext} from '../../utils/types.ts';
import {ref, watch, defineComponent} from 'vue';

interface ClassEditorPanelProperties {
    classData: DataContext
}

interface ClassEditorPanelEmits {
    (e: 'save', data: DataContext): void;
}

export default defineComponent({
    props: {
        classData: {
            type: Object as () => DataContext,
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
        const data = ref<DataContext>(null);
        const renderKey = ref<number>(0);

        watch(
            () => props.classData,
            (newClassData) => {
                data.value = newClassData;
            },
            { immediate: true }
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
                    data.value.properties.push(prop);
                    break;
                }
                case 'operation': {
                    const operation = new Operation('');
                    operation.returnMultiplicity = new MultiplicityRange(null);
                    data.value.operations.push(operation);
                    break;
                }
                case 'param': {
                    if (typeof parentIndex !== 'number') return;

                    const param = new Parameter('', '');
                    param.multiplicity = new MultiplicityRange(null);
                    data.value.operations[parentIndex].params.push(param);
                    break;
                }
            }
        };

        const onRemoveClicked = (context: ClickContext, index: string | number, parentIndex: string | number = '') => {
            if (typeof index !== 'number') return;

            if (data.value === null || data.value.type !== 'class') return;

            switch (context) {
                case 'prop':
                    data.value.properties.splice(index, 1);
                    break;
                case 'operation':
                    data.value.operations.splice(index, 1);
                    break;
                case 'param':
                    if (typeof parentIndex !== 'number') return;
                    data.value.operations[parentIndex].params.splice(index, 1);
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

        //TODO: refactor for proper nesting
        const getError = (parameter: string, index: string|number = '', subParameter: string = '') => {
            if (data.value === null || data.value.type !== 'class') return null;

            if (typeof index !== 'number') {
                const error = data.value.errors.find(error => error.parameter === parameter);
                return error ? error.message : null;
            }

            if (subParameter === '') {
                const error = data.value.errors.find(error => error.parameter === parameter && error.index === index);
                return error ? error.message : null;
            }

            const error = data.value.errors.find(error => error.parameter === parameter && error.index === index);
            return error ? error.context?.find(ctxError => ctxError.parameter === subParameter)?.message : null;
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