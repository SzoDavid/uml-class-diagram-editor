import {ClickContext, ErrorContext, NodeData} from '../../../utils/types.ts';
import {ref, watch, defineComponent} from 'vue';
import {ClassNode, ClassStereotype} from '../../../utils/nodes/ClassNode.ts';
import {InvalidNodeParameterCause, Visibility} from '../../../utils/nodes/types.ts';
import {Property} from '../../../utils/nodes/features/Property.ts';
import {MultiplicityRange} from '../../../utils/nodes/features/MultiplicityRange.ts';
import {Operation} from '../../../utils/nodes/features/Operation.ts';
import {Parameter} from '../../../utils/nodes/features/Parameter.ts';
import {useI18n} from 'vue-i18n';
import {ClassifierNode} from '../../../utils/nodes/ClassifierNode.ts';
import {DataTypeNode} from '../../../utils/nodes/DataTypeNode.ts';
import {findError} from '../../../utils/functions.ts';

interface ClassifierEditorPanelProperties {
    classifierData: NodeData<ClassifierNode>
}

interface ClassifierEditorPanelEmits {
    (e: 'save', data: NodeData<ClassifierNode>): void;
}

export default defineComponent({
    props: {
        classifierData: {
            type: Object as () => NodeData<ClassNode>,
            required: true,
        }
    },
    emits: ['save'],
    computed: {
        DataTypeNode() {
            return DataTypeNode;
        },
        ClassNode() {
            return ClassNode;
        },
        ClassStereotype() {
            return ClassStereotype;
        },
        Visibility() {
            return Visibility;
        }
    },
    setup(props: ClassifierEditorPanelProperties, { emit }: { emit: ClassifierEditorPanelEmits}) {
        const { t } = useI18n();

        const data = ref<NodeData<ClassifierNode>>(props.classifierData);

        let errors: InvalidNodeParameterCause[] = [];

        watch(
            () => props.classifierData,
            (newClassifierData) => {
                data.value = newClassifierData;
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
            if (data.value === null || data.value.type !== 'classifier') return;

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

            if (data.value === null || data.value.type !== 'classifier') return;

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

            if (data.value === null || data.value.type !== 'classifier') return null;

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
            if (data.value === null || data.value.type !== 'classifier') return '';

            return findError(errors, context);
        };

        return {
            data,
            onSave,
            onAddClicked,
            onRemoveClicked,
            onCollapseClicked,
            getError,
            t
        };
    }
});