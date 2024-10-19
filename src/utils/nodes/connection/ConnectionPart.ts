import {Node} from '../Node.ts';
import {ConnectionPoint} from './ConnectionPoint.ts';
import {InvalidNodeParameterCause} from '../types.ts';
import {EditorConstants} from '../../constants.ts';
import {GeometryUtils} from '../../GeometryUtils.ts';

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
        return GeometryUtils.isPointOnLine(
            x, y, 
            this.startPoint.x, 
            this.startPoint.y, 
            this.endPoint.x, 
            this.endPoint.y, 
            EditorConstants.maximumClickDistance
        );
    }

    deselect() {
        super.deselect();
        this.startPoint.deselect();
        this.endPoint.deselect();
    }
}