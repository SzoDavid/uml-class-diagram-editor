import {PositionalNode} from '../PositionalNode.ts';
import {InvalidNodeParameterCause} from '../types.ts';
import {EditorConstants} from '../../constants.ts';
import {GeometryUtils} from '../../GeometryUtils.ts';
import {Point} from '../../types.ts';
import {ConnectionPart} from './ConnectionPart.ts';

export abstract class ConnectionPoint extends PositionalNode implements Point {
    protected _parent: ConnectionPart;

    constructor(x: number, y: number, parent: ConnectionPart) {
        super(x, y);
        this._parent = parent;
    }

    get parent(): ConnectionPart {
        return this._parent;
    }

    copy(node: ConnectionPoint): void {
        this.x = node.x;
        this.y = node.y;
        this._parent = node.parent;
    }

    validate(): InvalidNodeParameterCause[] {
        return [];
    }

    containsDot(x: number, y: number): boolean {
        return GeometryUtils.isPointWithinRadius(x, y, this.x, this.y, EditorConstants.maxClickDistance);
    }
}