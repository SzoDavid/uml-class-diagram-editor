import {Node} from '../Node.ts';
import {ConnectionPoint} from './ConnectionPoint.ts';
import {InvalidNodeParameterCause} from '../types.ts';
import {EditorConstants} from '../../constants.ts';
import {GeometryUtils} from '../../GeometryUtils.ts';
import {Connection} from './Connection.ts';
import {BasicConnectionPoint} from './BasicConnectionPoint.ts';
import {Point} from '../../types.ts';
import {PositionalNode} from '../PositionalNode.ts';
import {LooseConnectionPoint} from './LooseConnectionPoint.ts';

export class ConnectionPart extends Node {
    parent: Connection;
    startPoint: ConnectionPoint;
    endPoint: ConnectionPoint;

    constructor(startPoint: Point|PositionalNode, endPoint: Point|PositionalNode, parent: Connection) {
        super();
        this.parent = parent;
        this.startPoint = this.parsePoint(startPoint);
        this.endPoint = this.parsePoint(endPoint);
    }

    validate(): InvalidNodeParameterCause[] {
        return [];
    }

    clone(): ConnectionPart {
        const clone = new ConnectionPart(this.startPoint, this.endPoint, this.parent);
        clone.isSelected = this.isSelected;
        clone.isDragging = this.isDragging;

        return clone;
    }

    copy(node: ConnectionPart) {
        this.parent = node.parent;
        this.startPoint.copy(node.startPoint);
        this.endPoint.copy(node.endPoint);
    }

    containsDot(x: number, y: number): boolean {
        return GeometryUtils.isPointOnLine(
            x, y, 
            this.startPoint.x, 
            this.startPoint.y, 
            this.endPoint.x, 
            this.endPoint.y, 
            EditorConstants.maxClickDistance
        );
    }

    deselect() {
        super.deselect();
        this.startPoint.deselect();
        this.endPoint.deselect();
    }

    break() {
        const midPoint = new BasicConnectionPoint((this.startPoint.x + this.endPoint.x) / 2,
                                                  (this.startPoint.y + this.endPoint.y) / 2, this);

        const index = this.parent.parts.findIndex(part => part.startPoint === this.startPoint && part.endPoint === this.endPoint);

        const secondHalf = new ConnectionPart(midPoint, this.endPoint, this.parent);
        this.endPoint = midPoint;

        this.parent.parts.splice(index, 1, this, secondHalf);
    }

    private parsePoint(point: Point|PositionalNode): ConnectionPoint {
        if (point instanceof ConnectionPoint) {
            return point;
        }
        if (point instanceof PositionalNode) {
            return new LooseConnectionPoint(point, this);
        }
        return new BasicConnectionPoint(point.x, point.y, this);
    }
}