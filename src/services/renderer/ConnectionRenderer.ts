import {NodeRenderer} from './NodeRenderer.ts';
import {Connection} from '../../utils/nodes/connection/Connection.ts';
import {Point} from '../../utils/types.ts';
import {Generalization} from '../../utils/nodes/connection/Generalization.ts';
import {Association} from '../../utils/nodes/connection/Association.ts';
import {ConnectionPart} from '../../utils/nodes/connection/ConnectionPart.ts';
import {AssociationNavigability} from '../../utils/nodes/types.ts';
import {Aggregation} from '../../utils/nodes/connection/Aggregation.ts';

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

        this.renderEndDecorations(node, startPart, endPart);

        for (const point of node.points) {
            if (node.isSelected || point.isSelected) {
                this.renderPoint(point, true);
            }
        }
    }

    private renderPoint(point: Point, isSelected: boolean): void {
        this._nr.ctx.beginPath();
        this._nr.ctx.arc(point.x, point.y, this._nr.rc.dotSize, 0, 2 * Math.PI);
        this._nr.ctx.fillStyle = isSelected ? this._nr.rc.accentColorSelected : this._nr.rc.accentColor;
        this._nr.ctx.fill();
    }

    private renderEndDecorations(connection: Connection, startPart: ConnectionPart, endPart: ConnectionPart): void {
        if (connection instanceof Generalization) {
            this.handleGeneralization(connection, startPart, endPart);
        } else if (connection instanceof Association) {
            if (connection.showOwnership) {
                if (connection.reversedOwnership) {
                    this.renderPoint(startPart.startPoint, false);
                } else {
                    this.renderPoint(endPart.endPoint, false);
                }
            }
            switch (connection.startNavigability) {
                case AssociationNavigability.NAVIGABLE:
                    this.renderTriangle(
                        startPart.startPoint,
                        startPart.angle,
                        connection.isSelected || startPart.startPoint.isSelected
                    );
                    break;
                case AssociationNavigability.UNNAVIGABLE:
                    this.renderCross(
                        startPart.startPoint,
                        startPart.angle,
                        connection.isSelected || startPart.startPoint.isSelected
                    );
                    break;
            }
            switch (connection.endNavigability) {
                case AssociationNavigability.NAVIGABLE:
                    this.renderTriangle(
                        endPart.endPoint,
                        endPart.angle + Math.PI,
                        connection.isSelected || endPart.endPoint.isSelected
                    );
                    break;
                case AssociationNavigability.UNNAVIGABLE:
                    this.renderCross(
                        endPart.endPoint,
                        endPart.angle + Math.PI,
                        connection.isSelected || endPart.endPoint.isSelected
                    );
                    break;
            }

            // TODO: render texts
        } else if (connection instanceof Aggregation) {
            if (connection.isStartShared) {
                this.renderDiamond(
                    startPart.startPoint,
                    startPart.angle,
                    connection.isSelected || startPart.startPoint.isSelected
                );
            }
            if (connection.isEndShared) {
                this.renderDiamond(
                    endPart.endPoint,
                    endPart.angle + Math.PI,
                    connection.isSelected || endPart.endPoint.isSelected
                );
            }

            // TODO: render texts
        }
    }

    private handleGeneralization(connection: Generalization, startPart: ConnectionPart, endPart: ConnectionPart) {
        if (connection.reversed) {
            this.renderFilledTriangle(
                startPart.startPoint,
                startPart.angle,
                connection.isSelected || startPart.startPoint.isSelected
            );
        } else {
            this.renderFilledTriangle(
                endPart.endPoint,
                endPart.angle + Math.PI,
                connection.isSelected || endPart.endPoint.isSelected
            );
        }
    }

    // TODO: move constants to settings
    private renderFilledTriangle(point: Point, angle: number, isSelected: boolean = false): void {
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

    private renderTriangle(point: Point, angle: number, isSelected: boolean = false): void {
        this._nr.ctx.beginPath();
        this._nr.ctx.moveTo(point.x, point.y);
        this._nr.ctx.lineTo(point.x + 20 * Math.cos(angle + (Math.PI / 8)), point.y + 20 * Math.sin(angle + (Math.PI / 8)));
        this._nr.ctx.moveTo(point.x, point.y);
        this._nr.ctx.lineTo(point.x + 20 * Math.cos(angle - (Math.PI / 8)), point.y + 20 * Math.sin(angle - (Math.PI / 8)));

        this._nr.ctx.strokeStyle = isSelected ? this._nr.rc.accentColorSelected : this._nr.rc.accentColor;
        this._nr.ctx.stroke();
    }

    private renderCross(point: Point, angle: number, isSelected: boolean = false): void {
        const startX = point.x + 20 * Math.cos(angle);
        const startY = point.y + 20 * Math.sin(angle);

        this._nr.ctx.beginPath();
        this._nr.ctx.moveTo(startX + 10 * Math.cos(angle + (Math.PI / 4)), startY + 10 * Math.sin(angle + (Math.PI / 4)));
        this._nr.ctx.lineTo(startX - 10 * Math.cos(angle + (Math.PI / 4)), startY - 10 * Math.sin(angle + (Math.PI / 4)));

        this._nr.ctx.moveTo(startX + 10 * Math.cos(angle - (Math.PI / 4)), startY + 10 * Math.sin(angle - (Math.PI / 4)));
        this._nr.ctx.lineTo(startX - 10 * Math.cos(angle - (Math.PI / 4)), startY - 10 * Math.sin(angle - (Math.PI / 4)));

        this._nr.ctx.strokeStyle = isSelected ? this._nr.rc.accentColorSelected : this._nr.rc.accentColor;
        this._nr.ctx.stroke();
    }

    private renderDiamond(point: Point, angle: number, isSelected: boolean = false, isFilled: boolean = false): void {
        this._nr.ctx.beginPath();
        this._nr.ctx.moveTo(point.x, point.y);
        this._nr.ctx.lineTo(point.x + 20 * Math.cos(angle + (Math.PI / 8)), point.y + 20 * Math.sin(angle + (Math.PI / 8)));
        // 36.955 = 2 * 20 * cos(pi/8)
        this._nr.ctx.lineTo(point.x + 36.955 * Math.cos(angle), point.y + 36.995 * Math.sin(angle));
        this._nr.ctx.lineTo(point.x + 20 * Math.cos(angle - (Math.PI / 8)), point.y + 20 * Math.sin(angle - (Math.PI / 8)));
        this._nr.ctx.lineTo(point.x, point.y);

        this._nr.ctx.fillStyle = isFilled
            ? (isSelected ? this._nr.rc.accentColorSelected : this._nr.rc.accentColor)
            : (isSelected ?  this._nr.rc.fillColorSelected : this._nr.rc.fillColor);
        this._nr.ctx.fill();

        this._nr.ctx.strokeStyle = isSelected ? this._nr.rc.accentColorSelected : this._nr.rc.accentColor;
        this._nr.ctx.stroke();
    }
}