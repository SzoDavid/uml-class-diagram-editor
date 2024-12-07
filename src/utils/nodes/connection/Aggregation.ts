import {Connection} from './Connection.ts';
import {MultiplicityRange} from '../features/MultiplicityRange.ts';
import {PositionalNode} from '../PositionalNode.ts';
import {Point} from '../../types.ts';
import {SerializationRegistryService} from '../../../services/SerializationRegistryService.ts';
import {ConnectionPart} from './ConnectionPart.ts';
import {Node} from '../Node.ts';
import {ConnectionPoint} from './ConnectionPoint.ts';

const CLASS_TAG = 'Aggregation';

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

    //region Serializable members

    toSerializable(): object {
        const obj: any = super.toSerializable();
        obj['tag'] = CLASS_TAG;

        obj['startName'] = this.startName;
        obj['isStartShared'] = this.isStartShared;
        obj['startMultiplicity'] = this.startMultiplicity;

        obj['endName'] = this.endName;
        obj['isEndShared'] = this.isEndShared;
        obj['endMultiplicity'] = this.endMultiplicity;

        return obj;
    }

    static fromSerializable(data: any, previousNodes: Node[]): Aggregation {
        const deserialized = new Aggregation([]);
        deserialized.points = data.points.map((point: any) => ConnectionPoint.fromSerializable(point, deserialized, previousNodes));
        deserialized.parts = data.parts.map((part: any) => ConnectionPart.fromSerializable(part, deserialized));

        deserialized.startName = data.startName;
        deserialized.isStartShared = data.isStartShared;
        deserialized.startMultiplicity = MultiplicityRange.fromSerializable(data.startMultiplicity);

        deserialized.endName = data.endName;
        deserialized.isEndShared = data.isEndShared;
        deserialized.endMultiplicity = MultiplicityRange.fromSerializable(data.endMultiplicity);

        return deserialized;
    }

    //endregion
}

SerializationRegistryService.register(CLASS_TAG, Aggregation);
