import { PositionalNode } from '../PositionalNode';
import { ConnectionPoint } from './ConnectionPoint';
import {GeometryUtils} from '../../GeometryUtils.ts';
import {EditorConstants} from '../../constants.ts';
import {Point} from '../../types.ts';

export class LooseConnectionPoint extends ConnectionPoint implements Point {
    node: PositionalNode;

    private _displayPoint: Point;
    
    constructor(node: PositionalNode) {
        super(node.x + (node.width / 2), node.y + (node.height / 2));

        this._displayPoint = {
            x: node.x + (node.width / 2),
            y: node.y + (node.height / 2)};

        this.node = node;
    }

    get x(): number {
        return this.node.x + (this.node.width / 2);
    }

    get y(): number {
        return this.node.y + (this.node.height / 2);
    }

    get displayPoint(): Point {
        return this._displayPoint;
    }

    set displayPoint(value: Point) {
        this._displayPoint = value;
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

    containsDot(x: number, y: number): boolean {
        return GeometryUtils.isPointWithinRadius(x, y, this._displayPoint.x, this._displayPoint.y, EditorConstants.maxClickDistance);
    }
}