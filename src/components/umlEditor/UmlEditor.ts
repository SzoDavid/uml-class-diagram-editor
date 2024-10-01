import {onMounted, ref} from 'vue';
import {EmitType, UmlEditorService, UmlEditorTool} from '../../utils/UmlEditorService.ts';
import {DataContext} from '../../utils/types.ts';
import ClassEditorPanel from '../classEditorPanel/ClassEditorPanel.vue';
import {Renderer} from '../../utils/renderer/Renderer.ts';
import {defaultRenderConfiguration} from '../../utils/renderer/RenderConfiguration.ts';
import {ANode} from '../../utils/nodes/ANode.ts';
import {ClassNode} from '../../utils/nodes/ClassNode.ts';
import {Property} from '../../utils/nodes/features/Property.ts';
import {Visibility} from '../../utils/nodes/types.ts';
import {MultiplicityRange} from '../../utils/nodes/features/MultiplicityRange.ts';
import {Operation} from '../../utils/nodes/features/Operation.ts';
import {Parameter} from '../../utils/nodes/features/Parameter.ts';

export default {
    components: {ClassEditorPanel},
    computed: {
        UmlEditorTool() {
            return UmlEditorTool;
        }
    },
    setup() {
        const umlCanvas = ref<HTMLCanvasElement | null>(null);
        const selectedNode = ref<ANode | null>(null);
        const data = ref<DataContext<ANode>>(null);
        const tool = ref<UmlEditorTool|null>(null);
        const scale = ref<number>(100);
        let editor: UmlEditorService;

        onMounted(() => {
            if (umlCanvas.value === null) {
                console.error('UmlEditorService can\'t be mounted');
                return;
            }

            const canvas = umlCanvas.value as HTMLCanvasElement;
            editor = new UmlEditorService(canvas, new Renderer(canvas, defaultRenderConfiguration));
            tool.value = editor.tool;

            window.addEventListener('keydown', onKeyPress);

            editor.emitter.on('mouseDown', (node: EmitType) => {
                if (!(node instanceof ANode) && node !== null) return;

                setSelectedNode(node);
            });

            editor.emitter.on('toolChange', (newTool: EmitType) => {
                if (newTool === null || typeof newTool === 'object' || !(newTool in UmlEditorTool)) return;

                tool.value = newTool;
            });

            editor.emitter.on('scaleChange', (newScale: EmitType) => {
                if (typeof newScale !== 'number') return;

                scale.value = Math.round(newScale * 100);
            });

            editor.addNode(new ClassNode('ClassA', 50, 50,
                                         [new Property('prop', 'type', Visibility.PUBLIC),
                                             new Property('prop2', 'type', Visibility.PUBLIC, false, new MultiplicityRange('*'), 'value', true)],
                                         [new Operation('operationA', [], Visibility.PRIVATE, 'string', new MultiplicityRange('*', 1))]));
            editor.addNode(new ClassNode('ClassB', 300, 200, [],
                                         [new Operation('operationB', [new Parameter('param', 'type')], Visibility.PROTECTED, 'string', new MultiplicityRange(5, 1))]));
        });

        const onSave = (data: DataContext<ANode>) => {
            if (selectedNode.value === null || data === null) {
                console.error('Cannot save: no selected node');
                return;
            }

            if (data.type === 'class' && selectedNode.value instanceof ClassNode && data.instance instanceof ClassNode) {
                selectedNode.value.copy(data.instance);

                editor.render();
                setSelectedNode(selectedNode.value);
                return;
            }

            console.error('Unknown or not matching node types');
        };

        const onScaleSet = () => {
            editor.scale = scale.value / 100;
        };

        const onScaleReset = () => {
            editor.resetScaling();
        };

        const setSelectedNode = (node: ANode | null) => {
            selectedNode.value = node;
            if (node === null) {
                data.value = null;
                return;
            }

            if (node instanceof ClassNode) {
                const classNode = node.clone();

                classNode.properties.forEach((property) => {
                    if (property.multiplicity !== null) return;
                    property.multiplicity = new MultiplicityRange(null);
                });

                classNode.operations.forEach((operation) => operation.params.forEach((param) => {
                    if (param.multiplicity !== null) return;
                    param.multiplicity = new MultiplicityRange(null);
                }));

                data.value = {
                    type: 'class',
                    instance: classNode
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
                case UmlEditorTool.REMOVE:
                    data.value = null;
                    break;}
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
                case 'c':
                    onToolSelected(UmlEditorTool.ADD_CLASS);
                    break;
                case 'r':
                    onToolSelected(UmlEditorTool.REMOVE);
                    break;
            }
        };

        return {
            umlCanvas,
            data,
            scale,
            tool,
            onSave,
            onToolSelected,
            onScaleSet,
            onScaleReset
        };
    }
};