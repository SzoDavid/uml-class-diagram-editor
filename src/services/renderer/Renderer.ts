import { RenderConfiguration } from './RenderConfiguration.ts';
import { Node } from '../../utils/nodes/Node.ts';
import { NodeRenderer } from './NodeRenderer.ts';

export class Renderer {
    private readonly _canvas: HTMLCanvasElement;
    private readonly _ctx: CanvasRenderingContext2D;
    private readonly _rc: RenderConfiguration;
    private readonly _nodeRenderer: NodeRenderer;

    constructor(canvas: HTMLCanvasElement, renderConf: RenderConfiguration) {
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Failed to lead canvas context');
        }

        this._canvas = canvas;
        this._ctx = context;
        this._rc = renderConf;
        this._nodeRenderer = new NodeRenderer(this._ctx, this._rc);
    }

    public render(
        nodes: Node[],
        scale: number,
        offsetX: number,
        offsetY: number,
        connectionLine?: {
            start: { x: number; y: number };
            end: { x: number; y: number };
        },
    ): void {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._ctx.fillStyle = 'white';
        this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

        this._ctx.save();
        this._ctx.translate(offsetX, offsetY);
        this._ctx.scale(scale, scale);

        nodes.forEach((node) => {
            this._nodeRenderer.render(node);
        });

        if (connectionLine) {
            this._nodeRenderer.renderGhostLine(
                connectionLine.start,
                connectionLine.end,
            );
        }

        this._ctx.restore();
    }

    get renderConfiguration(): RenderConfiguration {
        return this._rc;
    }
}
