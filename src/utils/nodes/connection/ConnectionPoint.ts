import {PositionalNode} from '../PositionalNode.ts';
import {InvalidNodeParameterCause} from '../types.ts';
import {EditorConstants} from '../../constants.ts';
import {GeometryUtils} from '../../GeometryUtils.ts';
import {Point} from '../../types.ts';
import {Connection} from './Connection.ts';

export abstract class ConnectionPoint extends PositionalNode implements Point {
    NODE_TYPE= 'ConnectionPoint';

    constructor(
        x: number,
        y: number,
        public parent: Connection
    ) {
        super(x, y);
    }

    get isStartPoint(): boolean {
        return this.parent.startPoint.x === this.x && this.parent.startPoint.y === this.y;
    }

    get isEndpoint(): boolean {
        return this.parent.endPoint.x === this.x && this.parent.endPoint.y === this.y;
    }

    copy(node: ConnectionPoint): void {
        this.x = node.x;
        this.y = node.y;
        this.parent = node.parent;
    }

    validate(): InvalidNodeParameterCause[] {
        return [];
    }

    containsDot(x: number, y: number): boolean {
        return GeometryUtils.isPointWithinRadius(x, y, this.x, this.y, EditorConstants.maxClickDistance);
    }

    remove(): void {
        const index = this.parent.points.indexOf(this);
        if (index < 0) throw new Error('Parent doesnt have given point');

        let found = false;

        if (this.isEndpoint) {
            this.parent.parts.splice(this.parent.parts.length - 1, 1);
            if (this.parent.parts.length === 0) return;
            found = true;
        }

        if (this.isStartPoint) {
            this.parent.parts.splice(0, 1);
            found = true;
        }

        let partIndex = -1;
        for (const [j, part] of this.parent.parts.entries()) {
            if (found) {
                if (part.startIndex > index) part.startIndex -= 1;
                if (part.endIndex > index) part.endIndex -= 1;
                continue;
            }

            if (part.startIndex !== index) continue;

            part.startIndex = this.parent.parts[j - 1].startIndex;
            partIndex = j - 1;
            if (part.endIndex > index) part.endIndex -= 1;
            found = true;
        }

        if (partIndex !== -1) this.parent.parts.splice(partIndex, 1);

        this.parent.points.splice(index, 1);
    }
}

export class BasicConnectionPoint extends ConnectionPoint {
    NODE_TYPE= 'BasicConnectionPoint';

    clone(): BasicConnectionPoint {
        const clone = new BasicConnectionPoint(this.x, this.y, this.parent);
        clone.isSelected = this.isSelected;
        clone.isDragging = this.isDragging;

        return clone;
    }

    copy(node: ConnectionPoint) {
        super.copy(node);
        this.x = node.x;
        this.y = node.y;
    }

    convertToLoosePoint(node: PositionalNode): LooseConnectionPoint {
        const index = this.parent.points.indexOf(this);
        if (index < 0) throw new Error('Parent doesnt have given point');

        const newPoint = new LooseConnectionPoint(node, this.parent);
        this.parent.points.splice(index, 1, newPoint);

        return newPoint;
    }
}

export class LooseConnectionPoint extends ConnectionPoint implements Point {
    NODE_TYPE= 'LooseConnectionPoint';

    constructor(
        public node: PositionalNode,
        parent: Connection
    ) {
        super(node.x + (node.width / 2), node.y + (node.height / 2), parent);
    }

    get x(): number {
        const otherPoint = this.isStartPoint
            ? this.parent.parts[0].endPoint
            : this.parent.parts[this.parent.parts.length - 1].startPoint;

        return GeometryUtils.findIntersectionPoint(otherPoint, this.node)?.x ?? NaN;
    }

    get y(): number {
        const otherPoint = this.isStartPoint
            ? this.parent.parts[0].endPoint
            : this.parent.parts[this.parent.parts.length - 1].startPoint;

        return GeometryUtils.findIntersectionPoint(otherPoint, this.node)?.y ?? NaN;
    }

    get snappingPoint(): Point {
        return {
            x: this.node.x + (this.node.width / 2),
            y: this.node.y + (this.node.height / 2)
        };
    }

    get isStartPoint(): boolean {
        return this.parent.startPoint instanceof LooseConnectionPoint
            && this.parent.startPoint.snappingPoint.x === this.snappingPoint.x
            && this.parent.startPoint.snappingPoint.y === this.snappingPoint.y;
    }

    get isEndpoint(): boolean {
        return this.parent.endPoint instanceof LooseConnectionPoint
            && this.parent.endPoint.snappingPoint.x === this.snappingPoint.x
            && this.parent.endPoint.snappingPoint.y === this.snappingPoint.y;
    }

    clone(): LooseConnectionPoint {
        const clone = new LooseConnectionPoint(this.node, this.parent);
        clone.isSelected = this.isSelected;
        clone.isDragging = this.isDragging;

        return clone;
    }

    copy(node: LooseConnectionPoint): void {
        this.parent = node.parent;
        this.node = node.node;
    }

    containsDot(x: number, y: number): boolean {
        return GeometryUtils.isPointWithinRadius(x, y, this.x, this.y, EditorConstants.maxClickDistance);
    }

    convertToBasicPoint(x: number, y: number): BasicConnectionPoint {
        const index = this.parent.points.indexOf(this);
        if (index < 0) throw new Error('Parent doesnt have given point');

        const newPoint = new BasicConnectionPoint(x, y, this.parent);
        this.parent.points.splice(index, 1, newPoint);

        return newPoint;
    }
}