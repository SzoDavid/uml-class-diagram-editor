import {PositionalNode} from '../PositionalNode.ts';
import {InvalidNodeParameterCause} from '../types.ts';
import {EditorConstants} from '../../constants.ts';
import {GeometryUtils} from '../../GeometryUtils.ts';

export class ConnectionPoint extends PositionalNode {

    constructor(x: number, y: number) {
        super(x, y);
    }

    clone(): ConnectionPoint {
        const clone = new ConnectionPoint(this.x, this.y);
        clone.isSelected = this.isSelected;
        clone.isDragging = this.isDragging;

        return clone;
    }

    copy(node: ConnectionPoint): void {
        this.x = node.x;
        this.y = node.y;
    }

    validate(): InvalidNodeParameterCause[] {
        return [];
    }

    containsDot(x: number, y: number): boolean {
        return GeometryUtils.isPointWithinRadius(x, y, this.x, this.y, EditorConstants.maxClickDistance);
    }
}