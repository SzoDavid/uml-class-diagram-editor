import {InvalidNodeParameterCause} from './types.ts';

export abstract class ANode {
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

    validate(): InvalidNodeParameterCause[] {
        return [];
    }
    
    abstract clone(): ANode;
    abstract copy(node: ANode): void;
}