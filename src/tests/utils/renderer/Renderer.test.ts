import {beforeEach, describe, vi, test, expect} from 'vitest';
import {Renderer} from '../../../utils/renderer/Renderer.ts';
import {ClassNodeRenderer} from '../../../utils/renderer/ClassNodeRenderer.ts';
import {defaultRenderConfiguration, RenderConfiguration} from '../../../utils/renderer/RenderConfiguration.ts';
import {ClassNode} from '../../../utils/nodes/ClassNode.ts';
import {ANode} from '../../../utils/nodes/ANode.ts';

describe('UCDE-Renderer', () => {
    let canvas: HTMLCanvasElement;
    let context2D: CanvasRenderingContext2D;
    let renderConf: RenderConfiguration;
    let classNodeRenderer: ClassNodeRenderer;
    let renderer: Renderer;
    
    beforeEach(() => {
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
            stroke: vi.fn(),
            measureText: vi.fn().mockImplementation((text: string) => ({
                width: text.length * 7, // Mocking width based on text length
            })),
            fillText: vi.fn()
        } as unknown as CanvasRenderingContext2D;

        vi.spyOn(canvas, 'getContext').mockReturnValue(context2D);

        renderConf = defaultRenderConfiguration;
        classNodeRenderer = new ClassNodeRenderer(context2D, renderConf);
        vi.spyOn(classNodeRenderer, 'render');

        renderer = new Renderer(canvas, renderConf);

        (renderer as any)._classRenderer = classNodeRenderer;
    });

    test('UCDE-R-01 GIVEN an empty node list WHEN render is called THEN clearRect and transformation methods should be called', () => {
        renderer.render([], 1, 0, 0);

        expect(context2D.clearRect).toHaveBeenCalledWith(0, 0, 500, 500);
        expect(context2D.save).toHaveBeenCalled();
        expect(context2D.restore).toHaveBeenCalled();
        expect(context2D.translate).toHaveBeenCalledWith(0, 0);
        expect(context2D.scale).toHaveBeenCalledWith(1, 1);
    });

    test('UCDE-R-02 GIVEN nodes with a ClassNode WHEN render is called THEN ClassNodeRenderer.render should be called', () => {
        const classNode = new ClassNode('TestClass', 100, 100);
        renderer.render([classNode], 1, 0, 0);

        expect(classNodeRenderer.render).toHaveBeenCalledWith(classNode);
    });

    test('UCDE-R-03 GIVEN a non-ClassNode node WHEN render is called THEN ClassNodeRenderer.render should not be called', () => {
        const aNode = { x: 100, y: 100, width: 50, height: 50 } as ANode;
        renderer.render([aNode], 1, 0, 0);

        expect(classNodeRenderer.render).not.toHaveBeenCalled();
    });

    test('UCDE-R-04 GIVEN a scale and offsets WHEN render is called THEN transformations should be applied correctly', () => {
        const classNode = new ClassNode('TestClass', 100, 100);
        renderer.render([classNode], 2, 50, 50);

        expect(context2D.translate).toHaveBeenCalledWith(50, 50);
        expect(context2D.scale).toHaveBeenCalledWith(2, 2);
    });
});