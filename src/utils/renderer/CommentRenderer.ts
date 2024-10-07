import {NodeRenderer} from './NodeRenderer.ts';
import {CommentNode} from '../nodes/CommentNode.ts';

export class CommentRenderer {
    private _nr: NodeRenderer;

    constructor(nr: NodeRenderer) {
        this._nr = nr;
    }

    public render(node: CommentNode): void {
        const invalid = node.validate().length > 0;

        node.width = Math.max(node.width, this._nr.rc.defaultWidth);


        const lines = this.getLines(node.text, node.width);
        node.height = lines.length * this._nr.rc.lineHeight;

        this.drawCommentBox(node.x, node.y, node.width, node.height, node.isSelected, invalid);

        lines.forEach((line, index) => {
            this._nr.drawText(line, node.x, node.y + index * this._nr.rc.lineHeight, 
                              node.width - (index === 0 ? this._nr.rc.lineHeight / 2 : 0), {
                                  isSelected: node.isSelected,
                                  isInvalid: invalid
                              });
        });
    }

    private getLines(text: string, maxWidth: number): string[] {
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        this._nr.ctx.font = `${this._nr.rc.textSize}px Arial`;

        words.forEach((word) => {
            if (this._nr.ctx.measureText(currentLine + word).width < maxWidth - (lines.length === 0 ? this._nr.rc.lineHeight / 2 : 0)) {
                currentLine += word + ' ';
            } else {
                lines.push(currentLine.trim());
                currentLine = word + ' ';
            }
        });

        if (currentLine) {
            lines.push(currentLine.trim());
        }

        return lines;
    }

    private drawCommentBox(x: number, y: number, width: number, height: number, isSelected: boolean, isInvalid: boolean): void {
        const foldSize = this._nr.rc.lineHeight / 2;
        const strokeStyle = isSelected ? (isInvalid ? this._nr.rc.accentColorInvalidSelected : this._nr.rc.accentColorSelected)
            : (isInvalid ? this._nr.rc.accentColorInvalid : this._nr.rc.accentColor);

        // Main rectangle with cut corner
        this._nr.ctx.beginPath();
        this._nr.ctx.moveTo(x, y);
        this._nr.ctx.lineTo(x + width - foldSize, y);
        this._nr.ctx.lineTo(x + width, y + foldSize);
        this._nr.ctx.lineTo(x + width, y + height);
        this._nr.ctx.lineTo(x, y + height);
        this._nr.ctx.closePath();

        this._nr.ctx.fillStyle = isSelected ? (isInvalid ? this._nr.rc.fillColorInvalidSelected : this._nr.rc.fillColorSelected)
            : (isInvalid ? this._nr.rc.fillColorInvalid : this._nr.rc.fillColor);
        this._nr.ctx.fill();
        this._nr.ctx.lineWidth = this._nr.rc.borderSize;
        this._nr.ctx.strokeStyle = strokeStyle;
        this._nr.ctx.stroke();

        // Folded effect for corner
        this._nr.ctx.beginPath();
        this._nr.ctx.moveTo(x + width - foldSize, y);
        this._nr.ctx.lineTo(x + width - foldSize, y + foldSize);
        this._nr.ctx.lineTo(x + width, y + foldSize);
        this._nr.ctx.closePath();

        this._nr.ctx.lineWidth = this._nr.rc.borderSize;
        this._nr.ctx.strokeStyle = strokeStyle;
        this._nr.ctx.stroke();
    }
}