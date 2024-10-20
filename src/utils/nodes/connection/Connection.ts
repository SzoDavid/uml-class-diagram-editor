import {Node} from '../Node.ts';
import {InvalidNodeParameterCause} from '../types.ts';
import {ConnectionPart} from './ConnectionPart.ts';
import {ConnectionPoint} from './ConnectionPoint.ts';

export class Connection extends Node {
    parts: ConnectionPart[];

    constructor(points: ConnectionPoint[]) {
        super();
        this.parts = [];

        for (let i = 0; i < points.length - 1; i++) {
            this.parts.push(new ConnectionPart(this, points[i], points[i+1]));
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