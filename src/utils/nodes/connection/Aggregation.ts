import {Connection} from './Connection.ts';
import {MultiplicityRange} from '../features/MultiplicityRange.ts';
import {PositionalNode} from '../PositionalNode.ts';
import {Point} from '../../types.ts';
import {SerializationRegistryService} from '../../../services/SerializationRegistryService.ts';
import {ConnectionPart} from './ConnectionPart.ts';
import {Node} from '../Node.ts';
import {ConnectionPoint} from './ConnectionPoint.ts';
import {InvalidNodeParameterCause, PixelOffset} from '../types.ts';
import {validatePixelOffset} from '../../functions.ts';

const CLASS_TAG = 'Aggregation';

export class Aggregation extends Connection {
    public startName: string = '';
    public startNameOffset: PixelOffset = { x: 0, y: 0 };
    public isStartShared: boolean = false;
    public startMultiplicity: MultiplicityRange = new MultiplicityRange(null);

    public endName: string = '';
    public endNameOffset: PixelOffset = { x: 0, y: 0 };
    public isEndShared: boolean = true;
    public endMultiplicity: MultiplicityRange = new MultiplicityRange(null);

    constructor(points: (Point | PositionalNode)[]) {
        super(points);
    }

    clone(): Aggregation {
        const clone = new Aggregation([]);
        this.basicClone(clone);

        clone.startName = this.startName;
        clone.startNameOffset = { ...this.startNameOffset };
        clone.isStartShared = this.isStartShared;
        clone.startMultiplicity = this.startMultiplicity;

        clone.endName = this.endName;
        clone.endNameOffset = { ...this.endNameOffset };
        clone.isEndShared = this.isEndShared;
        clone.endMultiplicity = this.endMultiplicity;

        return clone;
    }

    copy(node: Aggregation): void {
        super.copy(node);

        this.startName = node.startName;
        this.startNameOffset = { x: +node.startNameOffset.x, y: +node.startNameOffset.y };
        this.isStartShared = node.isStartShared;
        this.startMultiplicity = node.startMultiplicity;

        this.endName = node.endName;
        this.endNameOffset = { x: +node.endNameOffset.x, y: +node.endNameOffset.y };
        this.isEndShared = node.isEndShared;
        this.endMultiplicity = node.endMultiplicity;
    }

    validate(): InvalidNodeParameterCause[] {
        const errors = super.validate();

        if (this.startName !== '' && this.startName.trim() === '') errors.push({parameter: 'startName', message: 'error.value.whitespace_only'});
        if (this.endName !== '' && this.endName.trim() === '') errors.push({parameter: 'endName', message: 'error.value.whitespace_only'});

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

        obj['startName'] = this.startName;
        obj['startNameOffset'] = { ...this.startNameOffset };
        obj['isStartShared'] = this.isStartShared;
        obj['startMultiplicity'] = this.startMultiplicity;

        obj['endName'] = this.endName;
        obj['endNameOffset'] = { ...this.endNameOffset };
        obj['isEndShared'] = this.isEndShared;
        obj['endMultiplicity'] = this.endMultiplicity;

        return obj;
    }

    static fromSerializable(data: any, previousNodes: Node[]): Aggregation {
        const deserialized = new Aggregation([]);
        deserialized.points = data.points.map((point: any) => ConnectionPoint.fromSerializable(point, deserialized, previousNodes));
        deserialized.parts = data.parts.map((part: any) => ConnectionPart.fromSerializable(part, deserialized));

        deserialized.startName = data.startName;
        deserialized.startNameOffset = { ...data.startNameOffset };
        deserialized.isStartShared = data.isStartShared;
        deserialized.startMultiplicity = MultiplicityRange.fromSerializable(data.startMultiplicity);

        deserialized.endName = data.endName;
        deserialized.endNameOffset = { ...data.endNameOffset };
        deserialized.isEndShared = data.isEndShared;
        deserialized.endMultiplicity = MultiplicityRange.fromSerializable(data.endMultiplicity);

        return deserialized;
    }

    //endregion
}

SerializationRegistryService.register(CLASS_TAG, Aggregation);
