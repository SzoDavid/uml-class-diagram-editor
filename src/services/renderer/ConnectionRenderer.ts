import { NodeRenderer } from './NodeRenderer.ts';
import { Connection } from '../../utils/nodes/connection/Connection.ts';
import { Point } from '../../utils/types.ts';
import { Generalization } from '../../utils/nodes/connection/Generalization.ts';
import { Association } from '../../utils/nodes/connection/Association.ts';
import { ConnectionPart } from '../../utils/nodes/connection/ConnectionPart.ts';
import {
    AssociationNavigability,
    PixelOffset,
} from '../../utils/nodes/types.ts';
import { Aggregation } from '../../utils/nodes/connection/Aggregation.ts';
import { Composition } from '../../utils/nodes/connection/Composition.ts';
import { LooseConnectionPoint } from '../../utils/nodes/connection/ConnectionPoint.ts';
import { GeometryUtils } from '../../utils/GeometryUtils.ts';

export class ConnectionRenderer {
    private _nr: NodeRenderer;

    constructor(nr: NodeRenderer) {
        this._nr = nr;
    }

    public render(node: Connection): void {
        let invalid = false;
        const nodeErrors = node.validate();
        if (nodeErrors.length > 0) {
            console.error({
                message: 'Node is invalid',
                node: node,
                errors: nodeErrors,
            });
            if (this._nr.rc.showInvalidity) invalid = true;
        }

        this._nr.ctx.lineWidth = this._nr.rc.borderSize;

        const startPart = node.parts[0];
        const endPart = node.parts[node.parts.length - 1];

        this._nr.ctx.beginPath();
        this._nr.ctx.moveTo(startPart.startPoint.x, startPart.startPoint.y);

        for (let i = 0; i < node.parts.length - 1; i++) {
            const part = node.parts[i];

            this._nr.ctx.lineTo(part.endPoint.x, part.endPoint.y);

            this._nr.ctx.strokeStyle = this._nr.getColor(
                true,
                node.isSelected || part.isSelected,
                invalid,
            );
            this._nr.ctx.stroke();

            this._nr.ctx.beginPath();
            this._nr.ctx.moveTo(
                node.parts[i + 1].startPoint.x,
                node.parts[i + 1].startPoint.y,
            );
        }

        this._nr.ctx.lineTo(endPart.endPoint.x, endPart.endPoint.y);

        this._nr.ctx.strokeStyle = this._nr.getColor(
            true,
            node.isSelected || node.parts[node.parts.length - 1].isSelected,
            invalid,
        );
        this._nr.ctx.stroke();

        this.renderEndDecorations(node, startPart, endPart, invalid);

        for (const point of node.points) {
            if (node.isSelected || point.isSelected) {
                this.renderPoint(point, true, invalid);
            }
        }
    }

    private renderPoint(
        point: Point,
        isSelected: boolean,
        isInvalid: boolean,
    ): void {
        this._nr.ctx.beginPath();
        this._nr.ctx.arc(point.x, point.y, this._nr.rc.dotSize, 0, 2 * Math.PI);
        this._nr.ctx.fillStyle = this._nr.getColor(true, isSelected, isInvalid);
        this._nr.ctx.fill();
    }

    private renderEndDecorations(
        connection: Connection,
        startPart: ConnectionPart,
        endPart: ConnectionPart,
        isInvalid: boolean,
    ): void {
        if (connection instanceof Association) {
            this.handleAssociation(connection, startPart, endPart, isInvalid);
        } else if (connection instanceof Aggregation) {
            this.handleAggregation(connection, startPart, endPart, isInvalid);
        } else if (connection instanceof Composition) {
            this.handleComposition(connection, startPart, endPart, isInvalid);
        } else if (connection instanceof Generalization) {
            this.handleGeneralization(
                connection,
                startPart,
                endPart,
                isInvalid,
            );
        }
    }

    private handleAggregation(
        connection: Aggregation,
        startPart: ConnectionPart,
        endPart: ConnectionPart,
        isInvalid: boolean,
    ): void {
        if (connection.isStartShared) {
            this.renderDiamond(
                startPart.startPoint,
                startPart.angle,
                connection.isSelected || startPart.startPoint.isSelected,
                false,
                isInvalid,
            );
        }
        if (connection.isEndShared) {
            this.renderDiamond(
                endPart.endPoint,
                endPart.angle + Math.PI,
                connection.isSelected || endPart.endPoint.isSelected,
                false,
                isInvalid,
            );
        }

        this.renderEndTexts(connection, startPart, endPart, isInvalid);
    }

