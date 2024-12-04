import {Connection} from './Connection.ts';
import {PositionalNode} from '../PositionalNode.ts';
import {Point} from '../../types.ts';
import {MultiplicityRange} from '../features/MultiplicityRange.ts';

export class Composition extends Connection {
    NODE_TYPE= 'Composition';

    public reversed: boolean = false;

    public startName: string = '';
    public startMultiplicity: MultiplicityRange = new MultiplicityRange(null);

    public endName: string = '';
    public endMultiplicity: MultiplicityRange = new MultiplicityRange(null);

    constructor(points: (Point | PositionalNode)[]) {
        super(points);
    }

    clone(): Composition {
        const clone = new Composition([]);
        this.basicClone(clone);
        clone.reversed = this.reversed;

        clone.startName = this.startName;
        clone.startMultiplicity = this.startMultiplicity;

        clone.endName = this.endName;
        clone.endMultiplicity = this.endMultiplicity;

        return clone;
    }

    copy(node: Composition) {
        super.copy(node);
        this.reversed = node.reversed;

        this.startName = node.startName;
        this.startMultiplicity = node.startMultiplicity;

        this.endName = node.endName;
        this.endMultiplicity = node.endMultiplicity;
    }
}