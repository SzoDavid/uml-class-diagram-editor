import {Node} from '../Node.ts';
import {ConnectionPoint} from './ConnectionPoint.ts';
import {InvalidNodeParameterCause} from '../types.ts';
import {EditorConstants} from '../../constants.ts';
import {GeometryUtils} from '../../GeometryUtils.ts';
import {Connection} from './Connection.ts';

export class ConnectionPart extends Node {
    parent: Connection;
    startPoint: ConnectionPoint;
    endPoint: ConnectionPoint;

    constructor(parent: Connection, startPoint: ConnectionPoint, endPoint: ConnectionPoint) {
        super();
        this.parent = parent;
        this.startPoint = startPoint;
        this.endPoint = endPoint;
    }

    validate(): InvalidNodeParameterCause[] {
        return [];
    }

    clone(): ConnectionPart {
        const clone = new ConnectionPart(this.parent, this.startPoint, this.endPoint);
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
        const midPoint = new ConnectionPoint((this.startPoint.x + this.endPoint.x) / 2,
                                             (this.startPoint.y + this.endPoint.y) / 2);

        const index = this.parent.parts.findIndex(part => part.startPoint === this.startPoint && part.endPoint === this.endPoint);

        const secondHalf = new ConnectionPart(this.parent, midPoint, this.endPoint);
        this.endPoint = midPoint;

        this.parent.parts.splice(index, 1, this, secondHalf);
    }
}