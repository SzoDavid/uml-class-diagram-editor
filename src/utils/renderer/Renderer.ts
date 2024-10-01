import {RenderConfiguration} from './RenderConfiguration.ts';
import {ANode} from '../nodes/ANode.ts';
import {ClassNodeRenderer} from './ClassNodeRenderer.ts';
import {ClassNode} from '../nodes/ClassNode.ts';

export class Renderer {
    private readonly _canvas: HTMLCanvasElement;
    private readonly _ctx: CanvasRenderingContext2D;
    private readonly _rc: RenderConfiguration;
    private readonly _classRenderer: ClassNodeRenderer;

    constructor(canvas: HTMLCanvasElement, renderConf: RenderConfiguration) {
        this._canvas = canvas;
        this._ctx = this._canvas.getContext('2d')!;
        this._rc = renderConf;
        this._classRenderer = new ClassNodeRenderer(this._ctx, this._rc);
    }

    public render(nodes: ANode[], scale: number, offsetX: number, offsetY: number): void {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        this._ctx.save();
        this._ctx.translate(offsetX, offsetY);
        this._ctx.scale(scale, scale);

        nodes.forEach(node => {
            if (node instanceof ClassNode) {
                this._classRenderer.render(node);
            }
        });

        this._ctx.restore();
    }
}