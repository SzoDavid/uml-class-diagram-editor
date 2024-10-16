import {PositionalNode} from '../PositionalNode.ts';
import {InvalidNodeParameterCause} from '../types.ts';

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
        return x >= this.x - 10 && // TODO make these constants
            x <= this.x + 10 &&
            y >= this.y - 10 &&
            y <= this.y + 10;
    }
}