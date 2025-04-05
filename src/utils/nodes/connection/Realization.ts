import { Connection } from './Connection.ts';
import { PositionalNode } from '../PositionalNode.ts';
import { Point } from '../../types.ts';
import { ConnectionPoint } from './ConnectionPoint.ts';
import { ConnectionPart } from './ConnectionPart.ts';
import { Node } from '../Node.ts';
import { SerializationRegistryService } from '../../../services/SerializationRegistryService.ts';

const CLASS_TAG = 'Realization';

export class Realization extends Connection {
    public reversed = false;

    public constructor(points: (Point | PositionalNode)[]) {
        super(points);
    }

    clone(): Realization {
        const clone = new Realization([]);
        this.basicClone(clone);
        clone.reversed = this.reversed;

        return clone;
    }

    copy(node: Realization) {
        super.copy(node);
        this.reversed = node.reversed;
    }

    //region Serializable members

    toSerializable(): object {
        const obj: any = super.toSerializable();
        obj['tag'] = CLASS_TAG;
        obj['reversed'] = this.reversed;

        return obj;
    }

    static fromSerializable(data: any, previousNodes: Node[]): Realization {
        const deserialized = new Realization([]);
        deserialized.points = data.points.map((point: any) =>
            ConnectionPoint.fromSerializable(
                point,
                deserialized,
                previousNodes,
            ),
        );
        deserialized.parts = data.parts.map((part: any) =>
            ConnectionPart.fromSerializable(part, deserialized),
        );

        deserialized.reversed = data.reversed;

        return deserialized;
    }

    //endregion
}

SerializationRegistryService.register(CLASS_TAG, Realization);
