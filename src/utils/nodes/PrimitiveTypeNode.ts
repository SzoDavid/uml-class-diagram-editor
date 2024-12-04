import {InvalidNodeParameterCause} from './types.ts';
import {Validator} from '../Validator.ts';
import {PositionalNode} from './PositionalNode.ts';

export class PrimitiveTypeNode extends PositionalNode {
    NODE_TYPE= 'PrimitiveType';

    name: string;

    constructor(name: string, x: number, y: number) {
        super(x, y);
        this.name = name;
    }

    clone(): PrimitiveTypeNode {
        const clone = new PrimitiveTypeNode(
            this.name,
            this.x,
            this.y,
        );

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

        if (this.name === '') errors.push({parameter: 'name', message: 'error.name.required'});
        else if (!Validator.isAlphanumeric(this.name)) errors.push({parameter: 'name', message: 'error.name.alphanumeric'});

        return errors;
    }
}