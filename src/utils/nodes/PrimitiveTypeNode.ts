import { InvalidNodeParameterCause } from './types.ts';
import { Validator } from '../Validator.ts';
import { PositionalNode } from './PositionalNode.ts';
import { Serializable } from './Serializable.ts';
import { SerializationRegistryService } from '../../services/SerializationRegistryService.ts';

const CLASS_TAG = 'PrimitiveTypeNode';

export class PrimitiveTypeNode extends PositionalNode implements Serializable {
    name: string;

    constructor(name: string, x: number, y: number) {
        super(x, y);
        this.name = name;
    }

    clone(): PrimitiveTypeNode {
        const clone = new PrimitiveTypeNode(this.name, this.x, this.y);

        clone.isSelected = this.isSelected;
        clone.isDragging = this.isDragging;
        clone.height = this.height;
        clone.width = this.width;

        return clone;
    }

    copy(node: PrimitiveTypeNode): void {
        this.name = node.name;
        this.x = node.x;
        this.y = node.y;
    }

    validate(): InvalidNodeParameterCause[] {
        const errors: InvalidNodeParameterCause[] = [];

        if (this.name === '')
            errors.push({ parameter: 'name', message: 'error.name.required' });
        else if (!Validator.isAlphanumeric(this.name))
            errors.push({
                parameter: 'name',
                message: 'error.name.alphanumeric',
            });

        return errors;
    }

    //region Serializable members

    toSerializable(): object {
        return {
            tag: CLASS_TAG,
            name: this.name,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
        };
    }

    static fromSerializable(data: any): PrimitiveTypeNode {
        const node = new PrimitiveTypeNode(data.name, data.x, data.y);

        node.width = data.width;
        node.height = data.height;

        return node;
    }

    //endregion
}

SerializationRegistryService.register(CLASS_TAG, PrimitiveTypeNode);
