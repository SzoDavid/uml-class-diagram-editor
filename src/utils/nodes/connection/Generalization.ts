import { Connection } from './Connection.ts';
import { PositionalNode } from '../PositionalNode.ts';
import { Point } from '../../types.ts';
import { SerializationRegistryService } from '../../../services/SerializationRegistryService.ts';
import { ConnectionPoint } from './ConnectionPoint.ts';
import { ConnectionPart } from './ConnectionPart.ts';
import { Node } from '../Node.ts';

const CLASS_TAG = 'Generalization';

export class Generalization extends Connection {
    public reversed = false;

    public constructor(points: (Point | PositionalNode)[]) {
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

    //region Serializable members

    toSerializable(): object {
        const obj: any = super.toSerializable();
        obj['tag'] = CLASS_TAG;
        obj['reversed'] = this.reversed;

        return obj;
    }

    static fromSerializable(data: any, previousNodes: Node[]): Generalization {
        const deserialized = new Generalization([]);
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

SerializationRegistryService.register(CLASS_TAG, Generalization);