    private handleAssociation(
        connection: Association,
        startPart: ConnectionPart,
        endPart: ConnectionPart,
        isInvalid: boolean,
    ): void {
        if (connection.showOwnership) {
            if (connection.reversedOwnership) {
                this.renderPoint(startPart.startPoint, false, isInvalid);
            } else {
                this.renderPoint(endPart.endPoint, false, isInvalid);
            }
        }
        switch (connection.startNavigability) {
            case AssociationNavigability.NAVIGABLE:
                this.renderTriangle(
                    startPart.startPoint,
                    startPart.angle,
                    connection.isSelected || startPart.startPoint.isSelected,
                    isInvalid,
                );
                break;
            case AssociationNavigability.UNNAVIGABLE:
                this.renderCross(
                    startPart.startPoint,
                    startPart.angle,
                    connection.isSelected || startPart.startPoint.isSelected,
                    isInvalid,
                );
                break;
        }
        switch (connection.endNavigability) {
            case AssociationNavigability.NAVIGABLE:
                this.renderTriangle(
                    endPart.endPoint,
                    endPart.angle + Math.PI,
                    connection.isSelected || endPart.endPoint.isSelected,
                    isInvalid,
                );
                break;
            case AssociationNavigability.UNNAVIGABLE:
                this.renderCross(
                    endPart.endPoint,
                    endPart.angle + Math.PI,
                    connection.isSelected || endPart.endPoint.isSelected,
                    isInvalid,
                );
                break;
        }

        this.renderEndTexts(connection, startPart, endPart, isInvalid);

        if (!connection.associationName) return;

        if (connection.parts.length % 2 === 1) {
            const midPart =
                connection.parts[Math.floor(connection.parts.length / 2)];
            const midPoint = {
                x:
                    (midPart.startPoint.x + midPart.endPoint.x) / 2 +
                    connection.nameOffset.x,
                y:
                    (midPart.startPoint.y + midPart.endPoint.y) / 2 +
                    connection.nameOffset.y,
            };

            const angle = GeometryUtils.normalizeRadians(midPart.angle);
            const isSelected = connection.isSelected || midPart.isSelected;

            if (
                (angle > Math.PI / 4 && angle < (3 * Math.PI) / 4) ||
                (angle > (5 * Math.PI) / 4 && angle < (7 * Math.PI) / 4)
            ) {
                this._nr.drawText(
                    connection.associationName,
                    midPoint.x + 10,
                    midPoint.y - this._nr.rc.lineHeight / 2,
                    -1,
                    {
                        isSelected: isSelected,
                        textAlign: 'left',
                        isInvalid: isInvalid,
                    },
                );
            } else {
                this._nr.drawText(
                    connection.associationName,
                    midPoint.x,
                    midPoint.y - this._nr.rc.lineHeight / 2 - 10,
                    -1,
                    {
                        isSelected: isSelected,
                        textAlign: 'center',
                        isInvalid: isInvalid,
                    },
                );
            }
        } else {
            const midPart =
                connection.parts[Math.floor(connection.parts.length / 2)];
            const midPoint = midPart.startPoint;
            const isSelected = connection.isSelected || midPoint.isSelected;

            this._nr.drawText(
                connection.associationName,
                midPoint.x,
                midPoint.y - this._nr.rc.lineHeight / 2 - 10,
                -1,
                {
                    isSelected: isSelected,
                    textAlign: 'center',
                    isInvalid: isInvalid,
                },
            );
        }
    }

    private handleComposition(
        connection: Composition,
        startPart: ConnectionPart,
        endPart: ConnectionPart,
        isInvalid: boolean,
    ): void {
        if (connection.reversed) {
            this.renderDiamond(
                startPart.startPoint,
                startPart.angle,
                connection.isSelected || startPart.startPoint.isSelected,
                true,
                isInvalid,
            );
        } else {
            this.renderDiamond(
                endPart.endPoint,
                endPart.angle + Math.PI,
                connection.isSelected || endPart.endPoint.isSelected,
                true,
                isInvalid,
            );
        }

        this.renderEndTexts(connection, startPart, endPart, isInvalid);
    }

