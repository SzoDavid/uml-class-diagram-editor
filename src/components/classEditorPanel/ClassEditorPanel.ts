import {Operation, Parameter, Property, Visibility} from '../../utils/umlNodes.ts';
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
                case 'prop':
                    data.value.properties.push(new Property(''));
                    break;
                case 'operation':
                    data.value.operations.push(new Operation(''));
                    break;
                case 'param':
                    if (typeof parentIndex !== 'number') return;
                    data.value.operations[parentIndex].params.push(new Parameter('', ''));
                    break;
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

        return {
            data,
            onSave,
            onAddClicked,
            onRemoveClicked
        };
    }
});