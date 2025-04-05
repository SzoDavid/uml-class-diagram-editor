import { InvalidNodeParameterCause } from './types.ts';
import { PositionalNode } from './PositionalNode.ts';
import { Serializable } from './Serializable.ts';
import { SerializationRegistryService } from '../../services/SerializationRegistryService.ts';

const CLASS_TAG = 'CommentNode';

export class CommentNode extends PositionalNode implements Serializable {
    text: string;

    constructor(text: string, x: number, y: number) {
        super(x, y);
        this.text = text;
    }

    clone(): CommentNode {
        const clone = new CommentNode(this.text, this.x, this.y);
        clone.isSelected = this.isSelected;
        clone.isDragging = this.isDragging;
        clone.height = this.height;
        clone.width = this.width;

        return clone;
    }

    copy(node: CommentNode): void {
        this.text = node.text;
        this.x = node.x;
        this.y = node.y;
        this.width = node.width;
    }

    validate(): InvalidNodeParameterCause[] {
        const errors: InvalidNodeParameterCause[] = [];

        if (this.text === '')
            errors.push({ parameter: 'text', message: 'error.comment_empty' });

        return errors;
    }

    //region Serializable members

    toSerializable(): object {
        return {
            tag: CLASS_TAG,
            text: this.text,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
        };
    }

    static fromSerializable(data: any): CommentNode {
        const node = new CommentNode(data.text, data.x, data.y);
        node.width = data.width;
        node.height = data.height;
        return node;
    }
    //endregion
}

SerializationRegistryService.register(CLASS_TAG, CommentNode);
