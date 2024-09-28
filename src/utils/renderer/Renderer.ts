import {RenderConfiguration} from './RenderConfiguration.ts';
import {ClassNode, Node} from '../umlNodes.ts';
import {ClassNodeRenderer} from './ClassNodeRenderer.ts';

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

    public render(nodes: Node[]): void {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        nodes.forEach(node => {
            if (node instanceof ClassNode) {
                this._classRenderer.render(node);
            }
        });
    }
}