import {NodeRenderer} from './NodeRenderer.ts';
import {Connection} from '../../utils/nodes/connection/Connection.ts';
import {Point} from '../../utils/types.ts';
import {Generalization} from '../../utils/nodes/connection/Generalization.ts';
import {Association} from '../../utils/nodes/connection/Association.ts';
import {ConnectionPart} from '../../utils/nodes/connection/ConnectionPart.ts';
import {AssociationNavigability} from '../../utils/nodes/types.ts';
import {Aggregation} from '../../utils/nodes/connection/Aggregation.ts';
import {Composition} from '../../utils/nodes/connection/Composition.ts';
import {LooseConnectionPoint} from '../../utils/nodes/connection/ConnectionPoint.ts';
import {GeometryUtils} from '../../utils/GeometryUtils.ts';

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
        if (connection instanceof Association) {
            this.handleAssociation(connection, startPart, endPart);
        } else if (connection instanceof Aggregation) {
            this.handleAggregation(connection, startPart, endPart);
        } else if (connection instanceof Composition) {
            this.handleComposition(connection, startPart, endPart);
        } else if (connection instanceof Generalization) {
            this.handleGeneralization(connection, startPart, endPart);
        }
    }

    private handleAggregation(connection: Aggregation, startPart: ConnectionPart, endPart: ConnectionPart): void {
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

        this.renderEndTexts(connection, startPart, endPart);
    }

    private handleAssociation(connection: Association, startPart: ConnectionPart, endPart: ConnectionPart): void {
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

        this.renderEndTexts(connection, startPart, endPart);

        if (!connection.associationName) return;

        if (connection.parts.length % 2 === 1) {
            const midPart = connection.parts[Math.floor(connection.parts.length / 2)];
            const midPoint = {
                x: (midPart.startPoint.x + midPart.endPoint.x) / 2,
                y: (midPart.startPoint.y + midPart.endPoint.y) / 2,
            };

            const angle = GeometryUtils.normalizeRadians(midPart.angle);
            const isSelected = connection.isSelected || midPart.isSelected;

            if ((angle  > Math.PI / 4 && angle < 3 * Math.PI / 4) || (angle > 5 * Math.PI / 4 && angle < 7 * Math.PI / 4)) {
                this._nr.drawText(
                    connection.associationName,
                    midPoint.x + 10,
                    midPoint.y - (this._nr.rc.lineHeight / 2),
                    -1,
                    {isSelected: isSelected, textAlign: 'left'}
                );
            } else {
                this._nr.drawText(
                    connection.associationName,
                    midPoint.x,
                    midPoint.y - (this._nr.rc.lineHeight / 2) - 10,
                    -1,
                    {isSelected: isSelected, textAlign: 'center'}
                );
            }
        } else {
            const midPart = connection.parts[Math.floor(connection.parts.length / 2)];
            const midPoint = midPart.startPoint;
            const isSelected = connection.isSelected || midPoint.isSelected;

            this._nr.drawText(
                connection.associationName,
                midPoint.x,
                midPoint.y - (this._nr.rc.lineHeight / 2) - 10,
                -1,
                {isSelected: isSelected, textAlign: 'center'}
            );
        }
    }

    private handleComposition(connection: Composition, startPart: ConnectionPart, endPart: ConnectionPart): void {
        if (connection.reversed) {
            this.renderDiamond(
                startPart.startPoint,
                startPart.angle,
                connection.isSelected || startPart.startPoint.isSelected,
                true
            );
        } else {
            this.renderDiamond(
                endPart.endPoint,
                endPart.angle + Math.PI,
                connection.isSelected || endPart.endPoint.isSelected,
                true
            );
        }

        this.renderEndTexts(connection, startPart, endPart);
    }

    private handleGeneralization(connection: Generalization, startPart: ConnectionPart, endPart: ConnectionPart): void {
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
        this._nr.ctx.lineTo(point.x + 15 * Math.cos(angle + (Math.PI / 8)), point.y + 15 * Math.sin(angle + (Math.PI / 8)));
        // 27.716 = 2 * 15 * cos(pi/8)
        this._nr.ctx.lineTo(point.x + 27.716 * Math.cos(angle), point.y + 27.716 * Math.sin(angle));
        this._nr.ctx.lineTo(point.x + 15 * Math.cos(angle - (Math.PI / 8)), point.y + 15 * Math.sin(angle - (Math.PI / 8)));
        this._nr.ctx.lineTo(point.x, point.y);

        this._nr.ctx.fillStyle = isFilled
            ? (isSelected ? this._nr.rc.accentColorSelected : this._nr.rc.accentColor)
            : (isSelected ?  this._nr.rc.fillColorSelected : this._nr.rc.fillColor);
        this._nr.ctx.fill();

        this._nr.ctx.strokeStyle = isSelected ? this._nr.rc.accentColorSelected : this._nr.rc.accentColor;
        this._nr.ctx.stroke();
    }

    private renderEndTexts(connection: Composition|Aggregation|Association, startPart: ConnectionPart, endPart: ConnectionPart): void {
        this.renderEndText(
            startPart.startPoint,
            connection.startMultiplicity.toString(),
            connection.startName,
            startPart.angle,
            connection.isSelected || startPart.startPoint.isSelected
        );
        this.renderEndText(
            endPart.endPoint,
            connection.endMultiplicity.toString(),
            connection.endName,
            endPart.angle + Math.PI,
            connection.isSelected || endPart.endPoint.isSelected
        );
    }

    private renderEndText(point: Point, textA: string, textB: string, angle: number, isSelected: boolean = false): void {
        const len = this._nr.rc.lineHeight * Math.sqrt(2);

        const coords = {
            x: point.x + len * Math.cos(angle),
            y: point.y + len * Math.sin(angle)
        };

        angle = GeometryUtils.normalizeRadians(angle);

        if (point instanceof LooseConnectionPoint) {
            if (point.x === point.node.x || point.x === point.node.x + point.node.width) {
                this.renderEndTextVertically(coords, 40, textA, textB, isSelected, angle < Math.PI / 2 || angle > 3 * Math.PI / 2);
            } else {
                this.renderEndTextHorizontally(coords, 40, textA, textB, isSelected);
            }
            return;
        }

        if ((angle  > Math.PI / 4 && angle < 3 * Math.PI / 4) || (angle > 5 * Math.PI / 4 && angle < 7 * Math.PI / 4)) {
            this.renderEndTextHorizontally(coords, 40, textA, textB, isSelected);
        } else {
            this.renderEndTextVertically(coords, 40, textA, textB, isSelected, angle < Math.PI / 2 || angle > 3 * Math.PI / 2);
        }
    }

    private renderEndTextVertically(point: Point, distance: number, topText: string, bottomText: string, isSelected: boolean, alignLeft: boolean): void {
        if (topText) this._nr.drawText(topText, point.x, point.y - (this._nr.rc.lineHeight / 2) + (distance / 2), -1, {isSelected: isSelected, textAlign: alignLeft ? 'left' : 'right'});
        if (bottomText) this._nr.drawText(bottomText, point.x, point.y - (this._nr.rc.lineHeight / 2) - (distance / 2), -1, {isSelected: isSelected, textAlign: alignLeft ? 'left' : 'right'});
    }

    private renderEndTextHorizontally(point: Point, distance: number, rightText: string, leftText: string, isSelected: boolean = false): void {
        if (leftText) this._nr.drawText(leftText, point.x - (distance / 2), point.y - (this._nr.rc.lineHeight / 2), -1, {isSelected: isSelected, textAlign: 'right'});
        if (rightText) this._nr.drawText(rightText, point.x + (distance / 2), point.y - (this._nr.rc.lineHeight / 2), -1, {isSelected: isSelected, textAlign: 'left'});
    }
}