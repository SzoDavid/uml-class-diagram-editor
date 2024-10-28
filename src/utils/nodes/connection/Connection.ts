import {Node} from '../Node.ts';
import {InvalidNodeParameterCause} from '../types.ts';
import {ConnectionPart} from './ConnectionPart.ts';
import {ConnectionPoint} from './ConnectionPoint.ts';
import {PositionalNode} from '../PositionalNode.ts';
import {Point} from '../../types.ts';

export class Connection extends Node {
    parts: ConnectionPart[];

    constructor(points: (Point|PositionalNode)[]) {
        super();
        this.parts = [];

        let previousPart = new ConnectionPart(points[0], points[1], this);
        this.parts.push(previousPart);

        for (let i = 2; i < points.length; i++) {
            const newPart = new ConnectionPart(previousPart.endPoint, points[i], this);
            this.parts.push(newPart);
            previousPart = newPart;
        }
    }

    validate(): InvalidNodeParameterCause[] {
        return [];
    }

    clone(): Connection {
        const points: ConnectionPoint[] = [];

        points.push(this.parts[0].startPoint);

        for (const part of this.parts) {
            points.push(part.endPoint);
        }

        const clone = new Connection(points);
        clone.isSelected = this.isSelected;
        clone.isDragging = this.isDragging;

        return clone;
    }

    copy(node: Connection) {
        this.parts = [...node.parts];
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
}