import {Node} from '../Node.ts';
import {InvalidNodeParameterCause} from '../types.ts';
import {ConnectionPart} from './ConnectionPart.ts';

export class Connection extends Node {
    parts: ConnectionPart[];

    constructor(parts: ConnectionPart[]) {
        super();
        this.parts = parts;
    }

    validate(): InvalidNodeParameterCause[] {
        return [];
    }

    clone(): Connection {
        const clone = new Connection(this.parts);
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
}