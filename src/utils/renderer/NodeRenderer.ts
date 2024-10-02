import {RenderConfiguration} from './RenderConfiguration.ts';

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
    protected readonly _ctx: CanvasRenderingContext2D;
    protected readonly _rc: RenderConfiguration;
    
    constructor(ctx: CanvasRenderingContext2D, renderConfig: RenderConfiguration) {
        this._ctx = ctx;
        this._rc = renderConfig;
    }

    protected drawRect(x: number, y: number, width: number, height: number, isSelected=false, isInvalid=false): void {
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

    protected drawText(text: string,
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
        this._ctx.beginPath();
        this._ctx.fillStyle = isSelected ? (isInvalid ? this._rc.accentColorInvalidSelected : this._rc.accentColorSelected)
            : (isInvalid ? this._rc.accentColorInvalid : this._rc.accentColor);
        this._ctx.font = `${italic ? 'italic ' : ''}${textWeight} ${this._rc.textSize}px Arial`;
        this._ctx.textAlign = textAlign;
        this._ctx.textBaseline = 'middle';

        let xDelta = 0;
        let wDelta = 0;
        let uDelta = 0;

        switch (textAlign) {
            case 'center':
                xDelta = (width / 2) + (isTabbed ? this._rc.tabSize : 0);
                wDelta = -2 * this._rc.lineMargin;
                uDelta = -1 * this._ctx.measureText(text).width / 2;
                break;
            case 'left':
                xDelta = this._rc.lineMargin + (isTabbed ? this._rc.tabSize : 0);
                wDelta = -2 * this._rc.lineMargin;
                break;
        }

        this._ctx.fillText(text, x + xDelta, y + (this._rc.lineHeight / 2),  width + wDelta);

        if (puc) {
            this._ctx.beginPath();

            this._ctx.moveTo(x + xDelta + uDelta + this._ctx.measureText(puc.prefix).width,
                             y + (this._rc.lineHeight / 2) + (this._rc.textSize / 2) + this._rc.underlineDelta);
            this._ctx.lineTo(x + xDelta + uDelta + this._ctx.measureText(puc.prefix).width + this._ctx.measureText(puc.underlined).width,
                             y + (this._rc.lineHeight / 2) + (this._rc.textSize / 2) + this._rc.underlineDelta);

            this._ctx.lineWidth = this._rc.borderSize;
            this._ctx.strokeStyle = isSelected ? (isInvalid ? this._rc.accentColorInvalidSelected : this._rc.accentColorSelected)
                : (isInvalid ? this._rc.accentColorInvalid : this._rc.accentColor);
            this._ctx.stroke();
        }
    }
}