import {Connection} from './Connection.ts';
import {PositionalNode} from '../PositionalNode.ts';
import {Point} from '../../types.ts';

export class Generalization extends Connection {
    public reversed: boolean = false;

    constructor(points: (Point | PositionalNode)[]) {
        super(points);
    }

    clone(): Generalization {
        const clone = new Generalization([]);
        this.basicClone(clone);
        clone.reversed = this.reversed;

        return clone;
    }

    copy(node: Generalization) {
        super.copy(node);
        this.reversed = node.reversed;
    }
}