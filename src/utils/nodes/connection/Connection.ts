import {Node} from '../Node.ts';
import {InvalidNodeParameterCause} from '../types.ts';
import {ConnectionPart} from './ConnectionPart.ts';
import {BasicConnectionPoint, ConnectionPoint, LooseConnectionPoint} from './ConnectionPoint.ts';
import {PositionalNode} from '../PositionalNode.ts';
import {Point} from '../../types.ts';

export abstract class Connection extends Node {
    parts: ConnectionPart[] = [];
    points: ConnectionPoint[] = [];

    protected constructor(points: (Point|PositionalNode)[]) {
        super();

        for (const point of points) {
            this.points.push(this.parsePoint(point));
        }

        for (let i = 0; i < this.points.length - 1; i++) {
            this.parts.push(new ConnectionPart(i, i + 1, this));
        }
    }

    get startPoint(): ConnectionPoint {
        return this.parts[0].startPoint;
    }

    get endPoint(): ConnectionPoint {
        return this.parts[this.parts.length - 1].endPoint;
    }

    validate(): InvalidNodeParameterCause[] {
        return [];
    }

    copy(node: Connection): void {
        this.parts = [...node.parts];
        this.points = [...node.points];
    }

    containsDot(x: number, y: number): boolean {
        let contains = false;
        this.parts.forEach(part => { if (part.containsDot(x, y)) contains = true; });
        return contains;
    }

    deselect(): void {
        super.deselect();
        this.parts.forEach(part => part.deselect());
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

    protected basicClone(clone: Connection): void {
        clone.points = [...this.points];
        clone.parts = [...this.parts];
        clone.isSelected = this.isSelected;
        clone.isDragging = this.isDragging;
    }
}