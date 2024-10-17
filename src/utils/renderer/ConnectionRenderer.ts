import {NodeRenderer} from './NodeRenderer.ts';
import {Connection} from '../nodes/connection/Connection.ts';

export class ConnectionRenderer {
    private _nr: NodeRenderer;

    constructor(nr: NodeRenderer) {
        this._nr = nr;
    }

    public render(node: Connection) {
        this._nr.ctx.lineWidth = this._nr.rc.borderSize;

        node.parts.forEach(part => {
            this._nr.ctx.beginPath();
            this._nr.ctx.moveTo(part.startPoint.x, part.startPoint.y);
            this._nr.ctx.lineTo(part.endPoint.x, part.endPoint.y);

            this._nr.ctx.strokeStyle = node.isSelected || part.isSelected ? this._nr.rc.accentColorSelected : this._nr.rc.accentColor;
            this._nr.ctx.stroke();
        });

        if (node.parts[0].startPoint.isSelected) {
            this._nr.ctx.beginPath();
            this._nr.ctx.arc(node.parts[0].startPoint.x, node.parts[0].startPoint.y, 5, 0, 2 * Math.PI);
            this._nr.ctx.fillStyle = this._nr.rc.accentColorSelected;
            this._nr.ctx.fill();
        }

        node.parts.forEach(part => {
            if (part.endPoint.isSelected) {
                this._nr.ctx.beginPath();
                this._nr.ctx.arc(part.endPoint.x, part.endPoint.y, 5, 0, 2 * Math.PI);
                this._nr.ctx.fillStyle = this._nr.rc.accentColorSelected;
                this._nr.ctx.fill();
            }
        });
    }
}