    private handleGeneralization(
        connection: Generalization,
        startPart: ConnectionPart,
        endPart: ConnectionPart,
        isInvalid: boolean,
    ): void {
        if (connection.reversed) {
            this.renderFilledTriangle(
                startPart.startPoint,
                startPart.angle,
                connection.isSelected || startPart.startPoint.isSelected,
                isInvalid,
            );
        } else {
            this.renderFilledTriangle(
                endPart.endPoint,
                endPart.angle + Math.PI,
                connection.isSelected || endPart.endPoint.isSelected,
                isInvalid,
            );
        }
    }

    // TODO: move constants to settings
    private renderFilledTriangle(
        point: Point,
        angle: number,
        isSelected = false,
        isInvalid = false,
    ): void {
        this._nr.ctx.beginPath();
        this._nr.ctx.moveTo(point.x, point.y);
        this._nr.ctx.lineTo(
            point.x + 20 * Math.cos(angle + Math.PI / 8),
            point.y + 20 * Math.sin(angle + Math.PI / 8),
        );
        this._nr.ctx.lineTo(
            point.x + 20 * Math.cos(angle - Math.PI / 8),
            point.y + 20 * Math.sin(angle - Math.PI / 8),
        );
        this._nr.ctx.lineTo(point.x, point.y);

        this._nr.ctx.fillStyle = this._nr.getColor(
            false,
            isSelected,
            isInvalid,
        );
        this._nr.ctx.fill();

        this._nr.ctx.strokeStyle = this._nr.getColor(
            true,
            isSelected,
            isInvalid,
        );
        this._nr.ctx.stroke();
    }

    private renderTriangle(
        point: Point,
        angle: number,
        isSelected = false,
        isInvalid = false,
    ): void {
        this._nr.ctx.beginPath();
        this._nr.ctx.moveTo(point.x, point.y);
        this._nr.ctx.lineTo(
            point.x + 20 * Math.cos(angle + Math.PI / 8),
            point.y + 20 * Math.sin(angle + Math.PI / 8),
        );
        this._nr.ctx.moveTo(point.x, point.y);
        this._nr.ctx.lineTo(
            point.x + 20 * Math.cos(angle - Math.PI / 8),
            point.y + 20 * Math.sin(angle - Math.PI / 8),
        );

        this._nr.ctx.strokeStyle = this._nr.getColor(
            true,
            isSelected,
            isInvalid,
        );
        this._nr.ctx.stroke();
    }

    private renderCross(
        point: Point,
        angle: number,
        isSelected = false,
        isInvalid = false,
    ): void {
        const startX = point.x + 20 * Math.cos(angle);
        const startY = point.y + 20 * Math.sin(angle);

        this._nr.ctx.beginPath();
        this._nr.ctx.moveTo(
            startX + 10 * Math.cos(angle + Math.PI / 4),
            startY + 10 * Math.sin(angle + Math.PI / 4),
        );
        this._nr.ctx.lineTo(
            startX - 10 * Math.cos(angle + Math.PI / 4),
            startY - 10 * Math.sin(angle + Math.PI / 4),
        );

        this._nr.ctx.moveTo(
            startX + 10 * Math.cos(angle - Math.PI / 4),
            startY + 10 * Math.sin(angle - Math.PI / 4),
        );
        this._nr.ctx.lineTo(
            startX - 10 * Math.cos(angle - Math.PI / 4),
            startY - 10 * Math.sin(angle - Math.PI / 4),
        );

        this._nr.ctx.strokeStyle = this._nr.getColor(
            true,
            isSelected,
            isInvalid,
        );
        this._nr.ctx.stroke();
    }

    private renderDiamond(
        point: Point,
        angle: number,
        isSelected = false,
        isFilled = false,
        isInvalid = false,
    ): void {
        this._nr.ctx.beginPath();
        this._nr.ctx.moveTo(point.x, point.y);
        this._nr.ctx.lineTo(
            point.x + 15 * Math.cos(angle + Math.PI / 8),
            point.y + 15 * Math.sin(angle + Math.PI / 8),
        );
        // 27.716 = 2 * 15 * cos(pi/8)
        this._nr.ctx.lineTo(
            point.x + 27.716 * Math.cos(angle),
            point.y + 27.716 * Math.sin(angle),
        );
        this._nr.ctx.lineTo(
            point.x + 15 * Math.cos(angle - Math.PI / 8),
            point.y + 15 * Math.sin(angle - Math.PI / 8),
        );
        this._nr.ctx.lineTo(point.x, point.y);

        this._nr.ctx.fillStyle = this._nr.getColor(
            isFilled,
            isSelected,
            isInvalid,
        );
        this._nr.ctx.fill();

        this._nr.ctx.strokeStyle = this._nr.getColor(
            true,
            isSelected,
            isInvalid,
        );
        this._nr.ctx.stroke();
    }

