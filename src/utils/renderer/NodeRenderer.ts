import {RenderConfiguration} from './RenderConfiguration.ts';
import {ClassifierNode} from '../nodes/ClassifierNode.ts';
import {Node} from '../nodes/Node.ts';
import {ClassifierNodeRenderer} from './ClassifierNodeRenderer.ts';
import {PrimitiveTypeNode} from '../nodes/PrimitiveTypeNode.ts';
import {EnumerationNode} from '../nodes/EnumerationNode.ts';

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
    puc?: PartialUnderlineContext|null,
    isTabbed?: boolean
}

export class NodeRenderer {
    private _classifierRenderer: ClassifierNodeRenderer;
    readonly ctx: CanvasRenderingContext2D;
    readonly rc: RenderConfiguration;
    
    constructor(ctx: CanvasRenderingContext2D, renderConfig: RenderConfiguration) {
        this.ctx = ctx;
        this.rc = renderConfig;
        this._classifierRenderer = new ClassifierNodeRenderer(this);
    }

    public render(node: Node) {
        if (node instanceof ClassifierNode) {
            this._classifierRenderer.render(node);
        } else if (node instanceof PrimitiveTypeNode) {
            this.ctx.font = `bold ${this.rc.textSize}px Arial`;

            node.width = Math.max(
                this.rc.defaultWidth,
                this.ctx.measureText(node.name).width + 2 * this.rc.lineMargin,
                this.ctx.measureText('«Primitive»').width + 2 * this.rc.lineMargin,
            );

            this.drawHeader(node.x, node.y, node.width, node.name, 'Primitive',
                            node.isSelected, node.validate().length > 0, false);
            node.height = this.rc.lineHeight * 2;
        } else if (node instanceof EnumerationNode) {
            //TODO
        }
    }

    drawHeader(x: number, y: number, width: number, name: string, header: string, isSelected: boolean, isInvalid: boolean, isItalic: boolean) {
        this.drawRect(x, y, width, this.rc.lineHeight * (header ? 2 : 1), isSelected, isInvalid);

        if (header) {
            this.drawText(`«${header}»`, x, y, width, {
                isSelected: isSelected,
                isInvalid: isInvalid,
                textWeight: 'bold',
                textAlign: 'center'
            });
        }

        this.drawText(name, x, y + (header ? this.rc.lineHeight : 0), width, {
            isSelected: isSelected,
            isInvalid: isInvalid,
            textWeight: 'bold',
            italic: isItalic,
            textAlign: 'center'
        });
    }

    drawRect(x: number, y: number, width: number, height: number, isSelected=false, isInvalid=false): void {
        this.ctx.beginPath();
        this.ctx.rect(x, y, width, height);

        this.ctx.fillStyle = isSelected ? (isInvalid ? this.rc.fillColorInvalidSelected : this.rc.fillColorSelected)
            : (isInvalid ? this.rc.fillColorInvalid : this.rc.fillColor);
        this.ctx.fill();
        this.ctx.lineWidth = this.rc.borderSize;
        this.ctx.strokeStyle = isSelected ? (isInvalid ? this.rc.accentColorInvalidSelected : this.rc.accentColorSelected)
            : (isInvalid ? this.rc.accentColorInvalid : this.rc.accentColor);
        this.ctx.stroke();
    }

    drawText(text: string,
             x: number,
             y: number,
             width: number,
             {
                 isSelected = false,
                 isInvalid = false,
                 textWeight = 'normal',
                 italic = false,
                 textAlign = 'left',
                 puc = null,
                 isTabbed = false,
             }: TextProperties = {}): void {
        this.ctx.beginPath();
        this.ctx.fillStyle = isSelected ? (isInvalid ? this.rc.accentColorInvalidSelected : this.rc.accentColorSelected)
            : (isInvalid ? this.rc.accentColorInvalid : this.rc.accentColor);
        this.ctx.font = `${italic ? 'italic ' : ''}${textWeight} ${this.rc.textSize}px Arial`;
        this.ctx.textAlign = textAlign;
        this.ctx.textBaseline = 'middle';

        let xDelta = 0;
        let wDelta = 0;
        let uDelta = 0;

        switch (textAlign) {
            case 'center':
                xDelta = (width / 2) + (isTabbed ? this.rc.tabSize : 0);
                wDelta = -2 * this.rc.lineMargin;
                uDelta = -1 * this.ctx.measureText(text).width / 2;
                break;
            case 'left':
                xDelta = this.rc.lineMargin + (isTabbed ? this.rc.tabSize : 0);
                wDelta = -2 * this.rc.lineMargin;
                break;
        }

        this.ctx.fillText(text, x + xDelta, y + (this.rc.lineHeight / 2),  width + wDelta);

        if (puc) {
            this.ctx.beginPath();

            this.ctx.moveTo(x + xDelta + uDelta + this.ctx.measureText(puc.prefix).width,
                            y + (this.rc.lineHeight / 2) + (this.rc.textSize / 2) + this.rc.underlineDelta);
            this.ctx.lineTo(x + xDelta + uDelta + this.ctx.measureText(puc.prefix).width + this.ctx.measureText(puc.underlined).width,
                            y + (this.rc.lineHeight / 2) + (this.rc.textSize / 2) + this.rc.underlineDelta);

            this.ctx.lineWidth = this.rc.borderSize;
            this.ctx.strokeStyle = isSelected ? (isInvalid ? this.rc.accentColorInvalidSelected : this.rc.accentColorSelected)
                : (isInvalid ? this.rc.accentColorInvalid : this.rc.accentColor);
            this.ctx.stroke();
        }
    }
}