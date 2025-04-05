import { InvalidNodeParameterCause } from './types.ts';
import { Validator } from '../Validator.ts';
import { PositionalNode } from './PositionalNode.ts';
import { Serializable } from './Serializable.ts';
import { SerializationRegistryService } from '../../services/SerializationRegistryService.ts';

const CLASS_TAG = 'EnumerationNode';

export class EnumerationNode extends PositionalNode implements Serializable {
    name: string;
    values: string[];

    constructor(name: string, x: number, y: number, values: string[] = []) {
        super(x, y);
        this.name = name;
        this.values = values;
    }

    clone(): EnumerationNode {
        const clone = new EnumerationNode(
            this.name,
            this.x,
            this.y,
            this.values,
        );

        clone.isSelected = this.isSelected;
        clone.isDragging = this.isDragging;
        clone.height = this.height;
        clone.width = this.width;

        return clone;
    }

    copy(node: EnumerationNode): void {
        this.name = node.name;
        this.x = node.x;
        this.y = node.y;
        this.values = [...node.values];
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

        this.values.forEach((value, i) => {
            if (value === '')
                errors.push({
                    parameter: 'values',
                    message: 'error.value.required',
                    index: i,
                });
            else if (!Validator.isAlphanumeric(value))
                errors.push({
                    parameter: 'values',
                    message: 'error.value.alphanumeric',
                    index: i,
                });
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
            values: [...this.values],
        };
    }

    static fromSerializable(data: any): EnumerationNode {
        const node = new EnumerationNode(
            data.name,
            data.x,
            data.y,
            data.values,
        );

        node.width = data.width;
        node.height = data.height;

        return node;
    }

    //endregion
}

SerializationRegistryService.register(CLASS_TAG, EnumerationNode);
