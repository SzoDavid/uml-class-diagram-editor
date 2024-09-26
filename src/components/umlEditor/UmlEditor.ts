import {onMounted, ref} from "vue";
import {EmitType, UmlEditorTool, UmlEditorUtil} from "../../utils/umlEditor.util.ts";
import {
    ClassNode,
    MultiplicityRange,
    Node,
    Operation,
    Parameter,
    Property,
    Visibility,
} from "../../utils/umlNodes.util.ts";

export default {
    computed: {
        UmlEditorTool() {
            return UmlEditorTool
        }
    },
    setup() {
        const umlCanvas = ref<HTMLCanvasElement | null>(null);
        const selectedNode = ref<Node | null>(null);
        const data = ref<any>(null);
        const tool = ref<UmlEditorTool|null>(null);
        let editor: UmlEditorUtil;

        onMounted(() => {
            if (umlCanvas.value === null) {
                console.error("UmlEditorUtil can't be mounted");
                return;
            }

            const canvas = umlCanvas.value as HTMLCanvasElement;
            editor = new UmlEditorUtil(canvas);
            tool.value = editor.tool;

            editor.emitter.on("mouseDown", (node: EmitType) => {
                if (!(node instanceof Node) && node !== null) return;

                selectedNode.value = node;

                if (node === null) {
                    data.value = null;
                    return;
                }

                data.value = {};

                if (node instanceof ClassNode) {
                    data.value.type = 'class';
                    data.value.name = node.name;
                    data.value.width = node.width;
                    return;
                }
            });

            editor.emitter.on("toolChange", (newTool: EmitType) => {
                if (newTool === null || typeof newTool === "object" || !(newTool in UmlEditorTool)) return;

                tool.value = newTool;
            });

            editor.addNode(new ClassNode("ClassA",
                [new Property('prop', 'type', Visibility.PUBLIC),
                    new Property('prop2', 'value', Visibility.PUBLIC, false, new MultiplicityRange("*"))],
                [new Operation("operationA", [], Visibility.PRIVATE, "string", new MultiplicityRange("*", 1))], 50, 50, 200));
            editor.addNode(new ClassNode("ClassB", [],
                [new Operation("operationB", [new Parameter("param", "type")], Visibility.PROTECTED, "string", new MultiplicityRange(5, 1))], 300, 200, 300))
        });

        const onSave = () => {
            if (selectedNode.value === null) {
                console.error("Cannot save: no selected node");
                return;
            }

            if (data.value.type === 'class' && selectedNode.value instanceof ClassNode) {
                selectedNode.value.name = data.value.name;
                selectedNode.value.width = data.value.width;
                editor.render();
                return;
            }

            console.error('Unknown or not matching node types');
        }

        const onToolSelect = () => {
            editor.tool = UmlEditorTool.SELECT;
        }

        const onToolMove = () => {
            editor.tool = UmlEditorTool.MOVE;
        }

        return {
            umlCanvas,
            data,
            tool,
            onSave,
            onToolSelect,
            onToolMove
        };
    }
};