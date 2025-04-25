import { Connection } from './Connection.ts';
import { PositionalNode } from '../PositionalNode.ts';
import { Point } from '../../types.ts';
import { ConnectionPoint } from './ConnectionPoint.ts';
import { ConnectionPart } from './ConnectionPart.ts';
import { Node } from '../Node.ts';
import { SerializationRegistryService } from '../../../services/SerializationRegistryService.ts';
import { PixelOffset } from '../types.ts';

const CLASS_TAG = 'Usage';

export class Usage extends Connection {
    public reversed = false;
    public nameOffset: PixelOffset = { x: 0, y: 0 };

    public constructor(points: (Point | PositionalNode)[]) {
        super(points);
    }

    clone(): Usage {
        const clone = new Usage([]);
        this.basicClone(clone);
        clone.reversed = this.reversed;
        clone.nameOffset = this.nameOffset;

        return clone;
    }

    copy(node: Usage) {
        super.copy(node);
        this.reversed = node.reversed;
        this.nameOffset = node.nameOffset;
    }

    //region Serializable members

    toSerializable(): object {
        const obj: any = super.toSerializable();
        obj['tag'] = CLASS_TAG;
        obj['reversed'] = this.reversed;
        obj['nameOffset'] = { ...this.nameOffset };

        return obj;
    }

    static fromSerializable(data: any, previousNodes: Node[]): Usage {
        const deserialized = new Usage([]);
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
        deserialized.nameOffset = { ...data.nameOffset };

        return deserialized;
    }

    //endregion
}

SerializationRegistryService.register(CLASS_TAG, Usage);
