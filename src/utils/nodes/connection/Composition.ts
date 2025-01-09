import {Connection} from './Connection.ts';
import {PositionalNode} from '../PositionalNode.ts';
import {Point} from '../../types.ts';
import {MultiplicityRange} from '../features/MultiplicityRange.ts';
import {SerializationRegistryService} from '../../../services/SerializationRegistryService.ts';
import {Node} from '../Node.ts';
import {ConnectionPoint} from './ConnectionPoint.ts';
import {ConnectionPart} from './ConnectionPart.ts';
import {PixelOffset} from '../types.ts';

const CLASS_TAG = 'Composition';

export class Composition extends Connection {
    public reversed: boolean = false;

    public startName: string = '';
    public startNameOffset: PixelOffset = { x: 0, y: 0 };
    public startMultiplicity: MultiplicityRange = new MultiplicityRange(null);

    public endName: string = '';
    public endNameOffset: PixelOffset = { x: 0, y: 0 };
    public endMultiplicity: MultiplicityRange = new MultiplicityRange(null);

    constructor(points: (Point | PositionalNode)[]) {
        super(points);
    }

    clone(): Composition {
        const clone = new Composition([]);
        this.basicClone(clone);
        clone.reversed = this.reversed;

        clone.startName = this.startName;
        clone.startNameOffset = { ...this.startNameOffset };
        clone.startMultiplicity = this.startMultiplicity;

        clone.endName = this.endName;
        clone.endNameOffset = { ...this.endNameOffset };
        clone.endMultiplicity = this.endMultiplicity;

        return clone;
    }

    copy(node: Composition) {
        super.copy(node);
        this.reversed = node.reversed;

        this.startName = node.startName;
        this.startNameOffset = { x: +node.startNameOffset.x, y: +node.startNameOffset.y };
        this.startMultiplicity = node.startMultiplicity;

        this.endName = node.endName;
        this.endNameOffset = { x: +node.endNameOffset.x, y: +node.endNameOffset.y };
        this.endMultiplicity = node.endMultiplicity;
    }

    //region Serializable members

    toSerializable(): object {
        const obj: any = super.toSerializable();
        obj['tag'] = CLASS_TAG;

        obj['reversed'] = this.reversed;

        obj['startName'] = this.startName;
        obj['startNameOffset'] = { ...this.startNameOffset };
        obj['startMultiplicity'] = this.startMultiplicity;

        obj['endName'] = this.endName;
        obj['endNameOffset'] = { ...this.endNameOffset };
        obj['endMultiplicity'] = this.endMultiplicity;

        return obj;
    }

    static fromSerializable(data: any, previousNodes: Node[]): Composition {
        const deserialized = new Composition([]);
        deserialized.points = data.points.map((point: any) => ConnectionPoint.fromSerializable(point, deserialized, previousNodes));
        deserialized.parts = data.parts.map((part: any) => ConnectionPart.fromSerializable(part, deserialized));

        deserialized.reversed = data.reversed;

        deserialized.startName = data.startName;
        deserialized.startNameOffset = { ...data.startNameOffset };
        deserialized.startMultiplicity = MultiplicityRange.fromSerializable(data.startMultiplicity);

        deserialized.endName = data.endName;
        deserialized.endNameOffset = { ...data.endNameOffset };
        deserialized.endMultiplicity = MultiplicityRange.fromSerializable(data.endMultiplicity);

        return deserialized;
    }

    //endregion
}

SerializationRegistryService.register(CLASS_TAG, Composition);
