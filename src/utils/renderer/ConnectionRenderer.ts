import {NodeRenderer} from './NodeRenderer.ts';
import {Connection} from '../nodes/connection/Connection.ts';
import {Point} from '../types.ts';
import {ConnectionType} from '../nodes/types.ts';
import {LooseConnectionPoint} from '../nodes/connection/ConnectionPoint.ts';

export class ConnectionRenderer {
    private _nr: NodeRenderer;

    constructor(nr: NodeRenderer) {
        this._nr = nr;
    }

    public render(node: Connection): void {
        this._nr.ctx.lineWidth = this._nr.rc.borderSize;

        const startPart = node.parts[0];
        const endPart = node.parts[node.parts.length - 1];

        this._nr.ctx.beginPath();
        this._nr.ctx.moveTo(startPart.startPoint.x, startPart.startPoint.y);

        for (let i = 0; i < node.parts.length - 1; i++) {
            const part = node.parts[i];
            
            this._nr.ctx.lineTo(part.endPoint.x, part.endPoint.y);

            this._nr.ctx.strokeStyle = node.isSelected || part.isSelected ? this._nr.rc.accentColorSelected : this._nr.rc.accentColor;
            this._nr.ctx.stroke();

            this._nr.ctx.beginPath();
            this._nr.ctx.moveTo(node.parts[i + 1].startPoint.x, node.parts[i + 1].startPoint.y);
        }

        this._nr.ctx.lineTo(endPart.endPoint.x, endPart.endPoint.y);

        this._nr.ctx.strokeStyle = node.isSelected || node.parts[node.parts.length - 1].isSelected ? this._nr.rc.accentColorSelected : this._nr.rc.accentColor;
        this._nr.ctx.stroke();

        if (startPart.startPoint instanceof LooseConnectionPoint) {
            this.renderDecoratedPoint(startPart.startPoint, node, startPart.angle);
        }

        if (endPart.endPoint instanceof LooseConnectionPoint) {
            this.renderDecoratedPoint(endPart.endPoint, node, endPart.angle + Math.PI);
        }

        for (const point of node.points) {
            if (node.isSelected || point.isSelected) {
                this.renderPoint(point.x, point.y);
            }
        }
    }

    private renderPoint(x: number, y: number): void {
        this._nr.ctx.beginPath();
        this._nr.ctx.arc(x, y, this._nr.rc.dotSize, 0, 2 * Math.PI);
        this._nr.ctx.fillStyle = this._nr.rc.accentColorSelected;
        this._nr.ctx.fill();
    }

    private renderDecoratedPoint(point: LooseConnectionPoint, connection: Connection, angle: number): void {
        switch (point.type) {
            case ConnectionType.ASSOCIATION:
                this.renderTriangle(
                    point,
                    angle,
                    connection.isSelected || point.isSelected
                );
                break;
        }
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