    private renderEndTexts(
        connection: Composition | Aggregation | Association,
        startPart: ConnectionPart,
        endPart: ConnectionPart,
        isInvalid: boolean,
    ): void {
        this.renderEndText(
            startPart.startPoint,
            connection.startNameOffset,
            connection.startMultiplicity.toString(),
            connection.startName,
            startPart.angle,
            connection.isSelected || startPart.startPoint.isSelected,
            isInvalid,
        );
        this.renderEndText(
            endPart.endPoint,
            connection.endNameOffset,
            connection.endMultiplicity.toString(),
            connection.endName,
            endPart.angle + Math.PI,
            connection.isSelected || endPart.endPoint.isSelected,
            isInvalid,
        );
    }

    private renderEndText(
        point: Point,
        offset: PixelOffset,
        textA: string,
        textB: string,
        angle: number,
        isSelected = false,
        isInvalid = false,
    ): void {
        if (!textA && !textB) return;

        const len = this._nr.rc.lineHeight * Math.sqrt(2);

        const coords = {
            x: point.x + len * Math.cos(angle) + offset.x,
            y: point.y + len * Math.sin(angle) + offset.y,
        };

        angle = GeometryUtils.normalizeRadians(angle);

        if (point instanceof LooseConnectionPoint) {
            if (
                point.x === point.node.x ||
                point.x === point.node.x + point.node.width
            ) {
                this.renderEndTextVertically(
                    coords,
                    40,
                    textA,
                    textB,
                    isSelected,
                    angle < Math.PI / 2 || angle > (3 * Math.PI) / 2,
                    isInvalid,
                );
            } else {
                this.renderEndTextHorizontally(
                    coords,
                    40,
                    textA,
                    textB,
                    isSelected,
                    isInvalid,
                );
            }
            return;
        }

        if (
            (angle > Math.PI / 4 && angle < (3 * Math.PI) / 4) ||
            (angle > (5 * Math.PI) / 4 && angle < (7 * Math.PI) / 4)
        ) {
            this.renderEndTextHorizontally(
                coords,
                40,
                textA,
                textB,
                isSelected,
                isInvalid,
            );
        } else {
            this.renderEndTextVertically(
                coords,
                40,
                textA,
                textB,
                isSelected,
                angle < Math.PI / 2 || angle > (3 * Math.PI) / 2,
                isInvalid,
            );
        }
    }

    private renderEndTextVertically(
        point: Point,
        distance: number,
        topText: string,
        bottomText: string,
        isSelected: boolean,
        alignLeft: boolean,
        isInvalid: boolean,
    ): void {
        if (topText)
            this._nr.drawText(
                topText,
                point.x,
                point.y - this._nr.rc.lineHeight / 2 + distance / 2,
                -1,
                {
                    isSelected: isSelected,
                    textAlign: alignLeft ? 'left' : 'right',
                    isInvalid: isInvalid,
                },
            );
        if (bottomText)
            this._nr.drawText(
                bottomText,
                point.x,
                point.y - this._nr.rc.lineHeight / 2 - distance / 2,
                -1,
                {
                    isSelected: isSelected,
                    textAlign: alignLeft ? 'left' : 'right',
                    isInvalid: isInvalid,
                },
            );
    }

    private renderEndTextHorizontally(
        point: Point,
        distance: number,
        rightText: string,
        leftText: string,
        isSelected = false,
        isInvalid = false,
    ): void {
        if (leftText)
            this._nr.drawText(
                leftText,
                point.x - distance / 2,
                point.y - this._nr.rc.lineHeight / 2,
                -1,
                {
                    isSelected: isSelected,
                    textAlign: 'right',
                    isInvalid: isInvalid,
                },
            );
        if (rightText)
            this._nr.drawText(
                rightText,
                point.x + distance / 2,
                point.y - this._nr.rc.lineHeight / 2,
                -1,
                {
                    isSelected: isSelected,
                    textAlign: 'left',
                    isInvalid: isInvalid,
                },
            );
    }
}
