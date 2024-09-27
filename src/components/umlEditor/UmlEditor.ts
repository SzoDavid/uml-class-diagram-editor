import {onMounted, ref} from 'vue';
import {EmitType, UmlEditorService, UmlEditorTool} from '../../utils/umlEditorService.ts';
import {ClassNode, MultiplicityRange, Node, Operation, Parameter, Property, Visibility,} from '../../utils/umlNodes.ts';

interface ClassNodeData {
    type: 'class';
    x: number;
    y: number;
    width: number;
    name: string;
    properties: Property[];
    operations: Operation[];
}

type DataContext = ClassNodeData | null;
type ClickContext = 'prop' | 'operation';

export default {
    computed: {
        Visibility() {
            return Visibility;
        },
        UmlEditorTool() {
            return UmlEditorTool;
        }
    },
    setup() {
        const umlCanvas = ref<HTMLCanvasElement | null>(null);
        const selectedNode = ref<Node | null>(null);
        const data = ref<DataContext>(null);
        const tool = ref<UmlEditorTool|null>(null);
        let editor: UmlEditorService;

        onMounted(() => {
            if (umlCanvas.value === null) {
                console.error('UmlEditorService can\'t be mounted');
                return;
            }

            const canvas = umlCanvas.value as HTMLCanvasElement;
            editor = new UmlEditorService(canvas);
            tool.value = editor.tool;

            window.addEventListener('keydown', onKeyPress);

            editor.emitter.on('mouseDown', (node: EmitType) => {
                if (!(node instanceof Node) && node !== null) return;

                setSelectedNode(node);
            });

            editor.emitter.on('toolChange', (newTool: EmitType) => {
                if (newTool === null || typeof newTool === 'object' || !(newTool in UmlEditorTool)) return;

                tool.value = newTool;
            });

            editor.addNode(new ClassNode('ClassA', 50, 50,
                                         [new Property('prop', 'type', Visibility.PUBLIC),
                                             new Property('prop2', 'value', Visibility.PUBLIC, false, new MultiplicityRange('*'))],
                                         [new Operation('operationA', [], Visibility.PRIVATE, 'string', new MultiplicityRange('*', 1))], 200));
            editor.addNode(new ClassNode('ClassB', 300, 200, [],
                                         [new Operation('operationB', [new Parameter('param', 'type')], Visibility.PROTECTED, 'string', new MultiplicityRange(5, 1))], 300));
        });

        const onSave = () => {
            if (selectedNode.value === null || data.value === null) {
                console.error('Cannot save: no selected node');
                return;
            }

            if (data.value.type === 'class' && selectedNode.value instanceof ClassNode) {
                selectedNode.value.name = data.value.name;
                selectedNode.value.width = data.value.width;
                selectedNode.value.x = data.value.x;
                selectedNode.value.y = data.value.y;
                selectedNode.value.properties = data.value.properties;
                selectedNode.value.operations = data.value.operations;
                editor.render();
                return;
            }

            console.error('Unknown or not matching node types');
        };

        const setSelectedNode = (node: Node | null) => {
            selectedNode.value = node;
            if (node === null) {
                data.value = null;
                return;
            }

            if (node instanceof ClassNode) {
                data.value = {
                    type: 'class',
                    x: node.x,
                    y: node.y,
                    width: node.width,
                    name: node.name,
                    properties: node.properties,
                    operations: node.operations
                };

                return;
            }
        };

        const onToolSelected = (tool: UmlEditorTool) => {
            editor.tool = tool;

            switch (tool) {
                case UmlEditorTool.EDIT:
                    setSelectedNode(editor.selectedNode);
                    break;
                case UmlEditorTool.MOVE:
                case UmlEditorTool.ADD_CLASS:
                    data.value = null;
                    break;}
        };

        const onAddClicked = (context: ClickContext) => {
            if (data.value === null || data.value.type !== 'class') return;

            switch (context) {
                case 'prop':
                    data.value.properties.push(new Property(''));
                    break;
                case 'operation':
                    data.value.operations.push(new Operation(''));
                    break;
            }
        };

        const onRemoveClicked = (context: ClickContext, index: string | number) => {
            if (typeof index !== 'number') return;

            if (data.value === null || data.value.type !== 'class') return;

            switch (context) {
                case 'prop':
                    data.value.properties.splice(index, 1);
                    break;
                case 'operation':
                    data.value.operations.splice(index, 1);
                    break;
            }
        };

        const onKeyPress = (event: KeyboardEvent) => {
            if (!event.ctrlKey) return;

            switch (event.key) {
                case 'm':
                    onToolSelected(UmlEditorTool.MOVE);
                    break;
                case 'e':
                    onToolSelected(UmlEditorTool.EDIT);
                    break;
            }
        };

        return {
            umlCanvas,
            data,
            tool,
            onSave,
            onToolSelected,
            onAddClicked,
            onRemoveClicked,
        };
    }
};