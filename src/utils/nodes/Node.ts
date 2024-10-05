import {InvalidNodeParameterCause} from './types.ts';

export abstract class Node {
    isSelected: boolean = false;
    isDragging: boolean = false;
    height: number = 0;
    width: number = 0;

    x: number;
    y: number;

    protected constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    abstract validate(): InvalidNodeParameterCause[];
    abstract clone(): Node;
    abstract copy(node: Node): void;
}