import {RenderConfiguration} from './RenderConfiguration.ts';
import {ClassNode, Node} from '../umlNodes.ts';

type TextWeight = 'normal' | 'bold';

export class Renderer {
    private readonly _canvas: HTMLCanvasElement;
    private readonly _ctx: CanvasRenderingContext2D;
    private readonly _rc: RenderConfiguration;

    constructor(canvas: HTMLCanvasElement, renderConf: RenderConfiguration) {
        this._canvas = canvas;
        this._ctx = this._canvas.getContext('2d')!;
        this._rc = renderConf;
    }

    public render(nodes: Node[]): void {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        nodes.forEach(node => this.drawNode(node));
    }

    private drawNode(node: Node): void {
        if (node instanceof ClassNode) {
            this.drawClassNode(node);
        }
    }

    private drawClassNode(node: ClassNode) {
        this.drawRect(node.x, node.y, node.width, this._rc.lineHeight, node.isSelected);
        node.height = this._rc.lineHeight;

        this.drawText(node.name, node.x, node.y, node.width, node.isSelected, 'bold', 'center');

        if (node.properties.length !== 0) {
            this.drawRect(node.x, node.y + this._rc.lineHeight, node.width, this._rc.lineHeight * node.properties.length, node.isSelected);
            node.height += this._rc.lineHeight * node.properties.length;

            for (const i in node.properties) {
                this.drawText(node.properties[i].toString(), node.x, node.y + ((+i + 1) * this._rc.lineHeight), node.width, node.isSelected);
            }
        }

        if (node.operations.length !== 0) {
            this.drawRect(node.x, node.y + (this._rc.lineHeight * (node.properties.length + 1)), node.width, this._rc.lineHeight * node.operations.length, node.isSelected);
            node.height += this._rc.lineHeight * node.operations.length;

            for (const i in node.operations) {
                this.drawText(node.operations[i].toString(), node.x, node.y + ((+i + 1) * this._rc.lineHeight) + (this._rc.lineHeight * node.properties.length), node.width, node.isSelected);
            }
        }
    }

    private drawRect(x: number, y: number, width: number, height: number, isSelected=false): void {
        this._ctx.beginPath();
        this._ctx.rect(x, y, width, height);

        this._ctx.fillStyle = isSelected ? this._rc.fillColorSelected : this._rc.fillColor;
        this._ctx.fill();
        this._ctx.lineWidth = this._rc.borderSize;
        this._ctx.strokeStyle = isSelected ? this._rc.accentColorSelected : this._rc.accentColor;
        this._ctx.stroke();
    }

    private drawText(text: string, x: number, y: number, width: number, isSelected=false, textWeight: TextWeight='normal', textAlign: CanvasTextAlign='left'): void {
        this._ctx.beginPath();
        this._ctx.fillStyle = isSelected ? this._rc.accentColorSelected : this._rc.accentColor;
        this._ctx.font = `${textWeight} ${this._rc.textSize}px Arial`;
        this._ctx.textAlign = textAlign;
        this._ctx.textBaseline = 'middle';

        switch (textAlign) {
            case 'center':
                this._ctx.fillText(text, x + (width / 2), y + (this._rc.lineHeight / 2),  width - 2 * this._rc.lineMargin);
                break;
            case 'left':
                this._ctx.fillText(text, x + this._rc.lineMargin, y + (this._rc.lineHeight / 2),  width - 2 * this._rc.lineMargin);
                break;
            default:
                this._ctx.fillText(text, x, y + (this._rc.lineHeight / 2), width - 2 * this._rc.lineMargin);
                break;
        }
    }
}