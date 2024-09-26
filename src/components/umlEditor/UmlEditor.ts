import {onMounted, ref} from "vue";
import {UmlEditorUtil} from "../../utils/umlEditor.util.ts";
import {ClassNode, Multiplicity, Node, Property, Visibility} from "../../utils/umlNodes.util.ts";

export default {
    setup() {
        const umlCanvas = ref<HTMLCanvasElement | null>(null);
        const selectedNode = ref<Node | null>(null);
        const data = ref<any>(null);
        let editor: UmlEditorUtil;

        onMounted(() => {
            if (umlCanvas.value === null) {
                console.error("UmlEditorUtil can't be mounted");
                return;
            }

            const canvas = umlCanvas.value as HTMLCanvasElement;
            editor = new UmlEditorUtil(canvas);

            editor.getEmitter().on("mouseDown", (node: Node | null) => {
                selectedNode.value = node;

                if (node === null) {
                    data.value = null;
                    return;
                }

                data.value = {};

                if (node instanceof ClassNode) {
                    data.value.type = 'class';
                    data.value.name = node.name;
                    return;
                }
            });

            editor.addClassNode(50, 50, "ClassA", [new Property('prop', 'type', Visibility.PUBLIC), new Property('prop2', 'value', Visibility.PUBLIC, false, new Multiplicity("*"))], []);
            editor.addClassNode(300, 200, "ClassB", [], []);
        });

        const onSave = () => {
            if (selectedNode.value === null) {
                console.error("Cannot save: no selected node");
                return;
            }

            if (data.value.type === 'class' && selectedNode.value instanceof ClassNode) {
                selectedNode.value.name = data.value.name;
                editor.render();
                return;
            }

            console.error('Unknown or not matching node types');
        }

        return {
            umlCanvas,
            data,
            onSave
        };
    }
};