import { PositionalNode } from '../PositionalNode';
import { ConnectionPoint } from './ConnectionPoint';

export class LooseConnectionPoint extends ConnectionPoint {
    node: PositionalNode;
    
    constructor(node: PositionalNode) {
        super(node.x, node.y);
        this.node = node;
    }

    get x() {
        return this.node.x;
    }

    get y() {
        return this.node.y;
    }

    clone(): LooseConnectionPoint {
        const clone = new LooseConnectionPoint(this.node);
        clone.isSelected = this.isSelected;
        clone.isDragging = this.isDragging;

        return clone;
    }

    copy(node: LooseConnectionPoint): void {
        this.node = node.node;
    }
}