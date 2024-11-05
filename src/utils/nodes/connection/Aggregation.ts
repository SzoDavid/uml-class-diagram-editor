import {Connection} from './Connection.ts';
import {MultiplicityRange} from '../features/MultiplicityRange.ts';
import {PositionalNode} from '../PositionalNode.ts';
import {Point} from '../../types.ts';

export class Aggregation extends Connection {
    public startName: string = '';
    public isStartShared: boolean = false;
    public startMultiplicity: MultiplicityRange = new MultiplicityRange(null);

    public endName: string = '';
    public isEndShared: boolean = true;
    public endMultiplicity: MultiplicityRange = new MultiplicityRange(null);

    constructor(points: (Point | PositionalNode)[]) {
        super(points);
    }

    clone(): Aggregation {
        const clone = new Aggregation([]);
        this.basicClone(clone);

        clone.startName = this.startName;
        clone.isStartShared = this.isStartShared;
        clone.startMultiplicity = this.startMultiplicity;

        clone.endName = this.endName;
        clone.isEndShared = this.isEndShared;
        clone.endMultiplicity = this.endMultiplicity;

        return clone;
    }

    copy(node: Aggregation): void {
        super.copy(node);

        this.startName = node.startName;
        this.isStartShared = node.isStartShared;
        this.startMultiplicity = node.startMultiplicity;

        this.endName = node.endName;
        this.isEndShared = node.isEndShared;
        this.endMultiplicity = node.endMultiplicity;
    }
}