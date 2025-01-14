import {Connection} from './Connection.ts';
import {Point} from '../../types.ts';
import {PositionalNode} from '../PositionalNode.ts';
import {MultiplicityRange} from '../features/MultiplicityRange.ts';
import {AssociationNavigability, InvalidNodeParameterCause, PixelOffset} from '../types.ts';
import {SerializationRegistryService} from '../../../services/SerializationRegistryService.ts';
import {ConnectionPoint} from './ConnectionPoint.ts';
import {Node} from '../Node.ts';
import {ConnectionPart} from './ConnectionPart.ts';
import {validatePixelOffset} from '../../functions.ts';

const CLASS_TAG = 'Association';

export class Association extends Connection {
    public associationName: string = '';
    public nameOffset: PixelOffset = { x: 0, y: 0 };
    public showOwnership: boolean = false;
    public reversedOwnership: boolean = false;

    public startName: string = '';
    public startNameOffset: PixelOffset = { x: 0, y: 0 };
    public startMultiplicity: MultiplicityRange = new MultiplicityRange(null);
    public startNavigability: AssociationNavigability = AssociationNavigability.UNSPECIFIED;

    public endName: string = '';
    public endNameOffset: PixelOffset = { x: 0, y: 0 };
    public endMultiplicity: MultiplicityRange = new MultiplicityRange(null);
    public endNavigability: AssociationNavigability = AssociationNavigability.UNSPECIFIED;

    constructor(points: (Point | PositionalNode)[]) {
        super(points);
    }

    clone(): Association {
        const clone = new Association([]);
        this.basicClone(clone);

        clone.associationName = this.associationName;
        clone.nameOffset = { ...this.nameOffset };
        clone.showOwnership = this.showOwnership;
        clone.reversedOwnership = this.reversedOwnership;

        clone.startName = this.startName;
        clone.startNameOffset = { ...this.startNameOffset };
        clone.startMultiplicity = this.startMultiplicity;
        clone.startNavigability = this.startNavigability;

        clone.endName = this.endName;
        clone.endNameOffset = { ...this.endNameOffset };
        clone.endMultiplicity = this.endMultiplicity;
        clone.endNavigability = this.endNavigability;

        return clone;
    }

    copy(node: Association): void {
        super.copy(node);

        this.associationName = node.associationName;
        this.nameOffset = { x: +node.nameOffset.x, y: +node.nameOffset.y };
        this.showOwnership = node.showOwnership;
        this.reversedOwnership = node.reversedOwnership;

        this.startName = node.startName;
        this.startNameOffset = { x: +node.startNameOffset.x, y: +node.startNameOffset.y };
        this.startMultiplicity = node.startMultiplicity;
        this.startNavigability = node.startNavigability;

        this.endName = node.endName;
        this.endNameOffset = { x: +node.endNameOffset.x, y: +node.endNameOffset.y };
        this.endMultiplicity = node.endMultiplicity;
        this.endNavigability = node.endNavigability;
    }

    validate(): InvalidNodeParameterCause[] {
        const errors = super.validate();

        if (this.associationName !== '' && this.associationName.trim() === '') errors.push({parameter: 'associationName', message: 'error.value.whitespace_only'});
        if (this.startName !== '' && this.startName.trim() === '') errors.push({parameter: 'startName', message: 'error.value.whitespace_only'});
        if (this.endName !== '' && this.endName.trim() === '') errors.push({parameter: 'endName', message: 'error.value.whitespace_only'});

        errors.push(...validatePixelOffset(this.nameOffset, 'nameOffset'));
        errors.push(...validatePixelOffset(this.startNameOffset, 'startNameOffset'));
        errors.push(...validatePixelOffset(this.endNameOffset, 'endNameOffset'));

        if (this.startMultiplicity) {
            const multiErrors = this.startMultiplicity.validate();
            if (multiErrors.length > 0) errors.push({parameter: 'startMultiplicity', message: 'error.multiplicity_range.invalid', context: multiErrors});
        }
        if (this.endMultiplicity) {
            const multiErrors = this.endMultiplicity.validate();
            if (multiErrors.length > 0) errors.push({parameter: 'endMultiplicity', message: 'error.multiplicity_range.invalid', context: multiErrors});
        }

        return errors;
    }

    //region Serializable members

    toSerializable(): object {
        const obj: any = super.toSerializable();
        obj['tag'] = CLASS_TAG;

        obj['associationName'] = this.associationName;
        obj['nameOffset'] = { ...this.nameOffset };
        obj['showOwnership'] = this.showOwnership;
        obj['reversedOwnership'] = this.reversedOwnership;

        obj['startName'] = this.startName;
        obj['startNameOffset'] = { ...this.startNameOffset };
        obj['startMultiplicity'] = this.startMultiplicity;
        obj['startNavigability'] = this.startNavigability;

        obj['endName'] = this.endName;
        obj['endNameOffset'] = { ...this.endNameOffset };
        obj['endMultiplicity'] = this.endMultiplicity;
        obj['endNavigability'] = this.endNavigability;

        return obj;
    }

    static fromSerializable(data: any, previousNodes: Node[]): Association {
        const deserialized = new Association([]);
        deserialized.points = data.points.map((point: any) => ConnectionPoint.fromSerializable(point, deserialized, previousNodes));
        deserialized.parts = data.parts.map((part: any) => ConnectionPart.fromSerializable(part, deserialized));

        deserialized.associationName = data.associationName;
        deserialized.nameOffset = { ...data.nameOffset };
        deserialized.showOwnership = data.showOwnership;
        deserialized.reversedOwnership = data.reversedOwnership;

        deserialized.startName = data.startName;
        deserialized.startNameOffset = { ...data.startNameOffset };
        deserialized.startMultiplicity = MultiplicityRange.fromSerializable(data.startMultiplicity);
        deserialized.startNavigability = data.startNavigability;

        deserialized.endName = data.endName;
        deserialized.endNameOffset = { ...data.endNameOffset };
        deserialized.endMultiplicity = MultiplicityRange.fromSerializable(data.endMultiplicity);
        deserialized.endNavigability = data.endNavigability;

        return deserialized;
    }

    //endregion
}

SerializationRegistryService.register(CLASS_TAG, Association);
