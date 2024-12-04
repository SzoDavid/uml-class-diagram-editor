import {InvalidNodeParameterCause} from './types.ts';

export abstract class Node {
    NODE_TYPE= 'Node';

    isSelected: boolean = false;
    isDragging: boolean = false;

    abstract validate(): InvalidNodeParameterCause[];
    abstract clone(): Node;
    abstract copy(node: Node): void;
    abstract containsDot(x: number, y: number): boolean;

    deselect(): void {
        this.isSelected = false;
    }
}