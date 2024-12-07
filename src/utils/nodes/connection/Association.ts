import {Connection} from './Connection.ts';
import {Point} from '../../types.ts';
import {PositionalNode} from '../PositionalNode.ts';
import {MultiplicityRange} from '../features/MultiplicityRange.ts';
import {AssociationNavigability} from '../types.ts';
import {SerializationRegistryService} from '../../../services/SerializationRegistryService.ts';
import {ConnectionPoint} from './ConnectionPoint.ts';
import {Node} from '../Node.ts';
import {ConnectionPart} from './ConnectionPart.ts';

const CLASS_TAG = 'Association';

export class Association extends Connection {
    public associationName: string = '';
    public showOwnership: boolean = false;
    public reversedOwnership: boolean = false;

    public startName: string = '';
    public startMultiplicity: MultiplicityRange = new MultiplicityRange(null);
    public startNavigability: AssociationNavigability = AssociationNavigability.UNSPECIFIED;

    public endName: string = '';
    public endMultiplicity: MultiplicityRange = new MultiplicityRange(null);
    public endNavigability: AssociationNavigability = AssociationNavigability.UNSPECIFIED;

    constructor(points: (Point | PositionalNode)[]) {
        super(points);
    }

    clone(): Association {
        const clone = new Association([]);
        this.basicClone(clone);

        clone.associationName = this.associationName;
        clone.showOwnership = this.showOwnership;
        clone.reversedOwnership = this.reversedOwnership;

        clone.startName = this.startName;
        clone.startMultiplicity = this.startMultiplicity;
        clone.startNavigability = this.startNavigability;

        clone.endName = this.endName;
        clone.endMultiplicity = this.endMultiplicity;
        clone.endNavigability = this.endNavigability;

        return clone;
    }

    copy(node: Association): void {
        super.copy(node);

        this.associationName = node.associationName;
        this.showOwnership = node.showOwnership;
        this.reversedOwnership = node.reversedOwnership;

        this.startName = node.startName;
        this.startMultiplicity = node.startMultiplicity;
        this.startNavigability = node.startNavigability;

        this.endName = node.endName;
        this.endMultiplicity = node.endMultiplicity;
        this.endNavigability = node.endNavigability;
    }

    //region Serializable members

    toSerializable(): object {
        const obj: any = super.toSerializable();
        obj['tag'] = CLASS_TAG;

        obj['associationName'] = this.associationName;
        obj['showOwnership'] = this.showOwnership;
        obj['reversedOwnership'] = this.reversedOwnership;

        obj['startName'] = this.startName;
        obj['startMultiplicity'] = this.startMultiplicity;
        obj['startNavigability'] = this.startNavigability;

        obj['endName'] = this.endName;
        obj['endMultiplicity'] = this.endMultiplicity;
        obj['endNavigability'] = this.endNavigability;

        return obj;
    }

    static fromSerializable(data: any, previousNodes: Node[]): Association {
        const deserialized = new Association([]);
        deserialized.points = data.points.map((point: any) => ConnectionPoint.fromSerializable(point, deserialized, previousNodes));
        deserialized.parts = data.parts.map((part: any) => ConnectionPart.fromSerializable(part, deserialized));

        deserialized.associationName = data.associationName;
        deserialized.showOwnership = data.showOwnership;
        deserialized.reversedOwnership = data.reversedOwnership;

        deserialized.startName = data.startName;
        deserialized.startMultiplicity = MultiplicityRange.fromSerializable(data.startMultiplicity);
        deserialized.startNavigability = data.startNavigability;

        deserialized.endName = data.endName;
        deserialized.endMultiplicity = MultiplicityRange.fromSerializable(data.endMultiplicity);
        deserialized.endNavigability = data.endNavigability;

        return deserialized;
    }

    //endregion
}

SerializationRegistryService.register(CLASS_TAG, Association);
