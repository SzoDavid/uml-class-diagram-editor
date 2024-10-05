import {RenderConfiguration} from './RenderConfiguration.ts';
import {Node} from '../nodes/Node.ts';
import {ClassifierNodeRenderer} from './ClassifierNodeRenderer.ts';
import {ClassifierNode} from '../nodes/ClassifierNode.ts';

export class Renderer {
    private readonly _canvas: HTMLCanvasElement;
    private readonly _ctx: CanvasRenderingContext2D;
    private readonly _rc: RenderConfiguration;
    private readonly _classifierRenderer: ClassifierNodeRenderer;

    constructor(canvas: HTMLCanvasElement, renderConf: RenderConfiguration) {
        this._canvas = canvas;
        this._ctx = this._canvas.getContext('2d')!;
        this._rc = renderConf;
        this._classifierRenderer = new ClassifierNodeRenderer(this._ctx, this._rc);
    }

    public render(nodes: Node[], scale: number, offsetX: number, offsetY: number): void {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        this._ctx.save();
        this._ctx.translate(offsetX, offsetY);
        this._ctx.scale(scale, scale);

        nodes.forEach(node => {
            if (node instanceof ClassifierNode) {
                this._classifierRenderer.render(node);
            }
        });

        this._ctx.restore();
    }
}