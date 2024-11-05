import {beforeEach, describe, vi, test, expect} from 'vitest';
import {RenderConfiguration} from '../../../services/renderer/RenderConfiguration.ts';
import {useSettingsService} from '../../../services/SettingsService.ts';
import {NodeRenderer} from '../../../services/renderer/NodeRenderer.ts';
import {CommentRenderer} from '../../../services/renderer/CommentRenderer.ts';
import {CommentNode} from '../../../utils/nodes/CommentNode.ts';

describe('UCDE-CommentRenderer', () => {
    let canvas: HTMLCanvasElement;
    let context2D: CanvasRenderingContext2D;
    let renderConf: RenderConfiguration;
    let commentRenderer: CommentRenderer;

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
            moveTo: vi.fn(),
            lineTo: vi.fn(),
            closePath: vi.fn(),
            measureText: vi.fn().mockImplementation((text: string) => ({
                width: text.includes('wide') ? 1000 : text.length * 7 // Mocking width based on text length
            })),
            fillText: vi.fn(),
        } as unknown as CanvasRenderingContext2D;

        renderConf = settings.renderer;
        commentRenderer = new NodeRenderer(context2D, renderConf)['_commentRenderer'];

        vi.spyOn(commentRenderer['_nr'], 'drawText');
    });

    test('UCDE-CR-01 GIVEN a valid CommentNode WHEN rendering THEN it should draw the comment box and text', () => {
        const commentNode = new CommentNode('comment', 10, 20);
        commentRenderer.render(commentNode);

        expect(commentNode.width).toBeGreaterThanOrEqual(renderConf.defaultWidth);
        expect(commentNode.height).toBeGreaterThan(0);

        expect(context2D.beginPath).toHaveBeenCalled();
        expect(context2D.closePath).toHaveBeenCalled();
        expect(context2D.fill).toHaveBeenCalled();
        expect(context2D.stroke).toHaveBeenCalled();

        expect(commentRenderer['_nr']['drawText']).toHaveBeenCalled();
    });

    test('UCDE-CR-02 GIVEN text with new lines WHEN rendering THEN it should correctly split the text into lines', () => {
        const commentNode = new CommentNode('This is a comment\nwith multiple lines', 10, 20);
        commentNode.width = 500;

        commentRenderer.render(commentNode);

        expect(commentRenderer['_nr']['drawText']).toHaveBeenCalledTimes(2); // 2 lines of text
    });

    test('UCDE-CR-03 GIVEN a selected CommentNode WHEN rendering THEN it should use the selected styles', () => {
        const commentNode = new CommentNode('comment', 10, 20);
        commentNode.isSelected = true;

        commentRenderer.render(commentNode);

        expect(context2D.strokeStyle).toBe(renderConf.accentColorSelected);
    });
});