import {Connection} from './Connection.ts';
import {PositionalNode} from '../PositionalNode.ts';
import {Point} from '../../types.ts';

export class Generalization extends Connection {
    public reversed: boolean = false;

    constructor(points: (Point | PositionalNode)[]) {
        super(points);
    }

    clone(): Connection {
        const clone = new Generalization([]);
        clone.points = [...this.points];
        clone.parts = [...this.parts];

        clone.isSelected = this.isSelected;
        clone.isDragging = this.isDragging;
        clone.reversed = this.reversed;

        return clone;
    }

    copy(node: Generalization) {
        super.copy(node);
        this.reversed = node.reversed;
    }
}