import {beforeEach, describe, vi, test, expect} from 'vitest';
import {Renderer} from '../../../services/renderer/Renderer.ts';
import {RenderConfiguration} from '../../../services/renderer/RenderConfiguration.ts';
import {ClassNode} from '../../../utils/nodes/classifier/ClassNode.ts';
import {NodeRenderer} from '../../../services/renderer/NodeRenderer.ts';
import {useSettingsService} from '../../../services/SettingsService.ts';
import {PositionalNode} from '../../../utils/nodes/PositionalNode.ts';

describe('UCDE-Renderer', () => {
    let canvas: HTMLCanvasElement;
    let context2D: CanvasRenderingContext2D;
    let renderConf: RenderConfiguration;
    let nodeRenderer: NodeRenderer;
    let renderer: Renderer;
    
    beforeEach(() => {
        const { settings } = useSettingsService();

        canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 500;

        context2D = {
            clearRect: vi.fn(),
            save: vi.fn(),
            restore: vi.fn(),
            translate: vi.fn(),
            scale: vi.fn(),
            beginPath: vi.fn(),
            rect: vi.fn(),
            fill: vi.fn(),
            fillRect: vi.fn(),
            stroke: vi.fn(),
            measureText: vi.fn().mockImplementation((text: string) => ({
                width: text.length * 7, // Mocking width based on text length
            })),
            fillText: vi.fn()
        } as unknown as CanvasRenderingContext2D;

        vi.spyOn(canvas, 'getContext').mockReturnValue(context2D);

        renderConf = settings.renderer;
        nodeRenderer = new NodeRenderer(context2D, renderConf);
        vi.spyOn(nodeRenderer, 'render');
        vi.spyOn(nodeRenderer['_classifierRenderer'], 'render');

        renderer = new Renderer(canvas, renderConf);

        (renderer as any)._nodeRenderer = nodeRenderer;
    });

    test('UCDE-R-01 GIVEN an empty node list WHEN render is called THEN clearRect and transformation methods should be called', () => {
        renderer.render([], 1, 0, 0);

        expect(context2D.clearRect).toHaveBeenCalledWith(0, 0, 500, 500);
        expect(context2D.save).toHaveBeenCalled();
        expect(context2D.restore).toHaveBeenCalled();
        expect(context2D.translate).toHaveBeenCalledWith(0, 0);
        expect(context2D.scale).toHaveBeenCalledWith(1, 1);
    });

    test('UCDE-R-02 GIVEN nodes with a ClassNode WHEN render is called THEN NodeRenderer.render should be called', () => {
        const classNode = new ClassNode('TestClass', 100, 100);
        renderer.render([classNode], 1, 0, 0);

        expect(nodeRenderer.render).toHaveBeenCalledWith(classNode);
    });

    test('UCDE-R-03 GIVEN a non-ClassNode node WHEN render is called THEN ClassNodeRenderer.render should not be called', () => {
        const aNode = { x: 100, y: 100, width: 50, height: 50 } as PositionalNode;
        renderer.render([aNode], 1, 0, 0);

        expect(nodeRenderer['_classifierRenderer'].render).not.toHaveBeenCalled();
    });

    test('UCDE-R-04 GIVEN a scale and offsets WHEN render is called THEN transformations should be applied correctly', () => {
        const classNode = new ClassNode('TestClass', 100, 100);
        renderer.render([classNode], 2, 50, 50);

        expect(context2D.translate).toHaveBeenCalledWith(50, 50);
        expect(context2D.scale).toHaveBeenCalledWith(2, 2);
    });
});