import {onMounted, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import ClassifierEditorPanel from './classifierEditorPanel/ClassifierEditorPanel.vue';
import CommentEditorPanel from './commentEditorPanel/CommentEditorPanel.vue';
import ConnectionEditorPanel from './connectionEditorPanel/ConnectionEditorPanel.vue';
import EnumerationEditorPanel from './enumerationEditorPanel/EnumerationEditorPanel.vue';
import PrimitiveEditorPanel from './primitiveEditorPanel/PrimitiveEditorPanel.vue';
import {useSettingsService} from '../../services/SettingsService.ts';
import {EmitType, UmlEditorService, UmlEditorTool} from '../../services/UmlEditorService.ts';
import {DataContext} from '../../utils/types.ts';
import {Renderer} from '../../services/renderer/Renderer.ts';
import {Node} from '../../utils/nodes/Node.ts';
import {ClassNode} from '../../utils/nodes/classifier/ClassNode.ts';
import {Property} from '../../utils/nodes/features/Property.ts';
import {NodeType, Visibility} from '../../utils/nodes/types.ts';
import {MultiplicityRange} from '../../utils/nodes/features/MultiplicityRange.ts';
import {Operation} from '../../utils/nodes/features/Operation.ts';
import {Parameter} from '../../utils/nodes/features/Parameter.ts';
import {ClassifierNode} from '../../utils/nodes/classifier/ClassifierNode.ts';
import {InterfaceNode} from '../../utils/nodes/classifier/InterfaceNode.ts';
import {DataTypeNode} from '../../utils/nodes/classifier/DataTypeNode.ts';
import {PrimitiveTypeNode} from '../../utils/nodes/PrimitiveTypeNode.ts';
import {EnumerationNode} from '../../utils/nodes/EnumerationNode.ts';
import {CommentNode} from '../../utils/nodes/CommentNode.ts';
import {Connection} from '../../utils/nodes/connection/Connection.ts';
import {
    BasicConnectionPoint,
    ConnectionPoint,
    LooseConnectionPoint
} from '../../utils/nodes/connection/ConnectionPoint.ts';
import {ConnectionPart} from '../../utils/nodes/connection/ConnectionPart.ts';
import {Generalization} from '../../utils/nodes/connection/Generalization.ts';
import {Association} from '../../utils/nodes/connection/Association.ts';
import {Aggregation} from '../../utils/nodes/connection/Aggregation.ts';
import {Composition} from '../../utils/nodes/connection/Composition.ts';
import {SerializationRegistryService} from '../../services/SerializationRegistryService.ts';


export default {
    components: {
        ConnectionEditorPanel,
        CommentEditorPanel,
        EnumerationEditorPanel,
        ClassifierEditorPanel,
        PrimitiveEditorPanel
    },
    computed: {
        NodeType() {
            return NodeType;
        },
        UmlEditorTool() {
            return UmlEditorTool;
        }
    },
    setup() {
        const { t } = useI18n();
        const { settings } = useSettingsService();

        const umlCanvas = ref<HTMLCanvasElement | null>(null);
        const selectedNode = ref<Node | null>(null);
        const data = ref<DataContext<Node>>(null);
        const tool = ref<UmlEditorTool|null>(null);
        const scale = ref<number>(100);
        const canvasWidth = ref(1100);
        const editorWidth = ref(100);
        const isResizing = ref(false);
        let editor: UmlEditorService;

        onMounted(() => {
            if (umlCanvas.value === null) {
                console.error('UmlEditorService can\'t be mounted');
                return;
            }

            const save = localStorage.getItem('file');

            const canvas = umlCanvas.value as HTMLCanvasElement;
            editor = new UmlEditorService(canvas, new Renderer(canvas, settings.renderer));
            tool.value = editor.tool;

            window.addEventListener('resize', () => resizeCanvas(canvas));
            resizeCanvas(canvas);

            window.addEventListener('keydown', onKeyPress);

            editor.emitter.on('mouseDown', (node: EmitType) => {
                if (!(node instanceof Node) && node !== null) return;

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

            if (save) {
                const deserializable = JSON.parse(save);
                editor.nodes = SerializationRegistryService.batchDeserialize<Node>(deserializable);
            } else {
                editor.addNode(new ClassNode('ClassA', 50, 50,
                                             [new Property('prop', 'type', Visibility.PUBLIC),
                                                 new Property('prop2', 'type', Visibility.PUBLIC, false, new MultiplicityRange('*'), 'value', true)],
                                             [new Operation('operationA', [new Parameter('param', 'type')], Visibility.PRIVATE, 'string', new MultiplicityRange('*', 1))]));
                editor.addNode(new InterfaceNode('InterfaceB', 400, 200, [], [new Operation('operationB', [new Parameter('param', 'type')])]));
                editor.addNode(new EnumerationNode('EnumerationC', 70, 250, ['VALUE_A', 'VALUE_B']));
            }
        });

        const resizeCanvas = (canvas: HTMLCanvasElement) => {
            const container = canvas.parentElement!;
            const { width, height } = container.getBoundingClientRect();
            const scale = window.devicePixelRatio || 1;

            if (canvas.width !== width * scale || canvas.height !== height * scale) {
                canvas.width = width * scale;
                canvas.height = height * scale;

                const ctx = canvas.getContext('2d');
                ctx?.scale(scale, scale);

                editor.render();
            }
        };

        const startResize = (event: MouseEvent) => {
            isResizing.value = true;
            const startX = event.clientX;
            const startCanvasWidth = canvasWidth.value;
            const startEditorWidth = editorWidth.value;

            const onMouseMove = (moveEvent: MouseEvent) => {
                if (isResizing.value) {
                    if (umlCanvas.value === null) {
                        console.error('UmlEditorService can\'t be mounted');
                        return;
                    }

                    const delta = moveEvent.clientX - startX;
                    canvasWidth.value = Math.max(200, startCanvasWidth + delta);
                    editorWidth.value = Math.max(200, startEditorWidth - delta);

                    resizeCanvas(umlCanvas.value);
                }
            };

            const onMouseUp = () => {
                isResizing.value = false;
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
            };

            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        };

        const onSave = (data: DataContext<Node>) => {
            if (selectedNode.value === null || data === null) {
                console.error('Cannot save: no selected node');
                return;
            }

            if ((data.type === 'classifier' && selectedNode.value instanceof ClassifierNode) ||
                (data.type === 'primitive' && selectedNode.value instanceof PrimitiveTypeNode) ||
                (data.type === 'comment' && selectedNode.value instanceof CommentNode) ||
                (data.type === 'connection' && (selectedNode.value instanceof Connection || selectedNode.value instanceof ConnectionPart || selectedNode.value instanceof ConnectionPoint)) ||
                (data.type === 'enumeration' && selectedNode.value instanceof EnumerationNode)) {

                //TODO: cry
                if (selectedNode.value instanceof ClassNode && data.instance instanceof ClassNode) {
                    selectedNode.value.copy(data.instance);
                } else if (selectedNode.value instanceof InterfaceNode && data.instance instanceof InterfaceNode) {
                    selectedNode.value.copy(data.instance);
                } else if (selectedNode.value instanceof DataTypeNode && data.instance instanceof DataTypeNode) {
                    selectedNode.value.copy(data.instance);
                } else if (selectedNode.value instanceof PrimitiveTypeNode && data.instance instanceof PrimitiveTypeNode) {
                    selectedNode.value.copy(data.instance);
                } else if (selectedNode.value instanceof EnumerationNode && data.instance instanceof EnumerationNode) {
                    selectedNode.value.copy(data.instance);
                } else if (selectedNode.value instanceof CommentNode && data.instance instanceof CommentNode) {
                    selectedNode.value.copy(data.instance);
                } else if (selectedNode.value instanceof Aggregation && data.instance instanceof Aggregation) {
                    selectedNode.value.copy(data.instance);
                } else if (selectedNode.value instanceof Association && data.instance instanceof Association) {
                    selectedNode.value.copy(data.instance);
                } else if (selectedNode.value instanceof Composition && data.instance instanceof Composition) {
                    selectedNode.value.copy(data.instance);
                } else if (selectedNode.value instanceof Generalization && data.instance instanceof Generalization) {
                    selectedNode.value.copy(data.instance);
                } else if (selectedNode.value instanceof ConnectionPart && data.instance instanceof ConnectionPart) {
                    selectedNode.value.copy(data.instance);
                } else if (selectedNode.value instanceof LooseConnectionPoint && data.instance instanceof LooseConnectionPoint) {
                    selectedNode.value.copy(data.instance);
                } else if (selectedNode.value instanceof BasicConnectionPoint && data.instance instanceof BasicConnectionPoint) {
                    selectedNode.value.copy(data.instance);
                } else {
                    console.error('Not matching node types');
                }

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

        const setSelectedNode = (node: Node | null) => {
            selectedNode.value = node;
            if (node === null) {
                data.value = null;
                return;
            }

            if (node instanceof ClassifierNode) {
                data.value = {
                    type: 'classifier',
                    instance: node.clone()
                };
            } else if (node instanceof PrimitiveTypeNode) {
                data.value = {
                    type: 'primitive',
                    instance: node.clone()
                };
            } else if (node instanceof EnumerationNode) {
                data.value = {
                    type: 'enumeration',
                    instance: node.clone()
                };
            } else if (node instanceof CommentNode) {
                data.value = {
                    type: 'comment',
                    instance: node.clone()
                };
            } else if (node instanceof Connection || node instanceof ConnectionPart || node instanceof ConnectionPoint) {
                data.value = {
                    type: 'connection',
                    instance: node.clone()
                };
            }
        };

        const onToolSelected = (tool: UmlEditorTool) => {
            editor.tool = tool;

            switch (tool) {
                case UmlEditorTool.EDIT:
                    setSelectedNode(editor.selectedNode);
                    break;
                case UmlEditorTool.MOVE:
                    data.value = { type: 'editor', instance: editor.editorConfig };
                    break;
                case UmlEditorTool.ADD:
                    data.value = { type: 'addOption', instance: editor.addConfig };
                    break;
                case UmlEditorTool.REMOVE:
                    data.value = null;
                    break;}
        };

        const onKeyPress = (event: KeyboardEvent) => {
            if (!event.ctrlKey) return;

            // TODO: rethink this mechanism

            switch (event.key) {
                case 'm':
                    event.preventDefault();
                    event.stopPropagation();
                    onToolSelected(UmlEditorTool.MOVE);
                    break;
                case 'e':
                    event.preventDefault();
                    event.stopPropagation();
                    onToolSelected(UmlEditorTool.EDIT);
                    break;
                case 'c':
                    event.preventDefault();
                    event.stopPropagation();
                    onToolSelected(UmlEditorTool.ADD);
                    break;
                case 'r':
                    event.preventDefault();
                    event.stopPropagation();
                    onToolSelected(UmlEditorTool.REMOVE);
                    break;
            }
        };

        return {
            umlCanvas,
            data,
            scale,
            tool,
            canvasWidth,
            editorWidth,
            startResize,
            onSave,
            onToolSelected,
            onScaleSet,
            onScaleReset,
            requestRender: () => {editor.render(); setSelectedNode(null); },
            t
        };
    }
};