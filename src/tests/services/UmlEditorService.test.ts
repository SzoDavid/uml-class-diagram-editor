import {beforeEach, describe, expect, test, vi} from 'vitest';
import {Renderer} from '../../utils/renderer/Renderer.ts';
import {UmlEditorService, UmlEditorTool} from '../../services/UmlEditorService.ts';
import {ClassNode} from '../../utils/nodes/classifier/ClassNode.ts';
import {NodeType} from '../../utils/nodes/types.ts';
import {InterfaceNode} from '../../utils/nodes/classifier/InterfaceNode.ts';
import {DataTypeNode} from '../../utils/nodes/classifier/DataTypeNode.ts';
import {PrimitiveTypeNode} from '../../utils/nodes/PrimitiveTypeNode.ts';
import {EnumerationNode} from '../../utils/nodes/EnumerationNode.ts';
import {CommentNode} from '../../utils/nodes/CommentNode.ts';

describe('UCDE-UmlEditorService', () => {
    let canvas: HTMLCanvasElement;
    let renderer: Renderer;
    let editorService: UmlEditorService;

    beforeEach(() => {
        canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 500;

        renderer = {
            render: vi.fn()
        } as unknown as Renderer;

        editorService = new UmlEditorService(canvas, renderer);
    });

    const simulateMouseEvent = (eventType: string, clientX: number, clientY: number) => {
        const event = new MouseEvent(eventType, {
            clientX,
            clientY,
            bubbles: true,
            cancelable: true,
        });

        // Simulate offsetX and offsetY using canvas bounding rect
        const boundingRect = canvas.getBoundingClientRect();
        Object.defineProperty(event, 'offsetX', {
            get: () => clientX - boundingRect.left,
        });
        Object.defineProperty(event, 'offsetY', {
            get: () => clientY - boundingRect.top,
        });

        return event;
    };

    describe('UCDE-UES-0100-constructor', () => {
        test('UCDE-UES-0101 GIVEN UmlEditorService is initialized WHEN no tool is set THEN the default tool should be EDIT', () => {
            expect(editorService.tool).toBe(UmlEditorTool.EDIT);
        });
    });

    describe('UCDE-UES-0200-addNode', () => {
        test('UCDE-UES-0201 GIVEN a new node is added WHEN the addNode method is called THEN the node should be added and rendered', () => {
            const node = new ClassNode('TestClass', 100, 100);
            editorService.addNode(node);

            expect(editorService.selectedNode).toBe(null);
            expect(renderer.render).toHaveBeenCalled();
        });
    });

    describe('UCDE-UES-0300-set tool', () => {
        test('UCDE-UES-0301 GIVEN a new tool is set WHEN tool is changed THEN it should emit toolChange event', () => {
            const spy = vi.spyOn(editorService.emitter, 'emit');
            editorService.tool = UmlEditorTool.ADD;

            expect(spy).toHaveBeenCalledWith('toolChange', UmlEditorTool.ADD);
        });
    });

    describe('UCDE-UES-0400-set scale', () => {
        test('UCDE-UES-0401 GIVEN the scale is changed WHEN scale setter is called THEN it should update scale and emit scaleChange event', () => {
            const spy = vi.spyOn(editorService.emitter, 'emit');
            editorService.scale = 2;

            expect(editorService.scale).toBe(2);
            expect(spy).toHaveBeenCalledWith('scaleChange', 2);
        });
    });

    describe('UCDE-UES-0500-onMouseMove', () => {
        test('UCDE-UES-0501 GIVEN a node is added and tool is set to MOVE WHEN mouse events occur THEN the node should be selected and moved', () => {
            const node = new ClassNode('TestClass', 100, 100);
            editorService.addNode(node);
            editorService.tool = UmlEditorTool.MOVE;

            const mouseDownEvent = simulateMouseEvent('mousedown', 100, 100);
            canvas.dispatchEvent(mouseDownEvent);

            expect(editorService.selectedNode).toBe(node);
            expect(node.isDragging).toBe(true);

            const mouseMoveEvent = simulateMouseEvent('mousemove', 150, 150);
            canvas.dispatchEvent(mouseMoveEvent);

            expect(node.x).toBe(150);
            expect(node.y).toBe(150);
            expect(renderer.render).toHaveBeenCalledTimes(6); // init, add node, set tool, mouse down, deselect all other, mouse move
        });
    });

    describe('UCDE-UES-0600-resetScaling', () => {
        test('UCDE-UES-0601 GIVEN the editor is initialized WHEN resetScaling is called THEN the scale and pan offsets should reset and scaleChange event should be emitted', () => {
            const spy = vi.spyOn(editorService.emitter, 'emit');
            editorService.resetScaling();

            expect(editorService.scale).toBe(1);
            expect(editorService.offset.x).toBe(0);
            expect(editorService.offset.y).toBe(0);
            expect(spy).toHaveBeenCalledWith('scaleChange', 1);
            expect(renderer.render).toHaveBeenCalled();
        });
    });

    describe('UCDE-UES-0700-onMouseDown', () => {
        describe('UCDE-UES-0701 GIVEN add tool is selected WHEN mouse is clicked THEN correct node is added', () => {
            test.each([
                { addType: NodeType.CLASS, expectedType: ClassNode},
                { addType: NodeType.INTERFACE, expectedType: InterfaceNode},
                { addType: NodeType.DATATYPE, expectedType: DataTypeNode},
                { addType: NodeType.PRIMITIVE, expectedType: PrimitiveTypeNode},
                { addType: NodeType.ENUMERATION, expectedType: EnumerationNode},
                { addType: NodeType.COMMENT, expectedType: CommentNode}
            ])('UCDE-UES-0701, {addType: $addType}', ({addType, expectedType}) => {
                editorService.tool = UmlEditorTool.ADD;
                editorService.addConfig = {type: addType, keepAdding: true};

                const mouseDownEvent = simulateMouseEvent('mousedown', 100, 100);
                canvas.dispatchEvent(mouseDownEvent);

                expect(editorService['_nodes']).toHaveLength(1);
                expect(editorService['_nodes'][0] instanceof expectedType).toBe(true);
            });
        });

        test('UCDE-UES-0702 GIVEN add tool is selected and keepAdding is false WHEN adding new node THEN tool is set to edit', () => {
            editorService.tool = UmlEditorTool.ADD;
            editorService.addConfig = {type: NodeType.CLASS, keepAdding: false};

            const mouseDownEvent = simulateMouseEvent('mousedown', 100, 100);
            canvas.dispatchEvent(mouseDownEvent);

            expect(editorService.tool).toEqual(UmlEditorTool.EDIT);
        });

        test('UCDE-UES-0703 GIVEN add tool is selected and keepAdding is true WHEN adding new node THEN tool is set to stay on add', () => {
            editorService.tool = UmlEditorTool.ADD;
            editorService.addConfig = {type: NodeType.CLASS, keepAdding: true};

            const mouseDownEvent = simulateMouseEvent('mousedown', 100, 100);
            canvas.dispatchEvent(mouseDownEvent);

            expect(editorService.tool).toEqual(UmlEditorTool.ADD);
        });
    });
});