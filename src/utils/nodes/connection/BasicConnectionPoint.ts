import {ConnectionPoint} from './ConnectionPoint.ts';
import {PositionalNode} from '../PositionalNode.ts';
import {LooseConnectionPoint} from './LooseConnectionPoint.ts';

export class BasicConnectionPoint extends ConnectionPoint {
    clone(): BasicConnectionPoint {
        const clone = new BasicConnectionPoint(this.x, this.y, this.parent);
        clone.isSelected = this.isSelected;
        clone.isDragging = this.isDragging;

        return clone;
    }

    convertToLooseConnectionPoint(node: PositionalNode): LooseConnectionPoint {
        const newPoint = new LooseConnectionPoint(node, this.parent);

        if (this._parent.startPoint === this) {
            this._parent.startPoint = newPoint;
        } else {
            this._parent.endPoint = newPoint;
        }

        return newPoint;
    }
}