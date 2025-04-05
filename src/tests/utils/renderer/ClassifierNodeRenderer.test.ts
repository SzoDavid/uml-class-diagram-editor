import { describe, beforeEach, afterAll, vi, test, expect } from 'vitest';
import { RenderConfiguration } from '../../../services/renderer/RenderConfiguration.ts';
import { ClassNode } from '../../../utils/nodes/classifier/ClassNode.ts';
import { MockProperty } from '../nodes/features/mocks/MockProperty.ts';
import { MockOperation } from '../nodes/features/mocks/MockOperation.ts';
import { Parameter } from '../../../utils/nodes/features/Parameter.ts';
import { NodeRenderer } from '../../../services/renderer/NodeRenderer.ts';
import { ClassifierNodeRenderer } from '../../../services/renderer/ClassifierNodeRenderer.ts';
import { useSettingsService } from '../../../services/SettingsService.ts';

describe('UCDE-ClassifierNodeRenderer', () => {
    const consoleMock = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
    let canvas: HTMLCanvasElement;
    let context2D: CanvasRenderingContext2D;
    let renderConf: RenderConfiguration;
    let classifierNodeRenderer: ClassifierNodeRenderer;

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
            stroke: vi.fn(),
            measureText: vi.fn().mockImplementation((text: string) => ({
                width: text.includes('wide') ? 1000 : text.length * 7, // Mocking width based on text length
            })),
            fillText: vi.fn(),
        } as unknown as CanvasRenderingContext2D;

        renderConf = settings.renderer;
        classifierNodeRenderer = new NodeRenderer(context2D, renderConf)[
            '_classifierRenderer'
        ];
    });

    afterAll(() => {
        consoleMock.mockReset();
    });

    test('UCDE-CNR-01 GIVEN a class node with features WHEN render is called THEN the width of the class node should be adjusted accordingly', () => {
        const classNode = new ClassNode('TestClass', 100, 100);
        classNode.properties = [new MockProperty('valid')];
        classNode.operations = [new MockOperation('valid')];
        classifierNodeRenderer.render(classNode);

        expect(classNode.width).toBeGreaterThan(renderConf.defaultWidth);
    });

    test('UCDE-CNR-02 GIVEN a list of features including multiline features WHEN calculateTotalFeatureLines is called THEN it should return the correct total number of lines', () => {
        const classNode = new ClassNode('TestClass', 100, 100);
        classNode.properties = [new MockProperty('valid')];

        const mockOperation = new MockOperation('wide_valid');
        mockOperation.params = [new Parameter('valid')];
        classNode.operations = [mockOperation];

        const totalLines = classifierNodeRenderer['calculateTotalFeatureLines'](
            [...classNode.properties, ...classNode.operations],
        );
        expect(totalLines).toBe(4); //  property + 3 from wide operation
    });

    test('UCDE-CNR-03 GIVEN a class node with features WHEN render is called THEN the features should be rendered correctly', () => {
        const classNode = new ClassNode('TestClass', 100, 100);
        classNode.properties = [new MockProperty('single_line_feature')];
        classNode.isNotShownPropertiesExist = true;

        const mockOperation = new MockOperation('wide_valid');
        mockOperation.params = [new Parameter('valid')];
        classNode.operations = [mockOperation];

        classifierNodeRenderer.render(classNode);

        expect(context2D.fillText).toHaveBeenCalledTimes(6);

        expect(context2D.fillText).toHaveBeenNthCalledWith(
            1,
            'TestClass',
            expect.any(Number),
            expect.any(Number),
            expect.any(Number),
        );
        expect(context2D.fillText).toHaveBeenNthCalledWith(
            2,
            'single_line_feature: string',
            expect.any(Number),
            expect.any(Number),
            expect.any(Number),
        );
        expect(context2D.fillText).toHaveBeenNthCalledWith(
            3,
            '...',
            expect.any(Number),
            expect.any(Number),
            expect.any(Number),
        );
        expect(context2D.fillText).toHaveBeenNthCalledWith(
            4,
            'wide_valid(',
            expect.any(Number),
            expect.any(Number),
            expect.any(Number),
        );
        expect(context2D.fillText).toHaveBeenNthCalledWith(
            5,
            'valid',
            expect.any(Number),
            expect.any(Number),
            expect.any(Number),
        );
        expect(context2D.fillText).toHaveBeenNthCalledWith(
            6,
            ')',
            expect.any(Number),
            expect.any(Number),
            expect.any(Number),
        );
    });

    test('UCDE-CNR-04 GIVEN no features WHEN renderFeatureGroup is called THEN it should return 0 lines', () => {
        const lines = classifierNodeRenderer['renderFeatureGroup'](
            [],
            100,
            100,
            200,
            false,
            false,
            false,
        );

        expect(lines).toBe(0);
    });

    test('UCDE-CNR-05 GIVEN invalid class node WHEN rendering THEN log error', () => {
        const classNode = new ClassNode('TestClass', 100, 100);
        classNode.properties.push(new MockProperty('invalid'));

        classifierNodeRenderer.render(classNode);

        expect(consoleMock).toHaveBeenCalledOnce();
    });
});
