import {NodeRenderer} from './NodeRenderer.ts';
import {Connection} from '../nodes/connection/Connection.ts';
import {LooseConnectionPoint} from '../nodes/connection/LooseConnectionPoint.ts';
import {Point} from '../types.ts';
import {GeometryUtils} from '../GeometryUtils.ts';

export class ConnectionRenderer {
    private _nr: NodeRenderer;

    constructor(nr: NodeRenderer) {
        this._nr = nr;
    }

    public render(node: Connection): void {
        this._nr.ctx.lineWidth = this._nr.rc.borderSize;

        node.parts.forEach(part => {
            this._nr.ctx.beginPath();

            let startPoint: Point = part.startPoint;
            if (part.startPoint instanceof LooseConnectionPoint) {
                const intersection = GeometryUtils.findIntersectionPoint(part.endPoint, part.startPoint.node);
                if (!intersection || (part.endPoint instanceof LooseConnectionPoint && part.startPoint.node.containsDot(part.endPoint.displayPoint.x, part.endPoint.displayPoint.y))) return;
                part.startPoint.displayPoint = intersection;
                startPoint = intersection;
            }

            let endPoint: Point = part.endPoint;
            if (part.endPoint instanceof LooseConnectionPoint) {
                const intersection = GeometryUtils.findIntersectionPoint(part.startPoint, part.endPoint.node);
                if (!intersection || (part.startPoint instanceof LooseConnectionPoint && part.endPoint.node.containsDot(part.startPoint.displayPoint.x, part.startPoint.displayPoint.y))) return;
                part.endPoint.displayPoint = intersection;
                endPoint = intersection;
            }

            this._nr.ctx.moveTo(startPoint.x, startPoint.y);
            this._nr.ctx.lineTo(endPoint.x, endPoint.y);

            this._nr.ctx.strokeStyle = node.isSelected || part.isSelected ? this._nr.rc.accentColorSelected : this._nr.rc.accentColor;
            this._nr.ctx.stroke();
        });

        const startPoint = node.parts[0].startPoint;
        if (node.isSelected || startPoint.isSelected) {
            if (startPoint instanceof LooseConnectionPoint) this.renderPoint(startPoint.displayPoint.x, startPoint.displayPoint.y);
            else this.renderPoint(startPoint.x, startPoint.y);
        }

        node.parts.forEach(part => {
            if (node.isSelected || part.endPoint.isSelected) {
                if (part.endPoint instanceof LooseConnectionPoint) this.renderPoint(part.endPoint.displayPoint.x, part.endPoint.displayPoint.y);
                else this.renderPoint(part.endPoint.x, part.endPoint.y);
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