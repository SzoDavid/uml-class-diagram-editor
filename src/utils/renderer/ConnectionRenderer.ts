import {NodeRenderer} from './NodeRenderer.ts';
import {Connection} from '../nodes/connection/Connection.ts';

export class ConnectionRenderer {
    private _nr: NodeRenderer;

    constructor(nr: NodeRenderer) {
        this._nr = nr;
    }

    public render(node: Connection): void {
        this._nr.ctx.lineWidth = this._nr.rc.borderSize;

        node.parts.forEach(part => {
            this._nr.ctx.beginPath();
            this._nr.ctx.moveTo(part.startPoint.x, part.startPoint.y);
            this._nr.ctx.lineTo(part.endPoint.x, part.endPoint.y);

            this._nr.ctx.strokeStyle = node.isSelected || part.isSelected ? this._nr.rc.accentColorSelected : this._nr.rc.accentColor;
            this._nr.ctx.stroke();
        });

        const startPoint = node.parts[0].startPoint;
        if (node.isSelected || startPoint.isSelected) {
            this.renderPoint(startPoint.x, startPoint.y);
        }

        node.parts.forEach(part => {
            if (node.isSelected || part.endPoint.isSelected) {
                this.renderPoint(part.endPoint.x, part.endPoint.y);
            }
        });
    }

    private renderPoint(x: number, y: number): void {
        this._nr.ctx.beginPath();
        this._nr.ctx.arc(x, y, this._nr.rc.dotSize, 0, 2 * Math.PI);
        this._nr.ctx.fillStyle = this._nr.rc.accentColorSelected;
        this._nr.ctx.fill();
    }
}