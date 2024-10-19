import {RenderConfiguration} from './RenderConfiguration.ts';
import {Node} from '../nodes/Node.ts';
import {NodeRenderer} from './NodeRenderer.ts';

export class Renderer {
    private readonly _canvas: HTMLCanvasElement;
    private readonly _ctx: CanvasRenderingContext2D;
    private readonly _rc: RenderConfiguration;
    private readonly _nodeRenderer: NodeRenderer;

    constructor(canvas: HTMLCanvasElement, renderConf: RenderConfiguration) {
        this._canvas = canvas;
        this._ctx = this._canvas.getContext('2d')!;
        this._rc = renderConf;
        this._nodeRenderer = new NodeRenderer(this._ctx, this._rc);
    }

    public render(nodes: Node[], scale: number, offsetX: number, offsetY: number, connectionLine?: {start: {x: number, y: number}, end: {x: number, y: number} }): void {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        this._ctx.save();
        this._ctx.translate(offsetX, offsetY);
        this._ctx.scale(scale, scale);

        nodes.forEach(node => {
            this._nodeRenderer.render(node);
        });

        if (connectionLine) {
            console.log(connectionLine);
            this._ctx.lineWidth = this._rc.borderSize;
            this._ctx.beginPath();
            this._ctx.moveTo(connectionLine.start.x, connectionLine.start.y);
            this._ctx.lineTo(connectionLine.end.x, connectionLine.end.y);
            this._ctx.strokeStyle = this._rc.accentColorSelected;
            this._ctx.stroke();
        }

        this._ctx.restore();
    }
}