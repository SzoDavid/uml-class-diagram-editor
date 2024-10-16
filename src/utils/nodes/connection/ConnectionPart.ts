import {Node} from '../Node.ts';
import {ConnectionPoint} from './ConnectionPoint.ts';
import {InvalidNodeParameterCause} from '../types.ts';

export class ConnectionPart extends Node {
    startPoint: ConnectionPoint;
    endPoint: ConnectionPoint;

    constructor(startPoint: ConnectionPoint, endPoint: ConnectionPoint) {
        super();
        this.startPoint = startPoint;
        this.endPoint = endPoint;
    }

    validate(): InvalidNodeParameterCause[] {
        return [];
    }

    clone(): ConnectionPart {
        const clone = new ConnectionPart(this.startPoint, this.endPoint);
        clone.isSelected = this.isSelected;
        clone.isDragging = this.isDragging;

        return clone;
    }

    copy(node: ConnectionPart) {
        this.startPoint.copy(node.startPoint);
        this.endPoint.copy(node.endPoint);
    }

    containsDot(x: number, y: number): boolean {
        const numerator = Math.abs(
            (this.endPoint.y - this.startPoint.y) * x
            - (this.endPoint.x - this.startPoint.x) * y
            + this.endPoint.x * this.startPoint.y
            - this.endPoint.y * this.startPoint.x
        );
        const denominator = Math.sqrt(
            Math.pow(this.endPoint.y - this.startPoint.y, 2)
            + Math.pow(this.endPoint.x - this.startPoint.x, 2)
        );
        const distance = numerator / denominator;

        if (distance > 10) { //TODO make constant
            return false;
        }

        // Check if point is within the bounding box of start and end point
        return x >= Math.min(this.startPoint.x, this.endPoint.x) &&
            x <= Math.max(this.startPoint.x, this.endPoint.x) &&
            y >= Math.min(this.startPoint.y, this.endPoint.y) &&
            y <= Math.max(this.startPoint.y, this.endPoint.y);
    }
}