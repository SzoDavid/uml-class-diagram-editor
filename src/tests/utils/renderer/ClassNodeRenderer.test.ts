import {describe, beforeEach, vi, test, expect} from 'vitest';
import {defaultRenderConfiguration, RenderConfiguration} from '../../../utils/renderer/RenderConfiguration.ts';
import {ClassNodeRenderer} from '../../../utils/renderer/ClassNodeRenderer.ts';
import {ClassNode} from '../../../utils/nodes/ClassNode.ts';
import {MockProperty} from '../nodes/features/mocks/MockProperty.ts';
import {MockOperation} from '../nodes/features/mocks/MockOperation.ts';
import {Parameter} from '../../../utils/nodes/features/Parameter.ts';

describe('UCDE-ClassNodeRenderer', () => {
    let canvas: HTMLCanvasElement;
    let context2D: CanvasRenderingContext2D;
    let renderConf: RenderConfiguration;
    let classNodeRenderer: ClassNodeRenderer;

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
                width: text.includes('wide') ? 1000 : text.length * 7 // Mocking width based on text length
            })),
            fillText: vi.fn(),
        } as unknown as CanvasRenderingContext2D;

        renderConf = defaultRenderConfiguration;
        classNodeRenderer = new ClassNodeRenderer(context2D, renderConf);
    });

    test('UCDE-CNR-01 GIVEN a class node with features WHEN render is called THEN the width of the class node should be adjusted accordingly', () => {
        const classNode = new ClassNode('TestClass', 100, 100);
        classNode.properties = [ new MockProperty('valid') ];
        classNode.operations = [ new MockOperation('valid') ];
        classNodeRenderer.render(classNode);

        expect(classNode.width).toBeGreaterThan(renderConf.defaultWidth);
    });

    test('UCDE-CNR-02 GIVEN a list of features including multiline features WHEN calculateTotalFeatureLines is called THEN it should return the correct total number of lines', () => {
        const classNode = new ClassNode('TestClass', 100, 100);
        classNode.properties = [ new MockProperty('valid') ];

        const mockOperation = new MockOperation('wide_valid');
        mockOperation.params = [ new Parameter('valid') ];
        classNode.operations = [ mockOperation ];

        const totalLines = classNodeRenderer['calculateTotalFeatureLines']([...classNode.properties, ...classNode.operations]);
        expect(totalLines).toBe(4); //  property + 3 from wide operation
    });

    test('UCDE-CNR-03 GIVEN a class node with features WHEN render is called THEN the features should be rendered correctly', () => {
        const classNode = new ClassNode('TestClass', 100, 100);
        classNode.properties = [ new MockProperty('single_line_feature') ];
        classNode.isNotShownPropertiesExist = true;

        const mockOperation = new MockOperation('wide_valid');
        mockOperation.params = [ new Parameter('valid') ];
        classNode.operations = [ mockOperation ];

        classNodeRenderer.render(classNode);

        expect(context2D.fillText).toHaveBeenCalledTimes(6);

        expect(context2D.fillText).toHaveBeenNthCalledWith(1, 'TestClass', expect.any(Number), expect.any(Number), expect.any(Number));
        expect(context2D.fillText).toHaveBeenNthCalledWith(2, 'single_line_feature: string', expect.any(Number), expect.any(Number), expect.any(Number));
        expect(context2D.fillText).toHaveBeenNthCalledWith(3, '...', expect.any(Number), expect.any(Number), expect.any(Number));
        expect(context2D.fillText).toHaveBeenNthCalledWith(4, 'wide_valid(', expect.any(Number), expect.any(Number), expect.any(Number));
        expect(context2D.fillText).toHaveBeenNthCalledWith(5, 'valid', expect.any(Number), expect.any(Number), expect.any(Number));
        expect(context2D.fillText).toHaveBeenNthCalledWith(6, ')', expect.any(Number), expect.any(Number), expect.any(Number));
    });

    test('UCDE-CNR-04 GIVEN no features WHEN renderFeatureGroup is called THEN it should return 0 lines', () => {
        const lines = classNodeRenderer['renderFeatureGroup']([], 100, 100, 200, false, false, false);

        expect(lines).toBe(0);
    });
});