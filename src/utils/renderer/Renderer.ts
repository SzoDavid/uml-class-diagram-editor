import {RenderConfiguration} from './RenderConfiguration.ts';
import {ClassNode, Node} from '../umlNodes.ts';

type TextWeight = 'normal' | 'bold';

interface PartialUnderlineContext {
    prefix: string;
    underlined: string;
}

interface TextProperties {
    isSelected?: boolean,
    isInvalid?: boolean,
    textWeight?: TextWeight,
    italic?: boolean,
    textAlign?: CanvasTextAlign,
    puc?: PartialUnderlineContext|null
}

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
        let invalid = false;
        const nodeErrors = node.validate();
        if (nodeErrors.length > 0) {
            console.error({message: 'Node is invalid', node: node, errors: nodeErrors});
            if (this._rc.showInvalidity) invalid = true;
        }

        node.width = this._rc.defaultWidth;

        this._ctx.font = `${this._rc.textSize}px Arial`;
        for (const property of node.properties) {
            const propW = this._ctx.measureText(property.toString()).width + 2 * this._rc.lineMargin;

            if (propW > node.width) node.width = propW;
        }

        for (const operation of node.operations) {
            const operationW = this._ctx.measureText(operation.toString()).width + 2 * this._rc.lineMargin;

            if (operationW > node.width) node.width = operationW;
        }

        this.drawRect(node.x, node.y, node.width, this._rc.lineHeight, node.isSelected, invalid);
        node.height = this._rc.lineHeight;

        this.drawText(node.name, node.x, node.y, node.width, {
            isSelected: node.isSelected,
            isInvalid: invalid,
            textWeight: 'bold',
            italic: node.isAbstract(),
            textAlign: 'center' });

        if (node.properties.length !== 0) {
            this.drawRect(node.x, node.y + this._rc.lineHeight, node.width, this._rc.lineHeight * node.properties.length, node.isSelected, invalid);
            node.height += this._rc.lineHeight * node.properties.length;

            node.properties.forEach((prop, i) => this.drawText(prop.toString(), node.x, node.y + ((+i + 1) * this._rc.lineHeight), node.width, {
                isSelected: node.isSelected,
                isInvalid: invalid,
                puc: prop.isStatic ? { prefix: prop.prefix, underlined: prop.name } : null
            }));
        }

        if (node.operations.length !== 0) {
            this.drawRect(node.x, node.y + (this._rc.lineHeight * (node.properties.length + 1)), node.width, this._rc.lineHeight * node.operations.length, node.isSelected, invalid);
            node.height += this._rc.lineHeight * node.operations.length;

            node.operations.forEach((operation, i) => this.drawText(operation.toString(), node.x, node.y + ((+i + 1) * this._rc.lineHeight) + (this._rc.lineHeight * node.properties.length), node.width, {
                isSelected: node.isSelected,
                isInvalid: invalid,
                puc: operation.isStatic ? { prefix: operation.prefix, underlined: operation.name } : null
            }));
        }
    }

    private drawRect(x: number, y: number, width: number, height: number, isSelected=false, isInvalid=false): void {
        this._ctx.beginPath();
        this._ctx.rect(x, y, width, height);

        this._ctx.fillStyle = isSelected ? (isInvalid ? this._rc.fillColorInvalidSelected : this._rc.fillColorSelected)
            : (isInvalid ? this._rc.fillColorInvalid : this._rc.fillColor);
        this._ctx.fill();
        this._ctx.lineWidth = this._rc.borderSize;
        this._ctx.strokeStyle = isSelected ? (isInvalid ? this._rc.accentColorInvalidSelected : this._rc.accentColorSelected)
            : (isInvalid ? this._rc.accentColorInvalid : this._rc.accentColor);
        this._ctx.stroke();
    }

    private drawText(text: string,
                     x: number,
                     y: number,
                     width: number,
                     {
                         isSelected = false,
                         isInvalid = false,
                         textWeight = 'normal',
                         italic = false,
                         textAlign ='left',
                         puc = null
                     }: TextProperties = {}): void {

        this._ctx.beginPath();
        this._ctx.fillStyle = isSelected ? (isInvalid ? this._rc.accentColorInvalidSelected : this._rc.accentColorSelected)
            : (isInvalid ? this._rc.accentColorInvalid : this._rc.accentColor);
        this._ctx.font = `${italic ? 'italic ' : ''}${textWeight} ${this._rc.textSize}px Arial`;
        this._ctx.textAlign = textAlign;
        this._ctx.textBaseline = 'middle';

        switch (textAlign) {
            case 'center':
                this._ctx.fillText(text, x + (width / 2), y + (this._rc.lineHeight / 2),  width - 2 * this._rc.lineMargin);
                break;
            case 'left':
                this._ctx.fillText(text, x + this._rc.lineMargin, y + (this._rc.lineHeight / 2),  width - 2 * this._rc.lineMargin);

                // TODO: refactor this to a generic underlining function
                if (puc) {
                    this._ctx.beginPath();
                    this._ctx.moveTo(x + this._rc.lineMargin + this._ctx.measureText(puc.prefix).width,
                                     y + (this._rc.lineHeight / 2) + (this._rc.textSize / 2) + this._rc.underlineDelta);
                    this._ctx.lineTo(x + this._rc.lineMargin + this._ctx.measureText(puc.prefix).width + this._ctx.measureText(puc.underlined).width,
                                     y + (this._rc.lineHeight / 2) + (this._rc.textSize / 2) + this._rc.underlineDelta);
                    this._ctx.lineWidth = this._rc.borderSize;
                    this._ctx.strokeStyle = isSelected ? (isInvalid ? this._rc.accentColorInvalidSelected : this._rc.accentColorSelected)
                        : (isInvalid ? this._rc.accentColorInvalid : this._rc.accentColor);
                    this._ctx.stroke();
                }

                break;
            default:
                this._ctx.fillText(text, x, y + (this._rc.lineHeight / 2), width - 2 * this._rc.lineMargin);
                break;
        }
    }
}