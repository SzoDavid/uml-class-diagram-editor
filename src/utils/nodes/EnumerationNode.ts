import {Node} from './Node.ts';
import {InvalidNodeParameterCause} from './types.ts';
import {Validator} from '../Validator.ts';

export class EnumerationNode extends Node {
    name: string;
    values: string[];

    constructor(name: string, x: number, y: number, values: string[]=[]) {
        super(x, y);
        this.name = name;
        this.values = values;
    }

    clone(): EnumerationNode {
        const clone = new EnumerationNode(
            this.name,
            this.x,
            this.y,
            this.values
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

        if (this.name === '') errors.push({parameter: 'name', message: 'error.name.required'});
        else if (!Validator.isAlphanumeric(this.name)) errors.push({parameter: 'name', message: 'error.name.alphanumeric'});

        this.values.forEach((value, i) => {
            if (value === '') errors.push({parameter: 'values', message: 'error.value.required', index: i});
            else if (!Validator.isAlphanumeric(value)) errors.push({parameter: 'values', message: 'error.value.alphanumeric', index: i});
        });

        return errors;
    }
}