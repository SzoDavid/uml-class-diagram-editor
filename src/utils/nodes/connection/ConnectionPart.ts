import { Node } from '../Node.ts';
import { BasicConnectionPoint, ConnectionPoint } from './ConnectionPoint.ts';
import { InvalidNodeParameterCause } from '../types.ts';
import { EditorConstants } from '../../constants.ts';
import { GeometryUtils } from '../../GeometryUtils.ts';
import { Connection } from './Connection.ts';
import { Serializable } from '../Serializable.ts';

export class ConnectionPart extends Node implements Serializable {
    constructor(
        public startIndex: number,
        public endIndex: number,
        public parent: Connection,
    ) {
        super();
    }

    get startPoint(): ConnectionPoint {
        return this.parent.points[this.startIndex];
    }

    get endPoint(): ConnectionPoint {
        return this.parent.points[this.endIndex];
    }

    get angle(): number {
        return GeometryUtils.calculateAngleBetweenPoints(
            this.startPoint,
            this.endPoint,
        );
    }

    validate(): InvalidNodeParameterCause[] {
        return [];
    }

    clone(): ConnectionPart {
        const clone = new ConnectionPart(
            this.startIndex,
            this.endIndex,
            this.parent,
        );
        clone.isSelected = this.isSelected;
        clone.isDragging = this.isDragging;

        return clone;
    }

    copy(node: ConnectionPart): void {
        this.parent = node.parent;
        this.startPoint.copy(node.startPoint);
        this.endPoint.copy(node.endPoint);
    }

    containsDot(x: number, y: number): boolean {
        return GeometryUtils.isPointOnLine(
            x,
            y,
            this.startPoint.x,
            this.startPoint.y,
            this.endPoint.x,
            this.endPoint.y,
            EditorConstants.maxClickDistance,
        );
    }

    deselect(): void {
        super.deselect();
        this.startPoint.deselect();
        this.endPoint.deselect();
    }

    break(): void {
        const index = this.parent.parts.findIndex(
            (part) =>
                part.startIndex === this.startIndex &&
                part.endIndex === this.endIndex,
        );
        if (index < 0) throw new Error('Parent doesnt have given part');

        const midPoint = new BasicConnectionPoint(
            (this.startPoint.x + this.endPoint.x) / 2,
            (this.startPoint.y + this.endPoint.y) / 2,
            this.parent,
        );
        const pointIndex = this.parent.points.push(midPoint) - 1;

        const secondHalf = new ConnectionPart(
            pointIndex,
            this.endIndex,
            this.parent,
        );
        this.endIndex = pointIndex;

        this.parent.parts.splice(index, 1, this, secondHalf);
    }

    remove(): void {
        if (this.endPoint.isEndpoint) {
            this.endPoint.remove();
            return;
        }

        if (this.startPoint.isStartPoint) {
            this.startPoint.remove();
            return;
        }

        const startPoint = this.startPoint;
        const endPoint = this.endPoint;

        startPoint.remove();
        endPoint.remove();
    }

    //region Serializable members

    toSerializable(): object {
        return {
            startIndex: this.startIndex,
            endIndex: this.endIndex,
        };
    }

    static fromSerializable(data: any, parent: Connection): ConnectionPart {
        return new ConnectionPart(data.startIndex, data.endIndex, parent);
    }

    //endregion
}
