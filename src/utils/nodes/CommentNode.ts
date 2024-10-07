import {Node} from './Node.ts';
import {InvalidNodeParameterCause} from './types.ts';

export class CommentNode extends Node {
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

        if (this.text === '') errors.push({parameter: 'text', message: 'error.comment_empty'});

        return errors;
    }
}