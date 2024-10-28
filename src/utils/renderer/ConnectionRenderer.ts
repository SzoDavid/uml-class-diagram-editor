import {NodeRenderer} from './NodeRenderer.ts';
import {Connection} from '../nodes/connection/Connection.ts';
import {LooseConnectionPoint} from '../nodes/connection/LooseConnectionPoint.ts';
import {Point} from '../types.ts';
import {GeometryUtils} from '../GeometryUtils.ts';
import {ConnectionType} from '../nodes/types.ts';

export class ConnectionRenderer {
    private _nr: NodeRenderer;

    constructor(nr: NodeRenderer) {
        this._nr = nr;
    }

    public render(node: Connection): void {
        this._nr.ctx.lineWidth = this._nr.rc.borderSize;

        // TODO: separate this logic for the connectionPoint
        let startPoint: Point = node.parts[0].startPoint;
        if (startPoint instanceof LooseConnectionPoint) {
            const intersection = GeometryUtils.findIntersectionPoint(node.parts[0].endPoint, startPoint.node);
            if (!intersection || 
                (
                    node.parts[0].endPoint instanceof LooseConnectionPoint && 
                    startPoint.node.containsDot(node.parts[0].endPoint.displayPoint.x, 
                                                node.parts[0].endPoint.displayPoint.y)
                )) return;
            startPoint.displayPoint = intersection;
            startPoint = intersection;
        }

        let endPoint: Point = node.parts[node.parts.length - 1].endPoint;
        if (endPoint instanceof LooseConnectionPoint) {
            const intersection = GeometryUtils.findIntersectionPoint(node.parts[node.parts.length - 1].startPoint, 
                                                                     endPoint.node);
            const lastStartPoint = node.parts[node.parts.length - 1].startPoint;
            if (!intersection || 
                (
                    lastStartPoint instanceof LooseConnectionPoint && 
                    endPoint.node.containsDot(lastStartPoint.displayPoint.x,
                                              lastStartPoint.displayPoint.y)
                )) return;
            endPoint.displayPoint = intersection;
            endPoint = intersection;
        }

        this._nr.ctx.beginPath();
        this._nr.ctx.moveTo(startPoint.x, startPoint.y);

        for (let i = 0; i < node.parts.length - 1; i++) {
            const part = node.parts[i];
            
            this._nr.ctx.lineTo(part.endPoint.x, part.endPoint.y);

            this._nr.ctx.strokeStyle = node.isSelected || part.isSelected ? this._nr.rc.accentColorSelected : this._nr.rc.accentColor;
            this._nr.ctx.stroke();

            this._nr.ctx.beginPath();
            this._nr.ctx.moveTo(node.parts[i + 1].startPoint.x, node.parts[i + 1].startPoint.y);
        }

        this._nr.ctx.lineTo(endPoint.x, endPoint.y);

        this._nr.ctx.strokeStyle = node.isSelected || node.parts[node.parts.length - 1].isSelected ? this._nr.rc.accentColorSelected : this._nr.rc.accentColor;
        this._nr.ctx.stroke();

        if (node.parts[0].startPoint instanceof LooseConnectionPoint) {
            switch (node.parts[0].startPoint.type) {
                case ConnectionType.ASSOCIATION:
                    this.renderTriangle(
                        startPoint,
                        GeometryUtils.calculateAngleBetweenPoints(startPoint, node.parts[0].endPoint),
                        node.isSelected || node.parts[0].startPoint.isSelected
                    );
                    break;
            }
        }

        if (node.parts[node.parts.length - 1].endPoint instanceof LooseConnectionPoint) {
            switch (node.parts[node.parts.length - 1].endPoint.type) {
                case ConnectionType.ASSOCIATION:
                    this.renderTriangle(
                        endPoint,
                        GeometryUtils.calculateAngleBetweenPoints(endPoint, node.parts[node.parts.length - 1].startPoint),
                        node.isSelected || node.parts[node.parts.length - 1].endPoint.isSelected
                    );
                    break;
            }
        }

        if (node.isSelected || node.parts[0].startPoint.isSelected) {
            this.renderPoint(startPoint.x, startPoint.y);
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

    private renderTriangle(point: Point, angle: number, isSelected: boolean = false): void {
        this._nr.ctx.beginPath();
        this._nr.ctx.moveTo(point.x, point.y);
        this._nr.ctx.lineTo(point.x + 20 * Math.cos(angle + (Math.PI / 8)), point.y + 20 * Math.sin(angle + (Math.PI / 8)));
        this._nr.ctx.lineTo(point.x + 20 * Math.cos(angle - (Math.PI / 8)), point.y + 20 * Math.sin(angle - (Math.PI / 8)));
        this._nr.ctx.lineTo(point.x, point.y);

        this._nr.ctx.fillStyle = isSelected ?  this._nr.rc.fillColorSelected : this._nr.rc.fillColor;
        this._nr.ctx.fill();

        this._nr.ctx.strokeStyle = isSelected ? this._nr.rc.accentColorSelected : this._nr.rc.accentColor;
        this._nr.ctx.stroke();
    }
}